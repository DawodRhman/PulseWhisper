
import { Plus } from "lucide-react";

export function ActionForm({
    title,
    description,
    icon,
    children,
    onSubmit,
    disabled,
    submitLabel
}) {
    const buttonLabel =
        submitLabel ||
        (title && title.toLowerCase().includes("update") ? "Save Changes" : title && title.toLowerCase().includes("edit") ? "Save Changes" : "Create");

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
                {description && <p className="text-xs text-slate-500 mt-1">{description}</p>}
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
