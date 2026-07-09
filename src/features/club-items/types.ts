export type ClubItemChecklistEntry = {
  id: number;
  checklist: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

export type ClubItem = {
  id: number;
  club: number;
  item: number;
  item_code: string;
  item_description: string;
  quantity: number;
  checklists: ClubItemChecklistEntry[];
};

export type AddOrUpdateClubItemPayload = {
  item: number;
  quantity: number;
};

export type AddOrUpdateClubItemData = {
  id: number;
  club_id: number;
  club_name: string;
  item_code: string;
  quantity: number;
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
};
