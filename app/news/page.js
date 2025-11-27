
"use client";
import React, { useEffect, useState } from "react";
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
  Zap 
} from "lucide-react";

export default function News() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('updates');

  // Inject custom animations
  useEffect(() => {
    const style = document.createElement('style');
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

  const latestUpdates = [
    {
      date: "Aug 13, 2025",
      title: "PPP Chairman Bilawal Bhutto Zardari inaugurates New Hub Canal",
      description: "The New Hub Canal project has been officially inaugurated, marking a significant milestone in Karachi's water infrastructure development.",
      type: "Inauguration",
      id: "UP-001"
    },
    {
      date: "Aug 6, 2025",
      title: "Mayor Karachi visits New Hub Canal with officials and experts",
      description: "Comprehensive inspection and review of the completed New Hub Canal project by city leadership.",
      type: "Inspection",
      id: "UP-002"
    },
    {
      date: "Aug 6, 2025",
      title: "First major water project completed in 22 years",
      description: "KW&SC celebrates the completion of the city's first major water project in nearly two decades.",
      type: "Achievement",
      id: "UP-003"
    },
    {
      date: "July 24, 2025",
      title: "KWSC Board approves Ahmed Ali Siddiqui as permanent CEO",
      description: "Board of Directors officially appoints Ahmed Ali Siddiqui as the permanent CEO of KW&SC.",
      type: "Leadership",
      id: "UP-004"
    },
    {
      date: "May 3, 2025",
      title: "CEO visits NEK Old & New Filter Plants",
      description: "CEO conducts inspection of water filtration facilities to ensure quality standards.",
      type: "Inspection",
      id: "UP-005"
    }
  ];

  const pressReleases = [
    {
      date: "Aug 13, 2025",
      title: "New Hub Canal Project Successfully Completed",
      description: "KW&SC announces the successful completion of the New Hub Canal project, ahead of schedule.",
      link: "https://www.kwsc.gos.pk/news-and-updates#press-release",
      id: "PR-101"
    },
    {
      date: "July 24, 2025",
      title: "New CEO Appointment Announcement",
      description: "Official announcement regarding the appointment of Ahmed Ali Siddiqui as permanent CEO.",
      link: "https://www.kwsc.gos.pk/news-and-updates#press-release",
      id: "PR-102"
    }
  ];

  const mediaGallery = [
    {
      title: "Hub Canal Inauguration Ceremony",
      description: "Photos from the official inauguration ceremony of the New Hub Canal project",
      type: "Photos",
      img: "/otherImages/bhutto.png"
    },
    {
      title: "Infrastructure Development",
      description: "Visual documentation of ongoing infrastructure development projects",
      type: "Photos",
      img: "/otherImages/infa.png"
    },
    {
      title: "Community Engagement",
      description: "Images from community engagement and development programs",
      type: "Photos",
      img: "/otherImages/comunity.jpeg"
    }
  ];

  return (
    <div className="bg-[#020617] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">
      {loading && <Loader />}
      
      {/* Hero Section with Cyber Overlay */}
      <section className="relative h-[60vh] transition-opacity duration-700 bg-[url('/karachicharminar.gif')] bg-cover bg-center text-white flex justify-center items-center overflow-hidden">
        {/* Dark overlay to blend with dark theme */}
        <div className="absolute inset-0 bg-slate-900/80 z-0"></div>
        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 tech-grid-bg opacity-30 z-0"></div>
        
        <div className="relative z-[1] max-w-5xl mx-auto text-center px-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
                <Globe className="w-3 h-3 animate-pulse" />
                <span>KW&SC INFORMATION GRID</span>
            </div>
            <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
              NEWS & UPDATES
            </h2>
            <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
              Real-time data streams regarding infrastructure developments and corporate achievements.
            </p>
        </div>
        
        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
      </section>

      <div className="relative py-20">
        {/* Background Glows */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-12">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                <Cpu className="text-cyan-400 w-8 h-8" />
                LATEST TRANSMISSIONS
              </h1>
              <div className="h-1 w-24 bg-gradient-to-r from-transparent via-cyan-500 to-transparent mx-auto"></div>
            </Fade>
          </div>

          {/* Sci-Fi Tab Navigation */}
          <div className="flex justify-center mb-16">
            <div className="bg-slate-900/80 backdrop-blur-lg p-1.5 rounded-xl border border-white/10 shadow-2xl inline-flex flex-wrap justify-center gap-2">
              {[
                { id: 'updates', label: 'Live Updates', icon: <Activity className="w-4 h-4"/> },
                { id: 'press', label: 'Press Releases', icon: <FileText className="w-4 h-4"/> },
                { id: 'media', label: 'Visual Data', icon: <Camera className="w-4 h-4"/> }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-6 py-3 rounded-lg font-mono text-sm tracking-wide transition-all duration-300 border
                    ${activeTab === tab.id 
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)]' 
                      : 'bg-transparent border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                    }
                  `}
                >
                  {tab.icon}
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-6xl mx-auto min-h-[400px]">
            {activeTab === 'updates' && (
              <div className="grid grid-cols-1 gap-6">
                {latestUpdates.map((update, index) => (
                  <Fade key={index} direction="up" triggerOnce duration={600} delay={index * 100}>
                    <div className="group relative bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-xl p-8 overflow-hidden hover:border-cyan-500/50 transition-all duration-500">
                      {/* Decorative Left Bar */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      
                      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className="bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 px-3 py-0.5 rounded text-xs font-mono uppercase tracking-wider">
                              {update.type}
                            </span>
                            <span className="text-slate-500 text-xs font-mono flex items-center gap-1">
                              <Calendar className="w-3 h-3" /> {update.date}
                            </span>
                            <span className="text-slate-600 text-[10px] font-mono border border-slate-700 px-1 rounded">
                              ID: {update.id}
                            </span>
                          </div>
                          
                          <h3 className="text-xl font-bold text-white mb-3 group-hover:text-cyan-200 transition-colors">
                            {update.title}
                          </h3>
                          <p className="text-slate-400 leading-relaxed text-sm">
                            {update.description}
                          </p>
                        </div>
                        
                        {/* Interactive Element */}
                        <div className="hidden md:flex items-center justify-center">
                            <div className="w-12 h-12 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:bg-cyan-950 group-hover:border-cyan-500/50 transition-all duration-300">
                                <Zap className="w-5 h-5 text-slate-500 group-hover:text-cyan-400" />
                            </div>
                        </div>
                      </div>
                    </div>
                  </Fade>
                ))}
              </div>
            )}

            {activeTab === 'press' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pressReleases.map((release, index) => (
                  <Fade key={index} direction="up" triggerOnce duration={600} delay={index * 100}>
                    <div className="group relative bg-slate-900/40 backdrop-blur-md border border-white/10 rounded-xl p-8 hover:bg-slate-800/40 hover:border-purple-500/50 transition-all duration-300 h-full flex flex-col">
                      
                      <div className="flex items-center justify-between mb-6">
                        <span className="bg-purple-950/30 border border-purple-500/30 text-purple-300 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          OFFICIAL RELEASE
                        </span>
                        <span className="text-slate-500 text-xs font-mono">
                          {release.date}
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-white mb-4 group-hover:text-purple-200 transition-colors">
                        {release.title}
                      </h3>
                      
                      <p className="text-slate-400 mb-8 text-sm leading-relaxed flex-grow">
                        {release.description}
                      </p>

                      <Link
                        href={release.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto inline-flex items-center gap-2 text-purple-400 font-mono text-sm hover:text-purple-300 transition-colors group/link"
                      >
                        ACCESS DOCUMENT
                        <ChevronRight className="w-4 h-4 transition-transform group-hover/link:translate-x-1" />
                      </Link>
                      
                      {/* Subtle grid overlay on card */}
                      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:20px_20px] opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500"></div>
                    </div>
                  </Fade>
                ))}
              </div>
            )}

            {activeTab === 'media' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {mediaGallery.map((item, index) => (
                  <Fade key={index} direction="up" triggerOnce duration={600} delay={index * 100}>
                    <div className="group relative bg-slate-900 rounded-xl overflow-hidden border border-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)] transition-all duration-500">
                      
                      {/* Image Container with Scanner Effect */}
                      <div className="relative h-56 overflow-hidden">
                         {/* Scanner Line */}
                        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-400/20 to-transparent z-20 h-[200%] w-full -translate-y-full group-hover:animate-scan pointer-events-none"></div>
                        
                        {/* Placeholder/Actual Image */}
                        <img 
                            src={item.img} 
                            alt={item.title}
                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700"
                        />
                        
                        <div className="absolute top-3 right-3 z-30">
                            <div className="bg-black/60 backdrop-blur px-2 py-1 rounded border border-white/20">
                                <Camera className="w-4 h-4 text-white" />
                            </div>
                        </div>
                      </div>

                      <div className="p-6">
                        <div className="flex items-center gap-2 mb-3">
                            <Tag className="w-3 h-3 text-slate-500" />
                            <span className="text-xs font-mono text-cyan-500 uppercase tracking-widest">
                                {item.type}
                            </span>
                        </div>
                        
                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-200 transition-colors">
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
      </div>
    </div>
  );
}