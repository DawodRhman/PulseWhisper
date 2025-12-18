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

            // Service Tiles (WhoAreWe)
            "services.tiles.complaintManagement.title": "Complaint Management",
            "services.tiles.complaintManagement.desc": "Raise and track complaints regarding water supply, sewerage issues, billing discrepancies, and illegal connections.",
            "services.tiles.newConnection.title": "New Connection",
            "services.tiles.newConnection.desc": "Apply online for new water or sewerage connections through KW&SC's official portal or local office.",
            "services.tiles.billGeneration.title": "Bill Generation",
            "services.tiles.billGeneration.desc": "Access, view, and download your water and sewerage bills using your consumer number anytime.",
            "services.tiles.onlineTanker.title": "Online Tanker Booking",
            "services.tiles.onlineTanker.desc": "Request water tankers online for areas without piped water supply to ensure timely delivery.",

            // Common
            "loading": "Loading...",
            "error": "An error occurred",
            "readMore": "Read More",
            "updated": "Updated:",
            "viewDetails": "View Details",
            "applyNow": "Apply Now",
            "submit": "Submit",
            "cancel": "Cancel",
            "close": "Close",
            "menu": "Menu",
            "search": "Search",
            "back": "Back",

            // News
            "news.latestNews": "Latest News",
            "news.pressReleases": "Press Releases",
            "news.gallery": "Gallery",
            "news.readMore": "Read More",

            // Projects
            "projects.status.completed": "Completed",
            "projects.status.ongoing": "Ongoing",
            "projects.status.inProgress": "In Progress",
            "projects.status.planning": "Planning",
            "projects.status.paused": "Paused",
            "projects.viewDetails": "View Details",
            "projects.physicalProgress": "Physical Progress:",
            "projects.loading": "Loading Project Data...",

            // Careers
            "careers.haveQuestions": "Have questions?",
            "careers.questionsDesc": "If you have any questions about this role or the application process, please contact our HR department.",

            // Settings
            "settings.theme": "Theme",
            "settings.language": "Language",
            "settings.lightMode": "Light Mode",
            "settings.darkMode": "Dark Mode",
            "settings.english": "English",
            "settings.urdu": "اردو",

            // Leadership Fallbacks
            "leadership.vision.title": "Our Vision",
            "leadership.vision.desc": "A future where Karachi receives uninterrupted, clean, and safe water through modernized infrastructure and progressive leadership.",
            "leadership.mission.title": "Our Mission",
            "leadership.mission.desc": "To provide efficient water supply and sewerage services through sustainable operations, innovative planning, and skilled leadership.",
            "leadership.values.title": "Core Values",
            "leadership.values.desc": "Transparency, accountability, innovation, and public service form the foundation of KW&SC's leadership principles.",

            // Workflow Fallbacks
            "workflow.step1.title": "Bulk Water Supply & Treatment",
            "workflow.step1.subtitle": "Managing the abstraction of raw water from primary sources (Indus River, Hub Dam), operating massive pumping systems, and treating water to potable standards for the entire metropolitan area.",
            "workflow.step2.title": "Sewerage Infrastructure Management",
            "workflow.step2.subtitle": "Planning, operating, and maintaining the vast network of sewerage collectors, trunk mains, lifting/pumping stations, and ensuring proper disposal and treatment of wastewater and industrial effluent.",
            "workflow.step3.title": "Distribution & Network Integrity",
            "workflow.step3.subtitle": "Managing the final distribution network, pipelines, and bulk transfer mains; focusing on reducing Non-Revenue Water (NRW) through leak detection, asset rehabilitation, and minimizing illegal connections.",
            "workflow.step4.title": "Revenue, Customer & Governance",
            "workflow.step4.subtitle": "Ensuring financial sustainability through accurate metering, billing, and revenue collection. This role also includes effective customer grievance redressal and upholding institutional governance standards.",

            // Education Fallbacks
            "education.waterConservation.title": "Water Conservation Basics",
            "education.waterConservation.desc": "Practical tips for households to reduce daily water consumption, detect leaks early, and use fixtures efficiently.",
            "education.drinkingWater.title": "Safe Drinking Water Guide",
            "education.drinkingWater.desc": "Learn how KW&SC treats and monitors water quality, and how you can store and handle drinking water safely at home.",
            "education.sewerage.title": "Sewerage Do’s & Don’ts",
            "education.sewerage.desc": "What NOT to flush or drain, and how proper disposal helps prevent blockages, overflows, and environmental damage.",
            "education.emergency.title": "Emergency Preparedness",
            "education.emergency.desc": "Steps to prepare your household for water supply interruptions, including safe storage, hygiene, and tanker coordination.",

            // Tenders
            "tenders.open": "Open Tenders",
            "tenders.closed": "Closed Tenders",
            "tenders.cancelled": "Cancelled Tenders",
            "tenders.search": "Search & Filter Open Tenders",
            "tenders.searchPlaceholder": "Search by Title/Description",
            "tenders.filterByType": "Filter by Type",
            "tenders.dueDate": "Due Date:",
            "tenders.closedDate": "Closed/Cancelled Date:",
            "tenders.download": "Download Document",
            "tenders.noOpen": "No Open Tenders match your current search criteria.",
            "tenders.noClosed": "No Closed Tenders found.",
            "tenders.noCancelled": "No Cancelled Tenders found.",
            "tenders.viewMore": "View More",
            "tenders.hideDetails": "Hide Details",
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

            // Service Tiles (WhoAreWe)
            "services.tiles.complaintManagement.title": "شکایتی انتظام",
            "services.tiles.complaintManagement.desc": "پانی کی فراہمی، سیوریج کے مسائل، بلنگ کے تضادات، اور غیر قانونی کنکشن کے بارے میں شکایات درج کریں اور ٹریک کریں۔",
            "services.tiles.newConnection.title": "نیا کنکشن",
            "services.tiles.newConnection.desc": "KW&SC کے سرکاری پورٹل یا مقامی دفتر کے ذریعے نئے پانی یا سیوریج کنکشن کے لیے آن لائن درخواست دیں۔",
            "services.tiles.billGeneration.title": "بل جنریشن",
            "services.tiles.billGeneration.desc": "کسی بھی وقت اپنے صارف نمبر کا استعمال کرتے ہوئے اپنے پانی اور سیوریج کے بلوں تک رسائی حاصل کریں، دیکھیں اور ڈاؤن لوڈ کریں۔",
            "services.tiles.onlineTanker.title": "آن لائن ٹینکر بکنگ",
            "services.tiles.onlineTanker.desc": "بروقت ترسیل کو یقینی بنانے کے لیے ان علاقوں کے لیے آن لائن پانی کے ٹینکرز کی درخواست کریں جہاں پائپ سے پانی کی فراہمی نہیں ہے۔",

            // Common
            "loading": "لوڈ ہو رہا ہے...",
            "error": "ایک خرابی پیش آگئی",
            "readMore": "مزید پڑھیں",
            "updated": "اپ ڈیٹ:",
            "viewDetails": "تفصیلات دیکھیں",
            "applyNow": "ابھی اپلائی کریں",
            "submit": "جمع کرائیں",
            "cancel": "منسوخ کریں",
            "close": "بند کریں",
            "menu": "مینو",
            "search": "تلاش",
            "back": "پیچھے",

            // News
            "news.latestNews": "تازہ ترین خبریں",
            "news.pressReleases": "پریس ریلیز",
            "news.gallery": "گیلری",
            "news.readMore": "مزید پڑھیں",

            // Projects
            "projects.status.completed": "مکمل",
            "projects.status.ongoing": "جاری",
            "projects.status.inProgress": "جاری",
            "projects.status.planning": "منصوبہ بندی",
            "projects.status.paused": "روک دیا گیا",
            "projects.viewDetails": "تفصیلات دیکھیں",
            "projects.physicalProgress": "جسمانی پیشرفت:",
            "projects.loading": "پروجیکٹ ڈیٹا لوڈ ہو رہا ہے...",

            // Careers
            "careers.haveQuestions": "سوالات ہیں؟",
            "careers.questionsDesc": "اگر آپ کو اس کردار یا درخواست کے عمل کے بارے میں کوئی سوال ہے، تو براہ کرم ہمارے HR محکمہ سے رابطہ کریں۔",

            // Settings
            "settings.theme": "تھیم",
            "settings.language": "زبان",
            "settings.lightMode": "لائٹ موڈ",
            "settings.darkMode": "ڈارک موڈ",
            "settings.english": "انگریزی",
            "settings.urdu": "اردو",

            // Leadership Fallbacks
            "leadership.vision.title": "ہماری ویژن",
            "leadership.vision.desc": "ایک مستقبل جہاں کراچی کو جدید انفراسٹرکچر اور ترقی پسند لیڈرشپ کے ذریعے غیر منقطع، صاف اور محفوظ پانی ملے۔",
            "leadership.mission.title": "ہمارا مشن",
            "leadership.mission.desc": "پائیدار آپریشنز، اختراعی منصوبہ بندی اور ہنرمند لیڈرشپ کے ذریعے موثر پانی کی فراہمی اور سیوریج خدمات فراہم کرنا۔",
            "leadership.values.title": "ہمارے بنیادی اقدار",
            "leadership.values.desc": "شفافیت، جوابدہی، اختراع اور عوامی خدمت KW&SC کی لیڈرشپ کے اصولوں کی بنیاد ہیں۔",

            // Workflow Fallbacks
            "workflow.step1.title": "بلک واٹر سپلائی اور ٹریٹمنٹ",
            "workflow.step1.subtitle": "پرانے ذرائع (سندھ دریا، ہب ڈیم) سے خام پانی کی نکاسی کا انتظام، بڑے پمپنگ سسٹمز کی آپریشن، اور پورے میٹروپولیٹن ایریا کے لیے پانی کو پینے کے قابل معیار تک ٹریٹ کرنا۔",
            "workflow.step2.title": "سیوریج انفراسٹرکچر مینجمنٹ",
            "workflow.step2.subtitle": "سیوریج کلیکٹرز، ٹرنک مینز، لفٹنگ/پمپنگ اسٹیشنز کے وسیع نیٹ ورک کی منصوبہ بندی، آپریشن اور دیکھ بھال، اور فضلہ پانی اور صنعتی فضلہ کے مناسب اخراج اور ٹریٹمنٹ کو یقینی بنانا۔",
            "workflow.step3.title": "ڈسٹریبیوشن اور نیٹ ورک کی سالمیت",
            "workflow.step3.subtitle": "حتمی ڈسٹریبیوشن نیٹ ورک، پائپ لائنز اور بلک ٹرانسفر مینز کا انتظام؛ لیک کی تشخیص، اثاثوں کی بحالی اور غیر قانونی کنکشنز کو کم کرنے کے ذریعے غیر آمدنی والے پانی (NRW) کو کم کرنے پر توجہ مرکوز کرنا۔",
            "workflow.step4.title": "ریونیو، کسٹمر اور گورننس",
            "workflow.step4.subtitle": "درست میٹرنگ، بلنگ اور ریونیو کی وصولی کے ذریعے مالی استحکام کو یقینی بنانا۔ یہ کردار کسٹمر کی شکایات کے موثر حل اور ادارہ جاتی گورننس کے معیاروں کو برقرار رکھنے کو بھی شامل کرتا ہے۔",

            // Education Fallbacks
            "education.waterConservation.title": "پانی کی بچت کے اسباق",
            "education.waterConservation.desc": "گھریلو پانی کے استعمال کو کم کرنے، لیک کا جلد پتہ لگانے اور فکسچر کو مؤثر طریقے سے استعمال کرنے کے عملی مشورے۔",
            "education.drinkingWater.title": "پینے کے محفوظ پانی کا گائیڈ",
            "education.drinkingWater.desc": "جانیں کہ KW&SC پانی کے معیار کا علاج اور نگرانی کیسے کرتا ہے، اور آپ گھر پر پینے کے پانی کو محفوظ طریقے سے کیسے ذخیرہ اور سنبھال سکتے ہیں۔",
            "education.sewerage.title": "سیوریج کے ڈوز اور ڈونٹس",
            "education.sewerage.desc": "کیا فلش یا ڈرین نہ کریں، اور کیسے مناسب ڈسپوزل بلاکیج، اوور فلو اور ماحولیاتی نقصان سے بچنے میں مدد کرتا ہے۔",
            "education.emergency.title": "ہنگامی تیاری",
            "education.emergency.desc": "پانی کی فراہمی میں رکاوٹوں کے بیانیے کے لیے اپنے گھر والوں کو تیار کرنے کے اقدامات، بشمول محفوظ ذخیرہ، حفظان صحت اور ٹینکر کوآرڈینیشن۔",

            // Tenders
            "tenders.open": "کھلے ٹینڈرز",
            "tenders.closed": "بند ٹینڈرز",
            "tenders.cancelled": "منسوخ شدہ ٹینڈرز",
            "tenders.search": "کھلے ٹینڈرز تلاش کریں اور فلٹر کریں",
            "tenders.searchPlaceholder": "عنوان/تفصیل کے ذریعہ تلاش کریں",
            "tenders.filterByType": "قسم کے لحاظ سے فلٹر کریں",
            "tenders.dueDate": "آخری تاریخ:",
            "tenders.closedDate": "بند/منسوخ ہونے کی تاریخ:",
            "tenders.download": "دستاویز ڈاؤن لوڈ کریں",
            "tenders.noOpen": "کوئی بھی کھلا ٹینڈر آپ کے موجودہ تلاش کے معیار سے مطابقت نہیں رکھتا۔",
            "tenders.noClosed": "کوئی بند ٹینڈر نہیں ملا۔",
            "tenders.noCancelled": "کوئی منسوخ شدہ ٹینڈر نہیں ملا۔",
            "tenders.viewMore": "مزید دیکھیں",
            "tenders.hideDetails": "تفصیلات چھپائیں",
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