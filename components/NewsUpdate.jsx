'use client';
import React, { useState, useEffect } from "react";
import { Activity, Calendar, ChevronRight, Tag } from "lucide-react";
import { useNewsData } from "@/hooks/useNewsData";

// --- Mock Data with Futuristic/Tech Spin ---
const mockNewsData = [
  {
    id: 1,
    title: "K-IV Project: Phase I Operational Status Confirmed",
    date: "2025-11-15",
    category: "INFRASTRUCTURE",
    summary: "System diagnostics confirm Phase I of the K-IV water supply grid is fully operational, injecting 260 MGD into the primary distribution network. Pressure levels are stable.",
    icon: <Activity className="w-6 h-6 text-cyan-400" />,
    imagePlaceholder: "https://placehold.co/800x450/0f172a/06b6d4?text=K-IV+OPERATIONAL",
    status: "ONLINE"
  },
  {
    id: 2,
    title: "E-Billing Portal V2.0 Deployed",
    date: "2025-10-28",
    category: "DIGITAL SERVICES",
    summary: "The upgraded digital payment gateway is live. New features include real-time consumption analytics, instant ledger updates, and biometric login support for verified consumers.",
    icon: <Activity className="w-6 h-6 text-purple-400" />,
    imagePlaceholder: "https://placehold.co/800x450/0f172a/a855f7?text=PORTAL+V2.0",
    status: "ACTIVE"
  },
  {
    id: 3,
    title: "Sewerage Network Overhaul: Sector 4 & 7",
    date: "2025-10-10",
    category: "MAINTENANCE",
    summary: "Automated dredging units have been deployed in Lyari and Gadap. Predictive AI modeling suggests a 40% efficiency increase in flow rates post-rehabilitation.",
    icon: <Activity className="w-6 h-6 text-blue-400" />,
    imagePlaceholder: "https://placehold.co/800x450/0f172a/3b82f6?text=NETWORK+OVERHAUL",
    status: "IN PROGRESS"
  },
  {
    id: 4,
    title: "Industrial Water Conservation Protocol",
    date: "2025-09-22",
    category: "SUSTAINABILITY",
    summary: "Smart metering mandates are now in effect for all industrial zones. Real-time monitoring will detect unauthorized usage patterns and optimize resource allocation.",
    icon: <Activity className="w-6 h-6 text-emerald-400" />,
    imagePlaceholder: "https://placehold.co/800x450/0f172a/10b981?text=CONSERVATION+PROTOCOL",
    status: "MANDATORY"
  },
  {
    id: 5,
    title: "Community Outreach: Clean Water Initiative",
    date: "2025-09-01",
    category: "PUBLIC RELATIONS",
    summary: "KW&SC technical teams conducted a seminar on next-gen filtration methods. Attendees were briefed on smart-home leak detection systems and water quality standards.",
    icon: <Activity className="w-6 h-6 text-pink-400" />,
    imagePlaceholder: "https://placehold.co/800x450/0f172a/ec4899?text=OUTREACH+INITIATIVE",
    status: "COMPLETED"
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
        transform: 'translateY(20px)',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image */}
      <div className="relative h-32 sm:h-40 md:h-48 overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/20 z-10"></div>
        <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/10 to-transparent z-20 h-[200%] w-full -translate-y-full ${isHovered ? 'animate-scan' : ''}`}></div>
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
          <span className="text-[10px] sm:text-xs font-mono text-cyan-500 tracking-widest uppercase">{news.category}</span>
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
          <a href="#" className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-bold text-cyan-500 hover:text-cyan-300 transition-colors group/link flex-shrink-0">
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
    date: article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : new Date().toLocaleDateString(),
    category: article.category?.title || "GENERAL",
    summary: article.summary || "",
    icon: <Activity className="w-6 h-6 text-cyan-400" />, 
    imagePlaceholder: article.heroMedia?.url || `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(article.title || 'News')}`,
    status: article.status || "PUBLISHED"
  }));
}

export default function NewsUpdates() {
  const { data, loading: hookLoading, error } = useNewsData();
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Inject animations
    const style = document.createElement('style');
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
    } else {
      setNews(normalizeNews(data.articles));
    }
    setLoading(false);
  }, [data, hookLoading, error]);

  return (
    <section className="min-h-screen bg-[#020617] py-8 sm:py-12 md:py-16 lg:py-20 relative overflow-hidden font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20 pointer-events-none"></div>
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/20 rounded-full blur-[120px] animate-pulse pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] animate-pulse delay-1000 pointer-events-none mix-blend-screen"></div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10 sm:mb-14 md:mb-16 lg:mb-20">
          <div className="inline-flex items-center gap-2 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-[10px] sm:text-xs font-mono mb-4 sm:mb-6">
            <Activity className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" />
            <span className="tracking-widest">LIVE SYSTEM UPDATES</span>
          </div>
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-slate-400 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight mb-4 leading-tight">
            KW&SC <span className="text-cyan-400">LATEST NEWS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-sm md:text-base lg:text-lg text-slate-400 leading-relaxed px-2 sm:px-0">
            Tracking infrastructure developments, digital transformation, and utility metrics in real-time across the Karachi metropolis.
          </p>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="flex flex-col justify-center items-center h-60 sm:h-72 md:h-80">
            <div className="relative">
              <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 border-3 sm:border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-cyan-400 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-4 sm:mt-6 text-cyan-500 font-mono text-xs sm:text-sm tracking-widest animate-pulse">INITIALIZING DATA STREAM...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8">
            {news.map((item, index) => (
              <NewsCard key={item.id} news={item} index={index} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}