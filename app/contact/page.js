"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, User, Tag, MessageSquare, Clock } from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    category: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState(null);
  const [contactData, setContactData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [dataError, setDataError] = useState(null);

  const inquiryCategories = [
    "Select Inquiry Category",
    "Billing & Payment",
    "Water Supply/Shortage",
    "Sewerage Complaint",
    "New Connection Request",
    "Water Theft Report",
    "Tanker Service Inquiry",
    "Other",
  ];

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    // Simulate API call delay
    setTimeout(() => {
      console.log("Form Data Submitted:", formData);
      setIsSubmitting(false);
      setSubmitMessage("Thank you! Your inquiry has been submitted. We will contact you shortly.");
      
      // Reset form after successful submission
      setFormData({
        name: "",
        email: "",
        mobile: "",
        category: "",
        message: "",
      });
    }, 2000);
  };

  useEffect(() => {
    let isMounted = true;

    const fetchContactData = async () => {
      try {
        const response = await fetch("/api/contact");
        if (!response.ok) {
          throw new Error("Unable to load contact data");
        }
        const payload = await response.json();
        if (isMounted) {
          setContactData(payload?.data || null);
        }
      } catch (error) {
        console.error("contact-page:fetch", error);
        if (isMounted) {
          setDataError("Live contact information is temporarily unavailable. Showing default details.");
        }
      } finally {
        if (isMounted) {
          setDataLoading(false);
        }
      }
    };

    fetchContactData();

    return () => {
      isMounted = false;
    };
  }, []);

  const defaultHero = {
    title: "Contact KW&SC",
    subtitle: "Reach out to us for inquiries, complaints, or service requests. We are here to help.",
    backgroundImage: "/teentalwarkarachi.gif",
  };
  const hero = contactData?.hero || defaultHero;
  const channels = contactData?.channels || [];
  const offices = contactData?.offices || [];
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

  // Animation variants
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
    <div className="bg-white min-h-screen">
      {/* Hero Header (Integrated, smaller version) */}
      <section
        className="bg-blue-900 text-white py-20 md:py-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${hero.backgroundImage || defaultHero.backgroundImage})` }}
      >
        <motion.div
          className="max-w-6xl mx-auto px-6 text-center"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.h1 variants={itemVariants} className="text-4xl md:text-6xl font-extrabold mb-4">
            {hero.title || "Contact KW&SC"}
          </motion.h1>
          <motion.p variants={itemVariants} className="text-lg md:text-xl text-blue-200">
            {hero.subtitle || defaultHero.subtitle}
          </motion.p>
        </motion.div>
      </section>

      {/* Main Content: Info & Form */}
      <motion.section
        className="max-w-6xl mx-auto -mt-16 md:-mt-20 px-6 pb-20"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={containerVariants}
      >
        {dataError && (
          <div className="mb-6 rounded-2xl border border-yellow-400 bg-yellow-100/60 text-yellow-900 px-6 py-4 text-sm font-medium">
            {dataError}
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Contact Information Panel */}
          <motion.div variants={itemVariants} className="lg:col-span-1">
            <div className="bg-blue-700 text-white p-8 md:p-10 rounded-3xl shadow-xl h-full flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold mb-4">Direct Contact</h2>
                <p className="mb-8 text-blue-200">
                  Prefer talking? Find our quick contact details below for immediate assistance.
                </p>

                <div className="space-y-6">
                  {/* Phone */}
                  <div className="flex items-start">
                    <Phone className="w-6 h-6 mr-4 flex-shrink-0 text-blue-300 mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Helpline</h3>
                      <p className="text-lg text-blue-100">
                        <a
                          href={helplineTel ? `tel:${helplineTel}` : undefined}
                          className="hover:underline hover:text-white transition-colors"
                        >
                          {helplineDisplayPhone}
                        </a>
                      </p>
                      {helplineChannel?.availability && (
                        <p className="text-sm text-blue-200">{helplineChannel.availability}</p>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="flex items-start">
                    <Mail className="w-6 h-6 mr-4 flex-shrink-0 text-blue-300 mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Email Us</h3>
                      <p className="text-lg text-blue-100">
                          <a
                            href={`mailto:${emailChannel?.email || fallbackEmail}`}
                            className="hover:underline hover:text-white transition-colors"
                          >
                            {emailChannel?.email || fallbackEmail}
                          </a>
                      </p>
                      {(emailChannel?.availability || helplineChannel?.availability) && (
                        <p className="text-sm text-blue-200">
                          {emailChannel?.availability || helplineChannel?.availability}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="flex items-start">
                    <MapPin className="w-6 h-6 mr-4 flex-shrink-0 text-blue-300 mt-1" />
                    <div>
                      <h3 className="font-semibold text-xl">Head Office</h3>
                      <p className="text-lg text-blue-100">
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(primaryOffice?.address || fallbackAddress)}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline hover:text-white transition-colors"
                          >
                            {primaryOffice?.address || fallbackAddress}
                          </a>
                      </p>
                      {primaryOffice?.hours && (
                        <p className="text-sm text-blue-200 flex items-center gap-2">
                          <Clock className="w-4 h-4" />
                          {primaryOffice.hours}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Form */}
          <motion.div variants={itemVariants} className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-3xl shadow-2xl border border-gray-100">
              <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
              <p className="text-gray-500 mb-8">
                Fill out the form below to initiate an inquiry or report an issue.
              </p>

              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Full Name */}
                <motion.div className="relative" whileFocus={shimmer}>
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                  <input
                    type="text"
                    id="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Full Name"
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                    required
                  />
                </motion.div>

                {/* 2. Email Address */}
                <motion.div className="relative" whileFocus={shimmer}>
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                  <input
                    type="email"
                    id="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                    required
                  />
                </motion.div>

                {/* 3. Mobile Number */}
                <motion.div className="relative" whileFocus={shimmer}>
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                  <input
                    type="tel"
                    id="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="Mobile Number (e.g., 03xx-xxxxxxx)"
                    pattern="[0-9]{4}-[0-9]{7}"
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900"
                    required
                  />
                </motion.div>

                {/* 4. Inquiry Category (Dropdown). Now takes the consumerNumber's place */}
                <motion.div className="relative" whileFocus={shimmer}>
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-500 pointer-events-none" />
                  <select
                    id="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full pl-12 pr-5 py-3 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 appearance-none bg-white cursor-pointer"
                    required
                  >
                    {inquiryCategories.map((cat, index) => (
                      <option key={index} value={cat === inquiryCategories[0] ? "" : cat} disabled={index === 0}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  {/* Custom Arrow for select */}
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
                    <ChevronDown className="w-5 h-5" />
                  </div>
                </motion.div>

                {/* 5. Message */}
                <motion.div className="relative md:col-span-2" whileFocus={shimmer}>
                  <MessageSquare className="absolute left-4 top-5 w-5 h-5 text-blue-500 pointer-events-none" />
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Provide detailed information about your issue or query"
                    rows="5"
                    className="w-full pl-12 pr-5 py-4 rounded-xl border border-gray-300 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all text-gray-900 resize-none"
                    required
                  />
                </motion.div>

                {/* Submit Button & Message */}
                <div className="md:col-span-2 flex flex-col sm:flex-row justify-between items-center mt-4">
                  {submitMessage ? (
                    <p className="text-green-600 font-semibold text-center sm:text-left mb-4 sm:mb-0">
                      {submitMessage}
                    </p>
                  ) : (
                    <div className="w-full sm:w-auto"></div> // Placeholder for alignment
                  )}
                  
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className={`px-10 py-3 text-white font-bold rounded-xl transition-all shadow-lg w-full sm:w-auto
                      ${isSubmitting
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-blue-800 hover:shadow-blue-500/50"
                      }`}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending...
                      </div>
                    ) : (
                      "Send Message"
                    )}
                  </motion.button>
                </div>
              </form>

              {/* Added Note */}
              <p className="mt-8 text-center text-sm text-gray-500 font-medium border-t pt-4">
                NOTE: For Further Information, please contact us on our helpline: <a href="tel:+92021111597200" className="text-blue-600 hover:underline">111-597-200</a>
              </p>
            </div>
          </motion.div>
        </div>

        {offices.length > 0 && (
          <div className="mt-12">
            <div className="flex items-center justify-between flex-wrap gap-4 mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Regional Offices & Service Hubs</h3>
                <p className="text-gray-500">Operational locations with on-ground teams and customer facilitation desks.</p>
              </div>
              {dataLoading && (
                <span className="text-sm text-gray-500">Refreshing locations…</span>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {offices.map((office) => {
                const mapLink =
                  office.mapEmbedUrl ||
                  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(office.address || office.label)}`;
                const officeTel = sanitizeTel(office.phone);

                return (
                  <div key={office.id} className="border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow bg-white">
                    <h4 className="text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      {office.label}
                    </h4>
                    <p className="text-gray-600 mb-4">{office.address}</p>
                    <div className="space-y-2 text-sm text-gray-600">
                      {office.hours && (
                        <p className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-blue-500" />
                          {office.hours}
                        </p>
                      )}
                      {office.phone && (
                        <p className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-blue-500" />
                          {officeTel ? (
                            <a href={`tel:${officeTel}`} className="hover:text-blue-600">
                              {office.phone}
                            </a>
                          ) : (
                            <span>{office.phone}</span>
                          )}
                        </p>
                      )}
                      {office.email && (
                        <p className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-blue-500" />
                          <a href={`mailto:${office.email}`} className="hover:text-blue-600">
                            {office.email}
                          </a>
                        </p>
                      )}
                      {mapLink && (
                        <a
                          href={mapLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 font-medium inline-flex items-center gap-2 mt-2"
                        >
                          View Map
                          <ChevronDown className="w-4 h-4 rotate-[-90deg]" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </motion.section>
    </div>
  );
}

// ChevronDown component (since lucide-react doesn't export all icons automatically)
const ChevronDown = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9l6 6 6-6" />
  </svg>
);