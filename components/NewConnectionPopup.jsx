"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoveRight, X } from "lucide-react";

export default function NewConnectionPopup({ open, onClose }) {
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_cnic: "",
    phone: "",
    email: "",
    town_id: "",
    sub_town_id: "",
    address: "",
    landmark: "",
    type_id: "",
    subtype_id: "",
    description: "",
    residential_type: "",
    shops_count: "",
    business_nature: "",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [towns, setTowns] = useState([]);
  const [subTowns, setSubTowns] = useState([]);
  const [loadingSubTowns, setLoadingSubTowns] = useState(false);
  const recaptchaRef = useRef(null);
  const recaptchaWidgetId = useRef(null);

  // Connection Type Options
  const connectionTypes = [
    { type_id: 2, subtype_id: 85, name: "New Water Connection", title: "New Water Connection" },
    { type_id: 1, subtype_id: 93, name: "New Sewerage Connection", title: "New Sewerage Connection" },
    { type_id: 5, subtype_id: 95, name: "New Commercial Connection", title: "New Commercial Connection" },
    { type_id: 5, subtype_id: 102, name: "New Bulk Connection", title: "New Bulk Connection" },
  ];

  // Hardcoded towns list (same as EComplaintPopup)
  const hardcodedTowns = [
    { id: 1, name: "BALDIA TOWN" },
    { id: 2, name: "CHANESAR TOWN" },
    { id: 3, name: "CLIFTON" },
    { id: 4, name: "GADAP TOWN" },
    { id: 5, name: "GULBERG TOWN" },
    { id: 6, name: "GULISTAN E JOHAR TOWN" },
    { id: 7, name: "GULSHAN E IQBAL TOWN" },
    { id: 8, name: "IBRAHIM HYDRY TOWN" },
    { id: 9, name: "JINNAH TOWN" },
    { id: 10, name: "KEMARI TOWN" },
    { id: 11, name: "KORANGI TOWN" },
    { id: 12, name: "LANDHI TOWN" },
    { id: 13, name: "LIAQUATABAD TOWN" },
    { id: 14, name: "LYARI TOWN" },
    { id: 15, name: "MALIR TOWN" },
    { id: 16, name: "MANGOPIR TOWN (SURJANI TOWN)" },
    { id: 17, name: "MODEL ZONE TOWN" },
    { id: 18, name: "MOMINABAD TOWN" },
    { id: 19, name: "NAZIMABAD TOWN" },
    { id: 20, name: "NEW KARACHI TOWN" },
    { id: 21, name: "NORTH NAZIMABAD TOWN" },
    { id: 22, name: "ORANGI TOWN" },
    { id: 23, name: "SADDAR TOWN" },
    { id: 24, name: "SAFOORA TOWN" },
    { id: 25, name: "SHAH FAISAL TOWN" },
    { id: 26, name: "SITE TOWN" },
    { id: 27, name: "SITE TOWN (MORIRO MIR BAHAR)" },
    { id: 28, name: "SOHRAB GOTH TOWN" },
  ];

  useEffect(() => {
    if (open) {
      setTowns(hardcodedTowns);
      resetForm();
      
      // Wait for reCAPTCHA to load
      if (typeof window !== "undefined" && window.grecaptcha) {
        loadRecaptcha();
      } else {
        const handleRecaptchaLoad = () => {
          loadRecaptcha();
          window.removeEventListener("recaptcha-loaded", handleRecaptchaLoad);
        };
        window.addEventListener("recaptcha-loaded", handleRecaptchaLoad);
        return () => window.removeEventListener("recaptcha-loaded", handleRecaptchaLoad);
      }
    } else {
      resetRecaptcha();
    }
  }, [open]);

  const loadRecaptcha = () => {
    if (typeof window !== "undefined" && window.grecaptcha && window.grecaptcha.render) {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (siteKey && recaptchaRef.current && !recaptchaWidgetId.current) {
        try {
          recaptchaWidgetId.current = window.grecaptcha.render(recaptchaRef.current, {
            sitekey: siteKey,
            theme: "light",
          });
        } catch (err) {
          console.error("reCAPTCHA render error:", err);
        }
      }
    }
  };

  const resetRecaptcha = () => {
    if (recaptchaWidgetId.current && window.grecaptcha) {
      try {
        window.grecaptcha.reset(recaptchaWidgetId.current);
      } catch (err) {
        console.error("reCAPTCHA reset error:", err);
      }
      recaptchaWidgetId.current = null;
    }
  };

  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_cnic: "",
      phone: "",
      email: "",
      town_id: "",
      sub_town_id: "",
      address: "",
      landmark: "",
      type_id: "",
      subtype_id: "",
      description: "",
      residential_type: "",
      shops_count: "",
      business_nature: "",
      image: null,
    });
    setSubTowns([]);
    setError("");
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    
    if (name === "town_id") {
      setFormData(prev => ({ ...prev, [name]: value, sub_town_id: "" }));
      setSubTowns([]);
      if (value) {
        fetchSubTowns(value);
      }
    } else if (name === "connectionType") {
      // Handle connection type selection
      const selected = connectionTypes.find(ct => ct.name === value);
      if (selected) {
        setFormData(prev => ({ 
          ...prev, 
          type_id: selected.type_id.toString(),
          subtype_id: selected.subtype_id.toString(),
          title: selected.title
        }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: files ? files[0] : value }));
    }
  };

  const fetchSubTowns = async (townId) => {
    setLoadingSubTowns(true);
    try {
      const response = await fetch(`/api/kwsc/subtown?town_id=${townId}`);
      if (response.ok) {
        const data = await response.json();
        setSubTowns(data || []);
      } else {
        setSubTowns([]);
      }
    } catch (err) {
      console.error("Error fetching sub-towns:", err);
      setSubTowns([]);
    } finally {
      setLoadingSubTowns(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    // Get reCAPTCHA token
    const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
    let recaptchaToken = "";
    
    if (siteKey && window.grecaptcha && recaptchaWidgetId.current) {
      try {
        recaptchaToken = window.grecaptcha.getResponse(recaptchaWidgetId.current);
        if (!recaptchaToken) {
          setError("Please complete the reCAPTCHA verification.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        console.error("reCAPTCHA error:", err);
        setError("reCAPTCHA verification failed. Please try again.");
        setSubmitting(false);
        return;
      }
    }

    const payload = new FormData();
    payload.append("town_id", formData.town_id);
    payload.append("sub_town_id", formData.sub_town_id);
    payload.append("type_id", formData.type_id);
    payload.append("subtype_id", formData.subtype_id);
    payload.append("description", formData.description ? formData.description.substring(0, 350) : "New connection request");
    payload.append("customer_name", formData.customer_name);
    payload.append("phone", formData.phone);
    payload.append("customer_cnic", formData.customer_cnic);
    payload.append("g-recaptcha-response", recaptchaToken);

    if (formData.email) payload.append("email", formData.email);
    if (formData.address) payload.append("address", formData.address);
    if (formData.landmark) payload.append("landmark", formData.landmark);
    if (formData.residential_type) payload.append("residential_type", formData.residential_type);
    if (formData.shops_count) payload.append("shops_count", formData.shops_count);
    if (formData.business_nature) payload.append("business_nature", formData.business_nature);
    if (formData.title) payload.append("title", formData.title);
    if (formData.image) payload.append("image", formData.image);

    try {
      const res = await fetch("/api/kwsc/complaint", {
        method: "POST",
        body: payload,
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccess(true);
        resetForm();
        resetRecaptcha();
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 3000);
      } else {
        setError(data.error || "Failed to submit request. Please try again.");
        console.error("Submission error:", data);
      }
    } catch (err) {
      console.error("Error submitting:", err);
      setError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!open) return null;

  const isCommercial = formData.type_id === "5" && (formData.subtype_id === "95" || formData.subtype_id === "102");

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start pt-20 justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
          disabled={submitting}
        >
          <X size={24} />
        </button>

        {/* Content */}
        <div className="p-6 sm:p-10">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-blue-900 pr-10">
            Apply for New Water Connection
          </h1>

          <p className="text-gray-600 mb-10 text-lg">
            Fill out the form below to submit your request for a new KW&SC water connection.
          </p>

          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 text-center">
              ✅ Your new connection request has been submitted successfully.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-200 text-center">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Applicant Full Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                maxLength={255}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
                placeholder="Enter your full name"
              />
            </div>

            {/* CNIC */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">CNIC Number *</label>
              <input
                type="text"
                name="customer_cnic"
                value={formData.customer_cnic}
                onChange={handleChange}
                required
                maxLength={15}
                placeholder="42101-0000000-0"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Contact Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                maxLength={20}
                placeholder="03001234567"
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
                maxLength={255}
                placeholder="your@email.com"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Property Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                rows={3}
                maxLength={500}
                placeholder="Enter complete property address"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              ></textarea>
            </div>

            {/* Town + UC */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Select Town *</label>
              <select
                name="town_id"
                value={formData.town_id}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="">Select Town</option>
                {towns.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">UC / Mohalla *</label>
              <select
                name="sub_town_id"
                value={formData.sub_town_id}
                onChange={handleChange}
                required
                disabled={!formData.town_id || loadingSubTowns}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
              >
                <option value="">{loadingSubTowns ? "Loading..." : "Select UC / Mohalla"}</option>
                {subTowns.map(st => (
                  <option key={st.id} value={st.id}>{st.title}</option>
                ))}
              </select>
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
                maxLength={255}
                placeholder="e.g. Near water tank, park, etc."
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Connection Type */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Connection Type Required *</label>
              <select
                name="connectionType"
                value={connectionTypes.find(ct => ct.type_id.toString() === formData.type_id && ct.subtype_id.toString() === formData.subtype_id)?.name || ""}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="">Select Connection Type</option>
                <option value="New Water Connection">New Water Connection</option>
                <option value="New Sewerage Connection">New Sewerage Connection</option>
                <option value="New Commercial Connection">New Commercial Connection</option>
                <option value="New Bulk Connection">New Bulk Connection</option>
              </select>
            </div>

            {/* Residential Type (for residential connections) */}
            {!isCommercial && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Residential Type</label>
                <select
                  name="residential_type"
                  value={formData.residential_type}
                  onChange={handleChange}
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value="">Select</option>
                  <option value="Plot">Plot</option>
                  <option value="Flat">Flat</option>
                </select>
              </div>
            )}

            {/* Business Nature (for commercial connections) */}
            {isCommercial && (
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Nature of Business *</label>
                <input
                  type="text"
                  name="business_nature"
                  value={formData.business_nature}
                  onChange={handleChange}
                  required={isCommercial}
                  maxLength={255}
                  placeholder="e.g. Office, Shop, Factory"
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>
            )}

            {/* Shops Count / Stories */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Number of Stories/Shops</label>
              <input
                type="number"
                name="shops_count"
                value={formData.shops_count}
                onChange={handleChange}
                min="1"
                placeholder="Enter number"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Request Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                maxLength={350}
                placeholder="Additional details about your connection request (optional)"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              ></textarea>
              <p className="text-xs text-gray-500">{formData.description.length}/350 characters</p>
            </div>

            {/* Upload Documents */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Upload Required Documents (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none"
              />
              <p className="text-xs text-gray-500">
                Allowed formats: JPEG, JPG, PNG, GIF, WEBP, SVG — <strong>Max size: 2MB</strong>
              </p>
            </div>

            {/* reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Security Verification *</label>
                <div ref={recaptchaRef} className="flex justify-center"></div>
              </div>
            )}

            {/* Submit Button */}
            <div className="md:col-span-2 mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-lg 
                           bg-blue-700 hover:bg-blue-900 text-white font-medium 
                           transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Request"}
                <MoveRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
