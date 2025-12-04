"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Image from "next/image";

export default function WaterToday() {
  const [loading, setLoading] = useState(true);
  const [updates, setUpdates] = useState([]);

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
      .to(".wrapper", { y: "-100%", ease: "power4.inOut", duration: 1 }, "-=0.8");
  }, []);

  useEffect(() => {
    const fetchUpdates = async () => {
      try {
        const res = await fetch("/api/watertoday");
        if (res.ok) {
          const json = await res.json();
          if (json.data) setUpdates(json.data);
        }
      } catch (error) {
        console.error("Failed to fetch water today updates:", error);
      }
    };
    fetchUpdates();
  }, []);

  return (
    <>
      {loading && <Loader />}

      {/* 1. Futuristic Hero Section */}
      <section className={`relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-cover bg-center text-white flex justify-center items-center overflow-hidden`}
        style={{ backgroundImage: `url('/teentalwarkarachi.gif')` }}
      >
        {/* Dark overlay to blend with dark theme */}
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <Fade direction="up" cascade damping={0.1} triggerOnce duration={1000}>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold leading-tight tracking-tight">
                Water Today
              </h2>
              <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl text-slate-300 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto font-light leading-relaxed">
                Discover the current state of water supply, innovations, and community initiatives by KW&SC to ensure Karachi has clean and safe water.
              </p>
            </Fade>
          </div>
        </div>
      </section>

      {/* 2. Latest Updates Section (if data from API exists) */}
      {updates.length > 0 && (
        <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white border-b border-slate-100">
          <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
            <Fade direction="down" triggerOnce duration={1000}>
              <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-slate-900 mb-8 sm:mb-10 md:mb-12 flex items-center gap-2">
                <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
                Latest Updates
              </h3>
            </Fade>
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {updates.map((update, index) => (
                <Fade key={update.id} direction="up" triggerOnce duration={800} delay={index * 100}>
                  <div className="p-4 sm:p-6 md:p-8 rounded-lg sm:rounded-xl md:rounded-2xl border border-slate-100 bg-slate-50 hover:shadow-lg transition-shadow duration-300">
                    <div className="flex justify-between items-start mb-3 sm:mb-4">
                      <h4 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl text-slate-900">{update.title}</h4>
                      {update.status && (
                        <span className={`text-xs sm:text-xs md:text-sm font-bold px-2 sm:px-3 py-1 sm:py-1.5 rounded-full whitespace-nowrap ${update.status === 'Normal' ? 'bg-green-100 text-green-700' :
                            update.status === 'Alert' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                          }`}>
                          {update.status}
                        </span>
                      )}
                    </div>
                    <p className="text-slate-600 text-xs sm:text-sm md:text-base mb-4 leading-relaxed">{update.summary}</p>
                    <div className="text-xs sm:text-xs md:text-sm text-slate-400">
                      {update.publishedAt ? new Date(update.publishedAt).toLocaleDateString() : "Just now"}
                    </div>
                  </div>
                </Fade>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-6 space-y-12 text-gray-800">

          <div>
            <img
              src="/watertoday/blog1.jpg"
              alt="Water Filtration Plant"
              className="w-full rounded-lg mb-6"
            />
            <p className="text-lg leading-relaxed">
              KW&SC continues to upgrade Karachi’s water infrastructure, ensuring every household has access to clean and reliable water. From modern filtration plants to network expansion, the focus remains on quality and efficiency.
            </p>
          </div>

          <div>
            <img
              src="/watertoday/blog2.jpg"
              alt="Community Water Programs"
              className="w-full rounded-lg mb-6"
            />
            <p className="text-lg leading-relaxed">
              Community awareness and engagement are at the heart of our initiatives. KW&SC regularly conducts programs to educate citizens about water conservation and safe sanitation practices, fostering a culture of sustainability.
            </p>
          </div>

          <div>
            <img
              src="/watertoday/blog3.jpg"
              alt="Emergency Water Services"
              className="w-full rounded-lg mb-6"
            />
            <p className="text-lg leading-relaxed">
              Emergency response services ensure that water supply issues are addressed promptly across Karachi. KW&SC teams operate around the clock to restore services, repair pipelines, and maintain sewerage systems, safeguarding public health.
            </p>
          </div>

        </div>
      </section>


    </>
  );
}
