import React from "react";
import Main from "@/components/Main";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";
import PageRenderer from "@/components/PageBuilder/PageRenderer";

export const dynamic = "force-dynamic";

// Helper to localize content object recursively
function localizeContent(content, lang) {
  if (lang !== 'ur') return content;
  if (!content || typeof content !== 'object') return content;

  if (Array.isArray(content)) {
    return content.map(item => localizeContent(item, lang));
  }

  const newContent = { ...content };
  const keys = Object.keys(newContent);
  
  keys.forEach(key => {
    if (key.endsWith('Ur') && key.length > 2) {
      const baseKey = key.slice(0, -2);
      if (newContent[key]) {
        newContent[baseKey] = newContent[key];
      }
    }
    
    if (typeof newContent[key] === 'object' && newContent[key] !== null) {
      newContent[key] = localizeContent(newContent[key], lang);
    }
  });

  return newContent;
}

export default async function Home({ searchParams }) {
  const resolvedSearchParams = await searchParams;
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);
  
  const rawSections = homeData.sections?.filter((s) => s.type !== "HERO") || [];
  
  const lang = resolvedSearchParams?.lang || 'en';
  const localizedSections = rawSections.map(section => ({
    ...section,
    content: localizeContent(section.content, lang),
  }));

  return (
    <>
      <Main hero={homeData.hero} />
      {localizedSections.length > 0 && <PageRenderer sections={localizedSections} contextData={homeData} />}
    </>
  );
}

