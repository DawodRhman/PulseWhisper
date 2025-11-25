"use client";
import { useMemo, useState } from "react";
import { Loader2, RefreshCcw, Trash2, Plus, Link2, ExternalLink, ToggleLeft, ToggleRight } from "lucide-react";
import { useAdminSocialLinks } from "@/hooks/useAdminSocialLinks";

const createInitialCreateForm = () => ({
  title: "",
  platform: "",
  url: "",
  order: "",
  isActive: true,
});

const createInitialUpdateForm = () => ({
  id: "",
  title: "",
  platform: "",
  url: "",
  order: "",
  isActive: true,
});

function toNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function formatRelative(timestamp) {
  if (!timestamp) return "Never";
  const delta = Date.now() - timestamp;
  if (delta < 1000) return "Just now";
  if (delta < 60_000) return `${Math.round(delta / 1000)}s ago`;
  const minutes = Math.round(delta / 60_000);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  return `${days}d ago`;
}

export default function SocialLinksPanel() {
  const {
    links,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminSocialLinks();

  const [createForm, setCreateForm] = useState(() => createInitialCreateForm());
  const [updateForm, setUpdateForm] = useState(() => createInitialUpdateForm());

  const activeCount = useMemo(() => links.filter((link) => link.isActive).length, [links]);

  async function handleCreateSubmit(event) {
    event.preventDefault();
    await createEntity("link", {
      title: createForm.title,
      platform: createForm.platform || null,
      url: createForm.url,
      order: toNumber(createForm.order),
      isActive: createForm.isActive,
    });
    setCreateForm(createInitialCreateForm());
  }

  async function handleUpdateSubmit(event) {
    event.preventDefault();
    if (!updateForm.id) return;
    await updateEntity("link", {
      id: updateForm.id,
      title: updateForm.title,
      platform: updateForm.platform || null,
      url: updateForm.url,
      order: toNumber(updateForm.order),
      isActive: updateForm.isActive,
    });
    setUpdateForm(createInitialUpdateForm());
  }

  async function handleToggle(link) {
    await updateEntity("link", { id: link.id, isActive: !link.isActive });
  }

  async function handleDelete(link) {
    if (!window.confirm(`Remove ${link.title}? This cannot be undone.`)) return;
    await deleteEntity("link", { id: link.id });
  }

  function handleSelect(linkId) {
    if (!linkId) {
      setUpdateForm(createInitialUpdateForm());
      return;
    }
    const link = links.find((entry) => entry.id === linkId);
    if (!link) return;
    setUpdateForm({
      id: link.id,
      title: link.title,
      platform: link.platform || "",
      url: link.url,
      order: link.order?.toString() ?? "",
      isActive: link.isActive,
    });
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
          disabled={loading || actionState.pending}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-700 shadow-sm hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCcw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Data
        </button>
      </div>

      {error && (
        <div className="rounded-xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600">
          {error.message || "Failed to load social links"}
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
             <h3 className="text-lg font-semibold text-slate-900">Social Inventory</h3>
             <div className="flex gap-2">
               <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
                 {links.length} Total
               </span>
               <span className="rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-600">
                 {activeCount} Active
               </span>
             </div>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading links...
              </div>
            </div>
          ) : null}

          {!loading && !links.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No social links configured yet.
            </div>
          ) : null}

          <div className="space-y-3">
            {links.map((link) => (
              <article key={link.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-4 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`inline-flex h-2 w-2 rounded-full ${link.isActive ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                      <h4 className="text-sm font-bold text-slate-900 truncate">{link.title}</h4>
                      {link.platform && (
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-500">
                          {link.platform}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-blue-600 hover:underline truncate max-w-[300px]">
                        <Link2 size={12} />
                        {link.url}
                      </a>
                      <span className="text-slate-300">|</span>
                      <span>Order: {link.order ?? 0}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleToggle(link)}
                      className={`rounded-lg p-2 transition ${link.isActive ? "text-emerald-600 bg-emerald-50 hover:bg-emerald-100" : "text-slate-400 bg-slate-50 hover:bg-slate-100"}`}
                      title={link.isActive ? "Deactivate" : "Activate"}
                    >
                      {link.isActive ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelect(link.id)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-blue-600 transition"
                      title="Edit Link"
                    >
                      <ExternalLink size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(link)}
                      className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                      title="Delete Link"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="Create Link"
              description="Add a new social media link"
              onSubmit={handleCreateSubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={createForm.title} onChange={(e) => setCreateForm({ ...createForm, title: e.target.value })} required placeholder="e.g. Official Facebook" />
              <Input label="Platform Key" value={createForm.platform} onChange={(e) => setCreateForm({ ...createForm, platform: e.target.value })} placeholder="facebook, twitter, linkedin..." />
              <Input label="URL" type="url" value={createForm.url} onChange={(e) => setCreateForm({ ...createForm, url: e.target.value })} required placeholder="https://..." />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Order" type="number" value={createForm.order} onChange={(e) => setCreateForm({ ...createForm, order: e.target.value })} placeholder="0" />
                <div className="flex items-end pb-2">
                  <label className="flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={createForm.isActive}
                      onChange={(e) => setCreateForm({ ...createForm, isActive: e.target.checked })}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Active
                  </label>
                </div>
              </div>
            </ActionForm>

            <ActionForm
              title="Update Link"
              description="Edit an existing link"
              onSubmit={handleUpdateSubmit}
              disabled={actionState.pending || !links.length}
            >
              <Select label="Select Link" value={updateForm.id} onChange={(e) => handleSelect(e.target.value)} required>
                <option value="" disabled>Select Link</option>
                {links.map((l) => <option key={l.id} value={l.id}>{l.title}</option>)}
              </Select>
              
              <Input label="Title" value={updateForm.title} onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })} disabled={!updateForm.id} />
              <Input label="Platform Key" value={updateForm.platform} onChange={(e) => setUpdateForm({ ...updateForm, platform: e.target.value })} disabled={!updateForm.id} />
              <Input label="URL" type="url" value={updateForm.url} onChange={(e) => setUpdateForm({ ...updateForm, url: e.target.value })} disabled={!updateForm.id} />
              
              <div className="grid grid-cols-2 gap-4">
                <Input label="Order" type="number" value={updateForm.order} onChange={(e) => setUpdateForm({ ...updateForm, order: e.target.value })} disabled={!updateForm.id} />
                <div className="flex items-end pb-2">
                  <label className={`flex items-center gap-2 text-sm font-medium text-slate-700 cursor-pointer ${!updateForm.id ? 'opacity-50 pointer-events-none' : ''}`}>
                    <input
                      type="checkbox"
                      checked={updateForm.isActive}
                      onChange={(e) => setUpdateForm({ ...updateForm, isActive: e.target.checked })}
                      disabled={!updateForm.id}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                    />
                    Active
                  </label>
                </div>
              </div>
            </ActionForm>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionForm({ title, description, children, onSubmit, disabled }) {
  return (
    <form
      onSubmit={onSubmit}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <p className="text-xs text-slate-500">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
      <button
        type="submit"
        disabled={disabled}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-slate-900 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:opacity-50"
      >
        <Plus size={16} />
        {title.includes("Update") ? "Save Changes" : "Create"}
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