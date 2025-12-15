"use client";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { FileText, Download, Calendar, ExternalLink } from "lucide-react";
import { FiSearch, FiChevronUp, FiChevronDown, FiDownload } from "react-icons/fi";
import Link from "next/link";
import { Fade } from "react-awesome-reveal";
import gsap from "gsap";


const SearchFilter = React.memo(({ onFilterChange, allTenders }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("All");

  // Extract unique types from open tenders
  const uniqueTypes = useMemo(() => {
    const types = allTenders.map(t => t.type);
    return ["All", ...new Set(types)];
  }, [allTenders]);

  // Notify parent component of filter change using useCallback from parent
  useEffect(() => {
    onFilterChange({ searchTerm, filterType });
  }, [searchTerm, filterType, onFilterChange]);

  return (
    <div className="mb-12">
      <div className="bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg lg:shadow-xl p-3 sm:p-4 md:p-5 lg:p-6 border border-blue-200">
        <button
          className="flex justify-between items-center w-full text-left"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          aria-controls="filter-controls"
        >
          <h3 className="text-xl font-bold text-blue-900 flex items-center">
            <FiSearch className="mr-2 text-blue-600 w-5 h-5" />
            Search & Filter Open Tenders
          </h3>
          {isExpanded ? <FiChevronUp className="w-4 sm:w-4.5 md:w-5 lg:w-5 h-4 sm:h-4.5 md:h-5 lg:h-5 text-blue-600" /> : <FiChevronDown className="w-4 sm:w-4.5 md:w-5 lg:w-5 h-4 sm:h-4.5 md:h-5 lg:h-5 text-blue-600" />}
        </button>

        <div id="filter-controls" className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
          <div className="pt-3 sm:pt-4 md:pt-4 lg:pt-5 border-t mt-3 sm:mt-4 md:mt-4 lg:mt-5 border-gray-100">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              {/* Search Bar */}
              <div>
                <label htmlFor="search" className="block text-base font-medium text-gray-700 mb-2">Search by Title/Description</label>
                <input
                  type="text"
                  id="search"
                  placeholder="e.g. Water, Pipeline, IT"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Type Filter */}
              <div>
                <label htmlFor="type-filter" className="block text-base font-medium text-gray-700 mb-2">Filter by Type</label>
                <select
                  id="type-filter"
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white text-base"
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                >
                  {uniqueTypes.map((type, idx) => (
                    <option key={`${type}-${idx}`} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

SearchFilter.displayName = "SearchFilter";

export default function Tenders() {
  const [openTenders, setOpenTenders] = useState([]);
  const [closedTenders, setClosedTenders] = useState([]);
  const [cancelledTenders, setCancelledTenders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [openId, setOpenId] = useState(null);
  const [activeTab, setActiveTab] = useState("open");
  const [filters, setFilters] = useState({ searchTerm: "", filterType: "All" });

  useEffect(() => {
    async function fetchTenders() {
      try {
        const response = await fetch("/api/tenders");
        if (!response.ok) {
          throw new Error("Failed to fetch tenders");
        }
        const json = await response.json();
        const data = json.data || {};
        
        setOpenTenders(data.open || []);
        setClosedTenders(data.closed || []);
        setCancelledTenders(data.cancelled || []);
      } catch (err) {
        console.error("Error fetching tenders:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchTenders();
  }, []);

  // GSAP Loader Effect
  useEffect(() => {
    if (!loading) return;
    
    const loaderTimeline = gsap.timeline({
      onComplete: () => setLoading(false),
    });

    loaderTimeline
      .fromTo(
        ".loader",
        { scaleY: 0, transformOrigin: "50% 100%" },
        { scaleY: 1, duration: 0.5, ease: "power2.inOut" }
      )
      .to(".loader", {
        scaleY: 0,
        transformOrigin: "0% -100%",
        duration: 0.5,
        ease: "power2.inOut",
      })
      .to(
        ".wrapper",
        { y: "-100%", ease: "power4.inOut", duration: 1 },
        "-=0.8"
      );
  }, [loading]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setOpenId(null);
  }, []);

  // Memoized filtered tenders logic
  const filteredTenders = useMemo(() => {
    const { searchTerm, filterType } = filters;
    const lowerSearchTerm = searchTerm.toLowerCase();

    return openTenders.filter(tender => {
      const matchesSearch =
        (tender.title?.toLowerCase().includes(lowerSearchTerm) || false) ||
        (tender.summary?.toLowerCase().includes(lowerSearchTerm) || false) ||
        (tender.description?.toLowerCase().includes(lowerSearchTerm) || false);

      const matchesType = filterType === "All" || (tender.category?.label === filterType || tender.type === filterType);

      return matchesSearch && matchesType;
    });
  }, [filters, openTenders]);

  if (error) {
    return (
      <div className="text-center py-12 text-red-500">
        <p>Error loading tenders: {error}</p>
      </div>
    );
  }

  // Tender Card Component
  const TenderCard = ({ item, tabName, index }) => {
    const isExpanded = tabName === "open" && openId === item.id;
    const status = tabName === "open" ? (item.category?.label || item.type || "Tender") : (tabName === "closed" ? "Closed" : "Cancelled");

    const typeClasses = {
      Procurement: "bg-green-100 text-green-800 border-green-400",
      Construction: "bg-orange-100 text-orange-800 border-orange-400",
      Services: "bg-purple-100 text-purple-800 border-purple-400",
      Maintenance: "bg-yellow-100 text-yellow-800 border-yellow-400",
      Tender: "bg-blue-100 text-blue-800 border-blue-400",
      Closed: "bg-red-100 text-red-800 border-red-400",
      Cancelled: "bg-gray-100 text-gray-700 border-gray-400",
    };

    const cardClasses = typeClasses[status] || typeClasses.Tender;
    const chipColor = cardClasses.split(' ').slice(0, 2).join(' ');

    return (
      <Fade key={item.id || index} direction="up" triggerOnce duration={600} delay={index * 50}>
        <div className={`bg-white rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-2xl shadow-md sm:shadow-lg md:shadow-lg lg:shadow-xl p-6 h-full min-h-[320px] flex flex-col justify-between hover:shadow-lg md:hover:shadow-2xl transition-shadow border-t-4 ${cardClasses.split(' ')[3]}`}>
          {/* Header/Info */}
          <div>
            <span className={`px-4 py-2 rounded-full text-base font-semibold ${chipColor} mb-4 inline-block`}>
              {status}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mb-3 min-h-[3.5rem] line-clamp-2" title={item.title}>{item.title}</h3>
            <p className="text-base text-gray-600 mb-4 line-clamp-3 flex-1">{item.summary || item.description || "No description available."}</p>
          </div>

          {/* Footer/Actions */}
          <div className="mt-auto pt-4">
            <span className="text-gray-500 text-base block mb-3">
              {tabName === "open" ? "Due Date:" : "Closed/Cancelled Date:"} {item.closingAt ? new Date(item.closingAt).toLocaleDateString() : "N/A"}
            </span>

            {/* Action Buttons */}
            <div className="flex justify-between items-center gap-2">
              {tabName === "open" ? (
                <button
                  onClick={() => setOpenId(isExpanded ? null : item.id)}
                  className="inline-flex items-center text-blue-600 hover:text-blue-800 text-base font-semibold transition-colors"
                  aria-expanded={isExpanded}
                  aria-controls={`details-${item.id}`}
                >
                  {isExpanded ? "Hide Details" : "View More"}
                  {isExpanded ? <FiChevronUp className="w-4 h-4 ml-1" /> : <FiChevronDown className="w-4 h-4 ml-1" />}
                </button>
              ) : (
                <span className="text-base text-gray-500 italic">
                  {tabName === "closed" ? "Tender Closed" : "Tender Cancelled"}
                </span>
              )}

              {/* Download button only for open tenders with attachments */}
              {tabName === "open" && item.attachments && item.attachments.length > 0 && (
                <a href={item.attachments[0].url || item.attachments[0].mediaUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-green-600 transition-colors ml-2" title="Download Tender Documents">
                  <FiDownload className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>

          {/* Expanded Details (For Open Tenders Only) */}
          {isExpanded && (
            <div id={`details-${item.id}`} className="mt-5 pt-5 border-t border-blue-200">
              <p className="text-base text-gray-700 leading-relaxed bg-blue-50 p-4 rounded-lg font-medium">{item.description || item.summary}</p>
              {item.attachments && item.attachments.length > 0 && (
                <div className="mt-5">
                  <h4 className="text-base font-semibold text-gray-700 mb-2">Documents:</h4>
                  <div className="flex flex-col gap-2">
                    {item.attachments.map((att, idx) => (
                      <a 
                        key={idx}
                        href={att.url || att.mediaUrl} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center justify-center w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors text-base font-medium"
                      >
                        <Download className="w-4 h-4 mr-2" />
                        {att.label || "Download"}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </Fade>
    );
  };

  return (
    <>
      {/* Content Section */}
      <div className="bg-gradient-to-r from-blue-50 to-blue-100 py-12 sm:py-16 md:py-20 lg:py-24 xl:py-28 2xl:py-32">
        <div className="max-w-4xl sm:max-w-5xl md:max-w-6xl lg:max-w-7xl 2xl:max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
          <div className="text-center mb-8 sm:mb-10 md:mb-12 lg:mb-16 xl:mb-20 2xl:mb-24">
            <Fade direction="down" triggerOnce duration={1000}>
              <h2 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-blue-900">
                Tenders
              </h2>
              <p className="mt-4 text-slate-300 text-base sm:text-lg lg:text-xl max-w-3xl mx-auto">
                Official tender notices, procurement opportunities, and bidding documents
              </p>
            </Fade>
          </div>

          {/* Tabs */}
          <div className="flex justify-center mb-8 sm:mb-10 md:mb-12 lg:mb-14 xl:mb-16 2xl:mb-20">
            <div className="bg-white rounded-lg p-1.5 sm:p-2 md:p-2.5 lg:p-3 shadow-lg md:shadow-xl border border-blue-200">
              <button
                onClick={() => {
                  setActiveTab("open");
                  setOpenId(null);
                }}
                className={`px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base lg:text-base transition-all duration-300 ${activeTab === "open"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
              >
                Open Tenders
              </button>
              <button
                onClick={() => {
                  setActiveTab("closed");
                  setOpenId(null);
                }}
                className={`px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base lg:text-base transition-all duration-300 ${activeTab === "closed"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
              >
                Closed Tenders
              </button>
              <button
                onClick={() => {
                  setActiveTab("cancelled");
                  setOpenId(null);
                }}
                className={`px-3 sm:px-4 md:px-5 lg:px-6 xl:px-7 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg font-semibold text-xs sm:text-sm md:text-base lg:text-base transition-all duration-300 ${activeTab === "cancelled"
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-600 hover:text-blue-700 hover:bg-blue-50"
                  }`}
              >
                Cancelled Tenders
              </button>
            </div>
          </div>

          {/* Search Filter (Only for Open Tenders tab) */}
          {activeTab === "open" && (
            <SearchFilter
              onFilterChange={handleFilterChange}
              allTenders={openTenders}
            />
          )}

          {/* Tab Content - Grid Display */}
          <div className="max-w-6xl mx-auto">
          {activeTab === "open" && (
            <div className="flex flex-wrap justify-center gap-6">
              {filteredTenders.length > 0 ? (
                filteredTenders.map((item, i) => (
                  <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md">
                    <TenderCard item={item} tabName="open" index={i} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-10 bg-white rounded-xl shadow-lg">
                  <p className="text-xl text-gray-500">No Open Tenders match your current search criteria.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "closed" && (
            <div className="flex flex-wrap justify-center gap-6">
              {closedTenders.length > 0 ? (
                closedTenders.map((item, i) => (
                  <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md">
                    <TenderCard item={item} tabName="closed" index={i} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-10 bg-white rounded-xl shadow-lg">
                  <p className="text-xl text-gray-500">No Closed Tenders found.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === "cancelled" && (
            <div className="flex flex-wrap justify-center gap-6">
              {cancelledTenders.length > 0 ? (
                cancelledTenders.map((item, i) => (
                  <div key={item.id} className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] max-w-md">
                    <TenderCard item={item} tabName="cancelled" index={i} />
                  </div>
                ))
              ) : (
                <div className="w-full text-center py-10 bg-white rounded-xl shadow-lg">
                  <p className="text-xl text-gray-500">No Cancelled Tenders found.</p>
                </div>
              )}
            </div>
          )}
          </div>
        </div>
      </div>
    </>
  );
}
