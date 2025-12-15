import React from "react";
import Whoarewe from "@/components/Whoarewe";
import Main from "@/components/Main";
import WorkFlow from "@/components/Workflow";
import Services from "@/components/Services";
import Counter from "@/components/Counter";
import Subscribe from "@/components/Subscribe";
import KWSCMap from "@/components/KWSCMAP";
import NewsUpdate from "@/components/NewsUpdate";
import Projects from "@/components/Projects";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";

export const dynamic = "force-dynamic";

export default async function Home() {
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);

  return (
    <>
      <Main hero={homeData.hero} />
      <Whoarewe />
      <NewsUpdate />
      <Projects projects={homeData.projects} />

      <KWSCMap />
      <WorkFlow steps={homeData.workflow} />
      <Counter stats={homeData.counters} />
    </>
  );
}

