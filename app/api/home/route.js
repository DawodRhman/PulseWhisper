import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import { resolveWithSnapshot } from "@/lib/cache";
import { buildHomePayload } from "@/lib/home/payload";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snapshot = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);
    return NextResponse.json(snapshot);
  } catch (error) {
    console.error("/api/home", error);
    return NextResponse.json({ error: "Unable to load home data" }, { status: 500 });
  }
}
