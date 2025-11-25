"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";

export default function Education() {
  const [loading, setLoading] = useState(true);
  const [educationData, setEducationData] = useState(null);
  const [dataError, setDataError] = useState(null);

  useEffect(() => {
    const loaderTimeline = gsap.timeline({ onComplete: () => setLoading(false) });

    loaderTimeline
      .fromTo(".loader", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "power2.inOut" })
      .to(".loader", { scaleY: 0, transformOrigin: "0% -100%", duration: 0.5, ease: "power2.inOut" })
      .to(".wrapper", { y: "-100%", ease: "power4.inOut", duration: 1 }, "-=0.8");
  }, []);

  useEffect(() => {
    let isMounted = true;
    const fetchData = async () => {
      try {
        const response = await fetch("/api/education");
        if (!response.ok) throw new Error("Failed to fetch Education data");
        const payload = await response.json();
        if (isMounted) {
          setEducationData(payload.data);
        }
      } catch (error) {
        console.error("Error fetching Education data:", error);
        if (isMounted) setDataError("Unable to load educational resources.");
      }
    };
    fetchData();
    return () => { isMounted = false; };
  }, []);

  const defaultPosts = [
    {
      title: "Clean Water Initiatives",
      description: "KW&SC ensures safe and potable water for all citizens through modern filtration and distribution systems.",
      image: "/images/clean-water.jpg",
    },
    {
      title: "Sustainable Sewerage Management",
      description: "Innovative sewerage solutions reduce contamination and improve the city’s sanitation standards.",
      image: "/images/sewerage.jpg",
    },
    {
      title: "Community Awareness",
      description: "Educational programs raise awareness on water conservation and hygiene practices in local communities.",
      image: "/images/community-education.jpg",
    },
  ];

  const posts = educationData?.resources?.length > 0 ? educationData.resources : defaultPosts;
  const hero = educationData?.hero || {
    title: "Education & Awareness",
    subtitle: "Empowering the community with knowledge about water conservation and hygiene.",
    backgroundImage: "/karachicharminar.gif",
  };

  return (
    <>
      {loading && <Loader />}

      {/* Hero Banner */}
      <section className="relative h-[60vh] md:h-[80vh] bg-cover bg-center text-white flex justify-center items-center overflow-hidden"
        style={{ backgroundImage: `url('${hero.backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-slate-900/80 z-0"></div>
        <div className="absolute inset-0 bg-[linear-gradient(to right, rgba(6,182,212,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(6,182,212,0.1) 1px, transparent 1px)] bg-[size:40px_40px] opacity-30 z-0"></div>
        <div className="relative z-[1] max-w-4xl text-center px-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/50 border border-cyan-500/30 text-cyan-400 text-xs font-mono mb-6 backdrop-blur-md">
            KW&SC EDUCATION
          </div>
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            {hero.title}
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            {hero.subtitle}
          </p>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-[#020617] to-transparent z-10"></div>
      </section>

      {/* Education Posts */}
      <section className="bg-[#020617] text-white py-20">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {posts.map((post, i) => (
            <Fade key={i} direction="up" triggerOnce duration={800} delay={i * 150}>
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className="md:flex-1">
                  <img src={post.image} alt={post.title} className="rounded-xl shadow-[0_0_30px_rgba(6,182,212,0.3)] w-full h-auto" />
                </div>
                <div className="md:flex-1">
                  <h3 className="text-3xl font-bold text-cyan-400 mb-4">{post.title}</h3>
                  <p className="text-slate-300 leading-relaxed">{post.description}</p>
                </div>
              </div>
            </Fade>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#01041b] text-cyan-400 py-12 text-center border-t border-cyan-600">
        <p>© 2025 Karachi Water & Sewerage Board (KW&SC). All rights reserved.</p>
      </footer>
    </>
  );
}
