"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";

export default function RightToInformation() {
  const [loading, setLoading] = useState(true);
  const [rtiData, setRtiData] = useState(null);
  const [dataError, setDataError] = useState(null);

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

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch("/api/rti");
        if (!response.ok) throw new Error("Failed to fetch RTI data");
        const payload = await response.json();
        if (isMounted) {
          setRtiData(payload.data);
        }
      } catch (error) {
        console.error("Error fetching RTI data:", error);
        if (isMounted) setDataError("Unable to load documents.");
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const defaultDocuments = [
    {
      title: "Application Form for Groundwater Licence",
      description: "Download the official form for groundwater licence applications",
      link: "https://www.kwsc.gos.pk/assets/documents/application-form-for-ground-water-licence.pdf",
      type: "Form"
    },
    {
      title: "KW&SC Act 2023",
      description: "Complete text of the Karachi Water and Sewerage Corporation Act 2023",
      link: "https://www.kwsc.gos.pk/assets/documents/KW_SC_Act%2C_2023.pdf",
      type: "Legal Document"
    },
    {
      title: "Subsoil Extraction Regulations",
      description: "Regulations governing subsoil extraction activities",
      link: "https://www.kwsc.gos.pk/assets/documents/groundwater-Reg-2024.pdf",
      type: "Regulation"
    },
    {
      title: "KW&SC Budget Summary 2023-2024",
      description: "Annual budget summary and financial overview",
      link: "https://www.kwsc.gos.pk/assets/documents/Budget_summary_2023-2024.pdf",
      type: "Financial"
    },
    {
      title: "Signed Code of Conduct",
      description: "Official code of conduct document signed by KW&SC",
      link: "https://www.kwsc.gos.pk/assets/documents/Signed-CoC.pdf",
      type: "Policy"
    },
    {
      title: "Maintenance Works Report",
      description: "Comprehensive report on maintenance activities",
      link: "https://www.kwsc.gos.pk/assets/documents/Maintenance_Work.pdf",
      type: "Report"
    }
  ];

  const documents = rtiData?.documents?.length > 0 ? rtiData.documents : defaultDocuments;
  const hero = rtiData?.hero || {
    title: "Right to Information",
    subtitle: "Access official documents, forms, and information about KW&SC operations",
    backgroundImage: "/teentalwarkarachi.gif",
  };

  return (
    <>
      {loading && <Loader />}

      <section className={`relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-cover text-white flex justify-center items-center`}
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-6xl 2xl:text-7xl font-bold leading-tight">
              {hero.title}
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl leading-relaxed">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-12 sm:mb-14 md:mb-16 lg:mb-20">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-blue-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                Public Documents & Information
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                KW&SC is committed to transparency and public access to information
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
            {documents.map((doc, index) => (
              <Fade key={index} direction="up" triggerOnce duration={1000} delay={index * 100}>
                <div className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold">
                      {doc.type}
                    </span>
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 sm:w-4 sm:h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3">
                    {doc.title}
                  </h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4 leading-relaxed">
                    {doc.description}
                  </p>
                  <Link
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors text-xs sm:text-sm md:text-base lg:text-lg"
                  >
                    Download Document
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </Fade>
            ))}
          </div>

          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24 bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14">
            <Fade direction="up" triggerOnce duration={1000}>
              <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-4xl 2xl:text-5xl font-bold text-blue-900 mb-6 sm:mb-8">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">XEN Offices</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4">
                    Find contact information for Executive Engineers in your area
                  </p>
                  <Link
                    href="https://www.kwsc.gos.pk/assets/documents/XEN-offices.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
                  >
                    View XEN Offices List
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
                <div>
                  <h3 className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl font-semibold text-gray-900 mb-3 sm:mb-4">Maintenance Works</h3>
                  <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-base text-gray-600 mb-3 sm:mb-4">
                    Information about ongoing and planned maintenance activities
                  </p>
                  <Link
                    href="https://www.kwsc.gos.pk/right-to-information#maintenanceWorksTab"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold text-xs sm:text-sm md:text-base lg:text-lg"
                  >
                    View Maintenance Works
                    <svg className="w-3 h-3 sm:w-4 sm:h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </>
  );
}
