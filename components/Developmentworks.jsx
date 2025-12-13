"use client";
import React from "react";

export default function KWSCInfoSections() {
    const developmentWorks = [
        "Expansion of water supply network in Karachi",
        "Construction and rehabilitation of sewerage systems",
        "Installation of smart meters and automated billing",
        "Upgradation of water treatment and filtration plants",
        "Online tanker booking and emergency water supply services",
    ];

    const rightToInformation = [
        "Access KW&SC policies and regulations",
        "Submit complaints and requests under RTI",
        "Track status of requests and applications",
        "Download public reports and notifications",
        "Digital transparency for governance and operations",
    ];

    return (
        <div className="bg-gray-50">
            {/* Development Works Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 bg-white">
                <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 text-center">
                    <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4">
                        Development Works
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 leading-relaxed sm:leading-relaxed md:leading-relaxed">
                        KW&SC is continuously implementing development projects to ensure
                        safe, reliable, and sustainable water supply and sewerage services
                        across Karachi.
                    </p>
                    <ul className="list-disc list-inside space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-left mx-auto max-w-xl sm:max-w-2xl md:max-w-2xl lg:max-w-2xl pl-2 sm:pl-0">
                        {developmentWorks.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </section>

            {/* Right to Information Section */}
            <section className="py-12 sm:py-16 md:py-20 lg:py-28 xl:py-32 bg-gray-100">
                <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 text-center">
                    <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-900 mb-4 sm:mb-5 md:mb-6 lg:mb-8 xl:mb-10">
                        Right to Information
                    </h2>
                    <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-700 mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 leading-relaxed sm:leading-relaxed md:leading-relaxed">
                        Citizens have the right to access information regarding KW&SC
                        operations, policies, and services. Transparency ensures
                        accountability and informed decision-making.
                    </p>
                    <ul className="list-disc list-inside space-y-2 sm:space-y-2.5 md:space-y-3 lg:space-y-4 xl:space-y-5 text-gray-600 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-left mx-auto max-w-xl sm:max-w-2xl md:max-w-2xl lg:max-w-2xl pl-2 sm:pl-0">
                        {rightToInformation.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                    <a
                        href="https://www.kwsc.gos.pk"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-6 sm:mt-8 md:mt-10 lg:mt-12 xl:mt-14 px-4 sm:px-5 md:px-6 lg:px-8 xl:px-10 py-2 sm:py-2.5 md:py-3 lg:py-4 xl:py-5 rounded-lg text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl bg-cyan-500 text-white font-semibold hover:bg-cyan-600 transition-all duration-300"
                    >
                        Learn More
                    </a>
                </div>
            </section>
        </div>
    );
}
