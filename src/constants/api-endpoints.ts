export const API_ENDPOINTS = {
  clubs: "/items/clubs/",
  categories: "/items/categories/",
  checklists: "/items/checklists/",
  items: "/items/items/",
  suppliers: "/items/suppliers/",
  receipts: "/items/receipts/",
  addReceipt: "/items/add-receipt/",

  clubCategories: (clubId: number) =>
    `/items/clubs/${clubId}/categories/`,

  clubItemsByCategory: (clubId: number, categoryId: number) =>
    `/items/clubs/${clubId}/categories/${categoryId}/`,

  addOrUpdateItemInClub: (clubId: number) =>
    `/items/clubs/${clubId}/add-item/`,

  updateClubChecklistStatus: (checklistEntryId: number) =>
    `/items/checklists/${checklistEntryId}/update/`,

  updateItemChecklistStatus: (checklistEntryId: number) =>
    `/items/items/checklists/${checklistEntryId}/update/`,
} as const;
