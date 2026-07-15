export type SupplierStatus = "pending" | "approved" | "rejected";

export type Supplier = {
  id: number;
  name: string;
  commercial_register: string;
  tax_card: string;
  contact_person: string;
  contact_phone: string;
  contact_title: string;
  documents: string | null;
  status: SupplierStatus;
  rejection_reason: string | null;
};

export type SupplierFormValues = {
  name: string;
  commercial_register: string;
  tax_card: string;
  contact_person: string;
  contact_phone: string;
  contact_title: string;
  documents?: FileList;
  status: SupplierStatus;
  rejection_reason: string;
};

export type SupplierPayload = FormData;