"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2 } from "lucide-react";
import { useAdminCareers } from "@/hooks/useAdminCareers";

const STATUS_OPTIONS = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];
const REQUIREMENT_TYPES = ["QUALIFICATION", "RESPONSIBILITY"];

const INITIAL_PROGRAM = { title: "", heroTitle: "", heroBody: "", eligibility: "" };
const INITIAL_OPENING = {
  programId: "",
  title: "",
  summary: "",
  department: "",
  location: "",
  jobType: "",
  compensation: "",
  status: "DRAFT",
  publishAt: "",
  expireAt: "",
  applyEmail: "",
  applyUrl: "",
};
const INITIAL_REQUIREMENT = { careerOpeningId: "", type: "QUALIFICATION", content: "", order: "" };

function splitLines(value) {
  return (value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function nullable(value) {
  if (value === undefined || value === null) return null;
  const trimmed = typeof value === "string" ? value.trim() : value;
  return trimmed === "" ? null : trimmed;
}

function toNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
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

export default function CareersPanel() {
  const {
    programs,
    openings,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminCareers();
  const [programForm, setProgramForm] = useState(INITIAL_PROGRAM);
  const [openingForm, setOpeningForm] = useState(INITIAL_OPENING);
  const [requirementForm, setRequirementForm] = useState(INITIAL_REQUIREMENT);

  const statusCounts = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => ({ ...acc, [status]: openings.filter((opening) => opening.status === status).length }),
      {}
    );
  }, [openings]);

  async function handleProgramSubmit(event) {
    event.preventDefault();
    await createEntity("program", {
      title: programForm.title,
      heroTitle: nullable(programForm.heroTitle),
      heroBody: nullable(programForm.heroBody),
      eligibility: splitLines(programForm.eligibility),
    });
    setProgramForm(INITIAL_PROGRAM);
  }

  async function handleOpeningSubmit(event) {
    event.preventDefault();
    await createEntity("opening", {
      programId: openingForm.programId || null,
      title: openingForm.title,
      summary: nullable(openingForm.summary),
      department: nullable(openingForm.department),
      location: nullable(openingForm.location),
      jobType: nullable(openingForm.jobType),
      compensation: nullable(openingForm.compensation),
      status: openingForm.status,
      publishAt: nullable(openingForm.publishAt),
      expireAt: nullable(openingForm.expireAt),
      applyEmail: nullable(openingForm.applyEmail),
      applyUrl: nullable(openingForm.applyUrl),
    });
    setOpeningForm(INITIAL_OPENING);
  }

  async function handleRequirementSubmit(event) {
    event.preventDefault();
    await createEntity("requirement", {
      careerOpeningId: requirementForm.careerOpeningId,
      type: requirementForm.type,
      content: requirementForm.content,
      order: toNumber(requirementForm.order),
    });
    setRequirementForm(INITIAL_REQUIREMENT);
  }

  async function handleStatusChange(openingId, status) {
    await updateEntity("opening", { id: openingId, status });
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
          {error.message || "Failed to load careers"}
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
             <h3 className="text-lg font-semibold text-slate-900">Career Openings</h3>
             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
               {openings.length} Openings · {programs.length} Programs
             </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{status}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{statusCounts[status] || 0}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading openings...
              </div>
            </div>
          ) : null}

          {!loading && !openings.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No openings found. Use the form to create your first opening.
            </div>
          ) : null}

          <div className="space-y-4">
            {openings.map((opening) => (
              <article key={opening.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          {opening.program?.title || "General"}
                        </span>
                        <h4 className="font-semibold text-slate-900">{opening.title}</h4>
                      </div>
                      {opening.summary && <p className="text-sm text-slate-500 max-w-xl">{opening.summary}</p>}
                      <p className="text-xs text-slate-500">
                        <span className="font-medium text-slate-700">{opening.department || "Department TBD"}</span> · {opening.location || "Location TBD"}
                      </p>
                    </div>

                    <div className="flex items-center gap-3">
                      <select
                        value={opening.status}
                        onChange={(event) => handleStatusChange(opening.id, event.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {status}
                          </option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDelete("opening", opening.id, opening.title)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Opening"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500 sm:grid-cols-3">
                    <div>
                      <span className="block text-slate-400">Publish:</span>
                      <span className="font-medium text-slate-700">{formatDate(opening.publishAt)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Expire:</span>
                      <span className="font-medium text-slate-700">{formatDate(opening.expireAt)}</span>
                    </div>
                    <div>
                      <span className="block text-slate-400">Apply:</span>
                      <span className="font-medium text-slate-700 truncate block">{opening.applyEmail || opening.applyUrl || "—"}</span>
                    </div>
                  </div>

                  {opening.requirements?.length ? (
                    <div className="mt-4 rounded-lg border border-slate-100 bg-slate-50 p-3">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Requirements</p>
                      <ul className="mt-2 space-y-2">
                        {opening.requirements.map((requirement) => (
                          <li key={requirement.id} className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-slate-600">
                              <span className="font-semibold text-slate-800">{requirement.type}</span>: {requirement.content}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleDelete("requirement", requirement.id, requirement.content)}
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

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="Create Program"
              description="Add a new career program"
              onSubmit={handleProgramSubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={programForm.title} onChange={(e) => setProgramForm({ ...programForm, title: e.target.value })} required />
              <Input label="Hero Title" value={programForm.heroTitle} onChange={(e) => setProgramForm({ ...programForm, heroTitle: e.target.value })} />
              <TextArea label="Hero Body" value={programForm.heroBody} onChange={(e) => setProgramForm({ ...programForm, heroBody: e.target.value })} />
              <TextArea label="Eligibility (one per line)" rows={3} value={programForm.eligibility} onChange={(e) => setProgramForm({ ...programForm, eligibility: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Create Opening"
              description="Add a new job opening"
              onSubmit={handleOpeningSubmit}
              disabled={actionState.pending}
            >
              <Select label="Program" value={openingForm.programId} onChange={(e) => setOpeningForm({ ...openingForm, programId: e.target.value })}>
                 <option value="">General</option>
                 {programs.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
              </Select>
              <Input label="Title" value={openingForm.title} onChange={(e) => setOpeningForm({ ...openingForm, title: e.target.value })} required />
              <TextArea label="Summary" value={openingForm.summary} onChange={(e) => setOpeningForm({ ...openingForm, summary: e.target.value })} />
              <Input label="Department" value={openingForm.department} onChange={(e) => setOpeningForm({ ...openingForm, department: e.target.value })} />
              <Input label="Location" value={openingForm.location} onChange={(e) => setOpeningForm({ ...openingForm, location: e.target.value })} />
              <Input label="Job Type" value={openingForm.jobType} onChange={(e) => setOpeningForm({ ...openingForm, jobType: e.target.value })} />
              <Input label="Compensation" value={openingForm.compensation} onChange={(e) => setOpeningForm({ ...openingForm, compensation: e.target.value })} />
              <Select label="Status" value={openingForm.status} onChange={(e) => setOpeningForm({ ...openingForm, status: e.target.value })}>
                 {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>
              <Input label="Publish At" type="datetime-local" value={openingForm.publishAt} onChange={(e) => setOpeningForm({ ...openingForm, publishAt: e.target.value })} />
              <Input label="Expire At" type="datetime-local" value={openingForm.expireAt} onChange={(e) => setOpeningForm({ ...openingForm, expireAt: e.target.value })} />
              <Input label="Apply Email" type="email" value={openingForm.applyEmail} onChange={(e) => setOpeningForm({ ...openingForm, applyEmail: e.target.value })} />
              <Input label="Apply URL" type="url" value={openingForm.applyUrl} onChange={(e) => setOpeningForm({ ...openingForm, applyUrl: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Add Requirement"
              description="Add a requirement to an opening"
              onSubmit={handleRequirementSubmit}
              disabled={actionState.pending || !openings.length}
            >
              <Select label="Opening" value={requirementForm.careerOpeningId} onChange={(e) => setRequirementForm({ ...requirementForm, careerOpeningId: e.target.value })} required>
                 <option value="" disabled>Select Opening</option>
                 {openings.map((o) => <option key={o.id} value={o.id}>{o.title}</option>)}
              </Select>
              <Select label="Type" value={requirementForm.type} onChange={(e) => setRequirementForm({ ...requirementForm, type: e.target.value })}>
                 {REQUIREMENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
              </Select>
              <TextArea label="Content" value={requirementForm.content} onChange={(e) => setRequirementForm({ ...requirementForm, content: e.target.value })} required />
              <Input label="Order" type="number" value={requirementForm.order} onChange={(e) => setRequirementForm({ ...requirementForm, order: e.target.value })} />
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