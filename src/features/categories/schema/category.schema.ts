import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم الفئة يجب أن يحتوي على حرفين على الأقل.")
    .max(150, "اسم الفئة طويل جدًا."),
  parent: z.string(),
});

export type CategorySchemaValues = z.infer<typeof categorySchema>;
