"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Item } from "@/features/items/types";
import type { Supplier } from "@/features/suppliers/types";

import { clubItemSchema, type ClubItemSchemaValues } from "../schema/club-item.schema";
import type { ClubItemFormValues } from "../types";

export type ClubItemEditTarget = "quantity" | "note" | "suppliers";

type AddOrUpdateClubItemFormProps = {
  defaultValues: ClubItemFormValues;
  editTarget?: ClubItemEditTarget | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  items: Item[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClubItemSchemaValues) => Promise<void>;
  suppliers: Supplier[];
};

const editCopy: Record<ClubItemEditTarget, { title: string; description: string; submit: string }> = {
  note: {
    title: "تعديل ملاحظة الصنف داخل النادي",
    description: "حدّث الملاحظة مع الحفاظ على الكمية والموردين الحاليين لهذا الصنف.",
    submit: "حفظ الملاحظة",
  },
  quantity: {
    title: "تعديل كمية الصنف داخل النادي",
    description: "حدّث الكمية الحالية لهذا الصنف داخل النادي ويمكنك تعديل الملاحظة أو الموردين من نفس النافذة.",
    submit: "حفظ الكمية",
  },
  suppliers: {
    title: "تعديل موردي الصنف داخل النادي",
    description: "اختر الموردين المرتبطين بهذا الصنف. القائمة المرسلة ستستبدل الموردين الحاليين بالكامل.",
    submit: "حفظ الموردين",
  },
};

export function AddOrUpdateClubItemForm({
  defaultValues,
  editTarget = "quantity",
  isOpen,
  isSubmitting = false,
  items,
  mode,
  onOpenChange,
  onSubmit,
  suppliers,
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

  const currentEditCopy = editCopy[editTarget ?? "quantity"];
  const isSubmitDisabled = isSubmitting || (mode === "create" && !items.length);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create" ? "إضافة صنف للنادي" : currentEditCopy.title}
            </DialogTitle>
            <DialogDescription className="leading-7">
              {mode === "create"
                ? "اختر صنفًا غير مرتبط بهذا النادي بعد، ثم حدد الكمية والملاحظة والموردين المرتبطين به."
                : currentEditCopy.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            {mode === "create" && !items.length ? (
              <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                لا توجد أصناف جديدة متاحة للإضافة داخل هذه الفئة. لو الصنف موجود بالفعل
                في النادي، استخدم أزرار التعديل من صف الصنف.
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

            <div className="space-y-2">
              <Label htmlFor="club-item-note">ملاحظة</Label>
              <Textarea
                id="club-item-note"
                className="min-h-24 rounded-2xl bg-background/70"
                placeholder="اكتب ملاحظة اختيارية لهذا الصنف داخل النادي"
                {...register("note")}
              />
              {errors.note ? (
                <p className="text-sm text-destructive">{errors.note.message}</p>
              ) : null}
            </div>

            <div className="space-y-3 rounded-[1.5rem] border border-border/70 bg-background/60 p-4">
              <div>
                <Label>الموردين</Label>
                <p className="mt-1 text-xs leading-6 text-muted-foreground">
                  اختيار الموردين هنا يستبدل قائمة الموردين الحالية للصنف عند الحفظ.
                </p>
              </div>
              <Controller
                control={control}
                name="suppliers"
                render={({ field }) => {
                  const selectedSuppliers = field.value ?? [];

                  return suppliers.length ? (
                    <div className="grid gap-2 sm:grid-cols-2">
                      {suppliers.map((supplier) => {
                        const supplierId = String(supplier.id);
                        const isSelected = selectedSuppliers.includes(supplierId);

                        return (
                          <button
                            className={[
                              "flex items-center gap-3 rounded-2xl border px-4 py-3 text-right text-sm transition-colors",
                              isSelected
                                ? "border-primary/40 bg-primary/10 text-foreground"
                                : "border-border/60 bg-white/80 hover:border-primary/30 hover:bg-primary/5",
                            ].join(" ")}
                            key={supplier.id}
                            onClick={() => {
                              field.onChange(
                                isSelected
                                  ? selectedSuppliers.filter((value) => value !== supplierId)
                                  : [...selectedSuppliers, supplierId]
                              );
                            }}
                            type="button"
                          >
                            <Checkbox checked={isSelected} />
                            <span className="font-medium leading-6">{supplier.name}</span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      لا توجد موردين متاحين حاليًا. يمكنك حفظ الصنف بدون موردين.
                    </p>
                  );
                }}
              />
              {errors.suppliers ? (
                <p className="text-sm text-destructive">{errors.suppliers.message}</p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 flex-row flex-wrap items-center justify-start gap-3 rounded-b-[2rem] border-t border-border/70 bg-secondary/50 px-6 py-4">
            <Button className="min-w-24" type="button" onClick={() => onOpenChange(false)} variant="outline">
              إلغاء
            </Button>
            <Button className="min-w-32" disabled={isSubmitDisabled} type="submit">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري الحفظ
                </>
              ) : mode === "create" ? (
                "إضافة الصنف"
              ) : (
                currentEditCopy.submit
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
