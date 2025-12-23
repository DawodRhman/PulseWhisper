"use client";
import React, { useEffect, useState, useRef } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import Link from "next/link";
import { Globe, MoveRight, Plug, AlertCircle, Truck, Receipt, FileSearch } from "lucide-react";
import { useTranslation } from 'react-i18next';

import GetYourBillPopup from "@/components/GetYourBill";
import NewConnectionPopup from "@/components/NewConnectionPopup";
import EComplaintPopup from "@/components/EComplaintPopup";
import BookTankerPopup from "@/components/BookTankerPopup";
import TrackComplaintPopup from "@/components/TrackComplaintPopup";
import ChatBot from "@/components/ChatBot";

export default function Home({ hero }) {
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  const {
    eyebrow = t("hero.eyebrow"),
    title: rawTitle = t("hero.title"),
    subtitle: rawSubtitle = t("hero.subtitle"),
    ctaLabel = t("hero.cta"),
    ctaHref = "/aboutus",
    backgroundImage = "/karachicharminar.gif"
  } = hero || {};

  const displayTitle = (isUrdu && hero?.titleUr) ? hero.titleUr : rawTitle;
  const displaySubtitle = (isUrdu && hero?.subtitleUr) ? hero.subtitleUr : rawSubtitle;

  const [language, setLanguage] = useState("en");
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [showNewConnectionPopup, setShowNewConnectionPopup] = useState(false);
  const [showEComplaintPopup, setShowEComplaintPopup] = useState(false);
  const [showBookTankerPopup, setShowBookTankerPopup] = useState(false);
  const [showTrackComplaintPopup, setShowTrackComplaintPopup] = useState(false);

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
      .to(".wrapper", { y: "-100%", ease: "power4.inOut", duration: 1 }, "-=0.8");
  }, []);

  // Listen for global popup open events triggered from other components (e.g., Services cards)
  useEffect(() => {
    const handlePopup = (event) => {
      const action = event.detail;
      switch (action) {
        case "newConnection":
          setShowNewConnectionPopup(true);
          break;
        case "eComplaint":
          setShowEComplaintPopup(true);
          break;
        case "bookTanker":
          setShowBookTankerPopup(true);
          break;
        case "bill":
          setShowBillPopup(true);
          break;
        default:
          break;
      }
    };

    window.addEventListener("kwsc-open-popup", handlePopup);
    return () => window.removeEventListener("kwsc-open-popup", handlePopup);
  }, []);

  return (
    <div className="bg-[#020617] min-h-[100vh] font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-hidden relative">
      {loading && <Loader />}

      <section
        className="relative min-h-screen transition-opacity duration-700 bg-cover bg-center text-white flex flex-col items-center justify-start overflow-hidden px-4 sm:px-6 pt-20 sm:pt-24 md:pt-32 lg:pt-40"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >

        {/* Overlay */}
        <div className="absolute inset-0 bg-slate-900/50 z-0"></div>
        <div
          className="absolute inset-0 bg-[linear-gradient(to_right,rgba(6,182,212,0.05)1px,transparent 1px),linear-gradient(to_bottom,rgba(6,182,212,0.05)1px,transparent 1px)] bg-[length:40px_40px] opacity-15 z-0 pointer-events-none"
        ></div>

        {/* Top Buttons - Interactive Icons */}
        <div className="relative z-[20] flex flex-row flex-wrap justify-center gap-3 sm:gap-4 md:gap-6 mb-6 sm:mb-8 md:mb-10 w-full">
          {/* New Connection */}
          <button
            onClick={() => setShowNewConnectionPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title={t("services.newConnection")}
          >
            <Plug size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{t("services.newConnection")}</span>
          </button>

          {/* E-Complaint */}
          <button
            onClick={() => setShowEComplaintPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title={t("services.eComplaint")}
          >
            <AlertCircle size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{t("services.eComplaint")}</span>
          </button>

          {/* Book Tanker */}
          <button
            onClick={() => setShowBookTankerPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title={t("services.bookTanker")}
          >
            <Truck size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{t("services.bookTanker")}</span>
          </button>

          {/* Get Your Bill */}
          <button
            onClick={() => setShowBillPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title={t("services.getYourBill")}
          >
            <Receipt size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">{t("services.getYourBill")}</span>
          </button>

          {/* Track Complaint */}
          <button
            onClick={() => setShowTrackComplaintPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title="Track Your Complaint"
          >
            <FileSearch size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Track Complaint</span>
          </button>
        </div>

        {/* Popups */}
        <NewConnectionPopup
          open={showNewConnectionPopup}
          onClose={() => setShowNewConnectionPopup(false)}
        />
        <EComplaintPopup
          open={showEComplaintPopup}
          onClose={() => setShowEComplaintPopup(false)}
        />
        <BookTankerPopup
          open={showBookTankerPopup}
          onClose={() => setShowBookTankerPopup(false)}
        />
        <GetYourBillPopup
          open={showBillPopup}
          onClose={() => setShowBillPopup(false)}
        />
        <TrackComplaintPopup
          open={showTrackComplaintPopup}
          onClose={() => setShowTrackComplaintPopup(false)}
        />

        {/* Glass Panel */}
        <div
          className="relative z-[30] w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 rounded-2xl sm:rounded-3xl
            bg-white/5 backdrop-blur-sm border border-white/5 ring-1 ring-white/10
            flex flex-col items-center text-center shadow-lg"
        >
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white"
          >
            {displayTitle?.toUpperCase()}
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            {displaySubtitle}
          </p>

          <div className="mt-6 sm:mt-8 md:mt-10">
            <Link
              href={ctaHref}
              className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/10
                bg-white/5 hover:bg-white/10 backdrop-blur-sm font-semibold text-white transition-all duration-200 text-sm sm:text-base"
            >
              <span className="whitespace-nowrap">{ctaLabel}</span>
              <MoveRight size={18} className="sm:block hidden" />
              <MoveRight size={16} className="sm:hidden" />
            </Link>
          </div>
        </div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 w-full h-24 sm:h-32 md:h-36 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>

        {/* CHAT BOT */}
        <ChatBot />
      </section>
    </div>
  );
}
