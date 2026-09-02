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
    mapUrl: "https://www.google.com/maps/search/?api=1&query=47.555100%2C-52.767399",
    venueUrl: "https://www.wyndhamhotels.com/ramada/st-john-newfoundland/ramada-st-johns/overview",
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
      detail: "Saturday, 19 September 2026 at Ramada by Wyndham St. John’s. Your invitation will carry the confirmed arrival time.",
      note: "Ceremony only · No reception will follow",
    },
  ],
  faqs: [
    {
      question: "When and where is the wedding?",
      answer:
        "The wedding ceremony is on Saturday, 19 September 2026 at Ramada by Wyndham St. John’s, 102 Kenmount Road. Your invitation will carry the confirmed arrival time; this website will always hold the verified directions.",
    },
    {
      question: "Will there be a reception?",
      answer:
        "No. This invitation is for the wedding ceremony only. There will be no reception or formal meal after the ceremony.",
    },
    {
      question: "Can I bring a guest or children?",
      answer:
        "Your invitation and RSVP confirmation will show the number of seats reserved for your household. If anything looks incorrect, please contact the couple before submitting a second response.",
    },
    {
      question: "What should I wear?",
      answer:
        "Formal wedding attire is warmly encouraged. Choose something polished and comfortable for an indoor ceremony.",
    },
    {
      question: "What if I have accessibility or support needs?",
      answer:
        "Please include them in your RSVP. We will treat the information privately and coordinate with the venue to make the ceremony welcoming.",
    },
    {
      question: "Will travel and accommodation guidance be available?",
      answer:
        "Yes. The venue offers free parking. St. John’s International Airport publishes a fixed taxi fare to the Ramada, and Metrobus can connect the airport area to Kenmount Road; use the live travel links on this page because schedules can change.",
    },
    {
      question: "Is there a gift registry?",
      answer:
        "Your presence and prayers come first. Our secure gift centre lets you reserve a keepsake or privately request verified contribution instructions. We will never change payment details through a forwarded message.",
    },
  ],
} as const;
