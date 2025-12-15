"use client";

import React, { useState, useEffect } from "react";
import { MoveRight, X } from "lucide-react";

export default function BookTankerPopup({ open, onClose }) {
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    address: "",
    tankerType: "",
  });

  const [showForm, setShowForm] = useState(false);

  // Request location permission when popup opens
  useEffect(() => {
    if (open) {
      const requestLocation = () => {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            () => setShowForm(true), // Permission granted
            () => setShowForm(true)  // Permission denied, still show form
          );
        } else {
          setShowForm(true); // Geolocation not supported
        }
      };
      requestLocation();
    } else {
      setShowForm(false);
    }
  }, [open]);

  const handleBookingChange = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const handleBookingSubmit = (e) => {
    e.preventDefault();
    alert("Tanker booked successfully! Your booking ID: TX12345");
    setBookingData({
      name: "",
      phone: "",
      address: "",
      tankerType: "",
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-start pt-20 justify-center z-[100] p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 transition-all"
        >
          <X size={24} />
        </button>

        {!showForm ? (
          // Location Permission Screen
          <div className="p-6 sm:p-10 text-center">
            <h2 className="text-2xl sm:text-3xl font-semibold mb-4 text-blue-900">
              Allow Location Access
            </h2>
            <p className="mb-6 text-gray-700 text-lg">
              Please allow location access to continue booking your tanker.
            </p>
            <button
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    () => setShowForm(true),
                    () => setShowForm(true)
                  );
                } else {
                  setShowForm(true);
                }
              }}
              className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition"
            >
              Allow Location
            </button>
          </div>
        ) : (
          // Booking Form
          <div className="p-6 sm:p-10">
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-semibold mb-2 text-blue-900 pr-10">
              Book Your Tanker
            </h1>
            <p className="text-gray-600 mb-10 text-lg">
              Fill out the form below to book your water tanker easily.
            </p>

            {/* Form */}
            <form onSubmit={handleBookingSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={bookingData.name}
                  onChange={handleBookingChange}
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone */}
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  value={bookingData.phone}
                  onChange={handleBookingChange}
                  required
                  placeholder="+92 300 1234567"
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Address */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Address</label>
                <input
                  type="text"
                  name="address"
                  value={bookingData.address}
                  onChange={handleBookingChange}
                  required
                  placeholder="Enter delivery address"
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                />
              </div>

              {/* Tanker Type */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <label className="text-sm font-medium text-gray-700">Select Tanker Type (Gallons)</label>
                <select
                  name="tankerType"
                  value={bookingData.tankerType}
                  onChange={handleBookingChange}
                  required
                  className="px-4 py-3 rounded-lg border border-gray-300 bg-gray-50 text-gray-900
                             focus:outline-none focus:ring-2 focus:ring-blue-700"
                >
                  <option value="">Select Gallons</option>
                  <option value="1000">1000 Gallons</option>
                  <option value="2000">2000 Gallons</option>
                  <option value="3000">3000 Gallons</option>
                </select>
              </div>

              {/* Submit */}
              <div className="md:col-span-2 flex justify-end mt-6">
                <button
                  type="submit"
                  className="inline-flex items-center gap-3 px-8 py-3 rounded-lg 
                             bg-blue-700 hover:bg-blue-900 text-white font-medium 
                             transition-all shadow-md"
                >
                  Book Tanker
                  <MoveRight size={20} />
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}

