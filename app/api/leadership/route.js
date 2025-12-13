import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic"; // Ensure it's not statically cached forever

export async function GET() {
  try {
    const members = await prisma.leadershipMember.findMany({
      orderBy: { priority: "asc" },
      include: {
        portrait: true,
      },
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
