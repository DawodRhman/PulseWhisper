"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { Zap, Globe, FileText, Handshake, TrendingUp, Cpu } from "lucide-react";

import { useTranslation } from 'react-i18next';

export default function WorkWithUs() {
  const { t, i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  // --- Inject custom CSS for the sci-fi background grid ---
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

  // --- Animation Variants ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  // --- Content Data ---
  const sections = [
    {
      id: "licenses",
      icon: FileText,
      title: t('workWithUs.licenses.title'),
      subtitle: t('workWithUs.licenses.subtitle'),
      description: t('workWithUs.licenses.desc'),
      details: [
        "Bulk Water Supply Licenses (Industrial/Commercial)",
        "Water Tanker Operation Permits",
        "Sewerage Effluent Discharge NOCs",
        "Public Hydrant Authorization and Management",
      ],
      cta: t('workWithUs.licenses.cta'),
      pdfLink:
        "https://www.kwsc.gos.pk/assets/documents/DOC-20240409-WA0320..pdf",
      pdfCta: t('workWithUs.licenses.pdfCta'),
    },
    {
      id: "collaborations",
      icon: Handshake,
      title: t('workWithUs.collaborations.title'),
      subtitle: t('workWithUs.collaborations.subtitle'),
      description: t('workWithUs.collaborations.desc'),
      details: [
        "Technology Exchange Programs (Germany, Japan)",
        "Funding and Technical Assistance (ADB, World Bank)",
        "Joint Venture on Desalination Plants",
        "Research and Development with Local Universities",
      ],
      cta: t('workWithUs.collaborations.cta'),
    },
    {
      id: "investment",
      icon: TrendingUp,
      title: t('workWithUs.investment.title'),
      subtitle: t('workWithUs.investment.subtitle'),
      description: t('workWithUs.investment.desc'),
      details: [
        "Wastewater Treatment Plant PPP Schemes",
        "K-IV Bulk Water Supply Project Phases",
        "Smart Metering and Billing System Deployment",
        "Pipeline Replacement and Network Rehabilitation",
      ],
      cta: t('workWithUs.investment.cta'),
    },
  ];

  return (
    <div className="bg-[#020617] min-h-screen font-sans selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">

      {/* --- 2. Main Content: Three Sections Grid --- */}
      <section className="py-8 sm:py-12 md:py-20 lg:py-24 xl:py-28 2xl:py-32 bg-[#020617] relative">
        <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-12">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={itemVariants}
                className="bg-slate-900/60 backdrop-blur-sm p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 2xl:p-10 rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-3xl border border-white/10 shadow-lg sm:shadow-xl md:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500 transform hover:-translate-y-1 flex flex-col justify-between h-full group"
              >
                <div>
                  <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4 mb-3 sm:mb-4">
                    <section.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-cyan-400 p-1 sm:p-1.5 rounded-lg bg-cyan-900/50 shadow-md shadow-cyan-500/20 group-hover:bg-cyan-800/50 transition-colors flex-shrink-0" />
                    <h2 className="text-xl font-bold text-white group-hover:text-cyan-200 transition-colors">
                      {section.title}
                    </h2>
                  </div>

                  <p className="text-xs font-mono uppercase text-cyan-400 mb-3 tracking-wider border-b border-white/10 pb-3">
                    {section.subtitle}
                  </p>

                  <p className="text-sm md:text-base text-slate-400 mb-4 leading-relaxed">
                    {section.description}
                  </p>

                  <h3 className="text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-lg font-semibold text-gray-200 mb-2 sm:mb-3">
                    {t('workWithUs.keyFocus')}
                  </h3>
                  <ul className="space-y-1 sm:space-y-1.5 md:space-y-2 mb-5 sm:mb-6 md:mb-8">
                    {section.details.map((detail, idx) => (
                      <li
                        key={idx}
                        className="flex items-start text-slate-400 text-xs sm:text-xs md:text-sm lg:text-sm xl:text-sm 2xl:text-base"
                      >
                        <span className="text-cyan-500 mr-2 sm:mr-2.5 mt-0.5 sm:mt-1 flex-shrink-0">
                          •
                        </span>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-4 sm:mt-5 md:mt-6 space-y-2 sm:space-y-2.5 md:space-y-3">
                  {/* Primary CTA (Cyan Gradient) */}
                  <a
                    href={`#${section.id}`}
                    className="inline-flex items-center justify-center w-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 
                               bg-blue-600 text-white font-semibold sm:font-bold text-sm sm:text-base md:text-base rounded-lg sm:rounded-lg md:rounded-xl transition-all duration-300 
                               hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-500/30"
                  >
                    {section.cta}
                    <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-1.5 sm:ml-2" />
                  </a>

                  {/* Secondary PDF Link (Bordered Cyan) */}
                  {section.pdfLink && (
                    <a
                      href={section.pdfLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-full px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 md:py-3 border border-cyan-400 text-cyan-400 font-semibold text-sm sm:text-base md:text-base rounded-lg sm:rounded-lg md:rounded-xl transition-all duration-300 hover:bg-cyan-900/50 hover:text-cyan-300"
                    >
                      {section.pdfCta}
                      <FileText className="w-3 h-3 sm:w-3.5 sm:h-3.5 md:w-4 md:h-4 ml-1.5 sm:ml-2" />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* --- 3. Call to Action / Engagement Footer --- */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24 2xl:py-28 bg-slate-900/70 border-t border-cyan-700/50">
        <motion.div
          className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl 2xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 text-center"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={containerVariants}
        >
          <motion.h2
            variants={itemVariants}
            className="text-4xl font-bold text-white mb-3"
          >
            {t('workWithUs.hero.title')}
          </motion.h2>
          <motion.p
            variants={itemVariants}
            className="text-base text-cyan-300 mb-5 max-w-2xl mx-auto"
          >
            {t('workWithUs.hero.desc')}
          </motion.p>
          <motion.a
            variants={itemVariants}
            href="/contact"
            className="inline-flex items-center px-6 sm:px-8 md:px-10 lg:px-12 2xl:px-14 py-2.5 sm:py-3 md:py-3.5 lg:py-4 2xl:py-5 text-sm sm:text-base md:text-base lg:text-lg xl:text-lg 2xl:text-xl font-semibold sm:font-bold rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-xl transition-all duration-300 
                       bg-blue-600 text-white 
                       hover:bg-blue-700 shadow-lg sm:shadow-xl hover:shadow-blue-500/50"
          >
            {t('workWithUs.hero.cta')}
            <Globe className="w-4 h-4 sm:w-5 sm:h-5 md:w-5 md:h-5 lg:w-6 lg:h-6 ml-2 sm:ml-2.5 md:ml-3 lg:ml-3" />
          </motion.a>
        </motion.div>
      </section>
    </div>
  );
}

// ArrowUpRight component (Helper)
const ArrowUpRight = (props) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={props.className}
  >
    <path d="M7 7l10 10M7 17V7h10" />
  </svg>
);
