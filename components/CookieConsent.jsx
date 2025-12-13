"use client";
import { useEffect, useState } from "react";
import { Cookie } from "lucide-react";

const CONSENT_KEY = "cookie-consent";
const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

const readConsent = () => {
  if (typeof document === "undefined") return null;
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${CONSENT_KEY}=`));
  if (cookie) {
    return cookie.split("=")[1];
  }
  if (typeof localStorage !== "undefined") {
    return localStorage.getItem(CONSENT_KEY);
  }
  return null;
};

const persistConsent = (value) => {
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CONSENT_KEY, value);
  }
  if (typeof document !== "undefined") {
    const secureFlag =
      typeof window !== "undefined" && window.location.protocol === "https:"
        ? "; Secure"
        : "";
    document.cookie = `${CONSENT_KEY}=${value}; path=/; max-age=${ONE_YEAR_SECONDS}; SameSite=Lax${secureFlag}`;
  }
};

export default function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const stored = readConsent();

    if (stored) {
      if (
        typeof localStorage !== "undefined" &&
        !localStorage.getItem(CONSENT_KEY)
      ) {
        localStorage.setItem(CONSENT_KEY, stored);
      }
      return;
    }

    const timer = setTimeout(() => setIsVisible(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleAccept = () => {
    persistConsent("accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    persistConsent("declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" aria-hidden="true" />
      <div className="relative w-full max-w-lg animate-in zoom-in-50 fade-in duration-300">
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.16)] border border-gray-100 p-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shrink-0">
              <Cookie size={24} />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-gray-900">Cookie Policy</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We use cookies to improve your experience. By using our site, you agree to our use of cookies.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mt-6 justify-end">
            <button
              onClick={handleDecline}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg transition-colors"
            >
              Decline
            </button>
            <button
              onClick={handleAccept}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
