"use client";
import React, { useMemo } from "react";
import Count from "./ui/Count";

const FALLBACK_COUNTERS = [
  { id: 1, title: "Water Connections", value: 1.2, suffix: "M" },
  { id: 2, title: "Sewerage Connections", value: 0.8, suffix: "M" },
  { id: 3, title: "Years of Service", value: 22 },
  { id: 4, title: "Water Treatment Plants", value: 12 },
];

function normalizeCounters(stats) {
  const source = Array.isArray(stats) && stats.length ? stats : FALLBACK_COUNTERS;
  return source.map((item, index) => {
    return {
      id: item.id || item.title || `counter-${index}`,
      title: item.title || item.label,
      value: typeof item.value === "number" ? item.value : Number(item.number) || 0,
      suffix: item.suffix || "" ,
    };
  });
}

const Counter = ({ stats }) => {
  const counters = useMemo(() => normalizeCounters(stats), [stats]);
  return (
    <section className="py-24 bg-gradient-to-r from-cyan-50 to-blue-50 relative overflow-hidden">
      {/* Background subtle animated lines */}
      <div className="absolute inset-0 flex justify-center items-center opacity-10">
        <div className="w-[2px] h-full bg-cyan-200 animate-pulse-slow mx-8"></div>
        <div className="w-[2px] h-full bg-blue-200 animate-pulse-slow mx-8"></div>
        <div className="w-[2px] h-full bg-cyan-200 animate-pulse-slow mx-8"></div>
      </div>

      <div className="max-w-[90%] mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center">
          {counters.map((item) => (
            <div
              key={item.id}
              className="flex flex-col items-center justify-center group cursor-pointer transition-transform duration-500 hover:-translate-y-2"
            >
              <div className="mb-3 transition-transform duration-500 group-hover:scale-110">{item.icon}</div>
              <div className="text-5xl md:text-6xl font-extrabold text-gray-900 flex items-center justify-center transition-colors duration-500 group-hover:text-cyan-500">
                <Count number={item.value} add_style={true} />
                {item.suffix && <span className="ml-1 text-4xl md:text-5xl font-thin">{item.suffix}</span>}
              </div>
              <p className="mt-3 text-xl md:text-2xl font-medium text-gray-700 transition-colors duration-500 group-hover:text-gray-900">
                {item.title}
              </p>
              {/* Subtle animated underline */}
              <div className="mt-2 w-10 h-[3px] bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Counter;