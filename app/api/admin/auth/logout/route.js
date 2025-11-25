import { NextResponse } from "next/server";
import { revokeCurrentAdminSession } from "@/lib/auth/session";

export async function POST() {
  try {
    await revokeCurrentAdminSession();
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/admin/auth/logout", error);
    return NextResponse.json({ error: "Unable to log out." }, { status: 500 });
  }
}
