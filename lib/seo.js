import prisma from "@/lib/prisma";

const DEFAULT_TITLE = "Karachi Water & Sewerage Corporation";
const DEFAULT_DESCRIPTION =
  "Karachi Water & Sewerage Corporation delivers safe water supply, sewerage services, and infrastructure upgrades across the city.";

function buildFallbackSeo(canonicalUrl, fallback = {}) {
  const title = fallback.title || DEFAULT_TITLE;
  const description = fallback.description || DEFAULT_DESCRIPTION;

  return {
    id: null,
    title,
    description,
    keywords: fallback.keywords || null,
    canonicalUrl: canonicalUrl || fallback.canonicalUrl || null,
    ogTitle: fallback.ogTitle || title,
    ogDescription: fallback.ogDescription || description,
    ogImageUrl: fallback.ogImageUrl || null,
    twitterCard: fallback.twitterCard || "summary_large_image",
    structuredData: fallback.structuredData || null,
    allowIndexing: fallback.allowIndexing ?? true,
  };
}

export async function resolvePageSeo({ canonicalUrl, fallback }) {
  try {
    if (canonicalUrl) {
      const record = await prisma.seoMeta.findFirst({
        where: { canonicalUrl },
        orderBy: { updatedAt: "desc" },
      });

      if (record) {
        return record;
      }
    }
  } catch (error) {
    console.warn("resolvePageSeo: falling back due to error", canonicalUrl, error);
  }

  return buildFallbackSeo(canonicalUrl, fallback);
}

export function buildSeoFallback(options) {
  return buildFallbackSeo(options?.canonicalUrl, options?.fallback);
}
