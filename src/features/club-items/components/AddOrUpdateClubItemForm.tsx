"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle } from "lucide-react";

import { Badge } from "@/components/ui/badge";
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

type AddOrUpdateClubItemFormProps = {
  defaultValues: ClubItemFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  items: Item[];
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClubItemSchemaValues) => Promise<void>;
  suppliers: Supplier[];
};

export function AddOrUpdateClubItemForm({
  defaultValues,
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

  const isSubmitDisabled = isSubmitting || (mode === "create" && !items.length);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="w-[min(860px,calc(100vw-2rem))] max-w-none overflow-hidden rounded-[1.5rem] border border-border/70 bg-white p-0 shadow-[0_24px_70px_-42px_rgba(15,23,42,0.55)] sm:max-w-none"
        dir="rtl"
      >
        <form className="flex max-h-[calc(100vh-2rem)] flex-col" onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="shrink-0 border-b border-border/70 px-6 py-5 text-right">
            <DialogTitle className="text-2xl font-semibold leading-9 text-foreground">
              {mode === "create" ? "إضافة صنف للنادي" : "تعديل بيانات الصنف داخل النادي"}
            </DialogTitle>
            <DialogDescription className="text-sm leading-7">
              {mode === "create"
                ? "اختر الصنف وحدد الكمية والملاحظة والموردين المرتبطين به."
                : "يمكنك تعديل الكمية والملاحظة والموردين من نفس النافذة."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex-1 space-y-5 overflow-y-auto px-6 py-5">
            {mode === "create" && !items.length ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-7 text-amber-800">
                لا توجد أصناف جديدة متاحة للإضافة داخل هذه الفئة. لو الصنف موجود بالفعل
                في النادي، استخدم زر تعديل البيانات من صف الصنف.
              </div>
            ) : null}

            <section className="rounded-xl border border-border/70 bg-slate-50/60 p-4">
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="text-base font-semibold text-foreground">بيانات الصنف</h3>
                {mode === "edit" ? (
                  <Badge className="rounded-full px-3" variant="secondary">
                    تعديل
                  </Badge>
                ) : null}
              </div>

              <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_180px]">
                <div className="space-y-2">
                  <Label htmlFor="club-item-item">الصنف</Label>
                  <Controller
                    control={control}
                    name="item"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger
                          className="h-12 w-full rounded-xl bg-white px-4"
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
                    className="h-12 rounded-xl bg-white text-base"
                    inputMode="numeric"
                    min="1"
                    placeholder="الكمية"
                    type="number"
                    {...register("quantity")}
                  />
                  {errors.quantity ? (
                    <p className="text-sm text-destructive">{errors.quantity.message}</p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="grid gap-5 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
              <div className="space-y-2 rounded-xl border border-border/70 bg-white p-4">
                <Label htmlFor="club-item-note">ملاحظة</Label>
                <Textarea
                  id="club-item-note"
                  className="min-h-32 w-full resize-y rounded-xl bg-slate-50/70 text-sm leading-7"
                  placeholder="اكتب ملاحظة اختيارية لهذا الصنف داخل النادي"
                  {...register("note")}
                />
                {errors.note ? (
                  <p className="text-sm text-destructive">{errors.note.message}</p>
                ) : null}
              </div>

              <div className="rounded-xl border border-border/70 bg-white p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <Label>الموردين</Label>
                    <p className="mt-1 text-xs leading-6 text-muted-foreground">
                      سيتم استبدال قائمة الموردين الحالية بما تختاره هنا.
                    </p>
                  </div>
                  <Controller
                    control={control}
                    name="suppliers"
                    render={({ field }) => (
                      <Badge className="shrink-0 rounded-full px-3" variant="secondary">
                        {(field.value ?? []).length} محدد
                      </Badge>
                    )}
                  />
                </div>

                <Controller
                  control={control}
                  name="suppliers"
                  render={({ field }) => {
                    const selectedSuppliers = field.value ?? [];

                    return suppliers.length ? (
                      <div className="grid max-h-56 gap-2 overflow-y-auto pr-1 md:grid-cols-2">
                        {suppliers.map((supplier) => {
                          const supplierId = String(supplier.id);
                          const isSelected = selectedSuppliers.includes(supplierId);

                          return (
                            <button
                              className={[
                                "flex min-h-11 items-center justify-between gap-3 rounded-xl border px-3 py-2 text-right text-sm transition-colors",
                                isSelected
                                  ? "border-primary/40 bg-primary/10 text-foreground"
                                  : "border-border/70 bg-slate-50/70 hover:border-primary/30 hover:bg-primary/5",
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
                              <span className="truncate font-medium leading-6">{supplier.name}</span>
                              <Checkbox checked={isSelected} className="size-5" />
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="rounded-xl bg-slate-50/80 px-4 py-3 text-sm text-muted-foreground">
                        لا توجد موردين متاحين حاليًا. يمكنك حفظ الصنف بدون موردين.
                      </p>
                    );
                  }}
                />
                {errors.suppliers ? (
                  <p className="mt-2 text-sm text-destructive">{errors.suppliers.message}</p>
                ) : null}
              </div>
            </section>
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 shrink-0 flex-row flex-wrap items-center justify-start gap-3 border-t border-border/70 bg-slate-50 px-6 py-4">
            <Button className="min-w-36 rounded-xl" disabled={isSubmitDisabled} type="submit">
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري الحفظ
                </>
              ) : mode === "create" ? (
                "إضافة الصنف"
              ) : (
                "حفظ التعديلات"
              )}
            </Button>
            <Button className="min-w-28 rounded-xl" type="button" onClick={() => onOpenChange(false)} variant="outline">
              إلغاء
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
