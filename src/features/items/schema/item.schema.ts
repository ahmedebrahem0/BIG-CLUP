import { z } from "zod";

export const itemSchema = z.object({
  category: z.string().min(1, "اختيار الفئة مطلوب."),
  item_code: z
    .string()
    .trim()
    .min(2, "كود الصنف يجب أن يحتوي على حرفين على الأقل.")
    .max(100, "كود الصنف طويل جدًا."),
  description: z
    .string()
    .trim()
    .min(5, "الوصف يجب أن يحتوي على 5 أحرف على الأقل.")
    .max(1000, "الوصف طويل جدًا."),
});

export type ItemSchemaValues = z.infer<typeof itemSchema>;
