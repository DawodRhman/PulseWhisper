import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import { resolveWithSnapshot } from "@/lib/cache";
import { buildHomePayload } from "@/lib/home/payload";

export const dynamic = "force-dynamic";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const lang = searchParams.get('lang') || 'en';

        const snapshot = await resolveWithSnapshot(SnapshotModule.HOME, () => buildHomePayload(lang));
        const projects = (snapshot?.data?.projects || []).map(project => ({
            ...project,
            title: lang === 'ur' && project.titleUr ? project.titleUr : project.title,
            summary: lang === 'ur' && project.summaryUr ? project.summaryUr : project.summary,
        }));
        return NextResponse.json({ projects });
    } catch (error) {
        console.error("/api/projects", error);
        return NextResponse.json({ error: "Unable to load projects data" }, { status: 500 });
    }
}