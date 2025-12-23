"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function GetYourBill({ open, onClose }) {
  const [consumerId, setConsumerId] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  if (!open) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!consumerId.trim()) {
      setError("Please enter a Consumer ID.");
      return;
    }

    // Navigate to bill view page
    router.push(`/bill/view?consumerId=${encodeURIComponent(consumerId.trim())}`);
    // Close the modal
    onClose();
  };

  const handleClose = () => {
    setConsumerId("");
    setError(null);
    onClose();
  };

  return (
    <>
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={handleClose}
      >
        <div 
          className="bg-white rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={handleClose}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl z-10"
          >
            ✕
          </button>

          {/* Form View */}
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4 text-blue-700">
              Get Your Water Bill
            </h2>

            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="consumerId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Consumer Number/ID
                </label>
                <input
                  id="consumerId"
                  type="text"
                  value={consumerId}
                  onChange={(e) => {
                    const value = e.target.value;
                    // Allow only alphanumeric
                    if (/^[a-zA-Z0-9]*$/.test(value) || value === "") {
                      setConsumerId(value);
                      setError(null);
                    }
                  }}
                  placeholder="Enter Consumer Number"
                  className="w-full border border-gray-300 p-3 rounded text-[#000] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition font-medium"
              >
                Get Bill
              </button>
            </form>
          </div>
        </div>
      </div>

    </>
  );
}
