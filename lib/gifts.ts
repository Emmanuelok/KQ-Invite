export type GiftCatalogItem = {
  key: string;
  label: string;
  description: string;
  kind: "contribution" | "keepsake" | "experience";
  accent: string;
};

export const giftCatalog: GiftCatalogItem[] = [
  {
    key: "first-home",
    label: "Our First Home Fund",
    description: "Help us place one meaningful brick in the home we will build together.",
    kind: "contribution",
    accent: "A shared beginning",
  },
  {
    key: "honeymoon-memory",
    label: "A Honeymoon Memory",
    description: "Contribute toward one unforgettable experience in our first adventure as newlyweds.",
    kind: "contribution",
    accent: "Adventure, together",
  },
  {
    key: "date-night",
    label: "Dinner for Two",
    description: "Gift us a beautiful evening to slow down, reconnect and remember the celebration.",
    kind: "experience",
    accent: "Time for two",
  },
  {
    key: "wedding-album",
    label: "The Wedding Album",
    description: "A keepsake that will hold the faces, vows and joyful details for generations.",
    kind: "keepsake",
    accent: "A family heirloom",
  },
  {
    key: "dinner-set",
    label: "Our Celebration Table",
    description: "A timeless dinner set for future holidays, family meals and unexpected guests.",
    kind: "keepsake",
    accent: "Gathered around love",
  },
  {
    key: "blessing",
    label: "A Blessing of Your Choice",
    description: "Choose your own gift, prayer or gesture. We will gratefully receive the love behind it.",
    kind: "experience",
    accent: "From your heart",
  },
];

export const giftMap = new Map(giftCatalog.map((gift) => [gift.key, gift]));
