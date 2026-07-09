export type ItemChecklistEntry = {
  id: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

export type Item = {
  id: number;
  category: number;
  category_name: string;
  item_code: string;
  description: string;
  checklists: ItemChecklistEntry[];
};

export type ItemPayload = {
  category: number;
  item_code: string;
  description: string;
};

export type ItemFormValues = {
  category: string;
  item_code: string;
  description: string;
};
