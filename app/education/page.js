"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";

export default function Education() {
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

  const blogPosts = [
    {
      title: "The Science of Clean Water",
      date: "Nov 12, 2025",
      description:
        "Explore the processes and technologies KW&SC uses to ensure safe and clean drinking water.",
      fullDetails:
        "From filtration to chemical treatment, KW&SC employs cutting-edge technologies to deliver safe water. Learn about each step, the quality checks, and how modern innovations improve efficiency.",
      image: "/images/clean-water.jpg",
      category: "Science",
    },
    {
      title: "Smart Water Management Systems",
      date: "Oct 30, 2025",
      description:
        "Discover how digital monitoring and AI optimize water distribution and reduce wastage.",
      fullDetails:
        "KW&SC leverages sensors, IoT, and predictive analytics to manage pipelines, detect leaks, and balance water supply. Smart systems ensure reliability and sustainability for Karachi's growing population.",
      image: "/images/smart-water.jpg",
      category: "Technology",
    },
    {
      title: "Community Awareness Programs",
      date: "Oct 15, 2025",
      description:
        "Education initiatives by KW&SC to promote water conservation and hygiene practices.",
      fullDetails:
        "Interactive workshops, school programs, and digital campaigns educate citizens on water-saving habits. Learn how these initiatives shape behavior and contribute to sustainable water use.",
      image: "/images/community-education.jpg",
      category: "Education",
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
            <h2 className="text-[8vh] font-bold">Education</h2>
            <p className="mt-6 text-[3.5vh]">
              Learn about water, conservation, and modern technologies used by KW&SC
            </p>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-20">
        <div className="max-w-[85%] mx-auto px-6">
          <div className="text-center mb-16">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-5xl font-bold text-blue-900 mb-4">KW&SC Education</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Dive into articles, innovations, and programs designed to educate the public about water management and sustainability.
              </p>
            </Fade>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {blogPosts.map((post, i) => (
              <Fade key={i} direction="up" triggerOnce duration={1000} delay={i * 150}>
                <div
                  className="bg-white rounded-2xl shadow-2xl overflow-hidden transform transition-transform hover:scale-105 hover:shadow-3xl relative group"
                  style={{ perspective: "1000px" }}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <span className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {post.category}
                    </span>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{post.title}</h3>
                    <p className="text-gray-600 mb-4 leading-relaxed">{post.description}</p>
                    <button
                      onClick={() => {
                        const content = document.getElementById(`post-${i}`);
                        if (content.style.maxHeight) {
                          content.style.maxHeight = null;
                        } else {
                          content.style.maxHeight = content.scrollHeight + "px";
                          gsap.fromTo(
                            content,
                            { opacity: 0 },
                            { opacity: 1, duration: 0.5 }
                          );
                        }
                      }}
                      className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                    >
                      Read More
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                    <div
                      id={`post-${i}`}
                      className="mt-4 overflow-hidden max-h-0 transition-max-height duration-500"
                    >
                      <p className="text-gray-700 leading-relaxed">{post.fullDetails}</p>
                    </div>
                  </div>
                </div>
              </Fade>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-blue-900 text-white py-12 text-center">
        <p>© 2025 Karachi Water & Sewerage Board (KW&SC). All rights reserved.</p>
      </footer>
    </>
  );
}
