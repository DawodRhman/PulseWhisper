import React from "react";
import Main from "@/components/Main";
import Whoarewe from "@/components/Whoarewe";
import WorkFlow from "@/components/Workflow";
import Counter from "@/components/Counter";
import KWSCMap from "@/components/KWSCMAP";
import NewsUpdate from "@/components/NewsUpdate";
import Projects from "@/components/Projects";
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
      {dynamicSections.length > 0 && <PageRenderer sections={dynamicSections} />}
      <Whoarewe />
      <NewsUpdate />
      <Projects projects={homeData.projects} />

      <KWSCMap />
      <WorkFlow steps={homeData.workflow} />
      <Counter stats={homeData.counters} />
    </>
  );
}

