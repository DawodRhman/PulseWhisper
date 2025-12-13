"use client";
import React, { useMemo } from "react";
import Link from "next/link";
import { useWaterTodayData } from "@/hooks/useWaterTodayData";
import Loader from "@/components/Loader";

const FALLBACK_UPDATE = {
  title: "Water Today",
  summary: "Today’s water distribution across Karachi remains stable, with major pumping stations operating at optimal capacity. Supply to central and western zones is reported as normal, while select southern sectors may experience low-pressure intervals during peak hours. Maintenance teams are deployed to ensure smooth flow and address any temporary disruptions.",
  media: { url: "/downtownkarachi.gif" },
  publishedAt: new Date().toISOString(),
};

export default function WaterTodaySection({ updates: propUpdates }) {
  const { data, loading } = useWaterTodayData();
  
  const updates = propUpdates || data?.updates || [];
  
  const latestUpdate = useMemo(() => {
    if (Array.isArray(updates) && updates.length > 0) {
      return updates[0];
    }
    return FALLBACK_UPDATE;
  }, [updates]);

  if (loading && !propUpdates) return <Loader />;

  const imageUrl = latestUpdate.media?.url || FALLBACK_UPDATE.media.url;

  return (
    <section className="relative w-full py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 bg-gradient-to-b from-white to-gray-50 overflow-hidden">
      {/* Decorative subtle shapes */}
      <div className="absolute top-0 left-0 w-48 sm:w-64 md:w-72 lg:w-96 h-48 sm:h-64 md:h-72 lg:h-96 bg-blue-100/40 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-64 sm:w-80 md:w-96 lg:w-[30rem] h-64 sm:h-80 md:h-96 lg:h-[30rem] bg-cyan-100/40 rounded-full blur-3xl"></div>

      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl xl:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">
        <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-800 mb-4 text-center">
          {latestUpdate.title}
        </h2>

        <div className="rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl bg-white shadow-lg md:shadow-xl lg:shadow-2xl p-4 sm:p-5 md:p-8 lg:p-10 xl:p-12 2xl:p-14 border border-gray-200 flex flex-col lg:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14 transition-all hover:shadow-2xl">
          {/* Image */}
          <div className="w-full lg:w-1/2">
            <img
              src={imageUrl}
              alt={latestUpdate.title}
              className="rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-2xl shadow-md object-cover w-full h-48 sm:h-56 md:h-64 lg:h-80 xl:h-96 2xl:h-96"
            />
          </div>

          {/* Text */}
          <div className="w-full lg:w-1/2 text-gray-700 leading-relaxed text-sm sm:text-base md:text-lg lg:text-xl xl:text-lg 2xl:text-lg space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
            <p>
              {latestUpdate.summary}
            </p>
            <div className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 flex items-center justify-between">
              <span className="text-xs sm:text-sm md:text-base lg:text-sm xl:text-sm 2xl:text-sm text-gray-500">
                Updated: {new Date(latestUpdate.publishedAt).toLocaleDateString()}
              </span>
              <Link href="/watertodaysection" className="inline-block text-xs sm:text-sm md:text-base lg:text-lg text-blue-600 hover:text-blue-800 font-semibold hover:underline transition-all">
                Read More
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

