"use client";
import React, { useState, useEffect } from "react";
import { useNewsData } from "@/hooks/useNewsData";
import { useTranslation } from 'react-i18next';
import Loader from "@/components/Loader";
import gsap from "gsap";
import { Fade } from "react-awesome-reveal";
import Link from "next/link";
import {
  Activity,
  FileText,
  Camera,
  ChevronRight,
  Calendar,
  Tag,
  Cpu,
  Globe,
} from "lucide-react";

// --- Mock Data ---
const mockArticles = [
  {
    date: "Aug 13, 2025",
    title: "PPP Chairman Bilawal Bhutto Zardari inaugurates New Hub Canal",
    description:
      "The New Hub Canal project has been officially inaugurated, marking a significant milestone in Karachi's water infrastructure development.",
    type: "Inauguration",
    id: "UP-001",
    img: "/otherImages/bhutto.png",
  },
  {
    date: "Aug 6, 2025",
    title: "Mayor Karachi visits New Hub Canal with officials and experts",
    description:
      "Comprehensive inspection and review of the completed New Hub Canal project by city leadership.",
    type: "Inspection",
    id: "UP-002",
    img: "/otherImages/infa.png",
  },
  {
    date: "Aug 6, 2025",
    title: "First major water project completed in 22 years",
    description:
      "KW&SC celebrates the completion of the city's first major water project in nearly two decades.",
    type: "Achievement",
    id: "UP-003",
  },
  {
    date: "July 24, 2025",
    title: "KWSC Board approves Ahmed Ali Siddiqui as permanent CEO",
    description:
      "Board of Directors officially appoints Ahmed Ali Siddiqui as the permanent CEO of KW&SC.",
    type: "Leadership",
    id: "UP-004",
    img: "/leaders/salahuddin.svg",
  },
  {
    date: "May 3, 2025",
    title: "CEO visits NEK Old & New Filter Plants",
    description:
      "CEO conducts inspection of water filtration facilities to ensure quality standards.",
    type: "Inspection",
    id: "UP-005",
  },
  {
    date: "Aug 13, 2025",
    title: "New Hub Canal Project Successfully Completed",
    description:
      "KW&SC announces the successful completion of the New Hub Canal project, ahead of schedule.",
    link: "https://www.kwsc.gos.pk/news-and-updates#press-release",
    id: "PR-101",
  },
  {
    date: "July 24, 2025",
    title: "New CEO Appointment Announcement",
    description:
      "Official announcement regarding the appointment of Ahmed Ali Siddiqui as permanent CEO.",
    link: "https://www.kwsc.gos.pk/news-and-updates#press-release",
    id: "PR-102",
  },
  {
    title: "Hub Canal Inauguration Ceremony",
    description:
      "Photos from the official inauguration ceremony of the New Hub Canal project",
    type: "Photos",
    img: "/otherImages/bhutto.png",
  },
  {
    title: "Infrastructure Development",
    description:
      "Visual documentation of ongoing infrastructure development projects",
    type: "Photos",
    img: "/otherImages/infa.png",
  },
  {
    title: "Community Engagement",
    description: "Images from community engagement and development programs",
    type: "Photos",
    img: "/otherImages/comunity.jpeg",
  },
];

const NewsCard = ({ news, index, t }) => {
  const displayTitle = news.title;
  const displaySummary = news.description || news.summary;

  return (
    <div
      className="relative bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-700 flex flex-col h-full hover:shadow-lg transition-shadow duration-300"
      style={{
        animation: `fadeInUp 0.6s ease-out forwards`,
        animationDelay: `${index * 0.05}s`,
        opacity: 0,
        transform: "translateY(20px)",
      }}
    >
      {/* Image */}
      <div className="relative h-40 sm:h-48 md:h-56 overflow-hidden">
        <img
          src={news.imagePlaceholder}
          alt={displayTitle}
          className="w-full h-full object-cover"
        />
        {/* Status Badge */}
        <div className="absolute top-3 right-3">
          <div className="bg-gray-900/90 text-white text-xs font-medium px-2 py-1 rounded">
            {news.status}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 mb-2">
          <Tag className="w-3 h-3 text-blue-400" />
          <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
            {news.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 leading-snug">
          {displayTitle}
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed mb-4 line-clamp-3">
          {displaySummary}
        </p>

        {/* Footer */}
        <div className="mt-auto pt-3 border-t border-gray-700 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Calendar className="w-3 h-3" />
            <span>{news.date}</span>
          </div>
          <a
            href="#"
            className="text-sm font-medium text-blue-400 hover:text-blue-300 flex items-center gap-1 transition-colors"
          >
            {t('readMore')}
            <ChevronRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
};

function normalizeNews(articles) {
  if (!articles || articles.length === 0) return mockArticles;

  return articles.map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : article.date || new Date().toLocaleDateString(),
    category: article.category?.title || article.type || "GENERAL",
    description: article.summary || article.description || "",
    summary: article.summary || article.description || "",
    icon: <Activity className="w-6 h-6 text-cyan-400" />,
    img:
      article.heroMedia?.url ||
      article.img ||
      `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "News"
      )}`,
    status: article.status || "PUBLISHED",
    imagePlaceholder: article.heroMedia?.url || article.img || `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(article.title || "News")}`
  }));
}

// Helper function to categorize articles
function categorizNews(articles) {
  if (!articles || articles.length === 0) {
    return { latestUpdates: [], pressReleases: [], mediaGallery: [] };
  }

  // 1. Latest Updates: Take the first 5 items regardless of type
  const latestUpdates = articles.slice(0, 5).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : article.date || new Date().toLocaleDateString(),
    category: article.category?.title || article.type || "GENERAL",
    description: article.summary || article.description || "",
    summary: article.summary || article.description || "",
    img:
      article.heroMedia?.url ||
      article.img ||
      `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "News"
      )}`,
    status: article.status || "PUBLISHED",
    imagePlaceholder: article.heroMedia?.url || article.img || `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(article.title || "News")}`
  }));

  // 2. Press Releases: Filter by category 'PRESS RELEASE' or type, otherwise take next available items
  let pressReleasesRaw = articles.filter(
    (a) =>
      a.category?.title?.toUpperCase() === "PRESS RELEASE" ||
      a.type?.toUpperCase() === "PRESS RELEASE" ||
      a.type?.toUpperCase() === "PRESS"
  );

  // Fallback: If no explicit press releases, take items 5-7 (if available)
  if (pressReleasesRaw.length === 0 && articles.length > 5) {
    pressReleasesRaw = articles.slice(5, 7);
  }

  const pressReleases = pressReleasesRaw.slice(0, 3).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : article.date || new Date().toLocaleDateString(),
    description: article.summary || article.description || "",
    link: article.link || `/news/${article.slug || article.id}`,
    category: article.category?.title || "PRESS RELEASE",
  }));

  // 3. Media Gallery: Filter by 'MEDIA'/'PHOTOS' or items with images
  // We want to avoid duplicates from Latest if possible, but for small datasets it's better to show something than nothing.
  let mediaGalleryRaw = articles.filter(
    (a) =>
      a.category?.title?.toUpperCase() === "MEDIA" ||
      a.category?.title?.toUpperCase() === "PHOTOS" ||
      a.category?.title?.toUpperCase() === "GALLERY" ||
      a.type?.toUpperCase() === "MEDIA" ||
      a.type?.toUpperCase() === "PHOTOS"
  );

  // Fallback: If no explicit media items, take ANY items that have images
  if (mediaGalleryRaw.length === 0) {
    mediaGalleryRaw = articles.filter(
      (a) => a.heroMedia?.url || a.img
    );
  }

  // Final Fallback: If still nothing, just take the items 0-6 to fill the gallery
  if (mediaGalleryRaw.length === 0) {
    mediaGalleryRaw = articles.slice(0, 6);
  }

  const mediaGallery = mediaGalleryRaw.slice(0, 6).map((article, index) => ({
    id: article.id || index,
    title: article.title,
    description: article.summary || article.description || "",
    type: article.category?.title || article.type || "MEDIA",
    img:
      article.heroMedia?.url ||
      article.img ||
      `https://placehold.co/400x300/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "Media"
      )}`,
    imagePlaceholder: article.heroMedia?.url || article.img || `https://placehold.co/400x300/0f172a/06b6d4?text=${encodeURIComponent(article.title || "Media")}`
  }));

  return { latestUpdates, pressReleases, mediaGallery };
}

export default function NewsUpdates() {
  const { data, loading: hookLoading, error } = useNewsData();
  const { t } = useTranslation();
  const [news, setNews] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updates");

  useEffect(() => {
    if (hookLoading) {
      setLoading(true);
      return;
    }

    if (error || !data?.articles) {
      const { latestUpdates, pressReleases: pr, mediaGallery: mg } = categorizNews(mockArticles);
      setNews(latestUpdates);
      setPressReleases(pr);
      setMediaGallery(mg);
    } else {
      const normalized = normalizeNews(data.articles);
      const { latestUpdates, pressReleases: pr, mediaGallery: mg } = categorizNews(data.articles);
      setNews(normalized);
      setPressReleases(pr);
      setMediaGallery(mg);
    }
    setLoading(false);
  }, [data, hookLoading, error]);

  if (loading) {
    return <div className="flex justify-center items-center min-h-[50vh]">{t('loading')}</div>;
  }

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t('news.latestNews')}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-10">
          <div className="bg-gray-800 p-1 rounded-lg inline-flex gap-1">
            {[
              { id: "updates", label: t("news.latestNews"), icon: <Activity size={16} /> },
              { id: "press", label: t("news.pressReleases"), icon: <FileText size={16} /> },
              { id: "media", label: t("news.gallery"), icon: <Camera size={16} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === tab.id
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* Latest News */}
          {activeTab === "updates" && (
            <div className="grid grid-cols-1 gap-6">
              {news.map((item, index) => {
                return (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow hover:shadow-blue-500/20">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="bg-blue-900/50 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-700/50">
                          {item.type}
                        </span>
                        <span className="text-gray-400 text-sm flex items-center gap-1">
                          <Calendar size={14} className="text-blue-400" /> {item.date}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold text-white mb-2">
                        {item.title}
                      </h3>
                      <p className="text-gray-300 mb-4">
                        {item.description || item.summary}
                      </p>
                      <a href="#" className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 transition-colors">
                        {t('news.readMore')} <ChevronRight size={16} />
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Press Releases */}
          {activeTab === "press" && (
            <div className="grid grid-cols-1 gap-6">
              {pressReleases.map((item, index) => {
                const displayTitle = item.title;
                const displayDesc = item.description;
                return (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:shadow-lg transition-shadow hover:shadow-blue-500/20">
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-gray-400 text-sm">{item.date}</span>
                      <span className="bg-blue-900/50 text-blue-300 text-xs px-3 py-1 rounded-full border border-blue-700/50">
                        Press Release
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      {displayTitle}
                    </h3>
                    <p className="text-gray-300 mb-4">
                      {displayDesc}
                    </p>
                    <a
                      href={item.link || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 text-sm font-medium inline-flex items-center gap-1 transition-colors"
                    >
                      {t('news.readMore')} <ChevronRight size={16} />
                    </a>
                  </div>
                )
              })}
            </div>
          )}

          {/* Media Gallery */}
          {activeTab === "media" && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 text-white">
              {mediaGallery.map((item, index) => {
                return (
                  <div key={index} className="group relative rounded-lg overflow-hidden bg-gray-100">
                    <div className="aspect-video relative">
                      <img
                        src={item.img || item.imagePlaceholder}
                        alt={item.title}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent("No Image")}`;
                        }}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                      <div>
                        <h4 className="text-white font-medium">{item.title}</h4>
                        <p className="text-gray-200 text-sm">{item.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
