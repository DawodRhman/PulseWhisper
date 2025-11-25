"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/admin/services";

function parseErrorPayload(payload, fallback) {
  if (!payload) return fallback;
  if (typeof payload === "string") return payload;
  if (payload?.details?.formErrors?.length) {
    return payload.details.formErrors.join(" ");
  }
  if (payload?.error) return payload.error;
  return fallback;
}

export function useAdminServices() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);
  const [actionState, setActionState] = useState({ pending: false, error: null, message: null });

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_ROUTE, { credentials: "include" });
      const payload = await response.json().catch(() => null);
      if (!response.ok) {
        throw new Error(parseErrorPayload(payload, "Failed to load services"));
      }
      setCategories(payload?.data || []);
      setLastFetchedAt(Date.now());
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let aborted = false;
    (async () => {
      if (aborted) return;
      await fetchCategories();
    })();
    return () => {
      aborted = true;
    };
  }, [fetchCategories]);

  const submitAction = useCallback(async (method, type, payload) => {
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
        throw new Error(parseErrorPayload(json, "Failed to process request"));
      }
      setCategories(json?.data || []);
      setLastFetchedAt(Date.now());
      setActionState({ pending: false, error: null, message: `${type} ${method} succeeded` });
      return json?.record || null;
    } catch (err) {
      setActionState({ pending: false, error: err, message: null });
      throw err;
    }
  }, []);

  const createEntity = useCallback((type, payload) => submitAction("POST", type, payload), [submitAction]);
  const updateEntity = useCallback((type, payload) => submitAction("PATCH", type, payload), [submitAction]);
  const deleteEntity = useCallback((type, payload) => submitAction("DELETE", type, payload), [submitAction]);

  return {
    categories,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh: fetchCategories,
    createEntity,
    updateEntity,
    deleteEntity,
  };
}
