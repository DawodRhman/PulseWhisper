'use client';
import Loader from "@/components/Loader";
import gsap from "gsap";
import React, { useEffect, useState } from "react";
import { Fade } from "react-awesome-reveal";

export default function ContactUs() {
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

  const handleFocusAnimation = (e) => {
    gsap.to(e.target, { boxShadow: "0 0 20px #0ea5e9", duration: 0.3 });
  };

  const handleBlurAnimation = (e) => {
    gsap.to(e.target, { boxShadow: "0 0 0px transparent", duration: 0.3 });
  };

  return (
    <>
      {loading && <Loader />}

      {/* Hero Section */}
      <section className="relative h-screen transition-opacity duration-700 bg-[url('/downtownkarachi.gif')] bg-cover text-white flex justify-center items-center">
        <div className="absolute inset-0 bg-blue-900/60 z-0"></div>

        <div className="relative z-[1] max-w-[75%] mx-auto flex items-center justify-center text-center">
          <div className="w-[85%]">
            <h2 className="text-[8vh] font-bold">Contact Us</h2>
            <p className="mt-6 text-[3.5vh]">
              Reach out to KW&SC for inquiries, complaints, or service requests.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form Section */}
      <div className="bg-gradient-to-b from-blue-50 to-blue-100 py-24">
        <div className="max-w-[85%] mx-auto px-6">
          <div className="text-center mb-16">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-5xl font-bold text-blue-900 mb-4">Get in Touch</h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Send us your message or inquiry and we will get back to you promptly.
              </p>
            </Fade>
          </div>

          {/* Form Container */}
          <form className="bg-white rounded-3xl p-14 shadow-2xl grid grid-cols-1 md:grid-cols-2 gap-10 relative overflow-hidden border border-blue-200">
            {/* Animated Inputs */}
            {["Name", "Email", "Phone", "Subject"].map((field, idx) => (
              <div key={idx} className="relative">
                <input
                  type={field === "Email" ? "email" : "text"}
                  id={field.toLowerCase()}
                  placeholder={field}
                  onFocus={handleFocusAnimation}
                  onBlur={handleBlurAnimation}
                  className="peer w-full px-5 py-4 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-all text-gray-900 text-lg bg-white backdrop-blur-sm"
                  required
                  style={{ filter: "none" }}
                />
                <label
                  htmlFor={field.toLowerCase()}
                  className="absolute left-5 top-4 text-gray-500 peer-placeholder-shown:top-4 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-blue-500 text-sm transition-all"
                >
                  {field}
                </label>
              </div>
            ))}

            {/* Message Field */}
            <div className="col-span-1 md:col-span-2 relative">
              <textarea
                id="message"
                placeholder="Message"
                onFocus={handleFocusAnimation}
                onBlur={handleBlurAnimation}
                className="peer w-full px-5 py-5 rounded-xl border-2 border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-400 transition-all text-gray-900 text-lg bg-white backdrop-blur-sm resize-none h-48"
                required
                style={{ filter: "none" }}
              />
              <label
                htmlFor="message"
                className="absolute left-5 top-5 text-gray-500 peer-placeholder-shown:top-5 peer-placeholder-shown:text-gray-400 peer-focus:-top-4 peer-focus:text-blue-500 text-sm transition-all"
              >
                Message
              </label>
            </div>

            {/* Submit Button */}
            <div className="col-span-1 md:col-span-2 flex justify-end mt-4">
              <button
                type="submit"
                className="relative px-10 py-5 text-white bg-gradient-to-r from-blue-500 to-blue-700 font-bold rounded-xl overflow-hidden transition-all hover:scale-105 hover:shadow-[0_0_30px_#0ea5e9] shadow-lg"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
