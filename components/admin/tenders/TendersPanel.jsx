"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, CalendarDays, Paperclip, Pencil } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAdminTenders } from "@/hooks/useAdminTenders";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { ActionForm } from "@/components/admin/ui/ActionForm";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { AdminRichText } from "@/components/admin/ui/AdminRichText";
import { z } from "zod";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { tenderSchema, updateTenderSchema, tenderCategorySchema, attachmentSchema } from "@/lib/validators/admin";

const STATUS_OPTIONS = ["OPEN", "UPCOMING", "CLOSED", "CANCELLED"];



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

  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    formState: { errors: errorsCategory, isSubmitting: creatingCategory }
  } = useForm({
    resolver: zodResolver(tenderCategorySchema),
    defaultValues: { label: "", description: "", order: "" }
  });

  const {
    register: registerTender,
    control: controlTender,
    handleSubmit: handleSubmitTender,
    reset: resetTender,
    formState: { errors: errorsTender, isSubmitting: creatingTender }
  } = useForm({
    resolver: zodResolver(tenderSchema),
    defaultValues: {
      tenderNumber: "",
      title: "",
      summary: "",
      status: "OPEN",
      categoryId: "",
      publishedAt: "",
      closingAt: "",
      contactEmail: "",
      contactPhone: "",
    }
  });

  const {
    register: registerUpdate,
    control: controlUpdate,
    handleSubmit: handleSubmitUpdate,
    reset: resetUpdate,
    setValue: setUpdateValue,
    watch: watchUpdate,
    formState: { errors: errorsUpdate, isSubmitting: updatingTender }
  } = useForm({
    resolver: zodResolver(updateTenderSchema),
    defaultValues: {
      id: "",
      tenderNumber: "",
      title: "",
      summary: "",
      status: "OPEN",
      categoryId: "",
      publishedAt: "",
      closingAt: "",
      contactEmail: "",
      contactPhone: "",
    }
  });

  const {
    register: registerAttachment,
    control: controlAttachment,
    handleSubmit: handleSubmitAttachment,
    reset: resetAttachment,
    setValue: setAttachmentValue,
    watch: watchAttachment,
    formState: { errors: errorsAttachment, isSubmitting: attaching }
  } = useForm({
    resolver: zodResolver(attachmentSchema),
    defaultValues: { tenderId: "", label: "", mediaId: "", mediaUrl: "" }
  });

  const [activeTab, setActiveTab] = useState("create");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  const filteredTenders = useMemo(() => {
    if (!searchTerm) return tenders;
    const lower = searchTerm.toLowerCase();
    return tenders.filter(
      (t) =>
        t.title.toLowerCase().includes(lower) ||
        t.tenderNumber.toLowerCase().includes(lower) ||
        t.status.toLowerCase().includes(lower)
    );
  }, [tenders, searchTerm]);

  const totalPages = Math.ceil(filteredTenders.length / ITEMS_PER_PAGE);
  const paginatedTenders = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredTenders.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredTenders, currentPage]);

  const statusBuckets = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => ({ ...acc, [status]: tenders.filter((item) => item.status === status).length }),
      {}
    );
  }, [tenders]);

  async function handleCategorySubmit(data) {
    await createEntity("category", { ...data, order: toNumber(data.order) });
    resetCategory();
  }

  async function handleTenderSubmit(data) {
    await createEntity("tender", {
      ...data,
      categoryId: data.categoryId || null,
      publishedAt: nullable(data.publishedAt),
      closingAt: nullable(data.closingAt),
    });
    resetTender();
  }

  async function handleTenderUpdateSubmit(data) {
    await updateEntity("tender", {
      ...data,
      categoryId: data.categoryId || null,
      publishedAt: nullable(data.publishedAt),
      closingAt: nullable(data.closingAt),
    });
    resetUpdate({ id: "", tenderNumber: "", title: "", summary: "", status: "OPEN", categoryId: "", publishedAt: "", closingAt: "", contactEmail: "", contactPhone: "" });
    setActiveTab("create");
  }

  function handleTenderSelectForEdit(tenderId) {
    if (!tenderId) return;
    const tender = tenders.find((t) => t.id === tenderId);
    if (!tender) return;

    const formatForInput = (dateStr) => dateStr ? new Date(dateStr).toISOString().slice(0, 16) : "";

    resetUpdate({
      id: tender.id,
      tenderNumber: tender.tenderNumber,
      title: tender.title,
      summary: tender.summary || "",
      status: tender.status,
      categoryId: tender.categoryId || "",
      publishedAt: formatForInput(tender.publishedAt),
      closingAt: formatForInput(tender.closingAt),
      contactEmail: tender.contactEmail || "",
      contactPhone: tender.contactPhone || "",
    });
    setActiveTab("edit");
    document.getElementById("tenders-form-container")?.scrollIntoView({ behavior: "smooth" });
  }

  async function handleAttachmentSubmit(data) {
    await createEntity("attachment", data);
    resetAttachment();
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
          <span suppressHydrationWarning>Last sync: {formatRelative(lastFetchedAt)}</span>
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
              {filteredTenders.length} Records
            </span>
          </div>

          <SearchInput value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search tenders..." />

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

          {!loading && !filteredTenders.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              {searchTerm ? "No tenders match your search." : "No tenders found. Use the form to create your first tender."}
            </div>
          ) : null}

          <div className="space-y-4">
            {paginatedTenders.map((tender) => (
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
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">{tender.isVisible ? "Visible" : "Hidden"}</span>
                        <Switch
                          checked={tender.isVisible}
                          onCheckedChange={(checked) => updateEntity("tender", { id: tender.id, isVisible: checked })}
                        />
                      </div>
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
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </section>

        <aside className="space-y-6" id="tenders-form-container">
          <div className="sticky top-6 space-y-6">
            {/* Tab Navigation */}
            <div className="flex rounded-lg bg-slate-100 p-1">
              <button
                onClick={() => setActiveTab("create")}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${activeTab === "create" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                Create
              </button>
              <button
                onClick={() => setActiveTab("edit")}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${activeTab === "edit" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
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
                  onSubmit={handleSubmitCategory(handleCategorySubmit)}
                  disabled={creatingCategory || actionState.pending}
                >
                  <AdminInput label="Label" {...registerCategory("label")} required />
                  {errorsCategory.label && <p className="text-xs text-rose-500">{errorsCategory.label.message}</p>}

                  <AdminTextarea label="Description" {...registerCategory("description")} />
                  <AdminInput label="Order" type="number" {...registerCategory("order")} />
                </ActionForm>

                <ActionForm
                  title="Publish Tender"
                  description="Create a new tender record"
                  onSubmit={handleSubmitTender(handleTenderSubmit)}
                  disabled={creatingTender || actionState.pending}
                >
                  <AdminInput label="Tender Number" {...registerTender("tenderNumber")} required />
                  {errorsTender.tenderNumber && <p className="text-xs text-rose-500">{errorsTender.tenderNumber.message}</p>}

                  <AdminInput label="Title" {...registerTender("title")} required />
                  {errorsTender.title && <p className="text-xs text-rose-500">{errorsTender.title.message}</p>}

                  <Controller
                    control={controlTender}
                    name="summary"
                    render={({ field }) => (
                      <AdminRichText label="Summary" value={field.value} onChange={field.onChange} />
                    )}
                  />

                  <AdminSelect label="Status" {...registerTender("status")}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </AdminSelect>

                  <AdminSelect label="Category" {...registerTender("categoryId")}>
                    <option value="">Unassigned</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </AdminSelect>

                  <AdminInput label="Published At" type="datetime-local" {...registerTender("publishedAt")} />
                  <AdminInput label="Closing At" type="datetime-local" {...registerTender("closingAt")} />
                  <AdminInput label="Contact Email" type="email" {...registerTender("contactEmail")} />
                  {errorsTender.contactEmail && <p className="text-xs text-rose-500">{errorsTender.contactEmail.message}</p>}
                  <AdminInput label="Contact Phone" {...registerTender("contactPhone")} />
                </ActionForm>

                <ActionForm
                  title="Attach File"
                  description="Link a document to a tender"
                  onSubmit={handleSubmitAttachment(handleAttachmentSubmit)}
                  disabled={attaching || actionState.pending || !tenders.length}
                >
                  <AdminSelect label="Tender" {...registerAttachment("tenderId")} required>
                    <option value="" disabled>Select Tender</option>
                    {tenders.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
                  </AdminSelect>
                  {errorsAttachment.tenderId && <p className="text-xs text-rose-500">{errorsAttachment.tenderId.message}</p>}

                  <AdminInput label="Label" {...registerAttachment("label")} />

                  <Controller
                    control={controlAttachment}
                    name="mediaId"
                    render={({ field }) => (
                      <MediaPicker
                        label="Attachment File"
                        value={field.value}
                        onChange={(id, asset) => {
                          field.onChange(id);
                          setAttachmentValue("mediaUrl", asset?.url || "");
                        }}
                        category="tenders"
                        accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                    )}
                  />
                  {/* Show URL if exists from watch or default */}
                  {watchAttachment("mediaUrl") && <p className="text-[10px] text-slate-400 mt-1 truncate">URL: {watchAttachment("mediaUrl")}</p>}
                  {errorsAttachment.mediaId && <p className="text-xs text-rose-500">{errorsAttachment.mediaId.message}</p>}
                </ActionForm>
              </>
            )}

            {activeTab === "edit" && (
              <ActionForm
                title="Update Tender"
                description="Edit existing tender record"
                onSubmit={handleSubmitUpdate(handleTenderUpdateSubmit)}
                disabled={updatingTender || actionState.pending || !watchUpdate("id")}
                submitLabel="Save Changes"
              >
                <AdminSelect
                  label="Select Tender to Edit"
                  value={watchUpdate("id")}
                  onChange={(e) => handleTenderSelectForEdit(e.target.value)}
                  required
                >
                  <option value="" disabled>Select Tender</option>
                  {tenders.map((t) => (
                    <option key={t.id} value={t.id}>{t.title}</option>
                  ))}
                </AdminSelect>

                <fieldset disabled={!watchUpdate("id")} className="space-y-4">
                  <AdminInput label="Tender Number" {...registerUpdate("tenderNumber")} required />
                  {errorsUpdate.tenderNumber && <p className="text-xs text-rose-500">{errorsUpdate.tenderNumber.message}</p>}

                  <AdminInput label="Title" {...registerUpdate("title")} required />
                  {errorsUpdate.title && <p className="text-xs text-rose-500">{errorsUpdate.title.message}</p>}

                  <Controller
                    control={controlUpdate}
                    name="summary"
                    render={({ field }) => (
                      <AdminRichText label="Summary" value={field.value} onChange={field.onChange} />
                    )}
                  />

                  <AdminSelect label="Status" {...registerUpdate("status")}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                  </AdminSelect>

                  <AdminSelect label="Category" {...registerUpdate("categoryId")}>
                    <option value="">Unassigned</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.label}</option>)}
                  </AdminSelect>

                  <AdminInput label="Published At" type="datetime-local" {...registerUpdate("publishedAt")} />
                  <AdminInput label="Closing At" type="datetime-local" {...registerUpdate("closingAt")} />
                  <AdminInput label="Contact Email" type="email" {...registerUpdate("contactEmail")} />
                  {errorsUpdate.contactEmail && <p className="text-xs text-rose-500">{errorsUpdate.contactEmail.message}</p>}
                  <AdminInput label="Contact Phone" {...registerUpdate("contactPhone")} />
                </fieldset>
              </ActionForm>
            )}
          </div>
        </aside>
      </div >
    </div >
  );
}

