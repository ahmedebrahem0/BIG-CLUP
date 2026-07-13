import type { Supplier, SupplierFormValues } from "./types";

export const defaultSupplierFormValues: SupplierFormValues = {
  name: "",
};

export function mapSupplierToFormValues(
  supplier: Supplier | null
): SupplierFormValues {
  if (!supplier) {
    return defaultSupplierFormValues;
  }

  return {
    name: supplier.name,
  };
}
