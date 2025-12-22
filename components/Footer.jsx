"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Mail, MapPin, Phone, ExternalLink } from "lucide-react";
import { SocialLinks, CopyRight } from "@/components/SocialLinks";
import { useContactData } from "@/hooks/useContactData";
import { useTranslation } from 'react-i18next';
import { useLanguageStore } from "@/lib/stores/languageStore";

const footer_data = {
  email: "info@kwsc.gos.pk",
  phone: "(+92) 021 111 597 200",
};

const Footer = () => {
  const pathname = usePathname();
  const { data } = useContactData();
  const { t } = useTranslation();
  const language = useLanguageStore((state) => state.language);

  if (pathname?.startsWith("/papa")) {
    return null;
  }

  const contactInfo = {
    email: data?.channels?.find(c => c.label === "Email")?.email || data?.channels?.[0]?.email || footer_data.email,
    phone: data?.channels?.find(c => c.label === "Helpline")?.phone || data?.channels?.[0]?.phone || footer_data.phone,
    location: (() => {
      const office = data?.offices?.find(o => o.id === "hq") || data?.offices?.[0];
      if (!office) return t("footer.location");
      return (language === "ur" && office.addressUr) ? office.addressUr : (office.address || t("footer.location"));
    })(),
    footer_info: t("footer.info"),
  };

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
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">{t("footer.getInTouch")}</h3>
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
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">{t("footer.quickNavigation")}</h3>
            <div className="space-y-3">
              {/* Using standard <a> tag */}
              {[
                { label: t("footer.links.aboutUs"), href: "/aboutus" },
                { label: t("footer.links.whatWeDo"), href: "/ourservices" },
                { label: t("footer.links.ourProjects"), href: "/portfolio" },
                { label: t("footer.links.careers"), href: "/careers" },
                { label: t("footer.links.newsUpdates"), href: "/news" },
                { label: t("footer.links.contactUs"), href: "/contact" },
              ].map((item, index) => (
                <a key={index} href={item.href} className="block text-gray-600 hover:text-blue-600 transition-colors text-base font-medium group">
                    <span className="group-hover:translate-x-1 transition-transform inline-block text-cyan-500">→</span> {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* 4. Social Media & External Resources */}
          <div className="lg:col-span-1">
            <h3 className="text-xl font-extrabold text-gray-900 mb-6">{t("footer.stayConnected")}</h3>
            
            {/* Social Icons Section - Adjusted background/border for light theme */}
            <SocialLinks variant="icons" className="mb-8" />

            {/* External Links */}
            <h4 className="text-lg font-bold text-gray-900 mb-4">{t("footer.officialPortals")}</h4>
            <div className="space-y-3">
                {[
                    { label: t("footer.complaintSystem"), href: "https://complain.kwsc.gos.pk" },
                    { label: t("footer.tankerBooking"), href: "https://campaign.kwsc.gos.pk/" },
                    { label: t("footer.sindhPortal"), href: "https://www.sindh.gov.pk/" },
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
