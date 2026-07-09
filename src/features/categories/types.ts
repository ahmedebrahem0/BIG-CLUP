export type Category = {
  id: number;
  name: string;
  parent: number | null;
  parent_name: string | null;
};

export type CategoryPayload = {
  name: string;
  parent: number | null;
};

export type CategoryFormValues = {
  name: string;
  parent: string;
};
