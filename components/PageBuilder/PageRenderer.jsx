import React from "react";
import GenericHero from "./GenericHero";
import Services from "@/components/Services";
import Projects from "@/components/Projects";
import OurLeadership from "@/components/OurLeadership";
import Faqs from "@/components/Faqs";
import MediaGallery from "@/components/MediaGallery";
import Subscribe from "@/components/Subscribe";
import GenericCardGrid from "./GenericCardGrid";

// A simple generic text block component
const TextBlock = ({ content }) => {
  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {content.heading && (
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">
          {content.heading}
        </h2>
      )}
      {content.body && (
        <div 
          className="prose max-w-none text-gray-600 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: content.body }} 
        />
      )}
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
  CARD_GRID: GenericCardGrid,
};

export default function PageRenderer({ sections }) {
  if (!sections || sections.length === 0) {
    return null;
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

