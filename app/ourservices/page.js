"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { FaTint, FaWater, FaTools, FaShieldAlt, FaChartLine, FaCogs, FaDatabase, FaPhone } from "react-icons/fa";
import gsap from "gsap";
import Loader from "@/components/Loader";
import { useServicesData } from "@/hooks/useServicesData";

const ICON_MAP = {
  FaTint,
  FaWater,
  FaTools,
  FaShieldAlt,
  FaChartLine,
  FaCogs,
  FaDatabase,
  FaPhone,
};

export default function Services() {
  const [animationDone, setAnimationDone] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const { data, cards, loading: dataLoading, error, stale } = useServicesData();
  const loading = !animationDone || dataLoading;

  useEffect(() => {
    const loaderTimeline = gsap.timeline({
      onComplete: () => setAnimationDone(true),
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

  const heroImage = data.hero?.backgroundImage;
  const heroTitle = data.hero?.title || "What We Do";
  const heroSubtitle =
    data.hero?.subtitle ||
    "Comprehensive water and sewerage services ensuring clean water supply and efficient wastewater management for Karachi.";

  const handleCardSelect = (card) => setSelectedCard(card);
  const closeOverlay = () => setSelectedCard(null);
  const SelectedIcon = selectedCard ? ICON_MAP[selectedCard.iconKey] || FaTint : null;

  return (
    <>
      {loading && <Loader />}

      <section
        className="relative h-screen transition-opacity duration-700 bg-cover bg-center text-white flex justify-center items-center"
        style={heroImage ? { backgroundImage: `url(${heroImage})` } : undefined}
      >
        <div className="absolute inset-0 bg-blue-900/60 z-0" />
        <div className="relative z-[1] max-w-[75%] m-20 mx-auto flex items-center justify-center text-center">
          <div className="w-[85%]">
            <h2 className="text-[8vh] font-bold">{heroTitle}</h2>
            <p className="mt-6 text-[3.5vh]">{heroSubtitle}</p>
          </div>
        </div>
      </section>
      <div className="w-full py-12 mt-20">
        <div className="text-gray-900 max-w-[90%] mx-auto">
          <header className="text-center mb-10">
            <h1 className="text-4xl font-bold mb-4">{heroTitle}</h1>
            <p className="text-gray-600 max-w-3xl mx-auto">{heroSubtitle}</p>
            {error && <p className="mt-3 text-sm text-red-500">Showing cached content while the network recovers.</p>}
            {!error && stale && <p className="mt-3 text-sm text-amber-500">Content served from cache while live data refreshes.</p>}
          </header>
          {data.categories?.length ? (
            data.categories.map((category) => (
              <div key={category.id} className="mb-16">
                <h2 className="text-3xl font-bold text-center mb-4 text-blue-900">{category.title}</h2>
                {category.summary && <p className="text-gray-600 text-center max-w-2xl mx-auto mb-8">{category.summary}</p>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                  {(category.cards || []).map((card) => (
                    <div key={card.id} className="bg-white rounded-xl shadow-lg p-8">
                      <h3 className="text-xl font-bold mb-3 text-blue-800">{card.title}</h3>
                      <p className="text-gray-600 mb-4">{card.summary || card.description}</p>
                      {(card.details || []).map((detail) => (
                        <div key={detail.id} className="mt-4 border-t border-gray-100 pt-4">
                          <h4 className="text-lg font-semibold text-gray-900">{detail.heading}</h4>
                          {detail.body && <p className="text-gray-600 mt-2">{detail.body}</p>}
                          {Array.isArray(detail.bulletPoints) && detail.bulletPoints.length ? (
                            <ul className="mt-3 space-y-1 text-gray-600">
                              {detail.bulletPoints.map((point, idx) => (
                                <li key={`${detail.id}-bp-${idx}`}>• {point}</li>
                              ))}
                            </ul>
                          ) : null}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
                {category.resources?.length ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {category.resources.map((resource) => (
                      <div key={resource.id} className="bg-white rounded-xl shadow-lg p-8">
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
            <p className="mb-16 text-center text-gray-500">Service details will appear here once published.</p>
          )}

          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            slidesPerView={3}
            spaceBetween={30}
            autoplay={false}
            breakpoints={{
              640: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            navigation
            pagination={{ clickable: true }}
            className="pb-12"
          >
            {cards.map((service) => {
              const Icon = ICON_MAP[service.iconKey] || FaTint;
              const key = service.id || service.title;
              const description = service.summary || service.description;
              const gradient = service.gradientClass || "from-blue-400 to-blue-600";

              return (
                <SwiperSlide key={key}>
                  <div
                    className={`h-[600px] p-6 rounded-lg shadow-lg transition-all duration-300 relative overflow-hidden bg-gradient-to-br ${gradient} bg-opacity-100 card cursor-pointer`}
                    onClick={() => handleCardSelect(service)}
                    onKeyDown={(evt) => evt.key === "Enter" && handleCardSelect(service)}
                    role="button"
                    tabIndex={0}
                    aria-label={`View details for ${service.title}`}
                  >
                    <div className="flex flex-col items-center text-center h-full justify-center">
                      <div className="text-6xl mb-4 text-gray-900">
                        <Icon />
                      </div>
                      <h2 className="text-2xl font-bold mb-2">{service.title}</h2>
                      <p className="text-gray-700">{description}</p>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>

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
              <div className="text-5xl">{SelectedIcon ? <SelectedIcon /> : <FaTint />}</div>
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