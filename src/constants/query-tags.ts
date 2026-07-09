export const QUERY_TAGS = {
  CLUBS: "Clubs",
  CATEGORIES: "Categories",
  CHECKLISTS: "Checklists",
  ITEMS: "Items",
  CLUB_CATEGORIES: "ClubCategories",
  CLUB_ITEMS: "ClubItems",
} as const;

export type QueryTag = (typeof QUERY_TAGS)[keyof typeof QUERY_TAGS];