"use client";

import React, { useState, useEffect, useRef } from "react";
import { MoveRight, X } from "lucide-react";
import {
  validateName,
  validatePhone,
  validateEmail,
  validateAddress,
  validateLandmark,
  validateDescription,
  validateCNIC,
} from "@/lib/validations/complaintValidations";

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
    title: "",
  });

  const [fieldErrors, setFieldErrors] = useState({});
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

  // Hardcoded towns list
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
      title: "",
    });
    setSubTowns([]);
    setError("");
    setFieldErrors({});
    setSuccess(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: "" }));
    }
    
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
    } else if (name === "customer_name") {
      // Limit to 25 characters
      const limitedValue = value.slice(0, 25);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
    } else if (name === "landmark") {
      // Limit to 20 characters
      const limitedValue = value.slice(0, 20);
      setFormData(prev => ({ ...prev, [name]: limitedValue }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
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

  const validateForm = () => {
    const errors = {};
    
    const nameError = validateName(formData.customer_name);
    if (nameError) errors.customer_name = nameError;
    
    const cnicError = validateCNIC(formData.customer_cnic);
    if (cnicError) errors.customer_cnic = cnicError;
    
    const phoneError = validatePhone(formData.phone);
    if (phoneError) errors.phone = phoneError;
    
    const emailError = validateEmail(formData.email);
    if (emailError) errors.email = emailError;
    
    const addressError = validateAddress(formData.address);
    if (addressError) errors.address = addressError;
    
    const landmarkError = validateLandmark(formData.landmark);
    if (landmarkError) errors.landmark = landmarkError;
    
    if (formData.description) {
      const descError = validateDescription(formData.description);
      if (descError) errors.description = descError;
    }
    
    if (!formData.town_id) errors.town_id = "Please select a town";
    if (!formData.sub_town_id) errors.sub_town_id = "Please select UC / Mohalla";
    if (!formData.type_id || !formData.subtype_id) errors.connectionType = "Please select connection type";
    
    if (isCommercial && !formData.business_nature) {
      errors.business_nature = "Nature of business is required for commercial connections";
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) {
      setError("Please fix the errors in the form");
      return;
    }
    
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

    // Count words in description
    const words = formData.description.trim().split(/\s+/).filter(word => word.length > 0);
    const descriptionText = words.slice(0, 250).join(" ");

    const payload = new FormData();
    payload.append("town_id", formData.town_id);
    payload.append("sub_town_id", formData.sub_town_id);
    payload.append("type_id", formData.type_id);
    payload.append("subtype_id", formData.subtype_id);
    payload.append("description", descriptionText ? descriptionText.substring(0, 350) : "New connection request");
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
  const wordCount = formData.description.trim().split(/\s+/).filter(word => word.length > 0).length;

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
              Apply for New Connection
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
              ✅ Your new connection request has been submitted successfully.
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-md border border-red-200 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Applicant Name */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Applicant Full Name *</label>
              <input
                type="text"
                name="customer_name"
                value={formData.customer_name}
                onChange={handleChange}
                maxLength={25}
                placeholder="Enter your full name (max 25 characters)"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.customer_name ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.customer_name && (
                <p className="text-xs text-red-600">{fieldErrors.customer_name}</p>
              )}
              <p className="text-xs text-gray-500">{formData.customer_name.length}/25 characters</p>
            </div>

            {/* CNIC */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">CNIC Number *</label>
              <input
                type="text"
                name="customer_cnic"
                value={formData.customer_cnic}
                onChange={handleChange}
                maxLength={15}
                placeholder="42101-0000000-0"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.customer_cnic ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.customer_cnic && (
                <p className="text-xs text-red-600">{fieldErrors.customer_cnic}</p>
              )}
            </div>

            {/* Contact */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Contact Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="021-12345678 or +92-21-12345678"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.phone ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.phone && (
                <p className="text-xs text-red-600">{fieldErrors.phone}</p>
              )}
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
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.email ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.email && (
                <p className="text-xs text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Property Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={3}
                maxLength={500}
                placeholder="Enter complete property address"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.address ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.address && (
                <p className="text-xs text-red-600">{fieldErrors.address}</p>
              )}
            </div>

            {/* Town + UC */}
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">Select Town *</label>
              <select
                name="town_id"
                value={formData.town_id}
                onChange={handleChange}
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.town_id ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="">Select Town</option>
                {towns.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
              {fieldErrors.town_id && (
                <p className="text-xs text-red-600">{fieldErrors.town_id}</p>
              )}
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-700">UC / Mohalla *</label>
              <select
                name="sub_town_id"
                value={formData.sub_town_id}
                onChange={handleChange}
                disabled={!formData.town_id || loadingSubTowns}
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700 disabled:opacity-50
                           ${fieldErrors.sub_town_id ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="">{loadingSubTowns ? "Loading..." : "Select UC / Mohalla"}</option>
                {subTowns.map(st => (
                  <option key={st.id} value={st.id}>{st.title}</option>
                ))}
              </select>
              {fieldErrors.sub_town_id && (
                <p className="text-xs text-red-600">{fieldErrors.sub_town_id}</p>
              )}
            </div>

            {/* Landmark */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Nearest Landmark *</label>
              <input
                type="text"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                maxLength={20}
                placeholder="e.g. Near water tank, park, etc. (15-20 characters)"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.landmark ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.landmark && (
                <p className="text-xs text-red-600">{fieldErrors.landmark}</p>
              )}
              <p className="text-xs text-gray-500">{formData.landmark.length}/20 characters (min 15)</p>
            </div>

            {/* Connection Type */}
            <div className="flex flex-col gap-2 md:col-span-2">
              <label className="text-sm font-medium text-gray-700">Connection Type Required *</label>
              <select
                name="connectionType"
                value={connectionTypes.find(ct => ct.type_id.toString() === formData.type_id && ct.subtype_id.toString() === formData.subtype_id)?.name || ""}
                onChange={handleChange}
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.connectionType ? "border-red-300" : "border-gray-300"}`}
              >
                <option value="">Select Connection Type</option>
                <option value="New Water Connection">New Water Connection</option>
                <option value="New Sewerage Connection">New Sewerage Connection</option>
                <option value="New Commercial Connection">New Commercial Connection</option>
                <option value="New Bulk Connection">New Bulk Connection</option>
              </select>
              {fieldErrors.connectionType && (
                <p className="text-xs text-red-600">{fieldErrors.connectionType}</p>
              )}
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
                  maxLength={255}
                  placeholder="e.g. Office, Shop, Factory"
                  className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700
                             ${fieldErrors.business_nature ? "border-red-300" : "border-gray-300"}`}
                />
                {fieldErrors.business_nature && (
                  <p className="text-xs text-red-600">{fieldErrors.business_nature}</p>
                )}
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
                placeholder="Additional details about your connection request (max 250 words)"
                className={`px-4 py-3 rounded-lg border bg-gray-50 text-gray-900
                           focus:outline-none focus:ring-2 focus:ring-blue-700
                           ${fieldErrors.description ? "border-red-300" : "border-gray-300"}`}
              />
              {fieldErrors.description && (
                <p className="text-xs text-red-600">{fieldErrors.description}</p>
              )}
              <p className="text-xs text-gray-500">
                {wordCount}/250 words, {formData.description.length}/350 characters
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
