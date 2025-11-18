'use client';
import React from "react";
import { Fade } from "react-awesome-reveal";
import { MapPin, Phone, Mail } from "lucide-react";

export default function KWSCMap() {
  return (
    <Fade direction="up" triggerOnce duration={1000}>
      <div className="mt-20 relative rounded-3xl overflow-hidden shadow-2xl">
        {/* Interactive Heading */}
        <div className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
          <h2 className="text-2xl font-bold text-blue-700">
            📍 Locate KW&SC Headquarters
          </h2>
        </div>

        {/* Map iframe */}
        <iframe
          src="https://www.google.com/maps?q=24.871416570262873,67.09184371090852&hl=en&z=15&output=embed"
          width="100%"
          height="550"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          className="rounded-3xl"
        />

        {/* Glassmorphism overlay for contact details */}
        <div className="absolute bottom-8 left-8 bg-white/70 backdrop-blur-md rounded-xl p-8 shadow-lg max-w-lg">
          <div className="flex items-center gap-3 mb-3">
            <MapPin className="text-blue-600" />
            <p className="text-gray-900 font-semibold text-lg">
              9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350
            </p>
          </div>
          <div className="flex items-center gap-3 mb-3">
            <Phone className="text-blue-600" />
            <p className="text-gray-900 font-semibold text-lg">(+92) 021 111 597 200</p>
          </div>
          <div className="flex items-center gap-3">
            <Mail className="text-blue-600" />
            <p className="text-gray-900 font-semibold text-lg">info@kwsc.gos.pk</p>
          </div>
        </div>
      </div>
    </Fade>
  );
}
