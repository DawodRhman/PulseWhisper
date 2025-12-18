import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import { resolveWithSnapshot } from "@/lib/cache";
import { buildHomePayload } from "@/lib/home/payload";
import { resolveLocalizedContent } from "@/lib/utils";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'en';

        // Fetch snapshot (contains mixed En/Ur fields)
        const snapshot = await resolveWithSnapshot(SnapshotModule.HOME, () => buildHomePayload());

        let projects = snapshot?.data?.projects || [];

        // Normalize projects for the requested language
        projects = projects.map(p => resolveLocalizedContent(p, lang));

        // Also normalize project category if it's an object, or just rely on flattened props
        // The project object from payload.js has 'category' as a string usually, but let's be safe.

        return NextResponse.json({ projects });
    } catch (error) {
        console.error("/api/projects", error);
        return NextResponse.json({ error: "Unable to load projects data" }, { status: 500 });
    }
}