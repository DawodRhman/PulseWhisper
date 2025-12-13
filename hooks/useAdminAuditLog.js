"use client";
import { useCallback, useEffect, useState } from "react";

const API_ROUTE = "/api/papa/audit";

const createDefaultFilters = () => ({ module: "", actor: "" });

export function getDefaultAuditFilters() {
  return createDefaultFilters();
}

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

export function useAdminAuditLog() {
  const [filters, setFilters] = useState(() => createDefaultFilters());
  const [logs, setLogs] = useState([]);
  const [modules, setModules] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchedAt, setLastFetchedAt] = useState(null);

  const fetchPage = useCallback(
    async ({ cursor = null, reset = false } = {}) => {
      if (reset) {
        setLogs([]);
        setNextCursor(null);
      }
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (filters.module) params.set("module", filters.module);
        const actorValue = filters.actor?.trim();
        if (actorValue) params.set("actor", actorValue);
        if (cursor) params.set("cursor", cursor);
        params.set("limit", "25");
        const query = params.toString();
        const response = await fetch(query ? `${API_ROUTE}?${query}` : API_ROUTE, {
          credentials: "include",
        });
        const payload = await response.json().catch(() => null);
        if (!response.ok) {
          throw new Error(parseErrorPayload(payload, "Unable to load audit logs"));
        }
        const entries = payload?.data?.logs || [];
        setModules(payload?.data?.modules || []);
        setLogs((prev) => (reset || !prev.length || !cursor ? entries : [...prev, ...entries]));
        setNextCursor(payload?.data?.nextCursor || null);
        setLastFetchedAt(Date.now());
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [filters]
  );

  useEffect(() => {
    fetchPage({ reset: true });
  }, [fetchPage]);

  const refresh = useCallback(() => fetchPage({ reset: true }), [fetchPage]);
  const loadMore = useCallback(() => {
    if (!nextCursor) return Promise.resolve();
    return fetchPage({ cursor: nextCursor, reset: false });
  }, [fetchPage, nextCursor]);

  return {
    logs,
    modules,
    filters,
    setFilters,
    loading,
    error,
    lastFetchedAt,
    hasMore: Boolean(nextCursor),
    refresh,
    loadMore,
  };
}
