'use client';
import React, { useState, useMemo, useEffect } from "react";
import { MapPin, Phone, Mail, Building2, HardHat, Zap, Menu, X, ChevronDown } from "lucide-react";
import { useContactData } from "@/hooks/useContactData";

export default function Kwscmap() {
  const { data } = useContactData();
  const apiLocations = data?.offices || [];

  // Define all possible KW&SC locations with their details
  const locations = useMemo(() => {
    const fallback = [
    {
      id: 'hq',
      name: 'Headquarters (Main Office)',
      shortName: 'HQ',
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
      address: "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350",
      phone: "(+92) 021 111 597 200",
      email: "info@kwsc.gos.pk",
      // Google Maps embed URL for the main office (KW&SB/KW&SC)
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.554030778644!2d67.09062367500356!3d24.8724729779183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f6a2958434d%3A0xc3f8e58a2d5940d9!2sKarachi%20Water%20and%20Sewerage%20Board%20(KW%26SB)!5e0!3m2!1sen!2spk!4v1700676458055!5m2!1sen!2spk",
    },
    {
      id: 'north',
      name: 'North Karachi Customer Center',
      shortName: 'North CCM',
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      address: "Sector 11-A, Near Power House, North Karachi",
      phone: "(+92) 021 992 60001",
      email: "customercare.north@kwsc.pk",
      // Mock coordinates for a regional office
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.488344583167!2d67.03051407500588!3d24.977464277416358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f9b2d9a941b%3A0x6b4c1a2d5e7f1e56!2sNorth%20Karachi%20Town!5e0!3m2!1sen!2spk!4v1700676500000!5m2!1sen!2spk",
    },
    {
      id: 'k4',
      name: 'K-IV Project Site Office',
      shortName: 'K-IV Project',
      icon: <HardHat className="w-5 h-5 text-orange-600" />,
      address: "Super Highway, near Dhabeji Pumping Station, Thatta",
      phone: "(+92) 029 876 54321",
      email: "project.k4@kwsc.pk",
      // Mock coordinates for a project site
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3263045237735!2d67.57014697501358!3d25.32162627745771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb94026857f6d39%3A0x5a18a91b29a65d50!2sDhabeji%20Pumping%20Station!5e0!3m2!1sen!2spk!4v1700676600000!5m2!1sen!2spk",
    },
    {
      id: 'pumping',
      name: 'Dhabeji Pumping Station',
      shortName: 'Dhabeji Pumping',
      icon: <Zap className="w-5 h-5 text-red-600" />,
      address: "Dhabeji, Thatta District, Sindh, Pakistan",
      phone: "N/A - Operations Only",
      email: "operations@kwsc.pk",
      // Coordinates for Dhabeji
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3263045237735!2d67.57014697501358!3d25.32162627745771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb94026857f6d39%3A0x5a18a91b29a65d50!2sDhabeji%20Pumping%20Station!5e0!3m2!1sen!2spk!4v1700676600000!5m2!1sen!2spk",
    }
    ];

    if (apiLocations.length > 0) {
      return apiLocations.map((loc) => ({
        id: loc.id,
        name: loc.label,
        shortName: loc.label.split(' ').slice(0, 2).join(' '),
        icon: <MapPin className="w-5 h-5 text-blue-600" />,
        address: loc.address,
        phone: loc.phone || "N/A",
        email: loc.email || "N/A",
        mapEmbedUrl: loc.mapEmbedUrl || `https://www.google.com/maps?q=${encodeURIComponent(loc.address)}&output=embed`
      }));
    }
    return fallback;
  }, [apiLocations]);

  const [activeLocationId, setActiveLocationId] = useState(null);

  useEffect(() => {
    if (locations.length > 0 && !activeLocationId) {
      setActiveLocationId(locations[0].id);
    }
  }, [locations, activeLocationId]);
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // Find the currently active location object
  const activeLocation = locations.find(loc => loc.id === activeLocationId);

  if (!activeLocation) {
    return <div className="p-10 text-center text-red-500">Error: Location data not found.</div>;
  }

  return (
    <div className="py-6 sm:py-10 md:py-16 lg:py-20 bg-gray-50">
      <div className="relative w-full aspect-[4/3] md:aspect-[16/7] rounded-lg sm:rounded-xl md:rounded-3xl overflow-hidden shadow-lg md:shadow-2xl transition-all duration-500">

        {/* Location Selector - Hamburger Menu on Mobile */}
        {/* Desktop: Horizontal tabs (hidden md:flex) */}
        <div className="absolute top-3 sm:top-4 left-3 sm:left-4 right-3 sm:right-4 z-20">
          {/* Mobile: Hamburger Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden flex items-center justify-between bg-white/90 backdrop-blur-md px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-blue-200 shadow-lg w-full"
          >
            <span className="font-semibold text-xs sm:text-sm text-gray-900 truncate">
              {activeLocation?.shortName}
            </span>
            <ChevronDown className={`w-4 h-4 sm:w-5 sm:h-5 text-blue-600 transition-transform ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Mobile: Dropdown Menu */}
          <div className={`md:hidden absolute top-full left-3 sm:left-4 right-3 sm:right-4 mt-2 bg-white/95 backdrop-blur-md border border-blue-200 rounded-lg shadow-xl overflow-hidden transition-all duration-300 ${menuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}>
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => {
                  setActiveLocationId(loc.id);
                  setMenuOpen(false);
                }}
                className={`w-full flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold transition-colors border-b border-blue-100 last:border-b-0 ${activeLocationId === loc.id
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-blue-700'
                  }`}
              >
                {loc.icon}
                <span className="truncate">{loc.name}</span>
              </button>
            ))}
          </div>

          {/* Desktop: Horizontal Tabs */}
          <div className="hidden md:flex bg-white/95 backdrop-blur-md px-2 sm:px-3 md:px-4 py-2 sm:py-2.5 md:py-3 rounded-lg sm:rounded-xl md:rounded-2xl shadow-lg md:shadow-xl border border-blue-100 flex-nowrap overflow-x-auto gap-1 sm:gap-2 md:gap-3">
            {locations.map((loc) => (
              <button
                key={loc.id}
                onClick={() => setActiveLocationId(loc.id)}
                className={`flex items-center gap-1 sm:gap-2 px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 md:py-2.5 text-xs sm:text-sm md:text-base font-semibold rounded-lg transition-all duration-200 transform hover:scale-[1.03] flex-shrink-0 whitespace-nowrap
                  ${activeLocationId === loc.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
                  }
                `}
                title={loc.name}
              >
                {loc.icon}
                <span>{loc.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Map iframe - Dynamically load the map */}
        <iframe
          key={activeLocation.id} // Key ensures the iframe fully reloads when location changes
          src={activeLocation.mapEmbedUrl}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          aria-label={`Google Map showing the location of ${activeLocation.name}`}
          title={`${activeLocation.name} Location Map`}
          className="transition-opacity duration-700 opacity-100"
        />

        {/* Glassmorphism overlay for contact details - Desktop Always Show */}
        {/* Mobile: Hidden until button clicked (slide-up modal) */}
        <div className={`absolute inset-x-0 bottom-0 md:bottom-10 md:right-10 md:left-auto md:inset-auto bg-white/90 md:bg-white/85 backdrop-blur-md rounded-t-2xl md:rounded-2xl p-4 sm:p-5 md:p-6 shadow-2xl max-w-full md:max-w-md border border-blue-200 transition-all duration-300 transform ${detailsOpen ? 'translate-y-0 md:translate-y-[-4px]' : 'translate-y-full md:translate-y-0'
          }`}>
          <div className="flex items-center justify-between md:hidden mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
              {activeLocation?.icon} <span className="truncate">{activeLocation?.shortName}</span>
            </h3>
            <button
              onClick={() => setDetailsOpen(false)}
              className="flex-shrink-0 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
            </button>
          </div>

          <h3 className="hidden md:flex text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4 border-b pb-1.5 sm:pb-2 md:pb-3 border-blue-200 items-center gap-1.5 sm:gap-2">
            {activeLocation?.icon} <span className="truncate">{activeLocation?.name}</span>
          </h3>

          <div className="space-y-2 sm:space-y-2.5 md:space-y-3">
            <div className="flex items-start gap-2 sm:gap-2.5 md:gap-3">
              <MapPin className="text-blue-600 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5 sm:mt-1 md:mt-1" />
              <p className="text-gray-800 font-medium text-xs sm:text-sm md:text-base leading-relaxed">
                {activeLocation?.address}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              <Phone className="text-blue-600 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <a href={`tel:${activeLocation?.phone.replace(/[() -]/g, '')}`} className="text-gray-800 font-medium text-xs sm:text-sm md:text-base hover:text-blue-700 transition-colors truncate">
                {activeLocation?.phone}
              </a>
            </div>

            <div className="flex items-center gap-2 sm:gap-2.5 md:gap-3">
              <Mail className="text-blue-600 w-4 h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 flex-shrink-0" />
              <a href={`mailto:${activeLocation?.email}`} className="text-gray-800 font-medium text-xs sm:text-sm md:text-base hover:text-blue-700 transition-colors truncate">
                {activeLocation?.email}
              </a>
            </div>
          </div>
        </div>

        {/* Mobile: Floating Button to Open Details Modal */}
        <button
          onClick={() => setDetailsOpen(!detailsOpen)}
          className={`md:hidden absolute bottom-4 sm:bottom-5 right-4 sm:right-5 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-xs sm:text-sm font-semibold flex items-center gap-1.5 sm:gap-2 ${detailsOpen ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
        >
          📍 Details
        </button>
      </div>
    </div>
  );
}