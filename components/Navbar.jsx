"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { gsap } from "gsap";
import { X, ChevronDown, Search, Globe, Sun, Moon } from "lucide-react";
import { useThemeStore } from "@/lib/stores/themeStore";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { useTranslation } from "react-i18next";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState(null);
  const [showSettingsDropdown, setShowSettingsDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const submenuRefs = useRef([]);
  const mobileSubmenuRefs = useRef([]);
  const hoverTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);
  const pathname = usePathname();
  const router = useRouter();
  const isAdminView = pathname?.startsWith("/papa");

  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const language = useLanguageStore((state) => state.language);
  const setLanguage = useLanguageStore((state) => state.setLanguage);
  const { t } = useTranslation();

  if (isAdminView) {
    return null;
  }

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  // Handle scroll event to change navbar background
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handle mobile submenu expansion animations
  useEffect(() => {
    mobileSubmenuRefs.current.forEach((ref, index) => {
      if (ref) {
        if (expandedMobileSubmenu === index) {
          // Expand the submenu
          gsap.to(ref, {
            height: "auto",
            opacity: 1,
            duration: 0.3,
            ease: "power2.out",
            onStart: () => {
              ref.style.display = "block";
            },
          });
        } else {
          // Collapse the submenu
          gsap.to(ref, {
            height: 0,
            opacity: 0,
            duration: 0.3,
            ease: "power2.in",
            onComplete: () => {
              ref.style.display = "none";
            },
          });
        }
      }
    });
  }, [expandedMobileSubmenu]);

  useEffect(() => {
    if (isOpen) {
      gsap.to(menuRef.current, {
        height: "100vh",
        duration: 0.5,
        ease: "power3.out",
      });
      gsap.to(linksRef.current, {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.5,
      });
    } else {
      gsap.to(menuRef.current, { height: 0, duration: 0.5, ease: "power3.in" });
      gsap.to(linksRef.current, { y: -20, opacity: 0, duration: 0.3 });
    }
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSettingsDropdown && !event.target.closest(".settings-dropdown")) {
        setShowSettingsDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showSettingsDropdown]);

  // Get all available pages for search suggestions
  const getAllPages = () => {
    const pages = [];

    // Add main navigation items
    getNavLinks().forEach((item) => {
      pages.push({
        title: item.text,
        path: item.href,
        type: "page",
      });

      // Add submenu items if they exist
      if (item.submenu) {
        item.submenu.forEach((subItem) => {
          pages.push({
            title: subItem.text,
            path: subItem.href,
            type: "subpage",
          });
        });
      }
    });

    return pages;
  };

  // Filter suggestions based on search query
  const updateSuggestions = (query) => {
    if (!query.trim()) {
      setSuggestions([]);
      return;
    }

    const allPages = getAllPages();
    const filtered = allPages.filter(
      (page) =>
        page.title.toLowerCase().includes(query.toLowerCase()) ||
        page.path.toLowerCase().includes(query.toLowerCase())
    );

    setSuggestions(filtered);
  };

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    updateSuggestions(query);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim() && suggestions.length > 0) {
      // Navigate to the first (closest) suggestion
      router.push(suggestions[0].path);
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(true);
    }
  };

  // Handle suggestion click
  const handleSuggestionClick = (e, path) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
      router.push(path);
      // Close the mobile menu if it's open
      setIsOpen(false);
      // Clear search state
      setSearchQuery("");
      setSuggestions([]);
      setShowSuggestions(false);
      // Navigate to the clicked suggestion
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchInputRef.current &&
        !searchInputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  // Toggle language and update URL + Google Translate Cookie
  const toggleLanguage = () => {
    // Cycle: en -> ur -> sd -> en
    let newLang = "en";
    if (language === "en") newLang = "ur";
    else if (language === "ur") newLang = "sd";

    setLanguage(newLang);

    // Set Google Translate Cookie
    // Format: /source_lang/target_lang
    // For English: /en/en | For Urdu: /en/ur | For Sindhi: /en/sd (assuming Google supports 'sd')
    let cookieValue = "/en/en";
    if (newLang === "ur") cookieValue = "/en/ur";
    if (newLang === "sd") cookieValue = "/en/sd";

    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;

    // Update URL to trigger server-side re-render (for metadata/SEO)
    const currentParams = new URLSearchParams(
      typeof window !== "undefined" ? window.location.search : ""
    );
    currentParams.set("lang", newLang);

    // Force reload to apply Google Translation cleanly
    window.location.href = `${pathname}?${currentParams.toString()}`;
  };

  const getNavLinks = () => [
    { href: "/", text: t("nav.home") },

    {
      href: "/whatwedo",
      text: t("nav.whatWeDo"),
      submenu: [
        { href: "/ourservices", text: t("nav.services") },
        { href: "/portfolio", text: t("nav.projects") },
        { href: "/workwithus", text: t("nav.workWithUs") },
        { href: "/news", text: t("nav.newsUpdates") },
        { href: "/right-to-information", text: t("nav.rightToInformation") },
      ],
    },
    {
      href: "/aboutus",
      text: t("nav.about"),
      submenu: [
        { href: "/aboutus", text: t("nav.ourHeritage") },
        { href: "/watertodaysection", text: t("nav.waterToday") },
        { href: "/achievements", text: t("nav.achievements") },
        { href: "/ourleadership", text: t("nav.ourLeadership") },
        { href: "/careers", text: t("nav.careers") },
        { href: "/faqs", text: t("nav.faqs") },
      ],
    },

    {
      href: "/tenders",
      text: t("nav.tenders"),
    },
    {
      href: "/education",
      text: t("nav.education"),
    },
    {
      href: "/contact",
      text: t("nav.contact"),
    },
  ];

  // Handle submenu hover animations with grace period
  useEffect(() => {
    // Clear any pending timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (hoveredIndex !== null && getNavLinks()[hoveredIndex]?.submenu) {
      // First, close all other submenus immediately
      submenuRefs.current.forEach((ref, index) => {
        if (ref && index !== hoveredIndex) {
          gsap.to(ref, {
            opacity: 0,
            y: 10,
            duration: 0.15,
            ease: "power2.in",
            onComplete: () => {
              if (ref) ref.style.display = "none";
            },
          });
        }
      });

      // Then open the hovered submenu
      const submenuRef = submenuRefs.current[hoveredIndex];
      if (submenuRef) {
        submenuRef.style.display = "block";
        gsap.fromTo(
          submenuRef,
          {
            opacity: 0,
            y: 10,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "power2.out",
          }
        );
      }
    } else {
      // Hide all submenus when not hovering, but with a delay to allow movement
      hoverTimeoutRef.current = setTimeout(() => {
        submenuRefs.current.forEach((ref) => {
          if (ref) {
            gsap.to(ref, {
              opacity: 0,
              y: 10,
              duration: 0.2,
              ease: "power2.in",
              onComplete: () => {
                if (ref) ref.style.display = "none";
              },
            });
          }
        });
      }, 200);
    }

    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, [hoveredIndex]);

  return (
    <>
      <header
        className={`fixed top-0 start-0 w-full z-[110] transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="w-full max-w-7xl mx-auto flex items-center justify-between py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-8 transition-colors relative">
          {/* Logo - centered vertically and sized for banner */}
          <Link
            href="/"
            className="flex-shrink-0 flex items-center justify-center"
          >
            <img
              src="/kwsc logo.png"
              alt="KW&SC Logo"
              width={56}
              height={56}
              className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-20 lg:h-20 cursor-pointer hover:opacity-80 transition-opacity object-contain"
              loading="lazy"
            />
          </Link>
          <div className="flex-1 flex justify-center">
            <nav className="hidden md:block">
              <ul className="flex gap-4 lg:gap-8 xl:gap-10 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold uppercase">
                {getNavLinks().map((link, index) => (
                  <li
                    key={link.href}
                    className="relative group"
                    onMouseEnter={() => link.submenu && setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <Link
                      href={link.href}
                      className={`transition-colors flex items-center gap-0.5 md:gap-1 text-xs md:text-sm lg:text-base ${
                        isScrolled
                          ? pathname === link.href
                            ? "text-blue-300"
                            : "text-black hover:text-blue-300"
                          : pathname === link.href
                          ? "text-blue-300"
                          : "text-white hover:text-blue-300"
                      }`}
                      onClick={() => setIsOpen(false)}
                    >
                      {link.text}
                      {link.submenu && (
                        <ChevronDown
                          size={14}
                          className={`transition-transform duration-300 md:w-4 md:h-4 ${
                            hoveredIndex === index ? "rotate-180" : ""
                          }`}
                        />
                      )}
                    </Link>
                    {link.submenu && (
                      <div
                        ref={(el) => (submenuRefs.current[index] = el)}
                        className={`absolute top-full start-0 mt-1 md:mt-2 min-w-max md:min-w-[200px] lg:min-w-[240px] shadow-xl rounded-lg overflow-hidden z-[120] backdrop-blur-sm ${
                          isScrolled ? "bg-white" : "bg-white/95"
                        }`}
                        style={{ display: "none", opacity: 0 }}
                        onMouseEnter={() => setHoveredIndex(index)}
                        onMouseLeave={() => setHoveredIndex(null)}
                      >
                        <ul className="py-1 md:py-2">
                          {link.submenu.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`block px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-xs lg:text-sm font-semibold uppercase transition-all duration-200 ${
                                  pathname === subItem.href
                                    ? "text-blue-600 bg-blue-50 border-s-4 border-blue-600"
                                    : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border-s-4 hover:border-blue-400"
                                }`}
                                onClick={() => setIsOpen(false)}
                              >
                                {subItem.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right Side: Search Bar and Language Toggle - Desktop */}
          <div className="hidden md:flex items-center gap-3">
            {/* Search Bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center relative"
            >
              <div
                className={`relative flex items-center rounded-md border transition-all duration-300 ${
                  isScrolled
                    ? "bg-white border-gray-300"
                    : "bg-white/90 border-white/50 backdrop-blur-sm"
                }`}
                ref={searchInputRef}
              >
                <Search
                  size={18}
                  className={`absolute start-3 ${
                    isScrolled ? "text-gray-500" : "text-gray-600"
                  }`}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => setShowSuggestions(true)}
                  placeholder={t("nav.search")}
                  className={`ps-10 pe-4 py-2 w-48 lg:w-56 xl:w-64 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isScrolled
                      ? "bg-white text-gray-900 placeholder-gray-500"
                      : "bg-transparent text-gray-900 placeholder-gray-500"
                  }`}
                />
              </div>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && suggestions.length > 0 && (
                <div
                  className={`absolute top-full left-0 mt-1 w-48 lg:w-56 xl:w-64 max-h-60 overflow-y-auto rounded-md shadow-lg z-50 ${
                    isScrolled ? "bg-white" : "bg-white/95 backdrop-blur-sm"
                  } border border-gray-200`}
                >
                  <ul className="py-1">
                    {suggestions.map((suggestion, index) => (
                      <li key={`${suggestion.path}-${index}`}>
                        <button
                          type="button"
                          onClick={(e) =>
                            handleSuggestionClick(e, suggestion.path)
                          }
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                        >
                          <div className="font-medium">{suggestion.title}</div>
                          <div className="text-xs text-gray-500 truncate">
                            {suggestion.path}
                          </div>
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </form>

            {/* Settings Dropdown */}
            <div className="relative settings-dropdown">
              <button
                onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all duration-200 border font-medium text-sm ${
                  isScrolled
                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50 hover:border-blue-500"
                    : "bg-white/90 text-gray-700 border-white/50 hover:bg-white backdrop-blur-sm"
                }`}
                title="Settings"
              >
                <Globe size={16} />
                <span>
                  {language === "en"
                    ? "اردو"
                    : language === "ur"
                    ? "سنڌي"
                    : "English"}
                </span>
                <ChevronDown
                  size={14}
                  className={`transition-transform ${
                    showSettingsDropdown ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showSettingsDropdown && (
                <div
                  className={`absolute top-full end-0 mt-2 w-48 shadow-xl rounded-lg overflow-hidden z-[130] ${
                    isScrolled ? "bg-white" : "bg-white/95 backdrop-blur-sm"
                  }`}
                >
                  <div className="py-2">
                    {/* Theme Toggle */}
                    <button
                      onClick={() => {
                        toggleTheme();
                        setShowSettingsDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                    >
                      {theme === "light" ? (
                        <Moon size={16} />
                      ) : (
                        <Sun size={16} />
                      )}
                      <span>
                        {theme === "light"
                          ? t("settings.darkMode")
                          : t("settings.lightMode")}
                      </span>
                    </button>

                    {/* Language Selector (Segmented) */}
                    <div className="px-4 py-3">
                      <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                        {t("settings.language")}
                      </p>
                      <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                        {["en", "ur", "sd"].map((langCode) => (
                          <button
                            key={langCode}
                            onClick={() => {
                              setLanguage(langCode);
                              // Cookie & URL updates
                              let cookieValue = "/en/en";
                              if (langCode === "ur") cookieValue = "/en/ur";
                              if (langCode === "sd") cookieValue = "/en/sd";

                              document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
                              document.cookie = `googtrans=${cookieValue}; path=/;`;

                              const currentParams = new URLSearchParams(
                                typeof window !== "undefined"
                                  ? window.location.search
                                  : ""
                              );
                              currentParams.set("lang", langCode);

                              // Force reload to apply Google Translation cleanly
                              window.location.href = `${pathname}?${currentParams.toString()}`;
                            }}
                            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                              language === langCode
                                ? "bg-white text-blue-600 shadow-sm transform scale-105"
                                : "text-gray-500 hover:bg-gray-200"
                            }`}
                          >
                            {langCode.toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div
            className={`cs_toolbox scale-75 sm:scale-90 md:scale-100 md:hidden ${
              isScrolled
                ? "text-black hover:text-blue-600"
                : "text-white hover:text-blue-600"
            }`}
          >
            <span className="cs_icon_btn" onClick={() => setIsOpen(!isOpen)}>
              <span className="cs_icon_btn_in">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </span>
          </div>
          <div
            ref={menuRef}
            className={`fixed inset-0 bg-black overflow-y-auto flex flex-col items-start justify-start z-[115] transition-all ${
              isOpen ? "h-screen" : "h-0"
            }`}
          >
            <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
              {/* Mobile Header with Search, Language Toggle, and Close */}
              <div className="flex items-center justify-between gap-3">
                {/* Mobile Search */}
                <form onSubmit={handleSearch} className="flex-1 max-w-xs">
                  <div className="relative">
                    <Search
                      className="absolute start-3 top-1/2 -translate-y-1/2 text-gray-400"
                      size={18}
                    />
                    <div className="relative w-full" ref={searchInputRef}>
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={handleSearchChange}
                        onFocus={() => setShowSuggestions(true)}
                        placeholder={t("nav.search")}
                        className="w-full ps-10 pe-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {/* Mobile Search Suggestions Dropdown */}
                      {showSuggestions && suggestions.length > 0 && (
                        <div className="absolute top-full left-0 right-0 mt-1 max-h-60 overflow-y-auto rounded-md shadow-lg z-50 bg-white/95 backdrop-blur-sm border border-gray-200">
                          <ul className="py-1">
                            {suggestions.map((suggestion, index) => (
                              <li key={`mobile-${suggestion.path}-${index}`}>
                                <button
                                  type="button"
                                  onClick={(e) =>
                                    handleSuggestionClick(e, suggestion.path)
                                  }
                                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                >
                                  <div className="font-medium">
                                    {suggestion.title}
                                  </div>
                                  <div className="text-xs text-gray-500 truncate">
                                    {suggestion.path}
                                  </div>
                                </button>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </form>

                {/* Mobile Settings Dropdown */}
                <div className="relative settings-dropdown">
                  <button
                    onClick={() =>
                      setShowSettingsDropdown(!showSettingsDropdown)
                    }
                    className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/30 text-white hover:bg-white/20 transition-colors"
                  >
                    <Globe size={18} />
                    <span className="text-sm font-medium">
                      {language === "en" ? "اردو" : "English"}
                    </span>
                    <ChevronDown
                      size={14}
                      className={`transition-transform ${
                        showSettingsDropdown ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {showSettingsDropdown && (
                    <div className="absolute top-full end-0 mt-2 w-48 shadow-xl rounded-lg overflow-hidden z-[130] bg-white/95 backdrop-blur-sm">
                      <div className="py-2">
                        {/* Mobile Theme Toggle */}
                        <button
                          onClick={() => {
                            toggleTheme();
                            setShowSettingsDropdown(false);
                          }}
                          className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 transition-colors border-b border-gray-100"
                        >
                          {theme === "light" ? (
                            <Moon size={16} />
                          ) : (
                            <Sun size={16} />
                          )}
                          <span>
                            {theme === "light"
                              ? t("settings.darkMode")
                              : t("settings.lightMode")}
                          </span>
                        </button>

                        {/* Mobile Language Selector (Segmented) */}
                        <div className="px-4 py-3">
                          <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">
                            {t("settings.language")}
                          </p>
                          <div className="flex items-center bg-gray-100 rounded-lg p-1 gap-1">
                            {["en", "ur", "sd"].map((langCode) => (
                              <button
                                key={langCode}
                                onClick={() => {
                                  setLanguage(langCode);
                                  let cookieValue = "/en/en";
                                  if (langCode === "ur") cookieValue = "/en/ur";
                                  if (langCode === "sd") cookieValue = "/en/sd";
                                  document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
                                  document.cookie = `googtrans=${cookieValue}; path=/;`;

                                  const currentParams = new URLSearchParams(
                                    typeof window !== "undefined"
                                      ? window.location.search
                                      : ""
                                  );
                                  currentParams.set("lang", langCode);
                                  window.location.href = `${pathname}?${currentParams.toString()}`;
                                }}
                                className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all duration-200 ${
                                  language === langCode
                                    ? "bg-white text-blue-600 shadow-sm"
                                    : "text-gray-500 hover:bg-gray-200"
                                }`}
                              >
                                {langCode.toUpperCase()}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white font-bold opacity-100 transform hover:-translate-y-1 transition-all duration-300 rounded-full border-white p-1.5 sm:p-2 border-2"
                >
                  <X
                    color="white"
                    size={24}
                    className="sm:w-6 sm:h-6"
                    strokeWidth={3}
                  />
                </button>
              </div>
              <div className="text-white px-2 sm:px-4">
                <p className="text-xs sm:text-sm leading-relaxed">
                  {t("footer.location")}
                </p>
              </div>
              <nav className="flex flex-col items-start gap-6 sm:gap-10 mt-6 sm:mt-8 w-full px-2">
                {getNavLinks().map((link, index) => (
                  <div key={link.text} className="w-full">
                    {/* Row: main link + 'Open Sub Menu' button (if submenu) */}
                    <div className="flex items-center gap-3 w-full">
                      {/* Main page link (always navigates) */}
                      <Link
                        href={link.href}
                        ref={(el) => (linksRef.current[index] = el)}
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase opacity-0 transform -translate-y-5 transition-all duration-300 ${
                          pathname === link.href
                            ? "text-blue-400"
                            : "text-white hover:text-blue-400"
                        }`}
                        data-menu={link.text}
                        onClick={() => {
                          setIsOpen(false);
                          setExpandedMobileSubmenu(null);
                        }}
                      >
                        {link.text}
                      </Link>

                      {/* Open Sub Menu button, only for items with submenu */}
                      {link.submenu && (
                        <button
                          type="button"
                          onClick={() =>
                            setExpandedMobileSubmenu(
                              expandedMobileSubmenu === index ? null : index
                            )
                          }
                          className="text-white hover:text-blue-400 transition-colors p-2"
                        >
                          <ChevronDown
                            size={24}
                            className={`transition-transform duration-300 ${
                              expandedMobileSubmenu === index
                                ? "rotate-180"
                                : ""
                            }`}
                          />
                        </button>
                      )}
                    </div>

                    {/* Mobile Submenu */}
                    {link.submenu && (
                      <div
                        ref={(el) => (mobileSubmenuRefs.current[index] = el)}
                        className="overflow-hidden"
                        style={{ display: "none", height: 0, opacity: 0 }}
                      >
                        <ul className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 ps-6 sm:ps-8 border-s-2 border-blue-400">
                          {link.submenu.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`text-lg sm:text-xl md:text-2xl font-semibold uppercase transition-all duration-200 flex items-center gap-2 ${
                                  pathname === subItem.href
                                    ? "text-blue-400"
                                    : "text-gray-300 hover:text-blue-400"
                                }`}
                                onClick={() => {
                                  setIsOpen(false);
                                  setExpandedMobileSubmenu(null);
                                }}
                              >
                                {subItem.text}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;