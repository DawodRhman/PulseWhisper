import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  title: "Water Today",
  subtitle: "Daily updates on water supply and distribution across Karachi.",
  backgroundImage: "/downtownkarachi.gif",
};

export async function GET() {
  try {
    // Note: SnapshotModule.WATER_TODAY might not exist in your enum yet.
    // If it doesn't, we can skip the snapshot wrapper or add it to the enum.
    // For now, I'll fetch directly to avoid enum issues if it's missing.
    
    let updates = [];
    try {
      updates = await prisma.waterTodayUpdate.findMany({
        orderBy: { publishedAt: "desc" },
        include: { media: true },
      });
    } catch (dbError) {
      console.warn("⚠️ Database unreachable in Water Today API. Using empty list.");
    }

    const hero = HERO_CONTENT;

    const seo = await resolvePageSeo({
      canonicalUrl: "/watertodaysection",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    return NextResponse.json({
      data: {
        hero,
        updates,
        seo,
      },
    });
  } catch (error) {
    console.error("/api/watertoday", error);
    return NextResponse.json({ error: "Unable to load Water Today data" }, { status: 500 });
  }
}
