export type SupplierStatus = "pending" | "approved" | "rejected";

export type SupplierDocument = {
  id: number;
  file: string;
};

export type Supplier = {
  id: number;
  name: string;
  commercial_register: string;
  tax_card: string;
  contact_person: string;
  contact_phone: string;
  contact_title: string;
  documents: SupplierDocument[] | string | null;
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
  documents?: File[];
  status: SupplierStatus;
  rejection_reason: string;
};

export type SupplierPayload = FormData;
