import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import content from "@/data/static/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.SOCIAL_LINKS,
      async () => {
        try {
          const links = await prisma.socialLink.findMany({
            where: { isActive: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          });
          return { links };
        } catch (error) {
          console.warn("⚠️ Database unreachable in social-links API. Using fallback data.");
          return { links: content.socialLinks || [] };
        }
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/social-links", error);
    // Even if resolveWithSnapshot fails completely, return fallback
    return NextResponse.json({ data: { links: content.socialLinks || [] }, meta: { stale: true } });
  }
}
