import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "اسم المورد يجب أن يحتوي على حرفين على الأقل.")
    .max(100, "اسم المورد طويل جدًا."),
  commercial_register: z.string().trim().min(1, "رقم السجل التجاري مطلوب."),
  tax_card: z.string().trim().min(1, "رقم البطاقة الضريبية مطلوب."),
  contact_person: z.string().trim().min(1, "اسم مسؤول التواصل مطلوب."),
  contact_phone: z.string().trim().min(1, "رقم هاتف المسؤول مطلوب."),
  contact_title: z.string().trim().min(1, "المسمى الوظيفي مطلوب."),
  documents: z.any().optional(),
  status: z.enum(["pending", "approved", "rejected"]),
  rejection_reason: z.string().trim(),
});

export type SupplierSchemaValues = z.infer<typeof supplierSchema>;