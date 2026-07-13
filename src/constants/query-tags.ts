export const QUERY_TAGS = {
  CLUBS: "Clubs",
  CATEGORIES: "Categories",
  CHECKLISTS: "Checklists",
  ITEMS: "Items",
  SUPPLIERS: "Suppliers",
  RECEIPTS: "Receipts",
  CLUB_CATEGORIES: "ClubCategories",
  CLUB_ITEMS: "ClubItems",
} as const;

export type QueryTag = (typeof QUERY_TAGS)[keyof typeof QUERY_TAGS];
