"use client";

import { useState, useMemo } from "react";
import { useAdminMediaLibrary } from "@/hooks/useAdminMediaLibrary";
import { Video, Upload, Loader2, X } from "lucide-react";

function isVideo(asset) {
  return asset.mimeType?.startsWith("video/") || asset.url?.match(/\.(mp4|webm|ogg)$/i);
}

export default function MediaPicker({ label, value, initialUrl, onChange, category, disabled, accept }) {
  const { assets, uploadAsset, actionState } = useAdminMediaLibrary();
  const [mode, setMode] = useState("select"); // "select" | "upload"
  const [uploadFile, setUploadFile] = useState(null);
  const [uploadLabel, setUploadLabel] = useState("");

  // Filter assets by category if provided
  const filteredAssets = useMemo(() => {
    if (!category) return assets;
    return assets.filter((a) => a.category === category);
  }, [assets, category]);

  const selectedAsset = assets.find((a) => a.id === value);
  const displayUrl = selectedAsset?.url || (value ? initialUrl : null);
  const displayLabel = selectedAsset?.label || (value ? "Existing Media" : "");
  const displayMime = selectedAsset?.mimeType || "image/unknown";

  const isVideoContent = selectedAsset ? isVideo(selectedAsset) : displayUrl?.match(/\.(mp4|webm|ogg)$/i);

  async function handleUpload(e) {
    e.preventDefault();
    if (!uploadFile) return;

    try {
      const record = await uploadAsset({
        file: uploadFile,
        label: uploadLabel || uploadFile.name,
        category: category || "general",
      });

      if (record) {
        onChange(record.id, record);
        setMode("select");
        setUploadFile(null);
        setUploadLabel("");
      }
    } catch (err) {
      console.error("Upload failed", err);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-semibold text-slate-500">{label}</label>
        <div className="flex rounded-lg bg-slate-100 p-0.5">
          <button
            type="button"
            onClick={() => setMode("select")}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition ${mode === "select" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Select
          </button>
          <button
            type="button"
            onClick={() => setMode("upload")}
            className={`px-2 py-1 text-[10px] font-medium rounded-md transition ${mode === "upload" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
          >
            Upload
          </button>
        </div>
      </div>

      {mode === "select" ? (
        <div className="space-y-2">
          <select
            value={value || ""}
            onChange={(e) => {
              const asset = assets.find((a) => a.id === e.target.value);
              onChange(e.target.value, asset);
            }}
            disabled={disabled}
            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Select {category ? category : "an"} asset...</option>
            {filteredAssets.map((asset) => (
              <option key={asset.id} value={asset.id}>
                {asset.label || asset.url}
              </option>
            ))}
            {!selectedAsset && value && initialUrl && (
              <option value={value} disabled>
                (Preserved) Existing Asset
              </option>
            )}
          </select>

          {displayUrl && (
            <div className="relative overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
              <div className="aspect-video w-full bg-slate-200">
                {isVideoContent ? (
                  <video src={displayUrl} className="h-full w-full object-cover" controls />
                ) : (
                  <img src={displayUrl} alt="" className="h-full w-full object-cover" />
                )}
              </div>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-3">
                <p className="truncate text-xs font-medium text-white">{displayLabel}</p>
                <p className="truncate text-[10px] text-slate-300">{displayMime}</p>
              </div>
              <button
                type="button"
                onClick={() => onChange("", null)}
                className="absolute top-2 right-2 rounded-full bg-black/50 p-1 text-white hover:bg-black/70"
              >
                <X size={14} />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-3 space-y-3">
          <div>
            <label className="block text-[10px] font-medium text-slate-500 mb-1">File</label>
            <input
              type="file"
              accept={accept || "image/*,video/*"}
              onChange={(e) => setUploadFile(e.target.files[0])}
              disabled={disabled || actionState.pending}
              className="w-full text-xs text-slate-500 file:mr-2 file:rounded-full file:border-0 file:bg-slate-200 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-300"
            />
          </div>

          {uploadFile && (
            <div>
              <label className="block text-[10px] font-medium text-slate-500 mb-1">Label (Optional)</label>
              <input
                type="text"
                value={uploadLabel}
                onChange={(e) => setUploadLabel(e.target.value)}
                placeholder={uploadFile.name}
                disabled={disabled || actionState.pending}
                className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-xs outline-none focus:border-blue-500"
              />
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!uploadFile || disabled || actionState.pending}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 py-2 text-xs font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
          >
            {actionState.pending ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
            Upload & Select
          </button>

          {actionState.error && (
            <p className="text-[10px] text-rose-500">{actionState.error.message || "Upload failed"}</p>
          )}
        </div>
      )}
    </div>
  );
}
