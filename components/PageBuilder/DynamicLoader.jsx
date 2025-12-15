"use client";
import React, { useEffect, useState } from "react";

function interpolate(template, data) {
  return template.replace(/\{\{([\w\.]+)\}\}/g, (match, key) => {
    const keys = key.split(".");
    let value = data;
    for (const k of keys) {
      value = value?.[k];
    }
    return value !== undefined && value !== null ? value : "";
  });
}

export default function DynamicLoader({ apiEndpoint, template, containerClass = "", itemClass = "" }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiEndpoint) {
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(apiEndpoint);
        if (!res.ok) throw new Error(`Failed to fetch ${apiEndpoint}`);
        const json = await res.json();
        // Support both array responses and { data: [...] } responses
        setData(Array.isArray(json) ? json : json.data || json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [apiEndpoint]);

  if (loading) return <div className="p-8 text-center text-gray-500">Loading dynamic content...</div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading content: {error}</div>;
  if (!data) return null;

  const items = Array.isArray(data) ? data : [data];

  return (
    <div className={containerClass}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          className={itemClass}
          dangerouslySetInnerHTML={{ __html: interpolate(template, item) }}
        />
      ))}
    </div>
  );
}
