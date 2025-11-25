"use client";
import React, { useMemo } from "react";
import Image from "next/image";

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

const FALLBACK_INSIGHTS = [
  {
    title: "Our Vision",
    desc: "A future where Karachi receives uninterrupted, clean, and safe water through modernized infrastructure and progressive leadership.",
  },
  {
    title: "Our Mission",
    desc: "To provide efficient water supply and sewerage services through sustainable operations, innovative planning, and skilled leadership.",
  },
  {
    title: "Core Values",
    desc: "Transparency, accountability, innovation, and public service form the foundation of KW&SC’s leadership principles.",
  },
];

const PLACEHOLDER_PORTRAIT = "/leaders/placeholder.svg";

export default function OurLeadership({ team, insights }) {
  const roster = useMemo(() => {
    const list = Array.isArray(team) && team.length ? team : FALLBACK_TEAM;
    return list.map((member, index) => ({
      id: member.id || member.name || `leader-${index}`,
      name: member.name,
      role: member.designation || member.role,
      bio: member.bio,
      image: member.media?.url || member.img || PLACEHOLDER_PORTRAIT,
    }));
  }, [team]);

  const insightCards = Array.isArray(insights) && insights.length ? insights : FALLBACK_INSIGHTS;

  return (
    <section className="w-full py-20 bg-gray-50" id="leadership-content">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">Leadership &amp; Management</h2>
          <p className="text-gray-600 text-lg">
            KW&SC has evolved under the guidance of exceptional leaders. Meet the visionaries guiding the corporation toward a
            sustainable and efficient future.
          </p>
        </div>

        <div className="mb-24">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-10 uppercase tracking-wider border-b-2 border-blue-200 inline-block pb-2 px-4 mx-auto block w-fit">
            Management Team
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {roster.map((member, index) => (
              <div
                key={member.id || index}
                className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
              >
                <div className="relative w-full h-64 bg-gray-200">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    sizes="(max-width:768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    priority={index === 0}
                    onError={(event) => {
                      event.currentTarget.src = PLACEHOLDER_PORTRAIT;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
                <div className="p-6 text-center relative">
                  <h4 className="text-lg font-bold text-blue-900 group-hover:text-blue-600 transition-colors">{member.name}</h4>
                  <p className="text-sm text-gray-500 font-medium mt-1">{member.role}</p>
                  {member.bio ? <p className="text-xs text-gray-500 mt-3 line-clamp-3">{member.bio}</p> : null}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insightCards.map((insight, index) => (
            <div
              key={insight.title || index}
              className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100 hover:border-blue-300 transition-colors"
            >
              <p className="text-xs font-semibold tracking-[0.3em] text-blue-400 mb-3">INSIGHT {index + 1}</p>
              <h4 className="text-xl font-bold text-blue-900 mb-2">{insight.title}</h4>
              <p className="text-gray-600 leading-relaxed text-sm">{insight.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}