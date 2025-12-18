import React from "react";
import Main from "@/components/Main";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";
import PageRenderer from "@/components/PageBuilder/PageRenderer";

export default async function Home({ searchParams }) {
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);

  const rawSections = homeData.sections?.filter((s) => s.type !== "HERO") || [];

  return (
    <>
      <Main hero={homeData.hero} />
      {rawSections.length > 0 && <PageRenderer sections={rawSections} contextData={homeData} />}
    </>
  );
}
export const dynamic = "force-dynamic";
