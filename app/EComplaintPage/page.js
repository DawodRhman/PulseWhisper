"use client";

import React, { useState } from "react";
import { MoveRight } from "lucide-react";

export default function EComplaintPage() {
  const [formData, setFormData] = useState({
    consumerNumber: "",
    name: "",
    phone: "",
    email: "",
    town: "",
    uc: "",
    address: "",
    landmark: "",
    complaintType: "",
    grievance: "",
    description: "",
    picture: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const towns = [
    "BALDIA TOWN", "CHANESAR TOWN", "CLIFTON", "GADAP TOWN", "GULBERG TOWN",
    "GULISTAN E JOHAR TOWN", "GULSHAN E IQBAL TOWN", "IBRAHIM HYDRY TOWN",
    "JINNAH TOWN", "KEMARI TOWN", "KORANGI TOWN", "LANDHI TOWN", "LIAQUATABAD TOWN",
    "LYARI TOWN", "MALIR TOWN", "MANGOPIR TOWN (SURJANI TOWN)", "MODEL ZONE TOWN",
    "MOMINABAD TOWN", "NAZIMABAD TOWN", "NEW KARACHI TOWN", "NORTH NAZIMABAD TOWN",
    "ORANGI TOWN", "SADDAR TOWN", "SAFOORA TOWN", "SHAH FAISAL TOWN", "SITE TOWN",
    "SITE TOWN (MORIRO MIR BAHAR)", "SOHRAB GOTH TOWN"
  ];

  const complaintTypes = [
    "BILLING", "BULK SUPPLY", "WATER", "ENVIRONMENTAL/SOCIAL COMPLAINS",
    "HYDRANT COMPLAINT", "NEW CONNECTION", "COMMERCIAL", "OTHER",
    "REQUEST FOR INFORMATION", "SEWERAGE COMPLAINS", "WATER COMPLAINS"
  ];

  const grievances = [
    "Service Delay", "Leakage", "No Water", "High Bill", "Other"
  ];

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = new FormData();
    for (const key in formData) {
      payload.append(key, formData[key]);
    }

    try {
      const res = await fetch("/api/complaint", { method: "POST", body: payload });
      if (res.ok) {
        setSuccess(true);
        setFormData({
          consumerNumber: "",
          name: "",
          phone: "",
          email: "",
          town: "",
          uc: "",
          address: "",
          landmark: "",
          complaintType: "",
          grievance: "",
          description: "",
          picture: null,
        });
      }
    } catch (err) {
      console.error("Error submitting", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 pt-32 pb-20 px-6">

      {/* HEADER BANNER */}
      <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 py-12 shadow-lg">
        <div className="max-w-5xl mx-auto text-center px-6">
          <h1 className="text-4xl font-semibold text-white tracking-wide">
            Register Your Complaint
          </h1>
          <p className="text-blue-200 mt-2 text-lg">
            Karachi Water & Sewerage Corporation – Customer Facilitation Portal
          </p>
        </div>
      </div>

      {/* FORM CONTAINER */}
      <div className="max-w-4xl mx-auto mt-10 bg-white border border-gray-200 p-10 rounded-3xl shadow-lg">

        {success && (
          <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 text-center">
            ✅ Your complaint has been submitted successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Consumer Number */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Consumer # (as per bill)</label>
            <input
              type="text"
              name="consumerNumber"
              value={formData.consumerNumber}
              onChange={handleChange}
              required
              placeholder="Enter consumer number"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Name + Phone */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Applicant Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter full name"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Phone Number *</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
              placeholder="+92 300 1234567"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2 md:col-span-2">
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

          {/* Town + UC */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Select Town *</label>
            <select
              name="town"
              value={formData.town}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">-- Select Town --</option>
              {towns.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">UC / Mohalla *</label>
            <input
              type="text"
              name="uc"
              value={formData.uc}
              onChange={handleChange}
              required
              placeholder="Enter UC / Mohalla"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows={3}
              placeholder="Enter full address"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Landmark */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Nearest Landmark *</label>
            <input
              type="text"
              name="landmark"
              value={formData.landmark}
              onChange={handleChange}
              required
              placeholder="e.g. Near water tank, park, etc."
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Complaint Type + Grievance */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Complaint Type *</label>
            <select
              name="complaintType"
              value={formData.complaintType}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">-- Select Type --</option>
              {complaintTypes.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Grievance *</label>
            <select
              name="grievance"
              value={formData.grievance}
              onChange={handleChange}
              required
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            >
              <option value="">-- Select Grievance --</option>
              {grievances.map(g => <option key={g}>{g}</option>)}
            </select>
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Complaint Description *</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              maxLength={350}
              required
              placeholder="Describe your complaint (max 350 characters)"
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                         focus:outline-none focus:ring-2 focus:ring-blue-700"
            />
          </div>

          {/* Picture */}
          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="text-sm font-medium text-gray-700">Attach Picture (optional)</label>
            <input
              type="file"
              name="picture"
              accept="image/*"
              onChange={handleChange}
              className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900"
            />
          </div>

          {/* Submit */}
          <div className="md:col-span-2 mt-6 flex justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 px-8 py-3 rounded-lg 
                         bg-blue-700 hover:bg-blue-900 text-white font-medium 
                         transition-all shadow-md"
            >
              {submitting ? "Submitting..." : "Submit Complaint"}
              <MoveRight size={20} />
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
