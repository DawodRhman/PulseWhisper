"use client";
import React, { useEffect, useRef, useState } from "react";

const WhoAreWe = () => {
  const sectionRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Activate animation when section enters middle of viewport
      if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.4) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // KW&SC Services Tiles
  const services = [
    {
      title: "Complaint Management",
      desc: "Raise and track complaints regarding water supply, sewerage issues, billing discrepancies, and illegal connections.",
    },
    {
      title: "New Connection",
      desc: "Apply online for new water or sewerage connections through KW&SC's official portal or local office.",
    },
    {
      title: "Bill Generation",
      desc: "Access, view, and download your water and sewerage bills using your consumer number anytime.",
    },
    {
      title: "Online Tanker Booking",
      desc: "Request water tankers online for areas without piped water supply to ensure timely delivery.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-gray-100 px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20 overflow-hidden"
    >
      <div className="w-full mx-auto relative">
        <div
          className={`
            flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12
            transition-all duration-1000 ease-out
          `}
        >
          {/* LEFT - Heading */}
          <div
            className={`
              w-full md:w-1/2
              transform transition-all duration-1000 ease-out
              ${isActive ? "translate-x-0 opacity-100 text-left" : "translate-x-1/2 opacity-100 text-center md:text-left"}
            `}
          >
            <h2
              className={`
                text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-blue-900
                transition-all duration-1000 ease-out
                leading-tight md:leading-normal
                ${isActive ? "text-left" : "text-center md:text-left"}
              `}
            >
              OUR SERVICES
            </h2>
          </div>

          {/* RIGHT - Tiles */}
          <div
            className={`
              w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6
              transition-all duration-1000 ease-out
              ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
          >
            {services.map((item, i) => (
              <div
                key={i}
                className={`
                  p-4 sm:p-5 md:p-6 lg:p-7 rounded-lg sm:rounded-xl bg-white/80 shadow-md hover:shadow-xl transition-all duration-500 ease-out
                  hover:-translate-y-1 cursor-pointer
                  ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
                `}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
              >
                <p className="font-semibold text-blue-900 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{item.title}</p>
                <p className="text-gray-700 text-xs sm:text-sm md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
