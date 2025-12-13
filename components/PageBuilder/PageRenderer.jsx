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


// A simple generic text block component
const TextBlock = ({ heading, body }) => {
  // Use Heritage component for heritage sections
  if (heading && heading.toLowerCase().includes("heritage")) {
    return <Heritage heading={heading} body={body} />;
  }

  // Default styled text block for other TEXT_BLOCK sections
  return (
    <section className="min-h-screen bg-[#020617] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {heading && (
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-white text-center">
            {heading}
          </h2>
        )}
        {body && (
          <div 
            className="prose prose-invert max-w-none text-slate-300 leading-relaxed
              prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-cyan-400 prose-a:no-underline hover:prose-a:text-cyan-300"
            dangerouslySetInnerHTML={{ __html: body }}
          />
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
  ACHIEVEMENTS: Achievement,
  WORKWITHUS: WorkWithUs,
  CAREERS: Career,
  TENDERS: Tenders,
  WORKFLOW: WhatWeDo,
  NEWS: NewsUpdate,
  RTI: Rti,
  WATER_TODAY: Watertodaysection,
  CONTACT: Contact,
  EDUCATION: Education,
};

export default function PageRenderer({ sections }) {
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

        // Pass the content object as props to the component
        // For components that don't take props (like Services which might fetch its own data),
        // these extra props will just be ignored, which is fine.
        return <Component key={section.id || Math.random()} {...section.content} />;
      })}
    </div>
  );
}
