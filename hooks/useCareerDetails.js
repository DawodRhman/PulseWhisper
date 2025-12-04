import { useState, useEffect } from "react";

export function useCareerDetails(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) return;

    async function fetchData() {
      try {
        setLoading(true);
        const response = await fetch(`/api/careers/${slug}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error("Job not found");
          }
          throw new Error("Failed to fetch job details");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        console.error("Error fetching career details:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  return { data, loading, error };
}
