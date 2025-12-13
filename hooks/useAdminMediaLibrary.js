"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/papa/media";
const EMPTY = { assets: [], albums: [] };

function parseErrorPayload(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  const parts = [];
  if (payload?.details?.formErrors?.length) {
    parts.push(payload.details.formErrors.join(" "));
  }
  if (payload?.details?.fieldErrors) {
    for (const [field, errors] of Object.entries(payload.details.fieldErrors)) {
      if (errors && errors.length) {
        parts.push(`${field}: ${errors.join(", ")}`);
      }
    }
  }
  if (parts.length > 0) return parts.join("; ");
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

  // Album methods
  const createAlbum = useCallback(
    (payload) => submitJson("POST", "album", payload),
    [submitJson]
  );
  const updateAlbum = useCallback(
    (payload) => submitJson("PATCH", "album", payload),
    [submitJson]
  );
  const deleteAlbum = useCallback(
    (payload) => submitJson("DELETE", "album", payload),
    [submitJson]
  );
  const addAlbumItem = useCallback(
    (payload) => submitJson("POST", "albumItem", payload),
    [submitJson]
  );
  const removeAlbumItem = useCallback(
    (payload) => submitJson("DELETE", "albumItem", payload),
    [submitJson]
  );

  return {
    assets: data.assets || [],
    albums: data.albums || [],
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh: fetchData,
    uploadAsset,
    createExternalAsset,
    updateMetadata,
    deleteAsset,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addAlbumItem,
    removeAlbumItem,
  };
}
