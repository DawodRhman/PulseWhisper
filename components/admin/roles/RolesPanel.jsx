"use client";
import { useState, useEffect } from "react";
import { Plus, Trash2, Shield, Check, X, Loader2 } from "lucide-react";
import { ROLE_CATALOG } from "@/lib/auth/roleCatalog";

// Flatten all unique permissions from the catalog for the checkbox matrix
const ALL_PERMISSIONS = Array.from(new Set(ROLE_CATALOG.flatMap(r => r.permissions))).sort();

export default function RolesPanel() {
    const [roles, setRoles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showCreate, setShowCreate] = useState(false);

    // New Role Form State
    const [newRoleLabel, setNewRoleLabel] = useState("");
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    useEffect(() => {
        fetchRoles();
    }, []);

    async function fetchRoles() {
        try {
            const res = await fetch("/api/papa/roles");
            if (res.ok) {
                const json = await res.json();
                setRoles(json.data || []);
            }
        } catch (err) {
            console.error("Failed to fetch roles", err);
        } finally {
            setLoading(false);
        }
    }

    async function handleCreate(e) {
        e.preventDefault();
        if (!newRoleLabel.trim()) return;

        setSubmitting(true);
        try {
            const res = await fetch("/api/papa/roles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    label: newRoleLabel,
                    permissions: selectedPermissions,
                }),
            });

            if (res.ok) {
                await fetchRoles(); // Refresh list
                setShowCreate(false);
                setNewRoleLabel("");
                setSelectedPermissions([]);
            } else {
                const error = await res.json();
                alert(error.error || "Failed to create role");
            }
        } catch (err) {
            console.error(err);
            alert("An error occurred");
        } finally {
            setSubmitting(false);
        }
    }

    async function handleDelete(id) {
        if (!confirm("Are you sure you want to delete this role? This cannot be undone.")) return;

        try {
            const res = await fetch("/api/papa/roles", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setRoles(roles.filter(r => r.id !== id));
            } else {
                const error = await res.json();
                alert(error.error || "Failed to delete role");
            }
        } catch (err) {
            console.error(err);
        }
    }

    const togglePermission = (perm) => {
        if (selectedPermissions.includes(perm)) {
            setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
        } else {
            setSelectedPermissions([...selectedPermissions, perm]);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading roles...</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-900">Role Management</h2>
                    <p className="text-sm text-slate-500">Create and manage custom roles with granular permissions.</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 transition"
                >
                    {showCreate ? <X size={16} /> : <Plus size={16} />}
                    {showCreate ? "Cancel" : "New Custom Role"}
                </button>
            </div>

            {/* Create Form */}
            {showCreate && (
                <div className="rounded-xl border border-blue-100 bg-blue-50/50 p-6 animate-in slide-in-from-top-2">
                    <form onSubmit={handleCreate} className="space-y-6">
                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-2">Role Name</label>
                            <input
                                type="text"
                                value={newRoleLabel}
                                onChange={(e) => setNewRoleLabel(e.target.value)}
                                placeholder="e.g. Junior Editor"
                                className="w-full max-w-md rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-900 mb-3">Permissions</label>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                                {ALL_PERMISSIONS.map((perm) => (
                                    <label key={perm} className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer hover:bg-blue-100/50 p-2 rounded transition">
                                        <input
                                            type="checkbox"
                                            checked={selectedPermissions.includes(perm)}
                                            onChange={() => togglePermission(perm)}
                                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                        />
                                        <span className="font-mono text-xs">{perm}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50 transition"
                            >
                                {submitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                                Create Role
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Roles List */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {roles.map((role) => (
                    <div key={role.id} className="group relative rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition">
                        <div className="flex items-start justify-between mb-3">
                            <div className="flex items-center gap-2">
                                <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${role.type === "SUPER_ADMIN" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-500"}`}>
                                    <Shield size={20} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-slate-900">{role.label}</h3>
                                    <span className="text-xs font-mono text-slate-400">{role.type}</span>
                                </div>
                            </div>
                            {role.type === "CUSTOM" && (
                                <button
                                    onClick={() => handleDelete(role.id)}
                                    className="rounded-lg p-2 text-slate-400 opacity-0 group-hover:opacity-100 hover:bg-rose-50 hover:text-rose-600 transition"
                                    title="Delete Role"
                                >
                                    <Trash2 size={16} />
                                </button>
                            )}
                        </div>

                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Permissions</p>
                            <div className="flex flex-wrap gap-1.5">
                                {role.type === "SUPER_ADMIN" ? (
                                    <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">ALL ACCESS</span>
                                ) : Array.isArray(role.permissions) && role.permissions.length > 0 ? (
                                    role.permissions.slice(0, 10).map(p => (
                                        <span key={p} className="inline-flex items-center rounded-md bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">{p}</span>
                                    ))
                                ) : (
                                    <span className="text-xs italic text-slate-400">Standard system permissions</span>
                                )}
                                {Array.isArray(role.permissions) && role.permissions.length > 10 && (
                                    <span className="text-xs text-slate-400 flex items-center">+{role.permissions.length - 10} more</span>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
