import type { Supplier, SupplierFormValues } from "./types";

export const defaultSupplierFormValues: SupplierFormValues = {
  name: "",
  commercial_register: "",
  tax_card: "",
  contact_person: "",
  contact_phone: "",
  contact_title: "",
  documents: undefined,
  status: "pending",
  rejection_reason: "",
};

export function mapSupplierToFormValues(
  supplier: Supplier | null
): SupplierFormValues {
  if (!supplier) {
    return defaultSupplierFormValues;
  }

  return {
    name: supplier.name,
    commercial_register: supplier.commercial_register,
    tax_card: supplier.tax_card,
    contact_person: supplier.contact_person,
    contact_phone: supplier.contact_phone,
    contact_title: supplier.contact_title,
    documents: undefined,
    status: supplier.status,
    rejection_reason: supplier.rejection_reason ?? "",
  };
}

export function mapSupplierFormToFormData(
  values: SupplierFormValues,
  options: { includeAdminFields: boolean }
) {
  const formData = new FormData();

  formData.set("name", values.name.trim());
  formData.set("commercial_register", values.commercial_register.trim());
  formData.set("tax_card", values.tax_card.trim());
  formData.set("contact_person", values.contact_person.trim());
  formData.set("contact_phone", values.contact_phone.trim());
  formData.set("contact_title", values.contact_title.trim());

  values.documents?.forEach((documentFile) => {
    formData.append("documents", documentFile);
  });

  if (options.includeAdminFields) {
    formData.set("status", values.status);
    formData.set("rejection_reason", values.rejection_reason.trim());
  }

  return formData;
}
