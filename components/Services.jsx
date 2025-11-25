"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaTint, FaWater, FaTools, FaShieldAlt, FaChartLine, FaCogs, FaDatabase, FaPhone } from "react-icons/fa";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { useServicesData } from "@/hooks/useServicesData";

export default function Services() {
  const [animationDone, setAnimationDone] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { data, cards, loading: dataLoading, error, stale } = useServicesData();
  const loading = !animationDone || dataLoading;

  useEffect(() => {
    const loaderTimeline = gsap.timeline({ onComplete: () => setAnimationDone(true) });
    loaderTimeline
      .fromTo(".loader", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "power2.inOut" })
      .to(".loader", { scaleY: 0, transformOrigin: "0% -100%", duration: 0.5, ease: "power2.inOut" })
      .to(".wrapper", { y: "-100%", ease: "power4.inOut", duration: 1 }, "-=0.8");
  }, []);

  const iconMap = {
    FaTint,
    FaWater,
    FaTools,
    FaShieldAlt,
    FaChartLine,
    FaCogs,
    FaDatabase,
    FaPhone,
  };

  const heroTitle = data.hero?.title || "Our Services";
  const heroSubtitle =
    data.hero?.subtitle ||
    "We provide a full range of water supply, sewerage, and infrastructure services to keep Karachi safe, clean, and sustainable.";

  const handleCardSelect = (card) => {
    setSelectedCard(card);
  };

  const closeOverlay = () => setSelectedCard(null);
  const SelectedIcon = selectedCard ? iconMap[selectedCard.iconKey] || FaTint : null;

  return (
    <>
      {loading && <Loader />}

      {/* Corporate Section Header */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">{heroTitle}</h1>
          <p className="text-gray-600 text-lg md:text-xl">{heroSubtitle}</p>
          {error && (
            <p className="mt-4 text-sm text-red-500">Showing cached content due to a network issue. ({error.message})</p>
          )}
          {!error && stale && <p className="mt-4 text-sm text-amber-500">Content shown from cache while live data refreshes.</p>}
        </div>
      </section>

      {/* Detailed Sections */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-6xl mx-auto px-6 space-y-16">
          {data.categories?.length ? (
            data.categories.map((category) => (
              <div key={category.id} className="space-y-8">
                <div className="text-center">
                  <h2 className="text-3xl font-semibold text-gray-800">{category.title}</h2>
                  {category.summary && <p className="text-gray-600 mt-3">{category.summary}</p>}
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {(category.cards || []).slice(0, 2).map((card) => (
                    <div key={card.id} className="bg-white rounded-xl shadow-md p-6">
                      <h3 className="text-xl font-semibold text-gray-800 mb-3">{card.title}</h3>
                      <p className="text-gray-600 mb-3">{card.summary}</p>
                      {card.details?.[0]?.bulletPoints && (
                        <ul className="list-disc list-inside text-gray-600 space-y-1">
                          {card.details[0].bulletPoints.map((point, idx) => (
                            <li key={idx}>{point}</li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </div>

                {category.resources?.length ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {category.resources.map((resource) => (
                      <div key={resource.id} className="bg-white rounded-xl shadow-md p-6">
                        <h4 className="text-lg font-semibold text-blue-800 mb-2">{resource.title}</h4>
                        {resource.description && <p className="text-gray-600 mb-3">{resource.description}</p>}
                        <a
                          href={resource.externalUrl || resource.media?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-semibold"
                        >
                          View Resource
                          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">Service data will appear here once available.</p>
          )}
        </div>
      </section>

      {/* Swiper / Card Services */}
      <section className="bg-white py-16">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Other Services</h2>
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={30}
            autoplay={false}
            breakpoints={{ 640: { slidesPerView: 1 }, 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {cards.map((service) => {
              const Icon = iconMap[service.iconKey] || FaTint;
              const key = service.id || service.title;
              const description = service.summary || service.description || "Details coming soon.";
              const gradientClass = service.gradientClass || "from-blue-100 to-blue-300";

              return (
                <SwiperSlide key={key}>
                  <div
                    className={`card h-[400px] p-6 rounded-xl shadow-lg transition-transform transform hover:scale-105 border border-gray-200 bg-gradient-to-br cursor-pointer ${gradientClass}`}
                    onClick={() => handleCardSelect(service)}
                    onKeyDown={(evt) => evt.key === "Enter" && handleCardSelect(service)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${service.title}`}
                  >
                    <div className="flex flex-col items-center text-center justify-center h-full">
                      <div className="text-5xl mb-4 text-gray-800">
                        <Icon />
                      </div>
                      <h2 className="text-xl font-semibold mb-2 text-gray-900">{service.title}</h2>
                      <p className="text-gray-700">{description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </section>

      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4">
          <div className={`relative w-full max-w-3xl rounded-2xl p-8 text-white shadow-2xl bg-gradient-to-br ${selectedCard.gradientClass || "from-blue-600 to-indigo-700"}`}>
            <button
              type="button"
              onClick={closeOverlay}
              className="absolute right-4 top-4 rounded-full bg-white/15 p-2 text-white transition hover:bg-white/25"
              aria-label="Close service details"
            >
              ✕
            </button>
            <div className="flex flex-col items-center text-center gap-4">
              <div className="text-5xl">
                {SelectedIcon ? <SelectedIcon /> : <FaTint />}
              </div>
              <h3 className="text-3xl font-semibold">{selectedCard.title}</h3>
              <p className="text-lg text-white/90 max-w-2xl">
                {selectedCard.description || selectedCard.summary || "Detailed information will be published soon."}
              </p>
            </div>
            {selectedCard.details?.length ? (
              <div className="mt-6 space-y-4">
                {selectedCard.details.map((detail) => (
                  <div key={detail.id || detail.heading} className="rounded-xl bg-white/10 p-4">
                    <h4 className="text-xl font-semibold mb-2">{detail.heading}</h4>
                    {detail.body && <p className="text-sm text-white/80">{detail.body}</p>}
                    {Array.isArray(detail.bulletPoints) && detail.bulletPoints.length ? (
                      <ul className="mt-3 list-disc list-inside text-sm text-white/80">
                        {detail.bulletPoints.map((point, idx) => (
                          <li key={`${detail.heading}-${idx}`}>{point}</li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </>
  );
}
