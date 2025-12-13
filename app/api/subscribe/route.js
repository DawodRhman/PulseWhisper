import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if already subscribed
    const existing = await prisma.newsletterSubscriber.findUnique({
      where: { email },
    });

    if (existing) {
      if (existing.unsubscribedAt) {
        // Resubscribe
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { unsubscribedAt: null },
        });
      }
      return NextResponse.json({ success: true, message: "Already subscribed" });
    }

    await prisma.newsletterSubscriber.create({
      data: {
        email,
        source: "Website Footer/Subscribe Section",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("POST /api/subscribe", error);
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 });
  }
}
