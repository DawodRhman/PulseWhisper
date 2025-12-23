import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const compNum = searchParams.get("comp_num");
    const phone = searchParams.get("phone");

    if (!compNum || !phone) {
      return NextResponse.json(
        { error: "comp_num and phone parameters are required" },
        { status: 400 }
      );
    }

    const apiBaseUrl = process.env.NEXT_PUBLIC_KWSC_API_BASE_URL || "https://complain.kwsc.gos.pk";
    const response = await fetch(`${apiBaseUrl}/track/complaint?comp_num=${compNum}&phone=${phone}`, {
      method: "GET",
      headers: {
        "Accept": "text/html,application/json",
      },
    });

    // The API returns HTML, so we'll parse it to extract complaint details
    const html = await response.text();
    
    // Try to extract complaint information from HTML
    // This is a basic implementation - you may need to adjust based on actual HTML structure
    return NextResponse.json({
      success: response.ok,
      html: html,
      status: response.status,
    });
  } catch (error) {
    console.error("Error tracking complaint:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

