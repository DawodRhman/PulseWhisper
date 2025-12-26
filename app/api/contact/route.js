import { NextResponse } from "next/server";
import { SnapshotModule } from "@prisma/client";
import prisma from "@/lib/prisma";
import { resolveWithSnapshot } from "@/lib/cache";
import { resolvePageSeo } from "@/lib/seo";
import content from "@/data/static/content";
import { resolveLocalizedContent } from "@/lib/utils";
import { z } from "zod";

export const dynamic = "force-dynamic";

import { CONTACT_TRANSLATIONS } from "@/lib/translations";

const contactSchema = z.object({
  name: z.string().optional(),
  email: z.string().email("Invalid email address").optional().or(z.literal("")),
  mobile: z.string().optional(),
  category: z.string().optional(),
  message: z.string().min(1, "Message is required"),
});

function getHeroContent(lang = 'en') {
  const translations = CONTACT_TRANSLATIONS[lang] || CONTACT_TRANSLATIONS.en;
  return translations.hero;
}

function buildMapEmbedUrl(latitude, longitude) {
  if (typeof latitude !== "number" || typeof longitude !== "number") {
    return null;
  }

  const coords = `${latitude},${longitude}`;
  return `https://www.google.com/maps?q=${encodeURIComponent(coords)}&z=14&output=embed`;
}

function serializeChannel(channel) {
  // Always use English keys for defaults, but append Urdu
  const enData = CONTACT_TRANSLATIONS.en;
  const urData = CONTACT_TRANSLATIONS.ur;

  return {
    id: channel.id || channel.label,
    label: enData.channels[channel.label] || channel.label,
    labelUr: urData.channels[channel.label] || channel.label,
    description: enData.channelDescriptions[channel.label] || channel.description,
    descriptionUr: urData.channelDescriptions[channel.label] || channel.description,
    phone: channel.phone,
    email: channel.email,
    availability: channel.availability,
  };
}

function serializeOffice(office) {
  const enData = CONTACT_TRANSLATIONS.en;
  const urData = CONTACT_TRANSLATIONS.ur;

  return {
    id: office.id || office.label,
    label: enData.offices[office.label] || office.label,
    labelUr: urData.offices[office.label] || office.label,
    address: enData.addresses[office.address] || office.address,
    addressUr: urData.addresses[office.address] || office.address,
    latitude: office.latitude,
    longitude: office.longitude,
    phone: office.phone,
    email: office.email,
    hours: office.hours,
    mapEmbedUrl: buildMapEmbedUrl(office.latitude, office.longitude),
  };
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';

    const { data: snapshotData, stale } = await resolveWithSnapshot(
      SnapshotModule.CONTACT,
      async () => {
        let channels = [];
        let offices = [];

        try {
          [channels, offices] = await Promise.all([
            prisma.contactChannel.findMany({ orderBy: { createdAt: "asc" } }),
            prisma.officeLocation.findMany({ orderBy: { createdAt: "asc" } }),
          ]);
        } catch (dbError) {
          console.warn("⚠️ Database unreachable in contact API. Using fallback data.");
          channels = content.contact?.channels || [];
          offices = content.contact?.offices || [];
        }

        return {
          channels: channels.map(channel => serializeChannel(channel)),
          offices: offices.map(office => serializeOffice(office)),
        };
      }
    );

    const hero = getHeroContent(lang);

    const seo = await resolvePageSeo({
      canonicalUrl: "/contact",
      fallback: {
        title: `${hero.title} | Karachi Water & Sewerage Corporation`,
        description: hero.subtitle,
        ogImageUrl: hero.backgroundImage,
      },
    });

    const normalizedChannels = (snapshotData.channels || []).map(c => resolveLocalizedContent(c, lang));
    const normalizedOffices = (snapshotData.offices || []).map(o => resolveLocalizedContent(o, lang, ['label', 'address']));

    return NextResponse.json({
      data: {
        hero,
        channels: normalizedChannels,
        offices: normalizedOffices,
        seo,
      },
      meta: { stale }
    });
  } catch (error) {
    console.error("GET /api/contact", error);
    // Return fallback on total failure
    const { searchParams } = new URL(request.url);
    const lang = searchParams.get('lang') || 'en';
    const hero = getHeroContent(lang);

    // Fallback logic
    const channels = content.contact?.channels || [];
    const offices = content.contact?.offices || [];

    // We should normalize fallbacks too if possible, but keep it simple for catch block
    return NextResponse.json({
      data: {
        hero,
        channels: channels.map(c => resolveLocalizedContent({ ...c, ...serializeChannel(c) }, lang)), // Attempt to serialize then normalize
        offices: offices.map(o => resolveLocalizedContent({ ...o, ...serializeOffice(o) }, lang)),
        seo: null
      },
      meta: { stale: true }
    });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Validate with Zod
    const { name, email, mobile, category, message } = contactSchema.parse(body);

    await prisma.feedbackSubmission.create({
      data: {
        name,
        email,
        subject: category,
        message: `${message} \n\n Mobile: ${mobile || 'Not provided'}`,
        source: "Contact Page",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid form data", details: error.flatten() }, { status: 400 });
    }
    console.error("POST /api/contact", error);
    return NextResponse.json({ error: "Failed to submit feedback" }, { status: 500 });
  }
}

