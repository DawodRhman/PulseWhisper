"use client";
import { useEffect, useMemo, useState } from "react";
import { Filter, Loader2, RefreshCcw, ShieldQuestion, Shield } from "lucide-react";
import { useAdminAuditLog, getDefaultAuditFilters } from "@/hooks/useAdminAuditLog";

const MODULE_LABELS = {
  AUTH: "Authentication",
  ADMIN_DASHBOARD: "Dashboard",
  SERVICES: "Services",
  TENDERS: "Tenders",
  CAREERS: "Careers",
  NEWS: "News",
  MEDIA: "Media",
  LEADERSHIP: "Leadership",
  FAQ: "FAQ",
  PORTFOLIO: "Projects",
  WATER_TODAY: "Water Today",
  EDUCATION: "Education",
  SUBSCRIPTIONS: "Subscriptions",
  SETTINGS: "Settings",
};

function formatTimestamp(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return `${date.toLocaleDateString("en-GB")} ${date.toLocaleTimeString("en-GB")}`;
}

function formatRelative(timestamp) {
  if (!timestamp) return "Never";
  const delta = Date.now() - timestamp;
  if (delta < 1000) return "Just now";
  if (delta < 60_000) return `${Math.round(delta / 1000)}s ago`;
  const minutes = Math.round(delta / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  return `${hours}h ago`;
}

function truncate(value, size = 48) {
  if (!value) return "";
  return value.length > size ? `${value.slice(0, size)}...` : value;
}

export default function AuditPanel() {
  const { logs, modules, filters, setFilters, loading, error, lastFetchedAt, hasMore, refresh, loadMore } = useAdminAuditLog();
  const [formFilters, setFormFilters] = useState(() => getDefaultAuditFilters());

  useEffect(() => {
    setFormFilters(filters);
  }, [filters]);

  const moduleOptions = useMemo(() => [{ value: "", label: "All modules" }, ...modules.map((value) => ({ value, label: MODULE_LABELS[value] || value }))], [modules]);

  function handleApplyFilters(event) {
    event.preventDefault();
    setFilters({ ...formFilters });
  }

  function handleClearFilters() {
    const defaults = getDefaultAuditFilters();
    setFormFilters(defaults);
    setFilters(defaults);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Last sync: {formatRelative(lastFetchedAt)}
        </div>
        <button
          type="button"
          onClick={refresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          {error.message || "Failed to load audit logs"}
        </div>
      )}

      <form onSubmit={handleApplyFilters} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-900 mb-4">
          <Filter size={16} /> Filter Logs
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Module</span>
            <select
              value={formFilters.module}
              onChange={(event) => setFormFilters((prev) => ({ ...prev, module: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            >
              {moduleOptions.map((option) => (
                <option key={option.value || "ALL"} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">Actor ID or Email</span>
            <input
              type="text"
              value={formFilters.actor}
              onChange={(event) => setFormFilters((prev) => ({ ...prev, actor: event.target.value }))}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              placeholder="Search by user..."
            />
          </label>
          <div className="flex items-end gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              disabled={loading}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
           <h3 className="text-lg font-semibold text-slate-900">Audit Trail</h3>
           <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
             {logs.length} Events
           </span>
        </div>

        {loading ? (
          <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
            <div className="flex items-center gap-2 text-slate-400">
              <Loader2 className="h-5 w-5 animate-spin" /> Loading logs...
            </div>
          </div>
        ) : null}

        {!loading && !logs.length ? (
          <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
            No audit events match the current filters.
          </div>
        ) : null}

        <div className="space-y-4">
          {logs.map((entry) => (
            <article key={entry.id} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition hover:shadow-md">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                      {MODULE_LABELS[entry.module] || entry.module}
                    </span>
                    <h4 className="font-semibold text-slate-900">{entry.action}</h4>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <span>{formatTimestamp(entry.createdAt)}</span>
                    <span>Record: {entry.recordId || "N/A"}</span>
                    <span>IP: {entry.ipAddress || "--"}</span>
                  </div>

                  {entry.actor ? (
                    <p className="text-xs text-slate-600">
                      <span className="font-medium text-slate-900">Actor:</span> {entry.actor.name || entry.actor.email} <span className="text-slate-400">({entry.actor.email})</span>
                    </p>
                  ) : (
                    <p className="text-xs text-slate-500 inline-flex items-center gap-1">
                      <ShieldQuestion size={12} /> System generated
                    </p>
                  )}
                </div>
                
                <div className="hidden sm:block">
                   <Shield size={16} className="text-slate-300" />
                </div>
              </div>
              
              {entry.diff ? (
                <details className="mt-3 rounded-lg border border-slate-100 bg-slate-50 p-3">
                  <summary className="cursor-pointer text-xs font-semibold text-slate-600 hover:text-blue-600">View Changes</summary>
                  <pre className="mt-2 overflow-auto rounded bg-white border border-slate-200 p-3 text-[11px] text-slate-600 font-mono">
                    {JSON.stringify(entry.diff, null, 2)}
                  </pre>
                </details>
              ) : null}
              
              {entry.userAgent ? (
                <p className="mt-2 text-[10px] text-slate-400 truncate max-w-2xl" title={entry.userAgent}>
                  UA: {entry.userAgent}
                </p>
              ) : null}
            </article>
          ))}
        </div>

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-semibold text-slate-600 shadow-sm hover:bg-slate-50 hover:text-slate-900 disabled:opacity-50"
          >
            Load Older Events
          </button>
        ) : null}
      </section>
    </div>
  );
}
