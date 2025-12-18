import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const pages = await prisma.page.findMany({
      where: { isPublished: true },
      select: {
        id: true,
        title: true,
        slug: true,
        showInNavbar: true,
        navLabel: true,
        navGroup: true,
      },
      orderBy: { title: "asc" },
    });

    return NextResponse.json({ data: pages });
  } catch (error) {
    console.error("Error fetching pages:", error);
    return NextResponse.json({ error: "Failed to fetch pages" }, { status: 500 });
  }
}
