"use client";
import React from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";
import { sanitize } from "@/lib/utils";

export default function Heritage({ heading, body }) {
  // Parse body HTML if it exists, otherwise use default structure
  const hasCustomHTML = body && body.trim().length > 0;

  // If body contains full HTML section (from admin panel), render it directly
  if (hasCustomHTML && (body.includes("<section") || body.includes("bg-black"))) {
    return (
      <div
        className="w-full"
        dangerouslySetInnerHTML={{ __html: sanitize(body) }}
      />
    );
  }

  // Extract content from seed.js HTML format using regex (SSR-safe)
  let extractedContent = null;
  if (hasCustomHTML) {
    // Extract h3 title
    const h3Match = body.match(/<h3[^>]*>(.*?)<\/h3>/i);
    const title = h3Match ? h3Match[1].replace(/<[^>]+>/g, '').trim() : null;

    // Extract paragraphs
    const pMatches = body.match(/<p[^>]*>(.*?)<\/p>/gi);
    const paragraphs = pMatches ? pMatches.map(p => p.replace(/<[^>]+>/g, '').trim()) : [];

    if (title || paragraphs.length > 0) {
      extractedContent = {
        title,
        paragraphs
      };
    }
  }

  // Otherwise, render with our styled component
  return (
    <section className="min-h-screen bg-[#020617] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none mix-blend-screen"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Badge */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12">
          <Fade direction="down" triggerOnce duration={1000}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800/50 border border-cyan-500/30 text-cyan-300 text-xs sm:text-sm font-medium shadow-lg backdrop-blur-sm">
              <Image
                src="/icon/magic-black.svg"
                width={16}
                height={16}
                alt="Heritage Icon"
                className="invert opacity-80"
              />
              <span>About Us</span>
            </div>
          </Fade>
        </div>

        {/* Heading */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-12 sm:mb-16 md:mb-20">
          <div className="hidden md:block w-20 md:w-32 lg:w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
          <Fade direction="down" triggerOnce duration={1200}>
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white tracking-tight whitespace-nowrap">
              {heading || "KW&SC Heritage"}
            </h1>
          </Fade>
          <div className="hidden md:block w-20 md:w-32 lg:w-40 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent"></div>
        </div>

        {/* Content */}
        <div className="flex flex-col md:flex-row gap-8 md:gap-12 lg:gap-16 xl:gap-20">
          {/* Left Column - Main Heading */}
          <div className="flex-1 w-full">
            <Fade direction="left" triggerOnce duration={1200}>
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight md:leading-snug mb-6 md:mb-0">
                {extractedContent?.title || "How KW&SC is Setting New Standards in Water & Sewerage Services for Karachi"}
              </h2>
            </Fade>
          </div>

          {/* Right Column - Description */}
          <div className="flex-1 w-full">
            <Fade direction="right" triggerOnce duration={1000}>
              {extractedContent ? (
                <div className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed space-y-4 md:space-y-6">
                  {extractedContent.paragraphs.map((text, idx) => (
                    <p key={idx}>{text}</p>
                  ))}
                </div>
              ) : hasCustomHTML ? (
                <div
                  className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed space-y-4 md:space-y-6 prose prose-invert max-w-none
                    prose-headings:text-white prose-p:text-slate-300 prose-p:leading-relaxed
                    prose-h3:text-2xl prose-h3:font-bold prose-h3:text-white prose-h3:mb-4"
                  dangerouslySetInnerHTML={{ __html: body }}
                />
              ) : (
                <div className="text-slate-300 text-base sm:text-lg md:text-xl leading-relaxed space-y-4 md:space-y-6">
                  <p>
                    At KW&SC, we strive to provide clean, safe drinking water and efficient sewerage services to all residents of Karachi. Our commitment to excellence and innovation enables us to deliver reliable solutions tailored to the city's needs.
                  </p>
                  <p>
                    Our mission is to transform KW&SC into a customer-centric, financially autonomous, and technologically advanced water and sewerage utility. We leverage sustainable practices to ensure long-term success and contribute to Karachi's water security and sanitation goals.
                  </p>
                </div>
              )}
            </Fade>
          </div>
        </div>
      </div>
    </section>
  );
}

