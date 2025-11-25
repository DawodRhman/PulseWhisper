"use client";
import React from "react";
import Image from "next/image";
import { Globe } from "lucide-react";

export default function Leadership() {
  const pastLeaders = [
    {
      name: "Engr. Syed Najib Ahmed",
      role: "Former Managing Director",
      period: "2022 - 2023",
      img: "/leaders/najib.svg",
    },
    {
      name: "Asadullah Khan",
      role: "Former Managing Director",
      period: "2020 - 2022",
      img: "/leaders/asadullah.svg",
    },
    {
      name: "Hashim Raza Zaidi",
      role: "Former Managing Director",
      period: "2018 - 2020",
      img: "/leaders/hashim.svg",
    },
  ];

  const managementTeam = [
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

  return (
    <>
      {/* 🔥 CYBER HERO BANNER (Same as Services & News) */}
      <section className="relative h-[60vh] transition-opacity duration-700 bg-[url('/karachicharminar.gif')] bg-cover bg-center flex justify-center items-center overflow-hidden text-white">

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 tech-grid-bg opacity-30 z-0"></div>

        <div className="relative z-[1] max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
            <Globe className="w-3 h-3 animate-pulse" />
            <span>KW&SC LEADERSHIP CORE</span>
          </div>

          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            OUR LEADERSHIP
          </h2>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Meet the visionaries guiding Karachi Water & Sewerage Corporation (KW&SC)
            toward a sustainable and efficient future.
          </p>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
      </section>

      {/* BODY SECTION */}
      <div className="w-full py-16 mt-20">
        <div className="text-gray-900 max-w-[90%] mx-auto">

          <header className="text-center mb-20">
            <h1 className="text-4xl font-bold mb-4">Leadership & Management</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">
              KW&SC has evolved under the guidance of exceptional leaders who have contributed
              to the organization's growth. Meet our current management team and past leaders.
            </p>
          </header>

          {/* CURRENT MANAGEMENT TEAM */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
              Current Management Team
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 max-w-6xl mx-auto">
              {managementTeam.map((member, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className="w-full h-48 relative mb-4">
                    <Image
                      src={member.img}
                      alt={member.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">{member.name}</h3>
                  <p className="text-gray-600 mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </section>

          {/* PAST LEADERS */}
          <section className="mb-24">
            <h2 className="text-3xl font-bold text-center text-blue-900 mb-12">
              Past Leaders
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-6xl mx-auto">
              {pastLeaders.map((leader, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center hover:shadow-xl transition-all"
                >
                  <div className="w-full h-48 relative mb-4">
                    <Image
                      src={leader.img}
                      alt={leader.name}
                      fill
                      className="object-cover rounded-xl"
                    />
                  </div>
                  <h3 className="text-xl font-bold text-blue-800">{leader.name}</h3>
                  <p className="text-gray-600">{leader.role}</p>
                  <p className="text-gray-500 text-sm mt-1">{leader.period}</p>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
