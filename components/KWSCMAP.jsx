"use client";
import React, { useEffect, useMemo, useState } from "react";
import { MapPin, Phone, Mail, Building2, HardHat, Zap } from "lucide-react";

const ICON_SET = [Building2, MapPin, HardHat, Zap];
const ICON_COLORS = ["text-blue-600", "text-green-600", "text-orange-600", "text-red-600"];

const buildEmbedUrl = (location) => {
  if (location?.mapEmbedUrl) return location.mapEmbedUrl;
  if (typeof location?.latitude === "number" && typeof location?.longitude === "number") {
    return `https://www.google.com/maps?q=${encodeURIComponent(`${location.latitude},${location.longitude}`)}&z=14&output=embed`;
  }
  if (location?.address) {
    return `https://www.google.com/maps?q=${encodeURIComponent(location.address)}&output=embed`;
  }
  return null;
};

export default function Kwscmap() {
  const [locations, setLocations] = useState([]);
  const [activeLocationId, setActiveLocationId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Failed to load office locations");
        }
        const payload = await response.json();
        const offices = payload?.data?.offices || [];

        if (isMounted) {
          const decorated = offices.map((office, index) => ({
            ...office,
            iconIndex: index % ICON_SET.length,
          }));
          setLocations(decorated);
          setActiveLocationId(decorated[0]?.id || null);
        }
      } catch (err) {
        console.error("KWSCMap:fetch", err);
        if (isMounted) {
          setError("Live location data unavailable at the moment.");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchLocations();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeLocation = useMemo(() => {
    return locations.find((loc) => loc.id === activeLocationId) || locations[0] || null;
  }, [locations, activeLocationId]);

  const renderIcon = (location, className = "w-5 h-5") => {
    if (!location) return null;
    const IconComponent = ICON_SET[location.iconIndex ?? 0] || Building2;
    const colorClass = ICON_COLORS[location.iconIndex ?? 0] || "text-blue-600";
    return <IconComponent className={`${className} ${colorClass}`} />;
  };

  if (loading) {
    return (
      <div className="py-16 flex items-center justify-center bg-gray-50">
        <div className="animate-pulse text-gray-500">Loading map data…</div>
      </div>
    );
  }

  if (!activeLocation) {
    return (
      <div className="p-10 text-center text-red-500">
        {error || "No office location data available."}
      </div>
    );
  }

  const sanitizeTel = (value) => {
    if (!value) return null;
    const digits = value.replace(/[^+\d]/g, "");
    return digits.length ? digits : null;
  };
  const mapSrc = buildEmbedUrl(activeLocation);
  const activePhoneHref = sanitizeTel(activeLocation.phone);

  return (
    <div className="py-12 md:py-20 bg-gray-50">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7] rounded-3xl overflow-hidden shadow-2xl transition-all duration-500">
        
        {/* Location Selector */}
        {/* On mobile, use a clean scrollable row for tabs */}
        <div className="absolute top-4 left-4 right-4 z-10">
          <div className="bg-white/95 backdrop-blur-md px-2 py-2 rounded-xl shadow-xl border border-blue-100 flex flex-nowrap overflow-x-auto gap-2">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationId(loc.id)}
                className={`flex items-center gap-2 px-3 py-2 text-sm md:text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.03] flex-shrink-0 whitespace-nowrap
                  ${activeLocationId === loc.id
                    ? 'bg-blue-600 text-white shadow-blue-400/50'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
                aria-current={activeLocationId === loc.id ? 'location' : undefined}
                title={loc.label}
              >
                {renderIcon(loc)}
                <span className="hidden sm:inline">{loc.label}</span>
                <span className="sm:hidden">{loc.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map iframe - Dynamically load the map */}
        {mapSrc ? (
          <iframe
            key={activeLocation.id}
            src={mapSrc}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            aria-label={`Google Map showing the location of ${activeLocation.label}`}
            title={`${activeLocation.label} Location Map`}
            className="transition-opacity duration-700 opacity-100"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-500">
            Map preview unavailable for {activeLocation.label}
          </div>
        )}

        {/* Glassmorphism overlay for contact details - Dynamically updated */}
        {/* Positioned on the bottom left for mobile viewing space */}
        <div className="absolute bottom-4 left-4 right-4 md:bottom-10 md:right-10 md:left-auto bg-white/85 backdrop-blur-md rounded-xl p-6 shadow-2xl max-w-full md:max-w-md border border-blue-200 transition-all duration-300 transform hover:translate-y-[-2px]">
           <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-3 border-b pb-2 border-blue-200 flex items-center gap-2">
             {renderIcon(activeLocation)} {activeLocation.label}
          </h3>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="text-blue-600 w-5 h-5 flex-shrink-0 mt-1" />
              <p className="text-gray-800 font-medium text-sm md:text-base leading-relaxed">
                {activeLocation.address || "Address information unavailable"}
              </p>
            </div>
            
            <div className="flex items-center gap-3">
              <Phone className="text-blue-600 w-5 h-5 flex-shrink-0" />
              {activeLocation.phone ? (
                activePhoneHref ? (
                  <a
                    href={`tel:${activePhoneHref}`}
                    className="text-gray-800 font-medium text-sm md:text-base hover:text-blue-700 transition-colors"
                  >
                    {activeLocation.phone}
                  </a>
                ) : (
                  <span className="text-gray-800 font-medium text-sm md:text-base">
                    {activeLocation.phone}
                  </span>
                )
              ) : (
                <span className="text-gray-500 text-sm md:text-base">Phone unavailable</span>
              )}
            </div>
            
            <div className="flex items-center gap-3">
              <Mail className="text-blue-600 w-5 h-5 flex-shrink-0" />
              {activeLocation.email ? (
                <a
                  href={`mailto:${activeLocation.email}`}
                  className="text-gray-800 font-medium text-sm md:text-base hover:text-blue-700 transition-colors truncate"
                >
                  {activeLocation.email}
                </a>
              ) : (
                <span className="text-gray-500 text-sm md:text-base">Email unavailable</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}