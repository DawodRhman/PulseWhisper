"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

// NOTE: Since the user provided the code with the Image import and icon paths, 
// we must use them, but the styling below is designed to make them look futuristic.

export default function Achievements() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loaderTimeline = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    loaderTimeline
      .fromTo(
        ".loader",
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.5, ease: "power2.inOut" }
      )
      .to(".loader", {
        scaleY: 0,
        transformOrigin: "0% -100%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        ".wrapper",
        { y: "-100%", ease: "power4.inOut", duration: 1 },
        "-=0.8"
      );
  }, []);

  const achievements = [
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

  return (
    <>
      {loading && <Loader />}

      {/* 1. Futuristic Hero Section */}
      <section className={`relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-gray-900 text-white flex justify-center items-center overflow-hidden`}>
        {/* Background Effect: Subtle Glitch/Grid Pattern */}
        <div className="absolute inset-0 z-0 opacity-10 bg-[url('/abstract-lines.svg')]"></div>
        <div className="absolute inset-0 bg-blue-900/40 z-0"></div>

        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <Fade direction="up" cascade damping={0.1} triggerOnce duration={1000}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight tracking-tight">
                MILESTONES
                <span className="block mt-2 sm:mt-3 md:mt-4 bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-300">
                  ACHIEVED
                </span>
              </h2>
              <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl text-blue-200/90 font-light font-mono leading-relaxed">
                EVOLVING KARACHI'S INFRASTRUCTURE
              </p>
            </Fade>
          </div>
        </div>
      </section>

      {/* 2. Achievements Grid Section (Futuristic Dark Body) */}
      <div className="bg-gray-900 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-extrabold text-white mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                Our Digital & Infrastructural Feats
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl text-gray-400 max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto font-mono">
                KW&SC has implemented next-generation solutions for service delivery and governance.
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
            {achievements.map((achievement, index) => (
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
                    <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-extrabold text-white mb-2 sm:mb-3 md:mb-4 mt-2 sm:mt-3 md:mt-4 tracking-wide">
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
    </>
  );
}