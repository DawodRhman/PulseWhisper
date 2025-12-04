"use client";
import React from "react";
import { Phone, Mail, Clock, MapPin } from "lucide-react";
import Loader from "@/components/Loader";
import { useContactData } from "@/hooks/useContactData";

export default function Contact() {
  const { data, loading, error } = useContactData();

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">Failed to load contact data.</div>;

  const { channels = [], offices = [] } = data || {};

  return (
    <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
      {/* Contact Channels */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Channels</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {channels.map((channel) => (
            <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{channel.label}</h3>
              <p className="text-gray-600 mb-4 text-sm">{channel.description}</p>
              <div className="space-y-2">
                {channel.phone && (
                  <div className="flex items-center text-gray-700">
                    <Phone size={16} className="mr-2 text-blue-600" />
                    <span>{channel.phone}</span>
                  </div>
                )}
                {channel.email && (
                  <div className="flex items-center text-gray-700">
                    <Mail size={16} className="mr-2 text-blue-600" />
                    <a href={`mailto:${channel.email}`} className="hover:text-blue-800">{channel.email}</a>
                  </div>
                )}
                {channel.availability && (
                  <div className="flex items-center text-gray-700">
                    <Clock size={16} className="mr-2 text-blue-600" />
                    <span className="text-sm">{channel.availability}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Offices */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Offices</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {offices.map((office) => (
            <div key={office.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
              <div className="p-6 flex-grow">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">{office.label}</h3>
                <div className="flex items-start text-gray-600 mb-4">
                  <MapPin size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
                  <p>{office.address}</p>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  {office.phone && (
                    <div className="flex items-center">
                      <Phone size={16} className="mr-2 text-blue-600" />
                      <span>{office.phone}</span>
                    </div>
                  )}
                  {office.email && (
                    <div className="flex items-center">
                      <Mail size={16} className="mr-2 text-blue-600" />
                      <span>{office.email}</span>
                    </div>
                  )}
                  {office.hours && (
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2 text-blue-600" />
                      <span>{office.hours}</span>
                    </div>
                  )}
                </div>
              </div>
              {office.mapEmbedUrl && (
                <div className="h-48 w-full bg-gray-100">
                  <iframe
                    src={office.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
