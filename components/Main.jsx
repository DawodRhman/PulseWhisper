"use client";
import React, { useEffect, useState, useRef } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import Link from "next/link";
import { Globe, MoveRight, Plug, AlertCircle, Truck, Receipt } from "lucide-react";
import { useTranslation } from 'react-i18next';

import GetYourBillPopup from "@/components/GetYourBill";
import NewConnectionPopup from "@/components/NewConnectionPopup";
import EComplaintPopup from "@/components/EComplaintPopup";
import BookTankerPopup from "@/components/BookTankerPopup";

export default function Home({ hero }) {
  const [loading, setLoading] = useState(true);
  const { t } = useTranslation();
  const {
    eyebrow = t("hero.eyebrow"),
    title = t("hero.title"),
    subtitle = t("hero.subtitle"),
    ctaLabel = t("hero.cta"),
    ctaHref = "/aboutus",
    backgroundImage = "/karachicharminar.gif"
  } = hero || {};
  const [language, setLanguage] = useState("en");
  const [chatOpen, setChatOpen] = useState(false);
  const [showBillPopup, setShowBillPopup] = useState(false);
  const [showNewConnectionPopup, setShowNewConnectionPopup] = useState(false);
  const [showEComplaintPopup, setShowEComplaintPopup] = useState(false);
  const [showBookTankerPopup, setShowBookTankerPopup] = useState(false);

  const [messages, setMessages] = useState([
    { from: "bot", text: "Hello! I am KWSC Assistant. How can I help you today?" },
  ]);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef(null);

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

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

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

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    setMessages(prev => [...prev, { from: "user", text: inputText }]);
    setInputText("");

    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Thank you for your message. Our team will get back to you shortly." },
      ]);
    }, 1000);
  };

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
            title="New Connection"
          >
            <Plug size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">New Connection</span>
          </button>

          {/* E-Complaint */}
          <button
            onClick={() => setShowEComplaintPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title="E-Complaint"
          >
            <AlertCircle size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">E-Complaint</span>
          </button>

          {/* Book Tanker */}
          <button
            onClick={() => setShowBookTankerPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title="Book Tanker"
          >
            <Truck size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Book Tanker</span>
          </button>

          {/* Get Your Bill */}
          <button
            onClick={() => setShowBillPopup(true)}
            className="group flex flex-col items-center gap-2 px-4 sm:px-6 py-3 sm:py-4 rounded-xl border border-cyan-400/30 bg-white/5 text-cyan-300 backdrop-blur-sm hover:bg-cyan-500/20 hover:text-white hover:border-cyan-400/50 transition-all duration-200 hover:scale-105"
            title="Get Your Bill"
          >
            <Receipt size={28} className="sm:w-8 sm:h-8 group-hover:scale-110 transition-transform" />
            <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Get Your Bill</span>
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

        {/* Glass Panel */}
        <div
          className="relative z-[30] w-full max-w-sm sm:max-w-2xl md:max-w-3xl mx-auto px-4 sm:px-6 md:px-10 py-6 sm:py-8 md:py-10 rounded-2xl sm:rounded-3xl
            bg-white/5 backdrop-blur-sm border border-white/5 ring-1 ring-white/10
            flex flex-col items-center text-center shadow-lg"
        >
          <h1
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white"
          >
            {title.toUpperCase()}
          </h1>

          <p className="mt-3 sm:mt-4 md:mt-5 text-xs sm:text-base md:text-lg text-slate-200 max-w-2xl mx-auto font-light leading-relaxed">
            {subtitle}
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
        <div className="fixed bottom-3 sm:bottom-5 right-3 sm:right-5 z-[60] flex flex-col items-center">
          <button
            onClick={() => setChatOpen(prev => !prev)}
            className="w-16 sm:w-20 md:w-24 h-16 sm:h-20 md:h-24 rounded-full overflow-hidden shadow-lg transition-all duration-300 hover:shadow-[0_0_25px_rgba(6,182,212,0.7)] hover:scale-110"
            title="Chat with KWSC Assistant"
          >
            <img
              src="/Ai_Bot.png"
              alt="KWSC Assistant"
              className="w-full h-full object-cover"
            />
          </button>

          {chatOpen && (
            <div className="mt-2 sm:mt-3 w-72 sm:w-80 md:w-96 bg-gray-100 rounded-2xl border border-gray-300 shadow-2xl flex flex-col overflow-hidden animate-slide-in max-h-[70vh] sm:max-h-[80vh]">
              <div className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 text-gray-800 font-semibold flex justify-between items-center border-b border-gray-300">
                <div className="flex items-center gap-1.5 sm:gap-2">
                  <div className="w-8 sm:w-10 h-8 sm:h-10 rounded-full overflow-hidden flex-shrink-0">
                    <img src="/Ai_Bot.png" alt="KWSC Assistant" className="w-full h-full object-cover" />
                  </div>
                  <span className="text-sm sm:text-base truncate">KWSC Assistant</span>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-gray-600 font-normal  text-5xl flex-shrink-0 ml-2">&times;</button>
              </div>

              <div className="flex-1 p-3 sm:p-4 overflow-y-auto space-y-2 bg-gray-50">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.from === "bot" ? "justify-start" : "justify-end"}`}>
                    <div
                      className={`px-3 sm:px-4 py-2 rounded-2xl max-w-xs break-words text-sm ${msg.from === "bot"
                        ? "bg-gray-300 text-gray-900"
                        : "bg-cyan-500 text-white"
                        }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="px-3 sm:px-4 py-2 sm:py-3 border-t border-gray-300 flex items-center gap-1.5 sm:gap-2 bg-gray-200">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                  placeholder="Type message..."
                  className="flex-1 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg border border-gray-300 text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-400"
                />
                <button
                  onClick={handleSendMessage}
                  className="bg-cyan-500 hover:bg-cyan-600 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-white font-semibold transition-all duration-200 text-xs sm:text-sm flex-shrink-0"
                >
                  Send
                </button>
              </div>
            </div>
          )}
        </div>

      </section>
    </div>
  );
}
