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
import { ActionForm } from "@/components/admin/ui/ActionForm";
import { AdminInput } from "@/components/admin/ui/AdminInput";
import { AdminSelect } from "@/components/admin/ui/AdminSelect";
import { Pagination } from "@/components/admin/ui/Pagination";
import { SearchInput } from "@/components/admin/ui/SearchInput";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { createUserSchema, updateUserRolesSchema, resetPasswordSchema } from "@/lib/validators/admin";

const ROLE_OPTIONS = ROLE_CATALOG.map((role) => ({
  label: role.label,
  value: role.type,
  description: role.description,
  restricted: role.restricted,
}));




function formatRelative(dateValue) {
  if (!dateValue) return "never";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "never";
  return date.toLocaleString("en-GB");
}

export default function UserManagementPanel() {
  const { users, loading, error, lastFetchedAt, actionState, refresh, createUser, updateRoles, updateStatus, resetPassword } = useAdminUsers();

  const {
    register: registerCreate,
    handleSubmit: handleSubmitCreate,
    setValue: setCreateValue,
    watch: watchCreate,
    reset: resetCreate,
    formState: { errors: errorsCreate, isSubmitting: creating }
  } = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      roles: ["EDITOR"],
    }
  });

  const {
    register: registerRoles,
    handleSubmit: handleSubmitRoles,
    setValue: setRolesValue,
    watch: watchRoles,
    reset: resetRoles,
    formState: { errors: errorsRoles, isSubmitting: updatingRoles }
  } = useForm({
    resolver: zodResolver(updateUserRolesSchema),
    defaultValues: { userId: "", roles: [] }
  });

  const {
    register: registerPassword,
    handleSubmit: handleSubmitPassword,
    setValue: setPasswordValue,
    reset: resetPasswordForm,
    formState: { errors: errorsPassword, isSubmitting: resettingPassword }
  } = useForm({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { userId: "", temporaryPassword: "" }
  });

  const [passwordResult, setPasswordResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 5;

  // Watch roles for checkboxes
  const createRoles = watchCreate("roles");
  const updateRolesList = watchRoles("roles");

  const filteredUsers = useMemo(() => {
    if (!searchTerm) return users;
    const lower = searchTerm.toLowerCase();
    return users.filter(
      (u) =>
        (u.name && u.name.toLowerCase().includes(lower)) ||
        u.email.toLowerCase().includes(lower) ||
        u.roles.some((r) => r.toLowerCase().includes(lower))
    );
  }, [users, searchTerm]);

  const totalPages = Math.ceil(filteredUsers.length / ITEMS_PER_PAGE);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredUsers.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredUsers, currentPage]);

  const roleStats = useMemo(() => {
    return ROLE_OPTIONS.map((role) => ({
      ...role,
      count: users.filter((user) => user.roles.includes(role.value)).length,
    }));
  }, [users]);

  async function handleCreateUser(data) {
    const response = await createUser(data);
    if (response?.temporaryPassword) {
      setPasswordResult({ email: data.email, password: response.temporaryPassword });
    }
    resetCreate();
  }

  function toggleCreateRole(role) {
    const current = createRoles || [];
    const exists = current.includes(role);
    if (exists) {
      setCreateValue("roles", current.filter((item) => item !== role));
    } else {
      setCreateValue("roles", [...current, role]);
    }
  }

  async function handleRolesSubmit(data) {
    await updateRoles(data);
    resetRoles();
  }

  function toggleUpdateRole(role) {
    const current = updateRolesList || [];
    const exists = current.includes(role);
    if (exists) {
      setRolesValue("roles", current.filter((item) => item !== role));
    } else {
      setRolesValue("roles", [...current, role]);
    }
  }

  async function handleStatusToggle(user) {
    const nextStatus = user.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    await updateStatus({ userId: user.id, status: nextStatus });
  }

  async function handlePasswordReset(data) {
    const response = await resetPassword(data);
    if (response?.temporaryPassword) {
      const user = users.find((entry) => entry.id === data.userId);
      setPasswordResult({ email: user?.email, password: response.temporaryPassword });
    }
    resetPasswordForm();
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
          <span suppressHydrationWarning>Last sync: {lastFetchedAt ? new Date(lastFetchedAt).toLocaleTimeString("en-GB") : "--"}</span>
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
              <p className="mt-2 text-2xl font-bold text-slate-900">{filteredUsers.length}</p>
              <p className="text-xs text-slate-400">Provisioned accounts</p>
            </div>
          </div>

          <SearchInput value={searchTerm} onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }} placeholder="Search operators..." />

          {loading ? (
            <div className="flex h-32 items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50">
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="h-5 w-5 animate-spin" /> Loading operators...
              </div>
            </div>
          ) : null}

          {!loading && !filteredUsers.length ? (
            <div className="rounded-2xl border border-dashed border-slate-200 p-8 text-center text-slate-500">
              {searchTerm ? "No operators match your search." : "No admin users found. Create one to get started."}
            </div>
          ) : null}

          <div className="space-y-4">
            {paginatedUsers.map((user) => (
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
                        <span className="flex items-center gap-1" suppressHydrationWarning>
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
                        className={`flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition ${user.status === "ACTIVE"
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
                          onClick={() => {
                            setPasswordValue("userId", user.id);
                            document.getElementById("user-password-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
                          className="flex-1 rounded-lg border border-slate-200 bg-slate-50 p-1.5 text-slate-500 hover:bg-slate-100 hover:text-blue-600"
                          title="Reset Password"
                        >
                          <KeyRound size={14} className="mx-auto" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setRolesValue("userId", user.id);
                            setRolesValue("roles", user.roles);
                            document.getElementById("user-roles-form")?.scrollIntoView({ behavior: "smooth" });
                          }}
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

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
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
              onSubmit={handleSubmitCreate(handleCreateUser)}
              disabled={creating || actionState.pending}
            >
              <AdminInput label="Name" {...registerCreate("name")} placeholder="e.g. Ayesha Khan" />
              <AdminInput label="Email" type="email" {...registerCreate("email")} placeholder="name@kwsc.gos.pk" />
              {errorsCreate.email && <p className="text-xs text-rose-500">{errorsCreate.email.message}</p>}

              <AdminInput label="Phone (Optional)" type="tel" {...registerCreate("phone")} />

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</p>
                <div className="space-y-2">
                  {ROLE_OPTIONS.map((role) => (
                    <label key={role.value} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                      <input
                        type="checkbox"
                        checked={createRoles?.includes(role.value)}
                        onChange={() => toggleCreateRole(role.value)}
                        className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="font-medium">{role.label}</span>
                      {role.restricted && <span className="text-[10px] bg-amber-100 text-amber-700 px-1 rounded">Restricted</span>}
                    </label>
                  ))}
                </div>
                {errorsCreate.roles && <p className="text-xs text-rose-500">{errorsCreate.roles.message}</p>}
              </div>
            </ActionForm>

            <div id="user-roles-form">
              <ActionForm
                title="Update Roles"
                description="Assign or revoke permissions"
                icon={<ShieldHalf size={16} />}
                onSubmit={handleSubmitRoles(handleRolesSubmit)}
                disabled={updatingRoles || actionState.pending || !users.length}
              >
                <AdminSelect
                  label="Select Operator"
                  {...registerRoles("userId")}
                  onChange={(e) => {
                    registerRoles("userId").onChange(e); // keep hook form connected
                    const value = e.target.value;
                    const selectedUser = users.find((u) => u.id === value);
                    if (selectedUser) {
                      setRolesValue("roles", selectedUser.roles);
                    }
                  }}
                >
                  <option value="" disabled>Select Operator</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
                </AdminSelect>
                {errorsRoles.userId && <p className="text-xs text-rose-500">{errorsRoles.userId.message}</p>}

                {/* Using watch to conditionally style or show */}
                <div className={`rounded-xl border border-slate-200 bg-slate-50 p-3 space-y-2`}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Roles</p>
                  <div className="space-y-2">
                    {ROLE_OPTIONS.map((role) => (
                      <label key={role.value} className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer hover:text-blue-600">
                        <input
                          type="checkbox"
                          checked={updateRolesList?.includes(role.value)}
                          onChange={() => toggleUpdateRole(role.value)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="font-medium">{role.label}</span>
                      </label>
                    ))}
                  </div>
                  {errorsRoles.roles && <p className="text-xs text-rose-500">{errorsRoles.roles.message}</p>}
                </div>
              </ActionForm>
            </div>

            <div id="user-password-form">
              <ActionForm
                title="Reset Password"
                description="Issue a new temporary secret"
                icon={<KeyRound size={16} />}
                onSubmit={handleSubmitPassword(handlePasswordReset)}
                disabled={resettingPassword || actionState.pending || !users.length}
              >
                <AdminSelect label="Select Operator" {...registerPassword("userId")}>
                  <option value="" disabled>Select Operator</option>
                  {users.map((u) => <option key={u.id} value={u.id}>{u.email}</option>)}
                </AdminSelect>
                {errorsPassword.userId && <p className="text-xs text-rose-500">{errorsPassword.userId.message}</p>}

                <AdminInput label="Custom Temp Password (Optional)" {...registerPassword("temporaryPassword")} />
              </ActionForm>
            </div>
          </div>
        </aside>
      </div >
    </div >
  );
}

