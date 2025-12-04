"use client";

import React, { useState } from "react";
import { MoveRight } from "lucide-react";

export default function NewConnectionPage() {
  const [formData, setFormData] = useState({
    applicantName: "",
    cnic: "",
    contact: "",
    email: "",
    address: "",
    propertyType: "",
    constructionStatus: "",
    connectionType: "",
    documents: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Your New Connection Request has been submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pt-32 pb-20 px-6">

      {/* Page Container */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-10 rounded-3xl shadow-lg">

        {/* Title */}
        <h1 className="text-4xl font-semibold mb-2 text-blue-900">
          Apply for New Water Connection
        </h1>

        <p className="text-gray-600 mb-10 text-lg">
          Fill out the form below to submit your request for a new KW&SC water connection.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Applicant Name */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Applicant Full Name</label>
            <input
              type="text"
              name="applicantName"
              value={formData.applicantName}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
              placeholder="Enter your full name"
            />
          </div>

          {/* CNIC */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">CNIC Number</label>
            <input
              type="text"
              name="cnic"
              value={formData.cnic}
              onChange={handleChange}
              required
              placeholder="42101-0000000-0"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              required
              placeholder="+92 300 1234567"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Property Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
              rows={3}
              placeholder="Enter complete property address"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            ></textarea>
          </div>

          {/* Property Type */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Property Type</label>
            <select
              name="propertyType"
              value={formData.propertyType}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select</option>
              <option>Residential</option>
              <option>Commercial</option>
              <option>Industrial</option>
            </select>
          </div>

          {/* Construction Status */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Construction Status</label>
            <select
              name="constructionStatus"
              value={formData.constructionStatus}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select</option>
              <option>Completed</option>
              <option>Under Construction</option>
              <option>Empty Plot</option>
            </select>
          </div>

          {/* Connection Type */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Connection Type Required</label>
            <select
              name="connectionType"
              value={formData.connectionType}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">Select</option>
              <option>New Water Connection</option>
              <option>Sewerage Connection</option>
              <option>Both Water & Sewerage</option>
            </select>
          </div>

          {/* Upload Documents */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Upload Required Documents</label>
            <input
              type="file"
              name="documents"
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none"
            />
            <p className="text-xs text-gray-500">
              Allowed formats: PDF, JPG, PNG — <strong>Max size: 10MB</strong>
            </p>
          </div>

          {/* Submit Button */}
          <div className="md:col-span-2 mt-6 flex justify-end">
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-8 py-3 rounded-lg 
                         bg-blue-700 hover:bg-blue-900 text-white font-medium 
                         transition-all shadow-md"
            >
              Submit Request
              <MoveRight size={20} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
