import prisma from "@/lib/prisma";
import content from "@/data/static/content";

const MEDIA_SELECT = {
  id: true,
  url: true,
  label: true,
  altText: true,
  width: true,
  height: true,
  mimeType: true,
};

const DEFAULT_HERO = {
  eyebrow: "Karachi Water & Sewerage Corporation",
  eyebrowUr: "کراچی واٹر اینڈ سیوریج کارپوریشن",
  title: "Committed to Deliver",
  titleUr: "پہنچانے کے لیے پرعزم",
  subtitle: "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
  subtitleUr: "کراچی کے لیے صاف اور محفوظ پانی کی فراہمی اور موثر سیوریج خدمات کو یقینی بنانا۔",
  ctaLabel: "Learn About KW&SC",
  ctaLabelUr: "KW&SC کے بارے میں جانیں",
  ctaHref: "/aboutus",
  backgroundImage: "/karachicharminar.gif",
};

function getDefaultHero() {
  return DEFAULT_HERO;
}

async function fetchHomeSections() {
  try {
    const page = await prisma.page.findUnique({
      where: { slug: "home" },
      include: { sections: { orderBy: { order: "asc" } } },
    });

    if (!page) return [];
    return page.sections;
  } catch (error) {
    console.warn("Failed to fetch home sections:", error);
    return [];
  }
}

function extractHeroData(sections) {
  const heroSection = sections.find((s) => s.type === "HERO");
  if (!heroSection || !heroSection.content) return getDefaultHero();

  const c = heroSection.content;
  const defaults = getDefaultHero();
  return {
    eyebrow: c.eyebrow || defaults.eyebrow,
    eyebrowUr: c.eyebrowUr || defaults.eyebrowUr,
    title: c.title || defaults.title,
    titleUr: c.titleUr || defaults.titleUr,
    subtitle: c.subtitle || defaults.subtitle,
    subtitleUr: c.subtitleUr || defaults.subtitleUr,
    ctaLabel: c.ctaLabel || defaults.ctaLabel,
    ctaLabelUr: c.ctaLabelUr || defaults.ctaLabelUr,
    ctaHref: c.ctaHref || defaults.ctaHref,
    backgroundImage: c.backgroundImage || defaults.backgroundImage,
  };
}

function mapMedia(media) {
  if (!media) return null;
  return {
    id: media.id,
    url: media.url,
    label: media.label,
    altText: media.altText,
    width: media.width,
    height: media.height,
    mimeType: media.mimeType,
  };
}

function fallbackProjects() {
  const projects = content.projects || [];
  return projects.map((project, index) => ({
    id: project.code || `project-${index}`,
    title: project.title,
    titleUr: project.titleUr, // Assuming content.js might have it or undefined
    summary: project.scope,
    summaryUr: project.scopeUr,
    status: project.status || "PLANNED",
    category: project.category || null,
    progress: project.progress ?? null,
    order: index,
    linkUrl: project.linkUrl || null,
    media: project.imageUrl
      ? {
        id: null,
        url: project.imageUrl,
        label: project.title,
        altText: project.title,
        width: null,
        height: null,
      }
      : null,
  }));
}

function fallbackLeadershipMembers() {
  const team = content.leadership?.managementTeam || [];
  return team.map((member, index) => ({
    id: member.name || `leader-${index}`,
    name: member.name,
    designation: member.role,
    designationUr: member.roleUr,
    priority: index,
    bio: member.description || "",
    bioUr: member.descriptionUr || "",
    media: member.image
      ? {
        id: null,
        url: member.image,
        label: member.name,
        altText: member.name,
        width: null,
        height: null,
      }
      : null,
    socials: null,
  }));
}

function fallbackAchievements() {
  return (content.achievements || []).map((achievement, index) => ({
    id: achievement.title || `achievement-${index}`,
    title: achievement.title,
    titleUr: achievement.titleUr,
    summary: achievement.description,
    summaryUr: achievement.descriptionUr,
    metric: achievement.year,
    icon: achievement.icon,
  }));
}

function fallbackCounters() {
  return (content.counters || []).map((counter, index) => ({
    id: counter.title || `counter-${index}`,
    label: counter.title,
    labelUr: counter.titleUr,
    value: counter.value,
    suffix: counter.suffix || "",
  }));
}

function fallbackWorkflow() {
  return (content.workflow || []).map((step, index) => ({
    id: step.id || String(index + 1).padStart(2, "0"),
    title: step.title,
    titleUr: step.titleUr,
    summary: step.description,
    summaryUr: step.descriptionUr,
    theme: step.theme || null,
    order: index,
  }));
}

function fallbackMediaGallery() {
  return (content.mediaGallery || []).map((item, index) => ({
    id: `gallery-item-${index}`,
    title: item.title,
    titleUr: item.titleUr,
    caption: item.caption,
    captionUr: item.captionUr,
    imageUrl: item.imageUrl,
    mimeType: item.mimeType,
    albumSlug: "highlights",
  }));
}

function fallbackFaqs() {
  return (content.faqs || []).map((faq, index) => ({
    id: `faq-${index}`,
    question: faq.question,
    questionUr: faq.questionUr,
    answer: faq.answer,
    answerUr: faq.answerUr,
    category: faq.category,
  }));
}

function fallbackWaterToday() {
  const common = {
    title: "Water Today – Daily Water Supply Status",
    titleUr: "آج کا پانی – روزانہ پانی کی فراہمی کی حیثیت",
    summary: "Today's water distribution across Karachi remains stable, with major pumping stations operating at optimal capacity.",
    summaryUr: "کراچی میں آج کی پانی کی تقسیم مستحکم رہی، بڑے پمپنگ اسٹیشنز بہترین صلاحیت سے کام کر رہے ہیں۔",
  };

  return [
    {
      id: "fallback-update",
      title: common.title,
      titleUr: common.titleUr,
      summary: common.summary,
      summaryUr: common.summaryUr,
      status: "PUBLISHED",
      publishedAt: new Date().toISOString(),
      media: { url: "/downtownkarachi.gif" },
    }
  ];
}

export async function buildHomePayload() {
  let projectHighlights = [];
  let leadershipMembers = [];
  let achievements = [];
  let counterStats = [];
  let workflowSteps = [];
  let mediaItems = [];
  let faqsData = [];
  let waterTodayUpdates = [];
  let homeSections = [];

  try {
    [projectHighlights, leadershipMembers, achievements, counterStats, workflowSteps, mediaItems, faqsData, waterTodayUpdates, homeSections] = await Promise.all([
      prisma.projectHighlight.findMany({
        include: { media: { select: MEDIA_SELECT } },
        orderBy: { order: "asc" },
      }),
      prisma.leadershipMember.findMany({
        include: { portrait: { select: MEDIA_SELECT } },
        orderBy: [{ priority: "asc" }, { name: "asc" }],
      }),
      prisma.achievement.findMany({
        where: {
          iconKey: { not: null }, 
        },
        orderBy: { order: "asc" },
      }),
      prisma.counterStat.findMany({ orderBy: { order: "asc" } }),
      prisma.workflowStep.findMany({ orderBy: { order: "asc" } }),
      prisma.mediaItem.findMany({
        include: {
          media: { select: MEDIA_SELECT },
          album: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { order: "asc" },
        take: 16,
      }),
      prisma.faq.findMany({
        include: { category: true },
        orderBy: { order: "asc" },
        take: 10,
      }),
      prisma.waterTodayUpdate.findMany({
        where: { status: "PUBLISHED" },
        include: { media: { select: MEDIA_SELECT } },
        orderBy: { publishedAt: "desc" },
        take: 1,
      }),
      fetchHomeSections(),
    ]);
  } catch (error) {
    console.warn("⚠️ Database unreachable during buildHomePayload. Using fallback data.", error.message);
  }

  const heroData = extractHeroData(homeSections);

  const projects = projectHighlights.length
    ? projectHighlights.map((project) => ({
      id: project.id,
      title: project.title,
      titleUr: project.titleUr,
      summary: project.summary,
      summaryUr: project.summaryUr,
      status: project.status || "PLANNED",
      category: project.category || null,
      progress: project.progress ?? null,
      order: project.order,
      linkUrl: project.linkUrl,
      media: mapMedia(project.media),
    }))
    : fallbackProjects();

  const leadership = leadershipMembers.length
    ? leadershipMembers.map((member) => ({
      id: member.id,
      name: member.name,
      designation: member.designation,
      designationUr: member.designationUr,
      bio: member.bio,
      bioUr: member.bioUr,
      priority: member.priority,
      media: mapMedia(member.portrait),
      socials: member.socials,
    }))
    : fallbackLeadershipMembers();

  const achievementsPayload = achievements.length
    ? achievements.map((entry) => ({
      id: entry.id,
      title: entry.title,
      titleUr: entry.titleUr,
      summary: entry.summary,
      summaryUr: entry.summaryUr,
      metric: entry.metric,
      icon: entry.iconKey,
    }))
    : fallbackAchievements();

  const counters = counterStats.length
    ? counterStats.map((stat) => ({
      id: stat.id,
      label: stat.label,
      labelUr: stat.labelUr,
      value: stat.value,
      suffix: stat.suffix || "",
    }))
    : fallbackCounters();

  const workflow = workflowSteps.length
    ? workflowSteps.map((step, index) => ({
      id: String(index + 1).padStart(2, "0"),
      originalId: step.id,
      title: step.title,
      titleUr: step.titleUr,
      summary: step.summary,
      summaryUr: step.summaryUr,
      theme: step.theme || null,
      order: step.order,
    }))
    : fallbackWorkflow();

  const mediaCarousel = mediaItems.length
    ? mediaItems.map((item) => ({
      id: item.id,
      title: item.media?.label || item.album?.title || "Media item",
      // titleUr: titleUr?, media logic complicated
      caption: item.caption,
      captionUr: item.captionUr,
      credit: item.credit,
      imageUrl: item.media?.url,
      mimeType: item.media?.mimeType,
      albumSlug: item.album?.slug,
    }))
    : fallbackMediaGallery();

  const faqs = faqsData.length
    ? faqsData.map((faq) => ({
      id: faq.id,
      question: faq.question,
      questionUr: faq.questionUr,
      answer: faq.answer,
      answerUr: faq.answerUr,
      category: faq.category?.title || "General",
      categoryUr: faq.category?.titleUr,
    }))
    : fallbackFaqs();

  const waterToday = waterTodayUpdates.length
    ? waterTodayUpdates.map((update) => ({
      id: update.id,
      title: update.title,
      titleUr: update.titleUr,
      summary: update.summary,
      summaryUr: update.summaryUr,
      status: update.status,
      publishedAt: update.publishedAt,
      media: mapMedia(update.media) || { url: "/downtownkarachi.gif" },
    }))
    : fallbackWaterToday();

  return {
    hero: heroData,
    sections: homeSections,
    projects,
    leadership,
    leadershipInsights: content.leadership?.insights || [],
    achievements: achievementsPayload,
    counters,
    workflow,
    mediaCarousel,
    faqs,
    waterToday,
  };
}
