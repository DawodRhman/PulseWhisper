"use client";
import { useMemo, useState } from "react";
import {
  Loader2,
  Plus,
  RefreshCcw,
  Trash2,
  Sparkles,
  UserRound,
  Linkedin,
  Twitter,
  Mail,
  Image,
} from "lucide-react";
import { useAdminLeadership } from "@/hooks/useAdminLeadership";
import SeoFields, { createEmptySeoState, serializeSeoState } from "@/components/admin/seo/SeoFields";
import MediaPicker from "@/components/admin/media/MediaPicker";

const SOCIAL_FIELDS = ["linkedin", "twitter", "email"];

const createInitialCreateForm = () => ({
  name: "",
  designation: "",
  bio: "",
  priority: "",
  mediaId: "",
  mediaUrl: "",
  socials: createEmptySocialState(),
  seo: createEmptySeoState(),
});

const createInitialUpdateForm = () => ({
  memberId: "",
  name: "",
  designation: "",
  bio: "",
  priority: "",
  mediaId: "",
  mediaUrl: "",
  socials: createEmptySocialState(),
  includeSocials: false,
});

const createInitialSeoForm = () => ({
  memberId: "",
  seo: createEmptySeoState(),
});

function createEmptySocialState() {
  return { linkedin: "", twitter: "", email: "" };
}

function hydrateSocialState(socials) {
  const base = createEmptySocialState();
  if (!socials) return base;
  for (const field of SOCIAL_FIELDS) {
    const value = socials[field];
    if (typeof value === "string") {
      base[field] = value;
    }
  }
  return base;
}

function serializeSocialState(state, { allowEmpty = false } = {}) {
  if (!state) return allowEmpty ? {} : undefined;
  const payload = {};
  for (const field of SOCIAL_FIELDS) {
    const value = state[field];
    if (value === undefined || value === null) continue;
    const trimmed = typeof value === "string" ? value.trim() : value;
    if (!trimmed) continue;
    payload[field] = trimmed;
  }
  if (Object.keys(payload).length) {
    return payload;
  }
  return allowEmpty ? {} : undefined;
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

function nullable(value) {
  if (value === undefined || value === null) return null;
  const trimmed = typeof value === "string" ? value.trim() : value;
  return trimmed === "" ? null : trimmed;
}

function optionalNumber(value) {
  if (value === undefined || value === null || value === "") return undefined;
  const parsed = Number(value);
  return Number.isNaN(parsed) ? undefined : parsed;
}

function stringOrUndefined(value) {
  if (value === undefined || value === null) return undefined;
  const trimmed = typeof value === "string" ? value.trim() : value;
  return trimmed === "" ? undefined : trimmed;
}

function hasSeo(meta) {
  if (!meta) return false;
  return Boolean(meta.title || meta.description || meta.ogTitle || meta.ogDescription || meta.ogImageUrl);
}

export default function LeadershipPanel() {
  const {
    members,
    loading,
    error,
    actionState,
    lastFetchedAt,
    refresh,
    createEntity,
    updateEntity,
    deleteEntity,
  } = useAdminLeadership();

  const [createForm, setCreateForm] = useState(() => createInitialCreateForm());
  const [updateForm, setUpdateForm] = useState(() => createInitialUpdateForm());
  const [seoForm, setSeoForm] = useState(() => createInitialSeoForm());

  const [activeTab, setActiveTab] = useState("create"); // "create" | "edit" | "seo"

  const leadershipCount = useMemo(() => members.length, [members]);

  async function handleCreateSubmit(event) {
    event.preventDefault();
    await createEntity("member", {
      name: createForm.name,
      designation: createForm.designation,
      bio: nullable(createForm.bio),
      priority: optionalNumber(createForm.priority),
      mediaId: stringOrUndefined(createForm.mediaId),
      mediaUrl: stringOrUndefined(createForm.mediaUrl),
      socials: serializeSocialState(createForm.socials),
      seo: serializeSeoState(createForm.seo),
    });
    setCreateForm(createInitialCreateForm());
  }

  async function handleUpdateSubmit(event) {
    event.preventDefault();
    if (!updateForm.memberId) return;
    const payload = {
      id: updateForm.memberId,
      name: updateForm.name,
      designation: updateForm.designation,
      bio: nullable(updateForm.bio),
      priority: optionalNumber(updateForm.priority),
      mediaId: stringOrUndefined(updateForm.mediaId),
      mediaUrl: stringOrUndefined(updateForm.mediaUrl),
    };
    if (updateForm.includeSocials) {
      payload.socials = serializeSocialState(updateForm.socials, { allowEmpty: true });
    }
    await updateEntity("member", payload);
    setUpdateForm(createInitialUpdateForm());
    setActiveTab("create");
  }

  async function handleSeoSubmit(event) {
    event.preventDefault();
    if (!seoForm.memberId) return;
    const seoPayload = serializeSeoState(seoForm.seo);
    if (!seoPayload) return;
    await updateEntity("member", { id: seoForm.memberId, seo: seoPayload });
    setSeoForm(createInitialSeoForm());
    setActiveTab("create");
  }

  async function handleDelete(member) {
    if (!member?.id) return;
    if (!window.confirm(`Remove ${member.name}? This cannot be undone.`)) return;
    try {
      await deleteEntity("member", { id: member.id });
    } catch (error) {
      console.error("Delete failed:", error);
    }
  }

  function handleUpdateSelect(memberId) {
    if (!memberId) {
      setUpdateForm(createInitialUpdateForm());
      return;
    }
    const member = members.find((entry) => entry.id === memberId);
    if (!member) return;
    setUpdateForm({
      memberId: member.id,
      name: member.name,
      designation: member.designation,
      bio: member.bio || "",
      priority: member.priority?.toString() ?? "",
      mediaId: member.mediaId || "",
      mediaUrl: member.portrait?.url || "",
      socials: hydrateSocialState(member.socials),
      includeSocials: Boolean(member.socials),
    });
    setActiveTab("edit");
  }

  function handleSeoSelect(memberId) {
    if (!memberId) {
      setSeoForm(createInitialSeoForm());
      return;
    }
    const member = members.find((entry) => entry.id === memberId);
    if (!member) return;
    setSeoForm({ memberId: member.id, seo: hydrateSeoForm(member.seo) });
    setActiveTab("seo");
  }

  function prefillForms(member) {
    handleUpdateSelect(member.id);
    handleSeoSelect(member.id);
    setActiveTab("edit");
    // Scroll to form
    const formElement = document.getElementById("leadership-form-container");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  }

  const priorityBuckets = useMemo(() => {
    return members.reduce((acc, member) => {
      const bucket = member.priority ?? 0;
      acc[bucket] = (acc[bucket] || 0) + 1;
      return acc;
    }, {});
  }, [members]);

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
          {error.message || "Failed to load leadership"}
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
            <h3 className="text-lg font-semibold text-slate-900">Leadership Roster</h3>
            <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">
              {leadershipCount} Members
            </span>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading leadership...
              </div>
            </div>
          ) : null}

          {!loading && !members.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No leadership entries found. Use the form to add executives.
            </div>
          ) : null}

          {members.length ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {members.map((member) => (
                <article key={member.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="font-semibold text-slate-900">{member.name}</h4>
                        <p className="text-sm text-slate-600">{member.designation}</p>
                        {member.bio && <p className="text-xs text-slate-500 line-clamp-2">{member.bio}</p>}

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-500">
                          <span className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                            Priority {member.priority ?? 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Image size={12} />
                            {member.portrait?.label || (member.portrait?.url ? "External Image" : "No Image")}
                          </span>
                          <span className={`flex items-center gap-1 ${hasSeo(member.seo) ? "text-emerald-600" : "text-slate-400"}`}>
                            <Sparkles size={12} />
                            {hasSeo(member.seo) ? "SEO Configured" : "Default SEO"}
                          </span>
                        </div>

                        <ul className="mt-3 space-y-1 text-xs text-slate-500">
                          {member.socials?.linkedin && (
                            <li className="flex items-center gap-1.5">
                              <Linkedin size={12} className="text-blue-600" />
                              <span className="truncate max-w-[150px]">{member.socials.linkedin}</span>
                            </li>
                          )}
                          {member.socials?.twitter && (
                            <li className="flex items-center gap-1.5">
                              <Twitter size={12} className="text-sky-500" />
                              <span className="truncate max-w-[150px]">{member.socials.twitter}</span>
                            </li>
                          )}
                          {member.socials?.email && (
                            <li className="flex items-center gap-1.5">
                              <Mail size={12} className="text-slate-400" />
                              <span className="truncate max-w-[150px]">{member.socials.email}</span>
                            </li>
                          )}
                        </ul>
                      </div>

                      <div className="flex flex-col gap-2">
                        <button
                          type="button"
                          onClick={() => prefillForms(member)}
                          disabled={actionState.pending}
                          className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(member)}
                          disabled={actionState.pending}
                          className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                          aria-label={`Delete ${member.name}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : null}

          {Object.keys(priorityBuckets).length ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Priority Distribution</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {Object.entries(priorityBuckets)
                  .sort((a, b) => Number(a[0]) - Number(b[0]))
                  .map(([priority, count]) => (
                    <span key={priority} className="rounded-md bg-white border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 shadow-sm">
                      #{priority}: {count}
                    </span>
                  ))}
              </div>
            </div>
          ) : null}
        </section>

        <aside className="space-y-6" id="leadership-form-container">
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
                title="Create Member"
                description="Add a new leadership member"
                onSubmit={handleCreateSubmit}
                disabled={actionState.pending}
              >
                <Input label="Full Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} required />
                <Input label="Designation" value={createForm.designation} onChange={(e) => setCreateForm({ ...createForm, designation: e.target.value })} required />
                <TextArea label="Bio" value={createForm.bio} onChange={(e) => setCreateForm({ ...createForm, bio: e.target.value })} placeholder="1-2 sentences" />
                <Input label="Priority" type="number" value={createForm.priority} onChange={(e) => setCreateForm({ ...createForm, priority: e.target.value })} placeholder="0 renders first" />

                <MediaPicker
                  label="Portrait Image"
                  category="leadership"
                  value={createForm.mediaId}
                  initialUrl={createForm.mediaUrl}
                  onChange={(id, asset) => setCreateForm(prev => ({
                    ...prev,
                    mediaId: id,
                    mediaUrl: asset ? "" : prev.mediaUrl
                  }))}
                  disabled={actionState.pending}
                />
                <Input label="Or Remote Media URL" type="url" value={createForm.mediaUrl} onChange={(e) => setCreateForm({ ...createForm, mediaUrl: e.target.value })} placeholder="https://..." />

                <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Social Links</p>
                  <Input label="LinkedIn URL" type="url" value={createForm.socials.linkedin} onChange={(e) => setCreateForm({ ...createForm, socials: { ...createForm.socials, linkedin: e.target.value } })} />
                  <Input label="Twitter URL" type="url" value={createForm.socials.twitter} onChange={(e) => setCreateForm({ ...createForm, socials: { ...createForm.socials, twitter: e.target.value } })} />
                  <Input label="Email" type="email" value={createForm.socials.email} onChange={(e) => setCreateForm({ ...createForm, socials: { ...createForm.socials, email: e.target.value } })} />
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Initial SEO (Optional)</p>
                  <SeoFields
                    value={createForm.seo}
                    onChange={(seo) => setCreateForm((prev) => ({ ...prev, seo }))}
                    disabled={actionState.pending}
                  />
                </div>
              </ActionForm>
            )}

            {activeTab === "edit" && (
              <ActionForm
                title="Edit Member"
                description="Update profile details"
                onSubmit={handleUpdateSubmit}
                disabled={actionState.pending || !members.length}
              >
                <Select label="Select Member" value={updateForm.memberId} onChange={(e) => handleUpdateSelect(e.target.value)} required>
                  <option value="" disabled>Select Member</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>

                <Input label="Full Name" value={updateForm.name} onChange={(e) => setUpdateForm({ ...updateForm, name: e.target.value })} disabled={!updateForm.memberId} required />
                <Input label="Designation" value={updateForm.designation} onChange={(e) => setUpdateForm({ ...updateForm, designation: e.target.value })} disabled={!updateForm.memberId} required />
                <TextArea label="Bio" value={updateForm.bio} onChange={(e) => setUpdateForm({ ...updateForm, bio: e.target.value })} disabled={!updateForm.memberId} />
                <Input label="Priority" type="number" value={updateForm.priority} onChange={(e) => setUpdateForm({ ...updateForm, priority: e.target.value })} disabled={!updateForm.memberId} />

                <MediaPicker
                  label="Portrait Image"
                  category="leadership"
                  value={updateForm.mediaId}
                  initialUrl={updateForm.mediaUrl}
                  onChange={(id, asset) => setUpdateForm(prev => ({
                    ...prev,
                    mediaId: id,
                    mediaUrl: asset ? "" : prev.mediaUrl
                  }))}
                  disabled={!updateForm.memberId}
                />
                <Input label="Or Remote Media URL" type="url" value={updateForm.mediaUrl} onChange={(e) => setUpdateForm({ ...updateForm, mediaUrl: e.target.value })} disabled={!updateForm.memberId} />

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="updateSocials"
                    checked={updateForm.includeSocials}
                    onChange={(e) => setUpdateForm({ ...updateForm, includeSocials: e.target.checked })}
                    disabled={!updateForm.memberId}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="updateSocials" className="text-xs font-medium text-slate-700">Update Social Links</label>
                </div>

                <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-3 ${!updateForm.includeSocials ? 'opacity-50 pointer-events-none' : ''}`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Social Links</p>
                  <Input label="LinkedIn URL" type="url" value={updateForm.socials.linkedin} onChange={(e) => setUpdateForm({ ...updateForm, socials: { ...updateForm.socials, linkedin: e.target.value } })} disabled={!updateForm.memberId || !updateForm.includeSocials} />
                  <Input label="Twitter URL" type="url" value={updateForm.socials.twitter} onChange={(e) => setUpdateForm({ ...updateForm, socials: { ...updateForm.socials, twitter: e.target.value } })} disabled={!updateForm.memberId || !updateForm.includeSocials} />
                  <Input label="Email" type="email" value={updateForm.socials.email} onChange={(e) => setUpdateForm({ ...updateForm, socials: { ...updateForm.socials, email: e.target.value } })} disabled={!updateForm.memberId || !updateForm.includeSocials} />
                </div>
              </ActionForm>
            )}

            {activeTab === "seo" && (
              <ActionForm
                title="SEO Overrides"
                description="Update SEO metadata"
                onSubmit={handleSeoSubmit}
                disabled={actionState.pending || !members.length}
              >
                <Select label="Select Member" value={seoForm.memberId} onChange={(e) => handleSeoSelect(e.target.value)} required>
                  <option value="" disabled>Select Member</option>
                  {members.map((m) => <option key={m.id} value={m.id}>{m.name}</option>)}
                </Select>
                <SeoFields
                  value={seoForm.seo}
                  onChange={(seo) => setSeoForm((prev) => ({ ...prev, seo }))}
                  disabled={!seoForm.memberId || actionState.pending}
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