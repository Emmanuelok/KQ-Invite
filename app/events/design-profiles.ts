import { events, inspirationDirections, type EventSetting, type InspirationDirection } from "./event-catalog.ts";

/** Proposed design recipes. Dimensions are planning allowances, never surveyed venue measurements. */
export type DesignSignatureItem = {
  item: string;
  quantity: number;
  measurement: string;
  note: string;
};
export type DesignProfile = {
  setting: EventSetting;
  settingLabel: string;
  description: string;
  aliases: string[];
  features: string[];
  materials: string[];
  layoutNote: string;
  weatherPlan: string;
  planningFocus: string;
  occasionIds: string[];
  signatureItems: DesignSignatureItem[];
  format: "standard" | "small-dining" | "quiet-lounge" | "ceremony" | "workshop" | "hybrid-meeting";
  minGuests: number;
  maxGuests: number;
  referenceGuests: number;
  capacityBasis: "event" | "concurrent";
  capacityNote: string;
};

type Recipe = {
  setting?: EventSetting;
  description: string;
  materials: string[];
  features: string[];
  layout: string;
  weather?: string;
  focus: string;
  items: DesignSignatureItem[];
  occasions?: RegExp;
  format?: DesignProfile["format"];
  capacity?: [number, number, number];
  concurrent?: boolean;
};

const item = (name: string, quantity: number, measurement: string, note: string): DesignSignatureItem => ({ item: name, quantity, measurement, note });
const indoorWeather = "Use a covered load-in route and protect textiles during transfer. Any outdoor arrival moment needs its own weather decision.";
const outdoorWeather = "Agree an indoor fallback and a weather decision time with the venue. A qualified installer specifies structures, anchoring and wind limits for the actual site.";

const recipes: Record<string, Recipe> = {
  "pearl-sage": {
    description: "A pale botanical room composed around natural light, sage foliage and sculptural pearl tones.",
    materials: ["Ivory linen", "Sage foliage", "Matte pearl surfaces"], features: ["Airy botanical focal point", "Low table compositions", "Clear coastal sightlines"],
    layout: "Keep the glazing and sea view open; place the focal composition against a stable interior wall with a clear guest route.", focus: "Daylight, glass reflections and a calm palette.",
    items: [item("Pearl-finish curved scenic panels", 3, "1 m W × 2.4 m H each", "Free-standing footprint and base design to be confirmed"), item("Sage and ivory focal botanical clusters", 4, "0.6–1 m W each", "Fresh or reusable recipe selected after floral review")],
  },
  nocturne: {
    description: "A tailored ballroom concept with dark textiles, warm gold accents and layered points of light.",
    materials: ["Black drape", "Brushed brass", "Warm-white LED candlelight"], features: ["Dark scenic wall", "Gold focal accents", "Layered candlelight"],
    layout: "Keep light sources below guest sightlines at tables and maintain a bright, readable route from entrance to exits.", focus: "Contrast without compromising orientation.",
    items: [item("Black scenic drape bays", 3, "3 m W × 3 m H each", "Venue-approved textile and support system"), item("Brass-look display plinths", 3, "0.4 m W × 0.6–1 m H", "Weighted bases specified for the selected objects"), item("LED candle focal clusters", 6, "3 lights per cluster", "Flameless presentation unless venue explicitly permits flame")],
  },
  "clay-rose": {
    description: "An intimate ceremony direction built from clay tones, soft rose textiles and a small sculptural focal scene.",
    materials: ["Clay-look scenic finish", "Rose gauze", "Ceramic-look vessels"], features: ["Terracotta focal forms", "Soft rose textile", "Grounded floral accents"],
    layout: "Keep the ceremony focal point on floor level and use a compact backdrop that leaves circulation beside it.", focus: "A warm focal moment that fits a smaller room.",
    items: [item("Clay-tone asymmetric scenic forms", 2, "0.9–1.2 m W × 2–2.4 m H", "Painted reusable panels; no unsupported overhead pieces"), item("Rose textile lengths", 2, "4 m L × 1.4 m W", "Drape clear of walking surfaces"), item("Low ceramic-look floral vessels", 3, "0.25–0.4 m H", "Soft edges and stable bases")],
  },
  "winter-chrome": {
    description: "A bright gallery setting with silvery surfaces, translucent details and controlled white light.",
    materials: ["Brushed silver finish", "Frosted acrylic", "White textile"], features: ["Reflective focal panels", "Frosted display forms", "Clean white light"],
    layout: "Angle reflective surfaces away from presentation screens and keep display plinths outside the primary circulation path.", focus: "Glare control and architectural spacing.",
    items: [item("Silver-finish feature panels", 3, "1 m W × 2.4 m H", "Use non-sharp edges and secure panel feet"), item("Frosted acrylic display cubes", 4, "0.4–0.6 m cube", "Display loads checked against supplier specification")],
  },
  "heritage-gold": {
    description: "Contemporary indigo, brass and earth tones form a host-led diaspora celebration with room for personal cultural references.",
    materials: ["Indigo textile", "Brass-look vessels", "Host-selected woven accents"], features: ["Indigo focal wall", "Warm brass accents", "Host-approved textile story"],
    layout: "Reserve a clear central space for the agreed ceremony or programme and keep family seating connected to it.", focus: "Confirm textile provenance and meaning with the host; do not invent ceremonial symbols.",
    items: [item("Indigo fabric feature bays", 3, "2 m W × 2.7 m H", "Textile and support approved by venue"), item("Brass-look botanical vessels", 4, "0.3–0.6 m H", "Grounded feature grouping"), item("Host-selected textile accent panels", 2, "1 m W × 1.5 m H", "Artwork and cultural use approved by the host")],
  },
  afterglow: {
    description: "A private dining scene with wine-red flowers, dusky rose accents and warm pools of table light.",
    materials: ["Burgundy floral tones", "Rose linen", "Amber glass-look vessels"], features: ["Intimate dining focus", "Low floral line", "Warm table glow"],
    layout: "Keep floral pieces low enough for conversation and leave serving access on both sides of the dining arrangement.", focus: "Conversation, service access and flattering light.",
    items: [item("Burgundy and rose focal floral bowls", 3, "0.35–0.5 m W × under 0.3 m H", "Low compositions for conversation"), item("Amber LED votive groups", 6, "3 votives per group", "Protected battery housings and flameless operation")],
  },
  "blue-hour": {
    description: "A loft party direction where cobalt scenic shapes meet amber accents and a deliberate evening-light palette.",
    materials: ["Cobalt scenic paint", "Amber acrylic", "Dark matte metal"], features: ["Cobalt photo scene", "Amber accent light", "Open social floor"],
    layout: "Separate the photo queue from the dance and lounge areas so a single entrance does not become congested.", focus: "Colour balance for faces and cameras.",
    items: [item("Cobalt freestanding scenic fins", 4, "0.6 m W × 2.4 m H", "Stable feet concealed inside scenic footprint"), item("Amber accent display cubes", 3, "0.4–0.6 m cube", "Diffuse any integrated light and protect cabling")],
  },
  "cloud-nine": {
    description: "A soft social-room concept with pale blue, peach and ivory forms for family milestones.",
    materials: ["Pale-blue scenic finish", "Peach textile", "Ivory floral accents"], features: ["Rounded photo backdrop", "Soft pastel palette", "Separate gift display"],
    layout: "Keep the gift display out of the arrival route and allow enough space for family photos beside the backdrop.", focus: "Family movement and a gentle visual tone.",
    items: [item("Pastel rounded backdrop modules", 3, "0.9 m W × 2.1–2.4 m H", "Free-standing modules secured for guest proximity"), item("Ivory gift and cake plinths", 2, "0.5 m W × 0.75–0.9 m H", "Load and food-service suitability confirmed before use")],
  },
  "lavender-tea": {
    description: "A conservatory tea gathering with lavender textiles, butter-yellow details and an airy botanical frame.",
    materials: ["Lavender linen", "Yellow botanical accents", "Natural woven texture"], features: ["Garden tea setting", "Lavender table layer", "Botanical entry grouping"],
    layout: "Allow clear service routes to tea tables and keep loose plants away from guest chair pull-out space.", focus: "Tea service flow and natural daylight.",
    items: [item("Lavender tea-table accent runners", 4, "2.4 m L × 0.35 m W", "Reference feature tables; additional dining textiles scale separately"), item("Garden entry plant groupings", 2, "1.2 m W × 1.5 m H footprint", "Use stable containers and protect venue floors")],
  },
  emerald: {
    description: "An emerald lounge with gold details and dark upholstery for a composed evening reception.",
    materials: ["Emerald textile", "Brass-look metal", "Dark upholstery"], features: ["Jewel-tone lounge", "Brass accent tables", "Evening focal wall"],
    layout: "Mix seated and standing conversation spaces and provide ordinary-height seating near every cocktail zone.", focus: "Comfortable conversation across seating preferences.",
    items: [item("Emerald lounge feature drape", 2, "3 m W × 2.7 m H", "Venue-approved drape set within a supported bay"), item("Brass-look low side tables", 4, "0.45 m Ø × 0.5 m H", "Locate within seating groups, clear of main aisles")],
  },
  "little-atlantis": {
    description: "A playful underwater-inspired family scene using coral shapes, teal tones and soft-edged display forms.",
    materials: ["Teal scenic paint", "Coral-coloured foam forms", "Washable textiles"], features: ["Underwater photo scene", "Child-height activity edge", "Soft-edged display forms"],
    layout: "Keep activities visible to accompanying adults and isolate refreshments from any craft or play materials.", focus: "Supervision, stable scenery and age-appropriate materials.",
    items: [item("Soft-edged underwater scenic forms", 4, "0.5–1 m W × 1–2 m H", "Decorative only, not climbable play equipment"), item("Coral-tone low display cubes", 3, "0.4 m cube", "Secure against tipping; no small detachable parts")],
  },
  "edge-ocean": {
    setting: "Hybrid", description: "An intimate coastal focal scene with mineral blue, muted rose and warm metallic accents.",
    materials: ["Mineral-blue fabric", "Weather-suitable vessels", "Muted rose florals"], features: ["Small coastal ceremony", "Grounded focal scene", "Sheltered hospitality"],
    layout: "Position guests on a level sheltered surface with a separate accessible route; a coastal view does not determine a safe footprint.", weather: "Use a confirmed indoor room when wind, spray or access conditions are unsuitable. The coastal shelter must be reviewed by its operator.", focus: "Shelter, level access and the couple or host’s privacy.",
    items: [item("Low coastal floral focal groupings", 3, "0.6–1 m W × under 0.6 m H", "Weighted containers and outdoor material suitability confirmed"), item("Mineral-blue textile feature panels", 2, "1 m W × 2 m H", "Indoors or within a venue-approved enclosed structure")],
  },
  "north-star": {
    description: "A navy and gold gala setting with a strong recognition moment and a composed banquet layout.",
    materials: ["Navy drape", "Gold-look scenic finish", "Ivory floral accents"], features: ["Awards photo focus", "Navy room anchor", "Gold recognition accents"],
    layout: "Keep the route between guest seating and awards position clear and preserve screen visibility from the back of the room.", focus: "Awards movement, camera views and stage access.",
    items: [item("Navy recognition backdrop bays", 3, "2 m W × 3 m H", "Position relative to stage and screen plan"), item("Gold-look awards display plinths", 3, "0.4 m W × 0.9 m H", "Secure within the supervised presentation area")],
  },
  "coral-lab": {
    description: "A contemporary launch scene pairing coral scenic forms with pale mint and white product-display surfaces.",
    materials: ["Coral painted panels", "White display laminate", "Pale-mint acrylic"], features: ["Brand-ready launch scene", "Product display islands", "Camera-friendly colour"],
    layout: "Keep the product-demonstration queue separate from the presentation and photography area.", focus: "Product dimensions, approved branding and demonstration flow.",
    items: [item("Coral geometric launch panels", 3, "1 m W × 2.4 m H", "Blank surfaces ready for approved brand graphics"), item("White product display plinths", 4, "0.5 m W × 0.75–1 m H", "Confirm each product’s weight and security requirements")],
  },
  "harbour-blue": {
    description: "A welcoming waterfront-hall direction with blue textiles, warm timber tones and generous communal hospitality.",
    materials: ["Harbour-blue linen", "Timber-look surfaces", "Brushed steel accents"], features: ["Communal hospitality", "Blue focal textile", "Local waterfront mood"],
    layout: "Keep waterfront glazing visible while placing hospitality and queues along the solid perimeter of the room.", focus: "Arrival, communal dining and clear service lanes.",
    items: [item("Harbour-blue focal textile bays", 2, "3 m W × 2.7 m H", "Supported independently of glazing"), item("Timber-look hospitality facade modules", 2, "1.5 m W × 1 m H", "Fit around approved service furniture")],
  },
  convocation: {
    description: "A burgundy, ivory and gold reception setting for achievement, reunions and formal portraits.",
    materials: ["Burgundy textile", "Ivory linen", "Gold-look frames"], features: ["Achievement photo scene", "Family reception zone", "Formal portrait lighting"],
    layout: "Leave room for a family photo queue and protect a separate route for guests who do not need the photo station.", focus: "Portrait flow and academic identity approved by the host.",
    items: [item("Burgundy portrait drape bays", 2, "3 m W × 2.7 m H", "Keep fabric clear of portraits and lights"), item("Gold-look blank recognition frames", 3, "0.6 m W × 0.9 m H", "Names and crests supplied and approved separately")],
  },
  "still-garden": {
    description: "A restrained green and ivory environment for remembrance and reflective gatherings.",
    materials: ["Sage foliage", "Ivory textile", "Natural stone-look vessels"], features: ["Quiet remembrance focus", "Gentle botanical edge", "Seated conversation"],
    layout: "Place remembrance objects where guests may approach or pass by without crossing a speaking position.", focus: "Host-led tone, seating comfort and unhurried movement.",
    items: [item("Low remembrance botanical compositions", 3, "0.6 m W × under 0.5 m H", "Species and fragrance reviewed with host"), item("Ivory remembrance display table dressing", 1, "For a 1.8 m × 0.75 m table", "Size final textile to actual table dimensions")],
  },
  "winter-social": {
    description: "A warm heritage gathering with evergreen texture, wine-red accents and soft seasonal light.",
    materials: ["Evergreen botanical texture", "Wine-red textile", "Brass-look lanterns"], features: ["Seasonal welcome", "Textured gathering scene", "Warm lantern focal points"],
    layout: "Provide an uncluttered coat and boot arrival zone before guests reach dining or conversation areas.", focus: "Winter arrivals and flame-free seasonal atmosphere.",
    items: [item("Evergreen focal garland sections", 4, "1.8 m L each", "Installed on approved supports, away from heat sources"), item("Brass-look LED lanterns", 6, "0.3–0.5 m H", "Cluster outside walking and coat-storage routes")],
  },
  "jewel-sangeet": {
    description: "An immersive jewel-tone floral setting for host-led celebration, music and hospitality.",
    materials: ["Fuchsia textile", "Orange floral tones", "Deep-green botanical accents"], features: ["Jewel-colour focal wall", "Layered floral forms", "Flexible celebration floor"],
    layout: "Keep an open programme area and agree any ceremony or performance position with the host before placing the scenic wall.", focus: "Programme-specific cultural detail and guest movement.",
    items: [item("Jewel-tone floral scenic panels", 3, "1 m W × 2.4 m H", "Floral recipe can use reusable or fresh materials"), item("Fuchsia textile swags", 3, "3 m L × 1.4 m W", "Ground-supported application unless qualified rigging is arranged")],
  },
  "orchard-vow": {
    setting: "Outdoor", description: "A golden garden celebration with orchard tones, natural texture and a tented hospitality area.",
    materials: ["Warm ivory linen", "Apricot florals", "Natural timber texture"], features: ["Garden ceremony focus", "Orchard-inspired table layer", "Tented hospitality"],
    layout: "Map level routes from ceremony to dining and confirm tent access, ground condition and emergency exits with the installer.", weather: outdoorWeather, focus: "A confirmed weather fallback and guest travel across the site.",
    items: [item("Apricot garden floral clusters", 4, "0.6–0.9 m W", "Secure containers; flowers selected for seasonal conditions"), item("Timber-look ceremony feature frames", 2, "1 m W × 2.2 m H", "Qualified installer confirms anchoring; not a tent structure")],
  },
  "harbour-engagement": {
    description: "A private rooftop-room concept with plum, chartreuse and mineral neutrals around a compact celebration scene.",
    materials: ["Plum textile", "Chartreuse botanical accent", "Stone-look surfaces"], features: ["Private proposal scene", "Plum lounge accent", "Framed harbour view"],
    layout: "Keep all scenery within the enclosed room and protect access to doors without blocking the harbour view.", focus: "Privacy, lift access and the permitted rooftop-room footprint.",
    items: [item("Plum draped focal panel", 1, "2.4 m W × 2.4 m H", "Entire structure remains inside the approved room"), item("Chartreuse botanical accent bowls", 3, "0.3–0.5 m W", "Grounded low arrangements")],
  },
  "violet-formal": {
    description: "A violet and silver event-hall direction with a formal portrait moment and an open social floor.",
    materials: ["Violet textile", "Silver-look trim", "Lilac floral accents"], features: ["Formal portrait wall", "Violet room accents", "Open celebration floor"],
    layout: "Keep the photo queue, refreshments and social floor independent so arrivals can spread through the room.", focus: "Youth-friendly supervision and evening programme flow.",
    items: [item("Violet portrait scenic modules", 3, "1 m W × 2.4 m H", "Secure modules for group-photo use"), item("Silver-look accent plinths", 3, "0.4 m W × 0.6–1 m H", "Keep clear of dancing and queuing space")],
  },
  "amber-farewell": {
    description: "An amber and linen garden-room concept for gentle remembrance or a quiet family gathering.",
    materials: ["Warm linen", "Amber glass-look vessels", "Olive foliage"], features: ["Gentle remembrance table", "Low amber accents", "Sunlit seated gathering"],
    layout: "Provide choices between shared seating and quieter chairs, with a direct route to the remembrance table.", focus: "Low visual intensity and host-selected personal details.",
    items: [item("Amber remembrance vessel group", 3, "0.2–0.4 m H", "Use LED light where illumination is desired"), item("Olive botanical focal compositions", 2, "0.6 m W × 0.5 m H", "Confirm fragrance and personal meaning with host")],
  },
  "linen-welcome": {
    description: "A tactile linen and pale-yellow celebration in a bright garden room, suited to welcoming a new family chapter.",
    materials: ["Natural linen", "Pale-yellow floral tones", "Light timber"], features: ["Textile welcome scene", "Family photo grouping", "Light timber display"],
    layout: "Make space for prams and accompanying family members beside seating, without reducing the primary route.", focus: "Family comfort, quiet feeding options and convenient arrivals.",
    items: [item("Linen welcome backdrop panels", 2, "1.2 m W × 2.2 m H", "Stable free-standing construction"), item("Light timber-look display plinths", 2, "0.5 m W × 0.75 m H", "Keep gifts and food displays separate")],
  },
  "ruby-coming-age": {
    description: "A ruby and blush ballroom scene with a clear portrait focal point for coming-of-age and family celebrations.",
    materials: ["Ruby textile", "Blush floral tones", "Warm brown scenic finish"], features: ["Ruby focal scene", "Personal portrait area", "Family celebration space"],
    layout: "Agree the host’s ceremony, speaking and dance sequence first, then preserve the required clear central floor.", focus: "Personal meaning and programme order.",
    items: [item("Ruby scenic backdrop panels", 3, "1 m W × 2.7 m H", "Finish and approved graphics confirmed with host"), item("Blush floral focal bowls", 4, "0.45–0.65 m W", "Stable display heights outside activity routes")],
  },
  "jade-reunion": {
    description: "Communal dining in jade, red and warm ivory with lantern-inspired light and a generous shared-table mood.",
    materials: ["Jade textile", "Red accent vessels", "Ivory lantern shades"], features: ["Communal table setting", "Lantern-inspired light", "Jade and red contrast"],
    layout: "Allow for shared food service and seated conversation; decorative lanterns do not obstruct guest or server routes.", focus: "Host-approved symbols, menu service and table spacing.",
    items: [item("Jade feature-table runners", 4, "2.4 m L × 0.35 m W", "Size to the selected feature tables"), item("Freestanding lantern display groups", 3, "3 lanterns per group, 0.2–0.4 m H", "LED light; hanging alternatives require approved rigging")],
  },
  "indigo-feast": {
    description: "An indigo and gold atrium hospitality concept with abundant shared dining and softly illuminated focal details.",
    materials: ["Indigo linen", "Brass-look vessels", "Warm-white LED light"], features: ["Communal hospitality", "Indigo textile layer", "Soft gold focal accents"],
    layout: "Plan food-service timing and any requested prayer or quiet space with the host, keeping those routes separate from queues.", focus: "Hospitality timing and faith or cultural requirements agreed with the host.",
    items: [item("Indigo hospitality feature drape", 2, "3 m W × 2.7 m H", "Use only venue-approved independent supports"), item("Brass-look low lantern groupings", 4, "3 lanterns per grouping", "Flameless warm light and unobstructed table sightlines")],
  },
  "prismatic-pride": {
    description: "A colourful warehouse gathering with translucent colour panels and a welcoming, flexible social floor.",
    materials: ["Translucent colour acrylic", "Neutral textile", "Matte metal frames"], features: ["Prismatic photo panels", "Open communal space", "Soft colour layering"],
    layout: "Provide seated social areas alongside the active floor and keep a quiet route available away from speakers.", focus: "Inclusive welcome, guest comfort and host-approved identity details.",
    items: [item("Translucent prismatic scenic panels", 4, "0.8 m W × 2.2 m H", "Round edges and secure frames"), item("Neutral low display blocks", 3, "0.5 m cube", "Maintain contrast against the floor for visibility")],
  },
  "future-forum": {
    description: "An architectural conference direction with navy, silver and lime accents built around a legible programme.",
    materials: ["Navy scenic finish", "Silver-look framework", "Lime graphic accents"], features: ["Clear speaker focal point", "Modular stage-side scenery", "Coordinated programme signage"],
    layout: "Design sightlines from the last row and reserve camera, interpreter and technical-control positions before styling.", focus: "Screen legibility and production coordination.",
    items: [item("Navy and lime stage-side scenic fins", 4, "0.8 m W × 2.7 m H", "Stay outside screen and interpreter sightlines"), item("Blank programme information panels", 3, "0.6 m W × 1.2 m H", "Final content requires approved readable typography")],
  },
  "open-exchange": {
    description: "A light, modular exhibition concept with teal accents and a clear sequence from registration to discovery.",
    materials: ["Light neutral panels", "Teal graphic finish", "Lime sign accents"], features: ["Modular exhibitor identity", "Visible welcome point", "Clear browsing routes"],
    layout: "Agree exhibitor footprints and service lanes first; place lower welcome positions where approaching guests can see them.", focus: "Queue capacity, accessible counters and electrical coordination.",
    items: [item("Teal exhibitor header samples", 6, "1.2 m W × 0.3 m H", "Headers attach only to approved booth systems"), item("Blank modular directory signs", 2, "0.9 m W × 1.5 m H", "Content and mounting heights confirmed for the venue")],
  },
  "fogline-mixer": {
    description: "A charcoal, burgundy and muted-green networking scene in an enclosed harbour rooftop room.",
    materials: ["Charcoal textile", "Burgundy floral accents", "Sage upholstery"], features: ["Seated networking pockets", "Harbour-facing lounge", "Warm evening accents"],
    layout: "Balance seated and standing conversations, with quieter seating away from the welcome and beverage queues.", focus: "Conversation acoustics and enclosed rooftop access.",
    items: [item("Charcoal feature-table covers", 4, "Sized to selected cocktail tables", "Do not assume a one-size cover fits venue tables"), item("Burgundy low floral bowls", 4, "0.25–0.35 m W", "Low arrangements maintain cross-table visibility")],
  },
  "first-light": {
    description: "An optimistic opening scene with ivory forms, orange accents and a crisp blue graphic layer.",
    materials: ["Ivory scenic finish", "Orange accent fabric", "Blue graphic surfaces"], features: ["Opening photo backdrop", "Blank brand panels", "Welcoming arrival scene"],
    layout: "Position the opening moment beside, rather than across, the public entrance so access remains available throughout.", focus: "Public access and approved brand artwork.",
    items: [item("Ivory opening backdrop modules", 3, "0.9 m W × 2.4 m H", "Blank surfaces ready for approved artwork"), item("Orange textile accent lengths", 2, "3 m L × 0.5 m W", "Decorative application; ceremonial ribbon supplied if requested")],
  },
  "team-table": {
    description: "A warm communal-table setting with timber texture, muted green and soft neutral textiles.",
    materials: ["Natural timber finish", "Olive linen", "Neutral ceramic-look vessels"], features: ["Communal dining focus", "Low botanical centre line", "Warm tactile finishes"],
    layout: "Keep table runs short enough for service access and provide clear passage between each run and the room perimeter.", focus: "Shared dining, conversation and adaptable seating.",
    items: [item("Olive communal-table runners", 4, "2.4 m L × 0.35 m W", "Reference feature-table layer; size to actual furniture"), item("Neutral botanical centre-line vessels", 6, "0.15–0.25 m H", "Low, stable and easy to reposition for service")],
  },
  "research-salon": {
    description: "A calm university-atrium gathering with warm ivory, navy and burgundy around scholarly conversation.",
    materials: ["Ivory textile", "Navy graphic surfaces", "Burgundy accent upholstery"], features: ["Poster conversation points", "Calm scholarly lounge", "Readable research displays"],
    layout: "Allow small discussion groups to gather beside displays without occupying the through-route or screening projection surfaces.", focus: "Poster legibility, discussion acoustics and power access.",
    items: [item("Freestanding research display boards", 4, "0.9 m W × 1.2 m H display area", "Final poster format and viewing height agreed with organisers"), item("Navy programme header panels", 2, "1.2 m W × 0.3 m H", "Use approved institutional graphics only")],
  },
  "lakeside-regatta": {
    setting: "Outdoor", description: "A lakeside hospitality concept using navy, ivory and red to connect recognition, rest and public gathering.",
    materials: ["Outdoor-suitable navy textile", "White modular surfaces", "Red graphic accents"], features: ["Lakeside hospitality", "Recognition photo point", "Clearly signed guest routes"],
    layout: "Keep spectator, participant and service routes separate and use site-approved level surfaces for hospitality.", weather: outdoorWeather, focus: "Changing weather, wet ground and operational boundaries.",
    items: [item("Navy recognition backdrop graphics", 2, "1.2 m W × 2 m H", "Mounted to supplier-approved outdoor support system"), item("Red and white route marker panels", 6, "0.4 m W × 0.6 m H", "No interference with official race or emergency signage")],
  },
  "atlantic-folk": {
    description: "A timber-hall social scene with burgundy, marine blue and amber textures around music and hospitality.",
    materials: ["Burgundy fabric", "Marine-blue accents", "Amber lantern light"], features: ["Warm listening room", "Timber-hall atmosphere", "Flexible social seating"],
    layout: "Keep the performer route separate from food service and preserve a seated listening area alongside social tables.", focus: "Acoustics, performance visibility and local host direction.",
    items: [item("Burgundy performer backdrop bays", 2, "3 m W × 2.7 m H", "Venue-approved material clear of technical equipment"), item("Amber LED lantern groups", 4, "3 lanterns per group", "Set outside performer and guest circulation")],
  },
  "brick-lane-music": {
    setting: "Outdoor", description: "A compact lane-side music concept with blue scenic accents, coral highlights and a sheltered programme point.",
    materials: ["Exterior-suitable blue panels", "Coral accent graphics", "Weather-suitable lighting housings"], features: ["Compact urban stage scene", "Blue-hour colour accents", "Defined audience edge"],
    layout: "Protect required street access and emergency crossings before allocating any audience or scenic footprint.", weather: "A canopy alone is not a severe-weather plan. Confirm a venue-approved indoor relocation or postponement trigger and all temporary structures with the installer.", focus: "Street permissions, audience flow and weather decisions.",
    items: [item("Blue stage-side scenic panels", 2, "1 m W × 2.2 m H", "Outdoor support and wind exposure reviewed by installer"), item("Coral programme signs", 3, "0.6 m W × 0.9 m H", "Secure to approved supports clear of public crossings")],
  },
  "water-street-market": {
    description: "A curated indoor maker market with warm neutral stalls, sea-green headers and orange accent graphics.",
    materials: ["Neutral stall panels", "Sea-green graphic finish", "Orange wayfinding accents"], features: ["Coordinated vendor fronts", "Legible maker identities", "Comfortable browsing loop"],
    layout: "Agree stall dimensions and queue allowances before dressing vendor fronts; keep rest seating outside the browsing loop.", focus: "Vendor access, public circulation and individual product needs.",
    items: [item("Sea-green vendor header panels", 6, "1.2 m W × 0.3 m H", "Reference six-stall module; expand to actual vendor count"), item("Neutral stall-front dressings", 6, "1.8 m W × 0.75 m H", "Keep storage and power connections accessible to vendors")],
  },
  "red-white-summer": {
    setting: "Outdoor", description: "An open-air civic gathering with white scenic elements, red accents and a generous lawn-side hospitality mood.",
    materials: ["Exterior white finish", "Red textiles", "Green botanical accents"], features: ["Open-air hospitality", "Red and white focal scene", "Visible rest points"],
    layout: "Plan shade, level paths and rest seating from the entrance, then position scenic accents around those routes.", weather: outdoorWeather, focus: "Public capacity, shade and a clear weather response.",
    items: [item("Red and white public welcome panels", 3, "0.9 m W × 1.8 m H", "Fixings and outdoor support specified for the site"), item("Grounded green botanical clusters", 4, "0.8 m W × 0.6 m H", "Stable containers away from route edges")],
  },
  "moss-brass-social": {
    description: "A stone-and-timber hall gathering with moss green, warm ivory and subtle brass details.",
    materials: ["Moss-green linen", "Brass-look vessels", "Ivory botanical tones"], features: ["Heritage-room warmth", "Moss textile accents", "Low brass focal groupings"],
    layout: "Use independent scenic supports and protect heritage surfaces; keep furniture clear of doors and historic features.", focus: "Heritage venue care and comfortable social flow.",
    items: [item("Moss-green feature textile panels", 2, "1.5 m W × 2.4 m H", "No attachment to heritage fabric without venue permission"), item("Brass-look botanical vessel groups", 4, "0.3–0.5 m H", "Protect surfaces beneath every vessel")],
  },
  "icefire-new-year": {
    description: "A winter ballroom party with icy blue surfaces, charcoal accents and warm metallic light.",
    materials: ["Ice-blue acrylic", "Charcoal textile", "Copper-look accents"], features: ["Winter party photo scene", "Cool and warm contrast", "Open midnight gathering area"],
    layout: "Keep coat storage and exits clear during peak arrivals and preserve a clear route around the main party floor.", focus: "Night-time visibility and a comfortable late-event flow.",
    items: [item("Ice-blue translucent scenic panels", 3, "1 m W × 2.4 m H", "Diffused light only; avoid glare towards guests"), item("Copper-look focal display forms", 3, "0.4 m W × 0.6–1 m H", "No pyrotechnic or open-flame effect implied")],
  },
  "festival-light": {
    setting: "Outdoor", description: "A sheltered courtyard hospitality direction with orange, magenta and warm LED light.",
    materials: ["Orange textile", "Magenta botanical accents", "Warm-white LED lanterns"], features: ["Courtyard gathering scene", "Warm lantern grouping", "Host-led festive detail"],
    layout: "Maintain clear courtyard exits and a level route between indoor hospitality and the exterior gathering area.", weather: outdoorWeather, focus: "Host-confirmed cultural details and safe courtyard operation.",
    items: [item("Orange and magenta focal textile panels", 3, "1 m W × 2.2 m H", "Use outdoors only within installer-approved supports and conditions"), item("Warm LED courtyard lanterns", 8, "0.3–0.5 m H", "Outdoor suitability checked with supplier; keep paths clear")],
  },
  "apartment-atelier": {
    description: "An intimate home celebration with a beautifully dressed dining table, one compact photo corner and room to live around it.",
    materials: ["Lilac linen napkins", "Coral seasonal florals", "Warm timber furniture"], features: ["Small-space dining", "Compact photo corner", "Clear home circulation"],
    layout: "Measure doorways, lift access and chair pull-out space. Use existing furniture where suitable and leave the route to kitchen, bathroom and exit clear.",
    focus: "A restrained scene that fits a real apartment, with no oversized portal or stage.",
    format: "small-dining", capacity: [8, 20, 12], occasions: /birthday|anniversary|engagement|bridal shower|baby shower|welcome-baby|retirement|thanksgiving|valentine|easter/i,
    items: [item("Compact lilac rounded photo panel", 1, "0.9 m W × 2 m H", "Small free-standing footprint measured against the actual room"), item("Coral and lilac table bud-vase groupings", 6, "0.1–0.2 m W × 0.2–0.35 m H", "Reference table styling; keep flowers and stems clear of conversation sightlines"), item("Sideboard floral arrangement", 1, "0.4 m W × 0.5 m H", "Uses an existing stable surface if suitable; protect the surface below") ],
  },
  "quiet-cove": {
    description: "A separate low-stimulation retreat with soft neutral colours, steady light and a choice of supported seating for short breaks from the main event.",
    materials: ["Sage and taupe upholstery", "Sheer ivory window textile", "Warm steady LED light"], features: ["Low-stimulation retreat", "Supported seating choices", "Clear and quiet arrival"],
    layout: "Use a separate room away from speakers. Preserve a clear exit, companion seating and space between small groups; agree supervision and guest communication with the organiser.",
    focus: "Discuss sensory and access preferences with guests. This is an optional rest space, not a clinical service or accessibility certification.",
    format: "quiet-lounge", capacity: [6, 12, 8], concurrent: true, occasions: /.*/,
    items: [item("Sheer ivory window textile sets", 2, "Allow 3 m W × 2.7 m H per window bay", "Use existing venue curtains if suitable; window measurements and approved fixings confirmed on survey"), item("Potted green botanical accent", 1, "0.5 m pot diameter × 1.5–1.8 m overall H", "Stable container outside circulation; discuss plant or artificial-foliage preferences with guests") ],
  },
  "rain-garden": {
    description: "A complete indoor alternative to a garden event, using portable green-and-white botanical features and warm ivory finishes so the occasion keeps its identity when the weather changes.",
    materials: ["Green foliage and white florals", "Ivory scenic frames", "Neutral ceramic-look planters"], features: ["Indoor weather alternative", "Portable botanical islands", "Pre-planned room reset"],
    layout: "Reserve and measure the indoor room in advance. Reuse only the portable scenic layer; redesign furniture positions and exits for the indoor footprint.",
    weather: "Pair this scene with an outdoor plan before invitations are final. Agree the decision time, mover access and reset labour; reserve the indoor room independently.",
    focus: "A real indoor fallback with its own floor plan and staffing allowance.", capacity: [10, 200, 80],
    occasions: /wedding|elopement|anniversary|vow renewal|engagement|proposal|bridal shower|baby shower|birthday|reunion|garden party|picnic|easter|thanksgiving|wellness/i,
    items: [item("Ivory angular focal frames", 2, "0.8–1 m W × 1.8–2.4 m H", "Independent supported frames at staggered heights; qualified installer confirms stability"), item("Green-and-white focal botanical compositions", 2, "0.8–1.2 m W × 1.6–2.4 m H with frame", "Focal frame dressing, separate from any aisle arrangements; protect floors beneath vessels"), item("Flanking potted trees", 2, "0.5 m pot diameter × 1.8–2.2 m overall H", "Place at room edges clear of exits; confirm indoor reset handling") ],
  },
  "open-circle": {
    description: "A floor-level ceremony in a softly dressed community room, with curved seating groups, companion spaces and an open focal centre.",
    materials: ["Coral and lilac scenic finish", "Cream upholstered chairs", "Low peach-and-ivory florals"], features: ["Floor-level ceremony", "Companion seating spaces", "Open sightlines"],
    layout: "Draw wheelchair and companion positions into the same seating groups. Confirm route widths, turning spaces, doors, washrooms and sightlines against the venue and guest requirements.",
    focus: "Participation without a raised focal stage. Accessibility must be verified for the actual venue and guests.", format: "ceremony", capacity: [10, 80, 40],
    occasions: /ceremony|elopement|vow renewal|naming|christening|baptism|communion|confirmation|memorial|wake|worship|indigenous|mitzvah/i,
    items: [item("Coral and lilac rounded backdrop panels", 3, "0.9–1.2 m W × 1.8–2.4 m H", "Three staggered panels behind the level focal centre, clear of the approach"), item("Peach-and-ivory floral focal groupings", 2, "0.9 m W × 0.6 m H", "Position at the outer backdrop edges to preserve the level approach and sightlines") ],
  },
  "makers-workshop": {
    description: "A colourful hands-on studio with worktables, shared supply stations and a separate demonstration point for making and learning together.",
    materials: ["Warm timber work surfaces", "Peach display panels", "Forest-green storage accents"], features: ["Hands-on worktables", "Shared supply stations", "Visible demonstration point"],
    layout: "Keep wet work, food and electrical equipment separate. Provide seated-height work positions with clear knee space and place tools within reach.",
    focus: "Choose workshop equipment and consumables for the actual activity, age group and facilitator.", format: "workshop", capacity: [12, 48, 24],
    occasions: /seminar|workshop|training|science fair|innovation showcase|art exhibition|employee-appreciation|student orientation|school carnival/i,
    items: [item("Peach rounded artwork display panels", 2, "1 m W × 2.1 m H", "Stable freestanding panels with removable artwork clips"), item("Rolling shared-supply carts", 2, "0.7 m W × 0.4 m D × 0.9 m H", "Lock castors in use; contents included in the separate activity-kit allowance"), item("Small peach floral table accents", 3, "0.2 m W × under 0.3 m H", "Optional reference styling; remove for activities requiring the full work surface") ],
  },
  "screen-salon": {
    description: "A small hybrid meeting concept with an oval conversation table, a remote-participant screen and restrained plum and warm-neutral finishes.",
    materials: ["Plum upholstery and drape", "Warm-neutral acoustic finish", "Light timber-look tables"], features: ["Remote-participant screen position", "Camera-aware seating", "Controlled meeting light"],
    layout: "Seat participants within the chosen camera and microphone coverage. Check glare, cable routes and wheelchair positions before finalising the table arrangement.",
    focus: "Test the actual network, conferencing platform, audio and camera setup before guests arrive.", format: "hybrid-meeting", capacity: [6, 24, 16],
    occasions: /agm|shareholder|association meeting|executive retreat|offsite|seminar|workshop|training|press conference|research symposium|scholarly conference/i,
    items: [item("Plum window-drape sets", 2, "Allow 2 m W × 2.7 m H per window bay", "Use existing venue drape where suitable; helps control screen glare without covering exits"), item("Warm-neutral acoustic background panels", 3, "1 m W × 2.1 m H", "Use the venue wall treatment where suitable; any added panels need approved fixings and an audio review"), item("Potted green room accent", 1, "0.5 m pot diameter × 1.8 m overall H", "Keep outside the camera sightline and travel route") ],
  },
};

const homepageAliases: Record<string, string[]> = {
  "pearl-sage": ["Saltair in Pearl & Sage"],
  nocturne: ["Nocturne Ballroom"],
  "clay-rose": ["Clay Rose Ceremony"],
  "winter-chrome": ["Winter in Chrome"],
  afterglow: ["Afterglow for Two"],
  "blue-hour": ["Blue Hour Fifty"],
  emerald: ["emerald-fifty"],
  "edge-ocean": ["edge-of-ocean"],
  "north-star": ["North Star Gala", "north-star-gala"],
  "coral-lab": ["Coral Launch Lab", "coral-launch"],
  "harbour-blue": ["Harbour Blue Benefit"],
  "winter-social": ["Winter Social Club"],
};

export const availableSettings: EventSetting[] = ["Indoor", "Outdoor", "Hybrid"];

export const designProfiles: Record<string, DesignProfile> = Object.fromEntries(inspirationDirections.map((direction) => {
  const recipe = recipes[direction.id];
  if (!recipe) throw new Error(`Missing design profile: ${direction.id}`);
  const [minGuests, maxGuests, referenceGuests] = recipe.capacity ?? [10, 800, 120];
  const occasionIds = events.filter((event) => recipe.occasions
    ? recipe.occasions.test(event.title)
    : direction.bestFor.includes(event.category)).map((event) => event.id);
  return [direction.id, {
    setting: recipe.setting ?? "Indoor",
    settingLabel: direction.venue,
    description: recipe.description,
    aliases: homepageAliases[direction.id] ?? [],
    features: recipe.features,
    materials: recipe.materials,
    layoutNote: recipe.layout,
    weatherPlan: recipe.weather ?? indoorWeather,
    planningFocus: recipe.focus,
    occasionIds,
    signatureItems: recipe.items,
    format: recipe.format ?? "standard",
    minGuests,
    maxGuests,
    referenceGuests,
    capacityBasis: recipe.concurrent ? "concurrent" : "event",
    capacityNote: recipe.concurrent
      ? `${minGuests}–${maxGuests} concurrent users in the quiet room; size the main event separately.`
      : `${minGuests}–${maxGuests} reference guests. Final capacity depends on the measured venue, layout and programme.`,
  } satisfies DesignProfile];
}));

export function profileForDirection(direction: InspirationDirection | string): DesignProfile {
  const id = typeof direction === "string" ? direction : direction.id;
  const profile = designProfiles[id];
  if (!profile) throw new Error(`Unknown design profile: ${id}`);
  return profile;
}

export type DesignFilters = { query?: string; setting?: EventSetting | "All"; occasionId?: string };
const normalizedSearch = (text: string) => text.toLocaleLowerCase("en-CA").normalize("NFKD")
  .replace(/[\u0300-\u036f]/g, "").replace(/[’']/g, "").replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, " ").trim();
export function designMatchesFilters(direction: InspirationDirection, filters: DesignFilters = {}): boolean {
  const profile = profileForDirection(direction);
  const query = normalizedSearch(filters.query ?? "");
  const searchable = normalizedSearch([direction.title, direction.mood, direction.venue, profile.description, ...profile.aliases, ...profile.features, ...profile.materials].join(" "));
  const settingFits = !filters.setting || filters.setting === "All" || profile.setting === filters.setting;
  const occasionFits = !filters.occasionId || filters.occasionId === "All" || profile.occasionIds.includes(filters.occasionId);
  return (!query || searchable.includes(query)) && settingFits && occasionFits;
}
