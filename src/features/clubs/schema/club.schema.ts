import { z } from "zod";

export const clubSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم النادي يجب أن يحتوي على حرفين على الأقل.")
    .max(100, "اسم النادي طويل جدًا."),
});

export type ClubSchemaValues = z.infer<typeof clubSchema>;
