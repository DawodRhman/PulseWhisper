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
            "nav.education": "Education",
            "nav.search": "Search...",
            "nav.whatWeDo": "What We Do",
            "nav.ourHeritage": "Our Heritage",
            "nav.waterToday": "Water Today",
            "nav.achievements": "Achievements",
            "nav.ourLeadership": "Our Leadership",
            "nav.faqs": "FAQs",
            "nav.workWithUs": "Work With Us",
            "nav.newsUpdates": "News & Updates",
            "nav.rightToInformation": "Right to Information",
            "nav.allProjects": "All Projects",

            // Hero Section
            "hero.eyebrow": "Karachi Water & Sewerage Corporation",
            "hero.title": "Committed to Deliver",
            "hero.subtitle": "Ensuring clean, safe water supply and efficient sewerage services for Karachi.",
            "hero.cta": "Learn About KW&SC",

            // Page Heroes
            "hero.tenders.title": "Tenders",
            "hero.tenders.subtitle": "Official tender notices and procurement opportunities for KW&SC salaries and services.",
            "hero.careers.title": "Careers at KW&SC",
            "hero.careers.subtitle": "Join our mission to provide clean water and efficient sewerage services to Karachi.",
            "hero.rti.title": "Right to Information",
            "hero.rti.subtitle": "Access official documents, forms, and information about KW&SC operations.",

            // Projects
            "projects.title": "Major Projects",
            "projects.subtitle": "Tracking the physical and financial progress of Federal (PSDP) and Provincial (ADP) development schemes.",
            "projects.status": "INFRASTRUCTURE DEPLOYMENT STATUS",
            "projects.viewArchives": "View Historical Project Archives",

            // Footer
            "footer.about": "About KW&SC",
            "footer.services": "Our Services",
            "footer.quickLinks": "Quick Links",
            "footer.contact": "Contact Us",
            "footer.getInTouch": "Get In Touch",
            "footer.quickNavigation": "Quick Navigation",
            "footer.copyright": "© {{year}} KW&SC. All rights reserved.",
            "footer.location": "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350, Pakistan",
            "footer.info": "Karachi Water and Sewerage Corporation (KW&SC) is committed to providing reliable water and sewerage services to Karachi, ensuring clean water and efficient sewerage management for all residents.",

            // Footer Links
            "footer.links.aboutUs": "About Us",
            "footer.links.whatWeDo": "What We Do",
            "footer.links.ourProjects": "Our Projects",
            "footer.links.careers": "Careers",
            "footer.links.newsUpdates": "News & Updates",
            "footer.links.contactUs": "Contact Us",
            "footer.stayConnected": "Stay Connected",
            "footer.officialPortals": "Official Portals",
            "footer.complaintSystem": "Online Complaint System",
            "footer.tankerBooking": "Tanker Booking System",
            "footer.sindhPortal": "Sindh Government Portal",

            // Services
            "services.newConnection": "New Connection",
            "services.eComplaint": "E-Complaint",
            "services.bookTanker": "Book Tanker",
            "services.getYourBill": "Get Your Bill",
            "services.kwscAssistant": "KWSC Assistant",
            "services.assistantGreeting": "Hello! I am KWSC Assistant. How can I help you today?",

            // Common
            "loading": "Loading...",
            "error": "An error occurred",
            "readMore": "Read More",
            "viewDetails": "View Details",
            "submit": "Submit",
            "cancel": "Cancel",
            "close": "Close",
            "menu": "Menu",
            "search": "Search",
            "back": "Back",

            // Settings
            "settings.theme": "Theme",
            "settings.language": "Language",
            "settings.lightMode": "Light Mode",
            "settings.darkMode": "Dark Mode",
            "settings.english": "English",
            "settings.urdu": "اردو",
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
            "nav.education": "تعلیم",
            "nav.search": "تلاش...",
            "nav.whatWeDo": "ہم کیا کرتے ہیں",
            "nav.ourHeritage": "ہماری میراث",
            "nav.waterToday": "آج کا پانی",
            "nav.achievements": "کامیابیاں",
            "nav.ourLeadership": "ہماری قیادت",
            "nav.faqs": "سوالات",
            "nav.workWithUs": "ہمارے ساتھ کام کریں",
            "nav.newsUpdates": "خبریں اور اپ ڈیٹس",
            "nav.rightToInformation": "معلومات کا حق",
            "nav.allProjects": "تمام پروجیکٹس",

            // Hero Section
            "hero.eyebrow": "کراچی واٹر اینڈ سیوریج کارپوریشن",
            "hero.title": "پہنچانے کے لیے پرعزم",
            "hero.subtitle": "کراچی کے لیے صاف اور محفوظ پانی کی فراہمی اور موثر سیوریج خدمات کو یقینی بنانا۔",
            "hero.cta": "KW&SC کے بارے میں جانیں",

            // Page Heroes
            "hero.tenders.title": "ٹینڈرز",
            "hero.tenders.subtitle": "سرکاری ٹینڈر نوٹس اور KW&SC کی تنخواہوں اور خدمات کی خریداری کے مواقع۔",
            "hero.careers.title": "KW&SC میں کیریئرز",
            "hero.careers.subtitle": "کراچی کو صاف پانی اور موثر سیوریج خدمات فراہم کرنے کے ہمارے مشن میں شامل ہوں۔",
            "hero.rti.title": "معلومات کا حق",
            "hero.rti.subtitle": "KW&SC آپریشنز کے بارے میں سرکاری دستاویزات، فارمز اور معلومات تک رسائی حاصل کریں۔",

            // Projects
            "projects.title": "اہم پروجیکٹس",
            "projects.subtitle": "وفاقی (PSDP) اور صوبائی (ADP) ترقیاتی اسکیموں کی جسمانی اور مالی پیشرفت کا ٹریک کرنا۔",
            "projects.status": "انفراسٹرکچر ڈپلویمنٹ اسٹیٹس",
            "projects.viewArchives": "تاریخی پروجیکٹ آرکائیو دیکھیں",

            // Footer
            "footer.about": "KW&SC کے بارے میں",
            "footer.services": "ہماری خدمات",
            "footer.quickLinks": "فوری لنکس",
            "footer.contact": "ہم سے رابطہ کریں",
            "footer.getInTouch": "رابطے میں رہیں",
            "footer.quickNavigation": "فوری نیویگیشن",
            "footer.copyright": "© {{year}} KW&SC. جملہ حقوق محفوظ ہیں۔",
            "footer.location": "9ویں میل کرساز، مین شاہراہ فیصل، کراچی-75350، پاکستان",
            "footer.info": "کراچی واٹر اینڈ سیوریج کارپوریشن (KW&SC) کراچی کو قابل اعتماد پانی اور سیوریج خدمات فراہم کرنے کے لیے پرعزم ہے، تمام رہائشیوں کے لیے صاف پانی اور موثر سیوریج مینجمنٹ کو یقینی بناتے ہوئے۔",

            // Footer Links
            "footer.links.aboutUs": "ہمارے بارے میں",
            "footer.links.whatWeDo": "ہم کیا کرتے ہیں",
            "footer.links.ourProjects": "ہمارے پروجیکٹس",
            "footer.links.careers": "کیریئرز",
            "footer.links.newsUpdates": "خبریں اور اپ ڈیٹس",
            "footer.links.contactUs": "ہم سے رابطہ کریں",
            "footer.stayConnected": "جڑے رہیں",
            "footer.officialPortals": "سرکاری پورٹلز",
            "footer.complaintSystem": "آن لائن شکایت سسٹم",
            "footer.tankerBooking": "ٹینکر بکنگ سسٹم",
            "footer.sindhPortal": " سندھ حکومت پورٹل",

            // Services
            "services.newConnection": "نیا کنکشن",
            "services.eComplaint": "ای-شکایت",
            "services.bookTanker": "ٹینکر بکنگ",
            "services.getYourBill": "اپنا بل حاصل کریں",
            "services.kwscAssistant": "KWSC اسسٹنٹ",
            "services.assistantGreeting": "ہیلو! میں KWSC اسسٹنٹ ہوں۔ آج میں آپ کی کیسے مدد کر سکتا ہوں؟",

            // Common
            "loading": "لوڈ ہو رہا ہے...",
            "error": "ایک خرابی پیش آگئی",
            "readMore": "مزید پڑھیں",
            "viewDetails": "تفصیلات دیکھیں",
            "submit": "جمع کرائیں",
            "cancel": "منسوخ کریں",
            "close": "بند کریں",
            "menu": "مینو",
            "search": "تلاش",
            "back": "پیچھے",

            // Settings
            "settings.theme": "تھیم",
            "settings.language": "زبان",
            "settings.lightMode": "لائٹ موڈ",
            "settings.darkMode": "ڈارک موڈ",
            "settings.english": "انگریزی",
            "settings.urdu": "اردو",
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