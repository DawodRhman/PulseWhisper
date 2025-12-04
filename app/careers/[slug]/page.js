import React from "react";
import { notFound } from "next/navigation";
import prisma from "@/lib/prisma";
import CareerDetailsClient from "@/components/CareerDetailsClient";

export const dynamic = "force-dynamic";

async function getCareer(slug) {
  const opening = await prisma.careerOpening.findUnique({
    where: { slug },
    include: {
      requirements: {
        orderBy: { order: "asc" },
      },
      seo: true,
    },
  });

  if (!opening) return null;

  return {
    ...opening,
    qualifications: opening.requirements
      .filter((req) => req.type === "QUALIFICATION")
      .map((req) => req.content),
    responsibilities: opening.requirements
      .filter((req) => req.type === "RESPONSIBILITY")
      .map((req) => req.content),
  };
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const job = await getCareer(slug);

  if (!job) {
    return {
      title: "Job Not Found",
    };
  }

  return {
    title: `${job.title} - Careers at KW&SC`,
    description: job.summary,
    openGraph: {
      title: `${job.title} - Careers at KW&SC`,
      description: job.summary,
    },
  };
}

export default async function CareerPage({ params }) {
  const { slug } = await params;
  const job = await getCareer(slug);

  if (!job) {
    notFound();
  }

  return <CareerDetailsClient job={job} />;
}
