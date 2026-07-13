import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم المورد يجب أن يحتوي على حرفين على الأقل.")
    .max(100, "اسم المورد طويل جدًا."),
});

export type SupplierSchemaValues = z.infer<typeof supplierSchema>;
