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
            "settings.sindhi": "سنڌي",

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
            "tenders.viewMore": "View More",
            "tenders.hideDetails": "Hide Details",

            // Work With Us
            "workWithUs.licenses.title": "Licensing & Permits",
            "workWithUs.licenses.subtitle": "Regulatory Framework for Water and Sewerage Operations",
            "workWithUs.licenses.desc": "KW&SC facilitates a streamlined process for obtaining necessary licenses and permits for bulk water usage, commercial water connections, hydrant operations, and effluent discharge. Our digital platform ensures transparency and efficiency, supporting compliant and sustainable operations within Karachi.",
            "workWithUs.licenses.cta": "Apply for a License",
            "workWithUs.licenses.pdfCta": "View Subsoil License PDF",

            "workWithUs.collaborations.title": "National & International Collaborations",
            "workWithUs.collaborations.subtitle": "Global Partnerships for Infrastructure Excellence",
            "workWithUs.collaborations.desc": "We actively collaborate with national bodies (e.g., planning commission, local government) and international development banks (e.g., World Bank, ADB) and sister utilities globally. These partnerships drive technology transfer, capacity building, and secure critical funding for major infrastructure projects.",
            "workWithUs.collaborations.cta": "View Partnership Portfolio",

            "workWithUs.investment.title": "Investment Opportunities",
            "workWithUs.investment.subtitle": "Strategic Avenues for Private Sector Investment",
            "workWithUs.investment.desc": "KW&SC offers high-impact investment opportunities in vital city infrastructure. Focus areas include the development of Build-Operate-Transfer (BOT) and Public-Private Partnership (PPP) models for wastewater treatment, bulk water transportation, and smart metering systems.",
            "workWithUs.investment.cta": "Explore Investment Models",

            "workWithUs.hero.title": "Ready To Initiate With Us?",
            "workWithUs.hero.desc": "Our team is prepared to receive your proposal for licensing, collaboration, or critical investment. Contact us to schedule a strategic dialogue.",
            "workWithUs.hero.cta": "Get In Touch",
            "workWithUs.keyFocus": "Key Focus Areas:",
        },
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
            "settings.sindhi": "سندھی",

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
            "tenders.viewMore": "مزید دیکھیں",
            "tenders.hideDetails": "تفصیلات چھپائیں",

            // Work With Us
            "workWithUs.licenses.title": "لائسنسنگ اور پرمٹ",
            "workWithUs.licenses.subtitle": "پانی اور سیوریج آپریشنز کے لیے ریگولیٹری فریم ورک",
            "workWithUs.licenses.desc": "KW&SC بلک پانی کے استعمال، کمرشل پانی کے کنکشن، ہائیڈرینٹ آپریشنز اور ایفلوئنٹ ڈسچارج کے لیے ضروری لائسنس اور پرمٹ حاصل کرنے کے لیے ایک ہموار عمل فراہم کرتا ہے۔ ہمارا ڈیجیٹل پلیٹ فارم شفافیت اور کارکردگی کو یقینی بناتا ہے۔",
            "workWithUs.licenses.cta": "لائسنس کے لیے درخواست دیں",
            "workWithUs.licenses.pdfCta": "سب سوائل لائسنس پی ڈی ایف دیکھیں",

            "workWithUs.collaborations.title": "قومی اور بین الاقوامی تعاون",
            "workWithUs.collaborations.subtitle": "انفراسٹرکچر ایکسی لینس کے لیے عالمی شراکت داریاں",
            "workWithUs.collaborations.desc": "ہم فعال طور پر قومی اداروں (جیسے پلاننگ کمیشن، لوکل گورنمنٹ) اور بین الاقوامی ترقیاتی بینکوں (جیسے ورلڈ بینک، اے ڈی بی) کے ساتھ تعاون کرتے ہیں۔",
            "workWithUs.collaborations.cta": "شراکت داری کا پورٹ فولیو دیکھیں",

            "workWithUs.investment.title": "سرمایہ کاری کے مواقع",
            "workWithUs.investment.subtitle": "نجی شعبے کی سرمایہ کاری کے لیے اسٹریٹجک راستے",
            "workWithUs.investment.desc": "KW&SC شہر کے اہم انفراسٹرکچر میں اعلی اثر والی سرمایہ کاری کے مواقع پیش کرتا ہے۔ توجہ کے شعبوں میں ویسٹ واٹر ٹریٹمنٹ اور اسمارٹ میٹرنگ شامل ہیں۔",
            "workWithUs.investment.cta": "سرمایہ کاری کے ماڈلز دریافت کریں",

            "workWithUs.hero.title": "ہمارے ساتھ شروعات کرنے کے لیے تیار ہیں؟",
            "workWithUs.hero.desc": "ہماری ٹیم لائسنسنگ، تعاون، یا اہم سرمایہ کاری کے لیے آپ کی تجویز وصول کرنے کے لیے تیار ہے۔ اسٹریٹجک ڈائیلاگ شیڈول کرنے کے لیے ہم سے رابطہ کریں۔",
            "workWithUs.hero.cta": "رابطہ کریں",
            "workWithUs.keyFocus": "اہم توجہ کے شعبے:",
        },
    },
    sd: {
        translation: {
            // Navigation
            "nav.home": "گہر",
            "nav.about": "اسان جي باري ۾",
            "nav.services": "خدمتون",
            "nav.projects": "منصوبا",
            "nav.careers": "ڪيريئر",
            "nav.contact": "رابطو",
            "nav.media": "ميڊيا",
            "nav.rti": "RTI",
            "nav.tenders": "ٽينڊرز",
            "nav.education": "تعليم",
            "nav.search": "ڳولا...",
            "nav.whatWeDo": "اسان ڇا ڪريون ٿا",
            "nav.ourHeritage": "اسان جو ورثو",
            "nav.waterToday": "اڄ جو پاڻي",
            "nav.achievements": "ڪاميابيون",
            "nav.ourLeadership": "اسان جي قيادت",
            "nav.faqs": "سوالات",
            "nav.workWithUs": "اسان سان گڏ ڪم ڪريو",
            "nav.newsUpdates": "خبرون ۽ تازه ڪاريون",
            "nav.rightToInformation": "معلومات جو حق",
            "nav.allProjects": "تمام منصوبا",

            // Hero Section
            "hero.eyebrow": "ڪراچي واٽر اينڊ سيوريج ڪارپوريشن",
            "hero.title": "پهچائڻ لاء پرعزم",
            "hero.subtitle": "ڪراچي لاء صاف ۽ محفوظ پاڻي جي فراهمي ۽ موثر سيوريج خدمتن کي يقيني بڻائڻ.",
            "hero.cta": "KW&SC جي باري ۾ ڄاڻو",

            // Page Heroes
            "hero.tenders.title": "ٽينڊرز",
            "hero.tenders.subtitle": "سرڪاري ٽينڊر نوٽيس ۽ KW&SC جي پگهارن ۽ خدمتن لاء خريداري جا موقعا.",
            "hero.careers.title": "KW&SC ۾ ڪيريئر",
            "hero.careers.subtitle": "ڪراچي کي صاف پاڻي ۽ موثر سيوريج خدمتون فراهم ڪرڻ جي اسان جي مشن ۾ شامل ٿيو.",
            "hero.rti.title": "معلومات جو حق",
            "hero.rti.subtitle": "KW&SC آپريشنز جي باري ۾ سرڪاري دستاويز، فارمز ۽ معلومات تائين رسائي حاصل ڪريو.",

            // Projects
            "projects.title": "اہم منصوبا",
            "projects.subtitle": "وفاقي (PSDP) ۽ صوبائي (ADP) ترقياتي اسڪيمن جي جسماني ۽ مالي اڳڀرائي جو ٽريڪ ڪرڻ.",
            "projects.status": "انفراسٽرڪچر ڊپلوءمينٽ اسٽيٽس",
            "projects.viewArchives": "تاريخي پروجيڪٽ آرڪائيو ڏسو",

            // Footer
            "footer.about": "KW&SC جي باري ۾",
            "footer.services": "اسان جون خدمتون",
            "footer.quickLinks": "فوري لنڪس",
            "footer.contact": "اسان سان رابطو ڪريو",
            "footer.getInTouch": "رابطي ۾ رهو",
            "footer.quickNavigation": "فوري نيويگيشن",
            "footer.copyright": "© {{year}} KW&SC. جملہ حق محفوظ آهن.",
            "footer.location": "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350, Pakistan",
            "footer.info": "ڪراچي واٽر اينڊ سيوريج ڪارپوريشن (KW&SC) ڪراچي کي قابل اعتماد پاڻي ۽ سيوريج خدمتون فراهم ڪرڻ لاء پرعزم آهي، تمام رهائشن لاء صاف پاڻي ۽ موثر سيوريج انتظام کي يقيني بڻائيندي.",

            // Footer Links
            "footer.links.aboutUs": "اسان جي باري ۾",
            "footer.links.whatWeDo": "اسان ڇا ڪريون ٿا",
            "footer.links.ourProjects": "اسان جا منصوبا",
            "footer.links.careers": "ڪيريئر",
            "footer.links.newsUpdates": "خبرون ۽ تازه ڪاريون",
            "footer.links.contactUs": "اسان سان رابطو ڪريو",
            "footer.stayConnected": "جڙيل رهو",
            "footer.officialPortals": "سرڪاري پورٽلز",
            "footer.complaintSystem": "آن لائن شڪايت سسٽم",
            "footer.tankerBooking": "ٽينڪر بوڪنگ سسٽم",
            "footer.sindhPortal": " سنڌ حڪومت پورٽل",

            // Services
            "services.newConnection": "نئون ڪنيڪشن",
            "services.eComplaint": "اي-شڪايت",
            "services.bookTanker": "ٽينڪر بوڪنگ",
            "services.getYourBill": "پنهنجو بل حاصل ڪريو",
            "services.kwscAssistant": "KWSC اسسٽنٽ",
            "services.assistantGreeting": "هيلو! مان KWSC اسسٽنٽ آهيان. اڄ مان توهان جي ڪيئن مدد ڪري سگهان ٿو؟",

            // Service Tiles (WhoAreWe)
            "services.tiles.complaintManagement.title": "شڪايتي انتظام",
            "services.tiles.complaintManagement.desc": "پاڻي جي فراهمي، سيوريج جي مسئلن، بلنگ جي تضادن، ۽ غير قانوني ڪنيڪشن جي باري ۾ شڪايتون درج ڪريو ۽ ٽريڪ ڪريو.",
            "services.tiles.newConnection.title": "نئون ڪنيڪشن",
            "services.tiles.newConnection.desc": "KW&SC جي سرڪاري پورٽل يا مقامي دفتر جي ذريعي نئين پاڻي يا سيوريج ڪنيڪشن لاء آن لائن درخواست ڏيو.",
            "services.tiles.billGeneration.title": "بل جنريشن",
            "services.tiles.billGeneration.desc": "ڪنهن به وقت پنهنجي صارف نمبر استعمال ڪندي پنهنجي پاڻي ۽ سيوريج جي بلن تائين رسائي حاصل ڪريو، ڏسو ۽ ڊائون لوڊ ڪريو.",
            "services.tiles.onlineTanker.title": "آن لائن ٽينڪر بوڪنگ",
            "services.tiles.onlineTanker.desc": "بروقت وقت پهچائڻ کي يقيني بڻائڻ لاء انهن علائقن لاء آن لائن پاڻي جي ٽينڪر جي درخواست ڪريو جتي پائپ سان پاڻي جي فراهمي نه آهي.",

            // Common
            "loading": "لوڊ ٿي رهيو آهي...",
            "error": "هڪ غلطي پيش آئي",
            "readMore": "وڌيڪ پڙهو",
            "updated": "اپ ڊيٽ:",
            "viewDetails": "تفصيل ڏسو",
            "applyNow": "هاڻي اپلائي ڪريو",
            "submit": "جمع ڪرايو",
            "cancel": "منسوخ ڪريو",
            "close": "بند ڪريو",
            "menu": "مينيو",
            "search": "ڳولا",
            "back": "پوئتي",

            // News
            "news.latestNews": "تازه ترين خبرون",
            "news.pressReleases": "پريس ريليز",
            "news.gallery": "گيلري",
            "news.readMore": "وڌيڪ پڙهو",

            // Projects
            "projects.status.completed": "مڪمل",
            "projects.status.ongoing": "جاري",
            "projects.status.inProgress": "جاري",
            "projects.status.planning": "منصوبابندي",
            "projects.status.paused": "روڪيو ويو",
            "projects.viewDetails": "تفصيل ڏسو",
            "projects.physicalProgress": "جسماني ترقي:",
            "projects.loading": "پروجيڪٽ ڊيٽا لوڊ ٿي رهيو آهي...",

            // Careers
            "careers.haveQuestions": "سوال آهن؟",
            "careers.questionsDesc": "جيڪڏهن توهان کي هن ڪردار يا درخواست جي عمل جي باري ۾ ڪو سوال آهي، ته مهرباني ڪري اسان جي HR شعبي سان رابطو ڪريو.",

            // Settings
            "settings.theme": "ٿيم",
            "settings.language": "ٻولي",
            "settings.lightMode": "لائيٽ موڊ",
            "settings.darkMode": "ڊارڪ موڊ",
            "settings.english": "انگريزي",
            "settings.urdu": "اردو",
            "settings.sindhi": "سنڌي",

            // Leadership Fallbacks
            "leadership.vision.title": "اسان جو ويزن",
            "leadership.vision.desc": "هڪ مستقبل جتي ڪراچي کي جديد انفراسٽرڪچر ۽ ترقي پسند قيادت جي ذريعي اڻ رڪاوٽ، صاف ۽ محفوظ پاڻي ملي.",
            "leadership.mission.title": "اسان جو مشن",
            "leadership.mission.desc": "پائيدار آپريشنز، نئين منصوبابندي ۽ ماهر قيادت جي ذريعي موثر پاڻي جي فراهمي ۽ سيوريج خدمتون فراهم ڪرڻ.",
            "leadership.values.title": "بنيادي قدر",
            "leadership.values.desc": "شفافيت، احتساب، جدت ۽ عوامي خدمت KW&SC جي قيادت جي اصولن جو بنياد آهن.",

            // Workflow Fallbacks
            "workflow.step1.title": "بلڪ واٽر سپلائي ۽ ٽريٽمينٽ",
            "workflow.step1.subtitle": "پراڻن ذريعن (سنڌ درياهه، حب ڊيم) مان خام پاڻي جي نيڪال جو انتظام، وڏي پمپنگ سسٽمن جو آپريشن، ۽ پوري ميٽروپوليٽن ايريا لاء پاڻي کي پيئڻ جي قابل معيار تائين ٽريٽ ڪرڻ.",
            "workflow.step2.title": "سيوريج انفراسٽرڪچر مينجمينٽ",
            "workflow.step2.subtitle": "سيوريج ڪليڪٽرز، ٽرنڪ مينز، لفٽنگ/پمپنگ اسٽيشنن جي وڏي نيٽ ورڪ جي منصوبابندي، آپريشن ۽ ديک ڀال، ۽ گندو پاڻي ۽ صنعتي نيڪال جي مناسب اخراج ۽ ٽريٽمينٽ کي يقيني بڻائڻ.",
            "workflow.step3.title": "ڊسٽريبيوشن ۽ نيٽ ورڪ جي سالميت",
            "workflow.step3.subtitle": "حتمي ڊسٽريبيوشن نيٽ ورڪ، پائپ لائنز ۽ بلڪ ٽرانسفر مينز جو انتظام؛ ليڪ جي تشخيص، اثاثن جي بحالي ۽ غير قانوني ڪنيڪشن کي گهٽائڻ جي ذريعي غير آمدني وارو پاڻي (NRW) کي گهٽائڻ تي ڌيان ڏيڻ.",
            "workflow.step4.title": "ريوينيو، ڪسٽمر ۽ گورننس",
            "workflow.step4.subtitle": "درست ميٽرنگ، بلنگ ۽ ريوينيو جي وصولي جي ذريعي مالي استحڪام کي يقيني بڻائڻ. هي ڪردار ڪسٽمر جي شڪايتن جي موثر حل ۽ ادارتي گورننس جي معيارن کي برقرار رکڻ سڀ شامل آهي.",

            // Education Fallbacks
            "education.waterConservation.title": "پاڻي جي بچت جا سبق",
            "education.waterConservation.desc": "گهريلو پاڻي جي استعمال کي گهٽائڻ، ليڪ جو جلد پتو لڳائڻ ۽ فڪسچر کي موثر طريقي سان استعمال ڪرڻ جا عملي مشورا.",
            "education.drinkingWater.title": "پيئڻ جي محفوظ پاڻي جو گائيڊ",
            "education.drinkingWater.desc": "ڄاڻو ته KW&SC پاڻي جي معيار جو علاج ۽ نگراني ڪيئن ڪري ٿو، ۽ توهان گهر تي پيئڻ جي پاڻي کي محفوظ طريقي سان ڪيئن ذخيرو ۽ سنڀال ڪري سگهو ٿا.",
            "education.sewerage.title": "سيوريج جا ڊوز ۽ ڊونٽس",
            "education.sewerage.desc": "ڇا فلش يا ڊرين نه ڪريو، ۽ ڪيئن مناسب ڊسپوزل بلاڪيج، اوور فلو ۽ ماحولياتي نقصان کان بچڻ ۾ مدد ڪري ٿو.",
            "education.emergency.title": "هنگامي تياري",
            "education.emergency.desc": "پاڻي جي فراهمي ۾ رڪاوٽن جي لاء پنهنجي گهر وارن کي تيار ڪرڻ جا قدم، بشمول محفوظ ذخيرو، حفظان صحت ۽ ٽينڪر ڪوآرڊينيشن.",

            // Tenders
            "tenders.open": "کليل ٽينڊرز",
            "tenders.closed": "بند ٽينڊرز",
            "tenders.cancelled": "منسوخ ٿيل ٽينڊرز",
            "tenders.search": "کليل ٽينڊرز ڳوليو ۽ فلٽر ڪريو",
            "tenders.searchPlaceholder": "عنوان/تفصيل جي ذريعي ڳوليو",
            "tenders.filterByType": "قسم جي لحاظ کان فلٽر ڪريو",
            "tenders.dueDate": "آخري تاريخ:",
            "tenders.closedDate": "بند/منسوخ ٿيڻ جي تاريخ:",
            "tenders.download": "دستاويز ڊائون لوڊ ڪريو",
            "tenders.noOpen": "ڪو به کليل ٽينڊر توهان جي موجوده ڳولا جي معيار سان مطابقت نٿو رکي.",
            "tenders.noClosed": "ڪو بند ٽينڊر نه مليو.",
            "tenders.noCancelled": "ڪو منسوخ ٿيل ٽينڊر نه مليو.",
            "tenders.viewMore": "وڌيڪ ڏسو",
            "tenders.hideDetails": "تفصيل لڪايو",

            // Work With Us
            "workWithUs.licenses.title": "لائسنسنگ ۽ پرمٽ",
            "workWithUs.licenses.subtitle": "پاڻي ۽ سيوريج آپريشنز لاء ريگيوليٽري فريم ورڪ",
            "workWithUs.licenses.desc": "KW&SC بلڪ پاڻي جي استعمال، ڪمرشل پاڻي جي ڪنيڪشن، هائيڊرينٽ آپريشنز ۽ ايفلوئنٽ ڊسچارج لاء ضروري لائسنس ۽ پرمٽ حاصل ڪرڻ لاء هڪ گڏيل عمل فراهم ڪري ٿو. اسان جو ڊجيٽل پليٽ فارم شفافيت ۽ ڪارڪردگي کي يقيني بڻائي ٿو.",
            "workWithUs.licenses.cta": "لائسنس لاء درخواست ڏيو",
            "workWithUs.licenses.pdfCta": "سب سوائل لائسنس پي ڊي ايف ڏسو",

            "workWithUs.collaborations.title": "قومي ۽ بين الاقوامي تعاون",
            "workWithUs.collaborations.subtitle": "انفراسٽرڪچر ايڪسي لينس لاء عالمي شراڪتداريون",
            "workWithUs.collaborations.desc": "اسان فعال طور تي قومي ادارن (جهڙوڪ پلاننگ ڪميشن، لوڪل گورنمينٽ) ۽ بين الاقوامي ترقياتي بئنڪن (جهڙوڪ ورلڊ بينڪ، اي ڊي بي) سان تعاون ڪريون ٿا.",
            "workWithUs.collaborations.cta": "شراڪتداري جو پورٽ فوليو ڏسو",

            "workWithUs.investment.title": "سيڙپڪاري جا موقعا",
            "workWithUs.investment.subtitle": "نجي شعبي جي سيڙپڪاري لاء اسٽريٽجڪ رستا",
            "workWithUs.investment.desc": "KW&SC شهر جي اهم انفراسٽرڪچر ۾ اعلي اثر واري سيڙپڪاري جا موقعا پيش ڪري ٿو. ڌيان جي شعبن ۾ ويسٽ واٽر ٽريٽمينٽ ۽ سمارٽ ميٽرنگ شامل آهن.",
            "workWithUs.investment.cta": "سيڙپڪاري جا ماڊلز دريافت ڪريو",

            "workWithUs.hero.title": "اسان سان شروعات ڪرڻ لاء تيار؟",
            "workWithUs.hero.desc": "اسان جي ٽيم لائسنسنگ، تعاون، يا اهم سيڙپڪاري لاء توهان جي تجويز وصول ڪرڻ لاء تيار آهي. اسٽريٽجڪ ڊائلاگ شيڊول ڪرڻ لاء اسان سان رابطو ڪريو.",
            "workWithUs.hero.cta": "رابطو ڪريو",
            "workWithUs.keyFocus": "اهم ڌيان جا علائقا:",
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