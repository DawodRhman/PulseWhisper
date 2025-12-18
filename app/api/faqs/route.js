import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolveLocalizedContent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.FAQ,
      async () => {
        const categories = await prisma.faqCategory.findMany({
          orderBy: { order: "asc" },
          include: {
            faqs: {
              orderBy: { order: "asc" },
            },
          },
        });

        // Also fetch uncategorized FAQs if any
        const uncategorizedFaqs = await prisma.faq.findMany({
          where: { categoryId: null },
          orderBy: { order: "asc" },
        });

        // Localize categories and their nested FAQs
        const localizedCategories = categories.map(cat => ({
          ...resolveLocalizedContent(cat, lang),
          faqs: (cat.faqs || []).map(f => resolveLocalizedContent(f, lang))
        }));

        const localizedUncategorized = uncategorizedFaqs.map(f => resolveLocalizedContent(f, lang));

        return {
          categories: localizedCategories,
          uncategorized: localizedUncategorized,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/faqs", error);
    return NextResponse.json(
      { error: "Failed to fetch FAQs" },
      { status: 500 }
    );
  }
}
