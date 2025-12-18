"use client";
import React, { useState, useRef, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const WhoAreWe = ({ services: customServices }) => {
  const { t, i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  const sectionRef = useRef(null);
  const [isActive, setIsActive] = useState(false);

  const dispatchPopup = (title = "") => {
    // ... (same as before)
    const lower = title.toLowerCase();
    let detail = null;
    if (lower.includes("complaint") || lower.includes("شکایتی")) detail = "eComplaint";
    else if (lower.includes("tanker") || lower.includes("ٹینکر")) detail = "bookTanker";
    else if (lower.includes("bill") || lower.includes("بل")) detail = "bill";
    else if (lower.includes("connection") || lower.includes("کنکشن")) detail = "newConnection";
    if (detail) {
      window.dispatchEvent(new CustomEvent("kwsc-open-popup", { detail }));
    }
  };

  useEffect(() => {
    // ... (same as before)
    const handleScroll = () => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      if (rect.top <= windowHeight * 0.5 && rect.bottom >= windowHeight * 0.4) {
        setIsActive(true);
      } else {
        setIsActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // KW&SC Services Tiles
  const defaultServices = [
    {
      title: t("services.tiles.complaintManagement.title"),
      desc: t("services.tiles.complaintManagement.desc"),
    },
    {
      title: t("services.tiles.newConnection.title"),
      desc: t("services.tiles.newConnection.desc"),
    },
    {
      title: t("services.tiles.billGeneration.title"),
      desc: t("services.tiles.billGeneration.desc"),
    },
    {
      title: t("services.tiles.onlineTanker.title"),
      desc: t("services.tiles.onlineTanker.desc"),
    },
  ];

  let displayedServices = defaultServices;

  if (customServices && customServices.length > 0) {
    displayedServices = customServices.map(service => ({
      ...service,
      title: (isUrdu && service.titleUr) ? service.titleUr : service.title,
      desc: (isUrdu && service.descUr) ? service.descUr : service.desc,
      // Handle legacy 'description' field if 'desc' is missing
      description: (isUrdu && (service.descriptionUr || service.descUr)) ? (service.descriptionUr || service.descUr) : (service.description || service.desc)
    }));
  }

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-50 to-gray-100 px-4 sm:px-6 md:px-8 lg:px-20 xl:px-40 py-12 sm:py-16 md:py-20 overflow-hidden"
    >
      <div className="w-full mx-auto relative">
        <div
          className={`
            flex flex-col md:flex-row items-start md:items-center justify-between gap-6 sm:gap-8 md:gap-10 lg:gap-12
            transition-all duration-1000 ease-out
          `}
        >
          {/* LEFT - Heading */}
          <div
            className={`
              w-full md:w-1/2
              transform transition-all duration-1000 ease-out
              ${isActive ? "translate-x-0 opacity-100 text-left" : "translate-x-1/2 opacity-100 text-center md:text-left"}
            `}
          >
            <h2
              className={`
                text-4xl sm:text-6xl lg:text-7xl font-extrabold text-blue-900
                transition-all duration-1000 ease-out
                leading-tight md:leading-normal
                ${isActive ? "text-left" : "text-center md:text-left"}
              `}
            >
              {t("nav.services").toUpperCase()}
            </h2>
          </div>

          {/* RIGHT - Tiles */}
          <div
            className={`
              w-full md:w-1/2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6
              transition-all duration-1000 ease-out
              ${isActive ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}
            `}
          >
            {displayedServices.map((item, i) => (
              <div
                key={i}
                className={`
                  p-4 sm:p-5 md:p-6 lg:p-7 rounded-lg sm:rounded-xl bg-white/80 shadow-md hover:shadow-xl transition-all duration-500 ease-out
                  hover:-translate-y-1 cursor-pointer
                  ${isActive ? "opacity-100 translate-y-0" : "opacity-0 translate-y-5"}
                `}
                style={{ transitionDelay: `${(i + 1) * 150}ms` }}
                onClick={() => dispatchPopup(item.title)}
              >
                <p className="font-semibold text-blue-900 text-sm sm:text-base md:text-lg mb-1 sm:mb-2">{item.title}</p>
                <p className="text-gray-700 text-xs sm:text-sm md:text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoAreWe;
