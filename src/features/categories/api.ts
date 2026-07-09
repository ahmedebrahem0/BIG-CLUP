import type { Category, CategoryFormValues, CategoryPayload } from "./types";

export const defaultCategoryFormValues: CategoryFormValues = {
  name: "",
  parent: "root",
};

export function mapCategoryToFormValues(
  category: Category | null
): CategoryFormValues {
  if (!category) {
    return defaultCategoryFormValues;
  }

  return {
    name: category.name,
    parent: category.parent === null ? "root" : String(category.parent),
  };
}

export function mapCategoryFormValuesToPayload(
  values: CategoryFormValues
): CategoryPayload {
  return {
    name: values.name.trim(),
    parent: values.parent === "root" ? null : Number(values.parent),
  };
}
