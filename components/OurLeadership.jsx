"use client";
import React, { useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { useTranslation } from 'react-i18next';

const FALLBACK_TEAM = [
  {
    name: "Ahmed Ali Siddiqui",
    role: "Managing Director",
    img: "/leaders/salahuddin.svg",
  },
  {
    name: "Asadullah Khan",
    role: "Chief Operating Officer",
    img: "/leaders/imran.svg",
  },
  {
    name: "Muhammad Ali Sheikh",
    role: "Chief Engineer Water Supply",
    img: "/leaders/sarah.svg",
  },
  {
    name: "Aftab Alam Chandio",
    role: "Chief Engineer Sewerage",
    img: "/leaders/bilal.svg",
  },
];


const PLACEHOLDER_PORTRAIT = "https://placehold.co/400x500/e2e8f0/1e293b?text=No+Image";

export default function OurLeadership({ team, insights }) {
  const { t, i18n } = useTranslation();
  const [fetchedTeam, setFetchedTeam] = useState(null);

  const FALLBACK_INSIGHTS = [
    {
      title: t("leadership.vision.title"),
      desc: t("leadership.vision.desc"),
    },
    {
      title: t("leadership.mission.title"),
      desc: t("leadership.mission.desc"),
    },
    {
      title: t("leadership.values.title"),
      desc: t("leadership.values.desc"),
    },
  ];

  useEffect(() => {
    async function fetchLeadership() {
      try {
        const langParam = i18n.language === 'ur' ? '?lang=ur' : '?lang=en';
        const res = await fetch(`/api/leadership${langParam}`);
        if (res.ok) {
          const data = await res.json();
          if (data.members && Array.isArray(data.members) && data.members.length > 0) {
            setFetchedTeam(data.members);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leadership", error);
      }
    }
    fetchLeadership();
  }, []);

  const roster = useMemo(() => {
    const sourceData = fetchedTeam || team;
    const list = Array.isArray(sourceData) && sourceData.length ? sourceData : FALLBACK_TEAM;
    return list.map((member, index) => ({
      id: member.id || member.name || `leader-${index}`,
      name: member.name,
      role: member.designation || member.role,
      bio: member.bio,
      image: member.portrait?.url || member.media?.url || member.img || PLACEHOLDER_PORTRAIT,
    }));
  }, [team, fetchedTeam]);

  const insightCards = Array.isArray(insights) && insights.length ? insights : FALLBACK_INSIGHTS;

  return (
    <section
      className="w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 bg-gray-50"
      id="leadership-content"
    >
      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        {/* --- Section Header --- */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-blue-900 mb-4">
            {t("Leadership & Management")}
          </h2>
          <p className="text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-lg">
            {t("leadership.description") || "KW&SC has evolved under the guidance of exceptional leaders. Meet the visionaries guiding the corporation toward a sustainable and efficient future."}
          </p>
        </div>

        {/* --- Current Management Team --- */}
        <div className="mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28 2xl:mb-32">
          <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold text-center text-gray-800 mb-6 sm:mb-8 md:mb-10 lg:mb-12 uppercase tracking-wider border-b-2 border-blue-200 pb-2 px-3 sm:px-4 md:px-5 lg:px-6 w-fit mx-auto">
            {t("Management Team")}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 2xl:gap-10">
            {roster.map((member, index) => (
              <div
                key={index}
                className="group bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl overflow-hidden shadow-sm sm:shadow-md hover:shadow-lg md:hover:shadow-2xl transition-all duration-300 transform hover:scale-105 sm:hover:-translate-y-2"
              >
                <div className="relative w-full h-40 sm:h-48 md:h-56 lg:h-64 xl:h-72 2xl:h-80 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                    onError={(e) => {
                      e.currentTarget.src = PLACEHOLDER_PORTRAIT;
                      e.currentTarget.srcset = PLACEHOLDER_PORTRAIT;
                    }}
                  />
                  {/* Overlay Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-3 sm:p-4 md:p-5 lg:p-6 xl:p-7 2xl:p-8 text-center relative">
                  <h4 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl 2xl:text-2xl font-bold text-blue-900 group-hover:text-blue-600 transition-colors leading-tight">
                    {member.name}
                  </h4>
                  <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base text-gray-500 font-medium mt-1 sm:mt-1.5 md:mt-2 lg:mt-3">
                    {member.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
