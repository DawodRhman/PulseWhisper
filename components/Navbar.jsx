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
  const submenuRefs = useRef([]);
  const mobileSubmenuRefs = useRef([]);
  const searchInputRef = useRef(null);

  const pathname = usePathname();
  const router = useRouter();

  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const language = useLanguageStore((s) => s.language);
  const setLanguage = useLanguageStore((s) => s.setLanguage);

  const { t } = useTranslation();

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close settings dropdown on outside click
  useEffect(() => {
    const handler = (e) => {
      if (showSettingsDropdown && !e.target.closest(".settings-dropdown")) {
        setShowSettingsDropdown(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showSettingsDropdown]);

  const handleLanguageChange = (langCode) => {
    setLanguage(langCode);

    let cookieValue = "/en/en";
    if (langCode === "ur") cookieValue = "/en/ur";
    if (langCode === "sd") cookieValue = "/en/sd";

    document.cookie = `googtrans=${cookieValue}; path=/; domain=${window.location.hostname}`;
    document.cookie = `googtrans=${cookieValue}; path=/;`;

    const params = new URLSearchParams(window.location.search);
    params.set("lang", langCode);

    window.location.href = `${pathname}?${params.toString()}`;
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
    { href: "/tenders", text: t("nav.tenders") },
    { href: "/education", text: t("nav.education") },
    { href: "/contact", text: t("nav.contact") },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all ${
        isScrolled ? "bg-white shadow-md" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <img
            src="/kwsc logo.png"
            alt="KWSC Logo"
            className="w-14 h-14 object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <ul className="flex items-center gap-6 text-sm font-semibold uppercase">
            {getNavLinks().map((link, index) => (
              <li
                key={link.href}
                className="relative"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Link
                  href={link.href}
                  className={`flex items-center gap-1 px-2 py-1.5 transition-colors ${
                    pathname === link.href
                      ? "text-blue-400"
                      : isScrolled
                      ? "text-gray-700 hover:text-blue-400"
                      : "text-white hover:text-blue-400"
                  }`}
                >
                  {link.text}
                  {link.submenu && <ChevronDown size={14} />}
                </Link>

                {link.submenu && hoveredIndex === index && (
                  <div className="absolute top-full mt-2 bg-white rounded-lg shadow-xl">
                    <ul>
                      {link.submenu.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className="block px-4 py-2 text-sm font-medium uppercase hover:bg-blue-50 hover:text-blue-600"
                          >
                            {s.text}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            ))}
          </ul>

          {/* Search */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
            }}
            className="relative"
          >
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
            />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t("nav.search")}
              className="pl-9 pr-3 py-1.5 text-sm rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </form>

          {/* Settings Dropdown */}
          <div className="relative settings-dropdown">
            <button
              onClick={() => setShowSettingsDropdown(!showSettingsDropdown)}
              className={`flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium transition-colors
                ${
                  isScrolled
                    ? "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    : "bg-white/90 text-gray-700 border-white/50 hover:bg-white"
                }`}
            >
              <Globe size={16} />
              <span>
                {language === "en"
                  ? "اردو"
                  : language === "ur"
                  ? "سنڌي"
                  : "English"}
              </span>
              <ChevronDown size={14} />
            </button>

            {showSettingsDropdown && (
              <div className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-50">
                <button
                  onClick={() => {
                    toggleTheme();
                    setShowSettingsDropdown(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 border-b"
                >
                  {theme === "light" ? <Moon size={16} /> : <Sun size={16} />}
                  {theme === "light"
                    ? t("settings.darkMode")
                    : t("settings.lightMode")}
                </button>

                <div className="p-3">
                  <p className="text-xs font-semibold text-gray-500 mb-2 uppercase">
                    {t("settings.language")}
                  </p>
                  <div className="flex bg-gray-100 rounded-md p-1 gap-1">
                    {["en", "ur", "sd"].map((lang) => (
                      <button
                        key={lang}
                        onClick={() => handleLanguageChange(lang)}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-md transition ${
                          language === lang
                            ? "bg-white text-blue-600 shadow"
                            : "text-gray-500 hover:bg-gray-200"
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Toggle */}
        <button
          className="md:hidden text-white"
          onClick={() => setIsOpen(true)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="fixed inset-0 bg-black text-white p-6 z-50">
          <button onClick={() => setIsOpen(false)} className="mb-6">
            <X size={28} />
          </button>

          {getNavLinks().map((link) => (
            <div key={link.href} className="mb-4">
              <Link
                href={link.href}
                className="block text-lg font-semibold uppercase hover:text-blue-400"
                onClick={() => setIsOpen(false)}
              >
                {link.text}
              </Link>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};

export default Navbar;
