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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { supplierSchema, type SupplierSchemaValues } from "../schema/supplier.schema";
import type { SupplierFormValues } from "../types";

type SupplierFormProps = {
  canManageStatus: boolean;
  defaultValues: SupplierFormValues;
  isOpen: boolean;
  isSubmitting?: boolean;
  mode: "create" | "edit";
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: SupplierSchemaValues) => Promise<void>;
};

const statusLabels = {
  pending: "قيد المراجعة",
  approved: "معتمد",
  rejected: "مرفوض",
} as const;

export function SupplierForm({
  canManageStatus,
  defaultValues,
  isOpen,
  isSubmitting = false,
  mode,
  onOpenChange,
  onSubmit,
}: SupplierFormProps) {
  const {
    formState: { errors },
    handleSubmit,
    register,
    reset,
    setValue,
    watch,
  } = useForm<SupplierSchemaValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues,
  });
  const statusValue = watch("status");

  useEffect(() => {
    reset(defaultValues);
  }, [defaultValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] max-w-3xl overflow-y-auto rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <DialogTitle className="text-xl font-semibold text-foreground">
              {mode === "create" ? "إضافة مورد جديد" : "تعديل بيانات المورد"}
            </DialogTitle>
            <DialogDescription className="leading-7">
              أدخل بيانات المورد كاملة كما هي مطلوبة من واجهة SupplierListView.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 px-6 py-6 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="supplier-name">اسم المورد</Label>
              <Input
                id="supplier-name"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="اكتب اسم المورد"
                {...register("name")}
              />
              {errors.name ? <p className="text-sm text-destructive">{errors.name.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="commercial-register">رقم السجل التجاري</Label>
              <Input
                id="commercial-register"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="1234567890"
                {...register("commercial_register")}
              />
              {errors.commercial_register ? (
                <p className="text-sm text-destructive">{errors.commercial_register.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tax-card">رقم البطاقة الضريبية</Label>
              <Input
                id="tax-card"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="9876543210"
                {...register("tax_card")}
              />
              {errors.tax_card ? <p className="text-sm text-destructive">{errors.tax_card.message}</p> : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-person">مسؤول التواصل</Label>
              <Input
                id="contact-person"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="اسم مسؤول التواصل"
                {...register("contact_person")}
              />
              {errors.contact_person ? (
                <p className="text-sm text-destructive">{errors.contact_person.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact-phone">رقم هاتف المسؤول</Label>
              <Input
                id="contact-phone"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="0501234567"
                {...register("contact_phone")}
              />
              {errors.contact_phone ? (
                <p className="text-sm text-destructive">{errors.contact_phone.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="contact-title">المسمى الوظيفي لمسؤول التواصل</Label>
              <Input
                id="contact-title"
                className="h-12 rounded-2xl bg-background/70"
                placeholder="مدير المبيعات"
                {...register("contact_title")}
              />
              {errors.contact_title ? (
                <p className="text-sm text-destructive">{errors.contact_title.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="supplier-documents">ملف المستندات PDF</Label>
              <Input
                id="supplier-documents"
                accept="application/pdf"
                className="h-12 rounded-2xl bg-background/70 file:ml-4 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                type="file"
                {...register("documents")}
              />
            </div>

            {canManageStatus ? (
              <>
                <div className="space-y-2">
                  <Label htmlFor="supplier-status">حالة المورد</Label>
                  <Select
                    value={statusValue}
                    onValueChange={(value) => {
                      setValue("status", value as SupplierSchemaValues["status"], {
                        shouldDirty: true,
                        shouldValidate: true,
                      });
                    }}
                  >
                    <SelectTrigger id="supplier-status" className="h-12 w-full rounded-2xl bg-background/70">
                      <SelectValue placeholder="اختر الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">{statusLabels.pending}</SelectItem>
                      <SelectItem value="approved">{statusLabels.approved}</SelectItem>
                      <SelectItem value="rejected">{statusLabels.rejected}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="rejection-reason">سبب الرفض</Label>
                  <Input
                    id="rejection-reason"
                    className="h-12 rounded-2xl bg-background/70"
                    placeholder="اختياري"
                    {...register("rejection_reason")}
                  />
                </div>
              </>
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
                "إضافة المورد"
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