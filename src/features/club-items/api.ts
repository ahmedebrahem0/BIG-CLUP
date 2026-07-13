import type {
  AddOrUpdateClubItemPayload,
  ClubItem,
  ClubItemFormValues,
} from "./types";

export const defaultClubItemFormValues: ClubItemFormValues = {
  item: "",
  note: "",
  quantity: "1",
  suppliers: [],
};

export function mapClubItemToFormValues(clubItem: ClubItem | null): ClubItemFormValues {
  if (!clubItem) {
    return defaultClubItemFormValues;
  }

  return {
    item: String(clubItem.item),
    note: clubItem.note ?? "",
    quantity: String(clubItem.quantity),
    suppliers: clubItem.suppliers?.map((supplier) => String(supplier.id)) ?? [],
  };
}

export function mapClubItemFormValuesToPayload(
  values: ClubItemFormValues
): AddOrUpdateClubItemPayload {
  return {
    item: Number(values.item),
    note: values.note?.trim() ?? "",
    quantity: Number(values.quantity),
    suppliers: values.suppliers.map((supplierId) => Number(supplierId)),
  };
}
