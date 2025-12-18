"use client";
import React, { useEffect, useState } from 'react';
import { ChevronRight, Sun, Moon } from 'lucide-react';
import { useTranslation } from "react-i18next";

const FALLBACK_MEDIA = [
    { name: "Water Treatment", title: "Hub Filtration Plant", imageUrl: "/bg-1.jpg" },
    { name: "Infrastructure", title: "New Pipeline Project", imageUrl: "/bg-2.jpg" },
    { name: "Community", title: "Awareness Campaign", imageUrl: "/bg-1.jpg" },
    { name: "Operations", title: "Control Room", imageUrl: "/bg-2.jpg" },
    { name: "Maintenance", title: "Sewerage Cleaning", imageUrl: "/bg-1.jpg" },
];

export default function MediaGallery({ items = [] }) {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const toggleTheme = () => setIsDarkTheme(prev => !prev);

    const themeClasses = {
        dark: {
            mainBg: "bg-[#020617]",
            headerAccent: "text-cyan-500",
            headerText: "text-white",
            subtitleText: "text-slate-400",
            cardBg: "bg-slate-800/60 border-slate-700",
            cardText: "text-white",
            cardTitle: "text-cyan-400",
            hoverShadow: "hover:shadow-[0_0_25px_rgba(34,211,238,0.4)]",
            carouselBg: "bg-gradient-to-r from-[#020617] via-transparent to-[#020617]",
        },
        light: {
            mainBg: "bg-gray-50",
            headerAccent: "text-blue-600",
            headerText: "text-gray-900",
            subtitleText: "text-gray-600",
            cardBg: "bg-white border-gray-200",
            cardText: "text-gray-800",
            cardTitle: "text-blue-600",
            hoverShadow: "hover:shadow-xl hover:shadow-blue-100",
            carouselBg: "bg-gradient-to-r from-gray-50 via-transparent to-gray-50",
        }
    };
    const { t: i18n_t } = useTranslation();
    const t = isDarkTheme ? themeClasses.dark : themeClasses.light;

    // ...existing code...
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes slide-left-loop {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); }
            }
            .carousel-track {
                animation: slide-left-loop 90s linear infinite; /* reverted to original timing */
            }
            .carousel-track:hover {
                animation-play-state: paused;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const sourceItems = items.length > 0 ? items : FALLBACK_MEDIA;
    const displayItems = [...sourceItems, ...sourceItems];

    return (
        <section className={`${t.mainBg} py-8 sm:py-12 md:py-20 lg:py-28 xl:py-32 relative overflow-hidden transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 relative z-10">

                {/* Theme Toggle Button */}
                <div className="absolute top-2 sm:top-3 md:top-4 right-3 sm:right-4 md:right-6 lg:right-8">
                    <button
                        onClick={toggleTheme}
                        className={`p-2 sm:p-2.5 md:p-3 rounded-full ${isDarkTheme ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'} shadow-lg transition-all duration-300 hover:scale-105`}
                        title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
                    >
                        {isDarkTheme ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>

                {/* Section Header */}
                <div className="text-center mb-6 sm:mb-10 md:mb-12 lg:mb-16 pt-4 sm:pt-6 md:pt-8">
                    <p className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold ${t.headerText} transition-colors duration-500`}>
                        {i18n_t("media.gallery.title") || "KW&SC GALLERY"}
                    </p>
                    <p className={`mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg max-w-2xl mx-auto ${t.subtitleText} transition-colors duration-500`}>
                        {i18n_t("media.gallery.desc") || "Meet the dedicated individuals steering KW&SC towards a prosperous future for Karachi."}
                    </p>
                </div>
            </div>

            {/* Moving Gallery / Carousel */}
            <div className="relative w-full overflow-hidden py-4 sm:py-6 md:py-8 lg:py-10">
                <div className={`absolute inset-y-0 left-0 w-12 sm:w-16 md:w-20 lg:w-32 ${t.carouselBg} z-20`}></div>
                <div className={`absolute inset-y-0 right-0 w-12 sm:w-16 md:w-20 lg:w-32 ${t.carouselBg} z-20 rotate-180`}></div>

                <div className="carousel-track flex items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-8 px-2 sm:px-4 md:px-8 lg:px-12 xl:px-16" style={{ width: `${displayItems.length * 320}px` }}>
                    {displayItems.map((item, index) => (
                        <div
                            key={index}
                            className={`flex-shrink-0 w-40 sm:w-56 md:w-72 lg:w-80 h-48 sm:h-56 md:h-72 lg:h-96 p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl border ${t.cardBg} shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${t.hoverShadow}`}
                        >
                            <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-32 lg:h-32 rounded-full mx-auto mb-2 sm:mb-3 md:mb-4 lg:mb-6 object-cover border-2 border-cyan-500/50 transition-colors duration-300"
                            />
                            <h3 className={`text-sm sm:text-base md:text-lg font-bold text-center mb-2 ${t.cardText} transition-colors duration-300`}>
                                {item.name || item.title}
                            </h3>
                            <p className={`text-xs sm:text-sm text-center ${t.cardTitle} transition-colors duration-300`}>
                                {item.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* ...existing code... */}

            <div className="text-center mt-8 sm:mt-10 md:mt-12 lg:mt-16 z-10 relative">
                <a
                    href="/aboutus/leadership"
                    className={`inline-flex items-center gap-2 px-4 sm:px-6 md:px-8 py-2 sm:py-2.5 md:py-3 rounded-full text-sm sm:text-base md:text-lg font-semibold ${isDarkTheme ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl'} transition-all duration-300 hover:scale-105`}
                >
                    {i18n_t("media.gallery.viewAll") || "View All Leaders"}
                    <ChevronRight size={20} />
                </a>
            </div>
        </section>
    );
}
