"use client";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

export function useTendersData() {
    const [openTenders, setOpenTenders] = useState([]);
    const [closedTenders, setClosedTenders] = useState([]);
    const [cancelledTenders, setCancelledTenders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const language = useLanguageStore((state) => state.language);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function fetchTenders() {
            try {
                setLoading(true);
                const response = await fetch(`/api/tenders?lang=${language}`, {
                    signal: controller.signal
                });

                if (!response.ok) {
                    throw new Error("Failed to fetch tenders");
                }

                const json = await response.json();

                if (isMounted) {
                    const data = json.data || {};
                    setOpenTenders(data.open || []);
                    setClosedTenders(data.closed || []);
                    setCancelledTenders(data.cancelled || []);
                    setError(null);
                }
            } catch (err) {
                if (isMounted && err.name !== 'AbortError') {
                    console.error("Error fetching tenders:", err);
                    setError(err.message);
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchTenders();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [language]);

    return {
        openTenders,
        closedTenders,
        cancelledTenders,
        loading,
        error
    };
}
