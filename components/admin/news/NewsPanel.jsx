"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, CalendarDays, Tag as TagIcon, Hash } from "lucide-react";
import { useAdminNews } from "@/hooks/useAdminNews";
import MediaAssetSelect from "@/components/admin/media/MediaAssetSelect";

const STATUS_OPTIONS = ["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"];
const INITIAL_CATEGORY = { title: "", slug: "", order: "" };
const INITIAL_TAG = { title: "", slug: "" };
const INITIAL_ARTICLE = {
  title: "",
  slug: "",
  summary: "",
  contentBody: "",
  categoryId: "",
  status: "DRAFT",
  publishedAt: "",
  heroMediaUrl: "",
  heroMediaId: "",
  tagIds: [],
};

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

export default function NewsPanel() {
  const {
    categories,
    tags,
    articles,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminNews();

  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY);
  const [tagForm, setTagForm] = useState(INITIAL_TAG);
  const [articleForm, setArticleForm] = useState(INITIAL_ARTICLE);

  const statusBuckets = useMemo(() => {
    return STATUS_OPTIONS.reduce(
      (acc, status) => ({ ...acc, [status]: articles.filter((article) => article.status === status).length }),
      {}
    );
  }, [articles]);

  const selectedTags = useMemo(() => new Set(articleForm.tagIds), [articleForm.tagIds]);

  async function handleCategorySubmit(event) {
    event.preventDefault();
    await createEntity("category", {
      title: categoryForm.title,
      slug: nullable(categoryForm.slug) || undefined,
      order: toNumber(categoryForm.order),
    });
    setCategoryForm(INITIAL_CATEGORY);
  }

  async function handleTagSubmit(event) {
    event.preventDefault();
    await createEntity("tag", {
      title: tagForm.title,
      slug: nullable(tagForm.slug) || undefined,
    });
    setTagForm(INITIAL_TAG);
  }

  async function handleArticleSubmit(event) {
    event.preventDefault();
    await createEntity("article", {
      title: articleForm.title,
      slug: nullable(articleForm.slug) || undefined,
      summary: nullable(articleForm.summary),
      contentBody: nullable(articleForm.contentBody),
      categoryId: articleForm.categoryId || null,
      status: articleForm.status,
      publishedAt: nullable(articleForm.publishedAt),
      heroMediaUrl: nullable(articleForm.heroMediaUrl) || undefined,
      heroMediaId: nullable(articleForm.heroMediaId) || undefined,
      tagIds: articleForm.tagIds,
    });
    setArticleForm(INITIAL_ARTICLE);
  }

  async function handleStatusChange(articleId, status) {
    await updateEntity("article", { id: articleId, status });
  }

  async function handleDelete(type, id, label) {
    if (!id) return;
    if (!window.confirm(`Delete ${label}? This cannot be undone.`)) return;
    await deleteEntity(type, { id });
  }

  function toggleTag(tagId) {
    setArticleForm((prev) => {
      const next = new Set(prev.tagIds);
      if (next.has(tagId)) {
        next.delete(tagId);
      } else {
        next.add(tagId);
      }
      return { ...prev, tagIds: Array.from(next) };
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
          {error.message || "Failed to load news"}
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
             <h3 className="text-lg font-semibold text-slate-900">Newsroom</h3>
             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
               {articles.length} Articles
             </span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {STATUS_OPTIONS.map((status) => (
              <div key={status} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{status}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{statusBuckets[status] || 0}</p>
              </div>
            ))}
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading articles...
              </div>
            </div>
          ) : null}

          {!loading && !articles.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No articles found. Use the form to draft one.
            </div>
          ) : null}

          <div className="space-y-4">
            {articles.map((article) => (
              <article key={article.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-slate-600">
                          Article
                        </span>
                        <span className="text-xs text-slate-500">
                          {article.category?.title || "Unassigned"}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold text-slate-900">{article.title}</h4>
                      {article.summary && <p className="text-sm text-slate-600 line-clamp-2">{article.summary}</p>}
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <select
                        value={article.status}
                        onChange={(event) => handleStatusChange(article.id, event.target.value)}
                        className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>{status}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => handleDelete("article", article.id, article.title)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        aria-label={`Delete ${article.title}`}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-slate-100 pt-4 text-xs text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <CalendarDays size={14} className="text-slate-400" />
                      <span>{formatDate(article.publishedAt)}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium text-slate-600">Hero:</span>
                      {article.heroMedia?.label || "None"}
                    </div>
                    <div className="flex items-center gap-1.5">
                      <TagIcon size={14} className="text-slate-400" />
                      <span>
                        {article.tags?.length
                          ? article.tags.map((entry) => entry.tag?.title).filter(Boolean).join(", ")
                          : "No tags"}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h4 className="text-sm font-bold text-slate-900 mb-4">Taxonomy Management</h4>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Categories</p>
                  <span className="text-xs text-slate-400">{categories.length} total</span>
                </div>
                <ul className="space-y-2">
                  {categories.length ? (
                    categories.map((category) => (
                      <li key={category.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{category.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{category.slug}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete("category", category.id, category.title)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 italic">No categories defined.</li>
                  )}
                </ul>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</p>
                  <span className="text-xs text-slate-400">{tags.length} total</span>
                </div>
                <ul className="space-y-2">
                  {tags.length ? (
                    tags.map((tag) => (
                      <li key={tag.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2">
                        <div>
                          <p className="text-sm font-medium text-slate-900">{tag.title}</p>
                          <p className="text-xs text-slate-500 font-mono">{tag.slug}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDelete("tag", tag.id, tag.title)}
                          className="text-slate-400 hover:text-rose-600 transition"
                        >
                          <Trash2 size={14} />
                        </button>
                      </li>
                    ))
                  ) : (
                    <li className="text-xs text-slate-500 italic">No tags defined.</li>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="Create Category"
              description="Add a new news category"
              onSubmit={handleCategorySubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} required />
              <Input label="Custom Slug" value={categoryForm.slug} onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })} placeholder="Auto-generated if blank" />
              <Input label="Order" type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Create Tag"
              description="Add a new descriptive tag"
              onSubmit={handleTagSubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={tagForm.title} onChange={(e) => setTagForm({ ...tagForm, title: e.target.value })} required />
              <Input label="Custom Slug" value={tagForm.slug} onChange={(e) => setTagForm({ ...tagForm, slug: e.target.value })} placeholder="Auto-generated if blank" />
            </ActionForm>

            <ActionForm
              title="Publish Article"
              description="Create a new news article"
              onSubmit={handleArticleSubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={articleForm.title} onChange={(e) => setArticleForm({ ...articleForm, title: e.target.value })} required />
              <TextArea label="Summary" value={articleForm.summary} onChange={(e) => setArticleForm({ ...articleForm, summary: e.target.value })} required />
              <TextArea label="Body (Markdown/HTML)" rows={6} value={articleForm.contentBody} onChange={(e) => setArticleForm({ ...articleForm, contentBody: e.target.value })} />
              
              <Select label="Category" value={articleForm.categoryId} onChange={(e) => setArticleForm({ ...articleForm, categoryId: e.target.value })}>
                <option value="">Unassigned</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>

              <Select label="Status" value={articleForm.status} onChange={(e) => setArticleForm({ ...articleForm, status: e.target.value })}>
                {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
              </Select>

              <Input label="Published At" type="datetime-local" value={articleForm.publishedAt} onChange={(e) => setArticleForm({ ...articleForm, publishedAt: e.target.value })} />
              
              <div className="space-y-3 pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-500">Hero Media</p>
                <Input label="Remote URL" type="url" value={articleForm.heroMediaUrl} onChange={(e) => setArticleForm({ ...articleForm, heroMediaUrl: e.target.value })} placeholder="https://..." />
                <MediaAssetSelect
                  label="Or Select from Library"
                  placeholder="Select media asset"
                  helperText="Pick from the Media Library or paste an external URL above."
                  value={articleForm.heroMediaId}
                  onChange={(assetId, asset) =>
                    setArticleForm((prev) => ({
                      ...prev,
                      heroMediaId: assetId || "",
                      heroMediaUrl: asset ? asset.url : prev.heroMediaUrl,
                    }))
                  }
                  disabled={actionState.pending}
                />
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tags</p>
                {tags.length ? (
                  <div className="grid grid-cols-2 gap-2">
                    {tags.map((tag) => (
                      <label key={tag.id} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                        <input
                          type="checkbox"
                          checked={selectedTags.has(tag.id)}
                          onChange={() => toggleTag(tag.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="truncate">{tag.title}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 italic">Create tags first to attach metadata.</p>
                )}
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
        {title.includes("Update") || title.includes("Edit") ? "Save Changes" : "Create"}
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

function TextArea({ label, rows = 2, ...props }) {
  return (
    <label className="block">
      <span className="text-xs font-semibold text-slate-500">{label}</span>
      <textarea
        rows={rows}
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