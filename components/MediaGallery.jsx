"use client";
import React, { useEffect, useState } from 'react';
import { ChevronRight, Globe, Sun, Moon } from 'lucide-react';

// Mock data for leaders and their images
const leadersData = [
    { name: "Syed Nasir Hussain Shah", title: "Minister LG&HD", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+1" },
    { name: "Syed Salahuddin Ahmed", title: "MD KW&SC", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+2" },
    { name: "Abdul Jabbar Shah", title: "COO KW&SC", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+3" },
    { name: "Engr. Asadullah Khan", title: "DMD (T/P&D)", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+4" },
    { name: "Dr. Syed Saif ur Rehman", title: "Administrator KMC", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+5" },
    { name: "Hafiz Muhammad Ilyas", title: "Chief Engineer (Water)", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+6" },
    { name: "Naseer Ahmed", title: "Chief Engineer (Sewerage)", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+7" },
    { name: "Muhammad Sohail", title: "Chief Engineer (M&E)", imageUrl: "https://placehold.co/150x150/0f172a/94a3b8?text=Leader+8" },
];

export default function MediaGallery({ leaders }) {
    const [isDarkTheme, setIsDarkTheme] = useState(true);

    const toggleTheme = () => setIsDarkTheme(prev => !prev);

    // Theme-dependent classes
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
    const t = isDarkTheme ? themeClasses.dark : themeClasses.light;

    // Inject custom CSS for carousel animation
    useEffect(() => {
        const style = document.createElement("style");
        style.innerHTML = `
            @keyframes slide-left-loop {
                0% { transform: translateX(0%); }
                100% { transform: translateX(-50%); } /* Half of total width to loop */
            }
            .carousel-track {
                animation: slide-left-loop 40s linear infinite; /* Adjust speed here */
            }
            .carousel-track:hover {
                animation-play-state: paused;
            }
        `;
        document.head.appendChild(style);
        return () => document.head.removeChild(style);
    }, []);

    const sourceLeaders = Array.isArray(leaders) && leaders.length ? leaders : leadersData;
    // Duplicate leaders to create an infinite loop effect
    const extendedLeadersData = [...sourceLeaders, ...sourceLeaders];

    return (
        <section className={`${t.mainBg} py-20 md:py-32 relative overflow-hidden transition-colors duration-500`}>
            <div className="max-w-7xl mx-auto px-6 lg:px-8 relative z-10">

                {/* Theme Toggle Button */}
                <div className="absolute top-0 right-6 md:right-0">
                    <button
                        onClick={toggleTheme}
                        className={`p-3 rounded-full ${isDarkTheme ? 'bg-cyan-500 text-white' : 'bg-blue-600 text-white'} shadow-lg transition-all duration-300 hover:scale-105`}
                        title={isDarkTheme ? "Switch to Light Theme" : "Switch to Dark Theme"}
                    >
                        {isDarkTheme ? <Sun size={24} /> : <Moon size={24} />}
                    </button>
                </div>

                {/* Section Header */}
                <div className="text-center mb-16 pt-8">
                    <h2 className={`text-xl font-mono uppercase ${t.headerAccent} tracking-widest mb-3 transition-colors duration-500`}>
                        Leadership
                    </h2>
                    <p className={`text-4xl md:text-5xl font-extrabold ${t.headerText} transition-colors duration-500`}>
                        Our <span className={`${t.headerAccent}`}>Leaders</span> & Visionaries
                    </p>
                    <p className={`mt-4 text-lg max-w-2xl mx-auto ${t.subtitleText} transition-colors duration-500`}>
                        Meet the dedicated individuals steering KW&SC towards a prosperous future for Karachi.
                    </p>
                </div>
            </div>

            {/* Moving Gallery / Carousel */}
            <div className="relative w-full overflow-hidden py-8">
                {/* Overlay gradients for fade effect at edges */}
                <div className={`absolute inset-y-0 left-0 w-32 ${t.carouselBg} z-20`}></div>
                <div className={`absolute inset-y-0 right-0 w-32 ${t.carouselBg} z-20 rotate-180`}></div>

                <div className="carousel-track flex items-center gap-8 px-8 md:px-16" style={{ width: `${extendedLeadersData.length * 200}px` }}>
                        {extendedLeadersData.map((leader, index) => (
                        <div
                            key={index} // Using index here is fine since data is duplicated for animation
                                className={`flex-shrink-0 w-40 p-4 rounded-xl border ${t.cardBg} shadow-lg transition-all duration-300 transform hover:-translate-y-2 ${t.hoverShadow}`}
                        >
                            <img
                                src={leader.imageUrl || leader.image || leader.url}
                                alt={leader.name}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = "https://placehold.co/150x150/0f172a/94a3b8?text=Leader" }}
                                className="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-500/50 group-hover:border-cyan-400 transition-colors duration-300"
                            />
                            <h3 className={`text-lg font-bold text-center mb-1 ${t.cardText} transition-colors duration-300`}>
                                {leader.name}
                            </h3>
                            <p className={`text-sm text-center ${t.cardTitle} transition-colors duration-300`}>
                                {leader.title}
                            </p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Optional: Call to action or more info */}
            <div className="text-center mt-16 z-10 relative">
                <a
                    href="/aboutus/leadership"
                    className={`inline-flex items-center gap-2 px-8 py-3 rounded-full text-lg font-semibold ${isDarkTheme ? 'bg-cyan-600 text-white hover:bg-cyan-700 shadow-xl' : 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl'} transition-all duration-300 hover:scale-105`}
                >
                    View All Leaders
                    <ChevronRight size={20} />
                </a>
            </div>
        </section>
    );
}