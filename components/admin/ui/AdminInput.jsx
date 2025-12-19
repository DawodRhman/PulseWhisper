
export function AdminInput({ label, type = "text", className = "", ...props }) {
    return (
        <label className="block">
            {label && <span className="text-xs font-semibold text-slate-500">{label}</span>}
            <input
                type={type}
                className={`mt-1.5 w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 disabled:opacity-50 disabled:bg-slate-100 disabled:cursor-not-allowed ${className}`}
                {...props}
            />
        </label>
    );
}
