"use client";
import React from "react";
import Loader from "@/components/Loader";
import { Fade } from "react-awesome-reveal";
import { useEducationData } from "@/hooks/useEducationData";

export default function Education() {
  const { data, loading, error } = useEducationData();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Failed to load education resources.</div>;

  const resources = data?.resources || [];

  return (
    <section className="bg-[#020617] text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 xl:space-y-20 2xl:space-y-24">
          {resources.length > 0 ? resources.map((post, i) => (
            <Fade key={i} direction="up" triggerOnce duration={800} delay={i * 150}>
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
                <div className="md:flex-1">
                  <img src={post.image} alt={post.title} className="rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] w-full h-auto" />
                </div>
                <div className="md:flex-1">
                  <h3 className="text-lg sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-cyan-400 mb-2 sm:mb-3 md:mb-4 lg:mb-5">{post.title}</h3>
                  <p className="text-slate-300 leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-lg">{post.description}</p>
                </div>
              </div>
            </Fade>
         ))
        : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No education resources available at the moment.
          </div>
        )}
        </div>
      </section>
  );
}
