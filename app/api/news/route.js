import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";
import { resolveLocalizedContent } from "@/lib/utils";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Latest News",
    subtitle: "Tracking infrastructure developments, digital transformation, and utility metrics in real time.",
    backgroundImage: "/media/hero/news-desk.svg",
  },
  ur: {
    title: "تازہ ترین خبریں",
    subtitle: "انفراسٹرکچر کی ترقی، ڈیجیٹل تبدیلی، اور افادیت کے میٹرکس کو ریئل ٹائم میں ٹریک کرنا۔",
    backgroundImage: "/media/hero/news-desk.svg",
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
      SnapshotModule.NEWS,
      async () => {
        const [categories, articles] = await Promise.all([
          prisma.newsCategory.findMany({ orderBy: { order: "asc" } }),
          prisma.newsArticle.findMany({
            orderBy: { publishedAt: "desc" },
            include: {
              category: true,
              tags: {
                include: { tag: true },
              },
              heroMedia: true,
              seo: true,
            },
            take: 50,
          }),
        ]);

        return {
          categories,
          articles: articles.map((article) => ({
            ...article,
            tags: article.tags.map((map) => map.tag),
          })),
        };
      }
    );

    const hero = getHeroContent(lang);

    const seo = await resolvePageSeo({
      canonicalUrl: "/news",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    // Normalize categories and articles
    const normalizedCategories = (snapshotData.categories || []).map(cat =>
      resolveLocalizedContent(cat, lang)
    );
    const normalizedArticles = (snapshotData.articles || []).map(article =>
      resolveLocalizedContent(article, lang)
    );

    return NextResponse.json({
      data: {
        hero,
        categories: normalizedCategories,
        articles: normalizedArticles,
        seo
      },
      meta: { stale }
    });

  } catch (error) {
    console.error("GET /api/news", error);
    return NextResponse.json(
      { error: "Failed to load news" },
      { status: 500 }
    );
  }
}
