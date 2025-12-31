
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    const { id } = params;
    if (!id) {
        return new NextResponse("Missing ID", { status: 400 });
    }

    try {
        const asset = await prisma.mediaAsset.findUnique({
            where: { id },
            select: { data: true, mimeType: true, url: true },
        });

        if (!asset) {
            return new NextResponse("Not found", { status: 404 });
        }

        // If we have binary data, serve it
        if (asset.data) {
            return new NextResponse(asset.data, {
                headers: {
                    "Content-Type": asset.mimeType || "application/octet-stream",
                    "Cache-Control": "public, max-age=31536000, immutable",
                },
            });
        }

        // Fallback for legacy assets: Redirect to the stored URL (e.g. /uploads/...)
        // This allows old filesystem-based images to still work if the file exists
        if (asset.url) {
            return NextResponse.redirect(new URL(asset.url, request.url));
        }

        return new NextResponse("No content found", { status: 404 });
    } catch (error) {
        console.error("Asset serving error:", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}
