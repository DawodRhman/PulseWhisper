"use client";
import React from "react";
import Loader from "@/components/Loader";
import { Fade } from "react-awesome-reveal";
import { useEducationData } from "@/hooks/useEducationData";

import { useTranslation } from "react-i18next";

export default function Education() {
  const { t, i18n } = useTranslation();
  const { data, loading, error } = useEducationData();
  const currentDir = i18n.dir(i18n.language);
  const currentLang = i18n.language;

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">{t("education.error", "Failed to load education resources.")}</div>;

  // Default resources using standard i18n keys for static client-side fallback
  const defaultResources = [
    {
      title: t("education.waterConservation.title", { lng: currentLang }), // Force current lang if needed, or just t()
      description: t("education.waterConservation.desc", { lng: currentLang }),
      image: "/bg-1.jpg",
    },
    {
      title: t("education.drinkingWater.title", { lng: currentLang }),
      description: t("education.drinkingWater.desc", { lng: currentLang }),
      image: "/bg-2.jpg",
    },
    {
      title: t("education.sewerage.title", { lng: currentLang }),
      description: t("education.sewerage.desc", { lng: currentLang }),
      image: "/downtownkarachi.gif",
    },
    {
      title: t("education.emergency.title", { lng: currentLang }),
      description: t("education.emergency.desc", { lng: currentLang }),
      image: "/teentalwarkarachi.gif",
    },
  ];

  const resources = (data?.resources && data.resources.length > 0) ? data.resources : defaultResources;

  return (
    <section className="bg-[#020617] text-white py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32" dir={currentDir} lang={currentLang}>
      <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 space-y-8 sm:space-y-10 md:space-y-12 lg:space-y-16 xl:space-y-20 2xl:space-y-24">
        {resources.length > 0 ? resources.map((post, i) => {
          // Data is already localized from API or above defaultResources
          const title = post.title;
          const description = post.description || post.summary;
          const media = post.media;
          const videoUrl = post.videoUrl;

          const isMediaVideo = media?.mimeType?.startsWith("video/") || media?.url?.match(/\.(mp4|webm|ogg)$/i);

          const getYoutubeEmbedId = (url) => {
            if (!url) return null;
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            return (match && match[2].length === 11) ? match[2] : null;
          };

          const youtubeId = getYoutubeEmbedId(videoUrl);

          return (
            <Fade key={post.id || i} direction="up" triggerOnce duration={800} delay={i * 150}>
              <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">
                <div className="md:flex-1 w-full">
                  {youtubeId ? (
                    <div className="relative aspect-video w-full rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] overflow-hidden">
                      <iframe
                        className="absolute top-0 left-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${youtubeId}`}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ) : isMediaVideo ? (
                    <video
                      src={media.url}
                      className="rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] w-full h-auto"
                      controls
                    />
                  ) : (
                    <img
                      src={media?.url || post.image || "/bg-1.jpg"} // Fallback to post.image (defaultResources) or placeholder
                      alt={media?.altText || title}
                      className="rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-[0_0_30px_rgba(6,182,212,0.3)] w-full h-auto object-cover"
                    />
                  )}
                </div>
                <div className="md:flex-1">
                  <h3 className="text-xl font-bold text-cyan-400 mb-3">{title}</h3>
                  <p className="text-base text-slate-300 leading-relaxed">{description}</p>
                </div>
              </div>
            </Fade>
          )
        })
          : (
            <div className="col-span-full text-center py-12 text-gray-500">
              {t("education.empty", "No education resources available at the moment.")}
            </div>
          )}
      </div>
    </section>
  );
}
