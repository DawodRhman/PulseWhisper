import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Right to Information",
    subtitle: "Access official documents, forms, and information about KW&SC operations",
    backgroundImage: "/teentalwarkarachi.gif",
  },
  ur: {
    title: "معلومات کا حق",
    subtitle: "KW&SC آپریشنز کے بارے میں سرکاری دستاویزات، فارمز اور معلومات تک رسائی حاصل کریں۔",
    backgroundImage: "/teentalwarkarachi.gif",
  }
};

function getHeroContent(lang = 'en') {
  return HERO_CONTENT[lang] || HERO_CONTENT.en;
}

function serializeDocument(doc) {
  return {
    id: doc.id,
    title: doc.title,
    description: doc.summary,
    type: doc.docType || "Document",
    link: doc.externalUrl || (doc.media ? doc.media.url : "#"),
    order: doc.order,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.RIGHT_TO_INFORMATION,
      async () => {
        let documents = [];

        try {
          documents = await prisma.rtiDocument.findMany({
            orderBy: { order: "asc" },
            include: { media: true },
          });
        } catch (dbError) {
          console.warn("⚠️ Database unreachable in RTI API. Using empty list.");
        }

        const hero = getHeroContent(lang);

        const seo = await resolvePageSeo({
          canonicalUrl: "/right-to-information",
          fallback: {
            title: `${hero.title} | Karachi Water & Sewerage Corporation`,
            description: hero.subtitle,
            ogImageUrl: hero.backgroundImage,
          },
        });

        return {
          hero,
          documents: documents.map(serializeDocument),
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/rti", error);
    return NextResponse.json({
      data: {
        hero: HERO_CONTENT,
        documents: [],
        seo: null
      },
      meta: { stale: true }
    });
  }
}
