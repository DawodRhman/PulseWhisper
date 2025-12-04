import React from "react";
import Image from "next/image";
import { Globe } from "lucide-react";
import prisma from "@/lib/prisma";

export const revalidate = 3600; // Revalidate every hour by default

async function getLeadershipData() {
  const members = await prisma.leadershipMember.findMany({
    orderBy: { priority: "asc" },
    include: { portrait: true },
  });

  // Separate into current and past (assuming logic or just showing all as current for now based on schema)
  // The schema doesn't strictly distinguish "past" vs "current" with a flag, 
  // but we can assume all active records are "Current" for this implementation 
  // unless we add a status field later.
  return members;
}

export default async function Leadership() {
  const members = await getLeadershipData();

  // Fallback/Static data for "Past Leaders" since it might not be in DB yet
  const pastLeaders = [
    {
      name: "Muhammad Saqib",
      role: "Deputy Managing Director-HRD&A",
      img: "/images-leader/saqib.jpeg",
    },
    {
      name: "Khurram Shehzad",
      role: "Deputy Managing Director-Planning",
      img: "/images-leader/khurram.jpg",
    },
    {
      name: "Minhaj Ur Rehman",
      role: "Chief Internal Auditor",
      img: "/images-leader/minhaj.jpg",
    }
  ];

  return (
    <>
      {/* 🔥 CYBER HERO BANNER */}
      <section className="relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-[url('/karachicharminar.gif')] bg-cover bg-center flex justify-center items-center overflow-hidden text-white">

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/60 z-0"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 tech-grid-bg opacity-30 z-0"></div>

        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 md:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs sm:text-xs md:text-sm font-mono mb-4 sm:mb-5 md:mb-6 backdrop-blur-md">
              <Globe className="w-3 h-3 sm:w-3.5 sm:h-3.5 animate-pulse flex-shrink-0" />
              <span>KW&SC LEADERSHIP CORE</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold text-transparent bg-clip-text bg-white drop-shadow-[0_0_25px_rgba(6,182,212,0.5)] leading-tight">
              OUR LEADERSHIP
            </h2>

            <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl text-slate-300 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto font-light leading-relaxed">
              Meet the visionaries guiding Karachi Water & Sewerage Corporation (KW&SC)
              toward a sustainable and efficient future.
            </p>
          </div>
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-12 sm:h-16 md:h-24 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
      </section>

      {/* BODY SECTION */}
      <div className="w-full py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 mt-10 sm:mt-14 md:mt-20">
        <div className="text-gray-900 max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">

          <header className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6">Leadership & Management</h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              KW&SC has evolved under the guidance of exceptional leaders who have contributed
              to the organization's growth. Meet our current management team and past leaders.
            </p>
          </header>

          {/* CURRENT MANAGEMENT TEAM */}
          <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-28">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-center text-blue-900 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              Current Management Team
            </h2>

            {members.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
                {members.map((member) => (
                  <div
                    key={member.id}
                    className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 text-center hover:shadow-lg sm:hover:shadow-xl transition-all duration-300"
                  >
                    <div className="w-full aspect-square relative mb-3 sm:mb-4 md:mb-5">
                      <Image
                        src={member.portrait?.url || "/placeholder-user.jpg"}
                        alt={member.name}
                        fill
                        className="object-cover rounded-lg"
                        sizes="(max-width: 640px) 90vw, (max-width: 768px) 40vw, (max-width: 1024px) 30vw, 20vw"
                      />
                    </div>
                    <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl font-bold text-blue-800">{member.name}</h3>
                    <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-1.5 md:mt-2 leading-relaxed">{member.designation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500">No leadership members found.</p>
            )}
          </section>

          {/* PAST LEADERS */}
          <section className="mb-16 sm:mb-20 md:mb-24 lg:mb-28">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-center text-blue-900 mb-8 sm:mb-10 md:mb-12 lg:mb-16">
              Past Leaders
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10">
              {pastLeaders.map((leader, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg p-3 sm:p-4 md:p-5 lg:p-6 text-center hover:shadow-lg sm:hover:shadow-xl transition-all duration-300"
                >
                  <div className="w-full aspect-square relative mb-3 sm:mb-4 md:mb-5">
                    <Image
                      src={leader.img}
                      alt={leader.name}
                      fill
                      className="object-cover rounded-lg"
                      sizes="(max-width: 640px) 90vw, (max-width: 768px) 40vw, (max-width: 1024px) 35vw, 25vw"
                    />
                  </div>
                  <h3 className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-xl 2xl:text-2xl font-bold text-blue-800">{leader.name}</h3>
                  <p className="text-xs sm:text-sm md:text-base text-gray-600 mt-1 sm:mt-1.5 md:mt-2 leading-relaxed">{leader.role}</p>
                  {leader.period && <p className="text-xs sm:text-xs md:text-sm text-gray-500 mt-1 sm:mt-1.5">{leader.period}</p>}
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
