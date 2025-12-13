"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { SocialLinks, CopyRight } from "@/components/SocialLinks";
import { useContactData } from "@/hooks/useContactData";

const footer_data = {
  email: "info@kwsc.gos.pk",
  phone: "(+92) 021 111 597 200",
  location: "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350, Pakistan",
  footer_info:
    "Karachi Water and Sewerage Corporation (KW&SC) is committed to providing reliable water and sewerage services to Karachi, ensuring clean water and efficient sewerage management for all residents.",
};

const Footer = () => {
  const pathname = usePathname();
  const { data } = useContactData();

  const contactInfo = {
    email: data?.channels?.find(c => c.label === "Email")?.email || data?.channels?.[0]?.email || footer_data.email,
    phone: data?.channels?.find(c => c.label === "Helpline")?.phone || data?.channels?.[0]?.phone || footer_data.phone,
    location: data?.offices?.find(o => o.id === "hq")?.address || data?.offices?.[0]?.address || footer_data.location,
    footer_info: footer_data.footer_info,
  };

  if (pathname?.startsWith("/papa")) {
    return null;
  }

  return (
    // Switched to a light background color and dark text color
    <footer className="bg-gray-50 text-gray-700 pt-20 font-sans relative overflow-hidden shadow-lg">
      {/* Abstract wave or shape for visual interest - now a lighter accent border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600"></div>

      <div className=" max-w-7xl mx-auto px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* 1. Company Info & Logo */}
          <div className="lg:col-span-1">
            <div className="mb-8">
              {/* Using standard <img> tag */}
              <img
                src={"/kwsc logo.png"}
                width={150}
                height={150}
                alt="KW&SC Logo"
                className="mb-6 object-contain h-24 w-auto"
              />
              <p className="mb-6 text-gray-600 leading-relaxed text-base">
                {contactInfo.footer_info}
              </p>
            </div>
          </div>

          {/* 2. Contact Information */}
          <div className="lg:col-span-1">
            {/* Updated title color and border accent for light theme */}
            <h3 className="text-xl font-extrabold text-blue-600 mb-6 border-l-4 border-cyan-500 pl-3">Get In Touch</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-cyan-500 mt-1 flex-shrink-0" size={20} />
                <span className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                    {contactInfo.location}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-cyan-500 flex-shrink-0" size={20} />
                <a href={`tel:${contactInfo.phone.replace(/[\s\(\)]/g, '')}`} className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                    {contactInfo.phone}
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-cyan-500 flex-shrink-0" size={20} />
                <a href={`mailto:${contactInfo.email}`} className="text-sm text-gray-600 hover:text-cyan-600 transition-colors">
                    {contactInfo.email}
                </a>
              </div>
            </div>
          </div>

          {/* 3. Quick Links (Simplified) */}
          <div className="lg:col-span-1">
            {/* Updated title color and border accent for light theme */}
            <h3 className="text-xl font-extrabold text-blue-600 mb-6 border-l-4 border-cyan-500 pl-3">Quick Navigation</h3>
            <div className="space-y-3">
              {/* Using standard <a> tag */}
              {[
                { label: "About Us", href: "/aboutus" },
                { label: "What We Do", href: "/ourservices" },
                { label: "Our Projects", href: "/portfolio" },
                { label: "Careers", href: "/careers" },
                { label: "News & Updates", href: "/news" },
                { label: "Contact Us", href: "/contact" },
              ].map((item, index) => (
                <a key={index} href={item.href} className="block text-gray-600 hover:text-blue-600 transition-colors text-base font-medium group">
                    <span className="group-hover:translate-x-1 transition-transform inline-block text-cyan-500">→</span> {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* 4. Social Media & External Resources */}
          <div className="lg:col-span-1">
            {/* Updated title color and border accent for light theme */}
            <h3 className="text-xl font-extrabold text-blue-600 mb-6 border-l-4 border-cyan-500 pl-3">Stay Connected</h3>
            
            {/* Social Icons Section - Adjusted background/border for light theme */}
            <SocialLinks variant="icons" className="mb-8" />

            {/* External Links */}
            <h4 className="text-lg font-bold text-gray-600 mb-4">Official Portals</h4>
            <div className="space-y-3">
                {[
                    { label: "Online Complaint System", href: "https://complain.kwsc.gos.pk" },
                    { label: "Tanker Booking System", href: "https://campaign.kwsc.gos.pk/" },
                    { label: "Sindh Government Portal", href: "https://www.sindh.gov.pk/" },
                ].map((item, index) => (
                    <a
                        key={index}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-gray-500 hover:text-blue-600 transition-colors text-sm font-medium flex items-center gap-2"
                    >
                        {item.label} <ExternalLink size={14} className="flex-shrink-0" />
                    </a>
                ))}
            </div>

          </div>

        </div>

        {/* Copyright and Bottom Border - Adjusted border color */}
        <div className="border-t border-gray-200 py-8 text-center">
          <CopyRight />
        </div>
      </div>
    </footer>
  );
};

export default Footer;