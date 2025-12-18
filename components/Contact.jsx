"use client";
// import React from "react";
// import { Phone, Mail, Clock, MapPin } from "lucide-react";
// import Loader from "@/components/Loader";
// import { useContactData } from "@/hooks/useContactData";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Tag, MessageSquare } from "lucide-react";
import Loader from "@/components/Loader";
import { useContactData } from "@/hooks/useContactData";
import { useLanguageStore } from "@/lib/stores/languageStore";
import { UI_TRANSLATIONS } from "@/lib/translations";
export default function Contact() {
  const { data, loading, error } = useContactData();
  const language = useLanguageStore((state) => state.language);
  const t = (key) => UI_TRANSLATIONS[language]?.[key] || UI_TRANSLATIONS.en[key] || key;

  if (loading) return <Loader />;
  if (error) return <div className="text-center py-10 text-red-500">{t("Failed to load contact data.")}</div>;

  const { channels = [], offices = [] } = data || {};

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    category: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  // const [contactData, setContactData] = useState(null);
  // const [dataLoading, setDataLoading] = useState(true);
  // const [dataError, setDataError] = useState(null);

  const inquiryCategories = [
    t("Select Inquiry Category"),
    t("Billing & Payment"),
    t("Water Supply/Shortage"),
    t("Sewerage Complaint"),
    t("New Connection Request"),
    t("Water Theft Report"),
    t("Tanker Service Inquiry"),
    t("Other"),
  ];

  // ...existing code... Form input handler
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  // ...existing code... Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to submit");

      setSubmitMessage(t("Thank you! Your inquiry has been submitted. We will contact you shortly."));
      setFormData({
        name: "",
        email: "",
        mobile: "",
        category: "",
        message: "",
      });
    } catch (error) {
      console.error(error);
      setSubmitMessage(t("Something went wrong. Please try again later."));
    } finally {
      setIsSubmitting(false);
    }
  };

  // ...existing code... API fetch for contact data
  // useEffect(() => {
  //   let isMounted = true;

  //   const fetchContactData = async () => {
  //     try {
  //       const response = await fetch("/api/contact");
  //       if (!response.ok) {
  //         throw new Error("Unable to load contact data");
  //       }
  //       const payload = await response.json();
  //       if (isMounted) {
  //         setContactData(payload?.data || null);
  //       }
  //     } catch (error) {
  //       console.error("contact-page:fetch", error);
  //       if (isMounted) {
  //         setDataError("Live contact information is temporarily unavailable. Showing default details.");
  //       }
  //     } finally {
  //       if (isMounted) {
  //         setDataLoading(false);
  //       }
  //     }
  //   };

  //   fetchContactData();

  //   return () => {
  //     isMounted = false;
  //   };
  // }, []);

  // ...existing code... Fallback data and data extraction
  const defaultHero = {
    title: "CONTACT KW&SC",
    subtitle: "Reach out to us for inquiries, complaints, or service requests. We are here to help.",
    backgroundImage: "/teentalwarkarachi.gif",
  };
  const hero = data?.hero || defaultHero;
  const helplineChannel = channels.find((channel) => channel.phone);
  const emailChannel = channels.find((channel) => channel.email);
  const primaryOffice = offices[0];
  const fallbackPhone = "(+92) 021 111 597 200";
  const fallbackEmail = "info@kwsc.gos.pk";
  const fallbackAddress = "Karachi Water & Sewerage Corporation, Karachi, Pakistan.";
  const sanitizeTel = (value) => {
    if (!value) return null;
    const digits = value.replace(/[^+\d]/g, "");
    return digits.length ? digits : null;
  };
  const helplineDisplayPhone = helplineChannel?.phone || fallbackPhone;
  const helplineTel = sanitizeTel(helplineDisplayPhone);

  // ...existing code... Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const shimmer = {
    color: "#ffffff",
    boxShadow: "0 0 50px rgba(14, 165, 233, 0.5)",
    transition: { duration: 0.4 },
  };

  return (
    // <section className="py-12 px-4 md:px-8 max-w-7xl mx-auto space-y-16">
    //   {/* Contact Channels */}
    //   <div>
    //     <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Contact Channels</h2>
    //     <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
    //       {channels.map((channel) => (
    //         <div key={channel.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
    //           <h3 className="text-xl font-semibold text-gray-800 mb-2">{channel.label}</h3>
    //           <p className="text-gray-600 mb-4 text-sm">{channel.description}</p>
    //           <div className="space-y-2">
    //             {channel.phone && (
    //               <div className="flex items-center text-gray-700">
    //                 <Phone size={16} className="mr-2 text-blue-600" />
    //                 <span>{channel.phone}</span>
    //               </div>
    //             )}
    //             {channel.email && (
    //               <div className="flex items-center text-gray-700">
    //                 <Mail size={16} className="mr-2 text-blue-600" />
    //                 <a href={`mailto:${channel.email}`} className="hover:text-blue-800">{channel.email}</a>
    //               </div>
    //             )}
    //             {channel.availability && (
    //               <div className="flex items-center text-gray-700">
    //                 <Clock size={16} className="mr-2 text-blue-600" />
    //                 <span className="text-sm">{channel.availability}</span>
    //               </div>
    //             )}
    //           </div>
    //         </div>
    //       ))}
    //     </div>
    //   </div>

    //   {/* Offices */}
    //   <div>
    //     <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Our Offices</h2>
    //     <div className="grid gap-6 md:grid-cols-2">
    //       {offices.map((office) => (
    //         <div key={office.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow flex flex-col">
    //           <div className="p-6 flex-grow">
    //             <h3 className="text-xl font-semibold text-gray-800 mb-2">{office.label}</h3>
    //             <div className="flex items-start text-gray-600 mb-4">
    //               <MapPin size={18} className="mr-2 mt-1 text-blue-600 flex-shrink-0" />
    //               <p>{office.address}</p>
    //             </div>
    //             <div className="space-y-2 text-sm text-gray-600">
    //               {office.phone && (
    //                 <div className="flex items-center">
    //                   <Phone size={16} className="mr-2 text-blue-600" />
    //                   <span>{office.phone}</span>
    //                 </div>
    //               )}
    //               {office.email && (
    //                 <div className="flex items-center">
    //                   <Mail size={16} className="mr-2 text-blue-600" />
    //                   <span>{office.email}</span>
    //                 </div>
    //               )}
    //               {office.hours && (
    //                 <div className="flex items-center">
    //                   <Clock size={16} className="mr-2 text-blue-600" />
    //                   <span>{office.hours}</span>
    //                 </div>
    //               )}
    //             </div>
    //           </div>
    //           {office.mapEmbedUrl && (
    //             <div className="h-48 w-full bg-gray-100">
    //               <iframe
    //                 src={office.mapEmbedUrl}
    //                 width="100%"
    //                 height="100%"
    //                 style={{ border: 0 }}
    //                 allowFullScreen=""
    //                 loading="lazy"
    //                 referrerPolicy="no-referrer-when-downgrade"
    //               ></iframe>
    //             </div>
    //           )}
    //         </div>
    //       ))}
    //     </div>
    //   </div>
    // </section>

    <>
      <div className="bg-white min-h-screen">
        {/* Main Content: Info & Form */}
        <motion.section
          className="max-w-2xl sm:max-w-3xl md:max-w-4xl lg:max-w-5xl 2xl:max-w-6xl mx-auto mt-10  px-3 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24 xl:pb-28 2xl:pb-32"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={containerVariants}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 2xl:gap-14">

            {/* Contact Information Panel */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-blue-700 text-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-xl h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-4xl font-bold mb-4 uppercase">{t("Direct Contact")}</h2>
                  <p className="mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-blue-200 text-xs sm:text-sm md:text-base">
                    {t("Prefer talking? Find our quick contact details below for immediate assistance.")}
                  </p>

                  <div className="space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 xl:space-y-7">
                    {/* Phone */}
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <Phone className="w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 flex-shrink-0 text-blue-300 mt-0.5 sm:mt-1" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">{t("Helpline")}</h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100">
                          <a href={helplineTel ? `tel:${helplineTel}` : undefined} className="hover:underline hover:text-white transition-colors">
                            {helplineDisplayPhone}
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Email */}
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <Mail className="w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 flex-shrink-0 text-blue-300 mt-0.5 sm:mt-1" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">{t("Email Us")}</h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100">
                          <a href={`mailto:${emailChannel?.email || fallbackEmail}`} className="hover:underline hover:text-white transition-colors">
                            {emailChannel?.email || fallbackEmail}
                          </a>
                        </p>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="flex items-start gap-2 sm:gap-3 md:gap-4">
                      <MapPin className="w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 flex-shrink-0 text-blue-300 mt-0.5 sm:mt-1" />
                      <div className="min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base md:text-lg lg:text-xl">{t("Head Office")}</h3>
                        <p className="text-xs sm:text-sm md:text-base lg:text-lg text-blue-100">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryOffice?.address || fallbackAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-white transition-colors"
                          >
                            {(language === 'ur' && primaryOffice?.addressUr) ? primaryOffice.addressUr : (primaryOffice?.address || fallbackAddress)}
                          </a>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div variants={itemVariants} className="lg:col-span-2">
              <div className="bg-white p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12 2xl:p-14 rounded-2xl sm:rounded-2xl md:rounded-3xl lg:rounded-3xl shadow-2xl border border-gray-100">
                <h2 className="text-4xl font-bold text-gray-900 mb-4 uppercase">{t("Send Us a Message")}</h2>
                <p className="text-gray-500 mb-4 sm:mb-6 md:mb-8 lg:mb-10 text-xs sm:text-sm md:text-base">
                  {t("Fill out the form below to initiate an inquiry or report an issue.")}
                </p>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 md:gap-5 lg:gap-6 xl:gap-7 2xl:gap-8">

                  {/* 1. Full Name */}
                  <motion.div className="relative" whileFocus={shimmer}>
                    <User className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-blue-500 pointer-events-none" />
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("Full Name")}
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </motion.div>

                  {/* 2. Email Address */}
                  <motion.div className="relative" whileFocus={shimmer}>
                    <Mail className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-blue-500 pointer-events-none" />
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder={t("Email Address")}
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </motion.div>

                  {/* 3. Mobile Number */}
                  <motion.div className="relative" whileFocus={shimmer}>
                    <Phone className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-blue-500 pointer-events-none" />
                    <input
                      type="tel"
                      id="mobile"
                      value={formData.mobile}
                      onChange={handleChange}
                      placeholder={t("Mobile Number")}
                      pattern="[0-9]{4}-[0-9]{7}"
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 text-xs sm:text-sm md:text-base"
                      required
                    />
                  </motion.div>

                  {/* 4. Inquiry Category (Dropdown). Now takes the consumerNumber's place */}
                  <motion.div className="relative" whileFocus={shimmer}>
                    <Tag className="absolute left-2.5 sm:left-3 md:left-4 top-1/2 -translate-y-1/2 w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-blue-500 pointer-events-none" />
                    <select
                      id="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-2.5 md:py-3 lg:py-3 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 appearance-none bg-white cursor-pointer text-xs sm:text-sm md:text-base"
                      required
                    >
                      {inquiryCategories.map((cat, index) => (
                        <option key={index} value={cat === inquiryCategories[0] ? "" : cat} disabled={index === 0}>
                          {cat}
                        </option>
                      ))}
                    </select>
                    {/* Custom Arrow for select */}
                    <div className="absolute right-2.5 sm:right-3 md:right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                      <ChevronDown className="w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6" />
                    </div>
                  </motion.div>

                  {/* 5. Message */}
                  <motion.div className="relative md:col-span-2" whileFocus={shimmer}>
                    <MessageSquare className="absolute left-2.5 sm:left-3 md:left-4 top-3 sm:top-4 md:top-5 w-4 sm:w-5 md:w-5 lg:w-6 h-4 sm:h-5 md:h-5 lg:h-6 text-blue-500 pointer-events-none" />
                    <textarea
                      id="message"
                      value={formData.message}
                      onChange={handleChange}
                      placeholder={t("Provide detailed information about your issue or query")}
                      rows="4"
                      className="w-full pl-8 sm:pl-10 md:pl-12 pr-3 sm:pr-4 md:pr-5 py-2 sm:py-3 md:py-4 lg:py-4 rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 resize-none text-xs sm:text-sm md:text-base"
                      required
                    />
                  </motion.div>

                  {/* Submit Button & Message */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-4 md:gap-5 lg:gap-6 mt-3 sm:mt-4 md:mt-6 lg:mt-8">
                    {submitMessage ? (
                      <p className="text-green-600 font-semibold text-xs sm:text-sm md:text-base text-center sm:text-left">
                        {submitMessage}
                      </p>
                    ) : (
                      <div className="w-full sm:w-auto"></div>
                    )}

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.98 }}
                      className={`px-6 sm:px-8 md:px-10 lg:px-12 xl:px-14 py-2 sm:py-2.5 md:py-3 lg:py-3 text-xs sm:text-sm md:text-base lg:text-lg text-white font-bold rounded-lg sm:rounded-xl md:rounded-xl lg:rounded-xl transition-all shadow-lg w-full sm:w-auto
                      ${isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-blue-500/50"
                        }`}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center justify-center">
                          <svg className="animate-spin -ml-0.5 sm:-ml-1 mr-2 sm:mr-3 h-4 sm:h-5 w-4 sm:w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {t("Sending...")}
                        </div>
                      ) : (
                        t("Send Message")
                      )}
                    </motion.button>
                  </div>
                </form>

                {/* Added Note */}
                <p className="mt-6 sm:mt-7 md:mt-8 lg:mt-10 text-center text-xs sm:text-xs md:text-sm lg:text-base text-gray-500 font-medium border-t pt-3 sm:pt-4 md:pt-5 lg:pt-6">
                  {t("NOTE: For Further Information, please contact us on our helpline:")} <a href="tel:+92021111597200" className="text-blue-600 hover:underline">111-597-200</a>
                </p>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </>
  );
}


const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);