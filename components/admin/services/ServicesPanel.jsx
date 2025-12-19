"use client";
import { useMemo, useState } from "react";
import { Loader2, Plus, RefreshCcw, Trash2, Layers, Link as LinkIcon, Pencil } from "lucide-react";
import { useAdminServices } from "@/hooks/useAdminServices";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { AdminTextarea } from "@/components/admin/ui/AdminTextarea";
import { ActionForm } from "@/components/admin/ui/ActionForm";
import MediaPicker from "@/components/admin/media/MediaPicker";
import { SearchInput } from "@/components/admin/ui/SearchInput";
import { AdminRichText } from "@/components/admin/ui/AdminRichText";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  serviceCategorySchema,
  updateServiceCategorySchema,
  serviceCardSchema,
  updateServiceCardSchema,
  serviceDetailSchema,
  updateServiceDetailSchema,
  serviceResourceSchema,
  updateServiceResourceSchema
} from "@/lib/validators/admin";
import { z } from "zod";



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



export default function ServicesPanel() {
  const { categories, loading, error, lastFetchedAt, actionState, refresh, createEntity, updateEntity, deleteEntity } = useAdminServices();

  // --- Create Forms ---
  const {
    register: registerCategory,
    handleSubmit: handleSubmitCategory,
    reset: resetCategory,
    formState: { errors: errorsCategory, isSubmitting: creatingCategory }
  } = useForm({
    resolver: zodResolver(serviceCategorySchema),
    defaultValues: { title: "", summary: "", heroCopy: "", order: "" }
  });

  const {
    register: registerCard,
    control: controlCard,
    handleSubmit: handleSubmitCard,
    reset: resetCard,
    formState: { errors: errorsCard, isSubmitting: creatingCard }
  } = useForm({
    resolver: zodResolver(serviceCardSchema),
    defaultValues: { categoryId: "", title: "", summary: "", description: "", iconKey: "FaTint", gradientClass: "", order: "" }
  });

  const {
    register: registerDetail,
    control: controlDetail,
    handleSubmit: handleSubmitDetail,
    reset: resetDetail,
    formState: { errors: errorsDetail, isSubmitting: creatingDetail }
  } = useForm({
    resolver: zodResolver(serviceDetailSchema),
    defaultValues: { serviceCardId: "", heading: "", body: "", bulletPoints: "", order: "" }
  });

  const {
    register: registerResource,
    control: controlResource,
    handleSubmit: handleSubmitResource,
    setValue: setResourceValue,
    watch: watchResource,
    reset: resetResource,
    formState: { errors: errorsResource, isSubmitting: creatingResource }
  } = useForm({
    resolver: zodResolver(serviceResourceSchema),
    defaultValues: { categoryId: "", title: "", description: "", externalUrl: "", mediaId: "", mediaUrl: "" }
  });

  // --- Update Forms ---
  const {
    register: registerCategoryUpdate,
    handleSubmit: handleSubmitCategoryUpdate,
    reset: resetCategoryUpdate,
    setValue: setCategoryUpdate,
    watch: watchCategoryUpdate,
    formState: { errors: errorsCategoryUpdate, isSubmitting: updatingCategory }
  } = useForm({
    resolver: zodResolver(updateServiceCategorySchema),
    defaultValues: { id: "", title: "", summary: "", heroCopy: "", order: "" }
  });

  const {
    register: registerCardUpdate,
    control: controlCardUpdate,
    handleSubmit: handleSubmitCardUpdate,
    reset: resetCardUpdate,
    setValue: setCardUpdate,
    watch: watchCardUpdate,
    formState: { errors: errorsCardUpdate, isSubmitting: updatingCard }
  } = useForm({
    resolver: zodResolver(updateServiceCardSchema),
    defaultValues: { id: "", categoryId: "", title: "", summary: "", description: "", iconKey: "", gradientClass: "", order: "" }
  });

  const {
    register: registerDetailUpdate,
    control: controlDetailUpdate,
    handleSubmit: handleSubmitDetailUpdate,
    reset: resetDetailUpdate,
    setValue: setDetailUpdate,
    watch: watchDetailUpdate,
    formState: { errors: errorsDetailUpdate, isSubmitting: updatingDetail }
  } = useForm({
    resolver: zodResolver(updateServiceDetailSchema),
    defaultValues: { id: "", serviceCardId: "", heading: "", body: "", bulletPoints: "", order: "" }
  });

  const {
    register: registerResourceUpdate,
    control: controlResourceUpdate,
    handleSubmit: handleSubmitResourceUpdate,
    reset: resetResourceUpdate,
    setValue: setResourceUpdate,
    watch: watchResourceUpdate,
    formState: { errors: errorsResourceUpdate, isSubmitting: updatingResource }
  } = useForm({
    resolver: zodResolver(updateServiceResourceSchema),
    defaultValues: { id: "", categoryId: "", title: "", description: "", externalUrl: "", mediaId: "", mediaUrl: "" }
  });

  const [activeTab, setActiveTab] = useState("create"); // "create" | "edit"
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = useMemo(() => {
    if (!searchTerm) return categories;
    const lower = searchTerm.toLowerCase();

    return categories.map(category => {
      // Check if category matches
      const categoryMatches =
        category.title.toLowerCase().includes(lower) ||
        (category.summary && category.summary.toLowerCase().includes(lower));

      // Check valid cards
      const matchingCards = (category.cards || []).filter(card =>
        card.title.toLowerCase().includes(lower) ||
        (card.summary && card.summary.toLowerCase().includes(lower))
      );

      // If category matches, show all cards (or maybe none if we want to drill down? let's show all original cards if cat matches)
      // Actually, if category matches, we clearly want to see the category.
      // If category doesn't match, but cards do, we show category with ONLY matching cards.

      if (categoryMatches) return category;

      if (matchingCards.length > 0) {
        return { ...category, cards: matchingCards };
      }

      return null;
    }).filter(Boolean);
  }, [categories, searchTerm]);

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

  async function handleCategorySubmit(data) {
    await createEntity("category", data);
    resetCategory();
  }

  async function handleCardSubmit(data) {
    await createEntity("card", data);
    resetCard();
  }

  async function handleDetailSubmit(data) {
    await createEntity("detail", data);
    resetDetail();
  }

  async function handleResourceSubmit(data) {
    await createEntity("resource", data);
    resetResource();
  }

  function scrollToForm() {
    document.getElementById("services-form-container")?.scrollIntoView({ behavior: "smooth" });
  }

  function handleCategorySelectForEdit(categoryId) {
    if (!categoryId) return;
    const category = categories.find((entry) => entry.id === categoryId);
    if (!category) return;
    resetCategoryUpdate({
      id: category.id,
      title: category.title || "",
      summary: category.summary || "",
      heroCopy: category.heroCopy || "",
      order: category.order ?? "",
    });
    setActiveTab("edit");
    scrollToForm();
  }

  function handleCardSelectForEdit(cardId) {
    if (!cardId) return;
    const card = cards.find((entry) => entry.id === cardId);
    if (!card) return;
    resetCardUpdate({
      id: card.id,
      categoryId: card.categoryId || card.serviceCategoryId || "",
      title: card.title || "",
      summary: card.summary || "",
      description: card.description || "",
      iconKey: card.iconKey || "FaTint",
      gradientClass: card.gradientClass || "from-blue-100 to-blue-300",
      order: card.order ?? "",
    });
    setActiveTab("edit");
    scrollToForm();
  }

  function handleDetailSelectForEdit(detailId) {
    if (!detailId) return;
    const detail = detailOptions.find((entry) => entry.id === detailId);
    if (!detail) return;
    resetDetailUpdate({
      id: detail.id,
      serviceCardId: detail.serviceCardId || "", // ensure we have this field available in detailOptions
      heading: detail.heading || "",
      body: detail.body || "",
      bulletPoints: bulletArrayToString(detail.bulletPoints),
      order: detail.order ?? "",
    });
    setActiveTab("edit");
    scrollToForm();
  }

  function handleResourceSelectForEdit(resourceId) {
    if (!resourceId) return;
    const resource = resourceOptions.find((entry) => entry.id === resourceId);
    if (!resource) return;
    resetResourceUpdate({
      id: resource.id,
      categoryId: resource.categoryId || "",
      title: resource.title || "",
      description: resource.description || "",
      externalUrl: resource.externalUrl || "",
      mediaUrl: (resource.media && resource.media.url) || resource.mediaUrl || "",
      mediaId: resource.mediaId || "",
    });
    setActiveTab("edit");
    scrollToForm();
  }

  async function handleCategoryUpdateSubmit(data) {
    await updateEntity("category", data);
    resetCategoryUpdate();
    setActiveTab("create");
  }

  async function handleCardUpdateSubmit(data) {
    await updateEntity("card", data);
    resetCardUpdate();
    setActiveTab("create");
  }

  async function handleDetailUpdateSubmit(data) {
    await updateEntity("detail", data);
    resetDetailUpdate();
    setActiveTab("create");
  }

  async function handleResourceUpdateSubmit(data) {
    await updateEntity("resource", data);
    resetResourceUpdate();
    setActiveTab("create");
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
              {filteredCategories.length} Categories
            </span>
          </div>

          <SearchInput value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search services..." />

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading services...
              </div>
            </div>
          ) : null}

          {!loading && !filteredCategories.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              {searchTerm ? "No services match your search." : "No categories found. Use the form to create your first service category."}
            </div>
          ) : null}

          <div className="space-y-6">

            {filteredCategories.map((category) => (
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

        <aside className="space-y-6" id="services-form-container">
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
                  title="New Category"
                  description="Create a main service category"
                  onSubmit={handleSubmitCategory(handleCategorySubmit)}
                  disabled={creatingCategory}
                >
                  <AdminInput label="Title" {...registerCategory("title")} error={errorsCategory.title?.message} required />
                  <AdminTextarea label="Summary" {...registerCategory("summary")} error={errorsCategory.summary?.message} />
                  <AdminTextarea label="Hero Copy" {...registerCategory("heroCopy")} error={errorsCategory.heroCopy?.message} />
                  <AdminInput label="Order" type="number" {...registerCategory("order")} error={errorsCategory.order?.message} />
                </ActionForm>

                <ActionForm
                  title="New Service Card"
                  description="Add a card to a category"
                  onSubmit={handleSubmitCard(handleCardSubmit)}
                  disabled={creatingCard || !categories.length}
                >
                  <AdminSelect
                    label="Category"
                    {...registerCard("categoryId")}
                    error={errorsCard.categoryId?.message}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Title" {...registerCard("title")} error={errorsCard.title?.message} required />
                  <AdminTextarea label="Summary" {...registerCard("summary")} error={errorsCard.summary?.message} />
                  <AdminInput label="Icon Key (e.g. FaTint)" {...registerCard("iconKey")} error={errorsCard.iconKey?.message} />
                  <AdminInput label="Gradient Class" {...registerCard("gradientClass")} error={errorsCard.gradientClass?.message} placeholder="from-blue-100 to-blue-300" />
                  <AdminInput label="Order" type="number" {...registerCard("order")} error={errorsCard.order?.message} />
                </ActionForm>

                <ActionForm
                  title="Add Detail Bullet"
                  description="Add details to a service card"
                  onSubmit={handleSubmitDetail(handleDetailSubmit)}
                  disabled={creatingDetail || !cards.length}
                >
                  <AdminSelect
                    label="Service Card"
                    {...registerDetail("serviceCardId")}
                    error={errorsDetail.serviceCardId?.message}
                    required
                  >
                    <option value="" disabled>Select Card</option>
                    {cards.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Heading" {...registerDetail("heading")} error={errorsDetail.heading?.message} required />
                  <Controller
                    name="body"
                    control={controlDetail}
                    render={({ field }) => (
                      <AdminRichText label="Body" value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <AdminTextarea label="Bullet Points (one per line)" {...registerDetail("bulletPoints")} error={errorsDetail.bulletPoints?.message} rows={3} />
                  <AdminInput label="Order" type="number" {...registerDetail("order")} error={errorsDetail.order?.message} />
                </ActionForm>

                <ActionForm
                  title="Add Resource"
                  description="Link a downloadable resource"
                  onSubmit={handleSubmitResource(handleResourceSubmit)}
                  disabled={creatingResource || !categories.length}
                >
                  <AdminSelect
                    label="Category"
                    {...registerResource("categoryId")}
                    error={errorsResource.categoryId?.message}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Title" {...registerResource("title")} error={errorsResource.title?.message} required />
                  <Controller
                    name="description"
                    control={controlResource}
                    render={({ field }) => (
                      <AdminRichText label="Description" value={field.value} onChange={field.onChange} />
                    )}
                  />
                  <AdminInput label="External URL" type="url" {...registerResource("externalUrl")} error={errorsResource.externalUrl?.message} />

                  <Controller
                    name="mediaId"
                    control={controlResource}
                    render={({ field }) => (
                      <MediaPicker
                        label="Media File"
                        value={field.value}
                        onChange={(id, asset) => {
                          field.onChange(id);
                          setResourceValue("mediaUrl", asset?.url || "");
                        }}
                        category="downloads"
                        accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      />
                    )}
                  />
                  {watchResource("mediaUrl") && <p className="text-[10px] text-slate-400 mt-1 truncate">URL: {watchResource("mediaUrl")}</p>}
                </ActionForm>
              </>
            )}

            {activeTab === "edit" && (
              <>
                <ActionForm
                  title="Update Category"
                  description="Edit titles, copy, or ordering for an existing category"
                  onSubmit={handleSubmitCategoryUpdate(handleCategoryUpdateSubmit)}
                  disabled={updatingCategory || !categories.length}
                  submitLabel="Save Changes"
                >
                  <AdminSelect
                    label="Category"
                    {...registerCategoryUpdate("id")}
                    onChange={(e) => {
                      registerCategoryUpdate("id").onChange(e); // Ensure react-hook-form knows
                      handleCategorySelectForEdit(e.target.value);
                    }}
                    error={errorsCategoryUpdate.id?.message}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Title" {...registerCategoryUpdate("title")} error={errorsCategoryUpdate.title?.message} required disabled={!watchCategoryUpdate("id")} />
                  <AdminTextarea label="Summary" {...registerCategoryUpdate("summary")} error={errorsCategoryUpdate.summary?.message} disabled={!watchCategoryUpdate("id")} />
                  <AdminTextarea label="Hero Copy" {...registerCategoryUpdate("heroCopy")} error={errorsCategoryUpdate.heroCopy?.message} disabled={!watchCategoryUpdate("id")} />
                  <AdminInput label="Order" type="number" {...registerCategoryUpdate("order")} error={errorsCategoryUpdate.order?.message} disabled={!watchCategoryUpdate("id")} />
                </ActionForm>

                <ActionForm
                  title="Update Service Card"
                  description="Retitle, recolor, or reorder a card"
                  onSubmit={handleSubmitCardUpdate(handleCardUpdateSubmit)}
                  disabled={updatingCard || !cards.length}
                  submitLabel="Save Changes"
                >
                  <AdminSelect
                    label="Service Card"
                    {...registerCardUpdate("id")}
                    onChange={(e) => {
                      registerCardUpdate("id").onChange(e);
                      handleCardSelectForEdit(e.target.value);
                    }}
                    error={errorsCardUpdate.id?.message}
                    required
                  >
                    <option value="" disabled>Select Card</option>
                    {cards.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminSelect
                    label="Category"
                    {...registerCardUpdate("categoryId")}
                    error={errorsCardUpdate.categoryId?.message}
                    disabled={!watchCardUpdate("id")}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Title" {...registerCardUpdate("title")} error={errorsCardUpdate.title?.message} required disabled={!watchCardUpdate("id")} />
                  <AdminTextarea label="Summary" {...registerCardUpdate("summary")} error={errorsCardUpdate.summary?.message} disabled={!watchCardUpdate("id")} />
                  <AdminTextarea label="Description" {...registerCardUpdate("description")} error={errorsCardUpdate.description?.message} disabled={!watchCardUpdate("id")} />
                  <AdminInput label="Icon Key" {...registerCardUpdate("iconKey")} error={errorsCardUpdate.iconKey?.message} disabled={!watchCardUpdate("id")} />
                  <AdminInput label="Gradient Class" {...registerCardUpdate("gradientClass")} error={errorsCardUpdate.gradientClass?.message} placeholder="from-blue-100 to-blue-300" disabled={!watchCardUpdate("id")} />
                  <AdminInput label="Order" type="number" {...registerCardUpdate("order")} error={errorsCardUpdate.order?.message} disabled={!watchCardUpdate("id")} />
                </ActionForm>

                <ActionForm
                  title="Update Detail Bullet"
                  description="Edit detail text or bullet points"
                  onSubmit={handleSubmitDetailUpdate(handleDetailUpdateSubmit)}
                  disabled={updatingDetail || !detailOptions.length}
                  submitLabel="Save Changes"
                >
                  <AdminSelect
                    label="Detail"
                    {...registerDetailUpdate("id")}
                    onChange={(e) => {
                      registerDetailUpdate("id").onChange(e);
                      handleDetailSelectForEdit(e.target.value);
                    }}
                    error={errorsDetailUpdate.id?.message}
                    required
                  >
                    <option value="" disabled>Select Detail</option>
                    {detailOptions.map((detail) => (
                      <option key={detail.id} value={detail.id}>
                        {detail.cardTitle ? `${detail.cardTitle} > ${detail.heading}` : detail.heading}
                      </option>
                    ))}
                  </AdminSelect>
                  <AdminInput label="Heading" {...registerDetailUpdate("heading")} error={errorsDetailUpdate.heading?.message} required disabled={!watchDetailUpdate("id")} />
                  <Controller
                    name="body"
                    control={controlDetailUpdate}
                    render={({ field }) => (
                      <AdminRichText label="Body" value={field.value} onChange={field.onChange} disabled={!watchDetailUpdate("id")} />
                    )}
                  />
                  <AdminTextarea label="Bullet Points (one per line)" {...registerDetailUpdate("bulletPoints")} error={errorsDetailUpdate.bulletPoints?.message} rows={3} disabled={!watchDetailUpdate("id")} />
                  <AdminInput label="Order" type="number" {...registerDetailUpdate("order")} error={errorsDetailUpdate.order?.message} disabled={!watchDetailUpdate("id")} />
                </ActionForm>

                <ActionForm
                  title="Update Resource"
                  description="Retitle or re-link a download"
                  onSubmit={handleSubmitResourceUpdate(handleResourceUpdateSubmit)}
                  disabled={updatingResource || !resourceOptions.length}
                  submitLabel="Save Changes"
                >
                  <AdminSelect
                    label="Resource"
                    {...registerResourceUpdate("id")}
                    onChange={(e) => {
                      registerResourceUpdate("id").onChange(e);
                      handleResourceSelectForEdit(e.target.value);
                    }}
                    error={errorsResourceUpdate.id?.message}
                    required
                  >
                    <option value="" disabled>Select Resource</option>
                    {resourceOptions.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.categoryTitle ? `${r.categoryTitle} > ${r.title}` : r.title}
                      </option>
                    ))}
                  </AdminSelect>
                  <AdminSelect
                    label="Category"
                    {...registerResourceUpdate("categoryId")}
                    error={errorsResourceUpdate.categoryId?.message}
                    disabled={!watchResourceUpdate("id")}
                    required
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </AdminSelect>
                  <AdminInput label="Title" {...registerResourceUpdate("title")} error={errorsResourceUpdate.title?.message} required disabled={!watchResourceUpdate("id")} />
                  <Controller
                    name="description"
                    control={controlResourceUpdate}
                    render={({ field }) => (
                      <AdminRichText label="Description" value={field.value} onChange={field.onChange} disabled={!watchResourceUpdate("id")} />
                    )}
                  />
                  <AdminInput label="External URL" type="url" {...registerResourceUpdate("externalUrl")} error={errorsResourceUpdate.externalUrl?.message} disabled={!watchResourceUpdate("id")} />

                  <Controller
                    name="mediaId"
                    control={controlResourceUpdate}
                    render={({ field }) => (
                      <MediaPicker
                        label="Media File"
                        value={field.value}
                        onChange={(id, asset) => {
                          field.onChange(id);
                          setResourceUpdate("mediaUrl", asset?.url || "");
                        }}
                        category="downloads"
                        accept="application/pdf,image/*,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        disabled={!watchResourceUpdate("id")}
                      />
                    )}
                  />
                  {watchResourceUpdate("mediaUrl") && <p className="text-[10px] text-slate-400 mt-1 truncate">URL: {watchResourceUpdate("mediaUrl")}</p>}
                </ActionForm>
              </>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}


