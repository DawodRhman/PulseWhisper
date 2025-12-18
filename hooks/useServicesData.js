"use client";
import { useEffect, useState, useMemo } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

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
  // Using the store's language to drive the API query
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        // API now handles 'lang' and returns normalized data
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
        if (err.name !== 'AbortError') {
          setError(err);
        }
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
    // Flatten cards from categories for easy access if needed (preserved from original logic)
    return (data?.categories || []).flatMap((category) => category.cards || []);
  }, [data]);

  return {
    data,
    cards, // Maintained for compatibility if any other component uses it, though Services.jsx iterates categories
    loading,
    error,
    stale,
    hasLiveData: Boolean((data?.categories || []).length),
  };
}
