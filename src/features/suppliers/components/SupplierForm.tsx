"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ExternalLink, FileText, LoaderCircle, Plus, X } from "lucide-react";

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

import { supplierSchema, type SupplierSchemaValues } from "../schema/supplier.schema";
import type { Supplier, SupplierDocument, SupplierFormValues } from "../types";

type SupplierFormProps = {
  canManageStatus: boolean;
  defaultValues: SupplierFormValues;
  existingDocuments?: Supplier["documents"];
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

function normalizeSupplierDocuments(documents: Supplier["documents"]): SupplierDocument[] {
  if (!documents) {
    return [];
  }

  if (Array.isArray(documents)) {
    return documents.filter((document) => Boolean(document.file));
  }

  return [{ id: 0, file: documents }];
}

export function SupplierForm({
  canManageStatus,
  defaultValues,
  existingDocuments = null,
  isOpen,
  isSubmitting = false,
  mode,
  onOpenChange,
  onSubmit,
}: SupplierFormProps) {
  const [documentInputIds, setDocumentInputIds] = useState([0]);
  const [documentFiles, setDocumentFiles] = useState<Array<File | null>>([null]);
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
  const currentDocuments = normalizeSupplierDocuments(existingDocuments);
  const canAddDocumentInput = documentFiles.length > 0 && documentFiles.every(Boolean);

  function syncDocumentFiles(nextFiles: Array<File | null>) {
    setDocumentFiles(nextFiles);
    setValue("documents", nextFiles.filter((file): file is File => Boolean(file)), {
      shouldDirty: true,
      shouldValidate: true,
    });
  }

  function handleDocumentChange(index: number, file: File | null) {
    syncDocumentFiles(documentFiles.map((currentFile, currentIndex) => (
      currentIndex === index ? file : currentFile
    )));
  }

  function addDocumentInput() {
    setDocumentInputIds((currentIds) => [...currentIds, (currentIds.at(-1) ?? 0) + 1]);
    setDocumentFiles((currentFiles) => [...currentFiles, null]);
  }

  function removeDocumentInput(index: number) {
    setDocumentInputIds((currentIds) => currentIds.filter((_, currentIndex) => currentIndex !== index));
    syncDocumentFiles(documentFiles.filter((_, currentIndex) => currentIndex !== index));
  }

  useEffect(() => {
    reset(defaultValues);
    setDocumentInputIds([0]);
    setDocumentFiles([null]);
  }, [defaultValues, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92dvh] overflow-y-auto rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)] md:w-[88vw] md:max-w-6xl xl:max-w-7xl" dir="rtl">
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

            <div className="space-y-3 md:col-span-2">
              <Label htmlFor={`supplier-documents-${documentInputIds[0]}`}>ملفات المستندات PDF</Label>
              {currentDocuments.length ? (
                <div className="flex flex-wrap gap-2 rounded-2xl border border-border/70 bg-muted/30 p-3">
                  {currentDocuments.map((document, index) => (
                    <a
                      key={`${document.id}-${document.file}`}
                      className="inline-flex h-8 items-center justify-center gap-2 rounded-lg border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-muted"
                      href={document.file}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <ExternalLink className="size-3.5" />
                      ملف {index + 1}
                    </a>
                  ))}
                </div>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="size-4" />
                  لا توجد ملفات محفوظة
                </span>
              )}
              <div className="space-y-3">
                {documentInputIds.map((inputId, index) => (
                  <div key={inputId} className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Input
                      id={`supplier-documents-${inputId}`}
                      accept="application/pdf"
                      className="h-12 rounded-2xl bg-background/70 file:ml-4 file:border-0 file:bg-transparent file:text-sm file:font-medium"
                      type="file"
                      onChange={(event) => {
                        handleDocumentChange(index, event.target.files?.item(0) ?? null);
                      }}
                    />
                    {documentInputIds.length > 1 ? (
                      <Button
                        aria-label="حذف الملف"
                        className="size-10 shrink-0 rounded-full"
                        type="button"
                        onClick={() => removeDocumentInput(index)}
                        size="icon"
                        variant="outline"
                      >
                        <X className="size-4" />
                      </Button>
                    ) : null}
                  </div>
                ))}
              </div>
              {canAddDocumentInput ? (
                <Button
                  className="h-10 rounded-full px-4"
                  type="button"
                  onClick={addDocumentInput}
                  variant="outline"
                >
                  <Plus className="size-4" />
                  إضافة ملف آخر
                </Button>
              ) : null}
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
                      <SelectValue placeholder="اختر الحالة">{statusLabels[statusValue]}</SelectValue>
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
                  <Textarea
                    id="rejection-reason"
                    className="min-h-28 resize-y rounded-2xl bg-background/70"
                    placeholder="اكتب تفاصيل سبب الرفض إن وجدت"
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