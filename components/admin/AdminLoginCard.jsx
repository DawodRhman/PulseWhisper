"use client";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, KeyRound, Eye, EyeOff, Loader2 } from "lucide-react";

const POLICY_HINTS = [
  "Use your @kwsc.gos.pk email address",
  "Passwords must be 12+ characters per policy draft",
  "Device trust expires after 12 hours of inactivity",
  "All admin actions are recorded in the audit log",
];

export default function AdminLoginCard() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "admin@kwsc.local",
    password: "",
    rememberDevice: false,
  });
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const disableSubmit = status === "submitting";

  const passwordStrength = useMemo(() => {
    if (!form.password) return "unknown";
    if (form.password.length >= 16 && /[^a-zA-Z0-9]/.test(form.password)) return "strong";
    if (form.password.length >= 12) return "acceptable";
    return "weak";
  }, [form.password]);

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("submitting");
    setError(null);

    if (form.password.length < 12) {
      setStatus("error");
      setError("Passwords must be at least 12 characters.");
      return;
    }
    try {
      const response = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
          rememberDevice: form.rememberDevice,
        }),
      });
      const payload = await response.json();
      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || "Unable to sign in.");
      }
      setStatus("success");
      router.refresh();
    } catch (err) {
      console.error("Admin login failed", err);
      setStatus("error");
      setError(err.message || "Unable to sign in.");
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl shadow-slate-200/50">
      <div className="p-8">
        <div className="mb-6 flex items-center gap-3">
           <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-600">
             <ShieldCheck size={20} />
           </div>
           <h2 className="text-lg font-semibold text-slate-900">Secure Sign In</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Email Address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20"
              placeholder="admin@kwsc.gos.pk"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm outline-none transition focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/20 pr-10"
                placeholder="••••••••••••"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {form.password && (
              <p
                className={`mt-1 text-xs ${
                  passwordStrength === "strong"
                    ? "text-emerald-500"
                    : passwordStrength === "acceptable"
                    ? "text-amber-500"
                    : "text-rose-500"
                }`}
              >
                Strength: {passwordStrength}
              </p>
            )}
          </div>

          <label className="flex items-center gap-3 text-sm text-slate-600">
            <input
              type="checkbox"
              checked={form.rememberDevice}
              onChange={(event) => setForm((prev) => ({ ...prev, rememberDevice: event.target.checked }))}
              className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
            />
            Trust this device for 12 hours
          </label>

          {error && <div className="rounded-xl border border-rose-100 bg-rose-50 p-3 text-sm text-rose-600">{error}</div>}

          <button
            type="submit"
            disabled={disableSubmit}
            className="w-full rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 py-2.5 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:shadow-blue-500/40 disabled:opacity-70"
          >
            {status === "submitting" ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={16} className="animate-spin" /> Authenticating...
              </span>
            ) : (
              "Access Portal"
            )}
          </button>
        </form>
      </div>
      <div className="bg-slate-50 px-8 py-4 text-center text-xs text-slate-500 border-t border-slate-100">
        Protected by Argon2 encryption & audit logging.
      </div>
    </div>
  );
}
