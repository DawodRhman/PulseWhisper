import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HERO_CONTENT = {
  en: {
    title: "Careers at KW&SC",
    subtitle: "Join our mission to provide clean water and efficient sewerage services to Karachi.",
    backgroundImage: "/teentalwarkarachi.gif",
  },
  ur: {
    title: "KW&SC میں کیریئرز",
    subtitle: "کراچی کو صاف پانی اور موثر سیوریج خدمات فراہم کرنے کے ہمارے مشن میں شامل ہوں۔",
    backgroundImage: "/teentalwarkarachi.gif",
  }
};

function getHeroContent(lang = 'en') {
  return HERO_CONTENT[lang] || HERO_CONTENT.en;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

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
        });

        const hero = getHeroContent(lang);

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
