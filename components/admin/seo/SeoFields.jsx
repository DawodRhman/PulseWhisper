"use client";

const DEFAULT_SEO_STATE = {
  title: "",
  description: "",
  canonicalUrl: "",
  keywords: "",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  twitterCard: "summary_large_image",
  allowIndexing: true,
};

function normalizeState(value) {
  return { ...DEFAULT_SEO_STATE, ...(value || {}) };
}

function noop() {}

export function createEmptySeoState() {
  return { ...DEFAULT_SEO_STATE };
}

export function serializeSeoState(state) {
  if (!state) return undefined;
  const coerce = (value) => {
    if (value === undefined) return undefined;
    if (value === null) return null;
    if (typeof value === "string") {
      const trimmed = value.trim();
      return trimmed === "" ? null : trimmed;
    }
    return value;
  };

  const fields = [
    "title",
    "description",
    "canonicalUrl",
    "keywords",
    "ogTitle",
    "ogDescription",
    "ogImageUrl",
    "twitterCard",
  ];

  const payload = {};
  for (const field of fields) {
    const result = coerce(state[field]);
    if (result !== undefined) {
      payload[field] = result;
    }
  }

  if (typeof state.allowIndexing === "boolean") {
    payload.allowIndexing = state.allowIndexing;
  }

  return Object.keys(payload).length ? payload : undefined;
}

export default function SeoFields({ value, onChange = noop, disabled = false, title = "SEO Metadata" }) {
  const seo = normalizeState(value);

  const update = (field, nextValue) => {
    const valueToApply = typeof nextValue === "function" ? nextValue(seo[field]) : nextValue;
    onChange({ ...seo, [field]: valueToApply });
  };

  return (
    <fieldset className="space-y-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <legend className="text-xs font-bold text-slate-500 uppercase tracking-wider px-1">{title}</legend>
      
      <div className="space-y-3">
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Meta Title</span>
          <input
            type="text"
            value={seo.title}
            onChange={(event) => update("title", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            placeholder="Appears in browser tabs/search results"
          />
        </label>
        
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Meta Description</span>
          <textarea
            rows={2}
            value={seo.description}
            onChange={(event) => update("description", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            placeholder="One or two sentences summarizing the content"
          />
        </label>
        
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Canonical URL</span>
          <input
            type="url"
            value={seo.canonicalUrl}
            onChange={(event) => update("canonicalUrl", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            placeholder="https://example.com/page"
          />
        </label>
        
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Keywords (comma separated)</span>
          <input
            type="text"
            value={seo.keywords}
            onChange={(event) => update("keywords", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
          />
        </label>
        
        <div className="grid gap-3 md:grid-cols-2">
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">OG Title</span>
            <input
              type="text"
              value={seo.ogTitle}
              onChange={(event) => update("ogTitle", event.target.value)}
              disabled={disabled}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            />
          </label>
          <label className="block">
            <span className="text-xs font-semibold text-slate-500">OG Description</span>
            <input
              type="text"
              value={seo.ogDescription}
              onChange={(event) => update("ogDescription", event.target.value)}
              disabled={disabled}
              className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            />
          </label>
        </div>
        
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">OG Image URL</span>
          <input
            type="url"
            value={seo.ogImageUrl}
            onChange={(event) => update("ogImageUrl", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            placeholder="1200x630 recommended"
          />
        </label>
        
        <label className="block">
          <span className="text-xs font-semibold text-slate-500">Twitter Card Type</span>
          <input
            type="text"
            value={seo.twitterCard}
            onChange={(event) => update("twitterCard", event.target.value)}
            disabled={disabled}
            className="mt-1.5 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
            placeholder="summary_large_image"
          />
        </label>
        
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={seo.allowIndexing}
            onChange={(event) => update("allowIndexing", event.target.checked)}
            disabled={disabled}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Allow search engines to index this page
        </label>
      </div>
    </fieldset>
  );
}
