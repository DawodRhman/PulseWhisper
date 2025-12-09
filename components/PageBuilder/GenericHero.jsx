"use client";

import React from "react";
import { motion } from "framer-motion";
import OptimizedImage from "@/components/OptimizedImage";

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export default function GenericHero({ title, subtitle, backgroundImage }) {
  // Use provided image or fallback to a default
  const bgImage = backgroundImage || "/bg-1.jpg";

  return (
    <section className="relative w-full  min-h-full flex items-center justify-center overflow-hidden bg-gray-900 text-white">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <OptimizedImage
          src={bgImage}
          alt="Hero Background"
          fill
          className="object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 container flex justify-center items-center align-middle mx-auto px-4 text-center">
        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-6"
        >
          {title && (
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-xl md:text-2xl text-gray-200 font-light">
              {subtitle}
            </p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
