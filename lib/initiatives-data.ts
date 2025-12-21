export interface Initiative {
  id: string
  name: string
  owner: "Government" | "State" | "Private"
  type: "Policy" | "Funding" | "Incubation" | "Infrastructure"
  status: "Active" | "Inactive"
  launchYear: number
  targetSectors: string[]
  description: string
  focusAreas: string[]
  officialWebsite?: string
  additionalLinks?: { name: string; url: string }[]
}

// Static curated data for Indian startup ecosystem initiatives
export const initiativesData: Initiative[] = [
  {
    id: "startup-india",
    name: "Startup India",
    owner: "Government",
    type: "Policy",
    status: "Active",
    launchYear: 2016,
    targetSectors: ["All Sectors"],
    description: "Comprehensive program to build a strong ecosystem for innovation and entrepreneurship in India, including tax benefits, simplified regulations, and incubation support.",
    focusAreas: ["Tax Benefits", "Regulatory Simplification", "Incubation Support", "Funding Access"],
    officialWebsite: "https://www.startupindia.gov.in",
    additionalLinks: [
      { name: "Startup Recognition", url: "https://www.startupindia.gov.in/persons-of-significant-control-psc" }
    ]
  },
  {
    id: "digital-india",
    name: "Digital India",
    owner: "Government",
    type: "Infrastructure",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Technology", "Digital Services", "E-commerce"],
    description: "National program to transform India into a digitally empowered society and knowledge economy through improved online infrastructure and services.",
    focusAreas: ["Digital Infrastructure", "E-Governance", "Digital Literacy", "Cyber Security"],
    officialWebsite: "https://www.digitalindia.gov.in"
  },
  {
    id: "make-in-india",
    name: "Make in India",
    owner: "Government",
    type: "Policy",
    status: "Active",
    launchYear: 2014,
    targetSectors: ["Manufacturing", "Technology", "Infrastructure"],
    description: "Initiative to transform India into a global manufacturing hub by encouraging companies to manufacture their products within the country.",
    focusAreas: ["Manufacturing Promotion", "Foreign Investment", "Infrastructure Development", "Skill Development"],
    officialWebsite: "https://www.makeinindia.com"
  },
  {
    id: "atmanirbhar-bharat",
    name: "Atmanirbhar Bharat",
    owner: "Government",
    type: "Policy",
    status: "Active",
    launchYear: 2020,
    targetSectors: ["All Sectors"],
    description: "Self-reliant India initiative focusing on strengthening domestic manufacturing, supply chains, and economic resilience.",
    focusAreas: ["Self-Reliance", "Domestic Manufacturing", "Supply Chain Resilience", "Economic Security"],
    officialWebsite: "https://www.makeinindia.com/atmanirbhar-bharat"
  },
  {
    id: "standup-india",
    name: "Stand Up India",
    owner: "Government",
    type: "Funding",
    status: "Active",
    launchYear: 2016,
    targetSectors: ["All Sectors"],
    description: "Scheme to promote entrepreneurship among SC/ST and women entrepreneurs by providing bank loans for setting up greenfield enterprises.",
    focusAreas: ["Women Entrepreneurship", "SC/ST Entrepreneurship", "Bank Credit", "Greenfield Projects"],
    officialWebsite: "https://www.standupmitra.in"
  },
  {
    id: "mudra-yojana",
    name: "PM Mudra Yojana",
    owner: "Government",
    type: "Funding",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Small Business", "Manufacturing", "Services"],
    description: "Pradhan Mantri MUDRA Yojana provides loans up to Rs. 10 lakh to non-corporate, non-farm small/micro enterprises.",
    focusAreas: ["Micro Finance", "Small Enterprises", "Women Empowerment", "Rural Development"],
    officialWebsite: "https://www.mudra.org.in"
  },
  {
    id: "skill-india",
    name: "Skill India",
    owner: "Government",
    type: "Policy",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Education", "Training", "Technology"],
    description: "National skill development mission to create a skilled workforce through vocational training and entrepreneurship development.",
    focusAreas: ["Vocational Training", "Apprenticeship", "Entrepreneurship", "Digital Skills"],
    officialWebsite: "https://www.skillindia.nsdcindia.org"
  },
  {
    id: "smart-cities",
    name: "Smart Cities Mission",
    owner: "Government",
    type: "Infrastructure",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Urban Development", "Technology", "Infrastructure"],
    description: "Mission to develop 100 smart cities across India through integrated urban planning and technology-driven solutions.",
    focusAreas: ["Urban Planning", "IoT Integration", "Sustainable Development", "Digital Governance"],
    officialWebsite: "https://smartcities.gov.in"
  },
  {
    id: "nidhi-prayass",
    name: "NIDHI-PRAYAS",
    owner: "Government",
    type: "Incubation",
    status: "Active",
    launchYear: 2016,
    targetSectors: ["Technology", "Innovation"],
    description: "Program for nurturing ideas and innovations (PRAYAS) to support potential entrepreneurs through grant funding and mentorship.",
    focusAreas: ["Idea Validation", "Prototype Development", "Mentorship", "Grant Funding"],
    officialWebsite: "https://www.nidhi-innovation.org"
  },
  {
    id: "tide-2",
    name: "TIDE 2.0",
    owner: "Government",
    type: "Incubation",
    status: "Active",
    launchYear: 2019,
    targetSectors: ["Technology", "Deep Tech"],
    description: "Technology Incubation and Development of Entrepreneurs (TIDE 2.0) provides incubation support to technology startups.",
    focusAreas: ["Technology Startups", "Deep Tech", "Innovation", "Commercialization"],
    officialWebsite: "https://www.tide2.in"
  },
  {
    id: "startup-maharashtra",
    name: "Startup Maharashtra",
    owner: "State",
    type: "Policy",
    status: "Active",
    launchYear: 2017,
    targetSectors: ["All Sectors"],
    description: "Maharashtra government's initiative to create a conducive ecosystem for startups through policy support and incubation.",
    focusAreas: ["State Policy", "Incubation Centers", "Funding Support", "Mentorship"],
    officialWebsite: "https://startup.maharashtra.gov.in"
  },
  {
    id: "karnataka-startup-policy",
    name: "Karnataka Startup Policy 2015",
    owner: "State",
    type: "Policy",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Technology", "Innovation"],
    description: "Karnataka's comprehensive startup policy offering tax incentives, funding support, and incubation facilities.",
    focusAreas: ["Tax Incentives", "Funding Grants", "Incubation", "Infrastructure Support"],
    officialWebsite: "https://startup.karnataka.gov.in"
  },
  {
    id: "t-hub-hyderabad",
    name: "T-Hub",
    owner: "State",
    type: "Incubation",
    status: "Active",
    launchYear: 2015,
    targetSectors: ["Technology", "AI", "IoT"],
    description: "Telangana government's flagship incubation center providing comprehensive support to tech startups in Hyderabad.",
    focusAreas: ["Technology Incubation", "AI/ML", "IoT", "Mentorship"],
    officialWebsite: "https://t-hub.co"
  },
  {
    id: "nsrcel-iimb",
    name: "NSRCEL",
    owner: "Private",
    type: "Incubation",
    status: "Active",
    launchYear: 2008,
    targetSectors: ["Social Entrepreneurship", "Rural Development"],
    description: "NS Raghavan Centre for Entrepreneurial Learning at IIM Bangalore focuses on social entrepreneurship and rural innovation.",
    focusAreas: ["Social Innovation", "Rural Entrepreneurship", "Social Impact", "Sustainable Development"],
    officialWebsite: "https://www.nsrcel.org"
  },
  {
    id: "sine-iit-bombay",
    name: "SINE",
    owner: "Private",
    type: "Incubation",
    status: "Active",
    launchYear: 2007,
    targetSectors: ["Technology", "Engineering"],
    description: "Society for Innovation and Entrepreneurship at IIT Bombay provides incubation and acceleration support to tech startups.",
    focusAreas: ["Technology Startups", "Engineering Innovation", "IP Protection", "Funding Guidance"],
    officialWebsite: "https://www.sineiitb.org"
  },
  {
    id: "sti-pune",
    name: "STI Pune",
    owner: "Private",
    type: "Incubation",
    status: "Active",
    launchYear: 2007,
    targetSectors: ["Technology", "Innovation"],
    description: "Startup and Technology Incubation Centre at Pune provides comprehensive incubation services to technology startups.",
    focusAreas: ["Technology Incubation", "Mentorship", "Funding Support", "Market Access"],
    officialWebsite: "https://www.stipune.org"
  }
]

// Helper functions for data analysis
export const getInitiativesStats = () => {
  const totalInitiatives = initiativesData.length
  const activeInitiatives = initiativesData.filter(init => init.status === "Active").length
  const governmentInitiatives = initiativesData.filter(init => init.owner === "Government").length
  const privateInitiatives = initiativesData.filter(init => init.owner === "Private").length
  const stateInitiatives = initiativesData.filter(init => init.owner === "State").length

  const allSectors = initiativesData.flatMap(init => init.targetSectors)
  const uniqueSectors = [...new Set(allSectors.filter(sector => sector !== "All Sectors"))]

  return {
    totalInitiatives,
    activeInitiatives,
    governmentInitiatives,
    privateInitiatives,
    stateInitiatives,
    sectorsCovered: uniqueSectors.length
  }
}
