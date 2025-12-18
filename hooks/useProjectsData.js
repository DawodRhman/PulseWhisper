"use client";
import { useEffect, useState } from "react";
import { useLanguageStore } from "@/lib/stores/languageStore";

export function useProjectsData() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const language = useLanguageStore((state) => state.language);

    useEffect(() => {
        let isMounted = true;
        const controller = new AbortController();

        async function fetchProjects() {
            try {
                setLoading(true);
                const response = await fetch(`/api/projects?lang=${language}`, {
                    signal: controller.signal
                });

                if (response.ok) {
                    const data = await response.json();
                    if (isMounted) {
                        setProjects(data?.projects || []);
                        setError(null);
                    }
                } else {
                    throw new Error('Failed to fetch projects');
                }
            } catch (err) {
                if (isMounted && err.name !== 'AbortError') {
                    console.error("Error fetching projects:", err);
                    setError(err);
                    // Keep previous projects if any, or set empty? 
                    // Depending on UX, maybe keep empty to show error state.
                }
            } finally {
                if (isMounted) setLoading(false);
            }
        }

        fetchProjects();

        return () => {
            isMounted = false;
            controller.abort();
        };
    }, [language]);

    return { projects, loading, error };
}
