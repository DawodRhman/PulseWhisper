"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, CalendarDays, Paperclip, Pencil } from "lucide-react";
import { useAdminTenders } from "@/hooks/useAdminTenders";

const STATUS_OPTIONS = ["OPEN", "UPCOMING", "CLOSED", "CANCELLED"];

const INITIAL_CATEGORY = { label: "", description: "", order: "" };
const INITIAL_TENDER = {
  tenderNumber: "",
  title: "",
  summary: "",
  status: "OPEN",
  categoryId: "",
  publishedAt: "",
  closingAt: "",
  contactEmail: "",
  contactPhone: "",
};
const INITIAL_ATTACHMENT = { tenderId: "", label: "", mediaUrl: "" };

function toNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function nullable(value) {
  if (value === undefined || value === null) return null;
  const trimmed = typeof value === "string" ? value.trim() : value;
  return trimmed === "" ? null : trimmed;
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleString("en-GB");
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

export default function TendersPanel() {
  const {
    tenders,
    categories,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminTenders();
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY);
  const [tenderForm, setTenderForm] = useState(INITIAL_TENDER);
  const [tenderUpdateForm, setTenderUpdateForm] = useState({ ...INITIAL_TENDER, id: "" });
  const [attachmentForm, setAttachmentForm] = useState(INITIAL_ATTACHMENT);
  const [activeTab, setActiveTab] = useState("create");

  const statusBuckets = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => ({ ...acc, [status]: tenders.filter((item) => item.status === status).length }),
      {}
    );
  }, [tenders]);

  async function handleCategorySubmit(event) {
    event.preventDefault();
    await createEntity("category", {
      label: categoryForm.label,
      description: nullable(categoryForm.description),
      order: toNumber(categoryForm.order),
    });
    setCategoryForm(INITIAL_CATEGORY);
  }

  async function handleTenderSubmit(event) {
    event.preventDefault();
    await createEntity("tender", {
      tenderNumber: tenderForm.tenderNumber,
      title: tenderForm.title,
      summary: nullable(tenderForm.summary),
      status: tenderForm.status,
      categoryId: tenderForm.categoryId || null,
      publishedAt: nullable(tenderForm.publishedAt),
      closingAt: nullable(tenderForm.closingAt),
      contactEmail: nullable(tenderForm.contactEmail),
      contactPhone: nullable(tenderForm.contactPhone),
    });
    setTenderForm(INITIAL_TENDER);
  }

  async function handleTenderUpdateSubmit(event) {
    event.preventDefault();
    if (!tenderUpdateForm.id) return;
    await updateEntity("tender", {
      id: tenderUpdateForm.id,
      tenderNumber: tenderUpdateForm.tenderNumber,
      title: tenderUpdateForm.title,
      summary: nullable(tenderUpdateForm.summary),
      status: tenderUpdateForm.status,
      categoryId: tenderUpdateForm.categoryId || null,
      publishedAt: nullable(tenderUpdateForm.publishedAt),
      closingAt: nullable(tenderUpdateForm.closingAt),
      contactEmail: nullable(tenderUpdateForm.contactEmail),
      contactPhone: nullable(tenderUpdateForm.contactPhone),
    });
  }

  function handleTenderSelectForEdit(tenderId) {
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return;
    setTenderUpdateForm({
      id: tender.id,
      tenderNumber: tender.tenderNumber,
      title: tender.title,
      summary: tender.summary || "",
      status: tender.status,
      categoryId: tender.categoryId || "",
      publishedAt: tender.publishedAt ? new Date(tender.publishedAt).toISOString().slice(0, 16) : "",
      closingAt: tender.closingAt ? new Date(tender.closingAt).toISOString().slice(0, 16) : "",
      contactEmail: tender.contactEmail || "",
      contactPhone: tender.contactPhone || "",
    });
    setActiveTab("edit");
    document.getElementById("tenders-form-container")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleAttachmentSubmit(event) {
    event.preventDefault();
    await createEntity("attachment", {
      tenderId: attachmentForm.tenderId,
      label: nullable(attachmentForm.label),
      mediaUrl: attachmentForm.mediaUrl,
    });
    setAttachmentForm(INITIAL_ATTACHMENT);
  }

  async function handleStatusChange(tenderId, status) {
    await updateEntity("tender", { id: tenderId, status });
  }

  async function handleDelete(type, id, label) {
    if (!id) return;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    await deleteEntity(type, { id });
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
          {error.message || "Failed to load tenders"}
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
             <h3 className="text-lg font-semibold text-slate-900">Tender Queue</h3>
             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
               {tenders.length} Records
             </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{status.replace("_", " ")}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{statusBuckets[status] || 0}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading tenders...
              </div>
            </div>
          ) : null}

          {!loading && !tenders.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No tenders found. Use the form to create your first tender.
            </div>
          ) : null}

          <div className="space-y-4">
            {tenders.map((tender) => (
              <article key={tender.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {tender.tenderNumber}
                        </span>
                        <h4 className="font-semibold text-slate-900">{tender.title}</h4>
                      </div>
                      {tender.summary && <p className="text-sm text-slate-500 max-w-xl">{tender.summary}</p>}
                      <p className="text-xs text-slate-500">Category: <span className="font-medium text-slate-700">{tender.category?.label || "Unassigned"}</span></p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={tender.status}
                        onChange={(event) => handleStatusChange(tender.id, event.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status.replace("_", " ")}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleTenderSelectForEdit(tender.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                        title="Edit Tender"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDelete("tender", tender.id, tender.title)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Tender"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-3">
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span>Published: <span className="font-medium text-slate-700">{formatDate(tender.publishedAt)}</span></span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span>Closing: <span className="font-medium text-slate-700">{formatDate(tender.closingAt)}</span></span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Contact:</span>
                      <span className="font-medium text-slate-700">{tender.contactEmail || tender.contactPhone || "—"}</span>
                    </div>
                  </div>

                  {tender.attachments?.length ? (
                    <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attachments</p>
                      <ul className="mt-2 space-y-2">
                        {tender.attachments.map((attachment) => (
                          <li key={attachment.id} className="flex items-center justify-between gap-2 text-xs">
                            <span className="flex items-center gap-2 text-slate-600">
                              <Paperclip size={12} />
                              {attachment.label || attachment.media?.label || "Asset"}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete("attachment", attachment.id, attachment.label || "attachment")}
                              className="text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 size={12} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6" id="tenders-form-container">
          <div className="sticky top-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                  activeTab === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Create
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${
                  activeTab === "edit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                Edit
              </button>
            </div>

            {activeTab === "create" && (
              <>
                <ActionForm
                  title="Create Category"
                  description="Add a new tender category"
                  onSubmit={handleCategorySubmit}
                  disabled={actionState.pending}
                >
                  <Input label="Label" value={categoryForm.label} onChange={(e) => setCategoryForm({ ...categoryForm, label: e.target.value })} required />
                  <TextArea label="Description" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                  <Input label="Order" type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })} />
                </ActionForm>

                <ActionForm
                  title="Publish Tender"
                  description="Create a new tender record"
                  onSubmit={handleTenderSubmit}
                  disabled={actionState.pending}
                >
                  <Input label="Tender Number" value={tenderForm.tenderNumber} onChange={(e) => setTenderForm({ ...tenderForm, tenderNumber: e.target.value })} required />
                  <Input label="Title" value={tenderForm.title} onChange={(e) => setTenderForm({ ...tenderForm, title: e.target.value })} required />
                  <TextArea label="Summary" value={tenderForm.summary} onChange={(e) => setTenderForm({ ...tenderForm, summary: e.target.value })} />
                  <Select label="Status" value={tenderForm.status} onChange={(e) => setTenderForm({ ...tenderForm, status: e.target.value })}>
                     {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </Select>
                  <Select label="Category" value={tenderForm.categoryId} onChange={(e) => setTenderForm({ ...tenderForm, categoryId: e.target.value })}>
                     <option value="">Unassigned</option>
                     {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </Select>
                  <Input label="Published At" type="datetime-local" value={tenderForm.publishedAt} onChange={(e) => setTenderForm({ ...tenderForm, publishedAt: e.target.value })} />
                  <Input label="Closing At" type="datetime-local" value={tenderForm.closingAt} onChange={(e) => setTenderForm({ ...tenderForm, closingAt: e.target.value })} />
                  <Input label="Contact Email" type="email" value={tenderForm.contactEmail} onChange={(e) => setTenderForm({ ...tenderForm, contactEmail: e.target.value })} />
                  <Input label="Contact Phone" value={tenderForm.contactPhone} onChange={(e) => setTenderForm({ ...tenderForm, contactPhone: e.target.value })} />
                </ActionForm>

                <ActionForm
                  title="Attach File"
                  description="Link a document to a tender"
                  onSubmit={handleAttachmentSubmit}
                  disabled={actionState.pending || !tenders.length}
                >
                  <Select label="Tender" value={attachmentForm.tenderId} onChange={(e) => setAttachmentForm({ ...attachmentForm, tenderId: e.target.value })} required>
                     <option value="" disabled>Select Tender</option>
                     {tenders.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </Select>
                  <Input label="Label" value={attachmentForm.label} onChange={(e) => setAttachmentForm({ ...attachmentForm, label: e.target.value })} />
                  <Input label="Media URL" type="url" value={attachmentForm.mediaUrl} onChange={(e) => setAttachmentForm({ ...attachmentForm, mediaUrl: e.target.value })} required />
                </ActionForm>
              </>
            )}

            {activeTab === "edit" && (
              <ActionForm
                title="Update Tender"
                description="Edit existing tender record"
                onSubmit={handleTenderUpdateSubmit}
                disabled={actionState.pending || !tenderUpdateForm.id}
                submitLabel="Save Changes"
              >
                <Select
                  label="Select Tender to Edit"
                  value={tenderUpdateForm.id}
                  onChange={(e) => handleTenderSelectForEdit(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Tender</option>
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </Select>

                <Input label="Tender Number" value={tenderUpdateForm.tenderNumber} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, tenderNumber: e.target.value })} required disabled={!tenderUpdateForm.id} />
                <Input label="Title" value={tenderUpdateForm.title} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, title: e.target.value })} required disabled={!tenderUpdateForm.id} />
                <TextArea label="Summary" value={tenderUpdateForm.summary} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, summary: e.target.value })} disabled={!tenderUpdateForm.id} />
                <Select label="Status" value={tenderUpdateForm.status} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, status: e.target.value })} disabled={!tenderUpdateForm.id}>
                   {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </Select>
                <Select label="Category" value={tenderUpdateForm.categoryId} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, categoryId: e.target.value })} disabled={!tenderUpdateForm.id}>
                   <option value="">Unassigned</option>
                   {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                </Select>
                <Input label="Published At" type="datetime-local" value={tenderUpdateForm.publishedAt} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, publishedAt: e.target.value })} disabled={!tenderUpdateForm.id} />
                <Input label="Closing At" type="datetime-local" value={tenderUpdateForm.closingAt} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, closingAt: e.target.value })} disabled={!tenderUpdateForm.id} />
                <Input label="Contact Email" type="email" value={tenderUpdateForm.contactEmail} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, contactEmail: e.target.value })} disabled={!tenderUpdateForm.id} />
                <Input label="Contact Phone" value={tenderUpdateForm.contactPhone} onChange={(e) => setTenderUpdateForm({ ...tenderUpdateForm, contactPhone: e.target.value })} disabled={!tenderUpdateForm.id} />
              </ActionForm>
            )}
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      />
    </label>
  );
}

function TextArea({ label, rows = 2, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <textarea
        rows={rows}
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}