import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // 1. Check if env var exists
    const dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
      return NextResponse.json({ 
        status: "error", 
        message: "DATABASE_URL environment variable is not set." 
      }, { status: 500 });
    }

    // 2. Masked URL for debugging
    const maskedUrl = dbUrl.replace(/:([^:@]+)@/, ":****@");

    // 3. Try a simple query
    const count = await prisma.user.count();

    return NextResponse.json({ 
      status: "success", 
      message: "Database connection successful", 
      userCount: count,
      config: {
        url: maskedUrl
      }
    });

  } catch (error) {
    console.error("Database Connection Test Failed:", error);
    return NextResponse.json({ 
      status: "error", 
      message: error.message, 
      code: error.code,
      meta: error.meta,
      stack: error.stack
    }, { status: 500 });
  }
}
