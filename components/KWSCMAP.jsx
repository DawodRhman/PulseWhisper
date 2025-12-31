'use client';
import React, { useState, useMemo } from "react";
import { MapPin, Phone, Mail, Building2, HardHat, Zap } from "lucide-react";

export default function Kwscmap() {
  // Define all KW&SC locations with enhanced categorization
  const locations = useMemo(() => [
    {
      id: 'hq',
      name: 'Headquarters (Main Office)',
      shortName: 'HQ',
      type: 'head-office',
      category: 'Head Office',
      icon: <Building2 className="w-5 h-5 text-blue-600" />,
      address: "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350",
      phone: "(+92) 021 111 597 200",
      email: "info@kwsc.gos.pk",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3619.554030778644!2d67.09062367500356!3d24.8724729779183!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f6a2958434d%3A0xc3f8e58a2d5940d9!2sKarachi%20Water%20and%20Sewerage%20Board%20(KW%26SB)!5e0!3m2!1sen!2spk!4v1700676458055!5m2!1sen!2spk",
    },
    {
      id: 'north',
      name: 'North Karachi Customer Center',
      shortName: 'North CCM',
      type: 'customer-service',
      category: 'Customer Service Centres',
      icon: <MapPin className="w-5 h-5 text-green-600" />,
      address: "Sector 11-A, Near Power House, North Karachi",
      phone: "(+92) 021 992 60001",
      email: "customercare.north@kwsc.pk",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3616.488344583167!2d67.03051407500588!3d24.977464277416358!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb33f9b2d9a941b%3A0x6b4c1a2d5e7f1e56!2sNorth%20Karachi%20Town!5e0!3m2!1sen!2spk!4v1700676500000!5m2!1sen!2spk",
    },
    {
      id: 'k4',
      name: 'K-IV Project Site Office',
      shortName: 'K-IV Project',
      type: 'operational',
      category: 'Operational Facilities',
      icon: <HardHat className="w-5 h-5 text-orange-600" />,
      address: "Super Highway, near Dhabeji Pumping Station, Thatta",
      phone: "(+92) 029 876 54321",
      email: "project.k4@kwsc.pk",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3263045237735!2d67.57014697501358!3d25.32162627745771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb94026857f6d39%3A0x5a18a91b29a65d50!2sDhabeji%20Pumping%20Station!5e0!3m2!1sen!2spk!4v1700676600000!5m2!1sen!2spk",
    },
    {
      id: 'pumping',
      name: 'Dhabeji Pumping Station',
      shortName: 'Dhabeji Pumping',
      type: 'operational',
      category: 'Operational Facilities',
      icon: <Zap className="w-5 h-5 text-red-600" />,
      address: "Dhabeji, Thatta District, Sindh, Pakistan",
      phone: "N/A - Operations Only",
      email: "operations@kwsc.pk",
      mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3606.3263045237735!2d67.57014697501358!3d25.32162627745771!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb94026857f6d39%3A0x5a18a91b29a65d50!2sDhabeji%20Pumping%20Station!5e0!3m2!1sen!2spk!4v1700676600000!5m2!1sen!2spk",
    }
  ], []);

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedLocationId, setSelectedLocationId] = useState('hq');

  // Filter locations based on active filter
  const filteredLocations = useMemo(() => {
    if (activeFilter === 'all') return locations;
    return locations.filter(loc => loc.type === activeFilter);
  }, [locations, activeFilter]);

  // Get selected location object
  const selectedLocation = locations.find(loc => loc.id === selectedLocationId);

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'head-office', label: 'Head Office' },
    { value: 'customer-service', label: 'Customer Service Centres' },
    { value: 'payment', label: 'Payment Locations' },
    { value: 'operational', label: 'Operational Facilities' }
  ];

  const categoryLabels = {
    'head-office': 'Head Office',
    'customer-service': 'Customer Service Centres',
    'payment': 'Payment Locations',
    'operational': 'Operational Facilities'
  };

  return (
    <section className="py-12 md:py-16 lg:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-black tracking-tight mb-3 sm:mb-4 md:mb-6">
            Customer Service & Operations Locations
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Find our head office, customer service centres and key operational facilities across Karachi.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-8">
          {filterOptions.map((filter) => (
            <button
              key={filter.value}
              onClick={() => setActiveFilter(filter.value)}
              className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-semibold text-sm md:text-base transition-all duration-200 ${
                activeFilter === filter.value
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-blue-50 hover:text-blue-700'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Main Content - Two Column Layout for Desktop, Stacked for Mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* Map Section - Takes full width on mobile, 8 columns on desktop */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Map Container */}
              <div className="h-80 sm:h-96 md:h-[400px] lg:h-[500px]">
                {selectedLocation && (
                  <iframe
                    key={selectedLocation.id}
                    src={selectedLocation.mapEmbedUrl}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    aria-label={`Google Map showing the location of ${selectedLocation.name}`}
                    title={`${selectedLocation.name} Location Map`}
                    className="w-full h-full"
                  />
                )}
              </div>

              {/* Selected Location Details - Always Visible */}
              {selectedLocation && (
                <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200">
                  <div className="flex items-start gap-3 md:gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {selectedLocation.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
                        {selectedLocation.name}
                      </h3>
                      <div className="space-y-2 md:space-y-3">
                        <div className="flex items-start gap-2 md:gap-3">
                          <MapPin className="text-blue-600 w-4 h-4 md:w-5 md:h-5 flex-shrink-0 mt-0.5" />
                          <p className="text-gray-700 text-sm md:text-base">
                            {selectedLocation.address}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <Phone className="text-blue-600 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <a 
                            href={`tel:${selectedLocation.phone.replace(/[() -]/g, '')}`} 
                            className="text-gray-700 text-sm md:text-base hover:text-blue-700 transition-colors"
                          >
                            {selectedLocation.phone}
                          </a>
                        </div>
                        <div className="flex items-center gap-2 md:gap-3">
                          <Mail className="text-blue-600 w-4 h-4 md:w-5 md:h-5 flex-shrink-0" />
                          <a 
                            href={`mailto:${selectedLocation.email}`} 
                            className="text-gray-700 text-sm md:text-base hover:text-blue-700 transition-colors"
                          >
                            {selectedLocation.email}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Location List - Takes full width on mobile, 4 columns on desktop */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="p-4 md:p-6 bg-gray-50 border-b border-gray-200">
                <h3 className="text-lg md:text-xl font-bold text-gray-900">
                  {activeFilter === 'all' ? 'All Locations' : categoryLabels[activeFilter]}
                </h3>
                <p className="text-sm md:text-base text-gray-600 mt-1">
                  {filteredLocations.length} location{filteredLocations.length !== 1 ? 's' : ''} found
                </p>
              </div>
              
              {/* Scrollable Location List */}
              <div className="max-h-80 md:max-h-96 lg:max-h-[500px] overflow-y-auto">
                <div className="p-2 md:p-4 space-y-2">
                  {filteredLocations.map((location) => (
                    <button
                      key={location.id}
                      onClick={() => setSelectedLocationId(location.id)}
                      className={`w-full text-left p-3 md:p-4 rounded-lg transition-all duration-200 border-2 ${
                        selectedLocationId === location.id
                          ? 'bg-blue-50 border-blue-200 shadow-sm'
                          : 'bg-white border-gray-100 hover:bg-gray-50 hover:border-gray-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {location.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-semibold text-sm md:text-base mb-1 ${
                            selectedLocationId === location.id ? 'text-blue-900' : 'text-gray-900'
                          }`}>
                            {location.name}
                          </h4>
                          <p className={`text-xs md:text-sm ${
                            selectedLocationId === location.id ? 'text-blue-700' : 'text-gray-600'
                          }`}>
                            {location.address}
                          </p>
                          <div className="flex items-center gap-1 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              selectedLocationId === location.id 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-gray-100 text-gray-700'
                            }`}>
                              {location.category}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
