import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 15; // 15 seconds max duration

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const typeId = searchParams.get("type_id");

    if (!typeId) {
      return NextResponse.json(
        { error: "type_id parameter is required" },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_KWSC_API_BASE_URL || "https://complain.kwsc.gos.pk";
    
    // Add timeout handling
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout

    try {
      const response = await fetch(`${apiBaseUrl}/subtype/by/type?type_id=${typeId}`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        return NextResponse.json(
          { error: "Failed to fetch sub-types" },
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
    console.error("Error fetching sub-types:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

