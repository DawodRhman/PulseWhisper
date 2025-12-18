import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useLanguageStore = create(
    persist(
        (set, get) => ({
            language: 'en',
            setLanguage: (language) => {
                set({ language });
                // Change i18n language
                if (typeof window !== 'undefined') {
                    import('i18next').then(({ default: i18n }) => {
                        i18n.changeLanguage(language);
                    });
                }
            },
        }),
        {
            name: 'language-storage',
        }
    )
);