import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";

// Example animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function InsightsSection() {
  return (
    <div className="w-full overflow-hidden">
      {/* Featured Insights */}
      <section id="insights-section" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Featured Insights
          </motion.h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <motion.div
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="relative rounded-xl overflow-hidden shadow-lg group bg-white"
            >
              <div className="aspect-[4/6] w-full relative">
                <Image
                  src="/insights/1.webp"
                  alt="background-image"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-5">
                <h6 className="text-blue-600 font-semibold text-sm mb-2">EVENT</h6>
                <h4 className="text-xl font-bold mb-2">KWSC hosts 14th Edition of the Bank of the Future Forum</h4>
                <div className="text-gray-500 text-sm space-y-1 mb-3">
                  <p>📅 12th November 2025</p>
                  <p>📍 Marriott Hotel, Karachi</p>
                </div>
                <p className="text-gray-700 mb-4">
                  BoFF 2025 will spark dialogue around this year’s theme, “Reimagining the Future of Banking with AI”.
                </p>
                <a
                  href="#"
                  className="text-blue-600 font-semibold inline-flex items-center hover:underline"
                >
                  Register now →
                </a>
              </div>
            </motion.div>

            {/* Repeat more cards (shortened for canvas) */}
          </div>
        </div>
      </section>

      {/* Numbers Section */}
      <section id="home-numbers" className="py-20">
        <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold">Translating technology into a positive impact</h2>
            <p className="text-gray-700">
              Our approach delivers exceptional experiences that drive growth and success for all stakeholders.
            </p>
            <a href="#" className="text-blue-600 font-semibold hover:underline">
              Learn more →
            </a>
          </motion.div>

          <div className="grid grid-cols-2 gap-6">
            {[{ num: "48+", text: "Years of continual excellence" },
              { num: "7700+", text: "Change makers driving revolution" },
              { num: "16+", text: "Countries with our presence and clientele" },
              { num: "300+", text: "Active clients across the globe" }].map((item, i) => (
                <motion.div
                  key={i}
                  variants={fadeInUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow text-center"
                >
                  <h3 className="text-3xl font-bold text-blue-600">{item.num}</h3>
                  <p className="text-gray-600 mt-2">{item.text}</p>
                </motion.div>
              ))}
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section id="home-careers" className="relative h-[400px] flex items-center justify-center text-white">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/home-careers.mp4" type="video/mp4" />
        </video>
        <div className="relative z-10 text-center">
          <motion.h2
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="text-4xl font-bold mb-4"
          >
            Your next starts right here
          </motion.h2>
          <a
            href="#"
            className="px-6 py-3 bg-blue-600 rounded-full font-semibold hover:bg-blue-700 transition"
          >
            JOIN US
          </a>
        </div>
        <div className="absolute inset-0 bg-black/40" />
      </section>
    </div>
  );
}
