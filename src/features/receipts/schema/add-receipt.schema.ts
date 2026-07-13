import { z } from "zod";

export function createAddReceiptSchema(maxQuantity: number) {
  return z.object({
    supplier: z.string().min(1, "اختيار المورد مطلوب."),
    quantity_received: z
      .string()
      .min(1, "الكمية المستلمة مطلوبة.")
      .regex(/^\d+$/, "الكمية المستلمة يجب أن تكون رقمًا صحيحًا.")
      .refine((value) => Number(value) > 0, "الكمية المستلمة يجب أن تكون أكبر من صفر.")
      .refine(
        (value) => Number(value) <= maxQuantity,
        `الكمية المتاحة للتوريد هي ${maxQuantity} فقط.`
      ),
  });
}

export type AddReceiptSchemaValues = {
  supplier: string;
  quantity_received: string;
};
