"use client";
import React, { useEffect, useMemo, useState } from "react";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";
import { useTranslation } from "react-i18next";

const FALLBACK_ACHIEVEMENTS = [
  {
    title: "Hydrant Management Cell",
    description:
      "Established comprehensive hydrant management system to combat illegal water connections.",
    icon: "/icon/airdrop.png",
    year: "2024",
  },
  {
    title: "Global Water Summit 2024",
    description:
      "Represented Pakistan at the prestigious Global Water Summit in London.",
    icon: "/icon/people.png",
    year: "2024",
  },
  {
    title: "Rangers Partnership",
    description:
      "Joined forces with Pakistan Rangers to combat illegal hydrants and water theft.",
    icon: "/icon/microphone.png",
    year: "2024",
  },
  {
    title: "Fareeda Salam Center",
    description:
      "Established community development center to engage with local communities.",
    icon: "/icon/user-icon.png",
    year: "2024",
  },
  {
    title: "Grievance Redressal",
    description:
      "Introduced comprehensive GRM cell to address customer complaints.",
    icon: "/icon/clipboar02.svg",
    year: "2024",
  },
  {
    title: "Digital Transformation",
    description:
      "Implemented online billing, mobile apps, and automated systems.",
    icon: "/icon/medal-star.svg",
    year: "2024",
  },
];

const DEFAULT_ICON = "/icon/medal-star.svg";

function normalizeAchievements(items) {
  const source =
    Array.isArray(items) && items.length ? items : FALLBACK_ACHIEVEMENTS;

  return source.map((achievement, index) => ({
    id: achievement.id || achievement.title || `achievement-${index}`,
    title: achievement.title,
    description: achievement.description || achievement.summary || "",
    icon:
      achievement.icon ||
      FALLBACK_ACHIEVEMENTS[index % FALLBACK_ACHIEVEMENTS.length]?.icon ||
      DEFAULT_ICON,
    year: achievement.year || achievement.metric || "",
  }));
}

export default function AchievementComponent({ items }) {
  const { i18n } = useTranslation();
  const [fetched, setFetched] = useState(null);

  const achievements = useMemo(
    () => normalizeAchievements(items && items.length ? items : fetched),
    [items, fetched]
  );

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const langParam = i18n.language === "ur" ? "?lang=ur" : "?lang=en";
        const res = await fetch(`/api/papa/achievements${langParam}`);
        if (!res.ok) return;
        const json = await res.json().catch(() => null);
        if (!json?.data) return;
        if (!canceled) setFetched(json.data);
      } catch {
        // fallback data used
      }
    })();
    return () => {
      canceled = true;
    };
  }, [i18n.language]);

  return (
    <section className="min-h-screen bg-[#020617] py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden font-sans">
      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Section Header */}
        <div className="mb-12 md:mb-16 text-center">
          <Fade direction="down" triggerOnce duration={800}>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight mb-4">
              Our Achievements
            </h2>
            <p className="text-slate-400 text-base sm:text-lg md:text-xl max-w-2xl mx-auto font-light">
              Celebrating milestones and excellence in water & sewerage
              management
            </p>
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
                className="group relative bg-slate-800/40 backdrop-blur-xl rounded-2xl p-6 md:p-8 
                           border border-slate-700/50 
                           transition-all duration-300 
                           hover:-translate-y-2 
                           hover:bg-slate-800/60
                           h-full flex flex-col"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 bg-slate-700/50 rounded-xl flex items-center justify-center border border-slate-600">
                    <Image
                      src={achievement.icon}
                      width={28}
                      height={28}
                      alt={achievement.title}
                      className="invert opacity-90"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 flex flex-col">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">
                    {achievement.title}
                  </h3>
                  <p className="text-sm md:text-base text-slate-300 leading-relaxed flex-1">
                    {achievement.description}
                  </p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </div>
    </section>
  );
}
