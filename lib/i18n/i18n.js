import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Translation resources
const resources = {
    en: {
        translation: {
            // Navigation
            "nav.home": "Home",
            "nav.about": "About Us",
            "nav.services": "Services",
            "nav.projects": "Projects",
            "nav.careers": "Careers",
            "nav.contact": "Contact",
            "nav.media": "Media",
            "nav.rti": "RTI",
            "nav.tenders": "Tenders",
            "nav.search": "Search...",

            // Hero Section
            "hero.eyebrow": "Karachi Water & Sewerage Corporation",
            "hero.subtitle": "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
            "hero.cta": "Learn About KW&SC",

            // Projects
            "projects.title": "Major Projects",
            "projects.subtitle": "Tracking the physical and financial progress of Federal (PSDP) and Provincial (ADP) development schemes.",
            "projects.status": "INFRASTRUCTURE DEPLOYMENT STATUS",
            "footer.about": "About KW&SC",
            "footer.services": "Our Services",
            "footer.quickLinks": "Quick Links",
            "footer.contact": "Contact Us",
            "footer.copyright": "© {{year}} KW&SC. All rights reserved.",

            // Common
            "loading": "Loading...",
            "error": "An error occurred",
            "readMore": "Read More",
            "viewDetails": "View Details",
        }
    },
    ur: {
        translation: {
            // Navigation
            "nav.home": "ہوم",
            "nav.about": "ہمارے بارے میں",
            "nav.services": "خدمات",
            "nav.projects": "پروجیکٹس",
            "nav.careers": "کیریئرز",
            "nav.contact": "رابطہ",
            "nav.media": "میڈیا",
            "nav.rti": "RTI",
            "nav.tenders": "ٹینڈرز",
            "nav.search": "تلاش...",

            // Hero Section
            "hero.eyebrow": "کراچی واٹر اینڈ سیوریج کارپوریشن",
            "hero.title": "پہنچانے کے لیے پرعزم",
            "hero.subtitle": "کراچی کے لیے صاف اور محفوظ پانی کی فراہمی اور موثر سیوریج خدمات کو یقینی بنانا۔",
            "hero.cta": "KW&SC کے بارے میں جانیں",

            // Projects
            "projects.title": "اہم پروجیکٹس",
            "projects.subtitle": "وفاقی (PSDP) اور صوبائی (ADP) ترقیاتی اسکیموں کی جسمانی اور مالی پیشرفت کا ٹریک کرنا۔",
            "projects.status": "انفراسٹرکچر ڈپلویمنٹ اسٹیٹس",
            "footer.about": "KW&SC کے بارے میں",
            "footer.services": "ہماری خدمات",
            "footer.quickLinks": "فوری لنکس",
            "footer.contact": "ہم سے رابطہ کریں",
            "footer.copyright": "© {{year}} KW&SC. جملہ حقوق محفوظ ہیں۔",

            // Common
            "loading": "لوڈ ہو رہا ہے...",
            "error": "ایک خرابی پیش آگئی",
            "readMore": "مزید پڑھیں",
            "viewDetails": "تفصیلات دیکھیں",
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: 'en', // default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false, // React already escapes values
        },
    });

export default i18n;