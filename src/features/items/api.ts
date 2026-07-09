import type { Item, ItemFormValues, ItemPayload } from "./types";

export const defaultItemFormValues: ItemFormValues = {
  category: "",
  item_code: "",
  description: "",
};

export function mapItemToFormValues(item: Item | null): ItemFormValues {
  if (!item) {
    return defaultItemFormValues;
  }

  return {
    category: String(item.category),
    item_code: item.item_code,
    description: item.description,
  };
}

export function mapItemFormValuesToPayload(values: ItemFormValues): ItemPayload {
  return {
    category: Number(values.category),
    item_code: values.item_code.trim(),
    description: values.description.trim(),
  };
}
