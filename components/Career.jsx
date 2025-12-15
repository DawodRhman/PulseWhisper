"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
// --- New Lucide Icon Imports ---
import {
  Briefcase,
  Zap,
  Building,
  MapPin,
  Clock,
  Mail,
  Phone,
  ArrowUpRight,
} from "lucide-react";

export default function Careers() {
  const [loading, setLoading] = useState(true);
  const [careersData, setCareersData] = useState(null);
  const [dataError, setDataError] = useState(null);

  // GSAP Loader Effect (Kept as is)
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
        const response = await fetch("/api/careers");
        if (!response.ok) throw new Error("Failed to fetch Careers data");
        const payload = await response.json();
        if (isMounted) {
          setCareersData(payload.data);
        }
      } catch (error) {
        console.error("Error fetching Careers data:", error);
        if (isMounted) setDataError("Unable to load careers.");
      }
    };
    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const defaultOpportunities = [
    {
      title: "Recruitment",
      description:
        "Join KW&SC's team of dedicated professionals working to improve Karachi's essential water and sewerage infrastructure.",
      features: [
        "Competitive salary packages",
        "Professional development opportunities",
        "Health insurance benefits",
        "Pension scheme",
        "Career growth prospects",
      ],
      link: "https://www.kwsc.gos.pk/careers#Recruitment",
      type: "Full-time Positions",
    },
    {
      title: "Young Graduate Program",
      description:
        "Launch your career with KW&SC's comprehensive graduate program designed for fresh, talented engineers and professionals.",
      features: [
        "A structured program",
        "Mentorship from senior professionals",
        "Hands-on project experience",
        "Training and skill development",
        "Potential for permanent employment",
      ],
      link: "https://www.kwsc.gos.pk/careers#YoungGraduateProgram",
      type: "Graduate Program",
    },
    {
      title: "Consultancies",
      description:
        "Partner with KW&SC as an expert consultant to contribute your specialized skills to critical infrastructure projects.",
      features: [
        "Project-based assignments",
        "Flexible working arrangements",
        "Competitive consultancy rates",
        "Access to latest technology",
        "Collaboration with industry experts",
      ],
      link: "https://www.kwsc.gos.pk/careers#Consultancies",
      type: "Consulting",
    },
  ];

  const careerOpportunities =
    careersData?.programs?.length > 0
      ? careersData.programs.map((prog) => ({
          title: prog.title,
          description: prog.heroBody || prog.summary || "",
          features: prog.eligibility ? Object.values(prog.eligibility) : [],
          link: `/careers/${prog.slug}`,
          type: "Program",
        }))
      : defaultOpportunities;

  const currentOpenings =
    careersData?.openings?.length > 0
      ? careersData.openings.map((op) => ({
          id: op.id,
          position: op.title,
          department: op.department || "General",
          location: op.location || "Karachi",
          type: op.jobType || "Full-time",
          experience: op.compensation || "N/A", // Using compensation field for experience/salary info as placeholder
        }))
      : [];


  return (
    <>
      {loading && <Loader />}

      {/* 2. Opportunities & Openings Section */}
      <div className="bg-white py-8 sm:py-12 md:py-20 lg:py-32 xl:py-40 2xl:py-48">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-20 lg:mb-24">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-4xl font-bold text-gray-900 mb-3">
                Opportunities To Make A Difference
              </h1>
              <p className="text-base text-gray-600 max-w-3xl mx-auto">
                Discover the path that aligns with your professional aspirations
                and contribute to the core infrastructure of the city.
              </p>
            </Fade>
          </div>

          {/* Career Opportunities Cards (Grid) */}
          <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500/50 pb-2">
            Explore Programs
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 mb-12 sm:mb-16 md:mb-20">
            {careerOpportunities.map((opportunity, index) => (
              <Fade
                key={index}
                direction="up"
                triggerOnce
                duration={800}
                delay={index * 150}
                className="h-full"
              >
                <div
                  className="bg-white border border-gray-100 rounded-lg sm:rounded-xl md:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl p-4 sm:p-5 md:p-6 lg:p-8 flex flex-col justify-between 
                             transition-all duration-300 hover:shadow-lg sm:hover:shadow-xl md:hover:shadow-2xl hover:scale-[1.02] hover:border-blue-500/50 h-full"
                >
                  <div>
                    <span className="bg-blue-600 text-white px-2.5 sm:px-3 md:px-4 py-1 sm:py-1.5 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold mb-3 sm:mb-4 inline-block shadow-md">
                      {opportunity.type}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 my-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-600 flex-shrink-0" />
                      {opportunity.title}
                    </h3>
                    <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-4 border-b border-gray-100 pb-3">
                      {opportunity.description}
                    </p>

                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <h4 className="font-bold text-xs sm:text-sm md:text-base lg:text-lg text-gray-900 mb-2 sm:mb-3 flex items-center">
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-green-500 flex-shrink-0" />
                        Benefits & Scope:
                      </h4>
                      <ul className="space-y-2 sm:space-y-2.5 md:space-y-3">
                        {opportunity.features.map((feature, idx) => (
                          <li
                            key={idx}
                            className="flex items-start text-xs sm:text-sm text-gray-600"
                          >
                            <Zap className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mt-0.5 sm:mt-1 flex-shrink-0 mr-2" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <Link
                    href={opportunity.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center w-full justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 mt-3 sm:mt-4 
                               bg-blue-600 text-white font-semibold text-sm sm:text-base rounded-lg transition-all 
                               hover:bg-blue-700 hover:shadow-lg shadow-blue-500/30 group"
                  >
                    View Details
                    <ArrowUpRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </Link>
                </div>
              </Fade>
            ))}
          </div>

          {/* Current Job Openings (Table-like Grid) */}
          <h2 className="text-4xl font-bold text-gray-800 mb-6 border-b-2 border-blue-500/50 pb-2">
            Current Openings
          </h2>
          <div className="space-y-3 sm:space-y-4 md:space-y-4">
            {currentOpenings.length > 0 ? (
              currentOpenings.map((opening, index) => (
                <Fade
                  key={opening.id}
                  direction="up"
                  triggerOnce
                  duration={800}
                  delay={index * 50}
                >
                  <div className="bg-white border border-gray-200 rounded-lg sm:rounded-lg md:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-sm sm:shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 items-start sm:items-center gap-3 sm:gap-4 md:gap-4 transition-all duration-300 hover:shadow-md sm:hover:shadow-lg hover:border-blue-300">
                    {/* Position */}
                    <h3 className="text-base sm:text-lg md:text-xl font-bold text-blue-800 sm:col-span-2">
                      {opening.position}
                    </h3>

                    {/* Details (Flex/Icons) */}
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Building className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
                      <span className="truncate">{opening.department}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
                      {opening.location}
                    </div>
                    <div className="flex items-center text-gray-600 text-xs sm:text-sm">
                      <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 mr-2 text-blue-500 flex-shrink-0" />
                      {opening.experience}
                    </div>

                    {/* Apply Button */}
                    <button className="w-full sm:col-span-2 lg:col-span-1 lg:w-auto px-4 sm:px-5 md:px-6 py-2 sm:py-2.5 bg-blue-600 text-white font-semibold text-xs sm:text-sm rounded-lg hover:bg-blue-700 transition-colors shadow-sm sm:shadow-md">
                      Apply Now
                    </button>
                  </div>
                </Fade>
              ))
            ) : (
              <div className="text-center py-10 bg-gray-50 rounded-xl">
                <p className="text-gray-500">
                  No current openings available. Please check back later.
                </p>
              </div>
            )}
          </div>

          {/* 3. Contact Information / CTA */}
          <div className="mt-12 sm:mt-16 md:mt-20 bg-blue-800 rounded-lg sm:rounded-lg md:rounded-xl shadow-lg sm:shadow-xl md:shadow-2xl p-5 sm:p-8 md:p-10 lg:p-14 text-white">
            <Fade direction="up" triggerOnce duration={1000} delay={200}>
              <div className="text-center">
                <h2 className="text-4xl font-bold mb-3">
                  Ready to Start Your KW&SC Career?
                </h2>
                <p className="text-base text-blue-100 mb-6 max-w-3xl mx-auto">
                  For detailed information, reach out to our Human Resources
                  department directly.
                </p>

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-4 justify-center">
                  <a
                    href="mailto:hr@kwsc.gos.pk"
                    className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-cyan-400 text-gray-900 font-semibold sm:font-bold text-xs sm:text-sm md:text-base rounded-lg transition-all hover:bg-cyan-300 shadow-md sm:shadow-lg shadow-cyan-400/50"
                  >
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    Email: info@kwsc.gos.pk
                  </a>
                  <a
                    href="tel:+92021111597200"
                    className="inline-flex items-center justify-center px-4 sm:px-6 md:px-8 py-3 sm:py-3.5 md:py-4 bg-white/10 text-white font-semibold sm:font-bold text-xs sm:text-sm md:text-base rounded-lg border border-white/20 transition-colors hover:bg-white/20"
                  >
                    <Phone className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 flex-shrink-0" />
                    Call: (+92) 021 111 597 200
                  </a>
                </div>
              </div>
            </Fade>
          </div>
        </div>
      </div>
    </>
  );
}
