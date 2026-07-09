import { z } from "zod";

export const clubItemSchema = z.object({
  item: z.string().min(1, "اختيار الصنف مطلوب."),
  quantity: z
    .string()
    .min(1, "الكمية مطلوبة.")
    .refine((value) => Number(value) > 0, "الكمية يجب أن تكون أكبر من صفر."),
});

export type ClubItemSchemaValues = z.infer<typeof clubItemSchema>;
