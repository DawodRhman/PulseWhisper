import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.SOCIAL_LINKS,
      async () => {
        const links = await prisma.socialLink.findMany({
          where: { isActive: true },
          orderBy: [{ order: "asc" }, { createdAt: "asc" }],
        });
        return { links };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/social-links", error);
    return NextResponse.json(
      { error: "Failed to load social links" },
      { status: 500 }
    );
  }
}
