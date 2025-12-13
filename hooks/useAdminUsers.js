"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/papa/users";
const EMPTY = { users: [] };

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

export function useAdminUsers() {
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
        throw new Error(parseErrorPayload(payload, "Failed to load operators"));
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
        throw new Error(parseErrorPayload(json, "Request failed"));
      }
      setData(json?.data || EMPTY);
      setLastFetchedAt(Date.now());
      setActionState({ pending: false, error: null, message: `${type} ${method} succeeded` });
      return json;
    } catch (err) {
      setActionState({ pending: false, error: err, message: null });
      throw err;
    }
  }, []);

  const createUser = useCallback((payload) => submitAction("POST", "user", payload), [submitAction]);
  const updateRoles = useCallback((payload) => submitAction("PATCH", "roles", payload), [submitAction]);
  const updateStatus = useCallback((payload) => submitAction("PATCH", "status", payload), [submitAction]);
  const resetPassword = useCallback((payload) => submitAction("PATCH", "password", payload), [submitAction]);

  return {
    users: data.users,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh: fetchData,
    createUser,
    updateRoles,
    updateStatus,
    resetPassword,
  };
}
