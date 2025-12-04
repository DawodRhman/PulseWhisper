"use client";
import React, { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";

export default function FAQs() {
  const [loading, setLoading] = useState(true);
  const [openFAQ, setOpenFAQ] = useState(null);

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

  const faqs = [
    {
      question: "How can I get a new water connection?",
      answer: "For residential, commercial, bulk, or industrial connections, you need to submit an application form along with required documents to the nearest KW&SC office. The process includes site inspection, approval, and connection installation.",
      category: "New Connection"
    },
    {
      question: "How can I get a duplicate bill?",
      answer: "You can obtain a duplicate bill by visiting our online portal at https://web.kwsb.crdc.biz/ or by visiting the nearest KW&SC office with your account number and CNIC.",
      category: "Billing"
    },
    {
      question: "Where can I complain about sewerage?",
      answer: "You can register sewerage complaints through our online complaint system at https://complain.kwsc.gos.pk or contact our customer service helpline at (+92) 021 111 597 200.",
      category: "Complaints"
    },
    {
      question: "Where can I complain for water shortage?",
      answer: "Water shortage complaints can be registered through our complaint portal at https://complain.kwsc.gos.pk or by contacting your area's Executive Engineer (XEN) office.",
      category: "Complaints"
    },
    {
      question: "How can I report water theft?",
      answer: "Report water theft by calling our helpline (+92) 021 111 597 200 or through our online complaint system. You can also contact the Hydrant Management Cell for immediate action.",
      category: "Water Theft"
    },
    {
      question: "How can I order water tanker?",
      answer: "You can order water tankers through our online booking system at https://campaign.kwsc.gos.pk/ or by calling our customer service helpline.",
      category: "Tanker Service"
    },
    {
      question: "Where can I complain about online tanker service?",
      answer: "Complaints about online tanker service can be registered through our complaint portal or by contacting our customer service team directly.",
      category: "Tanker Service"
    },
    {
      question: "How can I contact XEN (Executive Engineer) of my area?",
      answer: "You can find contact information for XEN offices in your area by downloading the XEN offices list from our Right to Information section or by calling our main helpline.",
      category: "Contact"
    },
    {
      question: "How can I change password of my mobile app?",
      answer: "To change your mobile app password, open the app, go to settings/profile section, and select 'Change Password'. Follow the instructions to set a new password.",
      category: "Mobile App"
    }
  ];

  const toggleFAQ = (index) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  return (
    <>
      {loading && <Loader />}

      <section className="relative h-screen sm:h-screen md:h-[70vh] lg:h-screen transition-opacity duration-700 bg-[url('/downtownkarachi.gif')] bg-cover bg-center text-white flex justify-center items-center overflow-hidden">
        <div className="absolute inset-0 bg-slate-900/60 z-0"></div>

        <div className="relative z-[1] w-full px-3 sm:px-4 md:px-6 lg:px-8 flex items-center justify-center text-center">
          <div className="w-full max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-bold leading-tight">
              Frequently Asked Questions
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 lg:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl xl:text-2xl 2xl:text-3xl text-slate-300 font-light leading-relaxed">
              Find answers to common questions about KW&SC services
            </p>
          </div>
        </div>
      </section>

      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-8 sm:py-12 md:py-20 lg:py-32 xl:py-40 2xl:py-48">
        <div className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14 md:mb-20 lg:mb-24">
            <Fade direction="down" triggerOnce duration={1000}>
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-5xl 2xl:text-6xl font-bold text-blue-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                FAQs
              </h1>
              <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 max-w-3xl mx-auto px-2 sm:px-0 leading-relaxed">
                Get quick answers to the most commonly asked questions about KW&SC services
              </p>
            </Fade>
          </div>

          <div className="max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <Fade key={index} direction="up" triggerOnce duration={1000} delay={index * 100}>
                <div className="bg-white rounded-lg sm:rounded-lg md:rounded-xl shadow-md sm:shadow-lg mb-4 sm:mb-5 md:mb-6 overflow-hidden">
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full px-3 sm:px-5 md:px-8 py-4 sm:py-5 md:py-6 text-left flex items-start sm:items-center justify-between hover:bg-blue-50 transition-colors gap-3"
                  >
                    <div className="flex items-start sm:items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                      <span className="bg-blue-100 text-blue-800 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs md:text-sm font-semibold flex-shrink-0 whitespace-nowrap">
                        {faq.category}
                      </span>
                      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-900 break-words">
                        {faq.question}
                      </h3>
                    </div>
                    <svg
                      className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 transition-transform flex-shrink-0 ${openFAQ === index ? 'rotate-180' : ''
                        }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                  {openFAQ === index && (
                    <div className="px-3 sm:px-5 md:px-8 pb-4 sm:pb-5 md:pb-6">
                      <p className="text-xs sm:text-sm md:text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              </Fade>
            ))}
          </div>

          <div className="mt-12 sm:mt-14 md:mt-16 lg:mt-20 bg-white rounded-lg sm:rounded-lg md:rounded-xl shadow-md sm:shadow-lg md:shadow-lg p-5 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14">
            <Fade direction="up" triggerOnce duration={1000}>
              <div className="text-center">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-4xl xl:text-5xl 2xl:text-5xl font-bold text-blue-900 mb-3 sm:mb-4 md:mb-5 lg:mb-6">
                  Still Have Questions?
                </h2>
                <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-lg 2xl:text-xl text-gray-600 mb-6 sm:mb-7 md:mb-8 px-2 sm:px-0 leading-relaxed">
                  If you couldn't find the answer you're looking for, feel free to contact us
                </p>
                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 md:gap-4 justify-center">
                  <a
                    href="tel:+92021111597200"
                    className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm md:text-base font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Call Us: (+92) 021 111 597 200
                  </a>
                  <a
                    href="mailto:info@kwsc.gos.pk"
                    className="inline-flex items-center justify-center px-4 sm:px-5 md:px-6 py-2.5 sm:py-3 md:py-3 bg-blue-100 text-blue-800 rounded-lg hover:bg-blue-200 transition-colors text-xs sm:text-sm md:text-base font-semibold"
                  >
                    <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Email Us: info@kwsc.gos.pk
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
