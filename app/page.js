import React from "react";
import Main from "@/components/Main";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";
import PageRenderer from "@/components/PageBuilder/PageRenderer";
import { recursivelyLocalizeContent } from "@/lib/utils";

export default async function Home({ searchParams }) {
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);
  const resolvedSearchParams = await searchParams; // searchParams is a promise in newer Next.js versions
  const lang = resolvedSearchParams?.lang || 'en';

  const rawSections = homeData.sections?.filter((s) => s.type !== "HERO") || [];

  // Localize sections
  const localizedSections = rawSections.map(section => {
    const localizedContent = recursivelyLocalizeContent(section.content, lang);
    return {
      ...section,
      content: localizedContent
    };
  });

  // Localize context data (projects, counters, etc.)
  const localizedContext = recursivelyLocalizeContent(homeData, lang);

  return (
    <>
      <Main hero={homeData.hero} />
      {localizedSections.length > 0 && <PageRenderer sections={localizedSections} contextData={localizedContext} />}
    </>
  );
}
export const dynamic = "force-dynamic";
