"use client";
import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Handshake, TrendingUp, Cpu } from "lucide-react";

export default function WorkWithUs() {
    // Inject subtle grid background
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
      .tech-grid-bg {
        background-image:
          linear-gradient(to right, rgba(6,182,212,0.1) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(6,182,212,0.1) 1px, transparent 1px);
        background-size: 40px 40px;
      }
    `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.15 } },
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.6, ease: "easeOut" },
        },
    };

    const sections = [
        {
            id: "licenses",
            icon: FileText,
            title: "Licensing & Permits",
            description:
                "Streamlined process for licenses, hydrants, and effluent discharge compliance.",
            cta: "Apply Now",
        },
        {
            id: "collaborations",
            icon: Handshake,
            title: "Collaborations",
            description:
                "National & international partnerships driving tech transfer and funding.",
            cta: "View Portfolio",
        },
        {
            id: "investment",
            icon: TrendingUp,
            title: "Investment Opportunities",
            description:
                "High-impact private sector opportunities in water & sewerage infrastructure.",
            cta: "Explore Models",
        },
        {
            id: "strategic",
            icon: Cpu,
            title: "Strategic Engagement",
            description:
                "Engage with KW&SC for regulatory, funding, and technology projects.",
            cta: "Contact Us",
        },
    ];

    return (
        <section className="relative bg-[#020617] text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 px-3 sm:px-4 md:px-6 lg:px-8 xl:px-16 overflow-hidden">
            {/* Background Grid */}
            <div className="absolute inset-0 tech-grid-bg opacity-20 pointer-events-none"></div>

            {/* Header */}
            <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={containerVariants}
                className="relative z-10 text-center max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto mb-8 sm:mb-12 md:mb-16 lg:mb-20"
            >
                <motion.h2
                    variants={itemVariants}
                    className="text-4xl sm:text-6xl lg:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-cyan-300 drop-shadow-lg"
                >
                    Work With KW&SC
                </motion.h2>
                <motion.p
                    variants={itemVariants}
                    className="mt-2 sm:mt-3 md:mt-4 lg:mt-6 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-300 font-light leading-relaxed sm:leading-relaxed md:leading-relaxed"
                >
                    Partner with us for licensing, investment, collaborations, and
                    strategic projects shaping Karachi's water and sewerage systems.
                </motion.p>
            </motion.div>

            {/* Cards */}
            <motion.div
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 relative z-10"
            >
                {sections.map((section, i) => (
                    <motion.div
                        key={i}
                        variants={itemVariants}
                        className="bg-slate-900/60 backdrop-blur-sm p-4 sm:p-5 md:p-6 lg:p-7 xl:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-white/10 shadow-lg flex flex-col justify-between hover:shadow-cyan-500/30 transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                            <section.icon className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 lg:w-9 lg:h-9 text-cyan-400 p-1 sm:p-1.5 md:p-2 bg-cyan-900/50 rounded-lg shadow-md shadow-cyan-500/20 flex-shrink-0" />
                            <h3 className="text-xl font-bold text-white leading-tight">
                                {section.title}
                            </h3>
                        </div>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-gray-300 flex-1 mb-4 sm:mb-5 md:mb-6 leading-relaxed">
                            {section.description}
                        </p>
                        <a
                            href={`#${section.id}`}
                            className="mt-2 sm:mt-3 md:mt-4 inline-flex items-center justify-center px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-gray-900 font-semibold rounded-lg hover:from-cyan-400 hover:to-blue-500 hover:shadow-lg hover:shadow-cyan-500/30 transition-all duration-300"
                        >
                            {section.cta}
                        </a>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
