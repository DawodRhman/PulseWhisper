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
      
      <section className={`relative h-screen transition-opacity duration-700 bg-cover text-white flex justify-center items-center`}
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>
        
        <div className="relative z-[1] max-w-[75%] m-20 mx-auto flex items-center justify-center text-center">
          <div className="w-[85%]">
            <h2 className="text-[8vh] font-bold">
              {hero.title}
            </h2>
            <p className="mt-6 text-[3.5vh]">
              {hero.subtitle}
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-[85%] mx-auto px-6">
          <div className="text-center mb-16">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-5xl font-bold text-blue-900 mb-4">
                Public Documents & Information
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                KW&SC is committed to transparency and public access to information
              </p>
            </Fade>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {documents.map((doc, index) => (
              <Fade key={index} direction="up" triggerOnce duration={1000} delay={index * 100}>
                <div className="bg-white rounded-xl shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      {doc.type}
                    </span>
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {doc.title}
                  </h3>
                  <p className="text-gray-600 mb-4 leading-relaxed">
                    {doc.description}
                  </p>
                  <Link
                    href={doc.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold transition-colors"
                  >
                    Download Document
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
              </Fade>
            ))}
          </div>

          <div className="mt-16 bg-white rounded-xl shadow-lg p-8">
            <Fade direction="up" triggerOnce duration={1000}>
              <h2 className="text-3xl font-bold text-blue-900 mb-6">Employee Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">XEN Offices</h3>
                  <p className="text-gray-600 mb-4">
                    Find contact information for Executive Engineers in your area
                  </p>
                  <Link
                    href="https://www.kwsc.gos.pk/assets/documents/XEN-offices.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View XEN Offices List
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </Link>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Maintenance Works</h3>
                  <p className="text-gray-600 mb-4">
                    Information about ongoing and planned maintenance activities
                  </p>
                  <Link
                    href="https://www.kwsc.gos.pk/right-to-information#maintenanceWorksTab"
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                  >
                    View Maintenance Works
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
