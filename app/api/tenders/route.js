import { NextResponse } from "next/server";
import { SnapshotModule, TenderStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
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
              summary: tender.summary,
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

        const hero = {
          title: "Tenders",
          subtitle: "Official tender notices, procurement opportunities, and bidding documents",
          backgroundImage: "/karachicharminar.gif",
        };

        const seo = await resolvePageSeo({
          canonicalUrl: "/tenders",
          fallback: {
            title: `${hero.title} | Karachi Water & Sewerage Corporation`,
            description: hero.subtitle,
            ogImageUrl: hero.backgroundImage,
          },
        });

        return {
          hero,
          open: serialize(TenderStatus.OPEN),
          closed: serialize(TenderStatus.CLOSED),
          cancelled: serialize(TenderStatus.CANCELLED),
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/tenders", error);
    return NextResponse.json(
      { error: "Failed to load tenders" },
      { status: 500 }
    );
  }
}
