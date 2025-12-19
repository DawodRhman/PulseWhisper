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
  Folder,
  Video,
  Plus,
  ArrowLeft,
  Save,
  X
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAdminMediaLibrary } from "@/hooks/useAdminMediaLibrary";
import MediaAssetSelect from "@/components/admin/media/MediaAssetSelect";

const CATEGORY_COLORS = ["#38bdf8", "#a78bfa", "#f472b6", "#fb7185", "#34d399", "#facc15"];

const createUploadForm = () => ({ file: null, label: "", category: "uploads", altText: "" });
const createExternalForm = () => ({ url: "", label: "", category: "external", altText: "" });
const createMetadataForm = () => ({ id: "", label: "", category: "", altText: "" });
const createAlbumForm = () => ({ id: "", title: "", slug: "", description: "" });

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

function isVideo(asset) {
  return asset.mimeType?.startsWith("video/") || asset.url?.match(/\.(mp4|webm|ogg)$/i);
}

export default function MediaLibraryPanel() {
  const {
    assets,
    albums,
    loading,
    error,
    lastFetchedAt,
    actionState,
    refresh,
    uploadAsset,
    createExternalAsset,
    updateMetadata,
    deleteAsset,
    createAlbum,
    updateAlbum,
    deleteAlbum,
    addAlbumItem,
    removeAlbumItem,
  } = useAdminMediaLibrary();

  const [activeTab, setActiveTab] = useState("assets"); // assets | albums
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [uploadForm, setUploadForm] = useState(() => createUploadForm());
  const [externalForm, setExternalForm] = useState(() => createExternalForm());
  const [metadataForm, setMetadataForm] = useState(() => createMetadataForm());
  const [albumForm, setAlbumForm] = useState(() => createAlbumForm());
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [clipboardMessage, setClipboardMessage] = useState(null);
  const [newItemMediaId, setNewItemMediaId] = useState("");

  const categoryStats = useMemo(() => {
    const stats = new Map();
    assets.forEach((asset) => {
      const key = asset.category || "uncategorized";
      stats.set(key, (stats.get(key) || 0) + 1);
    });
    return Array.from(stats.entries());
  }, [assets]);

  const filteredAssets = useMemo(() => {
    if (selectedCategory === "all") return assets;
    return assets.filter(a => (a.category || "uncategorized") === selectedCategory);
  }, [assets, selectedCategory]);

  function prefillMetadataForm(asset) {
    setMetadataForm({ id: asset.id, label: asset.label || "", category: asset.category || "", altText: asset.altText || "" });
    document.getElementById("media-metadata-form")?.scrollIntoView({ behavior: "smooth" });
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

  async function handleAlbumSubmit(event) {
    event.preventDefault();
    if (albumForm.id) {
      await updateAlbum(albumForm);
    } else {
      await createAlbum(albumForm);
    }
    setAlbumForm(createAlbumForm());
    setSelectedAlbum(null); // Go back to list
  }

  async function handleDeleteAlbum(album) {
    if (!window.confirm(`Delete album "${album.title}"?`)) return;
    await deleteAlbum({ id: album.id });
    if (selectedAlbum?.id === album.id) setSelectedAlbum(null);
  }

  async function handleAddItem(event) {
    event.preventDefault();
    if (!selectedAlbum || !newItemMediaId) return;
    await addAlbumItem({
      albumId: selectedAlbum.id,
      mediaId: newItemMediaId,
      order: selectedAlbum.items.length,
    });
    setNewItemMediaId("");
    // Refresh selected album data from updated list
    const updated = albums.find(a => a.id === selectedAlbum.id);
    if (updated) setSelectedAlbum(updated);
  }

  async function handleRemoveItem(itemId) {
    if (!window.confirm("Remove this item from album?")) return;
    await removeAlbumItem({ id: itemId });
    // Refresh selected album data from updated list
    const updated = albums.find(a => a.id === selectedAlbum.id);
    if (updated) setSelectedAlbum(updated);
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

  function openAlbum(album) {
    setSelectedAlbum(album);
    setAlbumForm({
      id: album.id,
      title: album.title,
      slug: album.slug,
      description: album.description || "",
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex rounded-lg bg-slate-100 p-1">
            <button
              onClick={() => setActiveTab("assets")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeTab === "assets" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Assets
            </button>
            <button
              onClick={() => setActiveTab("albums")}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition ${activeTab === "albums" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
            >
              Albums
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-500 border-l border-slate-200 pl-4">
            <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
            Last sync: {lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString("en-GB") : "--"}
          </div>
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

      {activeTab === "assets" && (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Media Catalogue</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {assets.length} Assets
              </span>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              <div
                onClick={() => setSelectedCategory("all")}
                className={`rounded-xl border p-4 shadow-sm cursor-pointer transition ${selectedCategory === "all" ? "ring-2 ring-slate-400 bg-slate-100" : "border-slate-200 bg-white hover:bg-slate-50"}`}
                style={{ borderLeftWidth: '4px', borderLeftColor: '#94a3b8' }}
              >
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">All Assets</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{assets.length}</p>
              </div>
              {categoryStats.map(([category, count], index) => (
                <div
                  key={category}
                  onClick={() => setSelectedCategory(selectedCategory === category ? "all" : category)}
                  className={`rounded-xl border p-4 shadow-sm cursor-pointer transition ${selectedCategory === category ? "ring-2 ring-blue-500 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50"}`}
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

            {!loading && !filteredAssets.length ? (
              <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
                No assets found in this category.
              </div>
            ) : null}

            <div className="space-y-4">
              {filteredAssets.map((asset) => (
                <article key={asset.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="p-5">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="space-y-1 w-full">
                        <div className="flex items-center gap-2">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                            {asset.category || "Uncategorized"}
                          </span>
                          <span className="text-xs text-slate-500 font-mono">
                            {asset.mimeType || "unknown type"}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-slate-900 break-all">{asset.label || asset.url}</h4>

                        {/* Preview Area */}
                        <div className="mt-3 mb-3 rounded-lg bg-slate-50 border border-slate-100 overflow-hidden">
                          {isVideo(asset) ? (
                            <video src={asset.url} controls className="w-full max-h-64 object-contain bg-black" />
                          ) : (
                            <img src={asset.url} alt={asset.altText || asset.label} className="w-full max-h-64 object-contain" loading="lazy" />
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            {isVideo(asset) ? <Video size={12} /> : <ImageIcon size={12} />}
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

                      <div className="flex flex-col gap-2 w-full sm:w-auto">
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

              <div id="media-metadata-form">
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
            </div>
          </aside>
        </div>
      )}

      {activeTab === "albums" && (
        <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">Album Collections</h3>
              <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                {albums.length} Albums
              </span>
            </div>

            {selectedAlbum ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2">
                  <button onClick={() => setSelectedAlbum(null)} className="p-2 hover:bg-slate-100 rounded-full">
                    <ArrowLeft size={20} />
                  </button>
                  <h4 className="text-xl font-bold text-slate-900">{selectedAlbum.title}</h4>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h5 className="text-sm font-bold text-slate-900 mb-4">Album Content</h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {selectedAlbum.items?.map((item) => (
                      <div key={item.id} className="relative group rounded-lg overflow-hidden border border-slate-200 bg-slate-50 aspect-square">
                        {isVideo(item.media) ? (
                          <video src={item.media.url} className="w-full h-full object-cover" />
                        ) : (
                          <img src={item.media.url} alt={item.media.label} className="w-full h-full object-cover" />
                        )}
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="p-2 bg-white rounded-full text-rose-600 hover:bg-rose-50"
                            title="Remove from album"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[10px] text-white truncate">
                          {item.media.label}
                        </div>
                      </div>
                    ))}
                    <div className="flex items-center justify-center rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 aspect-square">
                      <p className="text-xs text-slate-400 text-center px-2">Add items via form</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {albums.map((album) => (
                  <article key={album.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md cursor-pointer" onClick={() => openAlbum(album)}>
                    <div className="p-5">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-bold text-slate-900">{album.title}</h4>
                          <p className="text-xs text-slate-500 font-mono">{album.slug}</p>
                          <p className="text-sm text-slate-600 mt-2 line-clamp-2">{album.description}</p>
                        </div>
                        <Folder size={20} className="text-blue-500" />
                      </div>
                      <div className="mt-4 flex items-center justify-between gap-2 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <span className="bg-slate-100 px-2 py-1 rounded-full">{album.items?.length || 0} Items</span>
                          <span>Updated {formatTimestamp(album.updatedAt)}</span>
                        </div>
                        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <span className="font-medium text-slate-500">{album.isVisible ? "Visible" : "Hidden"}</span>
                          <Switch
                            checked={album.isVisible}
                            onCheckedChange={(checked) => updateAlbum({ id: album.id, isVisible: checked })}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-5 py-2 border-t border-slate-100 flex justify-end gap-2">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDeleteAlbum(album); }}
                        className="text-slate-400 hover:text-rose-600 p-1"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>

          <aside className="space-y-6">
            <div className="sticky top-6 space-y-6">
              <ActionForm
                title={selectedAlbum ? "Edit Album Details" : "Create Album"}
                description="Group media for galleries"
                icon={<Folder size={16} />}
                onSubmit={handleAlbumSubmit}
                disabled={actionState.pending}
              >
                <Input label="Title" value={albumForm.title} onChange={(e) => setAlbumForm({ ...albumForm, title: e.target.value })} required />
                <Input label="Slug" value={albumForm.slug} onChange={(e) => setAlbumForm({ ...albumForm, slug: e.target.value })} required placeholder="url-friendly-slug" />
                <Input label="Description" value={albumForm.description} onChange={(e) => setAlbumForm({ ...albumForm, description: e.target.value })} />
                {selectedAlbum && (
                  <div className="flex justify-end">
                    <button type="button" onClick={() => { setSelectedAlbum(null); setAlbumForm(createAlbumForm()); }} className="text-xs text-slate-500 hover:text-slate-800">Cancel Edit</button>
                  </div>
                )}
              </ActionForm>

              {selectedAlbum && (
                <ActionForm
                  title="Add Media to Album"
                  description="Select assets to include"
                  icon={<Plus size={16} />}
                  onSubmit={handleAddItem}
                  disabled={actionState.pending}
                >
                  <MediaAssetSelect
                    label="Select Media"
                    value={newItemMediaId}
                    onChange={(id) => setNewItemMediaId(id)}
                  />
                  <div className="text-xs text-slate-500 mt-2">
                    Selected media will be added to the end of the album.
                  </div>
                </ActionForm>
              )}
            </div>
          </aside>
        </div>
      )}
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
        {title.includes("Edit") || title.includes("Update") ? "Save Changes" : "Submit"}
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
