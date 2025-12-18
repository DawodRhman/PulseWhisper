"use client";
import { useEffect, useMemo, useState } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

export const SERVICE_CARD_FALLBACKS = [
  {
    id: "fallback-water",
    title: "Water Supply Services",
    summary: "Reliable clean water distribution across Karachi.",
    description: "Bulk abstraction, treatment, and distribution for every town.",
    iconKey: "FaTint",
    gradientClass: "from-blue-100 to-blue-300",
    details: [
      {
        heading: "Water Supply Services",
        body: "Multi-source abstraction supported by treatment and monitoring.",
        bulletPoints: [
          "Hub Dam and Keenjhar sourcing",
          "Desalination pilots",
          "Citywide quality labs",
        ],
      },
    ],
  },
  {
    id: "fallback-sewerage",
    title: "Sewerage Management",
    summary: "Efficient wastewater collection and treatment systems.",
    description: "Network operations, pumping stations, and treatment complexes.",
    iconKey: "FaWater",
    gradientClass: "from-cyan-100 to-blue-200",
    details: [
      {
        heading: "Sewerage Infrastructure",
        body: "Coverage for residential, commercial, and industrial corridors.",
        bulletPoints: [
          "Primary and secondary treatment",
          "Environmental compliance",
          "24/7 maintenance crews",
        ],
      },
    ],
  },
  {
    id: "fallback-maintenance",
    title: "Infrastructure Maintenance",
    summary: "Regular maintenance and upgrade of water infrastructure.",
    description: "Preventive and corrective programs for mains, valves, and plants.",
    iconKey: "FaTools",
    gradientClass: "from-indigo-100 to-purple-200",
    details: [
      {
        heading: "Maintenance Programs",
        body: "Asset upgrades prioritized by criticality and citizen impact.",
        bulletPoints: [
          "Pipe rehab works",
          "Asset digitization",
          "Emergency repair teams",
        ],
      },
    ],
  },
];

const FALLBACK_DATA = {
  hero: {
    title: "Our Services",
    subtitle:
      "Comprehensive water and sewerage services ensuring clean water supply and efficient wastewater management for Karachi.",
    backgroundImage: "/teentalwarkarachi.gif",
  },
  categories: [],
};

export function useServicesData() {
  const [data, setData] = useState(FALLBACK_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stale, setStale] = useState(false);
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/services?lang=${language}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load services data");
        }

        const payload = await response.json();
        if (!isMounted) return;

        setData(payload?.data || FALLBACK_DATA);
        setStale(Boolean(payload?.meta?.stale));
        setError(null);
      } catch (err) {
        if (!isMounted) return;
        setError(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [language]);

  const cards = useMemo(() => {
    const hydratedCards = (data?.categories || []).flatMap((category) => category.cards || []);
    if (hydratedCards.length) {
      return hydratedCards;
    }

    // Import the function dynamically to avoid circular dependency
    const getServiceCardFallbacks = (lang) => {
      const translations = {
        en: {
          water: {
            title: "Water Supply Services",
            summary: "Reliable clean water distribution across Karachi.",
            description: "Bulk abstraction, treatment, and distribution for every town.",
            heading: "Water Supply Services",
            body: "Multi-source abstraction supported by treatment and monitoring.",
            bulletPoints: ["Hub Dam and Keenjhar sourcing", "Desalination pilots", "Citywide quality labs"],
          },
          sewerage: {
            title: "Sewerage Management",
            summary: "Efficient wastewater collection and treatment systems.",
            description: "Network operations, pumping stations, and treatment complexes.",
            heading: "Sewerage Infrastructure",
            body: "Coverage for residential, commercial, and industrial corridors.",
            bulletPoints: ["Primary and secondary treatment", "Environmental compliance", "24/7 maintenance crews"],
          },
          maintenance: {
            title: "Infrastructure Maintenance",
            summary: "Regular maintenance and upgrade of water infrastructure.",
            description: "Preventive and corrective programs for mains, valves, and plants.",
            heading: "Maintenance Programs",
            body: "Comprehensive upkeep of water and sewerage infrastructure.",
            bulletPoints: ["Preventive maintenance schedules", "Emergency repair services", "Infrastructure upgrades"],
          },
        },
        ur: {
          water: {
            title: "پانی کی فراہمی کی خدمات",
            summary: "کراچی میں قابل اعتماد صاف پانی کی تقسیم۔",
            description: "ہر شہر کے لیے بلک ایبسٹریکشن، ٹریٹمنٹ اور تقسیم۔",
            heading: "پانی کی فراہمی کی خدمات",
            body: "ٹریٹمنٹ اور مانیٹرنگ کی حمایت سے ملٹی سورس ایبسٹریکشن۔",
            bulletPoints: ["ہب ڈیم اور کینجھر سورسنگ", "ڈیسیلینیشن پائلٹس", "شہر بھر کے کوالٹی لیبز"],
          },
          sewerage: {
            title: "سیوریج مینجمنٹ",
            summary: "موثر فضلہ پانی کی جمع آوری اور ٹریٹمنٹ سسٹم۔",
            description: "نیٹ ورک آپریشنز، پمپنگ اسٹیشنز اور ٹریٹمنٹ کمپلیکسز۔",
            heading: "سیوریج انفراسٹرکچر",
            body: "رہائشی، تجارتی اور صنعتی راہداریوں کا احاطہ۔",
            bulletPoints: ["پرائمری اور سیکنڈری ٹریٹمنٹ", "ماحولیاتی تعمیل", "24/7 مینٹیننس کریوز"],
          },
          maintenance: {
            title: "انفراسٹرکچر کی دیکھ بھال",
            summary: "پانی کی انفراسٹرکچر کی باقاعدہ دیکھ بھال اور اپ گریڈ۔",
            description: "مینز، والوز اور پلانٹس کے لیے پرونٹیو اور کریکٹیو پروگرامز۔",
            heading: "دیکھ بھال کے پروگرامز",
            body: "پانی اور سیوریج انفراسٹرکچر کی جامع دیکھ بھال۔",
            bulletPoints: ["پرونٹیو مینٹیننس شیڈولز", "ہنگامی مرمت کی خدمات", "انفراسٹرکچر اپ گریڈز"],
          },
        },
      };

      const langData = translations[lang] || translations.en;
      return [
        {
          id: "fallback-water",
          title: langData.water.title,
          summary: langData.water.summary,
          description: langData.water.description,
          iconKey: "FaTint",
          gradientClass: "from-blue-100 to-blue-300",
          details: [{ heading: langData.water.heading, body: langData.water.body, bulletPoints: langData.water.bulletPoints }],
        },
        {
          id: "fallback-sewerage",
          title: langData.sewerage.title,
          summary: langData.sewerage.summary,
          description: langData.sewerage.description,
          iconKey: "FaWater",
          gradientClass: "from-cyan-100 to-blue-200",
          details: [{ heading: langData.sewerage.heading, body: langData.sewerage.body, bulletPoints: langData.sewerage.bulletPoints }],
        },
        {
          id: "fallback-maintenance",
          title: langData.maintenance.title,
          summary: langData.maintenance.summary,
          description: langData.maintenance.description,
          iconKey: "FaTools",
          gradientClass: "from-indigo-100 to-purple-200",
          details: [{ heading: langData.maintenance.heading, body: langData.maintenance.body, bulletPoints: langData.maintenance.bulletPoints }],
        },
      ];
    };

    return getServiceCardFallbacks(language);
  }, [data, language]);

  return {
    data,
    cards,
    loading,
    error,
    stale,
    hasLiveData: Boolean((data?.categories || []).length),
  };
}
