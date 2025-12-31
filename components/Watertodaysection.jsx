"use client";
import React, { useMemo, useState } from "react";
// Remove Link import as it's no longer used for navigation
import { useWaterTodayData } from "@/hooks/useWaterTodayData";
import { useTranslation } from 'react-i18next';
import Loader from "@/components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, ChevronDown, ChevronUp, Activity } from "lucide-react";

const FALLBACK_UPDATE = {
  title: "Water Today",
  titleUr: "آج کا پانی",
  summary: "Today’s water distribution across Karachi remains stable, with major pumping stations operating at optimal capacity. Supply to central and western zones is reported as normal, while select southern sectors may experience low-pressure intervals during peak hours. Maintenance teams are deployed to ensure smooth flow and address any temporary disruptions.",
  summaryUr: "کراچی میں آج کی پانی کی تقسیم مستحکم ہے، اہم پمپنگ اسٹیشنز بہترین صلاحیت کے ساتھ چل رہے ہیں۔ مرکزی اور مغربی زونز میں فراہمی معمول کے مطابق ہے جبکہ کچھ جنوبی علاقوں میں مصروف اوقات میں کم پریشر ہو سکتا ہے۔ ہموار فراہمی کو یقینی بنانے کے لیے ٹیمیں تعینات ہیں۔",
  media: { url: "" }, // Removed specific GIF to avoid confusion; handled by placeholder logic
  publishedAt: new Date().toISOString(),
};

export default function WaterTodaySection({ updates: propUpdates }) {
  const { data, loading } = useWaterTodayData();
  const { t, i18n } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);
  const isUrdu = i18n.language === 'ur';

  const updates = propUpdates || data?.updates || [];

  const latestUpdate = useMemo(() => {
    if (Array.isArray(updates) && updates.length > 0) {
      return updates[0];
    }
    return FALLBACK_UPDATE;
  }, [updates]);

  if (loading && !propUpdates) return <Loader />;

  const imageUrl = latestUpdate.media?.url || FALLBACK_UPDATE.media.url;
  const displayTitle = (isUrdu && latestUpdate.titleUr) ? latestUpdate.titleUr : (latestUpdate.title || FALLBACK_UPDATE.title);
  const displaySummary = (isUrdu && latestUpdate.summaryUr) ? latestUpdate.summaryUr : (latestUpdate.summary || FALLBACK_UPDATE.summary);

  return (
    <section className="relative w-full py-20 lg:py-32 overflow-hidden bg-slate-50">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40rem] h-[40rem] bg-cyan-200/30 rounded-full blur-[100px] mix-blend-multiply animate-blob-slow" />
        <div className="absolute top-[20%] right-[-10%] w-[35rem] h-[35rem] bg-blue-200/30 rounded-full blur-[100px] mix-blend-multiply animate-blob-reverse" />
        <div className="absolute bottom-[-10%] left-[20%] w-[45rem] h-[45rem] bg-indigo-200/20 rounded-full blur-[100px] mix-blend-multiply animate-blob-slow" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Content Column */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`space - y - 8 ${isUrdu ? 'lg:order-2 text-right' : 'lg:order-1'} `}
          >
            <div className={`flex items - center gap - 3 ${isUrdu ? 'justify-end' : 'justify-start'} `}>
              <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-600/10 text-blue-600">
                <Activity size={20} />
              </span>
              <span className="text-sm font-bold tracking-widest text-blue-600 uppercase">
                {t('live_updates') || "Live Status"}
              </span>
            </div>

            <h2 className="text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
              {displayTitle}
            </h2>

            <div className="relative">
              <motion.div
                className={`prose prose - lg text - slate - 600 leading - relaxed overflow - hidden ${!isExpanded ? 'active' : ''} `}
                initial={false}
                animate={{ height: isExpanded ? "auto" : "160px" }} // Approx height for 5-6 lines
                transition={{ duration: 0.4, ease: "easeInOut" }}
              >
                <div className={`${!isExpanded ? 'line-clamp-5' : ''} `}> {/* CSS fallback */}
                  <p>{displaySummary}</p>
                </div>
              </motion.div>

              {/* Fade Overlay for collapsed state */}
              {!isExpanded && (
                <div className="absolute bottom-0 left-0 w-full h-16 bg-gradient-to-t from-slate-50 to-transparent pointer-events-none" />
              )}
            </div>

            <div className={`flex flex - wrap items - center gap - 6 pt - 2 ${isUrdu ? 'flex-row-reverse' : 'flex-row'} `}>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-white/60 backdrop-blur px-4 py-2 rounded-full border border-slate-200">
                <Calendar size={16} className="text-blue-500" />
                <span>{new Date(latestUpdate.publishedAt).toLocaleDateString()}</span>
              </div>

              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className={`group flex items - center gap - 2 text - base font - semibold text - blue - 600 transition - all hover: text - blue - 700 focus: outline - none ${isUrdu ? 'flex-row-reverse' : 'flex-row'} `}
              >
                <span>{isExpanded ? (t('readLess') || "Read Less") : (t('readMore') || "Read More")}</span>
                {isExpanded ? (
                  <ChevronUp size={18} className="transition-transform group-hover:-translate-y-0.5" />
                ) : (
                  <ChevronDown size={18} className="transition-transform group-hover:translate-y-0.5" />
                )}
              </button>
            </div>
          </motion.div>

          {/* Image Column */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`relative ${isUrdu ? 'lg:order-1' : 'lg:order-2'} `}
          >
            <div className="relative group rounded-3xl overflow-hidden shadow-2xl bg-white p-2">
              <div className="absolute inset-0 bg-blue-600/5 group-hover:bg-transparent transition-colors duration-500" />

              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] w-full bg-slate-100 flex items-center justify-center">
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={latestUpdate.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-in-out"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-slate-400">
                    <Activity size={48} className="text-slate-300" />
                    <span className="text-sm font-medium">No Image Available</span>
                  </div>
                )}

                {/* Overlay Badge */}
                <div className={`absolute top - 4 ${isUrdu ? 'right-4' : 'left-4'} `}>
                  <div className="flex items-center gap-2 bg-white/90 backdrop-blur-md px-4 py-2 rounded-full shadow-lg border border-white/50">
                    <span className="relative flex h-2.5 w-2.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                    </span>
                    <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Active</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Offset Element */}
            <div className="absolute -z-10 top-8 -right-8 w-full h-full border-2 border-blue-200 rounded-3xl hidden lg:block" />
            <div className="absolute -z-10 -bottom-8 -left-8 w-full h-full border-2 border-cyan-200 rounded-3xl hidden lg:block" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
