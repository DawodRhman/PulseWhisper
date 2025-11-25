"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/admin/media";
const EMPTY = { assets: [] };

function parseErrorPayload(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload?.details?.formErrors?.length) {
    return payload.details.formErrors.join(" ");
  }
  if (payload?.error) return payload.error;
  return fallback;
}

export function useAdminMediaLibrary() {
  const [data, setData] = useState(EMPTY);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [actionState, setActionState] = useState({ pending: false, error: null, message: null });

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTE, { credentials: "include" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseErrorPayload(payload, "Failed to load media assets"));
      }
      setData(payload?.data || EMPTY);
      setLastFetchedAt(Date.now());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let canceled = false;
    (async () => {
      if (canceled) return;
      await fetchData();
    })();
    return () => {
      canceled = true;
    };
  }, [fetchData]);

  const submitJson = useCallback(async (method, type, payload) => {
    setActionState({ pending: true, error: null, message: null });
    try {
      const response = await fetch(API_ROUTE, {
        method,
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type, payload }),
      });
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseErrorPayload(json, "Unable to process request"));
      }
      setData(json?.data || EMPTY);
      setLastFetchedAt(Date.now());
      setActionState({ pending: false, error: null, message: `${type} ${method} succeeded` });
      return json?.record || null;
    } catch (err) {
      setActionState({ pending: false, error: err, message: null });
      throw err;
    }
  }, []);

  const uploadAsset = useCallback(async ({ file, label, category, altText }) => {
    if (!(file instanceof File)) {
      throw new Error("Select a valid file before uploading");
    }
    setActionState({ pending: true, error: null, message: null });
    try {
      const formData = new FormData();
      formData.append("file", file);
      if (label) formData.append("label", label);
      if (category) formData.append("category", category);
      if (altText) formData.append("altText", altText);
      const response = await fetch(API_ROUTE, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const json = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseErrorPayload(json, "Upload failed"));
      }
      setData(json?.data || EMPTY);
      setLastFetchedAt(Date.now());
      setActionState({ pending: false, error: null, message: "Upload succeeded" });
      return json?.record || null;
    } catch (err) {
      setActionState({ pending: false, error: err, message: null });
      throw err;
    }
  }, []);

  const createExternalAsset = useCallback(
    (payload) => submitJson("POST", "external", payload),
    [submitJson]
  );
  const updateMetadata = useCallback(
    (payload) => submitJson("PATCH", "metadata", payload),
    [submitJson]
  );
  const deleteAsset = useCallback(
    (payload) => submitJson("DELETE", "asset", payload),
    [submitJson]
  );

  return {
    assets: data.assets,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh: fetchData,
    uploadAsset,
    createExternalAsset,
    updateMetadata,
    deleteAsset,
  };
}
