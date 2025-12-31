import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolvePageSeo } from "@/lib/seo";
import { autoTranslatePayload } from "@/lib/i18n/autoTranslate";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Water Today",
    subtitle: "Daily updates on water supply and distribution across Karachi.",
    backgroundImage: "/downtownkarachi.gif",
  },
  ur: {
    title: "آج کا پانی",
    subtitle: "کراچی میں پانی کی فراہمی اور تقسیم کے روزانہ اپ ڈیٹس۔",
    backgroundImage: "/downtownkarachi.gif",
  }
};

function getHeroContent(lang = 'en') {
  return HERO_CONTENT[lang] || HERO_CONTENT.en;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    // Fetch all updates (no filter)
    const updates = await prisma.waterTodayUpdate.findMany({
      orderBy: { publishedAt: "desc" },
      include: { media: true },
    });

    const hero = getHeroContent(lang);

    const seo = await resolvePageSeo({
      canonicalUrl: "/watertodaysection",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    const payload = await autoTranslatePayload({
      hero,
      updates,
      seo,
    }, lang);

    return NextResponse.json({ data: payload });
  } catch (error) {
    console.error("/api/watertoday Error:", error);
    return NextResponse.json({ error: "Unable to load Water Today data" }, { status: 500 });
  }
}
