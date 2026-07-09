import { z } from "zod";

export const checklistSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم عنصر المتابعة يجب أن يحتوي على حرفين على الأقل.")
    .max(150, "اسم عنصر المتابعة طويل جدًا."),
});

export type ChecklistSchemaValues = z.infer<typeof checklistSchema>;
