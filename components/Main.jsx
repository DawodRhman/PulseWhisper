"use client";
import React, { useEffect, useState, useMemo } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import Link from "next/link";
import { Globe, MoveRight, Share2 } from "lucide-react";
import { SocialLinks } from "@/components/SocialLinks";

const HERO_FALLBACK = {
  eyebrow: "Karachi Water & Sewerage Corporation",
  title: "Committed to Deliver!",
  subtitle: "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
  ctaLabel: "Learn About KW&SC",
  ctaHref: "/aboutus",
  backgroundImage: "/karachicharminar.gif",
};

export default function Home({ hero }) {
  const [loading, setLoading] = useState(true);

  const sideButtons = [
    { title: "New Connection", link: "/new-connection" },
    { title: "E-Complaint", link: "/e-complaint" },
    { title: "Book Tanker", link: "/book-tanker" },
    { title: "Get Your Bill", link: "/get-bill" },
  ];

  // Loader animation
  useEffect(() => {
    const loaderTimeline = gsap.timeline({ onComplete: () => setLoading(false) });

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

  const heroContent = useMemo(() => ({
    ...HERO_FALLBACK,
    ...(hero || {}),
  }), [hero]);

  return (
    <div className="bg-[#020617] min-h-[70vh] font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden relative">
      {loading && <Loader />}

      {/* HERO SECTION */}
      <section
        className="relative h-[70vh] transition-opacity duration-700 bg-cover bg-center text-white flex justify-center items-center overflow-hidden"
        style={{ backgroundImage: `url(${heroContent.backgroundImage || HERO_FALLBACK.backgroundImage})` }}
      >
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-slate-900/80 z-0"></div>

        {/* Cyber Grid Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.1)1px,transparent 1px),linear-gradient(to_bottom,rgba(6,182,212,0.1)1px,transparent 1px)] bg-[length:40px_40px] mask-[radial-gradient(circle_at_center,_black_40%,_transparent_80%)] opacity-40 z-0"></div>

        {/* RIGHT SIDE BUTTONS */}
        <div className="absolute right-4 top-1/4 flex flex-col gap-4 z-[10]">
          {sideButtons.map((btn, idx) => (
            <Link
              key={idx}
              href={btn.link}
              className="px-4 py-2 rounded-md border border-cyan-400 bg-white/10 text-cyan-400 text-sm font-medium backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:scale-105 transition-all duration-300 cursor-pointer"
            >
              {btn.title}
            </Link>
          ))}
        </div>

        {/* Hero Content */}
        <div className="relative z-[1] max-w-5xl mx-auto text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
            <Globe className="w-3 h-3 animate-pulse" />
            <span>{heroContent.eyebrow}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            {heroContent.title}
          </h1>

          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            {heroContent.subtitle}
          </p>

          <div className="mt-10 flex justify-center">
            <Link
              href={heroContent.ctaHref || HERO_FALLBACK.ctaHref}
              className="relative z-20 text-[18px] px-6 py-3 border-2 border-cyan-400 rounded-lg font-bold 
              hover:-translate-y-1 hover:border-cyan-300 hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] transition-all duration-300 ease-in-out 
              inline-flex group items-center pl-6 bg-white/10 backdrop-blur-sm hover:bg-gradient-to-r hover:from-cyan-500/30 hover:to-blue-500/30 cursor-pointer"
            >
              {heroContent.ctaLabel}
              <span className="ml-3 w-0 overflow-hidden transition-all duration-300 delay-75 ease-in-out group-hover:min-w-8 group-hover:w-8">
                <MoveRight size={40} />
              </span>
            </Link>
          </div>

          <div className="mt-12 flex flex-col items-center gap-4">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-cyan-300/80">
              <Share2 className="w-4 h-4" />
              <span>Connect With KW&SC</span>
            </div>
            <SocialLinks className="justify-center" />
          </div>
        </div>

        {/* Decorative bottom fade */}
        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
      </section>
    </div>
  );
}
