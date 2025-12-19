
import { Search } from "lucide-react";

export function SearchInput({ value, onChange, placeholder = "Search..." }) {
    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
            </div>
            <input
                type="text"
                className="block w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-10 pr-3 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400"
                placeholder={placeholder}
                value={value}
                onChange={onChange}
            />
        </div>
    );
}
