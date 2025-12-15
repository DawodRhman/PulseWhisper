"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

const FALLBACK_ACHIEVEMENTS = [
  {
    title: "Hydrant Management Cell",
    description: "Established comprehensive hydrant management system to combat illegal water connections.",
    icon: "/icon/airdrop.png",
    year: "2024",
  },
  {
    title: "Global Water Summit 2024",
    description: "Represented Pakistan at the prestigious Global Water Summit in London.",
    icon: "/icon/people.png",
    year: "2024",
  },
  {
    title: "Rangers Partnership",
    description: "Joined forces with Pakistan Rangers to combat illegal hydrants and water theft.",
    icon: "/icon/microphone.png",
    year: "2024",
  },
  {
    title: "Fareeda Salam Center",
    description: "Established community development center to engage with local communities.",
    icon: "/icon/user-icon.png",
    year: "2024",
  },
  {
    title: "Grievance Redressal",
    description: "Introduced comprehensive GRM cell to address customer complaints.",
    icon: "/icon/clipboar02.svg",
    year: "2024",
  },
  {
    title: "Digital Transformation",
    description: "Implemented online billing, mobile apps, and automated systems.",
    icon: "/icon/medal-star.svg",
    year: "2024",
  },
];

const DEFAULT_ICON = "/icon/medal-star.svg";

function normalizeAchievements(items) {
  const source = Array.isArray(items) && items.length ? items : FALLBACK_ACHIEVEMENTS;
  return source.map((achievement, index) => ({
    id: achievement.id || achievement.title || `achievement-${index}`,
    title: achievement.title,
    description: achievement.description || achievement.summary || "",
    icon: achievement.icon || FALLBACK_ACHIEVEMENTS[index % FALLBACK_ACHIEVEMENTS.length]?.icon || DEFAULT_ICON,
    year: achievement.year || achievement.metric || "",
  }));
}

export default function AchievementComponent({ items }) {
  const [fetched, setFetched] = useState(null);
  const achievements = useMemo(
    () => normalizeAchievements(items && items.length ? items : fetched),
    [items, fetched]
  );

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const res = await fetch("/api/papa/achievements");
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (!json?.data) return;
        if (!canceled) setFetched(json.data);
      } catch {
        // swallow: fallback data will be used
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <section className="min-h-screen bg-[#020617] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none mix-blend-screen"></div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <Fade direction="down" triggerOnce duration={800}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
              KW&SC <span className="text-cyan-400 bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Achievements</span>
            </h2>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light">
              Celebrating milestones and excellence in water & sewerage management
            </p>
            <div className="h-1.5 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto mt-6 rounded-full shadow-[0_0_20px_rgba(6,182,212,0.6)]"></div>
          </Fade>
        </div>

        {/* Achievements Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {achievements.map((achievement, index) => (
            <Fade
              key={achievement.id || index}
              direction="up"
              triggerOnce
              duration={600}
              delay={index * 100}
            >
              <div
                className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 border border-slate-700/50 
                           transition-all duration-500 hover:-translate-y-2 hover:bg-slate-800/60
                           hover:border-cyan-400/60 hover:shadow-[0_20px_40px_rgba(6,182,212,0.15),0_0_30px_rgba(6,182,212,0.1)] 
                           h-full flex flex-col overflow-hidden"
              >
                {/* Animated Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-blue-500/0 to-purple-500/0 group-hover:from-cyan-500/5 group-hover:via-blue-500/5 group-hover:to-purple-500/5 transition-all duration-500 rounded-2xl"></div>

                {/* Corner Accents */}
                <div className="absolute top-0 right-0 w-16 h-16 border-t border-r border-cyan-500/30 rounded-tr-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 border-b border-l border-cyan-500/30 rounded-bl-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                {/* Icon Container */}
                <div className="relative mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative">
                      <div className="absolute inset-0 bg-cyan-500/20 rounded-xl blur-xl group-hover:bg-cyan-500/30 transition-all duration-500"></div>
                      <div className="relative w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl flex items-center justify-center border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-500">
                        <Image
                          src={achievement.icon}
                          width={28}
                          height={28}
                          alt={achievement.title}
                          className="invert opacity-90 group-hover:opacity-100 transition-opacity duration-300"
                        />
                      </div>
                    </div>

                  </div>
                </div>

                {/* Content */}
                <div className="relative flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 group-hover:text-cyan-100 transition-colors duration-300 leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed group-hover:text-slate-200 transition-colors duration-300 flex-1">
                    {achievement.description}
                  </p>
                </div>

                {/* Bottom Accent Line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-500/40 to-transparent group-hover:via-cyan-400/80 transition-all duration-500"></div>

                {/* Shine Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 rounded-2xl"></div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
