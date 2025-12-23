"use client";

import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function TrackComplaintPopup({ open, onClose }) {
  const [complaintNumber, setComplaintNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [complaintData, setComplaintData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setComplaintData(null);
    
    if (!complaintNumber.trim() || !phone.trim()) {
      setError("Please enter both complaint number and phone number");
      return;
    }

    // Remove "COMPLAINT-" prefix if present
    const compNum = complaintNumber.replace(/^COMPLAINT-?/i, "").trim();
    
    setLoading(true);
    try {
      const response = await fetch(`/api/kwsc/track-complaint?comp_num=${compNum}&phone=${encodeURIComponent(phone)}`);
      const data = await response.json();
      
      if (response.ok && data.success) {
        setComplaintData(data);
      } else {
        setError(data.error || "Complaint not found. Please check your complaint number and phone number.");
      }
    } catch (err) {
      console.error("Error tracking complaint:", err);
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setComplaintNumber("");
    setPhone("");
    setError("");
    setComplaintData(null);
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start pt-20 justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative my-8">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
          disabled={loading}
        >
          <X size={24} />
        </button>

        {/* HEADER BANNER */}
        <div className="w-full bg-gradient-to-r from-blue-700 to-blue-900 py-8 sm:py-12 shadow-lg">
          <div className="max-w-5xl mx-auto text-center px-6">
            <h1 className="text-3xl sm:text-4xl font-semibold text-white tracking-wide">
              Track Your Complaint
            </h1>
            <p className="text-blue-200 mt-2 text-base sm:text-lg">
              Karachi Water & Sewerage Corporation – Customer Facilitation Portal
            </p>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-6 sm:p-10">
          {!complaintData ? (
            <>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-100 text-red-800 rounded-md border border-red-200">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Complaint Number *</label>
                  <input
                    type="text"
                    value={complaintNumber}
                    onChange={(e) => setComplaintNumber(e.target.value)}
                    placeholder="Enter complaint number (e.g., 31456 or COMPLAINT-31456)"
                    className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-700"
                    required
                  />
                  <p className="text-xs text-gray-500">Enter the complaint number you received after submission</p>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-700">Phone Number *</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter phone number used during registration"
                    className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                               focus:outline-none focus:ring-2 focus:ring-blue-700"
                    required
                  />
                  <p className="text-xs text-gray-500">Enter the phone number you used when submitting the complaint</p>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition font-medium"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="inline-flex items-center gap-2 px-8 py-3 rounded-lg 
                               bg-blue-700 hover:bg-blue-900 text-white font-medium 
                               transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        Searching...
                      </>
                    ) : (
                      <>
                        <Search size={20} />
                        Track Complaint
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-100 text-green-800 rounded-md border border-green-200">
                Complaint found! Here are the details:
              </div>
              
              <div className="bg-gray-50 rounded-lg p-6 space-y-4">
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: complaintData.html }}
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleClose}
                  className="px-8 py-3 rounded-lg bg-blue-700 hover:bg-blue-900 text-white font-medium transition-all shadow-md"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

