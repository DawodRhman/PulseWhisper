import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { resolveLocalizedContent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const membersRaw = await prisma.leadershipMember.findMany({
      orderBy: { priority: "asc" },
      include: {
        portrait: true,
      },
    });

    const members = membersRaw.map(member => {
      // Localize each member
      return resolveLocalizedContent(member, lang);
    });

    return NextResponse.json({ members });
  } catch (error) {
    console.error("Failed to fetch leadership:", error);
    return NextResponse.json(
      { error: "Failed to fetch leadership data" },
      { status: 500 }
    );
  }
}
