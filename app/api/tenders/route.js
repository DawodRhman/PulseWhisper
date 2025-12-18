import { NextResponse } from "next/server";
import { SnapshotModule, TenderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Tenders",
    subtitle: "Official tender notices, procurement opportunities, and bidding documents",
    backgroundImage: "/karachicharminar.gif",
  },
  ur: {
    title: "ٹینڈرز",
    subtitle: "سرکاری ٹینڈر نوٹس، خریداری کے مواقع، اور بڈنگ دستاویزات",
    backgroundImage: "/karachicharminar.gif",
  }
};

function getHeroContent(lang = 'en') {
  return HERO_CONTENT[lang] || HERO_CONTENT.en;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data: snapshotData, stale } = await resolveWithSnapshot(
      SnapshotModule.TENDERS,
      async () => {
        const tenders = await prisma.tender.findMany({
          orderBy: [
            { status: "asc" },
            { publishedAt: "desc" },
          ],
          include: {
            category: true,
            attachments: {
              include: { media: true },
            },
            seo: true,
          },
        });

        const serialize = (status) =>
          tenders
            .filter((t) => t.status === status)
            .map((tender) => ({
              id: tender.id,
              tenderNumber: tender.tenderNumber,
              title: tender.title,
              titleUr: tender.titleUr,
              summary: tender.summary,
              summaryUr: tender.summaryUr,
              description: tender.description,
              descriptionUr: tender.descriptionUr,
              status: tender.status,
              publishedAt: tender.publishedAt,
              closingAt: tender.closingAt,
              category: tender.category?.label,
              attachments: tender.attachments.map((attachment) => ({
                id: attachment.id,
                label: attachment.label,
                url: attachment.media?.url,
              })),
            }));

        return {
          open: serialize(TenderStatus.OPEN),
          closed: serialize(TenderStatus.CLOSED),
          cancelled: serialize(TenderStatus.CANCELLED),
        };
      }
    );

    const hero = getHeroContent(lang);

    const seo = await resolvePageSeo({
      canonicalUrl: "/tenders",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    // Raw data returned for client-side localization
    // const localizeTenders = ... (removed)

    return NextResponse.json({
      data: {
        hero,
        open: snapshotData.open,
        closed: snapshotData.closed,
        cancelled: snapshotData.cancelled,
        seo
      },
      meta: { stale }
    });
  } catch (error) {
    console.error("GET /api/tenders", error);
    return NextResponse.json(
      { error: "Failed to load tenders" },
      { status: 500 }
    );
  }
}
