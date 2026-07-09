"use client";

import { useEffect, useMemo } from "react";
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

import {
  categorySchema,
  type CategorySchemaValues,
} from "../schema/category.schema";
import { buildCategoryTree } from "../lib/buildCategoryTree";
import type { Category, CategoryFormValues } from "../types";

type CategoryFormProps = {
  categories: Category[];
  currentCategoryId?: number;
  defaultValues: CategoryFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: CategorySchemaValues) => Promise<void>;
};

export function CategoryForm({
  categories,
  currentCategoryId,
  defaultValues,
  isOpen,
  isSubmitting = false,
  mode,
  onOpenChange,
  onSubmit,
}: CategoryFormProps) {
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<CategorySchemaValues>({
    resolver: zodResolver(categorySchema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  const parentOptions = useMemo(() => {
    return buildCategoryTree(categories).filter(
      (category) => category.id !== currentCategoryId
    );
  }, [categories, currentCategoryId]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create" ? "إضافة فئة جديدة" : "تعديل بيانات الفئة"}
            </DialogTitle>
            <DialogDescription className="leading-7">
              {mode === "create"
                ? "أنشئ فئة رئيسية أو فرعية مع ربط اختياري بفئة أب." 
                : "حدّث اسم الفئة أو عدّل ارتباطها ضمن الهيكل الهرمي الحالي."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            <div className="space-y-2">
              <Label htmlFor="category-name">اسم الفئة</Label>
              <Input
                id="category-name"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="اكتب اسم الفئة"
                {...register("name")}
              />
              {errors.name ? (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category-parent">الفئة الأب</Label>
              <Controller
                control={control}
                name="parent"
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger
                      className="h-12 w-full rounded-2xl bg-background/70 px-4"
                      id="category-parent"
                    >
                      <SelectValue placeholder="اختر الفئة الأب إن وجدت" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="root">بدون أب (فئة رئيسية)</SelectItem>
                      {parentOptions.map((category) => (
                        <SelectItem key={category.id} value={String(category.id)}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.parent ? (
                <p className="text-sm text-destructive">{errors.parent.message}</p>
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
                "إضافة الفئة"
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

