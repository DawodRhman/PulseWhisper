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
  const menuRef = useRef(null);
  const linksRef = useRef([]);
  const submenuRefs = useRef([]);
  const pathname = usePathname(); 

 
  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);


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
      href: "/ourservices", 
      text: "What We Do",
      submenu: [
        { href: "/ourservices", text: "Our Services" },
        { href: "/portfolio", text: "Our Projects" },
        { href: "/news", text: "News & Updates" },
        { href: "/right-to-information", text: "Right to Information" },
      ]
    },
     { 
      href: "/aboutus", 
      text: "About Us",
      submenu: [
        { href: "/aboutus", text: "Our Heritage" },
        { href: "/careers", text: "Water Today" },
        { href: "/achievements", text: "Achievements" },
        { href: "/careers", text: "Our Leadership" },
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
      submenu: [
        { href: "/contact", text: "Contact Us" },
        
      ]
    },
  ];

  // Handle submenu hover animations
  useEffect(() => {
    if (hoveredIndex !== null && NavLinks[hoveredIndex]?.submenu) {
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
      // Hide all submenus when not hovering
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
    }
  }, [hoveredIndex]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[110] transition-all duration-300 ${
          isScrolled ? "bg-white shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-[90%] mx-auto flex justify-between items-center py-4 transition-colors">
          <div>
            <img src="/kwsc logo.png" alt="KW&SC Logo" width={90} height={110} />
          </div>
          <nav>
            <ul className="flex gap-10 text-xl font-bold uppercase">
              {NavLinks.map((loop, index) => (
                <li 
                  key={loop.href}
                  className="relative group"
                  onMouseEnter={() => loop.submenu && setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <Link
                    href={loop.href}
                    className={`transition-colors flex items-center gap-1 ${
                      isScrolled
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
                        size={16} 
                        className={`transition-transform duration-300 ${
                          hoveredIndex === index ? 'rotate-180' : ''
                        }`}
                      />
                    )}
                  </Link>
                  {loop.submenu && (
                    <div
                      ref={(el) => (submenuRefs.current[index] = el)}
                      className={`absolute top-full left-0 mt-2 min-w-[220px] shadow-xl rounded-lg overflow-hidden z-[120] backdrop-blur-sm ${
                        isScrolled ? "bg-white" : "bg-white/95"
                      }`}
                      style={{ display: "none", opacity: 0 }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                    >
                      <ul className="py-2">
                        {loop.submenu.map((subItem) => (
                          <li key={subItem.href}>
                            <Link
                              href={subItem.href}
                              className={`block px-6 py-3 text-sm font-semibold uppercase transition-all duration-200 ${
                                pathname === subItem.href
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
          <div className={`cs_toolbox ${
                      isScrolled
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
            className={`fixed inset-0 bg-black overflow-hidden flex flex-col items-start justify-start z-[115] transition-all ${
              isOpen ? "h-screen" : "h-0"
            }`}
          >
            <div className="p-10 flex flex-row-reverse justify-between w-[90%] mx-auto">
              <div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-black font-bold opacity-100 transform mr-8 hover:-translate-y-1 -mt-2 translate-x-8 transition-all duration-300 rounded-full border-white p-2 border-2"
                >
                  <X color="white" strokeWidth={3}/>
                </button>
              </div>
              <div className="text-white">
                <p>9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350, Pakistan</p>
              </div>
              <nav className="flex flex-col items-start gap-16 mt-10">
                {NavLinks.map((link, index) => (
                  <Link
                    key={link.text}
                    href={link.href}
                    ref={(el) => (linksRef.current[index] = el)}
                    className={`text-5xl font-extrabold uppercase hover:text-blue-600 text-white opacity-0 transform -translate-y-5 transition-all duration-300 relative ${
                      pathname === link.href ? "text-blue-600" : "text-white"
                    }`}
                    data-menu={link.text}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.text}
                  </Link>
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
