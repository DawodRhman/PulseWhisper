"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/papa/leadership";
const EMPTY_PAYLOAD = { members: [] };

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

export function useAdminLeadership() {
  const [data, setData] = useState(EMPTY_PAYLOAD);
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
        throw new Error(parseErrorPayload(payload, "Failed to load leadership"));
      }
      setData(payload?.data || EMPTY_PAYLOAD);
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
      await fetchData();
    })();
    return () => {
      aborted = true;
    };
  }, [fetchData]);

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
      setData(json?.data || EMPTY_PAYLOAD);
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
    members: data.members,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh: fetchData,
    createEntity,
    updateEntity,
    deleteEntity,
  };
}
