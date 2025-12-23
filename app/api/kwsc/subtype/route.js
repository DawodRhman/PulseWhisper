import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

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
    const response = await fetch(`${apiBaseUrl}/subtype/by/type?type_id=${typeId}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Failed to fetch sub-types" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching sub-types:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

