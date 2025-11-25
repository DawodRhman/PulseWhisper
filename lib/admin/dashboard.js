import prisma from "@/lib/prisma";

function serializeDate(value) {
  return value ? value.toISOString() : null;
}

export async function getAdminDashboardStats() {
  const [
    serviceCategories,
    tenderCount,
    newsArticles,
    careerOpenings,
    leadershipMembers,
    socialLinks,
    projects,
    faqCount,
    mediaAssets,
    operatorCount,
    latestTender,
    latestNews,
    latestSnapshot,
  ] = await Promise.all([
    prisma.serviceCategory.count(),
    prisma.tender.count(),
    prisma.newsArticle.count(),
    prisma.careerOpening.count(),
    prisma.leadershipMember.count(),
    prisma.socialLink.count(),
    prisma.projectHighlight.count(),
    prisma.faq.count(),
    prisma.mediaAsset.count(),
    prisma.user.count(),
    prisma.tender.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { title: true, status: true, updatedAt: true },
    }),
    prisma.newsArticle.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { title: true, publishedAt: true },
    }),
    prisma.cachedSnapshot.findFirst({
      orderBy: { updatedAt: "desc" },
      select: { module: true, updatedAt: true },
    }),
  ]);

  return {
    metrics: [
      { label: "Services live", value: serviceCategories },
      { label: "Active tenders", value: tenderCount },
      { label: "News stories", value: newsArticles },
      { label: "Open roles", value: careerOpenings },
    ],
    secondaryMetrics: [
      { label: "Leadership bios", value: leadershipMembers },
      { label: "Projects showcased", value: projects },
      { label: "FAQ entries", value: faqCount },
      { label: "Social links", value: socialLinks },
      { label: "Media assets", value: mediaAssets },
      { label: "Operators", value: operatorCount },
    ],
    highlights: {
      latestTender: latestTender
        ? {
            title: latestTender.title,
            status: latestTender.status,
            updatedAt: serializeDate(latestTender.updatedAt),
          }
        : null,
      latestNews: latestNews
        ? {
            title: latestNews.title,
            publishedAt: serializeDate(latestNews.publishedAt),
          }
        : null,
      cacheSnapshot: latestSnapshot
        ? {
            module: latestSnapshot.module,
            updatedAt: serializeDate(latestSnapshot.updatedAt),
          }
        : null,
    },
  };
}
