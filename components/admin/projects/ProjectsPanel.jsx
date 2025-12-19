"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, Image, Link2, Sparkles, Briefcase } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useAdminProjects } from "@/hooks/useAdminProjects";
import SeoFields, { createEmptySeoState, serializeSeoState } from "@/components/admin/seo/SeoFields";
import MediaPicker from "@/components/admin/media/MediaPicker";

const STATUS_OPTIONS = ["PLANNED", "IN_PROGRESS", "COMPLETED", "ON_HOLD"];
const createInitialProjectForm = () => ({
  title: "",
  summary: "",
  status: "PLANNED",
  order: "",
  linkUrl: "",
  mediaUrl: "",
  mediaId: "",
  seo: createEmptySeoState(),
});

const createInitialSeoForm = () => ({
  projectId: "",
  seo: createEmptySeoState(),
});

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

function hydrateSeoForm(meta) {
  if (!meta) return createEmptySeoState();
  return {
    ...createEmptySeoState(),
    title: meta.title || "",
    description: meta.description || "",
    canonicalUrl: meta.canonicalUrl || "",
    keywords: meta.keywords || "",
    ogTitle: meta.ogTitle || "",
    ogDescription: meta.ogDescription || "",
    ogImageUrl: meta.ogImageUrl || "",
    twitterCard: meta.twitterCard || "summary_large_image",
    allowIndexing: typeof meta.allowIndexing === "boolean" ? meta.allowIndexing : true,
  };
}

export default function ProjectsPanel() {
  const {
    projects,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminProjects();

  const [projectForm, setProjectForm] = useState(() => createInitialProjectForm());
  const [seoForm, setSeoForm] = useState(() => createInitialSeoForm());
  const [activeTab, setActiveTab] = useState("create"); // "create" | "seo"

  const statusBuckets = useMemo(() => {
    return STATUS_OPTIONS.reduce((acc, status) => {
      acc[status] = projects.filter((project) => project.status === status).length;
      return acc;
    }, {});
  }, [projects]);

  async function handleProjectSubmit(event) {
    event.preventDefault();
    await createEntity("project", {
      title: projectForm.title,
      summary: nullable(projectForm.summary),
      status: projectForm.status,
      order: toNumber(projectForm.order),
      linkUrl: nullable(projectForm.linkUrl),
      mediaUrl: nullable(projectForm.mediaUrl) || undefined,
      mediaId: nullable(projectForm.mediaId) || undefined,
      seo: serializeSeoState(projectForm.seo),
    });
    setProjectForm(createInitialProjectForm());
  }

  async function handleStatusChange(projectId, status) {
    await updateEntity("project", { id: projectId, status });
  }

  async function handleDelete(projectId, label) {
    if (!projectId) return;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    await deleteEntity("project", { id: projectId });
  }

  async function handleSeoSubmit(event) {
    event.preventDefault();
    if (!seoForm.projectId) return;
    const seoPayload = serializeSeoState(seoForm.seo);
    if (!seoPayload) return;
    await updateEntity("project", {
      id: seoForm.projectId,
      seo: seoPayload,
    });
    setSeoForm(createInitialSeoForm());
    setActiveTab("create");
  }

  function prefillSeoForm(project) {
    setSeoForm({
      projectId: project.id,
      seo: hydrateSeoForm(project.seo),
    });
    setActiveTab("seo");
    const formElement = document.getElementById("projects-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
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
          {error.message || "Failed to load projects"}
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
            <h3 className="text-lg font-semibold text-slate-900">Project Portfolio</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {projects.length} Highlights
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
                <Loader2 className="h-5 w-5 animate-spin" /> Loading projects...
              </div>
            </div>
          ) : null}

          {!loading && !projects.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No projects found. Use the form to create your first project highlight.
            </div>
          ) : null}

          <div className="space-y-4">
            {projects.map((project) => (
              <article key={project.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-6">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Briefcase size={16} className="text-blue-500" />
                        <h4 className="font-semibold text-slate-900">{project.title}</h4>
                      </div>
                      {project.summary && <p className="text-sm text-slate-500 max-w-xl">{project.summary}</p>}

                      <div className="flex flex-wrap items-center gap-3 pt-2">
                        <span className="text-xs text-slate-400">Order: {project.order ?? 0}</span>
                        {project.linkUrl && (
                          <a href={project.linkUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
                            <Link2 size={12} />
                            External Link
                          </a>
                        )}
                        <span className="flex items-center gap-1 text-xs text-slate-500">
                          <Image size={12} />
                          {project.media?.label || (project.mediaUrl ? "External Media" : "No Media")}
                        </span>
                        <button
                          type="button"
                          onClick={() => prefillSeoForm(project)}
                          className={`flex items-center gap-1 text-xs font-medium ${project.seo ? "text-emerald-600" : "text-slate-400 hover:text-slate-600"}`}
                        >
                          <Sparkles size={12} />
                          {project.seo ? "SEO Configured" : "Configure SEO"}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 font-medium">{project.isVisible ? "Visible" : "Hidden"}</span>
                        <Switch
                          checked={project.isVisible}
                          onCheckedChange={(checked) => updateEntity("project", { id: project.id, isVisible: checked })}
                        />
                      </div>
                      <select
                        value={project.status || "PLANNED"}
                        onChange={(event) => handleStatusChange(project.id, event.target.value)}
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
                        onClick={() => handleDelete(project.id, project.title)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Project"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6" id="projects-form-container">
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
                onClick={() => setActiveTab("seo")}
                className={`flex-1 rounded-md py-1.5 text-xs font-medium transition ${activeTab === "seo" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                SEO
              </button>
            </div>

            {activeTab === "create" && (
              <ActionForm
                title="New Project"
                description="Add a project highlight"
                onSubmit={handleProjectSubmit}
                disabled={actionState.pending}
              >
                <Input label="Title" value={projectForm.title} onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })} required />
                <TextArea label="Summary" value={projectForm.summary} onChange={(e) => setProjectForm({ ...projectForm, summary: e.target.value })} />
                <Select label="Status" value={projectForm.status} onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                </Select>
                <Input label="Order" type="number" value={projectForm.order} onChange={(e) => setProjectForm({ ...projectForm, order: e.target.value })} />
                <Input label="Link URL" type="url" value={projectForm.linkUrl} onChange={(e) => setProjectForm({ ...projectForm, linkUrl: e.target.value })} />
                <Input label="Hero Media URL" type="url" value={projectForm.mediaUrl} onChange={(e) => setProjectForm({ ...projectForm, mediaUrl: e.target.value })} placeholder="https://..." />

                <div className="space-y-1.5">
                  <MediaPicker
                    label="Hero Media Asset"
                    category="projects"
                    value={projectForm.mediaId}
                    onChange={(assetId, asset) =>
                      setProjectForm((prev) => ({
                        ...prev,
                        mediaId: assetId || "",
                        mediaUrl: asset ? asset.url : prev.mediaUrl,
                      }))
                    }
                    disabled={actionState.pending}
                  />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Initial SEO (Optional)</p>
                  <SeoFields
                    value={projectForm.seo}
                    onChange={(seo) => setProjectForm((prev) => ({ ...prev, seo }))}
                    disabled={actionState.pending}
                  />
                </div>
              </ActionForm>
            )}

            {activeTab === "seo" && (
              <ActionForm
                title="Update SEO"
                description="Edit SEO metadata for existing project"
                onSubmit={handleSeoSubmit}
                disabled={actionState.pending || !projects.length}
              >
                <Select
                  label="Select Project"
                  value={seoForm.projectId}
                  onChange={(e) => setSeoForm({ ...seoForm, projectId: e.target.value })}
                  required
                >
                  <option value="" disabled>Select Project</option>
                  {projects.map((p) => <option key={p.id} value={p.id}>{p.title}</option>)}
                </Select>
                <SeoFields
                  value={seoForm.seo}
                  onChange={(seo) => setSeoForm((prev) => ({ ...prev, seo }))}
                  disabled={actionState.pending || !seoForm.projectId}
                />
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