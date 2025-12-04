"use client";
import React from "react";
import Loader from "@/components/Loader";
import { useEducationData } from "@/hooks/useEducationData";

export default function Education() {
  const { data, loading, error } = useEducationData();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Failed to load education resources.</div>;

  const resources = data?.resources || [];

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {resources.length > 0 ? (
          resources.map((resource) => (
            <div key={resource.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="h-48 overflow-hidden bg-gray-100">
                <img 
                  src={resource.image} 
                  alt={resource.title} 
                  className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6 flex-grow flex flex-col">
                <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">
                  {resource.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow">
                  {resource.description}
                </p>
                {/* If there's rich content, we might want a 'Read More' link or modal */}
                {/* For now, just displaying the summary card */}
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            No education resources available at the moment.
          </div>
        )}
      </div>
    </section>
  );
}
