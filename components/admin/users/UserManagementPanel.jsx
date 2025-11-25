"use client";
import { useMemo, useState } from "react";
import {
  Calendar,
  CheckCircle2,
  Copy,
  KeyRound,
  Loader2,
  RefreshCcw,
  ShieldHalf,
  UserPlus,
  UsersRound,
  XCircle,
} from "lucide-react";
import { useAdminUsers } from "@/hooks/useAdminUsers";
import { ROLE_CATALOG } from "@/lib/auth/roleCatalog";

const ROLE_OPTIONS = ROLE_CATALOG.map((role) => ({
  label: role.label,
  value: role.type,
  description: role.description,
}));

const createUserFormState = () => ({ name: "", email: "", phone: "", roles: ["EDITOR"] });
const updateRolesFormState = () => ({ userId: "", roles: [] });
const resetFormState = () => ({ userId: "", temporaryPassword: "" });

function formatRelative(dateValue) {
  if (!dateValue) return "never";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "never";
  return date.toLocaleString("en-GB");
}

export default function UserManagementPanel() {
  const { users, loading, error, lastFetchedAt, actionState, refresh, createUser, updateRoles, updateStatus, resetPassword } = useAdminUsers();
  const [createForm, setCreateForm] = useState(() => createUserFormState());
  const [rolesForm, setRolesForm] = useState(() => updateRolesFormState());
  const [passwordForm, setPasswordForm] = useState(() => resetFormState());
  const [passwordResult, setPasswordResult] = useState(null);

  const roleStats = useMemo(() => {
    return ROLE_OPTIONS.map((role) => ({
      ...role,
      count: users.filter((user) => user.roles.includes(role.value)).length,
    }));
  }, [users]);

  async function handleCreateUser(event) {
    event.preventDefault();
    if (!createForm.roles.length) {
      window.alert("Select at least one role");
      return;
    }
    const response = await createUser(createForm);
    if (response?.temporaryPassword) {
      setPasswordResult({ email: createForm.email, password: response.temporaryPassword });
    }
    setCreateForm(createUserFormState());
  }

  function toggleCreateRole(role) {
    setCreateForm((prev) => {
      const exists = prev.roles.includes(role);
      if (exists) {
        return { ...prev, roles: prev.roles.filter((item) => item !== role) };
      }
      return { ...prev, roles: [...prev.roles, role] };
    });
  }

  async function handleRolesSubmit(event) {
    event.preventDefault();
    if (!rolesForm.userId || !rolesForm.roles.length) return;
    await updateRoles(rolesForm);
    setRolesForm(updateRolesFormState());
  }

  async function handleStatusToggle(user) {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateStatus({ userId: user.id, status: nextStatus });
  }

  async function handlePasswordReset(event) {
    event.preventDefault();
    if (!passwordForm.userId) return;
    const response = await resetPassword(passwordForm);
    if (response?.temporaryPassword) {
      const user = users.find((entry) => entry.id === passwordForm.userId);
      setPasswordResult({ email: user?.email, password: response.temporaryPassword });
    }
    setPasswordForm(resetFormState());
  }

  function copyPassword() {
    if (!passwordResult?.password) return;
    navigator.clipboard.writeText(passwordResult.password).catch(() => null);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-slate-500">
          <span className="inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
          Last sync: {lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString("en-GB") : "--"}
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
          {error.message || "Failed to load users"}
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
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {roleStats.map((role) => (
              <div key={role.value} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{role.label}</p>
                <p className="mt-2 text-2xl font-bold text-slate-900">{role.count}</p>
                <p className="text-xs text-slate-400">{role.description}</p>
              </div>
            ))}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">Total Operators</p>
              <p className="mt-2 text-2xl font-bold text-slate-900">{users.length}</p>
              <p className="text-xs text-slate-400">Provisioned accounts</p>
            </div>
          </div>

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading operators...
              </div>
            </div>
          ) : null}

          {!loading && !users.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              No admin users found. Create one to get started.
            </div>
          ) : null}

          <div className="space-y-4">
            {users.map((user) => (
              <article key={user.id} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
                <div className="p-5">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex h-2 w-2 rounded-full ${user.status === 'ACTIVE' ? 'bg-emerald-500' : 'bg-slate-300'}`}></span>
                        <h4 className="text-lg font-bold text-slate-900">{user.name || user.email}</h4>
                      </div>
                      <p className="text-sm text-slate-600 font-mono">{user.email}</p>
                      
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} />
                          Last login: {formatRelative(user.lastLoginAt)}
                        </span>
                        <div className="flex gap-1">
                          {user.roles.map((role) => (
                            <span key={role} className="rounded bg-slate-100 px-1.5 py-0.5 font-medium text-slate-600">
                              {role}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <button
                        type="button"
                        onClick={() => handleStatusToggle(user)}
                        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${
                          user.status === "ACTIVE"
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                            : "border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
                        }`}
                      >
                        {user.status === "ACTIVE" ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                        {user.status === "ACTIVE" ? "Disable Account" : "Activate Account"}
                      </button>
                      
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => setPasswordForm((prev) => ({ ...prev, userId: user.id }))}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Reset Password"
                        >
                          <KeyRound size={14} className="mx-auto" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setRolesForm({ userId: user.id, roles: user.roles })}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Edit Roles"
                        >
                          <ShieldHalf size={14} className="mx-auto" />
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
          {passwordResult && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm animate-fade-in">
              <div className="flex items-center gap-2 mb-2 text-amber-800">
                <KeyRound size={16} />
                <h4 className="text-sm font-bold">Temporary Password</h4>
              </div>
              <p className="text-xs text-amber-700 mb-3">Share securely with {passwordResult.email}</p>
              <div className="flex items-center gap-2">
                <code className="flex-1 rounded-lg bg-white border border-amber-200 px-3 py-2 text-sm font-mono text-slate-900 select-all">
                  {passwordResult.password}
                </code>
                <button
                  type="button"
                  onClick={copyPassword}
                  className="rounded-lg bg-white border border-amber-200 p-2 text-amber-600 hover:bg-amber-100 transition"
                  title="Copy to Clipboard"
                >
                  <Copy size={16} />
                </button>
              </div>
            </div>
          )}

          <div className="sticky top-6 space-y-6">
            <ActionForm
              title="Create Operator"
              description="Provision a new admin or editor"
              icon={<UserPlus size={16} />}
              onSubmit={handleCreateUser}
              disabled={actionState.pending}
            >
              <Input label="Name" value={createForm.name} onChange={(e) => setCreateForm({ ...createForm, name: e.target.value })} placeholder="e.g. Ayesha Khan" />
              <Input label="Email" type="email" value={createForm.email} onChange={(e) => setCreateForm({ ...createForm, email: e.target.value })} required placeholder="name@kwsc.gos.pk" />
              <Input label="Phone (Optional)" type="tel" value={createForm.phone} onChange={(e) => setCreateForm({ ...createForm, phone: e.target.value })} />
              
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</p>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map((role) => (
                    <label key={role.value} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        checked={createForm.roles.includes(role.value)}
                        onChange={() => toggleCreateRole(role.value)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </ActionForm>

            <ActionForm
              title="Update Roles"
              description="Assign or revoke permissions"
              icon={<ShieldHalf size={16} />}
              onSubmit={handleRolesSubmit}
              disabled={actionState.pending || !users.length}
            >
              <Select
                label="Select Operator"
                value={rolesForm.userId}
                onChange={(e) => {
                  const value = e.target.value;
                  const selectedUser = users.find((u) => u.id === value);
                  setRolesForm({ userId: value, roles: selectedUser?.roles || [] });
                }}
                required
              >
                <option value="" disabled>Select Operator</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
              </Select>

              <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2 ${!rolesForm.userId ? 'opacity-50 pointer-events-none' : ''}`}>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</p>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map((role) => (
                    <label key={role.value} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        checked={rolesForm.roles.includes(role.value)}
                        onChange={() =>
                          setRolesForm((prev) => {
                            const exists = prev.roles.includes(role.value);
                            return {
                              ...prev,
                              roles: exists
                                ? prev.roles.filter((r) => r !== role.value)
                                : [...prev.roles, role.value],
                            };
                          })
                        }
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium">{role.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </ActionForm>

            <ActionForm
              title="Reset Password"
              description="Issue a new temporary secret"
              icon={<KeyRound size={16} />}
              onSubmit={handlePasswordReset}
              disabled={actionState.pending || !users.length}
            >
              <Select label="Select Operator" value={passwordForm.userId} onChange={(e) => setPasswordForm({ ...passwordForm, userId: e.target.value })} required>
                <option value="" disabled>Select Operator</option>
                {users.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
              </Select>
              <Input label="Custom Temp Password (Optional)" value={passwordForm.temporaryPassword} onChange={(e) => setPasswordForm({ ...passwordForm, temporaryPassword: e.target.value })} />
            </ActionForm>
          </div>
        </aside>
      </div>
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
        {title.includes("Update") || title.includes("Reset") ? "Submit" : "Create"}
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