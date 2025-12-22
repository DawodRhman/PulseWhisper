"use client";

import React, { useState } from "react";

export default function PaymentModal({ open, onClose, onSubmit, isProcessing }) {
  const [mobileNumber, setMobileNumber] = useState("");
  const [cnic, setCnic] = useState("");
  const [errors, setErrors] = useState({});

  if (!open) return null;

  // Custom input mask handler for mobile number (11 digits)
  const handleMobileChange = (e) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 11);
    setMobileNumber(value);
    if (errors.mobileNumber) {
      setErrors({ ...errors, mobileNumber: "" });
    }
  };

  // Custom input mask handler for CNIC (format: XXXXX-X)
  const handleCnicChange = (e) => {
    let value = e.target.value.replace(/\D/g, "").slice(0, 6);
    // Format as XXXXX-X
    if (value.length > 5) {
      value = value.slice(0, 5) + "-" + value.slice(5);
    }
    setCnic(value);
    if (errors.cnic) {
      setErrors({ ...errors, cnic: "" });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    // Validate mobile number (11 digits)
    const mobileClean = mobileNumber.replace(/\D/g, "");
    if (!mobileNumber || mobileClean.length !== 11 || !/^\d+$/.test(mobileClean)) {
      newErrors.mobileNumber = "Please enter valid mobile number (11 digits).";
    }

    // Validate CNIC (last 6 digits, format: XXXXX-X)
    const cnicClean = cnic.replace(/-/g, "");
    if (!cnic || cnicClean.length !== 6 || !/^\d{5}-\d$/.test(cnic)) {
      newErrors.cnic = "Please enter last 6 digits of CNIC in format XXXXX-X.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validate()) {
      onSubmit({
        mobileNumber: mobileNumber.replace(/\D/g, ""),
        cnic: cnic,
      });
    }
  };

  const handleClose = () => {
    setMobileNumber("");
    setCnic("");
    setErrors({});
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
          disabled={isProcessing}
        >
          ✕
        </button>

        <div className="mb-4 text-center">
          <img
            src="/jazzcash.png"
            alt="JazzCash"
            className="h-10 mx-auto mb-3"
            onError={(e) => {
              e.target.style.display = "none";
            }}
          />
          <h2 className="text-xl font-semibold text-blue-700">
            Enter your JazzCash account details
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Mobile Number
            </label>
            <input
              id="mobileNumber"
              type="text"
              value={mobileNumber}
              onChange={handleMobileChange}
              className="w-full border border-gray-300 p-3 rounded text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="03000000000"
              disabled={isProcessing}
              maxLength={11}
            />
            {errors.mobileNumber && (
              <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
            )}
          </div>

          <div>
            <label htmlFor="cnic" className="block text-sm font-medium text-gray-700 mb-1">
              CNIC (Last 6 digits)
            </label>
            <input
              id="cnic"
              type="text"
              value={cnic}
              onChange={handleCnicChange}
              className="w-full border border-gray-300 p-3 rounded text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="12345-6"
              disabled={isProcessing}
              maxLength={7}
            />
            {errors.cnic && (
              <p className="mt-1 text-sm text-red-600">{errors.cnic}</p>
            )}
            <small className="text-gray-500 text-xs mt-1 block">
              The CNIC should be the one registered with the provided JazzCash Wallet/Account,
              otherwise the transaction will fail.
            </small>
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-700"></div>
              <p className="mt-2 text-sm text-blue-700">
                Your payment is being processed. Please hold on for a moment.
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 bg-gray-200 text-gray-700 py-3 rounded hover:bg-gray-300 transition font-medium"
              disabled={isProcessing}
            >
              Close
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Pay Now"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

