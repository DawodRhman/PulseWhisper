"use client";

import React from "react";


const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function GenericHero({ title, subtitle, backgroundImage }) {

  // Use provided image or fallback to a default
  const bgImage = backgroundImage || "/9.gif";

  return (
    <section className="relative h-[100vh] transition-opacity duration-700 bg-cover bg-center flex justify-center items-center overflow-hidden text-white" 
  style={{ backgroundImage: `url(${bgImage})` }}>
      

      <div className="absolute inset-0 bg-slate-900/80 z-0"></div>


      <div className="absolute inset-0 tech-grid-bg opacity-30 z-0"></div>

      <div className="relative z-[1] w-full max-w-3xl mx-auto text-center px-4 py-4">


        {title && (
          <h2
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-tight"
            style={{ fontFamily: 'Roboto, sans-serif' }}
          >
            {title}
          </h2>
        )}

        {subtitle && (
          <p className="mt-2 sm:mt-3 md:mt-4 text-sm sm:text-base md:text-lg text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
          </p>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
    </section >
  );
}
