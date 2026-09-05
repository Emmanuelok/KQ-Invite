export const weddingContent = {
  couple: {
    first: "Kingsford",
    second: "Perla",
    monogram: "K · P",
  },
  engagement: {
    dateISO: "2026-08-29",
    dateDisplay: "29 August 2026",
    dateShort: "29 · 08 · 26",
  },
  event: {
    dateISO: "2026-09-19",
    dateDisplay: "Saturday, 19 September 2026",
    dateShort: "19 · 09 · 26",
    locationDisplay: "Ramada by Wyndham St. John’s",
    address: "102 Kenmount Road, St. John’s, NL A1B 3R2",
    phone: "+1 709 722 9330",
    mapUrl: "https://www.google.com/maps/dir/?api=1&destination=Ramada+by+Wyndham+St.+John%27s%2C+102+Kenmount+Road%2C+St.+John%27s%2C+NL+A1B+3R2&travelmode=driving",
    venueUrl: "https://www.wyndhamhotels.com/ramada/st-john-newfoundland/ramada-st-johns/overview",
    venueImageUrl: "/ramada-st-johns-exterior.jpg",
    venueImageCredit: "Wyndham Hotels",
    rsvpDeadline: null as string | null,
  },
  navigation: [
    { label: "Welcome", href: "#welcome" },
    { label: "Our story", href: "#story" },
    { label: "Ceremony", href: "#celebration" },
    { label: "Travel", href: "#travel" },
    { label: "Questions", href: "#questions" },
  ],
  storyChapters: [
    {
      number: "I",
      title: "Grace",
      kicker: "The quiet beginning",
      body: "Some stories begin with a grand plan. The most precious ones begin with grace—then unfold one faithful step at a time.",
    },
    {
      number: "II",
      title: "Purpose",
      kicker: "Choosing one direction",
      body: "In laughter, prayer and the ordinary moments, two lives found a shared language: love anchored in purpose.",
    },
    {
      number: "III",
      title: "Forever",
      kicker: "The promise ahead",
      body: "Now we turn toward a new chapter, grateful for everyone whose love, counsel and prayers helped bring us here.",
    },
  ],
  schedule: [
    {
      label: "Wedding ceremony",
      sequence: "01",
      detail: "Saturday, 19 September 2026 at Ramada by Wyndham St. John’s. Ceremony details and the confirmed arrival time will be published here.",
      note: "Wedding ceremony",
    },
  ],
  faqs: [
    {
      question: "When and where is the wedding?",
      answer:
        "The wedding ceremony is on Saturday, 19 September 2026 at Ramada by Wyndham St. John’s, 102 Kenmount Road. The confirmed arrival time will be published on this website, which will always hold the verified directions.",
    },
    {
      question: "Do I need a formal invitation or RSVP?",
      answer:
        "No formal invitation or RSVP is required to attend. The ceremony will be a joyful service of worship, covenant and celebration. An optional attendance notice simply helps us prepare the room and welcome everyone comfortably.",
    },
    {
      question: "What should I wear?",
      answer:
        "Formal wedding attire is warmly encouraged. Choose something polished and comfortable for an indoor ceremony.",
    },
    {
      question: "What if I have accessibility or support needs?",
      answer:
        "Please include them in your optional attendance notice. We will treat the information privately and coordinate with the venue to make the ceremony welcoming.",
    },
    {
      question: "Will travel and accommodation guidance be available?",
      answer:
        "Yes. The venue offers free parking. St. John’s International Airport publishes a fixed taxi fare to the Ramada, and Metrobus can connect the airport area to Kenmount Road; use the live travel links on this page because schedules can change.",
    },
    {
      question: "How can I send a gift?",
      answer:
        "Your presence and prayers come first. If you would like to send a gift, you may use Interac e-Transfer to perlaazametim@gmail.com.",
    },
  ],
} as const;
