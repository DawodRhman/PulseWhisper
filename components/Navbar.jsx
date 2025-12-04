"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { X, ChevronDown } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [expandedMobileSubmenu, setExpandedMobileSubmenu] = useState(null);
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const submenuRefs = useRef([]);
  const mobileSubmenuRefs = useRef([]);
  const hoverTimeoutRef = useRef(null);
  const pathname = usePathname();
  const isAdminView = pathname?.startsWith("/papa");

  if (isAdminView) {
    return null;
  }

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

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

  // ✅ Track scroll position for background switch
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80); // Change background after 50px scroll
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const NavLinks = [
    { href: "/", text: "Home" },

    {
      href: "/whatwedo",
      text: "What We Do",
      submenu: [
        { href: "/ourservices", text: "Our Services" },
        { href: "/portfolio", text: "Our Projects" },
        { href: "/workwithus", text: "Work With Us" },
        { href: "/news", text: "News & Updates" },
        { href: "/right-to-information", text: "Right to Information" },
      ]
    },
    {
      href: "/aboutus",
      text: "About Us",
      submenu: [
        { href: "/aboutus", text: "Our Heritage" },
        { href: "/watertodaysection", text: "Water Today" },
        { href: "/achievements", text: "Achievements" },
        { href: "/ourleadership", text: "Our Leadership" },
        { href: "/careers", text: "Careers" },
        { href: "/faqs", text: "FAQs" },
      ]
    },
    //{ 
    //  href: "/portfolio", 
    //  text: "Our Projects",
    //  submenu: [
    //  { href: "/portfolio", text: "All Projects" },

    //  ]
    //  },

    {
      href: "/tenders",
      text: "Tenders",

    },
    {
      href: "/education",
      text: "Education",

    },

    {
      href: "/contact",
      text: "Contact",

    },
  ];

  // Handle submenu hover animations with grace period
  useEffect(() => {
    if (hoveredIndex !== null && NavLinks[hoveredIndex]?.submenu) {
      // Clear any pending timeout when hovering
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }

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
        submenuRefs.current.forEach((ref, index) => {
          if (ref && hoveredIndex !== index) {
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
      }, 300);
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
        className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${isScrolled ? "bg-white shadow-lg" : "bg-transparent"
          }`}
      >
        <div className="w-full mx-auto flex justify-between items-center py-2 sm:py-3 md:py-4 px-3 sm:px-4 md:px-6 lg:px-8 transition-colors">
          <div className="flex-shrink-0">
            <img src="/kwsc logo.png" alt="KW&SC Logo" width={60} height={70} className="sm:w-20 sm:h-24 md:w-24 md:h-28 lg:w-28 lg:h-32" />
          </div>
          <nav className="hidden md:block">
            <ul className="flex gap-4 lg:gap-8 xl:gap-10 text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl font-bold uppercase">
              {NavLinks.map((loop, index) => (
                <li
                  key={loop.href}
                  className="relative group"
                  onMouseEnter={() => loop.submenu && setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={loop.href}
                    className={`transition-colors flex items-center gap-0.5 md:gap-1 text-xs md:text-sm lg:text-base ${isScrolled
                      ? pathname === loop.href
                        ? "text-blue-300"
                        : "text-black hover:text-blue-300"
                      : pathname === loop.href
                        ? "text-blue-300"
                        : "text-white hover:text-blue-300"
                      }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {loop.text}
                    {loop.submenu && (
                      <ChevronDown
                        size={14}
                        className={`transition-transform duration-300 md:w-4 md:h-4 ${hoveredIndex === index ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </Link>
                  {loop.submenu && (
                    <div
                      ref={(el) => (submenuRefs.current[index] = el)}
                      className={`absolute top-full left-0 mt-1 md:mt-2 min-w-max md:min-w-[200px] lg:min-w-[240px] shadow-xl rounded-lg overflow-hidden z-[120] backdrop-blur-sm ${isScrolled ? "bg-white" : "bg-white/95"
                        }`}
                      style={{ display: "none", opacity: 0 }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <ul className="py-1 md:py-2">
                        {loop.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`block px-3 md:px-4 lg:px-6 py-2 md:py-3 text-xs md:text-xs lg:text-sm font-semibold uppercase transition-all duration-200 ${pathname === subItem.href
                                ? "text-blue-600 bg-blue-50 border-l-4 border-blue-600"
                                : "text-gray-700 hover:text-blue-600 hover:bg-blue-50 hover:border-l-4 hover:border-blue-400"
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
          <div className={`cs_toolbox scale-75 sm:scale-90 md:scale-100 ${isScrolled
            ? "text-black hover:text-blue-600"
            : "text-white hover:text-blue-600"
            }`}>
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
            className={`fixed inset-0 bg-black overflow-y-auto flex flex-col items-start justify-start z-[115] transition-all ${isOpen ? "h-screen" : "h-0"
              }`}
          >
            <div className="w-full px-4 sm:px-6 py-4 sm:py-6 flex flex-col gap-6 sm:gap-8">
              <div className="flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white font-bold opacity-100 transform hover:-translate-y-1 transition-all duration-300 rounded-full border-white p-1.5 sm:p-2 border-2"
                >
                  <X color="white" size={24} className="sm:w-6 sm:h-6" strokeWidth={3} />
                </button>
              </div>
              <div className="text-white px-2 sm:px-4">
                <p className="text-xs sm:text-sm leading-relaxed">9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350, Pakistan</p>
              </div>
              <nav className="flex flex-col items-start gap-6 sm:gap-10 mt-6 sm:mt-8 w-full px-2">
                {NavLinks.map((link, index) => (
                  <div key={link.text} className="w-full">
                    {/* Row: main link + 'Open Sub Menu' button (if submenu) */}
                    <div className="flex items-center gap-3 w-full">
                      {/* Main page link (always navigates) */}
                      <Link
                        href={link.href}
                        ref={(el) => (linksRef.current[index] = el)}
                        className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold uppercase opacity-0 transform -translate-y-5 transition-all duration-300 ${pathname === link.href ? "text-blue-400" : "text-white hover:text-blue-400"
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
                            className={`transition-transform duration-300 ${expandedMobileSubmenu === index ? "rotate-180" : ""
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
                        <ul className="flex flex-col gap-3 sm:gap-4 mt-4 sm:mt-6 pl-6 sm:pl-8 border-l-2 border-blue-400">
                          {link.submenu.map((subItem) => (
                            <li key={subItem.href}>
                              <Link
                                href={subItem.href}
                                className={`text-lg sm:text-xl md:text-2xl font-semibold uppercase transition-all duration-200 flex items-center gap-2 ${pathname === subItem.href
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
