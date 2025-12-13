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
    <div className="w-full z-20 relative px-4 md:px-0">
      {/* Section Header */}
      <div className="mb-10 text-center">
        <Fade direction="down" triggerOnce duration={800}>
          <h3 className="text-2xl md:text-3xl font-bold text-white tracking-wide uppercase">
            KW&SC <span className="text-cyan-400">Achievements</span>
          </h3>
          <div className="h-1 w-20 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_10px_rgba(6,182,212,0.8)]"></div>
        </Fade>
      </div>

      {/* Grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {achievements.map((achievement, index) => (
          <Fade
            key={achievement.id || index}
            direction="up"
            triggerOnce
            duration={600}
            delay={index * 100}
            className="w-full md:w-[48%] lg:w-[30%]"
          >
            <div
              className="group relative bg-gray-900/60 backdrop-blur-md rounded-xl p-6 border border-gray-700/50 
                         transition-all duration-300 hover:-translate-y-1 hover:bg-gray-800/80
                         hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)] h-full"
            >
              {/* Futuristic Corner Accent */}
              <div className="absolute top-0 right-0 w-6 h-6 border-t border-r border-cyan-500/50 rounded-tr-xl opacity-50 group-hover:opacity-100 transition-opacity"></div>

              <div className="flex items-start justify-between mb-4">
                {/* Icon */}
                <div className="w-10 h-10 bg-blue-900/40 rounded-lg flex items-center justify-center border border-blue-500/30 group-hover:border-cyan-400 transition-colors">
                  <Image
                    src={achievement.icon}
                    width={24}
                    height={24}
                    alt={achievement.title}
                    className="invert opacity-80 group-hover:opacity-100 transition-opacity"
                  />
                </div>

                {/* Year Badge */}
                <span className="bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-mono shadow-sm">
                  {achievement.year}
                </span>
              </div>

              {/* Content */}
              <div>
                <h4 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">
                  {achievement.title}
                </h4>
                <p className="text-sm text-gray-300 leading-snug group-hover:text-gray-200">
                  {achievement.description}
                </p>
              </div>

              {/* Bottom Accent Line */}
              <div className="absolute bottom-0 left-6 right-6 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/30 to-transparent group-hover:via-cyan-400/70 transition-all"></div>
            </div>
          </Fade>
        ))}
      </div>
    </div>
  );
}
