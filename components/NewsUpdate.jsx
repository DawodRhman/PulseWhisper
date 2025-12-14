"use client";
import React, { useState, useEffect } from "react";
import { useNewsData } from "@/hooks/useNewsData";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import {
  Activity,
  FileText,
  Camera,
  ChevronRight,
  Calendar,
  Tag,
  Cpu,
  Globe,
} from "lucide-react";

// --- Mock Data with Futuristic/Tech Spin ---
const mockNewsData = [
  {
    id: 1,
    title: "K-IV Project: Phase I Operational Status Confirmed",
    date: "2025-11-15",
    category: "INFRASTRUCTURE",
    summary:
      "System diagnostics confirm Phase I of the K-IV water supply grid is fully operational, injecting 260 MGD into the primary distribution network. Pressure levels are stable.",
    icon: <Activity className="w-6 h-6 text-cyan-400" />,
    imagePlaceholder:
      "https://placehold.co/800x450/0f172a/06b6d4?text=K-IV+OPERATIONAL",
    status: "ONLINE",
  },
  {
    id: 2,
    title: "E-Billing Portal V2.0 Deployed",
    date: "2025-10-28",
    category: "DIGITAL SERVICES",
    summary:
      "The upgraded digital payment gateway is live. New features include real-time consumption analytics, instant ledger updates, and biometric login support for verified consumers.",
    icon: <Activity className="w-6 h-6 text-purple-400" />,
    imagePlaceholder:
      "https://placehold.co/800x450/0f172a/a855f7?text=PORTAL+V2.0",
    status: "ACTIVE",
  },
  {
    id: 3,
    title: "Sewerage Network Overhaul: Sector 4 & 7",
    date: "2025-10-10",
    category: "MAINTENANCE",
    summary:
      "Automated dredging units have been deployed in Lyari and Gadap. Predictive AI modeling suggests a 40% efficiency increase in flow rates post-rehabilitation.",
    icon: <Activity className="w-6 h-6 text-blue-400" />,
    imagePlaceholder:
      "https://placehold.co/800x450/0f172a/3b82f6?text=NETWORK+OVERHAUL",
    status: "IN PROGRESS",
  },
  {
    id: 4,
    title: "Industrial Water Conservation Protocol",
    date: "2025-09-22",
    category: "SUSTAINABILITY",
    summary:
      "Smart metering mandates are now in effect for all industrial zones. Real-time monitoring will detect unauthorized usage patterns and optimize resource allocation.",
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    imagePlaceholder:
      "https://placehold.co/800x450/0f172a/10b981?text=CONSERVATION+PROTOCOL",
    status: "MANDATORY",
  },
  {
    id: 5,
    title: "Community Outreach: Clean Water Initiative",
    date: "2025-09-01",
    category: "PUBLIC RELATIONS",
    summary:
      "KW&SC technical teams conducted a seminar on next-gen filtration methods. Attendees were briefed on smart-home leak detection systems and water quality standards.",
    icon: <Activity className="w-6 h-6 text-pink-400" />,
    imagePlaceholder:
      "https://placehold.co/800x450/0f172a/ec4899?text=OUTREACH+INITIATIVE",
    status: "COMPLETED",
  },
];

const NewsCard = ({ news, index }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative bg-slate-900/60 backdrop-blur-xl rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-500 flex flex-col h-full"
      style={{
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.15}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/20 z-10"></div>
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent z-20 h-[200%] w-full -translate-y-full ${
            isHovered ? "animate-scan" : ""
          }`}
        ></div>
        <img
          src={news.imagePlaceholder}
          alt={news.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
        />
        {/* HUD Badge */}
        <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-30">
          <div className="bg-black/70 backdrop-blur-md border border-cyan-500/30 text-cyan-400 text-[8px] sm:text-[10px] tracking-widest font-mono px-1.5 sm:px-2 py-0.5 sm:py-1 rounded flex items-center gap-1 sm:gap-2">
            <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-full w-full bg-cyan-500"></span>
            </span>
            {news.status}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col flex-grow relative">
        <div className="flex items-center gap-1.5 sm:gap-2 mb-2 sm:mb-3">
          <Tag className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-slate-400" />
          <span className="text-[10px] sm:text-xs font-mono text-cyan-500 tracking-widest uppercase">
            {news.category}
          </span>
        </div>
        <h3 className="text-xl font-bold text-white mb-3 leading-snug group-hover:text-cyan-200 transition-colors">
          {news.title}
        </h3>
        <p className="text-slate-400 text-xs sm:text-sm leading-relaxed mb-4 sm:mb-6 line-clamp-3 group-hover:text-slate-300 transition-colors">
          {news.summary}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3 sm:pt-4 border-t border-white/5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1 sm:gap-2 text-[9px] sm:text-xs font-mono text-slate-500 flex-shrink-0">
            <Calendar className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
            <span className="truncate">{news.date}</span>
          </div>
          <a
            href="#"
            className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-bold text-cyan-500 hover:text-cyan-300 transition-colors group/link flex-shrink-0"
          >
            ACCESS DATA
            <ChevronRight className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover/link:translate-x-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

function normalizeNews(articles) {
  if (!articles || articles.length === 0) return mockNewsData;

  return articles.map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    category: article.category?.title || "GENERAL",
    summary: article.summary || "",
    icon: <Activity className="w-6 h-6 text-cyan-400" />,
    imagePlaceholder:
      article.heroMedia?.url ||
      `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "News"
      )}`,
    status: article.status || "PUBLISHED",
  }));
}

// Helper function to categorize articles into three categories
function categorizNews(articles) {
  if (!articles || articles.length === 0) {
    return { latestUpdates: [], pressReleases: [], mediaGallery: [] };
  }

  const latestUpdates = articles.slice(0, 5).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    category: article.category?.title || "GENERAL",
    summary: article.summary || "",
    imagePlaceholder:
      article.heroMedia?.url ||
      `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "News"
      )}`,
    status: article.status || "PUBLISHED",
  }));

  const pressReleases = articles.slice(5, 9).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : new Date().toLocaleDateString(),
    description: article.summary || "",
    link: `/news/${article.slug || article.id}`,
    category: article.category?.title || "PRESS RELEASE",
  }));

  const mediaGallery = articles.slice(9, 15).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    description: article.summary || "",
    type: article.category?.title || "MEDIA",
    img:
      article.heroMedia?.url ||
      `https://placehold.co/400x300/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "Media"
      )}`,
  }));

  return { latestUpdates, pressReleases, mediaGallery };
}

export default function NewsUpdates() {
  const { data, loading: hookLoading, error } = useNewsData();
  const [news, setNews] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updates");

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      .animate-scan {
        animation: scan 2.5s linear infinite;
      }
      .tech-grid-bg {
        background-image: 
          linear-gradient(to right, rgba(6, 182, 212, 0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(6, 182, 212, 0.1) 1px, transparent 1px);
        background-size: 40px 40px;
        mask-image: radial-gradient(circle at center, black 40%, transparent 80%);
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const loaderTimeline = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    loaderTimeline
      .fromTo(
        ".loader",
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.5, ease: "power2.inOut" }
      )
      .to(".loader", {
        scaleY: 0,
        transformOrigin: "0% -100%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        ".wrapper",
        { y: "-100%", ease: "power4.inOut", duration: 1 },
        "-=0.8"
      );
  }, []);

  useEffect(() => {
    // Inject animations
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes scan {
        0% { transform: translateY(-100%); }
        100% { transform: translateY(100%); }
      }
      .animate-scan {
        animation: scan 2s linear infinite;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (hookLoading) {
      setLoading(true);
      return;
    }

    if (error || !data?.articles) {
      setNews(mockNewsData);
      setPressReleases([]);
      setMediaGallery([]);
    } else {
      const normalized = normalizeNews(data.articles);
      const {
        latestUpdates,
        pressReleases: pr,
        mediaGallery: mg,
      } = categorizNews(data.articles);
      setNews(normalized);
      setPressReleases(pr);
      setMediaGallery(mg);
    }
    setLoading(false);
  }, [data, hookLoading, error]);

  return (
    <section className="min-h-screen bg-[#020617] py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background */}
      <div className="relative py-20">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-7xl mx-auto px-8 relative z-10">
          <div className="text-center mb-12">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
                <Cpu className="text-cyan-400 w-8 h-8" />
                LATEST TRANSMISSIONS
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
            </Fade>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-14">
            <div className="bg-slate-900/80 backdrop-blur-lg p-1.5 rounded-xl border border-white/10 shadow-2xl inline-flex gap-2">
              {[
                {
                  id: "updates",
                  label: "Live Updates",
                  icon: <Activity className="w-4 h-4" />,
                },
                {
                  id: "press",
                  label: "Press Releases",
                  icon: <FileText className="w-4 h-4" />,
                },
                {
                  id: "media",
                  label: "Gallery",
                  icon: <Camera className="w-4 h-4" />,
                },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-6 py-2.5 rounded-lg font-mono text-sm transition-all border ${
                    activeTab === tab.id
                      ? "bg-cyan-950/60 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
                      : "bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Live Updates with Images */}
          {activeTab === "updates" && (
            <div className="grid grid-cols-1 gap-6">
              {news.map((update, index) => (
                <Fade
                  key={index}
                  direction="up"
                  triggerOnce
                  duration={600}
                  delay={index * 100}
                >
                  <div className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 md:p-8 hover:border-cyan-500/50 transition-all duration-500">
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                      {/* LEFT CONTENT */}
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-3 mb-3">
                          <span className="bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 px-3 py-0.5 rounded text-xs font-mono uppercase">
                            {update.type}
                          </span>

                          <span className="text-slate-500 text-xs font-mono flex items-center gap-1">
                            <Calendar className="w-3 h-3" /> {update.date}
                          </span>

                          <span className="text-slate-600 text-[10px] font-mono border border-slate-700 px-1.5 rounded">
                            ID: {update.id}
                          </span>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                          {update.title}
                        </h3>

                        <p className="text-slate-400 leading-relaxed text-sm md:text-base mb-4">
                          {update.description}
                        </p>

                        <button className="inline-flex items-center gap-1 text-cyan-400 font-mono text-sm hover:text-cyan-300 transition-all">
                          READ MORE
                          <ChevronRight className="w-4 h-4" />
                        </button>
                      </div>

                      {/* IMAGE (optional) */}
                      {update.img && (
                        <div className="flex-shrink-0 w-full md:w-48 h-32 md:h-40 overflow-hidden rounded-xl group-hover:scale-105 transition-transform duration-500">
                          <img
                            src={update.img}
                            alt={update.title}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          )}

          {/* Press Releases */}
          {activeTab === "press" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pressReleases.map((release, index) => (
                <Fade
                  key={index}
                  direction="up"
                  triggerOnce
                  duration={600}
                  delay={index * 100}
                >
                  <div className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-slate-800/40 transition-all duration-300">
                    <div className="flex items-center justify-between mb-4">
                      <span className="bg-purple-950/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        OFFICIAL RELEASE
                      </span>
                      <span className="text-slate-500 text-xs font-mono">
                        {release.date}
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-purple-200">
                      {release.title}
                    </h3>

                    <p className="text-slate-400 mb-6 text-base">
                      {release.description}
                    </p>

                    {release.link && (
                      <Link
                        href={release.link}
                        target="_blank"
                        className="inline-flex items-center gap-2 text-purple-400 font-mono text-sm hover:text-purple-300"
                      >
                        ACCESS DOCUMENT
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    )}
                  </div>
                </Fade>
              ))}
            </div>
          )}

          {/* Gallery */}
          {activeTab === "media" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {mediaGallery.map((item, index) => (
                <Fade
                  key={index}
                  direction="up"
                  triggerOnce
                  duration={600}
                  delay={index * 100}
                >
                  <div className="group bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all">
                    <div className="relative h-56 overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent h-[200%] -translate-y-full group-hover:animate-scan"></div>
                      <img
                        src={item.img}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all"
                      />
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <Tag className="w-4 h-4 text-slate-500" />
                        <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">
                          {item.type}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200">
                        {item.title}
                      </h3>
                      <p className="text-slate-400 text-sm line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
