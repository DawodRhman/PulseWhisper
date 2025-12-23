import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15; // 15 seconds max duration

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
    
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${apiBaseUrl}/subtown/by/town?town_id=${townId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch sub-towns" },
          { status: response.status }
        );
      }

      const data = await response.json();
      return NextResponse.json(data);
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: "Request timeout. Please try again." },
          { status: 504 }
        );
      }
      throw fetchError;
    }
  } catch (error) {
    console.error("Error fetching sub-towns:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

