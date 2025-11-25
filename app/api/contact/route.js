import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";

const HERO_CONTENT = {
  title: "Contact KW&SC",
  subtitle:
    "Reach our helpline, digital correspondence cell, or the regional teams that keep Karachi supplied every day.",
  backgroundImage: "/teentalwarkarachi.gif",
};

function buildMapEmbedUrl(latitude, longitude) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  const coords = `${latitude},${longitude}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(coords)}&z=14&output=embed`;
}

function serializeChannel(channel) {
  return {
    id: channel.id,
    label: channel.label,
    description: channel.description,
    phone: channel.phone,
    email: channel.email,
    availability: channel.availability,
  };
}

function serializeOffice(office) {
  return {
    id: office.id,
    label: office.label,
    address: office.address,
    latitude: office.latitude,
    longitude: office.longitude,
    phone: office.phone,
    email: office.email,
    hours: office.hours,
    mapEmbedUrl: buildMapEmbedUrl(office.latitude, office.longitude),
  };
}

export async function GET() {
  try {
    const { data, stale } = await resolveWithSnapshot(
      SnapshotModule.CONTACT,
      async () => {
        const [channels, offices] = await Promise.all([
          prisma.contactChannel.findMany({ orderBy: { createdAt: "asc" } }),
          prisma.officeLocation.findMany({ orderBy: { createdAt: "asc" } }),
        ]);

        const hero = HERO_CONTENT;

        const seo = await resolvePageSeo({
          canonicalUrl: "/contact",
          fallback: {
            title: `${hero.title} | Karachi Water & Sewerage Corporation`,
            description: hero.subtitle,
            ogImageUrl: hero.backgroundImage,
          },
        });

        return {
          hero,
          channels: channels.map(serializeChannel),
          offices: offices.map(serializeOffice),
          seo,
        };
      }
    );

    return NextResponse.json({ data, meta: { stale } });
  } catch (error) {
    console.error("GET /api/contact", error);
    return NextResponse.json(
      { error: "Failed to load contact data" },
      { status: 500 }
    );
  }
}
