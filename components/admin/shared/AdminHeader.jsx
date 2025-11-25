"use client";
import React from "react";
import { Loader2, Plus } from "lucide-react";

export default function AdminHeader({ title, description, onAdd, isAdding }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <p className="text-slate-500">{description}</p>
      </div>
      {onAdd && (
        <button
          onClick={onAdd}
          disabled={isAdding}
          className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isAdding ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Plus className="w-4 h-4 mr-2" />
          )}
          Add New
        </button>
      )}
    </div>
  );
}
