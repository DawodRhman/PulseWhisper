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
  }, [language]);

  return <>{children}</>;
}