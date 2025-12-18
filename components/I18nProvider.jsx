"use client";
import { useEffect } from 'react';
import { useLanguageStore } from '@/lib/stores/languageStore';
import '@/lib/i18n/i18n'; // Initialize i18n

export default function I18nProvider({ children }) {
  const language = useLanguageStore((state) => state.language);

  useEffect(() => {
    // Set initial language
    import('i18next').then(({ default: i18n }) => {
      i18n.changeLanguage(language);
    });

    // Update HTML attributes for global styling/RTL
    if (typeof document !== 'undefined') {
      const isUrdu = language === 'ur';
      document.documentElement.lang = language;
      document.documentElement.dir = isUrdu ? 'rtl' : 'ltr';

      // Optional: Add/remove a class for easier CSS targeting
      if (isUrdu) {
        document.body.classList.add('lang-ur');
      } else {
        document.body.classList.remove('lang-ur');
      }
    }
  }, [language]);

  return <>{children}</>;
}