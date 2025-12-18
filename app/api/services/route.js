import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";
import content from "@/data/static/content";

export const dynamic = "force-dynamic";

const securityHeaders = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-XSS-Protection": "1; mode=block",
};

function jsonResponse(body, init = {}) {
  const response = NextResponse.json(body, init);
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value);
  });
  return response;
}

const FALLBACK_HERO = {
  en: {
    title: "What We Do",
    subtitle: "Comprehensive water and sewerage services ensuring clean water supply and efficient wastewater management for Karachi.",
    backgroundImage: "/teentalwarkarachi.gif",
  },
  ur: {
    title: "ہم کیا کرتے ہیں",
    subtitle: "کراچی کے لیے صاف پانی کی فراہمی اور موثر فضلہ پانی کے انتظام کو یقینی بنانے والی جامع پانی اور سیوریج خدمات۔",
    backgroundImage: "/teentalwarkarachi.gif",
  }
};

function getFallbackHero(lang = 'en') {
  return FALLBACK_HERO[lang] || FALLBACK_HERO.en;
}

function mapServicesFallback(lang = 'en') {
  const hero = getFallbackHero(lang);
  const services = content?.services || {};
  const cards = Array.isArray(services.cards) ? services.cards : [];
  const sections = Array.isArray(services.sections) ? services.sections : [];

  const mappedCards = cards.map((card, index) => ({
    id: `fallback-card-${index}`,
    categoryId: "fallback-category",
    title: card.title || `Service ${index + 1}`,
    summary: card.description || null,
    description: card.description || null,
    iconKey: card.iconKey || "FaTint",
    gradientClass: card.gradient || "from-blue-100 to-blue-300",
    order: index,
    seo: null,
    media: null,
    details: [],
  }));

  const mappedDetails = sections.map((section, index) => ({
    id: `fallback-detail-${index}`,
    heading: section.heading || `Detail ${index + 1}`,
    body: section.body || null,
    bulletPoints: Array.isArray(section.bulletPoints) ? section.bulletPoints : [],
    order: index,
  }));

  if (mappedCards.length && mappedDetails.length) {
    mappedCards[0].details = mappedDetails;
  } else if (mappedDetails.length) {
    mappedCards.push({
      id: "fallback-card-details",
      categoryId: "fallback-category",
      title: "Our Services",
      summary: null,
      description: null,
      iconKey: "FaTint",
      gradientClass: "from-blue-100 to-blue-300",
      order: mappedCards.length,
      seo: null,
      media: null,
      details: mappedDetails,
    });
  }

  const mappedResources = [];
  sections.forEach((section, sectionIndex) => {
    (section.resources || []).forEach((resource, resourceIndex) => {
      mappedResources.push({
        id: `fallback-resource-${sectionIndex}-${resourceIndex}`,
        title: resource.title || "Resource",
        description: resource.description || null,
        externalUrl: resource.url || null,
        media: resource.url ? { url: resource.url } : null,
      });
    });
  });

  return [
    {
      id: "fallback-category",
      title: hero.title,
      summary: hero.subtitle,
      heroCopy: null,
      order: 0,
      seo: null,
      cards: mappedCards,
      resources: mappedResources,
    },
  ];
}

function buildSeoPayload(hero) {
  return resolvePageSeo({
    canonicalUrl: "/ourservices",
    fallback: {
      title: `${hero.title} | Karachi Water & Sewerage Corporation`,
      description: hero.subtitle,
      ogImageUrl: hero.backgroundImage,
    },
  });
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data: snapshotData, stale } = await resolveWithSnapshot(
      SnapshotModule.SERVICES,
      async () => {
        let categories = [];
        try {
          categories = await prisma.serviceCategory.findMany({
            orderBy: { order: "asc" },
            include: {
              seo: true,
              cards: {
                orderBy: { order: "asc" },
                include: {
                  seo: true,
                  media: true,
                  details: {
                    orderBy: { order: "asc" },
                  },
                },
              },
              resources: {
                orderBy: { createdAt: "asc" },
                include: {
                  media: true,
                },
              },
            },
          });
        } catch (dbError) {
          console.warn("Database unreachable in services API, using fallback data.", dbError?.message);
          // Return empty or fallback? better to return empty here and handle fallback outside if caching matches
          // But mapServicesFallback relies on content... 
          // Let's return raw fallback if db fails
           categories = mapServicesFallback('en'); // Always cache 'en' or raw
        }
        return { categories };
      }
    );

    // Contextualize data based on lang
    let { categories } = snapshotData;

    // Handle Fallback if empty (double check logic)
    if (!categories || categories.length === 0) {
         categories = mapServicesFallback(lang);
    }

    // Translate
    if (Array.isArray(categories)) {
          categories = categories.map(category => ({
            ...category,
            title: lang === 'ur' && category.titleUr ? category.titleUr : category.title,
            summary: lang === 'ur' && category.summaryUr ? category.summaryUr : category.summary,
            heroCopy: lang === 'ur' && category.heroCopyUr ? category.heroCopyUr : category.heroCopy,
            cards: category.cards?.map(card => ({
              ...card,
              title: lang === 'ur' && card.titleUr ? card.titleUr : card.title,
              summary: lang === 'ur' && card.summaryUr ? card.summaryUr : card.summary,
              description: lang === 'ur' && card.descriptionUr ? card.descriptionUr : card.description,
              details: card.details?.map(detail => ({
                ...detail,
                heading: lang === 'ur' && detail.headingUr ? detail.headingUr : detail.heading,
                body: lang === 'ur' && detail.bodyUr ? detail.bodyUr : detail.body,
              })),
            })),
          }));
    }

    const hero = getFallbackHero(lang);
    const seo = await buildSeoPayload(hero);

    return jsonResponse({ 
      data: {
        hero,
        categories,
        seo
      }, 
      meta: { stale } 
    });
  } catch (error) {
    console.error("GET /api/services", error);
    const fallbackPayload = {
      hero: FALLBACK_HERO,
      categories: mapServicesFallback(),
      seo: null,
    };
    return jsonResponse({ data: fallbackPayload, meta: { stale: true } });
  }
}
