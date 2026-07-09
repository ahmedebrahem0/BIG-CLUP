import { format } from "date-fns";

export function formatDate(value: string | number | Date, pattern = "dd MMM yyyy") {
  return format(new Date(value), pattern);
}
