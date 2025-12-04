import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const opening = await prisma.careerOpening.findUnique({
      where: { slug },
      include: {
        requirements: {
          orderBy: { order: "asc" },
        },
        seo: true,
      },
    });

    if (!opening) {
      return NextResponse.json(
        { error: "Career opening not found" },
        { status: 404 }
      );
    }

    const formattedOpening = {
      ...opening,
      qualifications: opening.requirements
        .filter((req) => req.type === "QUALIFICATION")
        .map((req) => req.content),
      responsibilities: opening.requirements
        .filter((req) => req.type === "RESPONSIBILITY")
        .map((req) => req.content),
    };

    return NextResponse.json(formattedOpening);
  } catch (error) {
    console.error("Error fetching career opening:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
