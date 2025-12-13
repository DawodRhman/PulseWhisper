'use client';
import OptimizedImage from "@/components/OptimizedImage";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";
// const FALLBACK_CARDS = [ 
//   {
//     title: "Excellence in Service",
//     body: "Recognized for outstanding performance in water distribution and management across Karachi.",
//     imageUrl: "/bg-1.jpg"
//   },
//   {
//     title: "Innovation Award",
//     body: "Awarded for implementing cutting-edge technology in sewerage treatment and disposal.",
//     imageUrl: "/bg-2.jpg"
//   },
//   {
//     title: "Community Impact",
//     body: "Acknowledged for significant contributions to community health and hygiene awareness.",
//     imageUrl: "/bg-1.jpg"
//   }
// ];
const FALLBACK_CARDS = [
    {
      title: "Hydrant Management Cell",
      description: "Established comprehensive hydrant management system to combat illegal water connections and ensure proper water distribution.",
      icon: "/icon/airdrop.png",
      year: "2024"
    },
    {
      title: "Global Water Summit 2024",
      description: "Represented Pakistan at the prestigious Global Water Summit in London, showcasing KW&SC's innovative water management solutions.",
      icon: "/icon/people.png",
      year: "2024"
    },
    {
      title: "Rangers Partnership",
      description: "Joined forces with Pakistan Rangers to combat illegal hydrants and water theft, ensuring fair water distribution.",
      icon: "/icon/microphone.png",
      year: "2024"
    },
    {
      title: "Fareeda Salam Development Center",
      description: "Established community development center to engage with local communities and improve service delivery.",
      icon: "/icon/user-icon.png",
      year: "2024"
    },
    {
      title: "Grievance Redressal Management",
      description: "Introduced comprehensive GRM cell to address customer complaints and improve service quality.",
      icon: "/icon/clipboar02.svg",
      year: "2024"
    },
    {
      title: "Digital Transformation",
      description: "Implemented digital solutions including online billing, mobile apps, and automated systems for better service delivery.",
      icon: "/icon/medal-star.svg",
      year: "2024"
    }
  ];

const GenericCardGrid = ({ heading, description, cards = [] }) => {
  const displayCards = cards.length > 0 ? cards : FALLBACK_CARDS;

  return (
    <>
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      {(heading || description) && (
        <div className="text-center mb-12">
          {heading && (
            <h2 className="text-4xl font-bold mb-4 text-gray-900">
              {heading}
            </h2>
          )}
          {description && (
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
        </div>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {displayCards.map((card, index) => (
          <div 
            key={index} 
            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100"
          >
            {card.imageUrl && (
              <div className="relative h-48 w-full">
                <OptimizedImage 
                  src={card.imageUrl} 
                  alt={card.title || "Card Image"} 
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-6">
              {card.title && (
                <h3 className="text-xl font-bold mb-3 text-gray-800">
                  {card.title}
                </h3>
              )}
              {card.body && (
                <div 
                  className="text-gray-600 prose prose-sm"
                  dangerouslySetInnerHTML={{ __html: card.body }}
                />
              )}
              {card.linkUrl && (
                <a 
                  href={card.linkUrl} 
                  className="inline-block mt-4 text-blue-600 font-medium hover:text-blue-800 transition-colors"
                >
                  {card.linkText || "Learn More"} &rarr;
                </a>
              )}
            </div>
          </div>
        ))}
      </div> */}

<div className="bg-gray-900 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white mb-4">
                Our Digital & Infrastructural Feats
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-400 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto font-mono">
                KW&SC has implemented next-generation solutions for service delivery and governance.
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {displayCards.map((achievement, index) => (
              <Fade key={index} direction="up" triggerOnce duration={800} delay={index * 150} className="h-full">
                <div
                  className="bg-gray-800/80 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-2xl p-4 sm:p-6 md:p-8 lg:p-10 flex flex-col justify-between h-full 
                             border border-gray-700 transition-all duration-300 relative 
                             hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                >
                  {/* Subtle Corner Accent */}
                  <div className="absolute top-0 right-0 w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8 border-t-2 border-r-2 border-cyan-500 opacity-70"></div>

                  <div className="flex items-center mb-3 sm:mb-4 md:mb-6 gap-2 sm:gap-3">
                    {/* Icon Container with Futuristic Styling */}
                    <div className="w-9 sm:w-10 md:w-12 h-9 sm:h-10 md:h-12 bg-blue-900/50 p-1.5 sm:p-2 rounded-full flex items-center justify-center border border-blue-600 flex-shrink-0">
                      <Image
                        src={achievement.icon}
                        width={32}
                        height={32}
                        alt={achievement.title}
                        className="invert w-6 sm:w-7 md:w-8 h-6 sm:h-7 md:h-8"
                      />
                    </div>

                    {/* Year Tag */}
                    <span className="bg-green-600 text-white px-2 sm:px-3 md:px-4 py-0.5 sm:py-1 rounded-full text-xs sm:text-xs md:text-sm font-bold shadow-lg shadow-green-600/30 whitespace-nowrap">
                      {achievement.year}
                    </span>
                  </div>

                  {/* Title and Description */}
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3 mt-3 tracking-wide">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-400 leading-relaxed text-xs sm:text-sm md:text-base lg:text-base">
                      {achievement.description}
                    </p>
                  </div>

                  {/* Footer Line with Accent */}
                  <div className="mt-4 sm:mt-5 md:mt-6 pt-3 sm:pt-4 md:pt-5 border-t border-cyan-500/30">
                    <span className="text-xs sm:text-xs md:text-xs lg:text-xs font-mono text-cyan-400">
                      // INITIATIVE COMPLETE
                    </span>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>
      
    </section>
    </>
  );
};

export default GenericCardGrid;
