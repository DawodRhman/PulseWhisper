const services = {
  hero: {
    title: "What We Do",
    subtitle: "Comprehensive water and sewerage services ensuring clean water supply and efficient wastewater management for Karachi.",
    backgroundImage: "/teentalwarkarachi.gif"
  },
  cards: [
    { title: "Water Supply Services", description: "Reliable clean water distribution across Karachi.", gradient: "from-blue-100 to-blue-300", iconKey: "FaTint" },
    { title: "Sewerage Management", description: "Efficient wastewater collection and treatment systems.", gradient: "from-cyan-100 to-blue-200", iconKey: "FaWater" },
    { title: "Infrastructure Maintenance", description: "Regular maintenance and upgrade of water infrastructure.", gradient: "from-indigo-100 to-purple-200", iconKey: "FaTools" },
    { title: "Water Quality Testing", description: "Comprehensive water quality monitoring and testing.", gradient: "from-green-100 to-teal-200", iconKey: "FaShieldAlt" },
    { title: "Emergency Services", description: "24/7 emergency water and sewerage services.", gradient: "from-red-100 to-orange-200", iconKey: "FaPhone" },
    { title: "Customer Support", description: "Dedicated customer service and complaint resolution.", gradient: "from-purple-100 to-pink-200", iconKey: "FaCogs" },
    { title: "Water Treatment", description: "Advanced water treatment and purification processes.", gradient: "from-teal-100 to-green-200", iconKey: "FaChartLine" },
    { title: "Billing Services", description: "Convenient online billing and payment systems.", gradient: "from-yellow-100 to-orange-200", iconKey: "FaDatabase" }
  ],
  sections: [
    {
      heading: "Water Supply Services",
      body: "KW&SC sources water from multiple locations including Hub Dam, Keenjhar Lake, and other strategic water sources to ensure adequate supply for Karachi's growing population.",
      bulletPoints: [
        "Hub Dam - Primary water source",
        "Keenjhar Lake - Secondary source",
        "Groundwater extraction",
        "Desalination plants"
      ]
    },
    {
      heading: "Water Filtration Process",
      body: "Our state-of-the-art filtration plants ensure that water meets international quality standards before distribution to consumers.",
      bulletPoints: [
        "Multi-stage filtration process",
        "Chlorination for disinfection",
        "Quality testing laboratories",
        "Continuous monitoring systems"
      ]
    },
    {
      heading: "Sewerage Infrastructure",
      body: "Comprehensive sewerage network covering residential, commercial, and industrial areas across Karachi.",
      bulletPoints: [
        "Extensive sewerage network",
        "Pumping stations",
        "Treatment facilities",
        "Maintenance services"
      ]
    },
    {
      heading: "Sewerage Treatment",
      body: "Advanced treatment plants ensure proper processing of wastewater before disposal, protecting the environment.",
      bulletPoints: [
        "Primary treatment processes",
        "Secondary treatment systems",
        "Tertiary treatment facilities",
        "Environmental compliance"
      ]
    },
    {
      heading: "Revenue Resource Generation",
      body: "Efficient billing system ensuring accurate charges and timely collection of water and sewerage fees.",
      bulletPoints: [
        "Online billing system",
        "Multiple payment options",
        "Automated meter reading",
        "Customer service support"
      ],
      resources: [
        {
          title: "Connection Guidelines",
          description: "Streamlined process for new connections and service modifications.",
          url: "https://www.kwsc.gos.pk/assets/documents/Connection-Guideline-RRG.pdf"
        },
        {
          title: "Bulk Water Map",
          description: "View our comprehensive bulk water distribution network across Karachi.",
          url: "https://www.kwsc.gos.pk/assets/images/Bulk_map.jpeg"
        },
        {
          title: "Distribution Map",
          description: "Explore our water distribution network covering all areas of Karachi.",
          url: "https://www.kwsc.gos.pk/assets/images/Distribution_map.jpeg"
        },
        {
          title: "Sewerage Map",
          description: "View our comprehensive sewerage network and pumping stations across Karachi.",
          url: "https://www.kwsc.gos.pk/assets/images/sewerage-map.jpeg"
        }
      ]
    }
  ]
};

const tenders = {
  hero: {
    title: "Tenders",
    subtitle: "Official tender notices, procurement opportunities, and bidding documents",
    backgroundImage: "/karachicharminar.gif"
  },
  open: [
    {
      tenderNumber: "TND-001",
      title: "Supply of Water Treatment Chemicals",
      date: "2025-08-20",
      description: "KW&SC invites suppliers for the provision of high-grade water treatment chemicals.",
      fullDetails: "This tender includes supply, delivery, and testing of certified water treatment chemicals. Bidders must be registered vendors with relevant experience and ISO certification. Delivery timeline is critical.",
      type: "Procurement",
      downloadLink: "#download-1"
    },
    {
      tenderNumber: "TND-002",
      title: "Pipeline Rehabilitation Works - Zone B",
      date: "2025-08-15",
      description: "Tender for pipeline repair and rehabilitation in designated Zone B.",
      fullDetails: "Rehabilitation includes excavation, replacement of damaged sections (up to 500m total), and pressure testing. All contractors must follow KW&SC engineering standards and have prior municipal work experience.",
      type: "Construction",
      downloadLink: "#download-2"
    },
    {
      tenderNumber: "TND-003",
      title: "IT System Upgrade & Maintenance",
      date: "2025-08-10",
      description: "Upgrade of central billing and customer management software.",
      fullDetails: "Scope includes migration to a new cloud-based system, staff training, and 3 years of post-implementation maintenance support.",
      type: "Services",
      downloadLink: "#download-3"
    },
    {
      tenderNumber: "TND-004",
      title: "Bulk Meter Supply & Installation",
      date: "2025-08-05",
      description: "Procurement and installation of 500 industrial-grade flow meters.",
      fullDetails: "Tender for DN300 to DN600 electromagnetic flow meters. Supply must meet international standards. Installation services are mandatory.",
      type: "Procurement",
      downloadLink: "#download-4"
    },
    {
      tenderNumber: "TND-005",
      title: "Security & Guard Services Contract",
      date: "2025-07-30",
      description: "Contract for armed and unarmed security personnel for all facilities.",
      fullDetails: "Requires a licensed security firm to provide 24/7 coverage for pumping stations, offices, and reservoirs. Must comply with all local security regulations.",
      type: "Services",
      downloadLink: "#download-5"
    },
    {
      tenderNumber: "TND-006",
      title: "Office Stationery and Supplies",
      date: "2025-07-25",
      description: "Annual supply tender for all general office consumables.",
      fullDetails: "Includes paper, printer cartridges, general stationery, and cleaning supplies for a period of 12 months, delivered to 4 main distribution points.",
      type: "Procurement",
      downloadLink: "#download-6"
    },
    {
      tenderNumber: "TND-007",
      title: "Vehicle Fleet Maintenance",
      date: "2025-07-20",
      description: "Maintenance and repair contract for KW&SC's vehicle fleet (light and heavy vehicles).",
      fullDetails: "Scope includes routine servicing, accidental repair, and parts replacement for over 150 vehicles. Bidder must have a fully equipped workshop.",
      type: "Maintenance",
      downloadLink: "#download-7"
    },
    {
      tenderNumber: "TND-008",
      title: "Reservoir Cleaning and Desilting",
      date: "2025-07-15",
      description: "Specialized services for cleaning and desilting two main water reservoirs.",
      fullDetails: "Work must be conducted during scheduled shutdown periods, utilizing non-hazardous methods and adhering to strict environmental guidelines.",
      type: "Construction",
      downloadLink: "#download-8"
    },
    {
      tenderNumber: "TND-009",
      title: "HR Consultancy for Training",
      date: "2025-07-10",
      description: "Consultancy services for staff development and professional training programs.",
      fullDetails: "Design and deliver a series of workshops on modern management techniques and public service ethics for mid-to-senior level staff.",
      type: "Services",
      downloadLink: "#download-9"
    },
    {
      tenderNumber: "TND-010",
      title: "Civil Works for New Office Block",
      date: "2025-07-01",
      description: "Tender for the foundation and structural civil works of a new administrative building.",
      fullDetails: "Phase 1 construction involving site preparation, foundation laying, and erection of the main structure up to the roof slab. Compliance with local building codes is mandatory.",
      type: "Construction",
      downloadLink: "#download-10"
    }
  ],
  closed: [
    {
      tenderNumber: "TND-011",
      title: "Electrical Maintenance Services",
      date: "2025-07-10",
      description: "Closed tender for maintenance of electrical systems across facilities.",
      type: "Maintenance"
    },
    {
      tenderNumber: "TND-012",
      title: "Machinery Equipment Supply",
      date: "2025-06-22",
      description: "Closed tender for industrial machinery procurement.",
      type: "Procurement"
    }
  ],
  cancelled: [
    {
      tenderNumber: "TND-013",
      title: "Drilling Equipment Purchase",
      date: "2025-05-15",
      description: "Tender cancelled due to revised project scope and budgetary constraints.",
      type: "Procurement"
    },
    {
      tenderNumber: "TND-014",
      title: "Water Quality Lab Upgrade",
      date: "2025-04-01",
      description: "Tender cancelled; process will be re-initiated later with new specifications.",
      type: "Construction"
    }
  ]
};

const careers = {
  programs: [
    {
      title: "Recruitment",
      description: "Join KW&SC's team of dedicated professionals working to improve Karachi's essential water and sewerage infrastructure.",
      benefits: [
        "Competitive salary packages",
        "Professional development opportunities",
        "Health insurance benefits",
        "Pension scheme",
        "Career growth prospects"
      ],
      link: "https://www.kwsc.gos.pk/careers#Recruitment",
      type: "Full-time Positions"
    },
    {
      title: "Young Graduate Program",
      description: "Launch your career with KW&SC's comprehensive graduate program designed for fresh, talented engineers and professionals.",
      benefits: [
        "A structured program",
        "Mentorship from senior professionals",
        "Hands-on project experience",
        "Training and skill development",
        "Potential for permanent employment"
      ],
      link: "https://www.kwsc.gos.pk/careers#YoungGraduateProgram",
      type: "Graduate Program"
    },
    {
      title: "Consultancies",
      description: "Partner with KW&SC as an expert consultant to contribute your specialized skills to critical infrastructure projects.",
      benefits: [
        "Project-based assignments",
        "Flexible working arrangements",
        "Competitive consultancy rates",
        "Access to latest technology",
        "Collaboration with industry experts"
      ],
      link: "https://www.kwsc.gos.pk/careers#Consultancies",
      type: "Consulting"
    }
  ],
  openings: [
    { title: "Executive Engineer (Water)", department: "Water Supply Department", location: "Karachi", type: "Full-time", experience: "5+ years" },
    { title: "Executive Engineer (Sewerage)", department: "Sewerage Department", location: "Karachi", type: "Full-time", experience: "5+ years" },
    { title: "Assistant Engineer", department: "Technical Services", location: "Karachi", type: "Full-time", experience: "2+ years" },
    { title: "Graduate Trainee", department: "Various Departments", location: "Karachi", type: "Training Program", experience: "Fresh Graduate" }
  ],
  contacts: [
    { type: "email", label: "info@kwsc.gos.pk", href: "mailto:info@kwsc.gos.pk" },
    { type: "phone", label: "(+92) 021 111 597 200", href: "tel:+92021111597200" }
  ]
};

const contact = {
  hero: {
    title: "Contact KW&SC",
    subtitle:
      "Connect with our customer care, helpline, or regional offices for service requests and operational coordination.",
    backgroundImage: "/teentalwarkarachi.gif",
  },
  channels: [
    {
      label: "KW&SC Helpline",
      description: "24/7 customer facilitation center",
      phone: "(+92) 021 111 597 200",
      availability: "24/7",
    },
    {
      label: "Central Correspondence Cell",
      description: "General inquiries and escalations",
      email: "info@kwsc.gos.pk",
      availability: "Mon–Fri · 9am – 5pm",
    },
    {
      label: "Hydrant & Tanker Management",
      description: "Bulk water booking and tanker dispatch",
      phone: "(+92) 021 992 45157",
      email: "hydrant.cell@kwsc.gos.pk",
      availability: "Daily · 8am – 10pm",
    },
  ],
  offices: [
    {
      label: "Headquarters (Main Office)",
      address: "9th Mile Karsaz, Main Shahrah-e-Faisal, Karachi-75350",
      latitude: 24.8724729779183,
      longitude: 67.09062367500356,
      phone: "(+92) 021 111 597 200",
      email: "info@kwsc.gos.pk",
      hours: "Mon–Fri · 9am – 5pm",
    },
    {
      label: "North Karachi Customer Center",
      address: "Sector 11-A, Near Power House, North Karachi",
      latitude: 24.977464277416358,
      longitude: 67.03051407500588,
      phone: "(+92) 021 992 60001",
      email: "customercare.north@kwsc.pk",
      hours: "Mon–Sat · 9am – 7pm",
    },
    {
      label: "K-IV Project Site Office",
      address: "Super Highway, near Dhabeji Pumping Station, Thatta",
      latitude: 25.32162627745771,
      longitude: 67.57014697501358,
      phone: "(+92) 021 993 30301",
      email: "project.k4@kwsc.pk",
      hours: "Mon–Sat · 8am – 6pm",
    },
    {
      label: "Dhabeji Pumping Station",
      address: "Dhabeji, Thatta District, Sindh, Pakistan",
      latitude: 25.3265,
      longitude: 67.5761,
      phone: "Operations Control Only",
      email: "operations@kwsc.pk",
      hours: "24/7 Operations",
    },
  ],
};

const news = [
  {
    title: "K-IV Project: Phase I Operational Status Confirmed",
    date: "2025-11-15",
    category: "INFRASTRUCTURE",
    summary: "System diagnostics confirm Phase I of the K-IV water supply grid is fully operational, injecting 260 MGD into the primary distribution network. Pressure levels are stable.",
    status: "ONLINE",
    imageUrl: "/media/news/kiv-operational.svg"
  },
  {
    title: "E-Billing Portal V2.0 Deployed",
    date: "2025-10-28",
    category: "DIGITAL SERVICES",
    summary: "The upgraded digital payment gateway is live. New features include real-time consumption analytics, instant ledger updates, and biometric login support for verified consumers.",
    status: "ACTIVE",
    imageUrl: "/media/news/digital-billing.svg"
  },
  {
    title: "Sewerage Network Overhaul: Sector 4 & 7",
    date: "2025-10-10",
    category: "MAINTENANCE",
    summary: "Automated dredging units have been deployed in Lyari and Gadap. Predictive AI modeling suggests a 40% efficiency increase in flow rates post-rehabilitation.",
    status: "IN PROGRESS",
    imageUrl: "/media/news/hydro-testing.svg"
  },
  {
    title: "Industrial Water Conservation Protocol",
    date: "2025-09-22",
    category: "SUSTAINABILITY",
    summary: "Smart metering mandates are now in effect for all industrial zones. Real-time monitoring will detect unauthorized usage patterns and optimize resource allocation.",
    status: "MANDATORY",
    imageUrl: "/media/news/smart-meters.svg"
  },
  {
    title: "Community Outreach: Clean Water Initiative",
    date: "2025-09-01",
    category: "PUBLIC RELATIONS",
    summary: "KW&SC technical teams conducted a seminar on next-gen filtration methods. Attendees were briefed on smart-home leak detection systems and water quality standards.",
    status: "COMPLETED",
    imageUrl: "/media/news/storm-response.svg"
  }
];

const faqs = [
  {
    question: "How can I get a new water connection?",
    answer: "For residential, commercial, bulk, or industrial connections, submit an application with required documents at the nearest KW&SC office. The process includes site inspection, approval, and installation.",
    category: "New Connection"
  },
  {
    question: "How can I get a duplicate bill?",
    answer: "Visit web.kwsb.crdc.biz or the nearest KW&SC office with your account number and CNIC to get a duplicate bill.",
    category: "Billing"
  },
  {
    question: "Where can I complain about sewerage?",
    answer: "Use complain.kwsc.gos.pk or call (+92) 021 111 597 200 to log sewerage complaints.",
    category: "Complaints"
  },
  {
    question: "How can I order a water tanker?",
    answer: "Book through campaign.kwsc.gos.pk or by calling our customer service helpline.",
    category: "Tanker Service"
  },
  {
    question: "How can I report water theft?",
    answer: "Call (+92) 021 111 597 200 or contact the Hydrant Management Cell to report illegal connections.",
    category: "Water Theft"
  }
];

const leadership = {
  managementTeam: [
    { name: "Ahmed Ali Siddiqui", role: "Managing Director", image: "/leaders/salahuddin.svg" },
    { name: "Asadullah Khan", role: "Chief Operating Officer", image: "/leaders/imran.svg" },
    { name: "Muhammad Ali Sheikh", role: "Chief Engineer Water Supply", image: "/leaders/sarah.svg" },
    { name: "Aftab Alam Chandio", role: "Chief Engineer Sewerage", image: "/leaders/bilal.svg" }
  ],
  insights: [
    { title: "Our Vision", description: "A future where Karachi receives uninterrupted, clean, and safe water through modernized infrastructure and progressive leadership." },
    { title: "Our Mission", description: "To provide efficient water supply and sewerage services through sustainable operations, innovative planning, and skilled leadership." },
    { title: "Core Values", description: "Transparency, accountability, innovation, and public service form the foundation of KW&SC’s leadership principles." }
  ]
};

const achievements = [
  { title: "Hydrant Management Cell", description: "Established comprehensive hydrant management system to combat illegal water connections.", icon: "/icon/airdrop.png", year: "2024" },
  { title: "Global Water Summit 2024", description: "Represented Pakistan at the prestigious Global Water Summit in London.", icon: "/icon/people.png", year: "2024" },
  { title: "Rangers Partnership", description: "Joined forces with Pakistan Rangers to combat illegal hydrants and water theft.", icon: "/icon/microphone.png", year: "2024" },
  { title: "Fareeda Salam Center", description: "Established community development center to engage with local communities.", icon: "/icon/user-icon.png", year: "2024" },
  { title: "Grievance Redressal", description: "Introduced comprehensive GRM cell to address customer complaints.", icon: "/icon/clipboar02.svg", year: "2024" },
  { title: "Digital Transformation", description: "Implemented online billing, mobile apps, and automated systems.", icon: "/icon/medal-star.svg", year: "2024" }
];

const projects = [
  {
    code: "PSDP-1",
    title: "K-IV Water Supply Project (Phase-I)",
    category: "Federal PSDP",
    status: "COMPLETED",
    progress: 100,
    scope: "Add 260 MGD of water to the Karachi system, including bulk conveyance, pumping stations, and distribution upgrades.",
    imageUrl: "/media/projects/kiv-phase.svg"
  },
  {
    code: "PSDP-2",
    title: "Dhabeji Pumping Station Rehabilitation",
    category: "Federal PSDP",
    status: "ONGOING",
    progress: 85,
    scope: "Rehabilitation and upgrade of pumping machinery at Dhabeji to ensure optimal transmission capacity and reduced downtime.",
    imageUrl: "/media/projects/dhabeji.svg"
  },
  {
    code: "ADP-1",
    title: "Sewerage System Overhaul (District East)",
    category: "Provincial ADP",
    status: "ONGOING",
    progress: 55,
    scope: "Replacement of damaged sewage lines and construction of new disposal structures in District East.",
    imageUrl: "/media/projects/sewerage-east.svg"
  },
  {
    code: "ADP-2",
    title: "Water Tanker Service Digitization",
    category: "Provincial ADP",
    status: "PLANNING",
    progress: 5,
    scope: "Centralized digital system for managing tanker requests, tracking, and billing to improve transparency.",
    imageUrl: "/media/projects/tanker-digitization.svg"
  },
  {
    code: "ADP-3",
    title: "Gadani Bulk Water Supply Scheme",
    category: "Provincial ADP",
    status: "PAUSED",
    progress: 20,
    scope: "Construction of a new bulk water line to connect Gadani to the main KW&SC network.",
    imageUrl: "/media/projects/gadani-scheme.svg"
  }
];

const counters = [
  { title: "Water Connections", value: 1.2, suffix: "M" },
  { title: "Sewerage Connections", value: 0.8, suffix: "M" },
  { title: "Years of Service", value: 22 },
  { title: "Water Treatment Plants", value: 12 }
];

const workflow = [
  {
    id: "01",
    title: "Bulk Water Supply & Treatment",
    description: "Managing abstraction of raw water, pumping systems, and treatment operations across Karachi.",
    theme: "WATER"
  },
  {
    id: "02",
    title: "Sewerage Infrastructure Management",
    description: "Planning, operating, and maintaining the sewerage network, pumping stations, and treatment of wastewater.",
    theme: "SEWERAGE"
  },
  {
    id: "03",
    title: "Distribution & Network Integrity",
    description: "Managing the distribution network, reducing NRW, and minimizing illegal connections through asset rehabilitation.",
    theme: "DISTRIBUTION"
  },
  {
    id: "04",
    title: "Revenue, Customer & Governance",
    description: "Driving financial sustainability, accurate metering, billing, grievance redressal, and governance.",
    theme: "GOVERNANCE"
  }
];

const mediaLeaders = [
  { name: "Syed Nasir Hussain Shah", title: "Minister LG&HD", imageUrl: "/leaders/salahuddin.svg" },
  { name: "Syed Salahuddin Ahmed", title: "MD KW&SC", imageUrl: "/leaders/imran.svg" },
  { name: "Abdul Jabbar Shah", title: "COO KW&SC", imageUrl: "/leaders/sarah.svg" },
  { name: "Engr. Asadullah Khan", title: "DMD (T/P&D)", imageUrl: "/leaders/bilal.svg" },
  { name: "Dr. Syed Saif ur Rehman", title: "Administrator KMC", imageUrl: "/leaders/ayesha.svg" },
  { name: "Hafiz Muhammad Ilyas", title: "Chief Engineer (Water)", imageUrl: "/leaders/omer.svg" },
  { name: "Naseer Ahmed", title: "Chief Engineer (Sewerage)", imageUrl: "/leaders/maheen.svg" },
  { name: "Muhammad Sohail", title: "Chief Engineer (M&E)", imageUrl: "/leaders/hasan.svg" }
];

const coreValues = [
  { title: "Reliability", description: "Ensuring consistent water supply and efficient sewerage services across Karachi.", icon: "/icon/airdrop.png" },
  { title: "Community Focus", description: "Serving the citizens of Karachi with dedication and commitment to public welfare.", icon: "/icon/people.png" },
  { title: "Transparency", description: "Clear communication and honest reporting at every step of our operations.", icon: "/icon/microphone.png" }
];

const rtiDocuments = [
  {
    title: "Application Form for Groundwater Licence",
    summary: "Official form for groundwater licence applications",
    docType: "Form",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/application-form-for-ground-water-licence.pdf"
  },
  {
    title: "KW&SC Act 2023",
    summary: "Complete text of the Karachi Water and Sewerage Corporation Act 2023",
    docType: "Legal Document",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/KW_SC_Act%2C_2023.pdf"
  },
  {
    title: "Subsoil Extraction Regulations",
    summary: "Regulations governing subsoil extraction activities",
    docType: "Regulation",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/groundwater-Reg-2024.pdf"
  },
  {
    title: "KW&SC Budget Summary 2023-2024",
    summary: "Annual budget summary and financial overview",
    docType: "Financial",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/Budget_summary_2023-2024.pdf"
  },
  {
    title: "Signed Code of Conduct",
    summary: "Official code of conduct document signed by KW&SC",
    docType: "Policy",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/Signed-CoC.pdf"
  },
  {
    title: "Maintenance Works Report",
    summary: "Comprehensive report on maintenance activities",
    docType: "Report",
    externalUrl: "https://www.kwsc.gos.pk/assets/documents/Maintenance_Work.pdf"
  }
];

const socialLinks = [
  { title: "Facebook", platform: "facebook", url: "https://www.facebook.com/kwscofficial" },
  { title: "Twitter", platform: "twitter", url: "https://twitter.com/kwscofficial" },
  { title: "LinkedIn", platform: "linkedin", url: "https://www.linkedin.com/company/kwsc" },
  { title: "YouTube", platform: "youtube", url: "https://www.youtube.com/@kwscofficial" },
  { title: "Instagram", platform: "instagram", url: "https://www.instagram.com/kwscofficial" }
];

module.exports = {
  services,
  tenders,
  careers,
  contact,
  news,
  faqs,
  leadership,
  achievements,
  projects,
  counters,
  workflow,
  mediaLeaders,
  coreValues,
  rtiDocuments,
  socialLinks
};
