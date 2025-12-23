"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoveRight, X } from "lucide-react";

export default function EComplaintPopup({ open, onClose }) {
  const [formData, setFormData] = useState({
    customer_num: "",
    customer_name: "",
    phone: "",
    email: "",
    town_id: "",
    sub_town_id: "",
    address: "",
    landmark: "",
    type_id: "",
    subtype_id: "",
    description: "",
    image: null,
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [towns, setTowns] = useState([]);
  const [subTowns, setSubTowns] = useState([]);
  const [complaintTypes, setComplaintTypes] = useState([]);
  const [subTypes, setSubTypes] = useState([]);
  const [loadingTowns, setLoadingTowns] = useState(false);
  const [loadingSubTowns, setLoadingSubTowns] = useState(false);
  const [loadingTypes, setLoadingTypes] = useState(false);
  const [loadingSubTypes, setLoadingSubTypes] = useState(false);
  const recaptchaRef = useRef(null);
  const recaptchaWidgetId = useRef(null);

  // Complaint Type mapping based on backend document
  const complaintTypeMap = [
    { id: 1, name: "SEWERAGE COMPLAINS" },
    { id: 2, name: "WATER COMPLAINS" },
    { id: 3, name: "BILLING" },
    { id: 4, name: "BULK SUPPLY WATER" },
    { id: 5, name: "NEW CONNECTION COMMERCIAL" },
    { id: 6, name: "HYDRANT COMPLAINT" },
    { id: 7, name: "ENVIRONMENTAL/SOCIAL COMPLAINS" },
    { id: 8, name: "OTHER" },
    { id: 9, name: "REQUEST FOR INFORMATION" },
  ];

  // Hardcoded towns list (can be fetched from API if available)
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
      setComplaintTypes(complaintTypeMap);
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
      customer_num: "",
      customer_name: "",
      phone: "",
      email: "",
      town_id: "",
      sub_town_id: "",
      address: "",
      landmark: "",
      type_id: "",
      subtype_id: "",
      description: "",
      image: null,
    });
    setSubTowns([]);
    setSubTypes([]);
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
    } else if (name === "type_id") {
      setFormData(prev => ({ ...prev, [name]: value, subtype_id: "" }));
      setSubTypes([]);
      if (value) {
        fetchSubTypes(value);
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

  const fetchSubTypes = async (typeId) => {
    setLoadingSubTypes(true);
    try {
      const response = await fetch(`/api/kwsc/subtype?type_id=${typeId}`);
      if (response.ok) {
        const data = await response.json();
        setSubTypes(data || []);
      } else {
        setSubTypes([]);
      }
    } catch (err) {
      console.error("Error fetching sub-types:", err);
      setSubTypes([]);
    } finally {
      setLoadingSubTypes(false);
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
    payload.append("description", formData.description.substring(0, 350));
    payload.append("customer_name", formData.customer_name);
    payload.append("phone", formData.phone);
    payload.append("g-recaptcha-response", recaptchaToken);

    if (formData.customer_num) payload.append("customer_num", formData.customer_num);
    if (formData.email) payload.append("email", formData.email);
    if (formData.address) payload.append("address", formData.address);
    if (formData.landmark) payload.append("landmark", formData.landmark);
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
        setError(data.error || "Failed to submit complaint. Please try again.");
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

        {/* HEADER BANNER */}
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 py-8 sm:py-12 shadow-lg">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-wide">
              Register Your Complaint
            </h1>
            <p className="text-blue-200 mt-2 text-base sm:text-lg">
              Karachi Water & Sewerage Corporation – Customer Facilitation Portal
            </p>
          </div>
        </div>

        {/* FORM CONTAINER */}
        <div className="p-6 sm:p-10">
          {success && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-md border border-green-200 text-center">
              ✅ Your complaint has been submitted successfully.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Consumer Number */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Consumer # (as per bill)</label>
              <input
                type="text"
                name="customer_num"
                value={formData.customer_num}
                onChange={handleChange}
                placeholder="Enter consumer number (optional)"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Name + Phone */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Applicant Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                required
                maxLength={255}
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
                maxLength={20}
                placeholder="03001234567"
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
                maxLength={255}
                placeholder="your@email.com"
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
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
                <option value="">-- Select Town --</option>
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
                <option value="">{loadingSubTowns ? "Loading..." : "-- Select UC / Mohalla --"}</option>
                {subTowns.map(st => (
                  <option key={st.id} value={st.id}>{st.title}</option>
                ))}
              </select>
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                maxLength={500}
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
                maxLength={255}
                placeholder="e.g. Near water tank, park, etc."
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              />
            </div>

            {/* Complaint Type + Grievance */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Complaint Type *</label>
              <select
                name="type_id"
                value={formData.type_id}
                onChange={handleChange}
                required
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700"
              >
                <option value="">-- Select Type --</option>
                {complaintTypes.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Grievance / Subtype *</label>
              <select
                name="subtype_id"
                value={formData.subtype_id}
                onChange={handleChange}
                required
                disabled={!formData.type_id || loadingSubTypes}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50"
              >
                <option value="">{loadingSubTypes ? "Loading..." : "-- Select Grievance --"}</option>
                {subTypes.map(st => (
                  <option key={st.id} value={st.id}>{st.title}</option>
                ))}
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
              <p className="text-xs text-gray-500">{formData.description.length}/350 characters</p>
            </div>

            {/* Picture */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Attach Picture (optional)</label>
              <input
                type="file"
                name="image"
                accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,image/svg+xml"
                onChange={handleChange}
                className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                           focus:outline-none"
              />
              <p className="text-xs text-gray-500">Max size: 2MB. Formats: JPEG, JPG, PNG, GIF, WEBP, SVG</p>
            </div>

            {/* reCAPTCHA */}
            {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY && (
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Security Verification *</label>
                <div ref={recaptchaRef} className="flex justify-center"></div>
              </div>
            )}

            {/* Submit */}
            <div className="md:col-span-2 mt-6 flex justify-end">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-3 px-8 py-3 rounded-lg 
                           bg-blue-700 hover:bg-blue-900 text-white font-medium 
                           transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? "Submitting..." : "Submit Complaint"}
                <MoveRight size={20} />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
