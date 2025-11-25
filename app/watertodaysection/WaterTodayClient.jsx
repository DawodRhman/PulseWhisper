"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";

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

      {/* Banner */}
      <section
        className={`relative h-[50vh] md:h-[70vh] transition-opacity duration-700 bg-[url('/teentalwarkarachi.gif')] bg-cover bg-center text-white flex justify-center items-center`}
      >
        <div className="absolute inset-0 bg-blue-900/80 z-0 backdrop-blur-sm"></div>
        <div className="relative z-[1] text-center px-6 max-w-5xl">
          <h2 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-cyan-200 drop-shadow-[0_0_25px_rgba(6,182,212,0.5)]">
            Water Today
          </h2>
          <p className="mt-6 text-lg md:text-xl text-slate-300 max-w-2xl mx-auto font-light">
            Discover the current state of water supply, innovations, and community initiatives by KW&SC to ensure Karachi has clean and safe water.
          </p>
        </div>
      </section>

      {/* Latest Updates Section */}
      {updates.length > 0 && (
        <section className="py-12 bg-white border-b border-slate-100">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center gap-2">
              <span className="w-2 h-8 bg-cyan-500 rounded-full"></span>
              Latest Updates
            </h3>
            <div className="grid gap-6 md:grid-cols-2">
              {updates.map((update) => (
                <div key={update.id} className="p-6 rounded-xl border border-slate-100 bg-slate-50 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start mb-3">
                    <h4 className="font-bold text-lg text-slate-900">{update.title}</h4>
                    {update.status && (
                      <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                        update.status === 'Normal' ? 'bg-green-100 text-green-700' : 
                        update.status === 'Alert' ? 'bg-red-100 text-red-700' : 
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {update.status}
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{update.summary}</p>
                  <div className="text-xs text-slate-400">
                    {update.publishedAt ? new Date(update.publishedAt).toLocaleDateString() : "Just now"}
                  </div>
                </div>
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
