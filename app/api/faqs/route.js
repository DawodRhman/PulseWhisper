import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
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

        return {
          categories,
          uncategorized: uncategorizedFaqs,
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
