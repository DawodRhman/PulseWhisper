"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, Layers, Link as LinkIcon, Pencil } from "lucide-react";
import { useAdminServices } from "@/hooks/useAdminServices";

const INITIAL_CATEGORY = { title: "", summary: "", heroCopy: "", order: "" };
const INITIAL_CARD = { categoryId: "", title: "", summary: "", iconKey: "FaTint", gradientClass: "", order: "" };
const INITIAL_DETAIL = { serviceCardId: "", heading: "", body: "", bulletPoints: "", order: "" };
const INITIAL_RESOURCE = {
  categoryId: "",
  title: "",
  description: "",
  externalUrl: "",
  mediaUrl: "",
};
const createInitialCategoryUpdate = () => ({ id: "", title: "", summary: "", heroCopy: "", order: "" });
const createInitialCardUpdate = () => ({
  id: "",
  categoryId: "",
  title: "",
  summary: "",
  description: "",
  iconKey: "FaTint",
  gradientClass: "",
  order: "",
});
const createInitialDetailUpdate = () => ({ id: "", heading: "", body: "", bulletPoints: "", order: "" });
const createInitialResourceUpdate = () => ({
  id: "",
  categoryId: "",
  title: "",
  description: "",
  externalUrl: "",
  mediaUrl: "",
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
  return `${hours}h ago`;
}

function bulletStringToArray(value) {
  return (value || "")
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function bulletArrayToString(list) {
  if (!Array.isArray(list) || !list.length) return "";
  return list.join("\n");
}

function optionalString(value, { allowNull = false } = {}) {
  if (value === undefined || value === null) return undefined;
  const trimmed = typeof value === "string" ? value.trim() : value;
  if (trimmed === "") return allowNull ? null : undefined;
  return trimmed;
}

export default function ServicesPanel() {
  const { categories, loading, error, lastFetchedAt, actionState, refresh, createEntity, updateEntity, deleteEntity } = useAdminServices();
  const [categoryForm, setCategoryForm] = useState(INITIAL_CATEGORY);
  const [cardForm, setCardForm] = useState(INITIAL_CARD);
  const [detailForm, setDetailForm] = useState(INITIAL_DETAIL);
  const [resourceForm, setResourceForm] = useState(INITIAL_RESOURCE);
  const [categoryUpdateForm, setCategoryUpdateForm] = useState(() => createInitialCategoryUpdate());
  const [cardUpdateForm, setCardUpdateForm] = useState(() => createInitialCardUpdate());
  const [detailUpdateForm, setDetailUpdateForm] = useState(() => createInitialDetailUpdate());
  const [resourceUpdateForm, setResourceUpdateForm] = useState(() => createInitialResourceUpdate());

  const cards = useMemo(() => categories.flatMap((category) => category.cards || []), [categories]);
  const totalDetails = useMemo(() => cards.reduce((sum, card) => sum + (card.details?.length || 0), 0), [cards]);
  const totalResources = useMemo(
    () => categories.reduce((sum, category) => sum + (category.resources?.length || 0), 0),
    [categories]
  );
  const detailOptions = useMemo(
    () => cards.flatMap((card) => (card.details || []).map((detail) => ({ ...detail, cardTitle: card.title }))),
    [cards]
  );
  const resourceOptions = useMemo(
    () =>
      categories.flatMap((category) =>
        (category.resources || []).map((resource) => ({
          ...resource,
          categoryId: resource.categoryId || resource.serviceCategoryId || category.id,
          categoryTitle: category.title,
        }))
      ),
    [categories]
  );

  async function handleCategorySubmit(event) {
    event.preventDefault();
    await createEntity("category", {
      title: categoryForm.title,
      summary: categoryForm.summary || null,
      heroCopy: categoryForm.heroCopy || null,
      order: toNumber(categoryForm.order),
    });
    setCategoryForm(INITIAL_CATEGORY);
  }

  async function handleCardSubmit(event) {
    event.preventDefault();
    await createEntity("card", {
      categoryId: cardForm.categoryId,
      title: cardForm.title,
      summary: cardForm.summary || null,
      iconKey: cardForm.iconKey || "FaTint",
      gradientClass: cardForm.gradientClass || "from-blue-100 to-blue-300",
      order: toNumber(cardForm.order),
    });
    setCardForm(INITIAL_CARD);
  }

  async function handleDetailSubmit(event) {
    event.preventDefault();
    await createEntity("detail", {
      serviceCardId: detailForm.serviceCardId,
      heading: detailForm.heading,
      body: detailForm.body || null,
      bulletPoints: bulletStringToArray(detailForm.bulletPoints),
      order: toNumber(detailForm.order),
    });
    setDetailForm(INITIAL_DETAIL);
  }

  async function handleResourceSubmit(event) {
    event.preventDefault();
    await createEntity("resource", {
      categoryId: resourceForm.categoryId,
      title: resourceForm.title,
      description: resourceForm.description || null,
      externalUrl: resourceForm.externalUrl || null,
      mediaUrl: resourceForm.mediaUrl || undefined,
    });
    setResourceForm(INITIAL_RESOURCE);
  }

  function handleCategorySelectForEdit(categoryId) {
    if (!categoryId) {
      setCategoryUpdateForm(createInitialCategoryUpdate());
      return;
    }
    const category = categories.find((entry) => entry.id === categoryId);
    if (!category) return;
    setCategoryUpdateForm({
      id: category.id,
      title: category.title || "",
      summary: category.summary || "",
      heroCopy: category.heroCopy || "",
      order: category.order?.toString() ?? "",
    });
  }

  function handleCardSelectForEdit(cardId) {
    if (!cardId) {
      setCardUpdateForm(createInitialCardUpdate());
      return;
    }
    const card = cards.find((entry) => entry.id === cardId);
    if (!card) return;
    setCardUpdateForm({
      id: card.id,
      categoryId: card.categoryId || card.serviceCategoryId || "",
      title: card.title || "",
      summary: card.summary || "",
      description: card.description || "",
      iconKey: card.iconKey || "FaTint",
      gradientClass: card.gradientClass || "from-blue-100 to-blue-300",
      order: card.order?.toString() ?? "",
    });
  }

  function handleDetailSelectForEdit(detailId) {
    if (!detailId) {
      setDetailUpdateForm(createInitialDetailUpdate());
      return;
    }
    const detail = detailOptions.find((entry) => entry.id === detailId);
    if (!detail) return;
    setDetailUpdateForm({
      id: detail.id,
      heading: detail.heading || "",
      body: detail.body || "",
      bulletPoints: bulletArrayToString(detail.bulletPoints),
      order: detail.order?.toString() ?? "",
    });
  }

  function handleResourceSelectForEdit(resourceId) {
    if (!resourceId) {
      setResourceUpdateForm(createInitialResourceUpdate());
      return;
    }
    const resource = resourceOptions.find((entry) => entry.id === resourceId);
    if (!resource) return;
    setResourceUpdateForm({
      id: resource.id,
      categoryId: resource.categoryId || "",
      title: resource.title || "",
      description: resource.description || "",
      externalUrl: resource.externalUrl || "",
      mediaUrl: (resource.media && resource.media.url) || resource.mediaUrl || "",
    });
  }

  async function handleCategoryUpdateSubmit(event) {
    event.preventDefault();
    if (!categoryUpdateForm.id) return;
    await updateEntity("category", {
      id: categoryUpdateForm.id,
      title: categoryUpdateForm.title,
      summary: categoryUpdateForm.summary,
      heroCopy: categoryUpdateForm.heroCopy,
      order: toNumber(categoryUpdateForm.order),
    });
    setCategoryUpdateForm(createInitialCategoryUpdate());
  }

  async function handleCardUpdateSubmit(event) {
    event.preventDefault();
    if (!cardUpdateForm.id) return;
    await updateEntity("card", {
      id: cardUpdateForm.id,
      categoryId: cardUpdateForm.categoryId || undefined,
      title: cardUpdateForm.title,
      summary: cardUpdateForm.summary,
      description: cardUpdateForm.description,
      iconKey: cardUpdateForm.iconKey || "FaTint",
      gradientClass: cardUpdateForm.gradientClass || "from-blue-100 to-blue-300",
      order: toNumber(cardUpdateForm.order),
    });
    setCardUpdateForm(createInitialCardUpdate());
  }

  async function handleDetailUpdateSubmit(event) {
    event.preventDefault();
    if (!detailUpdateForm.id) return;
    await updateEntity("detail", {
      id: detailUpdateForm.id,
      heading: detailUpdateForm.heading,
      body: detailUpdateForm.body || undefined,
      bulletPoints: bulletStringToArray(detailUpdateForm.bulletPoints),
      order: toNumber(detailUpdateForm.order),
    });
    setDetailUpdateForm(createInitialDetailUpdate());
  }

  async function handleResourceUpdateSubmit(event) {
    event.preventDefault();
    if (!resourceUpdateForm.id) return;
    await updateEntity("resource", {
      id: resourceUpdateForm.id,
      categoryId: resourceUpdateForm.categoryId || undefined,
      title: resourceUpdateForm.title,
      description: resourceUpdateForm.description || undefined,
      externalUrl: optionalString(resourceUpdateForm.externalUrl, { allowNull: true }),
      mediaUrl: optionalString(resourceUpdateForm.mediaUrl),
    });
    setResourceUpdateForm(createInitialResourceUpdate());
  }

  async function handleDelete(type, id, label) {
    if (!id) return;
    if (!window.confirm(`Delete ${label}? This action cannot be undone.`)) return;
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
          {error.message || "Failed to load services"}
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
             <h3 className="text-lg font-semibold text-slate-900">Service Hierarchy</h3>
             <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
               {categories.length} Categories
             </span>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading services...
              </div>
            </div>
          ) : null}

          {!loading && !categories.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No categories found. Use the form to create your first service category.
            </div>
          ) : null}

          <div className="space-y-6">
            {categories.map((category) => (
              <article key={category.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="border-b border-slate-100 bg-slate-50/50 px-6 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <Layers size={16} className="text-blue-500" />
                        <h4 className="font-semibold text-slate-900">{category.title}</h4>
                      </div>
                      {category.summary && <p className="mt-1 text-sm text-slate-500">{category.summary}</p>}
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => handleCategorySelectForEdit(category.id)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition"
                        title="Edit Category"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete("category", category.id, category.title)}
                        className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition"
                        title="Delete Category"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="p-6 space-y-6">
                  {/* Cards Section */}
                  <div>
                    <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Service Cards</h5>
                    {category.cards?.length ? (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {category.cards.map((card) => (
                          <div key={card.id} className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                            <div className="flex justify-between items-start mb-2">
                               <h6 className="font-medium text-slate-900">{card.title}</h6>
                               <div className="flex items-center gap-1">
                                 <button
                                    type="button"
                                    onClick={() => handleCardSelectForEdit(card.id)}
                                    className="text-slate-400 hover:text-blue-600 rounded-md p-1"
                                    title="Edit Card"
                                  >
                                    <Pencil size={14} />
                                  </button>
                                 <button
                                    onClick={() => handleDelete("card", card.id, card.title)}
                                    className="text-slate-400 hover:text-rose-500 rounded-md p-1"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                               </div>
                            </div>
                            {card.summary && <p className="text-xs text-slate-500 mb-3 line-clamp-2">{card.summary}</p>}
                            
                            {card.details?.length > 0 && (
                               <div className="space-y-1 border-t border-slate-200 pt-2">
                                  {card.details.map((detail) => (
                                    <div key={detail.id} className="flex items-center justify-between text-xs group">
                                       <span className="text-slate-600 truncate pr-2">- {detail.heading}</span>
                                       <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition">
                                         <button
                                            type="button"
                                            onClick={() => handleDetailSelectForEdit(detail.id)}
                                            className="text-slate-400 hover:text-blue-600"
                                          >
                                            <Pencil size={10} />
                                          </button>
                                         <button
                                            onClick={() => handleDelete("detail", detail.id, detail.heading)}
                                            className="text-slate-400 hover:text-rose-500"
                                         >
                                            <Trash2 size={10} />
                                         </button>
                                       </div>
                                    </div>
                                  ))}
                               </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-sm text-slate-400 italic">No service cards added yet.</p>
                    )}
                  </div>

                  {/* Resources Section */}
                  {category.resources?.length > 0 && (
                    <div>
                      <h5 className="mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">Downloads & Resources</h5>
                      <div className="space-y-2">
                        {category.resources.map((resource) => (
                          <div key={resource.id} className="flex items-center justify-between rounded-lg border border-slate-100 bg-white px-4 py-2.5 text-sm">
                            <div className="flex items-center gap-3">
                              <LinkIcon size={14} className="text-slate-400" />
                              <span className="font-medium text-slate-700">{resource.title}</span>
                              {resource.description && <span className="hidden sm:inline text-slate-400 text-xs">— {resource.description}</span>}
                            </div>
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleResourceSelectForEdit(resource.id)}
                                className="text-slate-400 hover:text-blue-600 rounded-md p-1"
                                title="Edit Resource"
                              >
                                <Pencil size={14} />
                              </button>
                              <button
                                onClick={() => handleDelete("resource", resource.id, resource.title)}
                                className="text-slate-400 hover:text-rose-500 rounded-md p-1"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ))}
          </div>
        </section>

        <aside className="space-y-6">
          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="New Category"
              description="Create a main service category"
              onSubmit={handleCategorySubmit}
              disabled={actionState.pending}
            >
              <Input label="Title" value={categoryForm.title} onChange={(e) => setCategoryForm({ ...categoryForm, title: e.target.value })} required />
              <TextArea label="Summary" value={categoryForm.summary} onChange={(e) => setCategoryForm({ ...categoryForm, summary: e.target.value })} />
              <TextArea label="Hero Copy" value={categoryForm.heroCopy} onChange={(e) => setCategoryForm({ ...categoryForm, heroCopy: e.target.value })} />
              <Input label="Order" type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="New Service Card"
              description="Add a card to a category"
              onSubmit={handleCardSubmit}
              disabled={actionState.pending || !categories.length}
            >
              <Select
                label="Category"
                value={cardForm.categoryId}
                onChange={(e) => setCardForm({ ...cardForm, categoryId: e.target.value })}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Title" value={cardForm.title} onChange={(e) => setCardForm({ ...cardForm, title: e.target.value })} required />
              <TextArea label="Summary" value={cardForm.summary} onChange={(e) => setCardForm({ ...cardForm, summary: e.target.value })} />
              <Input label="Icon Key (e.g. FaTint)" value={cardForm.iconKey} onChange={(e) => setCardForm({ ...cardForm, iconKey: e.target.value })} />
              <Input label="Gradient Class" value={cardForm.gradientClass} onChange={(e) => setCardForm({ ...cardForm, gradientClass: e.target.value })} placeholder="from-blue-100 to-blue-300" />
              <Input label="Order" type="number" value={cardForm.order} onChange={(e) => setCardForm({ ...cardForm, order: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Add Detail Bullet"
              description="Add details to a service card"
              onSubmit={handleDetailSubmit}
              disabled={actionState.pending || !cards.length}
            >
              <Select
                label="Service Card"
                value={detailForm.serviceCardId}
                onChange={(e) => setDetailForm({ ...detailForm, serviceCardId: e.target.value })}
                required
              >
                <option value="" disabled>Select Card</option>
                {cards.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Heading" value={detailForm.heading} onChange={(e) => setDetailForm({ ...detailForm, heading: e.target.value })} required />
              <TextArea label="Body" value={detailForm.body} onChange={(e) => setDetailForm({ ...detailForm, body: e.target.value })} />
              <TextArea label="Bullet Points (one per line)" value={detailForm.bulletPoints} onChange={(e) => setDetailForm({ ...detailForm, bulletPoints: e.target.value })} rows={3} />
              <Input label="Order" type="number" value={detailForm.order} onChange={(e) => setDetailForm({ ...detailForm, order: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Add Resource"
              description="Link a downloadable resource"
              onSubmit={handleResourceSubmit}
              disabled={actionState.pending || !categories.length}
            >
              <Select
                label="Category"
                value={resourceForm.categoryId}
                onChange={(e) => setResourceForm({ ...resourceForm, categoryId: e.target.value })}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Title" value={resourceForm.title} onChange={(e) => setResourceForm({ ...resourceForm, title: e.target.value })} required />
              <TextArea label="Description" value={resourceForm.description} onChange={(e) => setResourceForm({ ...resourceForm, description: e.target.value })} />
              <Input label="External URL" type="url" value={resourceForm.externalUrl} onChange={(e) => setResourceForm({ ...resourceForm, externalUrl: e.target.value })} />
              <Input label="Media URL" type="url" value={resourceForm.mediaUrl} onChange={(e) => setResourceForm({ ...resourceForm, mediaUrl: e.target.value })} />
            </ActionForm>

            <ActionForm
              title="Update Category"
              description="Edit titles, copy, or ordering for an existing category"
              onSubmit={handleCategoryUpdateSubmit}
              disabled={actionState.pending || !categories.length}
              submitLabel="Save Changes"
            >
              <Select
                label="Category"
                value={categoryUpdateForm.id}
                onChange={(e) => handleCategorySelectForEdit(e.target.value)}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Title" value={categoryUpdateForm.title} onChange={(e) => setCategoryUpdateForm({ ...categoryUpdateForm, title: e.target.value })} required disabled={!categoryUpdateForm.id} />
              <TextArea label="Summary" value={categoryUpdateForm.summary} onChange={(e) => setCategoryUpdateForm({ ...categoryUpdateForm, summary: e.target.value })} disabled={!categoryUpdateForm.id} />
              <TextArea label="Hero Copy" value={categoryUpdateForm.heroCopy} onChange={(e) => setCategoryUpdateForm({ ...categoryUpdateForm, heroCopy: e.target.value })} disabled={!categoryUpdateForm.id} />
              <Input label="Order" type="number" value={categoryUpdateForm.order} onChange={(e) => setCategoryUpdateForm({ ...categoryUpdateForm, order: e.target.value })} disabled={!categoryUpdateForm.id} />
            </ActionForm>

            <ActionForm
              title="Update Service Card"
              description="Retitle, recolor, or reorder a card"
              onSubmit={handleCardUpdateSubmit}
              disabled={actionState.pending || !cards.length}
              submitLabel="Save Changes"
            >
              <Select
                label="Service Card"
                value={cardUpdateForm.id}
                onChange={(e) => handleCardSelectForEdit(e.target.value)}
                required
              >
                <option value="" disabled>Select Card</option>
                {cards.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Select
                label="Category"
                value={cardUpdateForm.categoryId}
                onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, categoryId: e.target.value })}
                disabled={!cardUpdateForm.id}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Title" value={cardUpdateForm.title} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, title: e.target.value })} required disabled={!cardUpdateForm.id} />
              <TextArea label="Summary" value={cardUpdateForm.summary} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, summary: e.target.value })} disabled={!cardUpdateForm.id} />
              <TextArea label="Description" value={cardUpdateForm.description} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, description: e.target.value })} disabled={!cardUpdateForm.id} />
              <Input label="Icon Key" value={cardUpdateForm.iconKey} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, iconKey: e.target.value })} disabled={!cardUpdateForm.id} />
              <Input label="Gradient Class" value={cardUpdateForm.gradientClass} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, gradientClass: e.target.value })} placeholder="from-blue-100 to-blue-300" disabled={!cardUpdateForm.id} />
              <Input label="Order" type="number" value={cardUpdateForm.order} onChange={(e) => setCardUpdateForm({ ...cardUpdateForm, order: e.target.value })} disabled={!cardUpdateForm.id} />
            </ActionForm>

            <ActionForm
              title="Update Detail Bullet"
              description="Edit detail text or bullet points"
              onSubmit={handleDetailUpdateSubmit}
              disabled={actionState.pending || !detailOptions.length}
              submitLabel="Save Changes"
            >
              <Select
                label="Detail"
                value={detailUpdateForm.id}
                onChange={(e) => handleDetailSelectForEdit(e.target.value)}
                required
              >
                <option value="" disabled>Select Detail</option>
                {detailOptions.map((detail) => (
                  <option key={detail.id} value={detail.id}>
                    {detail.cardTitle ? `${detail.cardTitle} > ${detail.heading}` : detail.heading}
                  </option>
                ))}
              </Select>
              <Input label="Heading" value={detailUpdateForm.heading} onChange={(e) => setDetailUpdateForm({ ...detailUpdateForm, heading: e.target.value })} required disabled={!detailUpdateForm.id} />
              <TextArea label="Body" value={detailUpdateForm.body} onChange={(e) => setDetailUpdateForm({ ...detailUpdateForm, body: e.target.value })} disabled={!detailUpdateForm.id} />
              <TextArea label="Bullet Points (one per line)" value={detailUpdateForm.bulletPoints} onChange={(e) => setDetailUpdateForm({ ...detailUpdateForm, bulletPoints: e.target.value })} rows={3} disabled={!detailUpdateForm.id} />
              <Input label="Order" type="number" value={detailUpdateForm.order} onChange={(e) => setDetailUpdateForm({ ...detailUpdateForm, order: e.target.value })} disabled={!detailUpdateForm.id} />
            </ActionForm>

            <ActionForm
              title="Update Resource"
              description="Retitle or re-link a download"
              onSubmit={handleResourceUpdateSubmit}
              disabled={actionState.pending || !resourceOptions.length}
              submitLabel="Save Changes"
            >
              <Select
                label="Resource"
                value={resourceUpdateForm.id}
                onChange={(e) => handleResourceSelectForEdit(e.target.value)}
                required
              >
                <option value="" disabled>Select Resource</option>
                {resourceOptions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.categoryTitle ? `${r.categoryTitle} > ${r.title}` : r.title}
                  </option>
                ))}
              </Select>
              <Select
                label="Category"
                value={resourceUpdateForm.categoryId}
                onChange={(e) => setResourceUpdateForm({ ...resourceUpdateForm, categoryId: e.target.value })}
                disabled={!resourceUpdateForm.id}
                required
              >
                <option value="" disabled>Select Category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
              </Select>
              <Input label="Title" value={resourceUpdateForm.title} onChange={(e) => setResourceUpdateForm({ ...resourceUpdateForm, title: e.target.value })} required disabled={!resourceUpdateForm.id} />
              <TextArea label="Description" value={resourceUpdateForm.description} onChange={(e) => setResourceUpdateForm({ ...resourceUpdateForm, description: e.target.value })} disabled={!resourceUpdateForm.id} />
              <Input label="External URL" type="url" value={resourceUpdateForm.externalUrl} onChange={(e) => setResourceUpdateForm({ ...resourceUpdateForm, externalUrl: e.target.value })} disabled={!resourceUpdateForm.id} />
              <Input label="Media URL" type="url" value={resourceUpdateForm.mediaUrl} onChange={(e) => setResourceUpdateForm({ ...resourceUpdateForm, mediaUrl: e.target.value })} disabled={!resourceUpdateForm.id} />
            </ActionForm>
          </div>
        </aside>
      </div>
    </div>
  );
}

function ActionForm({ title, description, children, onSubmit, disabled, submitLabel }) {
  const buttonLabel =
    submitLabel ||
    (title && title.toLowerCase().includes("update") ? "Save Changes" : title && title.toLowerCase().includes("edit") ? "Save Changes" : "Create");
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
        {buttonLabel}
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
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
        className="mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed"
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
