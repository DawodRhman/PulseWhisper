"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Briefcase, Zap, ArrowUpRight, MapPin, Clock } from "lucide-react";
import Link from "next/link";

export default function Career() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch("/api/careers");
        if (!res.ok) throw new Error("Failed to fetch career data");
        const json = await res.json();
        setData(json.data || {});
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[300px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading careers: {error}</p>
      </div>
    );
  }

  if (!data) return null;

  const { programs, openings } = data;

  return (
    <section className="bg-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32" id="careers-content">
      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
        
        {/* Header */}
        <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4">
              {data.hero?.title || "Opportunities To Make A Difference"}
            </h2>
            <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-lg text-gray-600 max-w-4xl mx-auto">
              {data.hero?.subtitle || "Discover the path that aligns with your professional aspirations."}
            </p>
          </motion.div>
        </div>

        {/* Programs */}
        {programs && programs.length > 0 && (
          <div className="mb-16">
            <div className="flex items-center justify-between border-b-2 border-blue-100 pb-2 mb-8">
              <h3 className="text-2xl font-bold text-gray-800">Explore Programs</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {programs.map((program, index) => (
                <motion.div key={program.id || index} variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="h-full">
                  <div className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg p-6 flex flex-col h-full transition-all duration-300 hover:-translate-y-1 hover:border-blue-400">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
                      <Briefcase className="w-5 h-5 mr-2 text-blue-500" />
                      {program.title}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex-grow">{program.heroBody}</p>
                    
                    {program.eligibility && program.eligibility.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-bold text-gray-800 mb-2 text-xs uppercase tracking-wide flex items-center">
                          <Zap className="w-4 h-4 mr-1 text-yellow-500" /> Benefits
                        </h4>
                        <ul className="space-y-1">
                          {program.eligibility.slice(0, 5).map((feat, idx) => (
                            <li key={idx} className="flex items-start text-gray-500 text-xs">
                              <div className="w-1.5 h-1.5 bg-blue-400 rounded-full mt-1.5 mr-2 flex-shrink-0"></div>
                              {feat}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Openings */}
        {openings && openings.length > 0 && (
          <div>
            <div className="flex items-center justify-between border-b-2 border-blue-100 pb-2 mb-8">
              <h3 className="text-2xl font-bold text-gray-800">Current Openings</h3>
            </div>
            <div className="grid gap-4">
              {openings.map((job) => (
                <div key={job.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow flex flex-col md:flex-row justify-between items-start md:items-center">
                  <div>
                    <h4 className="text-lg font-bold text-gray-900">{job.title}</h4>
                    <div className="flex flex-wrap gap-4 mt-2 text-sm text-gray-500">
                      <span className="flex items-center"><MapPin className="w-4 h-4 mr-1" /> {job.location || "Karachi"}</span>
                      <span className="flex items-center"><Clock className="w-4 h-4 mr-1" /> {job.type || "Full-time"}</span>
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${job.status === 'OPEN' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {job.status}
                      </span>
                    </div>
                  </div>
                  <Link href={`/careers/${job.slug || '#'}`} className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm font-medium">
                    Apply Now
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {(!programs?.length && !openings?.length) && (
           <div className="text-center py-12 text-gray-500">
             <p>No career opportunities currently available. Please check back later.</p>
           </div>
        )}
      </div>
    </section>
  );
}