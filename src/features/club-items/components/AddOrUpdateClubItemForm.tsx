"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
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
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import type { Item } from "@/features/items/types";

import { clubItemSchema, type ClubItemSchemaValues } from "../schema/club-item.schema";
import type { ClubItemFormValues } from "../types";

type AddOrUpdateClubItemFormProps = {
  defaultValues: ClubItemFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  items: Item[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClubItemSchemaValues) => Promise<void>;
};

export function AddOrUpdateClubItemForm({
  defaultValues,
  isOpen,
  isSubmitting = false,
  items,
  mode,
  onOpenChange,
  onSubmit,
}: AddOrUpdateClubItemFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ClubItemSchemaValues>({
    resolver: zodResolver(clubItemSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create" ? "إضافة صنف للنادي" : "تعديل كمية الصنف داخل النادي"}
            </DialogTitle>
            <DialogDescription className="leading-7">
              {mode === "create"
                ? "اختر صنفًا غير مرتبط بهذا النادي بعد، ثم حدد الكمية المطلوبة لإضافته."
                : "حدّث الكمية الحالية لهذا الصنف داخل النادي. "}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            {mode === "create" && !items.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                لا توجد أصناف جديدة متاحة للإضافة داخل هذه الفئة. لو الصنف موجود بالفعل
                في النادي، استخدم زر تعديل الكمية من صف الصنف.
              </div>
            ) : null}

            <div className="space-y-2">
              <Label htmlFor="club-item-item">الصنف</Label>
              <Controller
                control={control}
                name="item"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="h-12 w-full rounded-2xl bg-background/70 px-4"
                      disabled={!items.length || mode === "edit"}
                      id="club-item-item"
                    >
                      <SelectValue placeholder="اختر الصنف المطلوب" />
                    </SelectTrigger>
                    <SelectContent>
                      {items.map((item) => (
                        <SelectItem key={item.id} value={String(item.id)}>
                          {item.item_code} - {item.description}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.item ? (
                <p className="text-sm text-destructive">{errors.item.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="club-item-quantity">الكمية</Label>
              <Input
                id="club-item-quantity"
                className="h-12 rounded-2xl bg-background/70"
                inputMode="numeric"
                min="1"
                placeholder="اكتب الكمية"
                type="number"
                {...register("quantity")}
              />
              {errors.quantity ? (
                <p className="text-sm text-destructive">{errors.quantity.message}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 flex-row flex-wrap items-center justify-start gap-3 rounded-b-[2rem] border-t border-border/70 bg-secondary/50 px-6 py-4">
            <Button className="min-w-24" type="button" onClick={() => onOpenChange(false)} variant="outline">
              إلغاء
            </Button>
            <Button className="min-w-32" disabled={isSubmitting || !items.length} type="submit">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري الحفظ
                </>
              ) : mode === "create" ? (
                "إضافة الصنف"
              ) : (
                "حفظ الكمية"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
