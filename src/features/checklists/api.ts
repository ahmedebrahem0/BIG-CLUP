import type { Checklist, ChecklistFormValues } from "./types";

export const defaultChecklistFormValues: ChecklistFormValues = {
  name: "",
};

export function mapChecklistToFormValues(
  checklist: Checklist | null
): ChecklistFormValues {
  if (!checklist) {
    return defaultChecklistFormValues;
  }

  return {
    name: checklist.name,
  };
}
