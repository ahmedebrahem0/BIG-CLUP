export type ClubItemChecklistEntry = {
  id: number;
  checklist: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

export type ClubItemSupplier = {
  id: number;
  name: string;
};

export type ClubItem = {
  id: number;
  club: number;
  item: number;
  item_code: string;
  item_description: string;
  quantity: number;
  received_quantity: number;
  note: string;
  suppliers: ClubItemSupplier[];
  checklists: ClubItemChecklistEntry[];
};

export type AddOrUpdateClubItemPayload = {
  item: number;
  quantity: number;
  note?: string;
  suppliers?: number[];
};

export type AddOrUpdateClubItemData = {
  id: number;
  club_id: number;
  club_name: string;
  item_code: string;
  quantity: number;
  received_quantity?: number;
  note?: string;
  suppliers?: ClubItemSupplier[];
};

export type AddOrUpdateClubItemResponse = {
  message: string;
  data: AddOrUpdateClubItemData;
};

export type UpdateClubChecklistStatusPayload = {
  is_completed: boolean;
};

export type UpdateClubChecklistStatusResponse = {
  message: string;
  data: {
    is_completed: boolean;
  };
};

export type ClubItemFormValues = {
  item: string;
  quantity: string;
  note: string;
  suppliers: string[];
};
