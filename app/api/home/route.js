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
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("/api/home", error);
    return NextResponse.json({ error: "Unable to load home data" }, { status: 500 });
  }
}
