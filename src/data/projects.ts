/**
 * The project record.
 *
 * Every engagement below is tagged with the disciplines it drew on. The
 * headline case counts shown on the landing page are derived from these tags
 * at build time, so the numbers can never drift away from the list itself.
 * Edit this file and the counters follow.
 */

export type Discipline = "system" | "app" | "ai";

export type Project = {
  /** Stable identifier, also used as the printed record number. */
  id: string;
  title: string;
  /** The capabilities brought together in the delivered system. */
  capabilities: string[];
  disciplines: Discipline[];
};

export type IndustryGroup = {
  id: string;
  name: string;
  /** A short, plain description of the work carried out in this sector. */
  note: string;
  projects: Project[];
};

export const disciplineLabels: Record<Discipline, string> = {
  system: "System Development",
  app: "App Development",
  ai: "AI Development",
};

export const disciplineShortLabels: Record<Discipline, string> = {
  system: "System",
  app: "App",
  ai: "AI",
};

export const disciplineNotes: Record<Discipline, string> = {
  system:
    "Core business systems, integrations, and the infrastructure underneath them.",
  app: "Web and mobile applications built for the people who use them daily.",
  ai: "Models, pipelines, and language systems put to work in production.",
};

export const disciplineOrder: Discipline[] = ["system", "app", "ai"];

export const industries: IndustryGroup[] = [
  {
    id: "agriculture",
    name: "Agriculture, Forestry, and Fisheries",
    note: "Field operations instrumented end to end, from the greenhouse to the customer’s door.",
    projects: [
      {
        id: "01",
        title: "Smart farm platform",
        capabilities: [
          "Field and crop records",
          "IoT greenhouse monitoring",
          "Harvest forecasting",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "02",
        title: "Crop protection system",
        capabilities: [
          "Drone imagery",
          "Pest and disease detection",
          "Treatment scheduling",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "03",
        title: "Livestock and aquaculture management system",
        capabilities: [
          "IoT health and water-quality monitoring",
          "Breeding records",
          "Traceability",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "04",
        title: "Farm-to-consumer platform",
        capabilities: ["Direct sales", "Shipment planning", "QR code traceability"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "manufacturing",
    name: "Manufacturing",
    note: "Shop-floor systems that stay accurate under real production pressure.",
    projects: [
      {
        id: "05",
        title: "Smart factory platform",
        capabilities: [
          "MES production management",
          "IoT predictive maintenance",
          "Digital twin simulation",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "06",
        title: "Quality assurance system",
        capabilities: [
          "Visual inspection AI",
          "Lot traceability",
          "Quality management system",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "07",
        title: "Supply chain system",
        capabilities: ["Procurement", "Inventory optimization", "Demand forecasting"],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "retail",
    name: "Retail, E-Commerce, and Food Service",
    note: "Storefronts, payments, and back offices kept in step with one another.",
    projects: [
      {
        id: "08",
        title: "Unified commerce platform",
        capabilities: [
          "EC site",
          "PayPay and card payments",
          "Inventory sync across Shopify, Rakuten, and Amazon",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "09",
        title: "Customer engagement system",
        capabilities: ["Points and coupons", "LINE integration", "Recommendation engine"],
        disciplines: ["app", "ai"],
      },
      {
        id: "10",
        title: "Market intelligence system",
        capabilities: [
          "Price scraping",
          "Demand forecasting",
          "Counterfeit product detection",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "11",
        title: "Restaurant and salon operations system",
        capabilities: [
          "Reservations",
          "Mobile ordering",
          "Shift and labor-cost management",
        ],
        disciplines: ["app", "system"],
      },
      {
        id: "12",
        title: "Hotel and tourism system",
        capabilities: [
          "Reservation and PMS",
          "Dynamic pricing",
          "Multilingual chatbot",
        ],
        disciplines: ["system", "app", "ai"],
      },
    ],
  },
  {
    id: "healthcare",
    name: "Healthcare and Medical",
    note: "Clinical software built around how departments genuinely work, and audited accordingly.",
    projects: [
      {
        id: "13",
        title: "Hospital clinical platform",
        capabilities: [
          "Electronic medical records",
          "Reception and billing",
          "Clinical department support for nursing, pharmacy, surgery, and emergency care",
        ],
        disciplines: ["system"],
      },
      {
        id: "14",
        title: "AI diagnostic support system",
        capabilities: [
          "Medical imaging AI for lung nodules, stomach cancer, and diabetic retinopathy",
          "Laboratory information system",
          "Clinical trial data",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "15",
        title: "Telemedicine system",
        capabilities: [
          "Online consultation",
          "E-prescriptions",
          "Pharmacy medication history",
        ],
        disciplines: ["app", "system"],
      },
      {
        id: "16",
        title: "Preventive health app",
        capabilities: [
          "Health checkups",
          "Lifestyle-disease management",
          "Wearable data",
        ],
        disciplines: ["app", "ai"],
      },
    ],
  },
  {
    id: "care",
    name: "Nursing Care and Welfare",
    note: "Tools designed for busy hands and short moments, not for desks.",
    projects: [
      {
        id: "17",
        title: "Nursing home platform",
        capabilities: ["Care records", "Care plans", "Sensor-based elderly monitoring"],
        disciplines: ["system", "ai"],
      },
      {
        id: "18",
        title: "Home-care operations system",
        capabilities: ["Visit scheduling", "Route optimization", "Family notifications"],
        disciplines: ["system", "app"],
      },
      {
        id: "19",
        title: "Accessibility and companionship service",
        capabilities: [
          "Speech recognition",
          "Text-to-speech",
          "AI conversation for elderly and disabled users",
        ],
        disciplines: ["ai", "app"],
      },
      {
        id: "20",
        title: "Child care center system",
        capabilities: ["Attendance", "Parent contact", "Billing"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "government",
    name: "Government and Public Services",
    note: "Public-facing services held to accessibility, security, and procurement requirements.",
    projects: [
      {
        id: "21",
        title: "Digital municipality platform",
        capabilities: [
          "Online applications",
          "My Number Card authentication",
          "Resident and tax management",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "22",
        title: "Disaster response system",
        capabilities: [
          "Earthquake, typhoon, and flood alerts",
          "Evacuation guidance",
          "Shelter management",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "23",
        title: "Public facility system",
        capabilities: ["Reservations", "Payments", "Usage analytics"],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "education",
    name: "Education",
    note: "Platforms introduced alongside teaching staff rather than imposed on them.",
    projects: [
      {
        id: "24",
        title: "AI learning platform",
        capabilities: ["LMS", "AI tutoring", "Automated grading"],
        disciplines: ["ai", "system"],
      },
      {
        id: "25",
        title: "Language learning system",
        capabilities: [
          "Japanese speech evaluation",
          "Video lectures",
          "Progress tracking",
        ],
        disciplines: ["ai", "app"],
      },
      {
        id: "26",
        title: "School and cram school operations system",
        capabilities: [
          "Grades and attendance",
          "Parent communication",
          "Tuition billing",
        ],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "finance",
    name: "Finance and Insurance",
    note: "Regulated work, documented so it survives an external review.",
    projects: [
      {
        id: "27",
        title: "Risk management platform",
        capabilities: [
          "Credit scoring",
          "Fraud detection",
          "Anti-money laundering monitoring",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "28",
        title: "Insurance automation system",
        capabilities: ["Claims processing", "Underwriting", "OCR document intake"],
        disciplines: ["ai", "system"],
      },
      {
        id: "29",
        title: "Payment and accounting system",
        capabilities: [
          "QR and mobile payments",
          "freee, Money Forward, and Yayoi integration",
        ],
        disciplines: ["system", "app"],
      },
    ],
  },
  {
    id: "logistics",
    name: "Logistics, Transportation, and Mobility",
    note: "Plans that hold up once real drivers, real traffic, and real loads are involved.",
    projects: [
      {
        id: "30",
        title: "Smart logistics platform",
        capabilities: [
          "Warehouse management",
          "Delivery route optimization",
          "Driver dispatch",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "31",
        title: "Fleet and mobility system",
        capabilities: [
          "Vehicle inspection and maintenance",
          "Car-sharing",
          "Parking management",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "32",
        title: "Traffic intelligence system",
        capabilities: [
          "Congestion prediction",
          "Signal control",
          "Public transit timetables",
        ],
        disciplines: ["ai", "system"],
      },
    ],
  },
  {
    id: "property",
    name: "Real Estate and Construction",
    note: "Contracts, sites, and buildings brought into one reliable record.",
    projects: [
      {
        id: "33",
        title: "Property management platform",
        capabilities: [
          "Listings",
          "Contracts with electronic signatures",
          "Rent collection",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "34",
        title: "Construction management system",
        capabilities: ["Progress tracking", "BIM/CIM models", "Drone surveying"],
        disciplines: ["system", "ai"],
      },
      {
        id: "35",
        title: "Smart building system",
        capabilities: [
          "Facility management",
          "Energy monitoring",
          "Predictive maintenance",
        ],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "energy",
    name: "Energy and Environment",
    note: "Measurement first, then forecasting, then reporting that stands up to scrutiny.",
    projects: [
      {
        id: "36",
        title: "Energy management platform",
        capabilities: [
          "Smart meters",
          "Solar and wind forecasting",
          "Building EMS",
        ],
        disciplines: ["system", "ai"],
      },
      {
        id: "37",
        title: "Environmental monitoring system",
        capabilities: [
          "Air and water quality sensors",
          "Carbon emission reporting",
          "Waste and recycling routes",
        ],
        disciplines: ["system", "ai"],
      },
    ],
  },
  {
    id: "operations",
    name: "Business Administration",
    note: "The quiet internal work that gives a company back its hours.",
    projects: [
      {
        id: "38",
        title: "Back-office automation suite",
        capabilities: [
          "OCR for invoices and receipts",
          "Qualified Invoice System support",
          "RPA",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "39",
        title: "HR and workforce system",
        capabilities: [
          "Attendance",
          "Shift management",
          "Payroll and social insurance compliance",
        ],
        disciplines: ["system", "app"],
      },
      {
        id: "40",
        title: "Recruitment platform",
        capabilities: ["AI resume screening", "Job matching", "Applicant tracking"],
        disciplines: ["ai", "system"],
      },
      {
        id: "41",
        title: "Sales and customer support hub",
        capabilities: [
          "CRM and SFA",
          "LINE and OpenAI chatbot",
          "FAQ knowledge base",
        ],
        disciplines: ["system", "ai", "app"],
      },
      {
        id: "42",
        title: "Meeting and knowledge system",
        capabilities: [
          "Whisper and GPT transcription",
          "Minutes generation",
          "Internal document search with RAG",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "43",
        title: "Approval and document system",
        capabilities: [
          "Electronic workflows",
          "Document management",
          "Full-text search",
        ],
        disciplines: ["system"],
      },
    ],
  },
  {
    id: "media",
    name: "Media, Entertainment, and Sports",
    note: "High-traffic products where a campaign spike is the ordinary case.",
    projects: [
      {
        id: "44",
        title: "Sports and racing analytics platform",
        capabilities: [
          "Data scraping in PHP or Python",
          "Statistics",
          "Race prediction with odds tracking",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "45",
        title: "Campaign and loyalty system",
        capabilities: [
          "Lottery and prize campaigns",
          "Points and coupons",
          "LINE and app integration",
        ],
        disciplines: ["app", "system"],
      },
      {
        id: "46",
        title: "Fan and event platform",
        capabilities: ["Ticketing", "Membership community", "Content streaming"],
        disciplines: ["app", "system"],
      },
      {
        id: "47",
        title: "Creator support system",
        capabilities: [
          "Generative AI for anime, manga, and illustration",
          "Copyright and asset management",
        ],
        disciplines: ["ai", "app"],
      },
    ],
  },
  {
    id: "security",
    name: "Security and Infrastructure",
    note: "The layer that has to keep working on the day everything else does not.",
    projects: [
      {
        id: "48",
        title: "Security operations platform",
        capabilities: ["AI anomaly detection", "Log analysis", "Network monitoring"],
        disciplines: ["ai", "system"],
      },
      {
        id: "49",
        title: "Identity and access system",
        capabilities: ["Biometrics", "SSO", "Surveillance camera analysis"],
        disciplines: ["system", "ai"],
      },
      {
        id: "50",
        title: "Resilience system",
        capabilities: [
          "Backup",
          "Disaster recovery",
          "Cloud infrastructure management",
        ],
        disciplines: ["system"],
      },
    ],
  },
  {
    id: "research",
    name: "Science, Research, and Cross-Industry AI",
    note: "Research-grade work, held to production standards.",
    projects: [
      {
        id: "51",
        title: "Life science research platform",
        capabilities: [
          "Genome analysis",
          "Drug discovery with machine learning",
          "Clinical data management",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "52",
        title: "Earth observation system",
        capabilities: [
          "Satellite imagery analysis",
          "Weather and climate simulation",
          "Disaster prediction",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "53",
        title: "Enterprise AI platform",
        capabilities: [
          "LLM with RAG knowledge search",
          "IoT data collection and visualization",
          "Workflow automation",
        ],
        disciplines: ["ai", "system"],
      },
      {
        id: "54",
        title: "Robotics platform",
        capabilities: [
          "Communication robots",
          "Nursing-care robots",
          "Speech and vision AI",
        ],
        disciplines: ["ai", "system"],
      },
    ],
  },
];

export const allProjects: Project[] = industries.flatMap((group) => group.projects);

/** Number of engagements that drew on each discipline. */
export const caseCounts: Record<Discipline, number> = disciplineOrder.reduce(
  (counts, discipline) => {
    counts[discipline] = allProjects.filter((project) =>
      project.disciplines.includes(discipline),
    ).length;
    return counts;
  },
  {} as Record<Discipline, number>,
);

export const totalProjects = allProjects.length;
export const totalIndustries = industries.length;

/** Renders a capability list as a sentence, e.g. "A, B, and C". */
export function toSentence(items: string[]): string {
  if (items.length === 0) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}
