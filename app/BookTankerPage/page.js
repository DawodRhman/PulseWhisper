"use client";

import React, { useState, useEffect } from "react";
import { MoveRight } from "lucide-react";
import Link from "next/link";

export default function BookTankerPage() {
  const [bookingData, setBookingData] = useState({
    name: "",
    phone: "",
    address: "",
    tankerType: "",
  });

  const [showPage, setShowPage] = useState(false);

  // Request location permission on load
  useEffect(() => {
    const requestLocation = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          () => setShowPage(true), // Permission granted
          () => setShowPage(true)  // Permission denied, still show page
        );
      } else {
        setShowPage(true); // Geolocation not supported
      }
    };
    requestLocation();
  }, []);

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
  };

  if (!showPage) {
    // Popup screen while requesting location
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-900 px-6">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
          <h2 className="text-2xl font-semibold mb-4">Allow Location Access</h2>
          <p className="mb-6 text-gray-700">
            Please allow location access to continue booking your tanker.
          </p>
          <button
            onClick={() => navigator.geolocation.getCurrentPosition(
              () => setShowPage(true),
              () => setShowPage(true)
            )}
            className="px-6 py-3 bg-blue-700 text-white rounded-lg font-medium hover:bg-blue-800 transition"
          >
            Allow Location
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 pt-32 pb-20 px-6">
      {/* Page Container */}
      <div className="max-w-4xl mx-auto bg-white border border-gray-200 p-10 rounded-3xl shadow-lg">

        {/* Title */}
        <h1 className="text-4xl font-semibold mb-2 text-blue-900">
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

      {/* Back Home */}
      <div className="mt-16 text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300
                bg-gray-50 hover:bg-gray-100 font-semibold text-gray-900 transition-all duration-200"
        >
          <span>Back to Home</span>
          <MoveRight size={20} />
        </Link>
      </div>
    </div>
  );
}
