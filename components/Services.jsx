"use client";
import React, { useEffect, useState } from "react";
import { 
  FaTint, 
  FaWater, 
  FaTruck, 
  FaWrench, 
  FaHandHoldingWater, 
  FaFileInvoiceDollar,
  FaBuilding,
  FaLeaf,
  FaPlus,
  FaMinus
} from "react-icons/fa";
import Loader from "@/components/Loader";
import gsap from "gsap";
import { useTranslation } from "react-i18next";

// ... (existing helper function remain same) ...

function ServiceCardItem({ card }) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  const [isOpen, setIsOpen] = useState(false);
  const Icon = IconMap[card.iconKey] || FaTint;
  const hasDetails = card.details && card.details.length > 0;
  
  const displayTitle = (isUrdu && card.titleUr) ? card.titleUr : card.title;
  const displaySummary = (isUrdu && card.summaryUr) ? card.summaryUr : card.summary;
  const displayDescription = (isUrdu && card.descriptionUr) ? card.descriptionUr : card.description;

  const popupAction = getPopupAction(card.title || ""); // Keep logical check on English title for stability

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
      {/* Card Header - Clickable for Toggle */}
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className={`p-6 sm:p-8 md:p-10 bg-gradient-to-br ${card.gradientClass || 'from-blue-50 to-white'} border-b border-gray-100 cursor-pointer group`}
      >
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
          <div className="space-y-4 flex-1">
            <div className="flex items-center justify-between md:justify-start gap-4">
              <div className="inline-flex p-3 bg-white rounded-xl shadow-sm text-blue-600 group-hover:scale-110 transition-transform duration-300">
                <Icon size={32} />
              </div>
              {/* Mobile Toggle Icon */}
              <div className="md:hidden p-2 bg-white/50 rounded-full text-blue-600">
                {isOpen ? <FaMinus size={20} /> : <FaPlus size={20} />}
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                {displayTitle}
              </h3>
              <p className="text-lg text-gray-600 leading-relaxed">
                {displaySummary || displayDescription}
              </p>
              {popupAction && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    window.dispatchEvent(new CustomEvent("kwsc-open-popup", { detail: popupAction }));
                  }}
                  className="mt-3 inline-flex items-center gap-2 text-blue-700 hover:text-blue-900 font-semibold text-base"
                >
                  Open Service
                  <FaPlus size={14} />
                </button>
              )}
            </div>
          </div>

          {/* Desktop Toggle Icon */}
          <div className="hidden md:flex items-center justify-center w-12 h-12 bg-white/50 rounded-full text-blue-600 transition-colors group-hover:bg-white">
            {isOpen ? <FaMinus size={24} /> : <FaPlus size={24} />}
          </div>
        </div>
      </div>

      {/* Card Details - Collapsible */}
      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden">
          {hasDetails ? (
            <div className="p-6 sm:p-8 md:p-10 grid gap-8 md:grid-cols-2 lg:grid-cols-2 border-t border-gray-100">
              {card.details.map((detail) => {
                  const detailHeading = (isUrdu && detail.headingUr) ? detail.headingUr : detail.heading;
                  const detailBody = (isUrdu && detail.bodyUr) ? detail.bodyUr : detail.body;
                  return (
                    <div key={detail.id} className="space-y-3">
                      <h4 className="text-xl font-semibold text-gray-800">
                        {detailHeading}
                      </h4>
                      <div 
                        className="text-gray-600 leading-relaxed prose prose-blue prose-sm max-w-none"
                        dangerouslySetInnerHTML={{ __html: detailBody }}
                      />
                      {detail.bulletPoints && detail.bulletPoints.length > 0 && (
                        <ul className="space-y-2 mt-3">
                          {detail.bulletPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start text-gray-600 text-sm">
                              <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0" />
                              <span>{point}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
              })}
            </div>
          ) : (
            displayDescription && displayDescription !== displaySummary && (
               <div className="p-6 sm:p-8 md:p-10 border-t border-gray-100">
                  <p className="text-gray-600">{displayDescription}</p>
               </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

function ServiceCategoryItem({ category }) {
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';

  const [isOpen, setIsOpen] = useState(true);

  const displayTitle = (isUrdu && category.titleUr) ? category.titleUr : category.title;
  const displaySummary = (isUrdu && category.summaryUr) ? category.summaryUr : category.summary;

  return (
    <div className="space-y-6">
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group select-none"
      >
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-blue-700 transition-colors">
            {displayTitle}
          </h2>
          {displaySummary && (
            <p className="text-gray-600 max-w-2xl">{displaySummary}</p>
          )}
        </div>
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 text-gray-600 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
          {isOpen ? <FaMinus size={16} /> : <FaPlus size={16} />}
        </div>
      </div>

      <div 
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden space-y-8">
          {category.cards?.map((card) => (
            <ServiceCardItem key={card.id} card={card} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Services(props) {
  const [animationDone, setAnimationDone] = useState(false);
  const { i18n } = useTranslation();
  const isUrdu = i18n.language === 'ur';
  
  const { data, loading: dataLoading, error, stale } = useServicesData();
  const loading = !animationDone || dataLoading;

  useEffect(() => {
    const loaderTimeline = gsap.timeline({ onComplete: () => setAnimationDone(true) });
    loaderTimeline
      .fromTo(".loader", { scaleY: 0, transformOrigin: "50% 100%" }, { scaleY: 1, duration: 0.5, ease: "power2.inOut" })
      .to(".loader", { scaleY: 0, transformOrigin: "0% -100%", duration: 0.5, ease: "power2.inOut" })
      .to(".wrapper", { y: "-100%", ease: "power4.inOut", duration: 1 }, "-=0.8");
  }, []);

  if (loading) return <Loader />;

  // Logic: 
  // 1. If explicit props are passed (e.g. from PageBuilder), use them. 
  //    Check for Ur props if isUrdu is true.
  // 2. If no props, fallback to 'data.hero' (from API).
  //    Check for Ur fields in data.hero if isUrdu is true.
  // 3. Fallback to hardcoded English strings.

  const propTitle = (isUrdu && props.titleUr) ? props.titleUr : props.title;
  const dataTitle = (isUrdu && data?.hero?.titleUr) ? data.hero.titleUr : data?.hero?.title;
  
  const displayTitle = propTitle || dataTitle || "Our Services";

  const propSubtitle = (isUrdu && props.subtitleUr) ? props.subtitleUr : props.subtitle;
  const dataSubtitle = (isUrdu && data?.hero?.subtitleUr) ? data.hero.subtitleUr : data?.hero?.subtitle;

  const displaySubtitle = propSubtitle || dataSubtitle || "KW&SC provides essential services to the citizens of Karachi, ensuring efficient water supply, sewerage management, and digital accessibility.";


  return (
    <>
      {/* Corporate Section Header */}
      <section className="bg-white py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 mb-4 uppercase">
            {displayTitle?.toUpperCase()}
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl sm:max-w-3xl md:max-w-4xl mx-auto leading-relaxed sm:leading-relaxed md:leading-relaxed">
            {displaySubtitle}
          </p>
          {error && (
            <p className="mt-4 text-sm text-red-500">Showing cached content due to a network issue. ({error.message})</p>
          )}
          {!error && stale && <p className="mt-4 text-sm text-amber-500">Content shown from cache while live data refreshes.</p>}
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-gray-50 py-8 sm:py-12 md:py-16 lg:py-20 xl:py-24">
        <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 space-y-16">
          
          {data?.categories?.map((category) => (
            <ServiceCategoryItem key={category.id} category={category} />
          ))}

          {(!data?.categories || data.categories.length === 0) && (
             <div className="text-center py-12 text-gray-500">
              <p>No services data available.</p>
            </div>
          )}

        </div>
      </section>
    </>
  );
}
