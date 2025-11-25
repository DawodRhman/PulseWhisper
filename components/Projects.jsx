"use client";
import React, { useEffect, useState } from "react";
import {
  Waves,
  Zap,
  Droplet,
  Cpu,
  HardHat,
  TrendingUp,
  Clock,
  CheckCircle,
  Activity,
} from "lucide-react";

const PLACEHOLDER_IMAGE = "https://placehold.co/800x450/0f172a/e2e8f0?text=KWSC+PROJECT";
const ICON_SET = [Waves, Zap, Droplet, Cpu, HardHat, TrendingUp];
const COLOR_KEYS = ["cyan", "yellow", "blue", "purple", "red", "emerald"];

const fallbackProjects = [
  {
    id: "PSDP-1",
    title: "K-IV Water Supply Project (Phase-I)",
    category: "Federal PSDP",
    status: "COMPLETED",
    progress: 100,
    scope:
      "Add 260 MGD of water to the Karachi system. Includes components like bulk water conveyance, pumping stations, and distribution network improvements.",
    image: "https://placehold.co/800x450/e0f7fa/0891b2?text=K-IV+COMPLETION",
  },
  {
    id: "PSDP-2",
    title: "Dhabeji Pumping Station Rehabilitation",
    category: "Federal PSDP",
    status: "ONGOING",
    progress: 85,
    scope:
      "Rehabilitation and upgrade of pumping machinery at Dhabeji to ensure optimal transmission capacity and reduce downtime.",
    image: "https://placehold.co/800x450/fffbe5/d97706?text=DHABEJI+UPGRADE",
  },
  {
    id: "ADP-1",
    title: "Sewerage System Overhaul (District East)",
    category: "Provincial ADP",
    status: "ONGOING",
    progress: 55,
    scope:
      "Replacement of old and damaged sewage lines and construction of new disposal structures in District East.",
    image: "https://placehold.co/800x450/eff6ff/1d4ed8?text=SEWERAGE+REHAB",
  },
  {
    id: "ADP-2",
    title: "Water Tanker Service Digitization",
    category: "Provincial ADP",
    status: "PLANNING",
    progress: 5,
    scope:
      "Develop a centralized digital system for managing tanker requests, tracking, and billing to enhance transparency and efficiency.",
    image: "https://placehold.co/800x450/f5f3ff/7c3aed?text=DIGITIZATION+PLAN",
  },
  {
    id: "ADP-3",
    title: "Gadani Bulk Water Supply Scheme",
    category: "Provincial ADP",
    status: "PAUSED",
    progress: 20,
    scope: "Construction of a new bulk water line to connect Gadani to the main KW&SC network.",
    image: "https://placehold.co/800x450/fef2f2/dc2626?text=GADANI+SCHEME",
  },
];

const colorClasses = {
  cyan: {
    border: "border-cyan-300",
    shadow: "shadow-cyan-200",
    text: "text-cyan-600",
    bg: "bg-cyan-50",
    progress: "bg-cyan-500",
  },
  yellow: {
    border: "border-yellow-300",
    shadow: "shadow-yellow-200",
    text: "text-yellow-600",
    bg: "bg-yellow-50",
    progress: "bg-yellow-500",
  },
  blue: {
    border: "border-blue-300",
    shadow: "shadow-blue-200",
    text: "text-blue-600",
    bg: "bg-blue-50",
    progress: "bg-blue-500",
  },
  purple: {
    border: "border-purple-300",
    shadow: "shadow-purple-200",
    text: "text-purple-600",
    bg: "bg-purple-50",
    progress: "bg-purple-500",
  },
  red: {
    border: "border-red-300",
    shadow: "shadow-red-200",
    text: "text-red-600",
    bg: "bg-red-50",
    progress: "bg-red-500",
  },
  emerald: {
    border: "border-emerald-300",
    shadow: "shadow-emerald-200",
    text: "text-emerald-600",
    bg: "bg-emerald-50",
    progress: "bg-emerald-500",
  },
};

const statusBadges = {
  COMPLETED: "bg-emerald-500 text-white",
  ONGOING: "bg-yellow-500 text-white",
  IN_PROGRESS: "bg-yellow-500 text-white",
  PLANNING: "bg-purple-500 text-white",
  PAUSED: "bg-red-500 text-white",
};

const ProjectCard = ({ project, index }) => {
  const currentClasses = colorClasses[project.color] || colorClasses.cyan;
  const currentStatusBadge = statusBadges[project.status?.toUpperCase()] || "bg-gray-500 text-white";

  return (
    <div
      className={`relative bg-white rounded-xl overflow-hidden border ${currentClasses.border} shadow-lg transition-all duration-500 flex flex-col h-full cursor-pointer hover:shadow-xl hover:-translate-y-1`}
      style={{
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.15}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-105 opacity-90"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-4 right-4 z-10">
          <span className={`px-3 py-1 text-xs font-bold uppercase rounded-full ${currentStatusBadge} shadow`}>
            {project.status}
          </span>
        </div>
        <div className="absolute bottom-4 left-4 z-10">
          <span className={`px-3 py-1 text-xs font-mono uppercase rounded-full border ${currentClasses.border} ${currentClasses.bg} ${currentClasses.text}`}>
            {project.category}
          </span>
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow relative">
        <div className="flex items-center gap-3 mb-3">
          <div className={`text-2xl ${currentClasses.text}`}>{project.icon}</div>
          <h3 className="text-xl font-extrabold text-gray-900 leading-snug line-clamp-2">{project.title}</h3>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 flex-grow">{project.scope}</p>
        {typeof project.progress === "number" ? (
          <div className="mt-auto pt-4 border-t border-gray-100 space-y-3">
            <div className="flex items-center justify-between text-gray-700 text-sm">
              <div className="flex items-center gap-2 text-green-600 font-semibold">
                <TrendingUp className="w-4 h-4" />
                <span>Physical Progress:</span>
              </div>
              <span className="font-bold text-gray-900">{project.progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div
                className={`h-2 rounded-full transition-all duration-1000 ${currentClasses.progress}`}
                style={{ width: `${project.progress}%` }}
              ></div>
            </div>
          </div>
        ) : null}
      </div>

      <div className="p-4 border-t border-gray-100 flex justify-end">
        <a
          href={project.linkUrl || `#project-${project.id}`}
          className={`flex items-center gap-1 text-sm font-bold ${currentClasses.text} hover:text-opacity-80 transition-colors group/link`}
          target={project.linkUrl ? "_blank" : undefined}
          rel={project.linkUrl ? "noreferrer" : undefined}
        >
          VIEW DETAILS
          <CheckCircle className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
        </a>
      </div>
    </div>
  );
};

function normalizeProjects(sourceProjects) {
  const list = Array.isArray(sourceProjects) && sourceProjects.length > 0 ? sourceProjects : fallbackProjects;
  return list.map((project, index) => {
    const Icon = ICON_SET[index % ICON_SET.length];
    return {
      id: project.id || project.code || `project-${index}`,
      title: project.title || "Strategic Initiative",
      category: project.category || project.status || "Strategic",
      status: project.status || "PLANNING",
      progress:
        typeof project.progress === "number"
          ? project.progress
          : typeof project.metric === "number"
          ? project.metric
          : null,
      scope: project.summary || project.scope || project.description || "",
      image: project.media?.url || project.image || project.imageUrl || PLACEHOLDER_IMAGE,
      icon: <Icon />,
      color: COLOR_KEYS[index % COLOR_KEYS.length],
      linkUrl: project.linkUrl || null,
    };
  });
}

export default function Projects({ projects: incomingProjects }) {
  const hasIncoming = Array.isArray(incomingProjects) && incomingProjects.length > 0;
  const [projectCards, setProjectCards] = useState(() =>
    hasIncoming ? normalizeProjects(incomingProjects) : normalizeProjects(null)
  );
  const [loading, setLoading] = useState(!hasIncoming);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(30px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    setProjectCards(normalizeProjects(incomingProjects));
    setLoading(false);
  }, [incomingProjects]);

  return (
    <section className="min-h-screen bg-gray-50 py-24 relative overflow-hidden font-sans selection:bg-blue-100 selection:text-gray-800">
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-30"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-100/50 rounded-full blur-[100px] pointer-events-none mix-blend-multiply opacity-30"></div>
      <div className="absolute inset-0 bg-white/50 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,white)] pointer-events-none"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8">
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-200 text-blue-600 text-sm font-semibold mb-6 shadow-sm">
            <Activity className="w-4 h-4 animate-pulse" />
            <span>INFRASTRUCTURE DEPLOYMENT STATUS</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight mb-6">
            MAJOR <span className="text-blue-600">PROJECTS</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-gray-600 leading-relaxed">
            Tracking the physical and financial progress of Federal (PSDP) and Provincial (ADP) development schemes.
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-80">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
              </div>
            </div>
            <p className="mt-6 text-blue-600 font-medium text-base tracking-wider animate-pulse">
              LOADING PROJECT DATA...
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projectCards.map((item, index) => (
              <ProjectCard key={item.id || index} project={item} index={index} />
            ))}
          </div>
        )}

        <div className="text-center mt-24">
          <a
            href="https://www.kwsc.gos.pk/our-projects"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative inline-flex items-center justify-center px-10 py-4 bg-white overflow-hidden rounded-full border border-blue-400 text-blue-600 font-bold uppercase tracking-wider hover:bg-blue-600 hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            <span className="absolute w-0 h-0 transition-all duration-500 ease-out bg-blue-500 rounded-full group-hover:w-full group-hover:h-full opacity-10"></span>
            <span className="relative flex items-center gap-3">
              View Historical Project Archives
              <Clock className="w-5 h-5 transition-transform group-hover:rotate-12" />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
