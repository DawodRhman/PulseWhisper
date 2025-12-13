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
    <div className="fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 animate-in slide-in-from-bottom duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-gray-200 p-4 sm:p-5 md:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3 sm:gap-4 flex-1">
              <div className="p-2 bg-blue-50 rounded-lg text-blue-600 shrink-0">
                <Cookie size={20} className="sm:w-5 sm:h-5" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-1">We use cookies</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  We use cookies and similar technologies to help personalize content, tailor and measure ads, and provide a better experience. By clicking accept, you agree to our use of cookies.{" "}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-700 underline font-medium">
                    Learn more
                  </a>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleDecline}
                className="px-4 sm:px-5 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md border border-gray-300 transition-colors whitespace-nowrap"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 sm:px-6 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors whitespace-nowrap"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
