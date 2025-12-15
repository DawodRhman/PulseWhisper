import React from "react";
import Main from "@/components/Main";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";
import PageRenderer from "@/components/PageBuilder/PageRenderer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);
  const dynamicSections = homeData.sections?.filter((s) => s.type !== "HERO") || [];

  return (
    <>
      <Main hero={homeData.hero} />
      {dynamicSections.length > 0 && <PageRenderer sections={dynamicSections} contextData={homeData} />}
    </>
  );
}

