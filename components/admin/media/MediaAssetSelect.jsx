"use client";
import { useMemo } from "react";
import { Image as ImageIcon, Loader2, RefreshCcw } from "lucide-react";
import { useAdminMediaLibrary } from "@/hooks/useAdminMediaLibrary";

const EMPTY_ARRAY = [];

function formatDimensions(asset) {
  if (!asset) return "";
  if (asset.width && asset.height) {
    return `${asset.width}×${asset.height}px`;
  }
  return asset.fileSize ? `${formatBytes(asset.fileSize)}` : "";
}

function formatBytes(bytes) {
  if (!bytes) return null;
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

export default function MediaAssetSelect({
  label = "Media asset",
  placeholder = "Select asset",
  helperText,
  categoryFilter,
  value,
  onChange,
  disabled,
}) {
  const { assets, loading, error, refresh } = useAdminMediaLibrary();

  const filters = useMemo(() => {
    if (!categoryFilter) return null;
    return Array.isArray(categoryFilter) ? categoryFilter.filter(Boolean) : [categoryFilter];
  }, [categoryFilter]);

  const filteredAssets = useMemo(() => {
    if (!filters || !filters.length) return assets;
    return assets.filter((asset) => filters.includes(asset.category));
  }, [assets, filters]);

  const selectedAsset = useMemo(() => assets.find((asset) => asset.id === value) || null, [assets, value]);

  function handleChange(event) {
    const nextId = event.target.value;
    const asset = assets.find((entry) => entry.id === nextId) || null;
    if (typeof onChange === "function") {
      onChange(nextId || null, asset);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
        <span>{label}</span>
        <button
          type="button"
          onClick={refresh}
          disabled={loading || disabled}
          className="inline-flex items-center gap-1 rounded-full border border-slate-800 px-2 py-0.5 text-[10px] uppercase tracking-[0.3em] text-slate-300 hover:bg-slate-900 disabled:opacity-50"
        >
          <RefreshCcw size={10} /> Sync
        </button>
      </div>
      <select
        value={value || ""}
        onChange={handleChange}
        disabled={disabled || (!filteredAssets.length && !value)}
        className="mt-1 w-full rounded-lg border border-slate-800 bg-slate-950 px-3 py-2 text-sm text-slate-100"
      >
        <option value="">{placeholder}</option>
        {filteredAssets.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.label || asset.url} {asset.category ? `(${asset.category})` : ""}
          </option>
        ))}
        {!filteredAssets.length && value ? (
          <option value={value}>Current selection</option>
        ) : null}
      </select>
      {helperText ? <p className="mt-1 text-[11px] text-slate-500">{helperText}</p> : null}
      {error ? <p className="mt-1 text-[11px] text-rose-400">{error.message}</p> : null}
      <div className="mt-2 rounded-xl border border-slate-800/70 bg-slate-950/50 p-3 text-xs text-slate-400">
        {loading ? (
          <span className="inline-flex items-center gap-2 text-slate-500">
            <Loader2 className="h-3.5 w-3.5 animate-spin" /> Loading assets
          </span>
        ) : selectedAsset ? (
          <div className="space-y-1">
            <p className="text-slate-200">{selectedAsset.label || selectedAsset.url}</p>
            <p className="inline-flex items-center gap-1 text-[11px] text-slate-500">
              <ImageIcon size={12} />
              <span>
                {selectedAsset.category || "uncategorized"}
                {formatDimensions(selectedAsset) ? ` · ${formatDimensions(selectedAsset)}` : ""}
              </span>
            </p>
            <code className="block overflow-hidden text-ellipsis whitespace-nowrap rounded-lg bg-slate-900 px-2 py-1 text-[11px] text-slate-300">
              {selectedAsset.url}
            </code>
          </div>
        ) : (
          <span className="text-[11px] text-slate-500">No asset selected</span>
        )}
      </div>
    </div>
  );
}