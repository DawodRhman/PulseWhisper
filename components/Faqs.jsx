"use client";
import React, { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { useTranslation } from "react-i18next";

const FALLBACK_FAQS = [
  {
    question: "How can I get a new water connection?",
    answer: "For residential, commercial, bulk, or industrial connections, you need to submit an application form along with required documents to the nearest KW&SC office. The process includes site inspection, approval, and connection installation.",
    category: "New Connection"
  },
  {
    question: "How can I get a duplicate bill?",
    answer: "You can obtain a duplicate bill by visiting our online portal at web.kwsb.crdc.biz or by visiting the nearest KW&SC office with your account number and CNIC.",
    category: "Billing"
  },
  {
    question: "Where can I complain about sewerage?",
    answer: "You can register sewerage complaints through our online complaint system at complain.kwsc.gos.pk or contact our customer service helpline at (+92) 021 111 597 200.",
    category: "Complaints"
  },
  {
    question: "How can I order a water tanker?",
    answer: "You can order water tankers through our online booking system at campaign.kwsc.gos.pk or by calling our customer service helpline directly.",
    category: "Tanker Service"
  },
  {
    question: "How can I report water theft?",
    answer: "Report water theft by calling our helpline (+92) 021 111 597 200. You can also contact the Hydrant Management Cell for immediate action against illegal connections.",
    category: "Water Theft"
  }
];

function normalizeFaqs(items) {
  const source = Array.isArray(items) && items.length ? items : FALLBACK_FAQS;
  return source.map((item) => ({
    id: item.id || item.question,
    question: item.question,
    questionUr: item.questionUr,
    answer: item.answer,
    answerUr: item.answerUr,
    category: item.category?.title || item.category || "General",
    categoryUr: item.categoryUr || item.category,
  }));
}

export default function FAQs({ items }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [fetchedFaqs, setFetchedFaqs] = useState(null);
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  useEffect(() => {
    if (!items || items.length === 0) {
      fetch('/api/faqs')
        .then(res => res.json())
        .then(data => {
          if (data.data) {
            const flattened = [];
            // Process categories
            if (data.data.categories) {
              data.data.categories.forEach(cat => {
                if (cat.faqs) {
                  cat.faqs.forEach(faq => {
                    flattened.push({ ...faq, category: cat.title });
                  });
                }
              });
            }
            // Process uncategorized
            if (data.data.uncategorized) {
              data.data.uncategorized.forEach(faq => {
                flattened.push({ ...faq, category: "General" });
              });
            }
            if (flattened.length > 0) {
              setFetchedFaqs(flattened);
            }
          }
        })
        .catch(err => console.error("Failed to fetch FAQs:", err));
    }
  }, [items]);

  const faqs = useMemo(() => normalizeFaqs(items || fetchedFaqs), [items, fetchedFaqs]);
  const localizedFaqs = useMemo(() => {
    return faqs.map((faq) => ({
      ...faq,
      question: (isUrdu && faq.questionUr) ? faq.questionUr : faq.question,
      answer: (isUrdu && faq.answerUr) ? faq.answerUr : faq.answer,
      category: (isUrdu && faq.categoryUr) ? faq.categoryUr : faq.category,
    }));
  }, [faqs, isUrdu]);

  // Auto-slide logic
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(timer);
  }, [currentIndex, localizedFaqs.length]);

  const nextSlide = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === localizedFaqs.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? localizedFaqs.length - 1 : prev - 1));
  };


  // Animation Variants
  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction) => ({
      zIndex: 0,
      x: direction < 0 ? 100 : -100,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <section
      className="bg-gradient-to-br from-slate-50 to-blue-50 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32 relative overflow-hidden"
      id="faq-slider"
    >
      {/* Decorative Background Elements */}
      <div className="absolute top-0 left-0 w-32 sm:w-40 md:w-48 lg:w-64 h-32 sm:h-40 md:h-48 lg:h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute bottom-0 right-0 w-32 sm:w-40 md:w-48 lg:w-64 h-32 sm:h-40 md:h-48 lg:h-64 bg-cyan-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 relative z-10">

        {/* Header */}
        <div className="text-center mb-6 sm:mb-8 md:mb-10 lg:mb-12 xl:mb-14 2xl:mb-16">
          <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900">
            {isUrdu ? "عمومی سوالات" : "Common Questions"}
          </h2>
          <p className="text-gray-500 mt-2 sm:mt-3 md:mt-4 text-xs sm:text-sm md:text-base lg:text-lg">
            {isUrdu ? "ہمارے صارفین کے عام سوالات کے فوری جوابات۔" : "Quick answers to our most frequent inquiries."}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="max-w-2xl sm:max-w-3xl md:max-w-3xl lg:max-w-4xl 2xl:max-w-5xl mx-auto">
          <div className="relative bg-white rounded-lg sm:rounded-xl md:rounded-2xl lg:rounded-2xl shadow-md sm:shadow-lg md:shadow-xl border border-white/50 backdrop-blur-sm min-h-[180px] sm:min-h-[200px] md:min-h-[220px] lg:min-h-[240px] flex items-center justify-center p-3 sm:p-4 md:p-6 lg:p-8 xl:p-10 2xl:p-12 overflow-hidden">
            {/* Background Watermark Icon */}
            <HelpCircle className="absolute -right-4 sm:-right-6 md:-right-8 lg:-right-10 -bottom-4 sm:-bottom-6 md:-bottom-8 lg:-bottom-10 w-16 sm:w-20 md:w-24 lg:w-32 xl:w-40 2xl:w-48 h-16 sm:h-20 md:h-24 lg:h-32 xl:h-40 2xl:h-48 text-gray-50 opacity-50 pointer-events-none" />

            {/* AnimatePresence handles the slide transition */}
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="w-full text-center"
              >
                {/* Category Badge */}
                  <span className="inline-block px-2 sm:px-3 md:px-4 lg:px-4 py-1 sm:py-1.5 md:py-2 rounded-full bg-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wider mb-2 sm:mb-3 md:mb-4 lg:mb-4">
                  {localizedFaqs[currentIndex].category}
                </span>

                {/* Question */}
                <h3 className="text-sm sm:text-base md:text-lg lg:text-2xl xl:text-3xl 2xl:text-3xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 lg:mb-5 leading-snug">
                  "{localizedFaqs[currentIndex].question}"
                </h3>

                {/* Answer */}
                <p className="text-xs sm:text-xs md:text-sm lg:text-base xl:text-base 2xl:text-base text-gray-600 leading-relaxed max-w-2xl mx-auto">
                  {localizedFaqs[currentIndex].answer}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={prevSlide}
              className="absolute left-1 sm:left-2 md:left-3 lg:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full bg-white shadow-md text-gray-400 hover:text-blue-600 hover:scale-110 transition-all z-20 hidden sm:block"
            >
              <ChevronLeft className="w-3 sm:w-3.5 md:w-4 lg:w-5 h-3 sm:h-3.5 md:h-4 lg:h-5" />
            </button>

            <button
              onClick={nextSlide}
              className="absolute right-1 sm:right-2 md:right-3 lg:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 md:p-2.5 lg:p-3 rounded-full bg-white shadow-md text-gray-400 hover:text-blue-600 hover:scale-110 transition-all z-20 hidden sm:block"
            >
              <ChevronRight className="w-3 sm:w-3.5 md:w-4 lg:w-5 h-3 sm:h-3.5 md:h-4 lg:h-5" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 mt-3 sm:mt-4 md:mt-5 lg:mt-6 xl:mt-7 2xl:mt-8">
            {localizedFaqs.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-1.5 sm:h-2 md:h-2 lg:h-2.5 transition-all duration-300 ${index === currentIndex
                    ? "w-4 sm:w-5 md:w-6 lg:w-7 xl:w-8 bg-blue-600 rounded-full"
                    : "w-1.5 sm:w-2 md:w-2.5 lg:w-3 bg-gray-300 hover:bg-blue-300 rounded-full"
                  }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
