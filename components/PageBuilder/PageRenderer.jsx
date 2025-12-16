import React from "react";
import GenericHero from "./GenericHero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import OurLeadership from "@/components/OurLeadership";
import Faqs from "@/components/Faqs";
import MediaGallery from "@/components/MediaGallery";
import Subscribe from "@/components/Subscribe";
import Career from "@/components/Career";
import Tenders from "@/components/Tenders";
import WhatWeDo from "@/components/WhatWeDo";
import NewsUpdate from "@/components/NewsUpdate";
import Rti from "@/components/Rti";
import Watertodaysection from "@/components/Watertodaysection";
import Contact from "@/components/Contact";
import Education from "@/components/Education";
import WorkWithUs from "@/components/Workwithus";
import Achievement from "@/components/Achievement";
import Heritage from "@/components/Heritage";
import DynamicLoader from "./DynamicLoader";
import Whoarewe from "@/components/Whoarewe";
import KWSCMap from "@/components/KWSCMAP";
import Counter from "@/components/Counter";
import Workflow from "@/components/Workflow";


// A simple generic text block component
const TextBlock = ({ heading, body }) => {
  // Use Heritage component for heritage sections
  if (heading && heading.toLowerCase().includes("heritage")) {
    return <Heritage heading={heading} body={body} />;
  }

  const normalizedBody = React.useMemo(() => {
    if (!body || typeof body !== "string") return body;

    // Backend content may contain React-only tags (e.g., <Fade>, <Image>) inside stored HTML.
    // Strip/convert them so the layout still renders in the browser.
    let html = body;

    // Remove <Fade ...> wrappers.
    html = html.replace(/<\s*Fade[^>]*>/gi, "");
    html = html.replace(/<\s*\/\s*Fade\s*>/gi, "");

    // Convert Next <Image ... /> to plain <img ... />.
    html = html.replace(/<\s*Image\b([^>]*)\/>/gi, "<img$1 />");
    html = html.replace(/<\s*Image\b([^>]*)>(.*?)<\s*\/\s*Image\s*>/gis, "<img$1 />");

    return html;
  }, [body]);

  const looksLikeFullSectionMarkup = typeof normalizedBody === "string" && /<\s*section\b/i.test(normalizedBody);

  // Default styled text block for other TEXT_BLOCK sections
  if (looksLikeFullSectionMarkup) {
    return (
      <div
        dangerouslySetInnerHTML={{ __html: normalizedBody }}
      />
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {heading && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-gray-900 text-center">
            {heading}
          </h2>
        )}
        {normalizedBody && (
          <div dangerouslySetInnerHTML={{ __html: normalizedBody }} />
        )}
      </div>
    </section>
  );
};

const COMPONENT_MAP = {
  HERO: GenericHero,
  TEXT_BLOCK: TextBlock,
  SERVICES: Services,
  PROJECTS: Projects,
  LEADERSHIP: OurLeadership,
  FAQ: Faqs,
  MEDIA_GALLERY: MediaGallery,
  SUBSCRIBE: Subscribe,
  HERITAGE: Heritage,
  ACHIEVEMENTS: Achievement,
  WORKWITHUS: WorkWithUs,
  CAREERS: Career,
  TENDERS: Tenders,
  WORKFLOW: Workflow,
  WHAT_WE_DO: WhatWeDo,
  NEWS: NewsUpdate,
  RTI: Rti,
  WATER_TODAY: Watertodaysection,
  CONTACT: Contact,
  EDUCATION: Education,
  DYNAMIC_CONTENT: DynamicLoader,
  WHO_ARE_WE: Whoarewe,
  MAP: KWSCMap,
  COUNTER: Counter,
};

export default function PageRenderer({ sections, contextData }) {
  if (!sections || sections.length === 0) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Content Not Available</h2>
        <p className="text-gray-600">This page is currently under construction or has no content.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full">
      {sections.map((section) => {
        const Component = COMPONENT_MAP[section.type];
        if (!Component) {
          console.warn(`Unknown section type: ${section.type}`);
          return null;
        }

        // Inject context data for specific components if available
        let extraProps = {};
        if (contextData) {
          if (section.type === "PROJECTS") extraProps.projects = contextData.projects;
          if (section.type === "COUNTER") extraProps.stats = contextData.counters;
          if (section.type === "WORKFLOW") extraProps.steps = contextData.workflow;
        }

        return <Component key={section.id || Math.random()} {...section.content} {...extraProps} />;
      })}
    </div>
  );
}
