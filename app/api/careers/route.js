import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.CAREERS,
      async () => {
        const [programs, openings, benefits, contacts] = await Promise.all([
          prisma.careerProgram.findMany({
            orderBy: { createdAt: "asc" },
            include: { seo: true },
          }),
          prisma.careerOpening.findMany({
            orderBy: [
              { status: "desc" },
              { publishAt: "desc" },
            ],
            include: {
              requirements: {
                orderBy: { order: "asc" },
              },
              seo: true,
            },
          }),
          prisma.careerBenefit.findMany({ orderBy: { order: "asc" } }),
          prisma.contactChannel.findMany({ orderBy: { createdAt: "asc" } }),
        ]);

        const groupRequirements = (opening) => ({
          ...opening,
          qualifications: opening.requirements
            .filter((req) => req.type === "QUALIFICATION")
            .map((req) => req.content),
          responsibilities: opening.requirements
            .filter((req) => req.type === "RESPONSIBILITY")
            .map((req) => req.content),
        });

        const hero = {
          title: "Careers at KW&SC",
          subtitle: "Join our mission to provide clean water and efficient sewerage services to Karachi.",
          backgroundImage: "/teentalwarkarachi.gif",
        };

        const seo = await resolvePageSeo({
          canonicalUrl: "/careers",
          fallback: {
            title: `${hero.title} | Karachi Water & Sewerage Corporation`,
            description: hero.subtitle,
            ogImageUrl: hero.backgroundImage,
          },
        });

        return {
          hero,
          programs,
          openings: openings.map(groupRequirements),
          benefits,
          contacts,
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/careers", error);
    return NextResponse.json(
      { error: "Failed to load careers data" },
      { status: 500 }
    );
  }
}
