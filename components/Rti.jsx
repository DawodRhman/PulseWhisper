"use client";
import React from "react";
import { FileText, ExternalLink } from "lucide-react";
import Loader from "@/components/Loader";
import { useRtiData } from "@/hooks/useRtiData";

export default function Rti() {
  const { data, loading, error } = useRtiData();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Failed to load RTI data.</div>;

  const documents = data?.documents || [];

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {documents.length > 0 ? (
          documents.map((doc) => (
            <div key={doc.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-blue-50 rounded-lg text-blue-600">
                  <FileText size={24} />
                </div>
                <span className="text-xs font-medium px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full">
                  {doc.type}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                {doc.title}
              </h3>
              
              <p className="text-gray-600 text-sm mb-6 line-clamp-3">
                {doc.description}
              </p>
              
              <a 
                href={doc.link} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
              >
                {doc.link && doc.link.startsWith("http") ? "View Document" : "Download"}
                <ExternalLink size={16} className="ml-2" />
              </a>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No RTI documents available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
