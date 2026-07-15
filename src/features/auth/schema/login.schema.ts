import { z } from "zod";

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, "اسم المستخدم مطلوب.")
    .regex(/^[a-z0-9_.-]+$/, "اسم المستخدم لازم يكون بحروف صغيرة فقط."),
  password: z.string().min(1, "كلمة المرور مطلوبة."),
});

export type LoginSchemaValues = z.infer<typeof loginSchema>;