import React from "react";
import Main from "@/components/Main";
import WorkFlow from "@/components/Workflow";
import Services from "@/components/Services";
import Counter from "@/components/Counter";
import KWSCMap from "@/components/KWSCMAP";
import NewsUpdate from "@/components/NewsUpdate";
import Projects from "@/components/Projects";
import MediaGallery from "@/components/MediaGallery";
import AchievementComponent from "@/components/Achievement";
import OurLeadership from "@/components/OurLeadership";
import { resolveWithSnapshot } from "@/lib/cache";
import { SnapshotModule } from "@prisma/client";
import { buildHomePayload } from "@/lib/home/payload";

export default async function Home() {
  const { data: homeData } = await resolveWithSnapshot(SnapshotModule.HOME, buildHomePayload);

  return (
    <>
      <Main hero={homeData.hero} />
      <Services />
      <NewsUpdate />
      <Projects projects={homeData.projects} />
      <OurLeadership team={homeData.leadership} insights={homeData.leadershipInsights} />
      <AchievementComponent items={homeData.achievements} />
      <KWSCMap />
      <WorkFlow steps={homeData.workflow} />
      <Counter stats={homeData.counters} />
      <MediaGallery items={homeData.mediaCarousel} />
    </>
  );
}
