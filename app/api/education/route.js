import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Education & Awareness",
    subtitle: "Empowering the community with knowledge about water conservation and hygiene.",
    backgroundImage: "/karachicharminar.gif",
  },
  ur: {
    title: "تعلیم اور آگاہی",
    subtitle: "پانی کی حفاظت اور حفظان صحت کے بارے میں علم کے ساتھ کمیونٹی کو بااختیار بنانا۔",
    backgroundImage: "/karachicharminar.gif",
  }
};

function getHeroContent(lang = 'en') {
  return HERO_CONTENT[lang] || HERO_CONTENT.en;
}

function serializeResource(resource) {
  return {
    id: resource.id,
    title: resource.title,
    titleUr: resource.titleUr,
    description: resource.summary,
    descriptionUr: resource.summaryUr,
    image: resource.media ? resource.media.url : "/images/placeholder.jpg",
    content: resource.content,
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data: snapshotData, stale } = await resolveWithSnapshot(
      SnapshotModule.EDUCATION,
      async () => {
        let resources = [];
        try {
          resources = await prisma.educationResource.findMany({
            orderBy: { createdAt: "desc" },
            include: { media: true },
          });
        } catch (dbError) {
          console.warn("⚠️ Database unreachable in Education API. Using empty list.");
        }
        return { resources: resources.map(serializeResource) };
      }
    );

    const hero = getHeroContent(lang);

    const seo = await resolvePageSeo({
      canonicalUrl: "/education",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    const translatedResources = snapshotData.resources;

    return NextResponse.json({
      data: {
        hero,
        resources: translatedResources,
        seo
      },
      meta: { stale }
    });

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/education", error);
    return NextResponse.json({
      data: {
        hero: HERO_CONTENT,
        resources: [],
        seo: null
      },
      meta: { stale: true }
    });
  }
}
