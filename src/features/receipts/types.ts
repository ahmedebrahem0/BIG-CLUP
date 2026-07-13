export type Receipt = {
  id: number;
  club_name: string;
  club_item: string;
  quantity_received: number;
  supplier: string;
  created_at: string;
};

export type AddReceiptPayload = {
  club_item: number;
  supplier: number;
  quantity_received: number;
};

export type AddReceiptResponse = {
  message: string;
  data: AddReceiptPayload;
};
