"use client";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

export function useRtiData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { language } = useLanguageStore();

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/rti?lang=${language}`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Failed to load RTI data");
        }

        const payload = await response.json();
        if (!isMounted) return;

        setData(payload?.data || { documents: [] });
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

  return {
    data,
    loading,
    error,
  };
}
