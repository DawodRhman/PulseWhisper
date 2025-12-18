import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import { resolveWithSnapshot } from "@/lib/cache";
import { buildHomePayload } from "@/lib/home/payload";

export const dynamic = "force-dynamic";

export async function GET() {
    try {
        const snapshot = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);
        const projects = snapshot?.data?.projects || [];
        return NextResponse.json({ projects });
    } catch (error) {
        console.error("/api/projects", error);
        return NextResponse.json({ error: "Unable to load projects data" }, { status: 500 });
    }
}