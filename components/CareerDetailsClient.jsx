"use client";
import React from "react";
import { motion } from "framer-motion";
import { MapPin, Clock, Briefcase, Calendar, ArrowLeft } from "lucide-react";
import Link from "next/link";
import JobApplicationForm from "./JobApplicationForm";
import { format } from "date-fns";
import { useTranslation } from 'react-i18next';

export default function CareerDetailsClient({ job }) {
  const { t } = useTranslation();
  
  if (!job) return null;

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link 
            href="/careers" 
            className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Careers
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Job Details */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header Card */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8"
            >
              <div className="flex flex-wrap gap-3 mb-4">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                  {job.department}
                </span>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                  {job.jobType ? job.jobType.replace("_", " ") : "Full Time"}
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                {job.title}
              </h1>
              
              <div className="flex flex-wrap gap-y-2 gap-x-6 text-gray-600 text-sm md:text-base">
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  {job.location}
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" />
                  Posted {job.publishAt ? format(new Date(job.publishAt), "MMM d, yyyy") : "Recently"}
                </div>
                {job.compensation && (
                  <div className="flex items-center">
                    <Briefcase className="w-4 h-4 mr-2 text-gray-400" />
                    {job.compensation}
                  </div>
                )}
              </div>
            </motion.div>

            {/* Description & Requirements */}
            <motion.div 
              initial="hidden"
              animate="visible"
              variants={fadeInUp}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8 prose prose-blue max-w-none"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-4">Job Summary</h3>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {job.summary}
              </p>

              {job.description && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Description</h3>
                  <div className="text-gray-600 mb-8 leading-relaxed whitespace-pre-line">
                    {job.description}
                  </div>
                </>
              )}

              {job.responsibilities && job.responsibilities.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Key Responsibilities</h3>
                  <ul className="space-y-2 mb-8">
                    {job.responsibilities.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-blue-500 rounded-full flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}

              {job.qualifications && job.qualifications.length > 0 && (
                <>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Qualifications & Requirements</h3>
                  <ul className="space-y-2">
                    {job.qualifications.map((item, idx) => (
                      <li key={idx} className="flex items-start text-gray-600">
                        <span className="mr-3 mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </motion.div>
          </div>

          {/* Right Column: Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              {job.applyUrl ? (
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 md:p-8 text-center">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Apply for this Position</h3>
                  <p className="text-gray-600 mb-6">
                    To apply for this position, please visit our application portal.
                  </p>
                  <a 
                    href={job.applyUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                  >
                    {t('applyNow')}
                  </a>
                </div>
              ) : (
                <JobApplicationForm jobTitle={job.title} jobId={job.id} />
              )}
              
              <div className="mt-6 bg-blue-50 rounded-xl p-6 border border-blue-100">
                <h4 className="font-bold text-blue-900 mb-2">{t('careers.haveQuestions')}</h4>
                <p className="text-sm text-blue-700 mb-4">
                  {t('careers.questionsDesc')}
                </p>
                <a href="mailto:careers@kwsc.gos.pk" className="text-sm font-medium text-blue-600 hover:text-blue-800 underline">
                  careers@kwsc.gos.pk
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
