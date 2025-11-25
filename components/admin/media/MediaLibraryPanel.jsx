"use client";
import { useMemo, useState } from "react";
import {
  Calendar,
  Copy,
  HardDrive,
  Image as ImageIcon,
  Link2,
  Loader2,
  RefreshCcw,
  Tag,
  Trash2,
  UploadCloud,
  Wand2,
} from "lucide-react";
import { useAdminMediaLibrary } from "@/hooks/useAdminMediaLibrary";

const CATEGORY_COLORS = ["#38bdf8", "#a78bfa", "#f472b6", "#fb7185", "#34d399", "#facc15"];

const createUploadForm = () => ({ file: null, label: "", category: "uploads", altText: "" });
const createExternalForm = () => ({ url: "", label: "", category: "external", altText: "" });
const createMetadataForm = () => ({ id: "", label: "", category: "", altText: "" });

function formatBytes(bytes) {
  if (!bytes) return "--";
  const units = ["B", "KB", "MB", "GB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / Math.pow(1024, index);
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[index]}`;
}

function formatTimestamp(value) {
  if (!value) return "--";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "--";
  return date.toLocaleString("en-GB");
}

export default function MediaLibraryPanel() {
  const {
    assets,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh,
    uploadAsset,
    createExternalAsset,
    updateMetadata,
    deleteAsset,
  } = useAdminMediaLibrary();
  const [uploadForm, setUploadForm] = useState(() => createUploadForm());
  const [externalForm, setExternalForm] = useState(() => createExternalForm());
  const [metadataForm, setMetadataForm] = useState(() => createMetadataForm());
  const [clipboardMessage, setClipboardMessage] = useState(null);

  const categoryStats = useMemo(() => {
    const stats = new Map();
    assets.forEach((asset) => {
      const key = asset.category || "uncategorized";
      stats.set(key, (stats.get(key) || 0) + 1);
    });
    return Array.from(stats.entries());
  }, [assets]);

  function prefillMetadataForm(asset) {
    setMetadataForm({ id: asset.id, label: asset.label || "", category: asset.category || "", altText: asset.altText || "" });
  }

  async function handleUploadSubmit(event) {
    event.preventDefault();
    await uploadAsset(uploadForm);
    setUploadForm(createUploadForm());
  }

  async function handleExternalSubmit(event) {
    event.preventDefault();
    await createExternalAsset({
      url: externalForm.url,
      label: externalForm.label,
      category: externalForm.category,
      altText: externalForm.altText,
    });
    setExternalForm(createExternalForm());
  }

  async function handleMetadataSubmit(event) {
    event.preventDefault();
    if (!metadataForm.id) return;
    await updateMetadata({
      id: metadataForm.id,
      label: metadataForm.label || undefined,
      category: metadataForm.category || undefined,
      altText: metadataForm.altText ?? undefined,
    });
    setMetadataForm(createMetadataForm());
  }

  async function handleDelete(assetId, label) {
    if (!window.confirm(`Delete ${label || "this asset"}? This cannot be undone.`)) return;
    await deleteAsset({ id: assetId });
  }

  async function copyUrl(url) {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}${url}`);
      setClipboardMessage("URL copied to clipboard");
      setTimeout(() => setClipboardMessage(null), 3000);
    } catch (err) {
      setClipboardMessage("Unable to copy URL");
      setTimeout(() => setClipboardMessage(null), 3000);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Last sync: {lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString("en-GB") : "--"}
        </div>
        <div className="flex items-center gap-3">
          {clipboardMessage && (
            <span className="text-xs font-medium text-emerald-600 animate-fade-in">
              {clipboardMessage}
            </span>
          )}
          <button
            type="button"
            onClick={refresh}
            disabled={loading || actionState.pending}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
          >
            <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
            Refresh Data
          </button>
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          {error.message || "Failed to load media assets"}
        </div>
      )}

      {actionState.error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          {actionState.error.message || "Action failed"}
        </div>
      )}

      {actionState.message && (
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-600">
          {actionState.message}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <section className="space-y-6">
          <div className="flex items-center justify-between">
             <h3 className="text-lg font-semibold text-slate-900">Media Catalogue</h3>
             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
               {assets.length} Assets
             </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {categoryStats.map(([category, count], index) => (
              <div
                key={category}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                style={{ borderLeftWidth: '4px', borderLeftColor: CATEGORY_COLORS[index % CATEGORY_COLORS.length] }}
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{category}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{count}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading assets...
              </div>
            </div>
          ) : null}

          {!loading && !assets.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No assets found. Upload files or register external URLs.
            </div>
          ) : null}

          <div className="space-y-4">
            {assets.map((asset) => (
              <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {asset.category || "Uncategorized"}
                        </span>
                        <span className="text-xs text-slate-500 font-mono">
                          {asset.mimeType || "unknown type"}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 break-all">{asset.label || asset.url}</h4>
                      
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <ImageIcon size={12} />
                          {asset.width && asset.height ? `${asset.width}x${asset.height}px` : "Dynamic"}
                        </span>
                        <span className="flex items-center gap-1">
                          <HardDrive size={12} />
                          {formatBytes(asset.fileSize)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          {formatTimestamp(asset.createdAt)}
                        </span>
                      </div>
                      
                      {asset.altText && (
                        <p className="mt-2 text-xs text-slate-400 italic">Alt: {asset.altText}</p>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => copyUrl(asset.url)}
                        className="flex items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100"
                      >
                        <Copy size={14} /> Copy URL
                      </button>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => prefillMetadataForm(asset)}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Edit Metadata"
                        >
                          <Wand2 size={14} className="mx-auto" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(asset.id, asset.label)}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600"
                          title="Delete Asset"
                        >
                          <Trash2 size={14} className="mx-auto" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="Upload File"
              description="Store hero imagery, PDFs, or motion assets"
              icon={<UploadCloud size={16} />}
              onSubmit={handleUploadSubmit}
              disabled={actionState.pending}
            >
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">Choose File</span>
                <input
                  required
                  type="file"
                  onChange={(event) => setUploadForm((prev) => ({ ...prev, file: event.target.files?.[0] || null }))}
                  className="mt-1.5 block w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 hover:file:bg-slate-200"
                />
              </label>
              <Input label="Label" value={uploadForm.label} onChange={(e) => setUploadForm({ ...uploadForm, label: e.target.value })} placeholder="e.g. Control Room Hero" />
              <Input label="Category" value={uploadForm.category} onChange={(e) => setUploadForm({ ...uploadForm, category: e.target.value })} placeholder="uploads" />
              <Input label="Alt Text" value={uploadForm.altText} onChange={(e) => setUploadForm({ ...uploadForm, altText: e.target.value })} placeholder="Descriptive text for accessibility" />
            </ActionForm>

            <ActionForm
              title="Register External"
              description="Reference CDN assets or Google Drive links"
              icon={<Link2 size={16} />}
              onSubmit={handleExternalSubmit}
              disabled={actionState.pending}
            >
              <Input label="URL" type="url" value={externalForm.url} onChange={(e) => setExternalForm({ ...externalForm, url: e.target.value })} required placeholder="https://..." />
              <Input label="Label" value={externalForm.label} onChange={(e) => setExternalForm({ ...externalForm, label: e.target.value })} required />
              <Input label="Category" value={externalForm.category} onChange={(e) => setExternalForm({ ...externalForm, category: e.target.value })} placeholder="external" />
              <Input label="Alt Text" value={externalForm.altText} onChange={(e) => setExternalForm({ ...externalForm, altText: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Edit Metadata"
              description="Update asset details"
              icon={<Tag size={16} />}
              onSubmit={handleMetadataSubmit}
              disabled={actionState.pending || !assets.length}
            >
              <Select label="Select Asset" value={metadataForm.id} onChange={(e) => setMetadataForm({ ...metadataForm, id: e.target.value })} required>
                <option value="" disabled>Select Asset</option>
                {assets.map((a) => <option key={a.id} value={a.id}>{a.label || a.url}</option>)}
              </Select>
              
              <Input label="Label" value={metadataForm.label} onChange={(e) => setMetadataForm({ ...metadataForm, label: e.target.value })} disabled={!metadataForm.id} />
              <Input label="Category" value={metadataForm.category} onChange={(e) => setMetadataForm({ ...metadataForm, category: e.target.value })} disabled={!metadataForm.id} />
              <Input label="Alt Text" value={metadataForm.altText} onChange={(e) => setMetadataForm({ ...metadataForm, altText: e.target.value })} disabled={!metadataForm.id} />
            </ActionForm>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionForm({ title, description, icon, children, onSubmit, disabled }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <div className="flex items-center gap-2 text-slate-900">
          {icon}
          <h4 className="text-sm font-bold">{title}</h4>
        </div>
        <p className="text-xs text-slate-500 mt-1">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      <button
        type="submit"
        disabled={disabled}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        {icon}
        {title.includes("Edit") ? "Save Changes" : "Submit"}
      </button>
    </form>
  );
}

function Input({ label, type = "text", ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <input
        type={type}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
        {...props}
      />
    </label>
  );
}

function Select({ label, children, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <select
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}