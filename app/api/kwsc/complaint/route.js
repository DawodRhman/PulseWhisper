import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(request) {
  try {
    const formData = await request.formData();

    const apiBaseUrl = process.env.NEXT_PUBLIC_KWSC_API_BASE_URL || "https://complain.kwsc.gos.pk";
    
    // Forward the form data to the external API
    const response = await fetch(`${apiBaseUrl}/complaint/store`, {
      method: "POST",
      body: formData,
    });

    // Handle redirect responses
    if (response.redirected) {
      return NextResponse.json(
        { success: true, redirectUrl: response.url },
        { status: 200 }
      );
    }

    // Try to parse JSON response if available
    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      const data = await response.json();
      return NextResponse.json(data, { status: response.status });
    }

    // For HTML responses or other content types
    const text = await response.text();
    
    if (response.ok) {
      return NextResponse.json(
        { success: true, message: "Complaint submitted successfully" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { error: "Failed to submit complaint", details: text.substring(0, 200) },
      { status: response.status }
    );
  } catch (error) {
    console.error("Error submitting complaint:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 }
    );
  }
}

