import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  try {
    const { slug } = await params;
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

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
      title: lang === 'ur' && opening.titleUr ? opening.titleUr : opening.title,
      department: lang === 'ur' && opening.departmentUr ? opening.departmentUr : opening.department,
      location: lang === 'ur' && opening.locationUr ? opening.locationUr : opening.location,
      jobType: lang === 'ur' && opening.jobTypeUr ? opening.jobTypeUr : opening.jobType,
      summary: lang === 'ur' && opening.summaryUr ? opening.summaryUr : opening.summary,
      description: lang === 'ur' && opening.descriptionUr ? opening.descriptionUr : opening.description,
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
