import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";
import content from "@/data/static/content";

const FALLBACK_HERO =
  content?.services?.hero || {
    title: "What We Do",
    subtitle:
      "Comprehensive water and sewerage services ensuring clean water supply and efficient wastewater management for Karachi.",
    backgroundImage: "/teentalwarkarachi.gif",
  };

function mapServicesFallback() {
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
      title: services.hero?.title || FALLBACK_HERO.title,
      summary: services.hero?.subtitle || FALLBACK_HERO.subtitle,
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

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
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
          categories = mapServicesFallback();
        }

        if (!Array.isArray(categories) || categories.length === 0) {
          categories = mapServicesFallback();
        }

        const hero = FALLBACK_HERO;
        const seo = await buildSeoPayload(hero);

        return {
          hero,
          categories,
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/services", error);
    const fallbackPayload = {
      hero: FALLBACK_HERO,
      categories: mapServicesFallback(),
      seo: null,
    };
    return NextResponse.json({ data: fallbackPayload, meta: { stale: true } });
  }
}
