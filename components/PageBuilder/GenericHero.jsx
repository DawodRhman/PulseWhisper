"use client";

import React from "react";
import { useTranslation } from "react-i18next";


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function GenericHero({ title, titleUr, subtitle, subtitleUr, backgroundImage, backgroundMeta }) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  // Use uploaded asset (GIF/image) when available, otherwise fall back
  const bgImage = backgroundMeta?.url || backgroundImage || "/9.gif";
  const isVideo =
    backgroundMeta?.mimeType?.startsWith("video/") ||
    (typeof bgImage === "string" && bgImage.match(/\.(mp4)(\?|#|$)/i));

  const displayTitle = (isUrdu && titleUr) ? titleUr : title;
  const displaySubtitle = (isUrdu && subtitleUr) ? subtitleUr : subtitle;

  return (
    <section
      className="relative h-[70vh] transition-opacity duration-700 bg-cover bg-center flex justify-center items-center overflow-hidden text-white"
      style={isVideo ? undefined : { backgroundImage: `url(${bgImage})` }}
    >

      {isVideo && (
        <video
          className="absolute inset-0 h-full w-full object-cover"
          src={bgImage}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
        />
      )}
      

      <div className="absolute inset-0 bg-slate-900/80 z-0"></div>


      <div className="absolute inset-0 tech-grid-bg opacity-30 z-0"></div>

      <div className="relative z-[1] w-full max-w-3xl mx-auto text-center px-4 py-4">


        {displayTitle && (
          <h2
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white"
          >
            {displayTitle?.toUpperCase()}
          </h2>
        )}

        {displaySubtitle && (
          <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {displaySubtitle}
          </p>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
    </section >
  );
}
