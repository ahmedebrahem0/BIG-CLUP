import type {
  AddOrUpdateClubItemPayload,
  ClubItem,
  ClubItemFormValues,
} from "./types";

export const defaultClubItemFormValues: ClubItemFormValues = {
  item: "",
  quantity: "1",
};

export function mapClubItemToFormValues(clubItem: ClubItem | null): ClubItemFormValues {
  if (!clubItem) {
    return defaultClubItemFormValues;
  }

  return {
    item: String(clubItem.item),
    quantity: String(clubItem.quantity),
  };
}

export function mapClubItemFormValuesToPayload(
  values: ClubItemFormValues
): AddOrUpdateClubItemPayload {
  return {
    item: Number(values.item),
    quantity: Number(values.quantity),
  };
}
