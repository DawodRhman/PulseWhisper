import React from 'react';
import prisma from '@/lib/prisma';
import content from '@/data/static/content';
import MediaGrid from '@/components/MediaGrid';

export const dynamic = "force-dynamic";

const MEDIA_SELECT = {
  id: true,
  url: true,
  label: true,
  altText: true,
  width: true,
  height: true,
  mimeType: true,
};

function fallbackMediaGallery() {
  return (content.mediaGallery || []).map((item, index) => ({
    id: `gallery-item-${index}`,
    title: item.title,
    caption: item.caption,
    imageUrl: item.imageUrl,
    mimeType: item.mimeType,
    albumSlug: "highlights",
  }));
}

async function getMediaItems() {
  try {
    const mediaItems = await prisma.mediaItem.findMany({
      include: {
        media: { select: MEDIA_SELECT },
        album: { select: { id: true, title: true, slug: true } },
      },
      orderBy: { order: "asc" },
      take: 100,
    });

    if (mediaItems.length === 0) {
      return fallbackMediaGallery();
    }

    return mediaItems.map((item) => ({
      id: item.id,
      title: item.media?.label || item.album?.title || "Media item",
      caption: item.caption,
      credit: item.credit,
      imageUrl: item.media?.url,
      mimeType: item.media?.mimeType,
      albumSlug: item.album?.slug,
    }));
  } catch (error) {
    console.error("Failed to fetch media items:", error);
    return fallbackMediaGallery();
  }
}

export const metadata = {
  title: 'Media Gallery | KW&SC',
  description: 'Explore the latest photos and videos from Karachi Water & Sewerage Corporation.',
};

export default async function MediaPage() {
  const items = await getMediaItems();

  return (
    <main className="min-h-screen bg-slate-50 py-20 md:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Media Gallery</h1>
          <p className="mt-4 text-lg text-slate-600">
            Visual highlights of our projects, events, and initiatives across Karachi.
          </p>
        </div>

        <MediaGrid items={items} />
      </div>
    </main>
  );
}
