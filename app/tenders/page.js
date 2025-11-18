"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";

export default function Tenders() {
  const [openIndex, setOpenIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("open");

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

  const openTenders = [
    {
      title: "Supply of Water Treatment Chemicals",
      date: "Aug 20, 2025",
      description: "KW&SC invites suppliers for the provision of high-grade water treatment chemicals.",
      fullDetails:
        "This tender includes supply, delivery, and testing of certified water treatment chemicals. Bidders must be registered vendors with relevant experience.",
      type: "Procurement",
    },
    {
      title: "Pipeline Rehabilitation Works",
      date: "Aug 15, 2025",
      description: "Tender for pipeline repair and rehabilitation in designated zones.",
      fullDetails:
        "Rehabilitation includes excavation, replacement of damaged sections, and pressure testing. All contractors must follow KW&SC engineering standards.",
      type: "Construction",
    },
  ];

  const closedTenders = [
    {
      title: "Electrical Maintenance Services",
      date: "July 10, 2025",
      description: "Closed tender for maintenance of electrical systems across facilities.",
      type: "Maintenance",
    },
    {
      title: "Machinery Equipment Supply",
      date: "June 22, 2025",
      description: "Closed tender for industrial machinery procurement.",
      type: "Procurement",
    },
  ];

  const tenderDocuments = [
    {
      title: "Tender Guidelines & Submission Rules",
      description: "All contractors must follow updated rules & submission formats.",
      link: "#",
      type: "Guidelines",
    },
    {
      title: "Standard Bidding Document (SBD)",
      description: "Download the official standard bidding format required for all tenders.",
      link: "#",
      type: "Document",
    },
  ];

  return (
    <>
      {loading && <Loader />}

      {/* Hero Section */}
      <section className="relative h-screen transition-opacity duration-700 bg-[url('/karachicharminar.gif')] bg-cover text-white flex justify-center items-center">
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        <div className="relative z-[1] max-w-[75%] m-20 mx-auto flex items-center justify-center text-center">
          <div className="w-[85%]">
            <h2 className="text-[8vh] font-bold">Tenders</h2>
            <p className="mt-6 text-[3.5vh]">Official tender notices, procurement opportunities, and bidding documents</p>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-[85%] mx-auto px-6">
          <div className="text-center mb-16">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-5xl font-bold text-blue-900 mb-4">Tenders & Procurement</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                View open tenders, closed tenders, and download official bidding documents
              </p>
            </Fade>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-12">
            <div className="bg-white rounded-lg p-2 shadow-lg">
              <button
                onClick={() => setActiveTab("open")}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === "open"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Open Tenders
              </button>
              <button
                onClick={() => setActiveTab("closed")}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === "closed"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Closed Tenders
              </button>
              <button
                onClick={() => setActiveTab("documents")}
                className={`px-6 py-3 rounded-md font-semibold transition-colors ${
                  activeTab === "documents"
                    ? "bg-blue-600 text-white"
                    : "text-gray-600 hover:text-blue-600"
                }`}
              >
                Documents
              </button>
            </div>
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto">
            {activeTab === "open" && (
              <div className="space-y-6">
                {openTenders.map((item, i) => (
                  <Fade key={i} direction="up" triggerOnce duration={1000} delay={i * 100}>
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {item.type}
                        </span>
                        <span className="text-gray-500 text-sm">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{item.description}</p>

                      <button
                        onClick={() => setOpenIndex(openIndex === i ? null : i)}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                      >
                        {openIndex === i ? "Hide Details" : "View Tender"}
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>

                      {openIndex === i && (
                        <div className="mt-6 p-6 bg-blue-50 rounded-xl text-gray-700 border border-blue-200">
                          <p className="leading-relaxed">{item.fullDetails}</p>
                        </div>
                      )}
                      
                    </div>
                  </Fade>
                ))}
              </div>
            )}

            {activeTab === "closed" && (
              <div className="space-y-6">
                {closedTenders.map((item, i) => (
                  <Fade key={i} direction="up" triggerOnce duration={1000} delay={i * 100}>
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                      <div className="flex items-start justify-between mb-4">
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                          {item.type}
                        </span>
                        <span className="text-gray-500 text-sm">{item.date}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </Fade>
                ))}
              </div>
            )}

            {activeTab === "documents" && (
              <div className="space-y-6">
                {tenderDocuments.map((doc, i) => (
                  <Fade key={i} direction="up" triggerOnce duration={1000} delay={i * 100}>
                    <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                      <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-semibold mb-3 inline-block">
                        {doc.type}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{doc.title}</h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">{doc.description}</p>

                      <Link href={doc.link} className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold">
                        View Document
                        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6h8m0 0v8m0-8l-12 12" />
                        </svg>
                      </Link>
                    </div>
                  </Fade>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
