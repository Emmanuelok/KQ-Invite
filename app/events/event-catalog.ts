export type EventCategory =
  | "Life & love"
  | "Corporate"
  | "Arts & entertainment"
  | "Community & civic"
  | "Culture & faith"
  | "Education & youth"
  | "Sport & wellness"
  | "Seasonal";

export type EventSeason = "Year-round" | "Spring" | "Summer" | "Autumn" | "Winter";
export type EventSetting = "Indoor" | "Outdoor" | "Hybrid";
export type EventScale = "Intimate" | "Mid-size" | "Large-scale" | "Flexible";

export type EventType = {
  id: string;
  title: string;
  category: EventCategory;
  description: string;
  localPriority: boolean;
  localExample?: string;
  aliases: string[];
  season: EventSeason;
  setting: EventSetting;
  scale: EventScale;
  guestRange: string;
  investmentRange: string;
  venuePattern: string;
  planningNotes: string[];
  index: number;
};

export type InspirationDirection = {
  id: string;
  title: string;
  image: string;
  palette: string[];
  mood: string;
  venue: string;
  startingAt: number | null;
  bestFor: EventCategory[];
};

export type EventCollectionId =
  | "ceremony-romance"
  | "family-milestones"
  | "business-academia"
  | "arts-music-nightlife"
  | "culture-faith-diaspora"
  | "atlantic-outdoor-seasonal";

export type EventCollection = {
  id: EventCollectionId;
  title: string;
  kicker: string;
  description: string;
  directionIds: string[];
  defaultEventTitle: string;
  planningNote: string;
};

type EventSeed = {
  title: string;
  localExample?: string;
  aliases?: string[];
  season?: EventSeason;
  setting?: EventSetting;
  scale?: EventScale;
};

const categoryProfiles: Record<EventCategory, {
  description: string;
  guestRange: string;
  investmentRange: string;
  venuePattern: string;
  notes: string[];
}> = {
  "Life & love": {
    description: "Personal, emotionally precise environments that keep ceremony, photography and guest comfort in balance.",
    guestRange: "8–350 guests",
    investmentRange: "$1,500–$18,000+",
    venuePattern: "Ballroom · restaurant · church · garden · home",
    notes: ["Protect the primary reveal and photo sightline.", "Scale guest-table inventory to the confirmed floor plan.", "Build a weather-safe alternative for every outdoor focal moment."],
  },
  Corporate: {
    description: "Brand-aware environments built for arrival, networking, stage visibility and operational flow.",
    guestRange: "30–2,000 guests",
    investmentRange: "$3,500–$40,000+",
    venuePattern: "Convention centre · hotel · studio · office",
    notes: ["Keep sponsor and screen sightlines unobstructed.", "Separate guest, catering and production circulation.", "Resolve power, rigging, fire-rating and load-in windows early."],
  },
  "Arts & entertainment": {
    description: "Camera-ready environments for audiences, creators and cultural programming, with adaptable front- and back-of-house zones.",
    guestRange: "40–5,000 guests",
    investmentRange: "$3,000–$50,000+",
    venuePattern: "Theatre · gallery · festival tent · street · studio",
    notes: ["Design for both the live audience and the camera frame.", "Maintain safe technical, performer and public circulation.", "Use modular scenic systems that can reset quickly between programs."],
  },
  "Community & civic": {
    description: "Inclusive public-facing formats designed for welcome, accessibility, flexible programming and high-throughput movement.",
    guestRange: "50–10,000+ guests",
    investmentRange: "$2,500–$60,000+",
    venuePattern: "Park · market · civic hall · street · waterfront",
    notes: ["Plan accessible routes and calm rest areas.", "Use wind-rated, weighted and weather-tolerant outdoor systems.", "Separate registration, activity and food-service queues."],
  },
  "Culture & faith": {
    description: "Respectful, protocol-aware environments that support ceremony, hospitality and cultural meaning without reducing tradition to decoration.",
    guestRange: "30–800 guests",
    investmentRange: "$2,500–$25,000+",
    venuePattern: "Community hall · place of worship · ballroom · home",
    notes: ["Confirm cultural and faith protocols with the host or designated elder.", "Never invent sacred symbols, language or regalia.", "Allocate adequate transition time between ceremonial and social programs."],
  },
  "Education & youth": {
    description: "Celebratory, durable and highly legible environments for achievement, welcome, learning and youth participation.",
    guestRange: "30–2,500 guests",
    investmentRange: "$1,800–$20,000+",
    venuePattern: "Campus hall · gym · ballroom · classroom · theatre",
    notes: ["Preserve stage, certificate and family-photo sightlines.", "Use stable child- and youth-safe scenic elements.", "Plan high-volume arrivals, coat storage and accessible seating."],
  },
  "Sport & wellness": {
    description: "Energetic formats for competition, recognition and recovery, from lakeside public events to intimate wellness retreats.",
    guestRange: "25–50,000 guests",
    investmentRange: "$2,000–$75,000+",
    venuePattern: "Arena · park · clubhouse · lakefront · retreat venue",
    notes: ["Keep athlete, officials and public routes separate.", "Specify weather, wind and wet-ground contingencies.", "Make awards and sponsor moments legible at distance."],
  },
  Seasonal: {
    description: "Atmospheric calendar moments designed around climate, daylight, tradition and the way guests move through a season.",
    guestRange: "20–3,000 guests",
    investmentRange: "$1,500–$30,000+",
    venuePattern: "Ballroom · restaurant · park · home · public square",
    notes: ["Plan for seasonal freight and floral substitutions.", "Use flame-safe lighting and venue-approved electrical distribution.", "Resolve snow, rain, wind and shortened daylight in the operating plan."],
  },
};

const eventGroups: Array<{ category: EventCategory; items: EventSeed[] }> = [
  {
    category: "Life & love",
    items: [
      { title: "Wedding ceremony & reception", localExample: "A core St. John’s venue category", aliases: ["wedding", "marriage", "reception"], setting: "Hybrid", scale: "Flexible" },
      { title: "Elopement or micro-wedding", aliases: ["intimate wedding"], setting: "Hybrid", scale: "Intimate" },
      { title: "Engagement party or proposal", localExample: "Coastal and private-dining proposals", aliases: ["proposal", "engagement"], setting: "Hybrid", scale: "Intimate" },
      { title: "Bridal shower", aliases: ["wedding shower"], scale: "Mid-size" },
      { title: "Bachelor, bachelorette or stag-and-doe", aliases: ["hen party", "stag party"], scale: "Mid-size" },
      { title: "Anniversary or vow renewal", aliases: ["vow renewal"], setting: "Hybrid", scale: "Flexible" },
      { title: "Baby shower", localExample: "Frequently hosted by local hotels and private venues", aliases: ["welcome baby"], scale: "Mid-size" },
      { title: "Gender reveal or welcome-baby party", aliases: ["sip and see"], setting: "Hybrid", scale: "Mid-size" },
      { title: "Birthday party", localExample: "A recurring local hospitality and venue service category", aliases: ["birthday"], scale: "Flexible" },
      { title: "Milestone birthday", aliases: ["30th", "40th", "50th", "60th", "70th"], scale: "Flexible" },
      { title: "Children’s themed birthday", aliases: ["kids party", "children party"], scale: "Mid-size" },
      { title: "Naming ceremony or christening", aliases: ["outdooring", "christening", "naming day"], scale: "Mid-size" },
      { title: "Family reunion", aliases: ["family gathering"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Retirement celebration", aliases: ["retirement party"], scale: "Mid-size" },
      { title: "Celebration of life, memorial or wake", localExample: "A recurring local hospitality and venue need", aliases: ["funeral reception", "memorial", "wake"], scale: "Flexible" },
    ],
  },
  {
    category: "Corporate",
    items: [
      { title: "Conference or convention", localExample: "St. John’s Convention Centre conferences", aliases: ["summit", "convention"], scale: "Large-scale" },
      { title: "Trade show, exhibition or industry expo", localExample: "Convention-centre trade shows", aliases: ["expo", "exhibition"], scale: "Large-scale" },
      { title: "Corporate gala or awards night", localExample: "Hotel and convention-centre galas", aliases: ["awards gala"], scale: "Large-scale" },
      { title: "Corporate Christmas or holiday party", localExample: "A major winter booking category", aliases: ["office party"], season: "Winter", scale: "Large-scale" },
      { title: "Product or brand launch", aliases: ["brand activation", "launch event"], scale: "Flexible" },
      { title: "Grand opening or ribbon cutting", aliases: ["opening ceremony"], setting: "Hybrid", scale: "Mid-size" },
      { title: "Networking reception", aliases: ["business mixer"], scale: "Mid-size" },
      { title: "AGM, shareholder or association meeting", aliases: ["annual general meeting"], scale: "Large-scale" },
      { title: "Executive retreat or offsite", aliases: ["leadership retreat"], setting: "Hybrid", scale: "Intimate" },
      { title: "Seminar, workshop or training event", aliases: ["professional development"], scale: "Mid-size" },
      { title: "Employee-appreciation event", aliases: ["staff appreciation"], setting: "Hybrid", scale: "Flexible" },
      { title: "Client or donor-appreciation event", aliases: ["donor reception"], scale: "Flexible" },
      { title: "Press conference or media launch", aliases: ["media event"], scale: "Mid-size" },
    ],
  },
  {
    category: "Arts & entertainment",
    items: [
      { title: "Live concert", localExample: "Music @ and year-round live-music programming", aliases: ["concert"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Music festival", localExample: "George Street and Newfoundland & Labrador Folk festivals", aliases: ["street concert", "folk festival"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
      { title: "Theatre premiere or cast celebration", aliases: ["opening night"], scale: "Mid-size" },
      { title: "Opera or classical performance", aliases: ["orchestra", "recital"], scale: "Large-scale" },
      { title: "Dance recital or showcase", aliases: ["dance show"], scale: "Large-scale" },
      { title: "Comedy show", aliases: ["stand-up"], scale: "Large-scale" },
      { title: "Film festival, premiere or screening", localExample: "St. John’s film-festival programming", aliases: ["film premiere", "screening"], scale: "Large-scale" },
      { title: "Art exhibition or gallery opening", localExample: "Hold Fast and local gallery programming", aliases: ["art show", "opening reception"], scale: "Mid-size" },
      { title: "Fashion show", aliases: ["runway show"], scale: "Large-scale" },
      { title: "Book launch or literary reading", aliases: ["author event"], scale: "Mid-size" },
      { title: "Storytelling or poetry event", localExample: "St. John’s Storytelling Festival", aliases: ["poetry slam", "spoken word"], scale: "Mid-size" },
    ],
  },
  {
    category: "Community & civic",
    items: [
      { title: "Street festival", localExample: "George Street Festival and downtown programming", aliases: ["street fair"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
      { title: "Community market, maker market or craft fair", localExample: "Community markets and Pedestrian Mall pop-ups", aliases: ["craft fair", "maker market"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Food, beverage or culinary festival", aliases: ["food festival", "tasting festival"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Winter festival", localExample: "ChillFest", aliases: ["winter carnival"], season: "Winter", setting: "Hybrid", scale: "Large-scale" },
      { title: "Holiday-light festival", localExample: "Holiday Lights at Bowring Park", aliases: ["light trail"], season: "Winter", setting: "Outdoor", scale: "Large-scale" },
      { title: "Newcomer welcome fair or settlement expo", localExample: "My New St. John’s Expo", aliases: ["welcome week", "newcomer expo"], scale: "Large-scale" },
      { title: "Municipal or community open house", aliases: ["public open house"], scale: "Mid-size" },
      { title: "Neighbourhood block party", aliases: ["street party"], season: "Summer", setting: "Outdoor", scale: "Mid-size" },
      { title: "Public garden party or community picnic", localExample: "Regatta lakeside garden-party format", aliases: ["community picnic"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
    ],
  },
  {
    category: "Culture & faith",
    items: [
      { title: "Newfoundland folk festival or kitchen party", localExample: "Folk Festival, Folk Night and kitchen-party traditions", aliases: ["kitchen party", "folk night"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Mummering heritage reception or community social", localExample: "Mummers Festival social and heritage programming", aliases: ["mummering reception", "heritage social"], season: "Winter", setting: "Indoor", scale: "Large-scale" },
      { title: "Ghanaian or West African diaspora celebration", aliases: ["African celebration", "West African celebration", "Ghanaian celebration", "Black cultural celebration", "Caribbean event", "diaspora celebration"], scale: "Large-scale" },
      { title: "Indigenous cultural gathering", aliases: ["cultural gathering"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Multicultural or intercultural festival", localExample: "Downtown cultural programming", aliases: ["multicultural festival"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Christian worship conference or church gathering", aliases: ["church conference", "revival"], scale: "Large-scale" },
      { title: "Baptism, First Communion or Confirmation", aliases: ["communion", "confirmation"], scale: "Mid-size" },
      { title: "Bar or Bat Mitzvah", aliases: ["mitzvah reception"], scale: "Large-scale" },
      { title: "Ramadan Iftar or Eid celebration", aliases: ["iftar", "eid"], scale: "Large-scale" },
      { title: "Diwali celebration", aliases: ["festival of lights"], scale: "Large-scale" },
      { title: "Lunar New Year celebration", aliases: ["Chinese New Year"], season: "Winter", scale: "Large-scale" },
    ],
  },
  {
    category: "Education & youth",
    items: [
      { title: "Graduation or university convocation", localExample: "Memorial University convocation", aliases: ["graduation", "convocation"], season: "Spring", scale: "Large-scale" },
      { title: "Prom, formal or graduation ball", aliases: ["school formal", "prom"], season: "Spring", scale: "Large-scale" },
      { title: "Academic awards ceremony", aliases: ["school awards"], scale: "Large-scale" },
      { title: "Research symposium or scholarly conference", aliases: ["academic conference", "symposium"], scale: "Large-scale" },
      { title: "Student orientation or welcome week", aliases: ["orientation", "welcome week"], season: "Autumn", setting: "Hybrid", scale: "Large-scale" },
      { title: "Alumni reunion", aliases: ["class reunion"], scale: "Large-scale" },
      { title: "School carnival or youth talent show", aliases: ["school fair", "talent show"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Science fair, innovation showcase or student expo", aliases: ["science fair", "student expo"], scale: "Large-scale" },
    ],
  },
  {
    category: "Sport & wellness",
    items: [
      { title: "Rowing regatta", localExample: "Royal St. John’s Regatta", aliases: ["regatta", "rowing"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
      { title: "Tournament or championship", aliases: ["championship", "tournament"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Sports awards banquet", aliases: ["team banquet", "athletic awards"], scale: "Large-scale" },
      { title: "Road race, charity walk or walkathon", aliases: ["marathon", "fun run", "walkathon"], setting: "Outdoor", scale: "Large-scale" },
      { title: "Golf tournament", aliases: ["golf classic"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
      { title: "Yoga, mindfulness or wellness retreat", aliases: ["wellness retreat", "meditation retreat"], setting: "Hybrid", scale: "Intimate" },
      { title: "Dance or fitness event", aliases: ["fitness showcase"], setting: "Hybrid", scale: "Large-scale" },
      { title: "Esports or gaming tournament", aliases: ["gaming event", "esports"], scale: "Large-scale" },
    ],
  },
  {
    category: "Seasonal",
    items: [
      { title: "Christmas or general holiday celebration", localExample: "Holiday Lights and seasonal venue celebrations", aliases: ["Christmas party", "holiday party"], season: "Winter", scale: "Flexible" },
      { title: "New Year’s Eve party", localExample: "Downtown St. John’s New Year’s Eve", aliases: ["NYE", "new year"], season: "Winter", scale: "Large-scale" },
      { title: "Halloween party", localExample: "Pumpkin Walk and private Halloween events", aliases: ["pumpkin walk"], season: "Autumn", setting: "Hybrid", scale: "Flexible" },
      { title: "Valentine’s or Galentine’s event", aliases: ["Valentines", "Galentines"], season: "Winter", scale: "Flexible" },
      { title: "Easter or spring celebration", aliases: ["Easter brunch", "spring party"], season: "Spring", setting: "Hybrid", scale: "Flexible" },
      { title: "Thanksgiving or harvest celebration", aliases: ["harvest dinner"], season: "Autumn", scale: "Flexible" },
      { title: "Canada Day or another national-day celebration", localExample: "Signal Hill sunrise and city celebrations", aliases: ["Canada Day", "national day"], season: "Summer", setting: "Outdoor", scale: "Large-scale" },
      { title: "St. Patrick’s or Celtic celebration", localExample: "Downtown and hospitality-led seasonal celebrations", aliases: ["St Patricks", "Celtic night"], season: "Spring", setting: "Hybrid", scale: "Large-scale" },
    ],
  },
];

const slugify = (value: string) => value
  .toLowerCase()
  .normalize("NFKD")
  .replace(/[’']/g, "")
  .replace(/&/g, " and ")
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

const scaleDefaults: Record<EventScale, string> = {
  Intimate: "8–40 guests",
  "Mid-size": "30–150 guests",
  "Large-scale": "100–5,000+ guests",
  Flexible: "8–1,000+ guests",
};

export const events: EventType[] = eventGroups.flatMap(({ category, items }) => items.map((seed) => {
  const index = eventGroups.slice(0, eventGroups.findIndex((group) => group.category === category))
    .reduce((total, group) => total + group.items.length, 0) + items.indexOf(seed);
  const profile = categoryProfiles[category];
  const scale = seed.scale ?? "Flexible";
  return {
    id: slugify(seed.title),
    title: seed.title,
    category,
    description: profile.description,
    localPriority: Boolean(seed.localExample),
    localExample: seed.localExample,
    aliases: seed.aliases ?? [],
    season: seed.season ?? "Year-round",
    setting: seed.setting ?? "Indoor",
    scale,
    guestRange: scale === "Flexible" ? profile.guestRange : scaleDefaults[scale],
    investmentRange: profile.investmentRange,
    venuePattern: profile.venuePattern,
    planningNotes: profile.notes,
    index,
  };
}));

const paradeOnlyRoutes = events.filter((event) => /parade|procession/i.test([
  event.title,
  event.localExample ?? "",
  ...event.aliases,
].join(" ")));

if (paradeOnlyRoutes.length) {
  throw new Error("Parade and procession routes are outside the décor-relevant occasion catalog.");
}

export const categories = eventGroups.map(({ category, items }) => ({
  id: category,
  label: category,
  count: items.length,
}));

export const inspirationDirections: InspirationDirection[] = [
  { id: "pearl-sage", title: "Pearl & Sage", image: "/decor-v2/01-pearl-sage-v2.webp", palette: ["#f4f0e6", "#9aa58f", "#d8d3c6"], mood: "Airy · sculptural · Atlantic", venue: "Coastal glasshouse", startingAt: 6800, bestFor: ["Life & love", "Culture & faith"] },
  { id: "nocturne", title: "Nocturne", image: "/decor-v2/02-nocturne-v2.webp", palette: ["#11100f", "#c6aa6a", "#ece0c9"], mood: "Candlelit · dramatic · tailored", venue: "Grand ballroom", startingAt: 8900, bestFor: ["Life & love", "Corporate", "Arts & entertainment"] },
  { id: "clay-rose", title: "Clay Rose", image: "/decor-v2/03-clay-rose-v2.webp", palette: ["#b76545", "#dfb6a8", "#d6c2a5"], mood: "Warm · organic · editorial", venue: "Intimate ceremony room", startingAt: 2850, bestFor: ["Life & love", "Seasonal"] },
  { id: "winter-chrome", title: "Winter Chrome", image: "/decor-v2/04-winter-chrome-v2.webp", palette: ["#f4f5f3", "#bfc6c8", "#d9e3e7"], mood: "Luminous · clean · architectural", venue: "Modern gallery hall", startingAt: 7400, bestFor: ["Life & love", "Corporate", "Seasonal"] },
  { id: "heritage-gold", title: "Accra Atlantic", image: "/event-world/25-indigo-diaspora.webp", palette: ["#172b54", "#bc833b", "#365341", "#a54d32"], mood: "Contemporary · rooted · celebratory", venue: "Modern diaspora celebration hall", startingAt: 8200, bestFor: ["Culture & faith", "Community & civic", "Life & love"] },
  { id: "afterglow", title: "Afterglow", image: "/decor-v2/06-afterglow-v2.webp", palette: ["#651f2b", "#c87879", "#f1e5d5"], mood: "Intimate · cinematic · floral", venue: "Private dining room", startingAt: 1650, bestFor: ["Life & love", "Seasonal"] },
  { id: "blue-hour", title: "Blue Hour", image: "/decor-v2/07-blue-hour-v2.webp", palette: ["#1839a6", "#f2a93b", "#10182d"], mood: "Electric · polished · expressive", venue: "Downtown loft", startingAt: 4200, bestFor: ["Arts & entertainment", "Corporate", "Life & love"] },
  { id: "cloud-nine", title: "Cloud Nine", image: "/decor-v2/08-cloud-nine-v2.webp", palette: ["#cbdce9", "#edc2ad", "#f6f0e4"], mood: "Soft · sculptural · serene", venue: "Bright social room", startingAt: 2350, bestFor: ["Life & love", "Education & youth"] },
  { id: "lavender-tea", title: "Lavender Tea Garden", image: "/decor-v2/09-lavender-tea-v2.webp", palette: ["#a991bd", "#f1d985", "#667a58"], mood: "Botanical · gracious · sunlit", venue: "Garden conservatory", startingAt: 2700, bestFor: ["Life & love", "Seasonal", "Community & civic"] },
  { id: "emerald", title: "Emerald After Dark", image: "/decor-v2/10-emerald-after-dark-v2.webp", palette: ["#12483b", "#b89454", "#141414"], mood: "Glamorous · saturated · grown-up", venue: "Cocktail lounge", startingAt: 5100, bestFor: ["Corporate", "Life & love", "Arts & entertainment"] },
  { id: "little-atlantis", title: "Little Atlantis", image: "/decor-v2/11-little-atlantis-v2.webp", palette: ["#37a7ad", "#ef7763", "#e9f4ee"], mood: "Playful · immersive · polished", venue: "Family event room", startingAt: 1950, bestFor: ["Life & love", "Education & youth"] },
  { id: "edge-ocean", title: "Edge of the Ocean", image: "/decor-v2/12-edge-of-ocean-v2.webp", palette: ["#365660", "#bc6d6d", "#d7a250"], mood: "Elemental · private · unforgettable", venue: "Coastal shelter", startingAt: 1850, bestFor: ["Life & love", "Sport & wellness"] },
  { id: "north-star", title: "North Star", image: "/decor-v2/13-north-star-gala-v2.webp", palette: ["#10243e", "#d89a47", "#f0e8d9"], mood: "Cinematic · prestigious · composed", venue: "Convention ballroom", startingAt: 9800, bestFor: ["Corporate", "Education & youth", "Sport & wellness"] },
  { id: "coral-lab", title: "Coral Lab", image: "/decor-v2/14-coral-launch-v2.webp", palette: ["#ee6d5f", "#f3efea", "#b8d4d3"], mood: "Fresh · precise · camera-ready", venue: "Contemporary studio", startingAt: 6200, bestFor: ["Corporate", "Arts & entertainment", "Education & youth"] },
  { id: "harbour-blue", title: "Harbour Blue", image: "/decor-v2/15-harbour-blue-v2.webp", palette: ["#174d65", "#becbd0", "#b36c42"], mood: "Local · generous · contemporary", venue: "Waterfront event hall", startingAt: 7100, bestFor: ["Community & civic", "Corporate", "Sport & wellness"] },
  { id: "convocation", title: "Convocation House", image: "/decor-v2/16-convocation-v2.webp", palette: ["#762a3a", "#eee1c6", "#ae8d55"], mood: "Proud · tailored · celebratory", venue: "Heritage reception room", startingAt: 3600, bestFor: ["Education & youth", "Corporate"] },
  { id: "still-garden", title: "The Still Garden", image: "/decor-v2/17-still-garden-v2.webp", palette: ["#526857", "#f4f0e7", "#a6a49a"], mood: "Gentle · natural · dignified", venue: "Quiet reception hall", startingAt: 2100, bestFor: ["Life & love", "Culture & faith"] },
  { id: "winter-social", title: "Winter Social", image: "/decor-v2/18-winter-social-v2.webp", palette: ["#26483a", "#762d35", "#bd9554"], mood: "Festive · warm · deeply textured", venue: "Heritage hall", startingAt: 5800, bestFor: ["Seasonal", "Corporate", "Culture & faith"] },
  { id: "jewel-sangeet", title: "Jewel Garden", image: "/event-world/01-jewel-sangeet.webp", palette: ["#e85d27", "#bd1e6b", "#304c32"], mood: "Joyful · floral · immersive", venue: "Contemporary celebration hall", startingAt: 8400, bestFor: ["Culture & faith", "Life & love"] },
  { id: "orchard-vow", title: "Orchard Vow", image: "/event-world/02-orchard-vow-renewal.webp", palette: ["#f2e6d2", "#df9f62", "#657052"], mood: "Golden · natural · generous", venue: "Atlantic tented garden", startingAt: 7200, bestFor: ["Life & love", "Seasonal"] },
  { id: "harbour-engagement", title: "Harbour Plum", image: "/event-world/03-harbour-engagement.webp", palette: ["#5b284a", "#b3a92e", "#d9d1c4"], mood: "Private · atmospheric · polished", venue: "Enclosed harbour rooftop", startingAt: 3900, bestFor: ["Life & love", "Corporate"] },
  { id: "violet-formal", title: "Violet Formal", image: "/event-world/04-violet-formal.webp", palette: ["#3f244d", "#a477a5", "#c8c5c3"], mood: "Electric · elegant · youthful", venue: "Modern event hall", startingAt: 8800, bestFor: ["Education & youth", "Corporate", "Life & love"] },
  { id: "amber-farewell", title: "Amber Quiet", image: "/event-world/05-amber-farewell.webp", palette: ["#b47a36", "#ece3d1", "#667059"], mood: "Serene · respectful · sunlit", venue: "Heritage garden room", startingAt: 2400, bestFor: ["Life & love", "Culture & faith"] },
  { id: "linen-welcome", title: "Linen Welcome", image: "/event-world/06-linen-welcome-day.webp", palette: ["#e9e1d1", "#a7ad91", "#e5c66d"], mood: "Tender · tactile · modern", venue: "Glass-and-timber garden room", startingAt: 3100, bestFor: ["Life & love", "Education & youth"] },
  { id: "ruby-coming-age", title: "Ruby Passage", image: "/event-world/07-ruby-coming-of-age.webp", palette: ["#9c1823", "#d3b3a5", "#583c31"], mood: "Confident · celebratory · tailored", venue: "Contemporary ballroom", startingAt: 7900, bestFor: ["Culture & faith", "Education & youth", "Life & love"] },
  { id: "jade-reunion", title: "Jade Lantern Table", image: "/event-world/08-jade-lantern-reunion.webp", palette: ["#24513b", "#b52e2f", "#efe3cf"], mood: "Communal · abundant · warm", venue: "Timber gathering hall", startingAt: 6800, bestFor: ["Culture & faith", "Community & civic", "Life & love"] },
  { id: "indigo-feast", title: "Moonlit Indigo", image: "/event-world/09-moonlit-indigo-feast.webp", palette: ["#172c55", "#c3985d", "#eee2cc"], mood: "Hospitable · composed · luminous", venue: "Glass atrium", startingAt: 7200, bestFor: ["Culture & faith", "Community & civic"] },
  { id: "prismatic-pride", title: "Prismatic Commons", image: "/event-world/10-prismatic-pride.webp", palette: ["#dd567c", "#4b89b7", "#e4b63f"], mood: "Inclusive · luminous · grown-up", venue: "Waterfront warehouse", startingAt: 8300, bestFor: ["Culture & faith", "Community & civic", "Arts & entertainment"] },
  { id: "future-forum", title: "Future Forum", image: "/event-world/11-future-forum.webp", palette: ["#12223f", "#d6dbda", "#b9e14b"], mood: "Intelligent · architectural · focused", venue: "Convention hall", startingAt: 14800, bestFor: ["Corporate", "Education & youth"] },
  { id: "open-exchange", title: "Open Exchange", image: "/event-world/12-open-exchange-expo.webp", palette: ["#eee8dc", "#166574", "#d8ef58"], mood: "Welcoming · clear · modular", venue: "Exhibition concourse", startingAt: 12000, bestFor: ["Corporate", "Community & civic", "Education & youth"] },
  { id: "fogline-mixer", title: "Fogline Mixer", image: "/event-world/13-fogline-mixer.webp", palette: ["#303332", "#6d2836", "#7b9b8c"], mood: "Tailored · local · conversational", venue: "Enclosed harbour rooftop", startingAt: 5600, bestFor: ["Corporate", "Life & love"] },
  { id: "first-light", title: "First Light Opening", image: "/event-world/14-first-light-opening.webp", palette: ["#efece4", "#db6c35", "#334d87"], mood: "Optimistic · refined · camera-ready", venue: "Contemporary public space", startingAt: 5900, bestFor: ["Corporate", "Community & civic", "Arts & entertainment"] },
  { id: "team-table", title: "The Team Table", image: "/event-world/15-team-table.webp", palette: ["#d8c9ad", "#4e6244", "#342d28"], mood: "Warm · collaborative · grounded", venue: "Converted industrial hall", startingAt: 6700, bestFor: ["Corporate", "Education & youth"] },
  { id: "research-salon", title: "Research Salon", image: "/event-world/16-research-salon.webp", palette: ["#ece1c8", "#1f3855", "#742f3a"], mood: "Scholarly · calm · considered", venue: "University atrium", startingAt: 7400, bestFor: ["Education & youth", "Corporate"] },
  { id: "lakeside-regatta", title: "Lakeside Regatta", image: "/event-world/17-lakeside-regatta.webp", palette: ["#214c6a", "#f1eee5", "#a52832"], mood: "Weather-ready · generous · distinctly local", venue: "Newfoundland lakefront", startingAt: 13200, bestFor: ["Sport & wellness", "Community & civic", "Corporate"] },
  { id: "atlantic-folk", title: "Atlantic Folk Night", image: "/event-world/18-atlantic-folk-night.webp", palette: ["#7b2f38", "#153d56", "#b98148"], mood: "Authentic · musical · deeply warm", venue: "Harbour-side timber hall", startingAt: 6200, bestFor: ["Arts & entertainment", "Culture & faith", "Community & civic"] },
  { id: "brick-lane-music", title: "Brick Lane Blue Hour", image: "/event-world/19-brick-lane-music.webp", palette: ["#174b95", "#de6b50", "#ede2cf"], mood: "Urban · intimate · rain-ready", venue: "Historic downtown lane", startingAt: 9800, bestFor: ["Arts & entertainment", "Community & civic"] },
  { id: "water-street-market", title: "Water Street Market", image: "/event-world/20-water-street-market.webp", palette: ["#e9e4da", "#5e9da2", "#d76736"], mood: "Curated · local · welcoming", venue: "Restored commercial hall", startingAt: 8600, bestFor: ["Community & civic", "Arts & entertainment", "Corporate"] },
  { id: "red-white-summer", title: "Red & White Summer", image: "/event-world/21-red-white-summer.webp", palette: ["#f2efe6", "#a92c32", "#66805a"], mood: "Civic · open-air · optimistic", venue: "Atlantic waterfront lawn", startingAt: 16800, bestFor: ["Seasonal", "Community & civic", "Sport & wellness"] },
  { id: "moss-brass-social", title: "Moss & Brass Social", image: "/event-world/22-moss-brass-social.webp", palette: ["#314d36", "#eee1c5", "#806044"], mood: "Heritage · convivial · sophisticated", venue: "Historic stone-and-timber hall", startingAt: 6900, bestFor: ["Seasonal", "Culture & faith", "Arts & entertainment"] },
  { id: "icefire-new-year", title: "Icefire Midnight", image: "/event-world/23-icefire-new-year.webp", palette: ["#b8cfdf", "#343536", "#c68e50"], mood: "Dramatic · luminous · architectural", venue: "Tall-windowed ballroom", startingAt: 11800, bestFor: ["Seasonal", "Corporate", "Life & love"] },
  { id: "festival-light", title: "Festival Light Courtyard", image: "/event-world/24-festival-light-courtyard.webp", palette: ["#dd6c22", "#a61d64", "#4a213e"], mood: "Radiant · respectful · communal", venue: "Sheltered contemporary courtyard", startingAt: 8600, bestFor: ["Culture & faith", "Community & civic", "Seasonal"] },
  { id: "apartment-atelier", title: "Apartment Atelier", image: "/catalogue-expansion/apartment-atelier.webp", palette: ["#e99882", "#b9a0bd", "#c5a47e"], mood: "Intimate · considered · personal", venue: "Apartment or private dining room", startingAt: null, bestFor: ["Life & love", "Seasonal"] },
  { id: "quiet-cove", title: "Quiet Cove", image: "/catalogue-expansion/quiet-cove.webp", palette: ["#7f8d75", "#d8caba", "#eee7d9"], mood: "Gentle · uncluttered · restorative", venue: "Separate quiet room", startingAt: null, bestFor: ["Life & love", "Corporate", "Community & civic", "Education & youth", "Sport & wellness"] },
  { id: "rain-garden", title: "Rain Garden", image: "/catalogue-expansion/rain-garden.webp", palette: ["#667554", "#f0eee1", "#c6b69d"], mood: "Botanical · sheltered · adaptable", venue: "Indoor garden-room alternative", startingAt: null, bestFor: ["Life & love", "Seasonal", "Community & civic", "Culture & faith"] },
  { id: "open-circle", title: "Open Circle", image: "/catalogue-expansion/open-circle.webp", palette: ["#d99b7c", "#b9a0bc", "#f1ecdf"], mood: "Welcoming · grounded · connected", venue: "Level community ceremony room", startingAt: null, bestFor: ["Life & love", "Culture & faith", "Community & civic"] },
  { id: "makers-workshop", title: "Makers’ Workshop", image: "/catalogue-expansion/makers-workshop.webp", palette: ["#dda17b", "#486d59", "#c8a67d"], mood: "Tactile · collaborative · colourful", venue: "Hands-on workshop studio", startingAt: null, bestFor: ["Corporate", "Education & youth", "Arts & entertainment", "Community & civic"] },
  { id: "screen-salon", title: "Screen & Salon", image: "/catalogue-expansion/screen-salon.webp", palette: ["#624753", "#c8bba6", "#b59e7b"], mood: "Connected · composed · conversational", venue: "Hybrid meeting room", startingAt: null, bestFor: ["Corporate", "Education & youth"] },

];

export const eventCollections: EventCollection[] = [
  {
    id: "ceremony-romance",
    title: "Ceremony & Romance",
    kicker: "Collection 01",
    description: "Distinct rooms for proposals, ceremonies, receptions and private promises—from Atlantic restraint to an open, level ceremony layout.",
    directionIds: ["pearl-sage", "nocturne", "clay-rose", "afterglow", "orchard-vow", "harbour-engagement", "edge-ocean", "open-circle"],
    defaultEventTitle: "Wedding ceremony & reception",
    planningNote: "Ceremony sightlines, guest comfort and a weather-ready reveal lead the plan.",
  },
  {
    id: "family-milestones",
    title: "Family & Milestones",
    kicker: "Collection 02",
    description: "Warm, expressive environments for arrivals, birthdays, reunions, remembrance and the meaningful days between them.",
    directionIds: ["cloud-nine", "lavender-tea", "little-atlantis", "still-garden", "amber-farewell", "linen-welcome", "team-table", "apartment-atelier", "quiet-cove"],
    defaultEventTitle: "Milestone birthday",
    planningNote: "Age, accessibility, family flow and the emotional tone of the gathering shape every adaptation.",
  },
  {
    id: "business-academia",
    title: "Business & Academia",
    kicker: "Collection 03",
    description: "Architectural, brand-aware settings for conferences, launches, awards, research and academic achievement.",
    directionIds: ["winter-chrome", "north-star", "coral-lab", "convocation", "future-forum", "open-exchange", "research-salon", "makers-workshop", "screen-salon"],
    defaultEventTitle: "Conference or convention",
    planningNote: "Screen visibility, production access, sponsor hierarchy and measurable guest flow remain non-negotiable.",
  },
  {
    id: "arts-music-nightlife",
    title: "Arts, Music & Nightlife",
    kicker: "Collection 04",
    description: "Performance-ready spaces for music, film, fashion, markets and social nights—composed for both audience and camera.",
    directionIds: ["blue-hour", "emerald", "violet-formal", "first-light", "atlantic-folk", "brick-lane-music", "water-street-market"],
    defaultEventTitle: "Live concert",
    planningNote: "Audience circulation, technical control, performer routes and fast scenic resets are built into the brief.",
  },
  {
    id: "culture-faith-diaspora",
    title: "Culture, Faith & Diaspora",
    kicker: "Collection 05",
    description: "Host-led celebration environments that begin with hospitality and protocol—not generic motifs or borrowed symbols.",
    directionIds: ["heritage-gold", "jewel-sangeet", "ruby-coming-age", "jade-reunion", "indigo-feast", "prismatic-pride", "festival-light"],
    defaultEventTitle: "Ghanaian or West African diaspora celebration",
    planningNote: "Country, region, textile provenance, symbols and ceremonial protocol are confirmed with the host before design approval.",
  },
  {
    id: "atlantic-outdoor-seasonal",
    title: "Atlantic, Outdoor & Seasonal",
    kicker: "Collection 06",
    description: "Weather-aware rooms and public formats for sport, waterfront hospitality, winter gatherings and calendar moments.",
    directionIds: ["harbour-blue", "winter-social", "fogline-mixer", "lakeside-regatta", "red-white-summer", "moss-brass-social", "icefire-new-year", "rain-garden"],
    defaultEventTitle: "Rowing regatta",
    planningNote: "Wind, wet ground, ballast, accessible routes, shortened daylight and seasonal substitutions drive the specification.",
  },
];

export const collectionIdForEvent = (event: EventType): EventCollectionId => {
  const title = event.title;
  if (event.category === "Life & love") {
    return /wedding|elopement|engagement|proposal|bridal|bachelor|bachelorette|stag-and-doe|anniversary|vow renewal/i.test(title)
      ? "ceremony-romance"
      : "family-milestones";
  }
  if (event.category === "Corporate") {
    return /corporate christmas|holiday party/i.test(title) ? "atlantic-outdoor-seasonal" : "business-academia";
  }
  if (event.category === "Education & youth") {
    return /prom|formal|graduation ball|school carnival|youth talent/i.test(title) ? "arts-music-nightlife" : "business-academia";
  }
  if (event.category === "Arts & entertainment") return "arts-music-nightlife";
  if (event.category === "Culture & faith") {
    if (/newfoundland folk festival|kitchen party/i.test(title)) return "arts-music-nightlife";
    if (/mummering|heritage reception|community social/i.test(title)) return "atlantic-outdoor-seasonal";
    return "culture-faith-diaspora";
  }
  if (event.category === "Community & civic") {
    if (/newcomer welcome/i.test(title)) return "culture-faith-diaspora";
    if (/street festival|market|craft fair|food, beverage|culinary festival|block party/i.test(title)) return "arts-music-nightlife";
    return "atlantic-outdoor-seasonal";
  }
  if (event.category === "Seasonal") {
    return /valentine|galentine/i.test(title) ? "ceremony-romance" : "atlantic-outdoor-seasonal";
  }
  return "atlantic-outdoor-seasonal";
};

export const collectionForEvent = (event: EventType) => eventCollections.find((collection) => collection.id === collectionIdForEvent(event)) ?? eventCollections[0];

export const eventsForCollection = (collection: EventCollection) => events.filter((event) => collectionIdForEvent(event) === collection.id);

export const directionsForCollection = (collection: EventCollection) => collection.directionIds.flatMap((id) => {
  const direction = inspirationDirections.find((candidate) => candidate.id === id);
  return direction ? [direction] : [];
});

const assignedDirectionIds = eventCollections.flatMap((collection) => collection.directionIds);
const knownDirectionIds = new Set(inspirationDirections.map((direction) => direction.id));
if (
  assignedDirectionIds.length !== inspirationDirections.length
  || new Set(assignedDirectionIds).size !== inspirationDirections.length
  || assignedDirectionIds.some((id) => !knownDirectionIds.has(id))
) {
  throw new Error("Every Event World concept must belong to exactly one visual collection.");
}

export const currency = (value: number) => new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  maximumFractionDigits: 0,
}).format(value);
