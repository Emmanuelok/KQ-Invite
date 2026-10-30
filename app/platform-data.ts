// Customer-facing reference catalogue and planning estimates only.
// Live stock, replacement costs, warehouse locations, and venue survey records stay in the private operations service.

export type AvailabilityState = "Review required";

export type VenueProfile = {
  id: string;
  name: string;
  room: string;
  location: string;
  status: "Planning reference" | "Survey verified" | "Customer supplied";
  capacity: number;
  widthFt: number;
  lengthFt: number;
  ceilingFt: number;
  access: string;
  loadIn: string;
  power: string;
  restrictions: string[];
  accessibility: string[];
  weatherExposure: "Indoor" | "Sheltered" | "Outdoor";
  lastVerified: string;
};

export type CatalogueItem = {
  sku: string;
  name: string;
  category: "Furniture" | "Textile" | "Floral" | "Lighting" | "Scenic" | "Tabletop" | "Production";
  dimensions: string;
  material: string;
  unit: string;
  rate: number;
  substituteSku?: string;
};

export type DesignTierId = "essential" | "signature" | "statement";

export type DesignTier = {
  id: DesignTierId;
  name: string;
  promise: string;
  scope: string;
  image: string;
  imageAlt: string;
  designFee: number;
  crewSize: number;
  installHours: number;
  zones: string[];
  lines: Array<{
    sku: string;
    formula: "fixed" | "guests" | "tables" | "pairs";
    factor: number;
    zone: string;
    note: string;
  }>;
};

export type StudioBrief = {
  eventType: string;
  date: string;
  guests: number;
  budget: number;
  venueId: string;
  widthFt: number;
  lengthFt: number;
  ceilingFt: number;
  palette: string;
  atmosphere: string;
  culturalContext: string;
  accessibility: string;
  outdoor: boolean;
};

export type BuildLine = {
  sku: string;
  name: string;
  category: CatalogueItem["category"];
  dimensions: string;
  zone: string;
  quantity: number;
  unit: string;
  rate: number;
  total: number;
  availability: AvailabilityState;
  substitute?: string;
  note: string;
};

export type QuoteSummary = {
  rentals: number;
  design: number;
  labour: number;
  logistics: number;
  culturalReview: number;
  subtotal: number;
  hst: number;
  total: number;
  deposit: number;
  balance: number;
};

export type ReadinessTask = {
  id: string;
  category: "Venue" | "Safety" | "Weather" | "Access" | "Commercial";
  label: string;
  detail: string;
  owner: string;
  due: string;
  status: "Ready" | "Action needed" | "Review";
  required: boolean;
};

export const venueProfiles: VenueProfile[] = [
  {
    id: "sjcc-reference",
    name: "St. John’s Convention Centre",
    room: "Ballroom planning reference",
    location: "Downtown St. John’s",
    status: "Planning reference",
    capacity: 420,
    widthFt: 72,
    lengthFt: 104,
    ceilingFt: 20,
    access: "Step-free guest route; final room plan and stage access require venue confirmation.",
    loadIn: "Dedicated production window to be confirmed with venue.",
    power: "Production power plan required before final specification.",
    restrictions: ["Rigging requires venue approval", "Open flame requires written approval", "Protect all exit paths"],
    accessibility: ["Step-free arrival", "Companion seating zones", "Accessible stage route to be confirmed"],
    weatherExposure: "Indoor",
    lastVerified: "Planning reference — survey required",
  },
  {
    id: "harbour-hotel-reference",
    name: "Harbour hotel ballroom",
    room: "Flexible ballroom reference",
    location: "St. John’s waterfront district",
    status: "Planning reference",
    capacity: 260,
    widthFt: 58,
    lengthFt: 84,
    ceilingFt: 13,
    access: "Guest route is step-free; service elevator and door clearances require survey.",
    loadIn: "Timed dock access; protect guest circulation during setup.",
    power: "Two confirmed service circuits plus venue house power review.",
    restrictions: ["No ceiling attachment without approval", "Battery candles preferred", "Quiet strike after 11 p.m."],
    accessibility: ["Step-free entrance", "Accessible washroom path", "Low-sensory rest area available by request"],
    weatherExposure: "Indoor",
    lastVerified: "Planning reference — survey required",
  },
  {
    id: "heritage-hall-reference",
    name: "Heritage gathering hall",
    room: "Timber hall reference",
    location: "Central St. John’s",
    status: "Planning reference",
    capacity: 150,
    widthFt: 42,
    lengthFt: 68,
    ceilingFt: 11,
    access: "Threshold and service-door measurements remain to be confirmed.",
    loadIn: "Street-side timed unloading; compact vehicles recommended.",
    power: "Distributed low-load circuits; lighting load plan required.",
    restrictions: ["No fixings into heritage fabric", "Use freestanding scenic systems", "Maintain 6 ft circulation spine"],
    accessibility: ["Temporary threshold solution may be required", "Wheelchair turning area at reception", "Companion seating protected"],
    weatherExposure: "Indoor",
    lastVerified: "Planning reference — survey required",
  },
  {
    id: "coastal-glasshouse",
    name: "Coastal glasshouse",
    room: "Illustrative venue concept",
    location: "Avalon Peninsula",
    status: "Planning reference",
    capacity: 128,
    widthFt: 40,
    lengthFt: 76,
    ceilingFt: 15,
    access: "Confirm entrance dimensions, service access and a step-free guest route with the venue.",
    loadIn: "Agree delivery windows and surface protection with the venue before production.",
    power: "Ask the venue to confirm electrical supply and any approved temporary-power arrangements.",
    restrictions: ["Confirm attachment permissions", "Review any exterior pieces", "Confirm candlelight rules"],
    accessibility: ["Plan a step-free route", "Review wheelchair turning space", "Confirm accessible seating"],
    weatherExposure: "Sheltered",
    lastVerified: "Illustrative planning reference — survey required",
  },
  {
    id: "custom",
    name: "My venue / private address",
    room: "Customer supplied",
    location: "St. John’s and Avalon Peninsula",
    status: "Customer supplied",
    capacity: 120,
    widthFt: 40,
    lengthFt: 60,
    ceilingFt: 10,
    access: "Add entrance, stairs, elevator and loading notes during the venue survey.",
    loadIn: "Customer to confirm access and operating windows.",
    power: "Electrical requirements need review.",
    restrictions: ["Measurements need verification", "Attachment rules need confirmation", "Emergency route needs confirmation"],
    accessibility: ["Step-free route needs confirmation", "Accessible washroom path needs confirmation"],
    weatherExposure: "Indoor",
    lastVerified: "Not yet surveyed",
  },
];

export const catalogue: CatalogueItem[] = [
  { sku: "TG-CHR-101", name: "Shell ivory dining chair", category: "Furniture", dimensions: "18 × 20 × 35 in", material: "Ash frame · upholstered seat", unit: "chair", rate: 13, substituteSku: "TG-CHR-104" },
  { sku: "TG-CHR-104", name: "Clear architectural chair", category: "Furniture", dimensions: "16 × 19 × 36 in", material: "Optical polycarbonate", unit: "chair", rate: 11, substituteSku: "TG-CHR-101" },
  { sku: "TG-TBL-208", name: "Eight-foot banquet table", category: "Furniture", dimensions: "96 × 30 × 30 in", material: "Birch top · folding steel base", unit: "table", rate: 34 },
  { sku: "TG-TBL-260", name: "Sixty-inch round table", category: "Furniture", dimensions: "60 in diameter × 30 in", material: "Birch top · folding steel base", unit: "table", rate: 36, substituteSku: "TG-TBL-208" },
  { sku: "TG-LIN-312", name: "Shell floor-length linen", category: "Textile", dimensions: "132 in round", material: "Matte woven textile", unit: "linen", rate: 27, substituteSku: "TG-LIN-318" },
  { sku: "TG-LIN-318", name: "Atlantic ink floor-length linen", category: "Textile", dimensions: "132 in round", material: "Textured performance weave", unit: "linen", rate: 31, substituteSku: "TG-LIN-312" },
  { sku: "TG-TOP-401", name: "Refraction place setting", category: "Tabletop", dimensions: "5-piece setting", material: "Glass · stainless · ceramic", unit: "setting", rate: 8.5 },
  { sku: "TG-FLR-510", name: "Meadow compote arrangement", category: "Floral", dimensions: "18–22 in wide", material: "Seasonal floral · reusable vessel", unit: "arrangement", rate: 118, substituteSku: "TG-FLR-514" },
  { sku: "TG-FLR-514", name: "Sculptural foliage arrangement", category: "Floral", dimensions: "24–30 in high", material: "Seasonal foliage · stone vessel", unit: "arrangement", rate: 96, substituteSku: "TG-FLR-510" },
  { sku: "TG-LGT-620", name: "Warm pinspot fixture", category: "Lighting", dimensions: "Compact LED fixture", material: "Black aluminium · 3000K LED", unit: "fixture", rate: 42 },
  { sku: "TG-LGT-630", name: "Enclosed candlelight cluster", category: "Lighting", dimensions: "3 varied-height vessels", material: "Glass · rechargeable LED", unit: "cluster", rate: 24 },
  { sku: "TG-SCN-710", name: "Kingsperl portal", category: "Scenic", dimensions: "8 × 10 ft", material: "Ballasted aluminium · translucent textile", unit: "portal", rate: 485, substituteSku: "TG-SCN-718" },
  { sku: "TG-SCN-718", name: "Freestanding architectural frame", category: "Scenic", dimensions: "8 × 8 ft", material: "Powder-coated aluminium", unit: "frame", rate: 390, substituteSku: "TG-SCN-710" },
  { sku: "TG-TXT-742", name: "Layered ceremony drape", category: "Textile", dimensions: "24 linear ft × 12 ft", material: "IFR voile · weighted base", unit: "set", rate: 340 },
  { sku: "TG-FUR-820", name: "Harbour lounge grouping", category: "Furniture", dimensions: "10 × 12 ft zone", material: "Performance velvet · oak · stone", unit: "grouping", rate: 460 },
  { sku: "TG-PRD-910", name: "Protected distribution kit", category: "Production", dimensions: "2 × 20A distribution", material: "Outdoor-rated cable · GFCI", unit: "kit", rate: 165 },
];

export const designTiers: DesignTier[] = [
  {
    id: "essential",
    name: "Essential",
    promise: "One unforgettable focal story",
    scope: "A strong arrival or ceremony moment, edited tablescape and intentional candlelight.",
    image: "/decor-v2/01-pearl-sage-v2.webp",
    imageAlt: "Shell-and-sage glasshouse event environment",
    designFee: 650,
    crewSize: 3,
    installHours: 4,
    zones: ["Focal moment", "Guest tables", "Candlelight"],
    lines: [
      { sku: "TG-SCN-718", formula: "fixed", factor: 1, zone: "Focal moment", note: "Freestanding; final ballast follows venue survey." },
      { sku: "TG-TXT-742", formula: "fixed", factor: 1, zone: "Focal moment", note: "IFR textile certificate included in production pack." },
      { sku: "TG-FLR-510", formula: "tables", factor: 0.55, zone: "Guest tables", note: "Alternating arrangement rhythm protects the budget." },
      { sku: "TG-LGT-630", formula: "tables", factor: 1, zone: "Guest tables", note: "Enclosed rechargeable light; no open flame." },
    ],
  },
  {
    id: "signature",
    name: "Signature",
    promise: "A cohesive guest journey",
    scope: "Arrival, focal zone, full tablescape, layered floral and a camera-ready lighting treatment.",
    image: "/decor-v2/13-north-star-gala-v2.webp",
    imageAlt: "Cinematic navy and brass gala environment",
    designFee: 1250,
    crewSize: 5,
    installHours: 6,
    zones: ["Arrival", "Focal moment", "Dining", "Lighting"],
    lines: [
      { sku: "TG-SCN-710", formula: "fixed", factor: 1, zone: "Arrival", note: "Primary visual threshold with grounded supports." },
      { sku: "TG-CHR-101", formula: "guests", factor: 1, zone: "Dining", note: "One chair per confirmed guest plus operational spares shown separately." },
      { sku: "TG-TBL-260", formula: "tables", factor: 1, zone: "Dining", note: "Planning assumption: eight guests per table." },
      { sku: "TG-LIN-318", formula: "tables", factor: 1, zone: "Dining", note: "Sized to the specified sixty-inch table." },
      { sku: "TG-TOP-401", formula: "guests", factor: 1, zone: "Dining", note: "Final service pieces coordinate with caterer scope." },
      { sku: "TG-FLR-510", formula: "tables", factor: 1, zone: "Dining", note: "Seasonal recipe; exact varieties confirmed after booking." },
      { sku: "TG-LGT-620", formula: "pairs", factor: 1, zone: "Lighting", note: "Focused light for every two tables." },
      { sku: "TG-LGT-630", formula: "tables", factor: 1, zone: "Dining", note: "Enclosed rechargeable light cluster." },
    ],
  },
  {
    id: "statement",
    name: "Statement",
    promise: "Full environmental transformation",
    scope: "Multiple guest zones, immersive scenic treatment, lounge, layered lighting and complete tabletop styling.",
    image: "/decor-v2/04-winter-chrome-v2.webp",
    imageAlt: "Luminous architectural winter event installation",
    designFee: 2400,
    crewSize: 8,
    installHours: 9,
    zones: ["Arrival", "Focal moment", "Dining", "Lounge", "Lighting"],
    lines: [
      { sku: "TG-SCN-710", formula: "fixed", factor: 2, zone: "Arrival + focal moment", note: "Two linked portals; engineering and ballast review required." },
      { sku: "TG-CHR-104", formula: "guests", factor: 1, zone: "Dining", note: "One chair per confirmed guest." },
      { sku: "TG-TBL-260", formula: "tables", factor: 1, zone: "Dining", note: "Planning assumption: eight guests per table." },
      { sku: "TG-LIN-312", formula: "tables", factor: 1, zone: "Dining", note: "Full-length tailored linen." },
      { sku: "TG-TOP-401", formula: "guests", factor: 1, zone: "Dining", note: "Five-piece place setting." },
      { sku: "TG-FLR-510", formula: "tables", factor: 0.5, zone: "Dining", note: "Alternates with sculptural foliage for visual rhythm." },
      { sku: "TG-FLR-514", formula: "tables", factor: 0.5, zone: "Dining", note: "Alternates with meadow compotes." },
      { sku: "TG-FUR-820", formula: "fixed", factor: 2, zone: "Lounge", note: "Two conversational groupings with clear circulation." },
      { sku: "TG-LGT-620", formula: "tables", factor: 1, zone: "Lighting", note: "One controlled pinspot per table." },
      { sku: "TG-LGT-630", formula: "tables", factor: 1.5, zone: "Dining + lounge", note: "Layered enclosed candlelight." },
      { sku: "TG-PRD-910", formula: "fixed", factor: 2, zone: "Production", note: "Final load and inspection requirements follow venue confirmation." },
    ],
  },
];

export const defaultBrief: StudioBrief = {
  eventType: "Wedding reception",
  date: "2027-06-19",
  guests: 120,
  budget: 10000,
  venueId: "coastal-glasshouse",
  widthFt: 40,
  lengthFt: 76,
  ceilingFt: 15,
  palette: "Atlantic ink · shell · brass",
  atmosphere: "Cinematic, warm and composed",
  culturalContext: "",
  accessibility: "Step-free arrival, companion seating and a quiet rest area",
  outdoor: false,
};

export const money = (value: number) => new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
}).format(value);

const quantityFor = (formula: DesignTier["lines"][number]["formula"], factor: number, guests: number) => {
  if (formula === "guests") return Math.ceil(guests * factor);
  const tables = Math.ceil(guests / 8);
  if (formula === "tables") return Math.max(1, Math.ceil(tables * factor));
  if (formula === "pairs") return Math.max(1, Math.ceil((tables / 2) * factor));
  return Math.max(1, Math.ceil(factor));
};

export function buildLines(tier: DesignTier, guests: number): BuildLine[] {
  return tier.lines.flatMap((definition) => {
    const item = catalogue.find((candidate) => candidate.sku === definition.sku);
    if (!item) return [];
    const quantity = quantityFor(definition.formula, definition.factor, guests);
    const availability: AvailabilityState = "Review required";
    const substitute = item.substituteSku
      ? catalogue.find((candidate) => candidate.sku === item.substituteSku)?.name
      : undefined;
    return [{
      sku: item.sku,
      name: item.name,
      category: item.category,
      dimensions: item.dimensions,
      zone: definition.zone,
      quantity,
      unit: item.unit,
      rate: item.rate,
      total: quantity * item.rate,
      availability,
      substitute,
      note: definition.note,
    }];
  });
}

export function quoteFor(tier: DesignTier, lines: BuildLine[], brief: StudioBrief): QuoteSummary {
  const rentals = lines.reduce((total, line) => total + line.total, 0);
  const design = tier.designFee;
  const labour = tier.crewSize * tier.installHours * 52 * 1.75;
  const logistics = brief.venueId === "coastal-glasshouse" ? 475 : 325;
  const culturalReview = brief.culturalContext.trim() ? 350 : 0;
  const subtotal = rentals + design + labour + logistics + culturalReview;
  const hst = subtotal * 0.15;
  const total = subtotal + hst;
  const deposit = total * 0.3;
  return { rentals, design, labour, logistics, culturalReview, subtotal, hst, total, deposit, balance: total - deposit };
}

export function readinessFor(brief: StudioBrief, venue: VenueProfile, lines: BuildLine[]): ReadinessTask[] {
  const daysUntilEvent = Math.max(0, Math.ceil((new Date(`${brief.date}T12:00:00`).getTime() - Date.now()) / 86_400_000));
  const surveyNeeded = venue.status !== "Survey verified";
  const outdoorConcern = brief.outdoor || venue.weatherExposure !== "Indoor";
  return [
    { id: "venue", category: "Venue", label: "Measured venue plan", detail: surveyNeeded ? "Planning values must be replaced by a measured survey before production approval." : "Surveyed dimensions and access notes are on file.", owner: "Lead designer", due: surveyNeeded ? "Before final proposal" : "Complete", status: surveyNeeded ? "Action needed" : "Ready", required: true },
    { id: "permit", category: "Safety", label: "Permit and venue approval screen", detail: brief.outdoor ? "Outdoor/public-space triggers need review against City requirements and lead times." : "Indoor private-event assumptions recorded; venue rules still apply.", owner: "Producer", due: daysUntilEvent < 60 ? "Review immediately" : "60 business days before", status: brief.outdoor ? "Review" : "Ready", required: brief.outdoor },
    { id: "site-plan", category: "Safety", label: "Scaled site plan and structure review", detail: "Doors, egress, fire lanes, tent or stage engineering, ballast, service zones and attachment methods must match the approved plan.", owner: "Designer + venue", due: "Before final proposal", status: surveyNeeded ? "Action needed" : "Review", required: true },
    { id: "power", category: "Safety", label: "Temporary power and load plan", detail: lines.some((line) => line.category === "Lighting" || line.category === "Production") ? "Circuit map, protection and inspection requirements must be confirmed." : "No significant temporary power load in current scope.", owner: "Production lead", due: "21 days before", status: "Review", required: true },
    { id: "weather", category: "Weather", label: "Atlantic weather contingency", detail: outdoorConcern ? "Indoor fallback, wind threshold, ballast and final weather-call owner are required." : "Interior plan; transport disruption window still monitored.", owner: "Producer", due: outdoorConcern ? "Plan before contract" : "72 hours before", status: outdoorConcern ? "Action needed" : "Ready", required: outdoorConcern },
    { id: "access", category: "Access", label: "Accessible guest journey", detail: brief.accessibility.trim() || "Confirm arrival route, circulation, viewing heights, seating and washroom path.", owner: "Designer + host", due: "Before floor plan approval", status: brief.accessibility.trim() ? "Review" : "Action needed", required: true },
    { id: "inventory", category: "Commercial", label: "Inventory reservation", detail: "The team must confirm date-specific availability, substitutes and any subrentals before reserving inventory.", owner: "Inventory lead", due: "At proposal acceptance", status: "Review", required: true },
    { id: "insurance", category: "Commercial", label: "Insurance, emergency and incident pack", detail: "Track required liability limits, additional insured wording, emergency contacts, first aid, muster point, inspections and incident records.", owner: "Producer", due: "10 days before", status: "Review", required: true },
    { id: "vendors", category: "Commercial", label: "Vendor and temporary-food compliance", detail: "Record third-party credentials, insurance, permits, handwashing, delivery windows and named owners; evidence remains pending until verified.", owner: "Producer", due: "10 days before", status: "Review", required: true },
    { id: "fire", category: "Safety", label: "Flame, scenic and fire-lane gate", detail: "Distinguish enclosed LED candlelight, open flame, cold sparks and fireworks; check venue permission, current bans and required clearances.", owner: "Producer + venue", due: "Before production release", status: lines.some((line) => line.sku === "TG-LGT-630") ? "Ready" : "Review", required: true },
    { id: "traffic", category: "Access", label: "Traffic, parking and load-in plan", detail: "Confirm truck route, timed loading, accessible drop-off, barricades or road/sidewalk closure triggers and guest circulation.", owner: "Logistics lead", due: "21 days before", status: "Review", required: true },
    { id: "noise-waste", category: "Safety", label: "Noise, waste and restoration control", detail: "Record amplified-sound limits, quiet-strike rules, waste streams, pickup ownership, condition photographs and the restoration deadline.", owner: "Producer", due: "14 days before", status: "Review", required: true },
  ];
}
