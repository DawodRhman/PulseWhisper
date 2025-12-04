"use client";
import { useEffect, useMemo, useState } from "react";

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

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch("/api/services", {
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
  }, []);

  const cards = useMemo(() => {
    const hydratedCards = (data?.categories || []).flatMap((category) => category.cards || []);
    if (hydratedCards.length) {
      return hydratedCards;
    }

    return SERVICE_CARD_FALLBACKS;
  }, [data]);

  return {
    data,
    cards,
    loading,
    error,
    stale,
    hasLiveData: Boolean((data?.categories || []).length),
  };
}
