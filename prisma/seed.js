/* eslint-disable no-console */
const crypto = require("crypto");
const { hash: argonHash } = require("@node-rs/argon2");
const {
  PrismaClient,
  RoleType,
  TenderStatus,
  PublicationStatus,
  RequirementType,
  SnapshotModule,
} = require("@prisma/client");
const path = require("path");
const content = require("../data/static/content");

const prisma = new PrismaClient();
const PUBLIC_DIR = path.join(__dirname, "..", "public");
let mediaMetadataHelperPromise;
let roleCatalogModulePromise;

function loadMediaMetadataHelper() {
  if (!mediaMetadataHelperPromise) {
    mediaMetadataHelperPromise = import("../shared/media-metadata.js");
  }
  return mediaMetadataHelperPromise;
}

function loadRoleCatalog() {
  if (!roleCatalogModulePromise) {
    roleCatalogModulePromise = import("../lib/auth/roleCatalog.js");
  }
  return roleCatalogModulePromise;
}

function isLocalAsset(url) {
  return typeof url === "string" && url.startsWith("/");
}

async function inferLocalMetadata(url) {
  if (!isLocalAsset(url)) return {};
  const relativePath = url.replace(/^\/+/, "");
  const absolutePath = path.join(PUBLIC_DIR, relativePath);
  try {
    const { describeFile } = await loadMediaMetadataHelper();
    const meta = await describeFile(absolutePath);
    return {
      mimeType: meta.mimeType || null,
      fileSize: meta.fileSize || null,
      width: meta.width || null,
      height: meta.height || null,
      checksum: meta.checksum || null,
    };
  } catch (error) {
    console.warn(`⚠️ Unable to read metadata for ${url}: ${error.message}`);
    return {};
  }
}

async function createMediaAssetRecord({ url, label, category, altText }) {
  const metadata = await inferLocalMetadata(url);
  return prisma.mediaAsset.upsert({
    where: { url },
    update: {
      label,
      category,
      altText: altText ?? null,
    },
    create: {
      url,
      label,
      category,
      altText: altText ?? null,
      mimeType: metadata.mimeType || null,
      fileSize: metadata.fileSize || null,
      width: metadata.width || null,
      height: metadata.height || null,
      checksum: metadata.checksum || null,
    },
  });
}

const slugify = (value = "") =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

const toDate = (value) => {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const argonOptions = {
  memoryCost: 19456,
  timeCost: 2,
  outputLen: 32,
  parallelism: 1,
  saltLength: 16,
};

async function resetTables() {
  await prisma.$transaction([
    prisma.adminSession.deleteMany(),
    prisma.newsTagMap.deleteMany(),
    prisma.tenderAttachment.deleteMany(),
    prisma.serviceDetail.deleteMany(),
    prisma.serviceCard.deleteMany(),
    prisma.downloadResource.deleteMany(),
    prisma.serviceCategory.deleteMany(),
    prisma.tender.deleteMany(),
    prisma.tenderCategory.deleteMany(),
    prisma.careerRequirement.deleteMany(),
    prisma.careerOpening.deleteMany(),
    prisma.careerProgram.deleteMany(),
    prisma.careerBenefit.deleteMany(),
    prisma.contactChannel.deleteMany(),
    prisma.officeLocation.deleteMany(),
    prisma.newsArticle.deleteMany(),
    prisma.newsCategory.deleteMany(),
    prisma.newsTag.deleteMany(),
    prisma.mediaItem.deleteMany(),
    prisma.mediaAlbum.deleteMany(),
    prisma.leadershipMember.deleteMany(),
    prisma.faq.deleteMany(),
    prisma.faqCategory.deleteMany(),
    prisma.achievement.deleteMany(),
    prisma.projectHighlight.deleteMany(),
    prisma.counterStat.deleteMany(),
    prisma.workflowStep.deleteMany(),
    prisma.rtiDocument.deleteMany(),
    prisma.socialLink.deleteMany(),
    prisma.mediaAsset.deleteMany(),
    prisma.cachedSnapshot.deleteMany(),
    prisma.auditLog.deleteMany(),
    prisma.session.deleteMany(),
    prisma.totpSecret.deleteMany(),
    prisma.passwordHistory.deleteMany(),
    prisma.userRole.deleteMany(),
    prisma.role.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

async function seedAuth() {
  const { ROLE_CATALOG } = await loadRoleCatalog();
  const roles = ROLE_CATALOG.map((role) => {
    const enumValue = RoleType[role.type];
    if (!enumValue) {
      throw new Error(`RoleType ${role.type} is not defined in Prisma schema`);
    }
    return {
      type: enumValue,
      label: role.label,
    };
  });

  const roleMap = {};
  for (const role of roles) {
    const record = await prisma.role.create({ data: role });
    roleMap[role.type] = record;
  }

  const adminEmail = "admin@kwsc.local";
  const tempPassword = "ChangeMeNow!123";
  const hashedPassword = await argonHash(tempPassword, argonOptions);

  const admin = await prisma.user.create({
    data: {
      name: "KWSC Administrator",
      email: adminEmail,
      hashedPassword,
      adminNotes: "Default seeded admin account. Update the password immediately after first login.",
    },
  });

  await prisma.passwordHistory.create({
    data: {
      userId: admin.id,
      hash: hashedPassword,
    },
  });

  await prisma.userRole.create({
    data: {
      userId: admin.id,
      roleId: roleMap[RoleType.ADMIN].id,
    },
  });

  console.log(`👤 Seeded admin user ${adminEmail}`);
  console.log(`   Temporary password: ${tempPassword}`);
}

async function seedServices() {
  const categories = [
    { title: "Water Supply Services", slug: "water-supply-services", summary: "Bulk abstraction, treatment, and distribution." },
    { title: "Sewerage Services", slug: "sewerage-services", summary: "Collection, treatment, and disposal." },
    { title: "Revenue & Customer Services", slug: "revenue-customer-services", summary: "Billing, collections, and customer care." },
  ];

  const categoryMap = {};
  for (const [index, category] of categories.entries()) {
    const record = await prisma.serviceCategory.create({
      data: {
        ...category,
        order: index,
      },
    });
    categoryMap[category.slug] = record;
  }

  const resolveCategoryId = (title) => {
    if (title.toLowerCase().includes("water")) return categoryMap["water-supply-services"].id;
    if (title.toLowerCase().includes("sewerage")) return categoryMap["sewerage-services"].id;
    if (title.toLowerCase().includes("billing") || title.toLowerCase().includes("customer")) return categoryMap["revenue-customer-services"].id;
    return categoryMap["water-supply-services"].id;
  };

  const cardMap = {};
  for (const [index, card] of content.services.cards.entries()) {
    const record = await prisma.serviceCard.create({
      data: {
        title: card.title,
        summary: card.description,
        iconKey: card.iconKey,
        gradientClass: card.gradient,
        order: index,
        categoryId: resolveCategoryId(card.title),
      },
    });
    cardMap[card.title] = record;
  }

  for (const [index, section] of content.services.sections.entries()) {
    const card = cardMap[section.heading] || Object.values(cardMap)[0];
    await prisma.serviceDetail.create({
      data: {
        serviceCardId: card.id,
        heading: section.heading,
        body: section.body,
        bulletPoints: section.bulletPoints || [],
        order: index,
      },
    });

    if (section.resources && section.resources.length) {
      for (const resource of section.resources) {
        const media = await createMediaAssetRecord({
          url: resource.url,
          label: resource.title,
          category: "resource",
        });

        await prisma.downloadResource.create({
          data: {
            title: resource.title,
            description: resource.description,
            externalUrl: resource.url,
            serviceCategoryId: categoryMap["revenue-customer-services"].id,
            mediaId: media.id,
          },
        });
      }
    }
  }
}

async function seedTenders() {
  const categories = [
    { label: "Open", slug: "open" },
    { label: "Closed", slug: "closed" },
    { label: "Cancelled", slug: "cancelled" },
  ];

  const categoryMap = {};
  for (const category of categories) {
    categoryMap[category.slug] = await prisma.tenderCategory.create({ data: category });
  }

  const createTender = async (entry, status) => {
    await prisma.tender.create({
      data: {
        tenderNumber: entry.tenderNumber,
        title: entry.title,
        summary: entry.description,
        status,
        publishedAt: toDate(entry.date),
        closingAt: status === TenderStatus.OPEN ? toDate(entry.date) : null,
        categoryId:
          status === TenderStatus.OPEN
            ? categoryMap.open.id
            : status === TenderStatus.CLOSED
            ? categoryMap.closed.id
            : categoryMap.cancelled.id,
      },
    });
  };

  for (const tender of content.tenders.open) {
    await createTender(tender, TenderStatus.OPEN);
  }
  for (const tender of content.tenders.closed) {
    await createTender(tender, TenderStatus.CLOSED);
  }
  for (const tender of content.tenders.cancelled) {
    await createTender(tender, TenderStatus.CANCELLED);
  }
}

async function seedCareers() {
  for (const program of content.careers.programs) {
    await prisma.careerProgram.create({
      data: {
        title: program.title,
        slug: slugify(program.title),
        heroTitle: program.title,
        heroBody: program.description,
        eligibility: program.benefits,
      },
    });
  }

  const uniqueBenefits = Array.from(
    new Set(content.careers.programs.flatMap((program) => program.benefits))
  );
  for (const [index, benefit] of uniqueBenefits.entries()) {
    await prisma.careerBenefit.create({
      data: {
        title: benefit,
        order: index,
      },
    });
  }

  for (const [index, opening] of content.careers.openings.entries()) {
    const slug = slugify(`${opening.title}-${opening.location}-${index}`);
    await prisma.careerOpening.create({
      data: {
        title: opening.title,
        slug,
        department: opening.department,
        location: opening.location,
        jobType: opening.type,
        summary: `${opening.title} role at ${opening.department}`,
        status: PublicationStatus.PUBLISHED,
        publishAt: new Date(),
        requirements: {
          create: [
            {
              type: RequirementType.QUALIFICATION,
              content: opening.experience,
            },
            {
              type: RequirementType.RESPONSIBILITY,
              content: "Deliver on KW&SC service excellence commitments.",
            },
          ],
        },
      },
    });
  }

}

async function seedNews() {
  const categoryMap = {};
  for (const article of content.news) {
    const slug = slugify(article.category);
    if (!categoryMap[slug]) {
      categoryMap[slug] = await prisma.newsCategory.create({
        data: {
          title: article.category,
          slug,
        },
      });
    }

    const media = await createMediaAssetRecord({
      url: article.imageUrl,
      label: article.title,
      category: "news",
    });

    await prisma.newsArticle.create({
      data: {
        title: article.title,
        slug: slugify(article.title),
        summary: article.summary,
        content: { body: article.summary },
        status: PublicationStatus.PUBLISHED,
        publishedAt: toDate(article.date) || new Date(),
        categoryId: categoryMap[slug].id,
        heroMediaId: media.id,
      },
    });
  }
}

async function seedContactData() {
  const channels = content.contact?.channels?.length
    ? content.contact.channels
    : content.careers?.contacts || [];

  if (!channels.length) {
    console.warn("⚠️ No contact channels found in static content.");
  }

  for (const channel of channels) {
    await prisma.contactChannel.create({
      data: {
        label: channel.label,
        description: channel.description || channel.label,
        email: channel.email || null,
        phone: channel.phone || null,
        availability: channel.availability || null,
      },
    });
  }

  const offices = content.contact?.offices || [];
  if (!offices.length) {
    console.warn("⚠️ No office locations found in static content.");
    return;
  }

  for (const office of offices) {
    await prisma.officeLocation.create({
      data: {
        label: office.label,
        address: office.address,
        latitude: office.latitude ?? null,
        longitude: office.longitude ?? null,
        phone: office.phone || null,
        email: office.email || null,
        hours: office.hours || null,
      },
    });
  }
}

async function seedRtiDocuments() {
  const documents = content.rtiDocuments || [];

  for (const [index, document] of documents.entries()) {
    await prisma.rtiDocument.create({
      data: {
        title: document.title,
        summary: document.summary,
        docType: document.docType,
        externalUrl: document.externalUrl,
        order: index,
      },
    });
  }
}

async function seedSocialLinks() {
  const links = content.socialLinks || [];
  if (!links.length) {
    console.warn("⚠️ No social links found in static content.");
  }

  for (const [index, link] of links.entries()) {
    await prisma.socialLink.create({
      data: {
        title: link.title,
        platform: link.platform,
        url: link.url,
        order: index,
        isActive: link.isActive ?? true,
      },
    });
  }
}

async function seedFaqs() {
  const grouped = content.faqs.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {});

  for (const [index, [category, faqs]] of Object.entries(grouped).entries()) {
    const record = await prisma.faqCategory.create({
      data: {
        title: category,
        order: index,
      },
    });

    for (const [faqIndex, faq] of faqs.entries()) {
      await prisma.faq.create({
        data: {
          categoryId: record.id,
          question: faq.question,
          answer: faq.answer,
          order: faqIndex,
        },
      });
    }
  }
}

async function seedLeadership() {
  for (const member of content.leadership.managementTeam) {
    const media = await createMediaAssetRecord({
      url: member.image,
      label: member.name,
      category: "leadership",
    });

    await prisma.leadershipMember.create({
      data: {
        name: member.name,
        designation: member.role,
        priority: 0,
        mediaId: media.id,
      },
    });
  }

  for (const [index, insight] of content.leadership.insights.entries()) {
    await prisma.achievement.create({
      data: {
        title: insight.title,
        summary: insight.description,
        metric: "",
        order: index,
      },
    });
  }
}

async function seedAchievementsProjects() {
  for (const [index, achievement] of content.achievements.entries()) {
    await prisma.achievement.create({
      data: {
        title: achievement.title,
        summary: achievement.description,
        metric: achievement.year,
        iconKey: achievement.icon,
        order: index,
      },
    });
  }

  for (const [index, project] of content.projects.entries()) {
    const media = await createMediaAssetRecord({
      url: project.imageUrl,
      label: project.title,
      category: "project",
    });

    await prisma.projectHighlight.create({
      data: {
        title: project.title,
        summary: project.scope,
        status: project.status,
        order: index,
        mediaId: media.id,
      },
    });
  }
}

async function seedStatsAndWorkflow() {
  for (const [index, counter] of content.counters.entries()) {
    await prisma.counterStat.create({
      data: {
        label: counter.title,
        value: Math.round(counter.value * (counter.suffix === "M" ? 1_000_000 : 1)),
        suffix: counter.suffix || "",
        order: index,
      },
    });
  }

  for (const [index, step] of content.workflow.entries()) {
    await prisma.workflowStep.create({
      data: {
        title: step.title,
        summary: step.description,
        order: index,
      },
    });
  }
}

async function seedMediaGallery() {
  const album = await prisma.mediaAlbum.create({
    data: {
      title: "Leadership Carousel",
      slug: "leadership-carousel",
      description: "Key leaders featured in the media gallery",
    },
  });

  for (const [index, leader] of content.mediaLeaders.entries()) {
    const media = await createMediaAssetRecord({
      url: leader.imageUrl,
      label: leader.name,
      category: "media-gallery",
    });

    await prisma.mediaItem.create({
      data: {
        albumId: album.id,
        mediaId: media.id,
        caption: leader.name,
        credit: leader.title,
        order: index,
      },
    });
  }
}

async function seedSnapshots() {
  const modules = [
    SnapshotModule.HOME,
    SnapshotModule.SERVICES,
    SnapshotModule.TENDERS,
    SnapshotModule.CAREERS,
    SnapshotModule.NEWS,
    SnapshotModule.MEDIA,
    SnapshotModule.FAQ,
    SnapshotModule.CONTACT,
  ];

  for (const module of modules) {
    await prisma.cachedSnapshot.create({
      data: {
        module,
        payload: { seeded: true },
        checksum: crypto.randomBytes(8).toString("hex"),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
    });
  }
}

async function main() {
  console.log("🧹 Resetting tables...");
  await resetTables();

  console.log("🔐 Seeding auth & RBAC...");
  await seedAuth();

  console.log("💧 Seeding services...");
  await seedServices();

  console.log("📑 Seeding tenders...");
  await seedTenders();

  console.log("👥 Seeding careers...");
  await seedCareers();

  console.log("📬 Seeding contact data...");
  await seedContactData();

  console.log("📰 Seeding news...");
  await seedNews();

  console.log("❓ Seeding FAQs...");
  await seedFaqs();

  console.log("📄 Seeding Right to Information...");
  await seedRtiDocuments();

  console.log("🧑‍💼 Seeding leadership & achievements...");
  await seedLeadership();

  console.log("🏗️  Seeding achievements & projects...");
  await seedAchievementsProjects();

  console.log("📊 Seeding stats & workflow...");
  await seedStatsAndWorkflow();

  console.log("🔗 Seeding social links...");
  await seedSocialLinks();

  console.log("🖼️  Seeding media gallery...");
  await seedMediaGallery();

  console.log("🧾 Seeding cached snapshots...");
  await seedSnapshots();

  console.log("✅ Prisma seed completed successfully.");
}

main()
  .catch((error) => {
    console.error("❌ Seed failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
