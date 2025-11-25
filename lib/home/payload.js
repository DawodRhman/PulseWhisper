import prisma from "@/lib/prisma";
import content from "@/data/static/content";

const MEDIA_SELECT = {
  id: true,
  url: true,
  label: true,
  altText: true,
  width: true,
  height: true,
};

const DEFAULT_HERO = {
  eyebrow: "Karachi Water & Sewerage Corporation",
  title: "Committed to Deliver",
  subtitle: "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
  ctaLabel: "Learn About KW&SC",
  ctaHref: "/aboutus",
  backgroundImage: "/karachicharminar.gif",
};

function mapMedia(media) {
  if (!media) return null;
  return {
    id: media.id,
    url: media.url,
    label: media.label,
    altText: media.altText,
    width: media.width,
    height: media.height,
  };
}

function fallbackProjects() {
  const projects = content.projects || [];
  return projects.map((project, index) => ({
    id: project.code || `project-${index}`,
    title: project.title,
    summary: project.scope,
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
    priority: index,
    bio: member.description || "",
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
    summary: achievement.description,
    metric: achievement.year,
    icon: achievement.icon,
  }));
}

function fallbackCounters() {
  return (content.counters || []).map((counter, index) => ({
    id: counter.title || `counter-${index}`,
    label: counter.title,
    value: counter.value,
    suffix: counter.suffix || "",
  }));
}

function fallbackWorkflow() {
  return (content.workflow || []).map((step, index) => ({
    id: step.id || String(index + 1).padStart(2, "0"),
    title: step.title,
    summary: step.description,
    theme: step.theme || null,
    order: index,
  }));
}

function fallbackMediaLeaders() {
  return (content.mediaLeaders || []).map((leader, index) => ({
    id: leader.name || `media-leader-${index}`,
    name: leader.name,
    title: leader.title,
    imageUrl: leader.imageUrl,
  }));
}

export async function buildHomePayload() {
  const [projectHighlights, leadershipMembers, achievements, counterStats, workflowSteps, mediaItems] = await Promise.all([
    prisma.projectHighlight.findMany({
      include: { media: { select: MEDIA_SELECT } },
      orderBy: { order: "asc" },
    }),
    prisma.leadershipMember.findMany({
      include: { portrait: { select: MEDIA_SELECT } },
      orderBy: [{ priority: "asc" }, { name: "asc" }],
    }),
    prisma.achievement.findMany({ orderBy: { order: "asc" } }),
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
  ]);

  const projects = projectHighlights.length
    ? projectHighlights.map((project) => ({
        id: project.id,
        title: project.title,
        summary: project.summary,
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
        bio: member.bio,
        priority: member.priority,
        media: mapMedia(member.portrait),
        socials: member.socials,
      }))
    : fallbackLeadershipMembers();

  const achievementsPayload = achievements.length
    ? achievements.map((entry) => ({
        id: entry.id,
        title: entry.title,
        summary: entry.summary,
        metric: entry.metric,
        icon: entry.iconKey,
      }))
    : fallbackAchievements();

  const counters = counterStats.length
    ? counterStats.map((stat) => ({
        id: stat.id,
        label: stat.label,
        value: stat.value,
        suffix: stat.suffix || "",
      }))
    : fallbackCounters();

  const workflow = workflowSteps.length
    ? workflowSteps.map((step) => ({
        id: step.id,
        title: step.title,
        summary: step.summary,
        theme: step.theme || null,
        order: step.order,
      }))
    : fallbackWorkflow();

  const mediaCarousel = mediaItems.length
    ? mediaItems.map((item) => ({
        id: item.id,
        title: item.media?.label || item.album?.title || "Media item",
        caption: item.caption,
        credit: item.credit,
        imageUrl: item.media?.url,
        albumSlug: item.album?.slug,
      }))
    : fallbackMediaLeaders();

  return {
    hero: DEFAULT_HERO,
    projects,
    leadership,
    leadershipInsights: content.leadership?.insights || [],
    achievements: achievementsPayload,
    counters,
    workflow,
    mediaCarousel,
  };
}
