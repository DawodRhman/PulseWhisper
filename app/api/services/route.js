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

/**
 * Resolves localized content for an object.
 * Checks for `[key]Ur` if lang is 'ur', otherwise falls back to `[key]`.
 */
function resolveLocalizedContent(item, lang, keys = ['title', 'summary', 'description', 'heading', 'body']) {
  if (!item) return item;
  const isUrdu = lang === 'ur';
  const resolved = { ...item };

  keys.forEach(key => {
    const urKey = `${key}Ur`;
    if (isUrdu && item[urKey]) {
      resolved[key] = item[urKey];
    }
  });

  return resolved;
}

function getFallbackHero(lang = 'en') {
  return FALLBACK_HERO[lang] || FALLBACK_HERO.en;
}

function mapServicesFallback(lang = 'en') {
  // Use the new resolve logic even for fallback mapping if possible, 
  // but here we just need to return the correct structure.
  const hero = getFallbackHero(lang);

  // Note: content.services is static data, assuming it might have Ur keys or just be English defaults.
  // For safety, we just use it as base.
  const services = content?.services || {};
  const cards = Array.isArray(services.cards) ? services.cards : [];
  const sections = Array.isArray(services.sections) ? services.sections : [];

  const mappedCards = cards.map((card, index) => {
    // Resolve static content if it has keys
    const resolvedCard = resolveLocalizedContent(card, lang);
    return {
      id: `fallback-card-${index}`,
      categoryId: "fallback-category",
      title: resolvedCard.title || `Service ${index + 1}`,
      summary: resolvedCard.description || null,
      description: resolvedCard.description || null, // API uses description/summary
      iconKey: card.iconKey || "FaTint",
      gradientClass: card.gradient || "from-blue-100 to-blue-300",
      order: index,
      seo: null,
      media: null,
      details: [],
    };
  });

  const mappedDetails = sections.map((section, index) => {
    const resolvedSection = resolveLocalizedContent(section, lang);
    return {
      id: `fallback-detail-${index}`,
      heading: resolvedSection.heading || `Detail ${index + 1}`,
      body: resolvedSection.body || null,
      bulletPoints: Array.isArray(section.bulletPoints) ? section.bulletPoints : [],
      order: index,
    };
  });

  if (mappedCards.length && mappedDetails.length) {
    mappedCards[0].details = mappedDetails;
  } else if (mappedDetails.length) {
    mappedCards.push({
      id: "fallback-card-details",
      categoryId: "fallback-category",
      title: hero.title, // Use hero title as fallback card title
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

  return [
    {
      id: "fallback-category",
      title: hero.title,
      summary: hero.subtitle,
      heroCopy: null,
      order: 0,
      seo: null,
      cards: mappedCards,
      resources: [], // Simplified for fallback
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

function normalizeCategory(category, lang) {
  const resolvedCat = resolveLocalizedContent(category, lang);

  if (resolvedCat.cards) {
    resolvedCat.cards = resolvedCat.cards.map(card => {
      const resolvedCard = resolveLocalizedContent(card, lang);

      if (resolvedCard.details) {
        resolvedCard.details = resolvedCard.details.map(detail =>
          resolveLocalizedContent(detail, lang)
        );
      }
      return resolvedCard;
    });
  }
  return resolvedCat;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    // 1. Fetch Data (Snapshot or DB) - Raw Data (contains both En and Ur fields)
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
          return { categories: [] }; // Handle fallback below
        }
        return { categories };
      }
    );

    let { categories } = snapshotData;

    // 2. Handle Empty Data with Fallback
    if (!categories || categories.length === 0) {
      categories = mapServicesFallback(lang);
    } else {
      // 3. Normalize Data for Client (Server-Side Translation Resolution)
      categories = categories.map(cat => normalizeCategory(cat, lang));
    }

    const hero = getFallbackHero(lang);
    const seo = await buildSeoPayload(hero);

    return jsonResponse({
      data: {
        hero,
        categories,
        seo
      },
      meta: { stale, lang }
    });
  } catch (error) {
    console.error("GET /api/services", error);
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const fallbackPayload = {
      hero: getFallbackHero(lang),
      categories: mapServicesFallback(lang),
      seo: null,
    };
    return jsonResponse({ data: fallbackPayload, meta: { stale: true, error: error.message } });
  }
}
