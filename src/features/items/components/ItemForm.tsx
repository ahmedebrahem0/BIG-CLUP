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

import type { Category } from "@/features/categories/types";

import { itemSchema, type ItemSchemaValues } from "../schema/item.schema";
import type { ItemFormValues } from "../types";

type ItemFormProps = {
  categories: Category[];
  defaultValues: ItemFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ItemSchemaValues) => Promise<void>;
};

export function ItemForm({
  categories,
  defaultValues,
  isOpen,
  isSubmitting = false,
  mode,
  onOpenChange,
  onSubmit,
}: ItemFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<ItemSchemaValues>({
    resolver: zodResolver(itemSchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create" ? "إضافة صنف جديد" : "تعديل بيانات الصنف"}
            </DialogTitle>
            <DialogDescription className="leading-7">
              {mode === "create"
                ? "أنشئ صنفًا جديدًا وحدد الفئة التابعة له مع وصف واضح وكود مميز."
                : "حدّث بيانات الصنف الأساسية مع الحفاظ على حالات المتابعة المرتبطة به."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-5 px-6 py-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="item-category">الفئة</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="h-12 w-full rounded-2xl bg-background/70 px-4"
                      id="item-category"
                    >
                      <SelectValue placeholder="اختر الفئة التابعة للصنف" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category ? (
                <p className="text-sm text-destructive">{errors.category.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="item-code">كود الصنف</Label>
              <Input
                id="item-code"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="مثال: DIRECTOR_DESK_37"
                {...register("item_code")}
              />
              {errors.item_code ? (
                <p className="text-sm text-destructive">{errors.item_code.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="item-description">وصف الصنف</Label>
              <Textarea
                id="item-description"
                className="min-h-32 rounded-2xl bg-background/70"
                placeholder="اكتب وصفًا واضحًا للصنف"
                {...register("description")}
              />
              {errors.description ? (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              ) : null}
            </div>
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
                "إضافة الصنف"
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

