import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const townId = searchParams.get("town_id");

    if (!townId) {
      return NextResponse.json(
        { error: "town_id parameter is required" },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_KWSC_API_BASE_URL || "https://complain.kwsc.gos.pk";
    const response = await fetch(`${apiBaseUrl}/subtown/by/town?town_id=${townId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sub-towns" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sub-towns:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

