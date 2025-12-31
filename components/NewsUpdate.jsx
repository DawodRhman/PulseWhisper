"use client";
import React, { useState, useEffect } from "react";
import { useNewsData } from "@/hooks/useNewsData";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import {
  Activity,
  FileText,
  Camera,
  ChevronRight,
  Calendar,
  Tag,
} from "lucide-react";

/* ---------------- MOCK DATA ---------------- */

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
];

/* ---------------- NORMALIZE ---------------- */

function normalizeNews(articles) {
  if (!articles || !articles.length) return mockArticles;

  return articles.map((article, index) => ({
    id: article.id || index,
    title: article.title,
    date: article.publishedAt
      ? new Date(article.publishedAt).toLocaleDateString()
      : article.date,
    category: article.category?.title || article.type || "GENERAL",
    description: article.summary || article.description || "",
    img:
      article.heroMedia?.url ||
      article.img ||
      `https://placehold.co/800x450/0f172a/06b6d4?text=${encodeURIComponent(
        article.title || "News"
      )}`,
    status: article.status || "PUBLISHED",
  }));
}

/* ---------------- CATEGORIZE ---------------- */

function categorizNews(articles) {
  const latestUpdates = articles.slice(0, 5);
  const pressReleases = articles.filter(
    (a) => a.type?.toUpperCase() === "PRESS"
  );
  const mediaGallery = articles.filter((a) => a.img);

  return { latestUpdates, pressReleases, mediaGallery };
}

/* ---------------- COMPONENT ---------------- */

export default function NewsUpdates({ isHomePage = false }) {
  const { data, loading: hookLoading, error } = useNewsData();
  const { t } = useTranslation();

  const [news, setNews] = useState([]);
  const [pressReleases, setPressReleases] = useState([]);
  const [mediaGallery, setMediaGallery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("updates");

  /* ✅ FIXED EFFECT (NO INFINITE LOOP) */
  useEffect(() => {
    if (hookLoading) {
      setLoading(true);
      return;
    }

    let sourceArticles;

    if (error || !data?.articles) {
      sourceArticles = mockArticles;
    } else {
      sourceArticles = [
        ...normalizeNews(data.articles),
        ...mockArticles,
      ];
    }

    const categorized = categorizNews(sourceArticles);

    setNews(
      isHomePage
        ? categorized.latestUpdates.slice(0, 3)
        : categorized.latestUpdates
    );
    setPressReleases(categorized.pressReleases);
    setMediaGallery(categorized.mediaGallery);
    setLoading(false);

  }, [data, hookLoading, error, isHomePage]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh] text-white">
        {t("loading")}
      </div>
    );
  }

  return (
    <section className="py-12 bg-black">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            {t("news.latestNews")}
          </h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        {/* TABS */}
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
                className={`flex items-center gap-2 px-6 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeTab === tab.id
                    ? "bg-blue-600 text-white"
                    : "text-gray-300 hover:bg-gray-700"
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* CONTENT */}
        {activeTab === "updates" && (
          <div className="grid grid-cols-1 gap-6">
            {news.map((article, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Tag className="w-3 h-3 text-blue-400" />
                  <span className="text-xs text-blue-400 uppercase">
                    {article.category}
                  </span>
                  <span className="text-gray-400 text-sm flex items-center gap-1">
                    <Calendar size={14} /> {article.date}
                  </span>
                </div>
                <h3 className="text-xl text-white font-semibold mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-300 mb-4">
                  {article.description}
                </p>
                <Link
                  href="#"
                  className="text-blue-400 hover:text-blue-300 inline-flex items-center gap-1"
                >
                  {t("news.readMore")} <ChevronRight size={16} />
                </Link>
              </div>
            ))}
          </div>
        )}

        {activeTab === "press" && (
          <div className="grid grid-cols-1 gap-6">
            {pressReleases.map((item, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl text-white mb-2">{item.title}</h3>
                <p className="text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
        )}

        {activeTab === "media" && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {mediaGallery.map((item, index) => (
              <div key={index} className="rounded-lg overflow-hidden">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
