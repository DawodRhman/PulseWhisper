import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
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

        const hero = {
          title: "Latest News",
          subtitle: "Tracking infrastructure developments, digital transformation, and utility metrics in real time.",
           backgroundImage: "/media/hero/news-desk.svg",
        };

        const seo = await resolvePageSeo({
          canonicalUrl: "/news",
          fallback: {
            title: `${hero.title} | Karachi Water & Sewerage Corporation`,
            description: hero.subtitle,
            ogImageUrl: hero.backgroundImage,
          },
        });

        return {
          hero,
          categories,
          articles: articles.map((article) => ({
            ...article,
            tags: article.tags.map((map) => map.tag),
          })),
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/news", error);
    return NextResponse.json(
      { error: "Failed to load news" },
      { status: 500 }
    );
  }
}
