import React from "react";

export default function GetYourBill({ open, onClose }) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative">

                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                >
                    ✕
                </button>

                <h2 className="text-xl font-semibold mb-4 text-blue-700">
                    Get Your Water Bill
                </h2>

                <form className="space-y-4">

                    <input
                        type="number"
                        placeholder="Consumer Number"
                        className="w-full border p-3 rounded text-[#000]"
                    />

                    <input
                        type="number"
                        placeholder="Meter Number"
                        className="w-full border p-3 rounded text-[#000]"
                    />

                    <button className="w-full bg-blue-700 text-white py-3 rounded hover:bg-blue-800 transition">
                        Download Bill
                    </button>

                </form>
            </div>
        </div>
    );
}
