"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  checklistSchema,
  type ChecklistSchemaValues,
} from "../schema/checklist.schema";
import type { ChecklistFormValues } from "../types";

type ChecklistFormProps = {
  defaultValues: ChecklistFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ChecklistSchemaValues) => Promise<void>;
};

export function ChecklistForm({
  defaultValues,
  isOpen,
  isSubmitting = false,
  mode,
  onOpenChange,
  onSubmit,
}: ChecklistFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ChecklistSchemaValues>({
    resolver: zodResolver(checklistSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create"
                ? "إضافة عنصر متابعة جديد"
                : "تعديل عنصر المتابعة"}
            </DialogTitle>
            <DialogDescription className="leading-7">
              {mode === "create"
                ? "أضف خطوة متابعة جديدة لتكون متاحة لاحقًا على مستوى الأصناف ومساحة العمل."
                : "حدّث اسم عنصر المتابعة مع الاحتفاظ بنفس المعرف داخل النظام."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2 px-6 py-6">
            <Label htmlFor="checklist-name">اسم عنصر المتابعة</Label>
            <Input
              id="checklist-name"
              className="h-12 rounded-2xl bg-background/70"
              placeholder="اكتب اسم عنصر المتابعة"
              {...register("name")}
            />
            {errors.name ? (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            ) : null}
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 flex-row flex-wrap items-center justify-start gap-3 rounded-b-[2rem] border-t border-border/70 bg-secondary/50 px-6 py-4">
            <Button
              className="min-w-24"
              type="button"
              onClick={() => onOpenChange(false)}
              variant="outline"
            >
              إلغاء
            </Button>
            <Button className="min-w-32" disabled={isSubmitting} type="submit">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري الحفظ
                </>
              ) : mode === "create" ? (
                "إضافة العنصر"
              ) : (
                "حفظ التعديل"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

