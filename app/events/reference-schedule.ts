import type { EventType, InspirationDirection } from "./event-catalog.ts";
import { profileForDirection } from "./design-profiles.ts";

export type ReferenceBuildItem = {
  zone: string;
  item: string;
  quantity: number;
  measurement: string;
  note: string;
};

export type ReferenceScheduleItem = ReferenceBuildItem & { spare: number; totalQuantity: number };

export const normalizeGuestCount = (direction: InspirationDirection, value: number): number => {
  const profile = profileForDirection(direction);
  return Math.min(profile.maxGuests, Math.max(profile.minGuests, Math.round(Number.isFinite(value) ? value : profile.referenceGuests)));
};

export const normalizeReserve = (value: number): number => [0, 5, 10, 15].includes(value) ? value : 10;

export const referenceSchedule = (event: EventType, direction: InspirationDirection, guestCount: number, reservePercent = 10): ReferenceScheduleItem[] => {
  const profile = profileForDirection(direction);
  const guests = normalizeGuestCount(direction, guestCount);
  const reserve = normalizeReserve(reservePercent);
  const diningTables = Math.max(1, Math.ceil(guests / 10));
  const loungeSets = Math.max(1, Math.ceil(guests / 60));
  const floralPieces = Math.max(3, Math.ceil(diningTables * 0.7));
  const lightPieces = Math.max(18, diningTables * 5);
  const outdoor = profile.setting !== "Indoor";
  const compact = profile.format !== "standard" && profile.format !== "ceremony";
  const title = event.title.toLowerCase();
  const isPerformance = /concert|music festival|theatre|opera|dance recital|comedy|screening|fashion show|talent show|storytelling|poetry/.test(title);
  const isExpo = /trade show|expo|science fair|open house/.test(title);
  const isConference = /conference|convention|symposium|seminar|workshop|agm|shareholder|association meeting/.test(title) && !/worship/.test(title);
  const isGallery = /art exhibition|gallery opening|book launch/.test(title);
  const isGaming = /esports|gaming tournament/.test(title);
  const isSport = !isGaming && event.category === "Sport & wellness" && !/awards banquet|retreat/.test(title);
  const isPublicFestival = event.category === "Community & civic" && /street|festival|market|fair|block party|picnic/.test(title);
  const isCeremony = /ceremony|elopement|proposal|christening|baptism|communion|confirmation|memorial|wake|worship|bar or bat mitzvah/.test(title);

  const banquet: ReferenceBuildItem[] = [
    { zone: "Feature", item: "Grounded floral / botanical compositions", quantity: floralPieces, measurement: "24–48 in W × 20–42 in H / 61–122 × 51–107 cm", note: "Recipe and substitutions follow season, culture and venue rules" },
    { zone: "Dining", item: "72-inch round guest tables", quantity: diningTables, measurement: "72 in Ø × 30 in H / 1.83 × 0.76 m", note: "Reference seating at 10 guests per table" },
    { zone: "Dining", item: "Guest chairs", quantity: guests, measurement: "18 in W × 36 in H / 46 × 91 cm", note: "Final chair family follows venue inventory and access" },
    { zone: "Dining", item: "Floor-length table linen", quantity: diningTables, measurement: "132 in round / 3.35 m round", note: "Pressed on site; palette-matched textile" },
    { zone: "Tabletop", item: "Complete styled place setting", quantity: guests, measurement: "5-piece setting with 20 in / 51 cm napkin", note: "Napkin, charger and serviceware specification confirmed with the caterer; spare sets shown separately" },
    { zone: "Lounge", item: "Soft-seating conversation vignette", quantity: loungeSets, measurement: "10 × 8 ft each / 3.05 × 2.44 m", note: "Sofa, two chairs, rug and cocktail tables" },
  ];

  const ceremony: ReferenceBuildItem[] = [
    { zone: "Ceremony", item: "Guest ceremony chairs", quantity: guests, measurement: "18 in W × 36 in H / 46 × 91 cm", note: /reception/.test(title) ? "Assumes chairs can be reset between ceremony and reception; add a separate seating set if both spaces stay dressed" : "Include integrated companion seating; final clear routes and egress reviewed with the venue" },
    { zone: "Aisle", item: "Grounded aisle compositions", quantity: Math.max(6, Math.ceil(guests / 24)), measurement: "18–30 in W × 16–28 in H / 46–76 × 41–71 cm", note: "Kept clear of accessible travel and egress" },
    { zone: "Hospitality", item: "Welcome / remembrance lounge vignette", quantity: loungeSets, measurement: "10 × 8 ft each / 3.05 × 2.44 m", note: "Seating, side tables, textile and restrained botanical layer" },
  ];

  const performance: ReferenceBuildItem[] = [
    { zone: "Stage", item: "Modular performance deck", quantity: 1, measurement: guests > 350 ? "32 × 20 ft × 32 in H / 9.75 × 6.10 × 0.81 m" : "24 × 16 ft × 24 in H / 7.32 × 4.88 × 0.61 m", note: "Guarding, steps and accessible route follow final venue plan" },
    { zone: "Production", item: "Ground-supported lighting / scenic truss bays", quantity: guests > 350 ? 4 : 2, measurement: "10 ft W × 14 ft H / 3.05 × 4.27 m each", note: "Engineer-reviewed ballast and venue-approved power distribution" },
    { zone: "Audience", item: "Audience chairs", quantity: Math.ceil(guests * 0.9), measurement: "20 in W × 34 in H / 51 × 86 cm", note: "Remaining capacity reserved for accessible, standing and technical zones" },
    { zone: "Backstage", item: "Draped artist / speaker support bay", quantity: Math.max(1, Math.ceil(guests / 400)), measurement: "12 × 10 ft / 3.66 × 3.05 m", note: "Opaque flame-rated drape, mirror, table and garment rail" },
    { zone: "Front of house", item: "Technical control position", quantity: 1, measurement: "12 × 8 ft / 3.66 × 2.44 m", note: "Protected sightline for audio, lighting and show control" },
  ];

  const expo: ReferenceBuildItem[] = [
    { zone: "Registration", item: "Accessible welcome / check-in counters", quantity: Math.max(2, Math.ceil(guests / 250)), measurement: "6 ft W × 30–42 in H / 1.83 × 0.76–1.07 m", note: "Includes one lowered accessible position per bank" },
    { zone: "Exhibition", item: "Modular exhibitor / content bays", quantity: Math.max(6, Math.ceil(guests / 35)), measurement: "10 × 10 ft / 3.05 × 3.05 m", note: "Blank brand-ready panels, task light and concealed cable path" },
    { zone: "Program", item: "Talk / demonstration platform", quantity: 1, measurement: "20 × 12 ft × 16 in H / 6.10 × 3.66 × 0.41 m", note: "Accessible approach and clear screen sightlines" },
    { zone: "Networking", item: "Standing conversation clusters", quantity: Math.max(4, Math.ceil(guests / 45)), measurement: "8 × 8 ft each / 2.44 × 2.44 m", note: "Cocktail tables, two stools and a rest perch per cluster" },
    { zone: "Power", item: "Managed floor-power / cable-ramp runs", quantity: Math.max(4, Math.ceil(guests / 80)), measurement: "25 ft / 7.62 m run", note: "Final circuits and loads by venue electrician" },
  ];

  const conference: ReferenceBuildItem[] = [
    { zone: "Registration", item: "Welcome / check-in tables", quantity: Math.max(1, Math.ceil(guests / 150)), measurement: "72 × 30 in / 183 × 76 cm reference", note: "Include a seated service position and clear queue route" },
    { zone: "Audience", item: "Conference audience chairs", quantity: guests, measurement: "Venue seating layout", note: "Allow integrated mobility-device positions, caption sightlines and companion seats" },
    { zone: "Program", item: "Presentation screen and speaker audio package", quantity: 1, measurement: "AV supplier to confirm coverage", note: "Specialist rental; screens, microphone and technical support scaled to the room" },
    { zone: "Program", item: "Speaker lectern / discussion table", quantity: 1, measurement: "Adjustable accessible format", note: "Stage or level presentation area chosen after venue review" },
    { zone: "Breakout", item: "Discussion / refreshment tables", quantity: Math.max(2, Math.ceil(guests / 30)), measurement: "72 × 30 in / 183 × 76 cm reference", note: "Subject to program, catering and floor-plan capacity" },
  ];
  const gallery: ReferenceBuildItem[] = [
    { zone: "Display", item: "Freestanding display easels / plinths", quantity: Math.max(4, Math.ceil(guests / 20)), measurement: "Match approved artwork or book display", note: "Loan/artwork handling and load limits agreed with the host" },
    { zone: "Hospitality", item: "Guest rest chairs", quantity: Math.max(6, Math.ceil(guests / 3)), measurement: "Mixed accessible seating", note: "Adjust to the expected standing/seated program" },
    { zone: "Hospitality", item: "Refreshment / signing tables", quantity: Math.max(2, Math.ceil(guests / 50)), measurement: "72 × 30 in / 183 × 76 cm reference", note: "Include accessible service and signing position" },
  ];

  const sport: ReferenceBuildItem[] = [
    { zone: "Recognition", item: "Awards / photo platform", quantity: 1, measurement: "20 × 12 ft × 16 in H / 6.10 × 3.66 × 0.41 m", note: "Blank scenic face, accessible approach and weather-rated finish" },
    { zone: "Hospitality", item: "Covered team / guest lounge bay", quantity: Math.max(2, Math.ceil(guests / 160)), measurement: "20 × 20 ft / 6.10 × 6.10 m", note: "Open-sided weather canopy with engineered ballast" },
    { zone: "Route", item: "Weighted route barrier sections", quantity: Math.max(12, Math.ceil(guests / 20)), measurement: "8 ft L × 42 in H / 2.44 × 1.07 m", note: "Continuous accessible gates and emergency breaks shown on plan" },
    { zone: "Recovery", item: "Hydration / rest stations", quantity: compact ? 1 : Math.max(2, Math.ceil(guests / 180)), measurement: "12 × 10 ft / 3.66 × 3.05 m", note: "Shaded counter, waste sorting and accessible rest seating" },
    { zone: "Spectator", item: "Loose hospitality chairs", quantity: Math.max(30, Math.ceil(guests * 0.28)), measurement: "20 in W × 34 in H / 51 × 86 cm", note: "Concentrated at recognition and recovery zones, not the course" },
  ];

  const publicFestival: ReferenceBuildItem[] = [
    { zone: "Program", item: "Covered community program platform", quantity: 1, measurement: "24 × 16 ft × 24 in H / 7.32 × 4.88 × 0.61 m", note: "Weather roof, accessible approach and blank scenic backdrop" },
    { zone: "Public realm", item: "Weighted vendor / activity bays", quantity: Math.max(6, Math.ceil(guests / 75)), measurement: "10 × 10 ft / 3.05 × 3.05 m", note: "Wind-rated canopy, ballast and a minimum 12 ft / 3.66 m public aisle" },
    { zone: "Rest", item: "Accessible seating and shade clusters", quantity: Math.max(3, Math.ceil(guests / 160)), measurement: "14 × 12 ft / 4.27 × 3.66 m", note: "Mixed-height seating with wheelchair companion spaces" },
    { zone: "Route", item: "Pedestrian-control barrier sections", quantity: Math.max(12, Math.ceil(guests / 28)), measurement: "8 ft L × 42 in H / 2.44 × 1.07 m", note: "Emergency breaks and crossings remain visible" },
    { zone: "Waste", item: "Styled waste-sorting stations", quantity: Math.max(3, Math.ceil(guests / 180)), measurement: "6 × 3 ft / 1.83 × 0.91 m", note: "Waste, recycling and organics with blank changeable headers" },
  ];

  const smallDining: ReferenceBuildItem[] = [
    { zone: "Dining", item: "Existing or rented dining tables", quantity: Math.ceil(guests / 6), measurement: "Reference 72 × 36 in / 183 × 91 cm", note: "Reuse household furniture where dimensions allow; keep doors and circulation clear" },
    { zone: "Dining", item: "Guest dining chairs", quantity: guests, measurement: "Match the confirmed dining table", note: "Include comfortable upright seating and companion positions" },
    { zone: "Tabletop", item: "Place settings and napkins", quantity: guests, measurement: "One service set per guest", note: "Caterer confirms food-service pieces; spares calculated separately" },
  ];
  const quietLounge: ReferenceBuildItem[] = [
    { zone: "Quiet space", item: "Individual supportive lounge chairs", quantity: guests, measurement: "Mixed seating heights; venue layout", note: "Concurrent lounge users, not total attendance; agree seating preferences with guests" },
    { zone: "Quiet space", item: "Stable side tables", quantity: Math.ceil(guests / 2), measurement: "Approx. 18–24 in / 46–61 cm wide", note: "Keep reachable from seating without narrowing routes" },
    { zone: "Lighting", item: "Dimmable steady-output lamps", quantity: 2, measurement: "Venue-approved low-glare fittings", note: "No flash, colour chase, scent effects or added sound; check individual needs" },
  ];
  const workshop: ReferenceBuildItem[] = [
    { zone: "Workshop", item: "Worktables", quantity: Math.ceil(guests / 4), measurement: "72 × 30 in / 183 × 76 cm reference", note: "Four workspaces per table; adjust reach, clearance and surface height to participants" },
    { zone: "Workshop", item: "Supportive workshop chairs", quantity: guests, measurement: "Match table height", note: "Provide integrated places for mobility devices" },
    { zone: "Workshop", item: "Individual activity kits", quantity: guests, measurement: "One host-approved kit per participant", note: "Activity leader selects tools, age suitability and materials before procurement" },
    { zone: "Protection", item: "Washable table protection", quantity: Math.ceil(guests / 4), measurement: "Cut to confirmed tabletop", note: "Avoid loose edges in travel routes" },
  ];
  const hybridMeeting: ReferenceBuildItem[] = [
    { zone: "Meeting", item: "Modular discussion tables", quantity: Math.ceil(guests / 4), measurement: "72 × 30 in / 183 × 76 cm reference", note: "Open horseshoe or roundtable arrangement with clear screen and camera sightlines" },
    { zone: "Meeting", item: "Meeting chairs", quantity: guests, measurement: "Match venue table height", note: "Integrated companion seating, clear access and camera framing" },
    { zone: "Technology", item: "Screen, camera and speakerphone package", quantity: 1, measurement: "AV provider to confirm room coverage", note: "Includes host laptop connection, captions workflow and remote-participant rehearsal; specialist rental" },
    { zone: "Technology", item: "Cable protection and technical check", quantity: 1, measurement: "Measured cable routes", note: "Venue-approved cable management; test connectivity and audio before arrivals" },
  ];

  const formatItems = profile.format === "small-dining" ? smallDining
    : profile.format === "quiet-lounge" ? quietLounge
    : profile.format === "workshop" ? workshop
    : profile.format === "hybrid-meeting" ? hybridMeeting
    : profile.format === "ceremony" ? (/reception/.test(title) ? [...ceremony, ...banquet.filter((item) => !/Guest chairs|conversation vignette/.test(item.item))] : ceremony)
    : isPerformance
    ? performance
    : isGaming ? [
      { zone: "Gaming", item: "Gaming station tables", quantity: Math.ceil(guests / 4), measurement: "Confirm equipment footprint", note: "Event organiser confirms concurrent players, screens, power and data connections" },
      { zone: "Gaming", item: "Player and spectator chairs", quantity: guests, measurement: "Match venue and station table height", note: "Separate player, technical and spectator circulation" },
      { zone: "Technology", item: "Gaming AV / network package", quantity: 1, measurement: "Specialist event supplier specification", note: "Equipment and network testing are separate from décor procurement" },
    ]
    : isGallery ? gallery
    : isConference ? conference
    : isExpo
      ? expo
      : isSport
        ? sport
        : isPublicFestival
          ? publicFestival
          : isCeremony
            ? (/reception/.test(title) ? [...ceremony, ...banquet.filter((item) => !/Guest chairs|conversation vignette/.test(item.item))] : ceremony)
            : banquet;

  const items: ReferenceBuildItem[] = [
    ...formatItems.map((item) => {
      if (outdoor) return item;
      if (item.item === "Weighted vendor / activity bays") return { ...item, item: "Indoor vendor / activity tables", measurement: "72 × 30 in / 183 × 76 cm reference", note: "Confirm exhibitor count, power and clear aisles; no outdoor canopy assumed" };
      if (item.item === "Covered community program platform") return { ...item, item: "Community presentation area", measurement: "Measured venue floor plan", note: "Level presentation area or specialist platform rental after access review" };
      if (item.item === "Covered team / guest lounge bay") return { ...item, item: "Indoor team / guest rest area", measurement: "Measured venue floor plan", note: "Reuse venue seating and keep circulation clear; no weather canopy assumed" };
      if (item.item === "Accessible seating and shade clusters") return { ...item, item: "Accessible rest seating clusters", note: "Mixed-height seating with integrated companion positions" };
      return item;
    }),
    ...profile.signatureItems.map((item) => ({ ...item, zone: "Design details" })),
    ...(!compact ? [{ zone: "Lighting", item: "Venue-compliant programmable LED lights", quantity: lightPieces, measurement: "6–18 in H / 15–46 cm", note: `Warm-to-neutral output and colour accents calibrated to ${direction.title}` }] : []),
    { zone: "Wayfinding", item: "Blank modular information / photo panel", quantity: compact ? 1 : Math.max(2, Math.ceil(guests / 180)), measurement: "36 × 72 in / 91 × 183 cm", note: "Accessible viewing height; final artwork quoted separately" },
    ...(outdoor ? [{ zone: "Weather", item: "Outdoor weather and installation review", quantity: 1, measurement: "Site-specific specification", note: "A qualified installer determines anchoring, weather thresholds, load limits and shelter; no ballast quantities are prescribed by this reference" }] : []),
    { zone: "Logistics", item: "Installation and strike crew", quantity: compact ? 2 : Math.max(3, Math.ceil(guests / 65)), measurement: "Confirm after venue access review", note: "Final labour follows venue access, loading and curfew" },
  ];
  // Reserve replaceable stock; structural packages and services require a separate reviewed plan.
  return items.map((item) => {
    const serviceOrStructure = /crew|review|portal|backdrop|arch|frame|screen|structure|platform|deck|truss|canopy|barrier|bay|bays|power|package|technical check|technical control|area|cable protection|vignette|clusters|counter/i.test(item.item);
    const spare = serviceOrStructure ? 0 : Math.ceil(item.quantity * reserve / 100);
    return { ...item, spare, totalQuantity: item.quantity + spare };
  });
};

const csvCell = (value: string | number): string => {
  const text = String(value);
  const safe = /^[=+@-]/.test(text) ? `'${text}` : text;
  return `"${safe.replaceAll('"', '""')}"`;
};

export const scheduleCsv = (event: EventType, direction: InspirationDirection, guests: number, reserve = 10): string => {
  const rows: Array<Array<string | number>> = [
    ["Kingsperl concept build sheet", direction.title],
    ["Occasion", event.title],
    ["Reference users / guests", normalizeGuestCount(direction, guests)],
    ["Reserve on replaceable stock (%)", normalizeReserve(reserve)],
    ["Status", "Planning reference only; stock, procurement, engineering and installation require confirmation"],
    ["Zone", "Item", "Base", "Spare", "Total", "Reference measurement", "Planning note"],
    ...referenceSchedule(event, direction, guests, reserve).map((item) => [item.zone, item.item, item.quantity, item.spare, item.totalQuantity, item.measurement, item.note]),
  ];
  return "\uFEFF" + rows.map((row) => row.map(csvCell).join(",")).join("\r\n");
};
