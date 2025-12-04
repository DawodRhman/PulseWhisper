'use client'
import Loader from '@/components/Loader'
import gsap from 'gsap';
import React, { useEffect, useState } from 'react'

// Hero Section Mock Data
const heroData = {
  title: "Our Projects",
  subtitle: "Major infrastructure projects transforming Karachi's water and sewerage systems"
};

// PSDP/ADP Projects Mock Data
const psdpProjectsData = [
  {
    id: 1,
    title: "The Greater Karachi Sewerage Plan (S-III)",
    description: "Comprehensive sewerage system development to improve wastewater management across Karachi.",
    features: [
      "Modern sewerage network expansion",
      "Treatment plant upgrades",
      "Pumping station improvements",
      "Environmental compliance"
    ]
  },
  {
    id: 2,
    title: "The Greater Karachi Bulk Water Supply Scheme (K-IV)",
    description: "Major water supply project to meet Karachi's growing water demands through Hub Dam.",
    features: [
      "260 MGD water supply capacity",
      "Hub Dam water source",
      "Modern conveyance system",
      "Distribution network expansion"
    ]
  }
];

// PPP Projects Mock Data
const pppProjectsData = [
  {
    id: 3,
    title: "West Karachi Recycled Water Project",
    description: "35 MGD recycled water project at Haroonabad, SITE, Keamari, Karachi for sustainable water management.",
    features: [
      "35 MGD capacity",
      "Advanced treatment technology",
      "Industrial water supply",
      "Environmental sustainability"
    ]
  },
  {
    id: 4,
    title: "Municipal Wastewater Recycling Plant",
    description: "40 MGD wastewater recycling plant at TP-IV, Korangi, Karachi for water conservation.",
    features: [
      "40 MGD treatment capacity",
      "Tertiary treatment processes",
      "Water reuse applications",
      "Cost-effective operations"
    ]
  }
];

// Foreign-Funded Projects Mock Data
const foreignProjectsData = [
  {
    id: 5,
    title: "5 MGD Desalination Plant",
    description: "Reverse osmosis desalination plant at Ibrahim Hyderi, Malir, Karachi for alternative water sources.",
    features: [
      "5 MGD desalination capacity",
      "Reverse osmosis technology",
      "Coastal water utilization",
      "Energy-efficient design"
    ]
  },
  {
    id: 6,
    title: "Institutional Reforms",
    description: "Comprehensive institutional strengthening and capacity building initiatives.",
    features: [
      "Management system upgrades",
      "Technology integration",
      "Staff training programs",
      "Operational efficiency"
    ]
  }
];

// Initiatives Mock Data
const initiativesData = [
  {
    id: 7,
    title: "Hydrant Management Cell",
    description: "Centralized management system for water hydrants and distribution points."
  },
  {
    id: 8,
    title: "Digitalized Tanker Supply",
    description: "Modern tanker booking and tracking system for efficient water delivery."
  },
  {
    id: 9,
    title: "Biometric Attendance",
    description: "Automated employee attendance system for improved workforce management."
  },
  {
    id: 10,
    title: "Grievance Redressal Management",
    description: "Comprehensive system for handling customer complaints and feedback."
  },
  {
    id: 11,
    title: "Fleet Management System",
    description: "Advanced vehicle tracking and management system for operational efficiency."
  },
  {
    id: 12,
    title: "Center of Research & Innovation",
    description: "CERRI initiative for research, reforms, and innovation in water management."
  }
];

// External Links Mock Data
const governmentLinksData = [
  {
    id: 1,
    title: "Sindh Government Portal",
    url: "https://www.sindh.gov.pk/"
  },
  {
    id: 2,
    title: "KWSB CRDC Portal",
    url: "https://web.kwsb.crdc.biz/"
  }
];

const customerLinksData = [
  {
    id: 3,
    title: "Online Complaint System",
    url: "https://complain.kwsc.gos.pk"
  },
  {
    id: 4,
    title: "Tanker Booking System",
    url: "https://campaign.kwsc.gos.pk/"
  }
];

const page = () => {
  const [loading, setLoading] = useState(true);

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
  return (
    <>
      {loading && <Loader />}

      <section
        className={`relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-[url('/karachicharminar.gif')] bg-cover text-white flex justify-center items-center`}
      >
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        {/* Content (Ensures text and images are above overlay) */}
        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold leading-tight">
              {heroData.title}
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed">
              {heroData.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-blue-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
              {heroData.title}
            </h1>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {heroData.subtitle}
            </p>
          </div>

          {/* PSDP/ADP Projects */}
          <div className="mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 2xl:mb-14 text-blue-900">PSDP/ADP Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
              {psdpProjectsData.map((project) => (
                <div key={project.id} className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-blue-800">{project.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-base 2xl:text-lg text-gray-600">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* PPP Projects */}
          <div className="mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 2xl:mb-14 text-blue-900">PPP Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
              {pppProjectsData.map((project) => (
                <div key={project.id} className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-blue-800">{project.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-base 2xl:text-lg text-gray-600">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Foreign-Funded Projects */}
          <div className="mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 2xl:mb-14 text-blue-900">IBRD/AIIB Foreign-Funded Projects</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
              {foreignProjectsData.map((project) => (
                <div key={project.id} className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-blue-800">{project.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4 md:mb-5 leading-relaxed">
                    {project.description}
                  </p>
                  <ul className="space-y-1 sm:space-y-2 md:space-y-2 lg:space-y-3 text-xs sm:text-sm md:text-base lg:text-lg xl:text-base 2xl:text-lg text-gray-600">
                    {project.features.map((feature, idx) => (
                      <li key={idx}>• {feature}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* New Initiatives */}
          <div className="mb-12 sm:mb-14 md:mb-16 lg:mb-20 xl:mb-24 2xl:mb-28">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 2xl:mb-14 text-blue-900">KW&SC Employee & Customer Centric Initiatives</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
              {initiativesData.map((initiative) => (
                <div key={initiative.id} className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:shadow-xl transition-shadow duration-300">
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-3 sm:mb-4 md:mb-5 lg:mb-6 text-blue-800">{initiative.title}</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 leading-relaxed">
                    {initiative.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* External Links */}
          <div className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 2xl:mb-14 text-blue-900">External Resources</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 2xl:gap-14">
              <div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-blue-800">Government Partners</h3>
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  {governmentLinksData.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-base 2xl:text-lg transition-colors duration-300"
                    >
                      <svg className="w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold mb-4 sm:mb-5 md:mb-6 lg:mb-8 text-blue-800">Customer Services</h3>
                <div className="space-y-3 sm:space-y-4 md:space-y-5">
                  {customerLinksData.map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm md:text-base lg:text-lg xl:text-base 2xl:text-lg transition-colors duration-300"
                    >
                      <svg className="w-3 sm:w-4 md:w-5 lg:w-6 h-3 sm:h-4 md:h-5 lg:h-6 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      {link.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default page
