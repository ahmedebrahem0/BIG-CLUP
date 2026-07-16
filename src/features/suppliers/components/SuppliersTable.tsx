"use client";

import { useState } from "react";

import { Edit3, Ellipsis, ExternalLink, FileText, Trash2, Truck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { Supplier, SupplierDocument, SupplierStatus } from "../types";

type SuppliersTableProps = {
  onCreate: () => void;
  onDelete: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  searchValue: string;
  suppliers: Supplier[];
};

const statusMeta: Record<SupplierStatus, { label: string; className: string }> = {
  pending: {
    label: "قيد المراجعة",
    className: "bg-amber-100 text-amber-800 hover:bg-amber-100",
  },
  approved: {
    label: "معتمد",
    className: "bg-emerald-100 text-emerald-800 hover:bg-emerald-100",
  },
  rejected: {
    label: "مرفوض",
    className: "bg-red-100 text-red-800 hover:bg-red-100",
  },
};

function getStatusMeta(status: SupplierStatus) {
  return statusMeta[status] ?? statusMeta.pending;
}

function normalizeSupplierDocuments(documents: Supplier["documents"]): SupplierDocument[] {
  if (!documents) {
    return [];
  }

  if (Array.isArray(documents)) {
    return documents.filter((document) => Boolean(document.file));
  }

  return [{ id: 0, file: documents }];
}

export function SuppliersTable({
  onCreate,
  onDelete,
  onEdit,
  searchValue,
  suppliers,
}: SuppliersTableProps) {
  const [rejectionReasonSupplier, setRejectionReasonSupplier] = useState<Supplier | null>(null);

  if (!suppliers.length) {
    return (
      <EmptyState
        actionLabel="إضافة أول مورد"
        description={
          searchValue
            ? "لا توجد نتائج مطابقة لعبارة البحث الحالية. جرّب اسمًا مختلفًا أو امسح البحث."
            : "لا يوجد موردون مسجلون حتى الآن. ابدأ بإضافة أول مورد ليظهر هنا مباشرة."
        }
        onAction={onCreate}
        title={searchValue ? "لا توجد نتائج" : "لا يوجد موردون بعد"}
      />
    );
  }

  return (
    <>
      <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
        <CardHeader>
          <CardTitle>سجل الموردين</CardTitle>
          <CardDescription>
            قائمة مباشرة من SupplierListView مع بيانات التواصل والحالة والمستندات.
          </CardDescription>
        </CardHeader>
        <CardContent className="overflow-x-auto">
          <Table className="min-w-[1180px] table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-20">المعرف</TableHead>
                <TableHead className="w-[20%]">بيانات المورد</TableHead>
                <TableHead className="w-[16%]">السجل والضريبة</TableHead>
                <TableHead className="w-[18%]">مسؤول التواصل</TableHead>
                <TableHead className="w-[11%]">الحالة</TableHead>
                <TableHead className="w-[13%]">المستندات</TableHead>
                <TableHead className="w-[14%]">العمليات</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {suppliers.map((supplier) => {
                const status = getStatusMeta(supplier.status);
                const documents = normalizeSupplierDocuments(supplier.documents);

                return (
                  <TableRow key={supplier.id}>
                    <TableCell className="font-medium text-right align-top">#{supplier.id}</TableCell>
                    <TableCell className="text-right align-top whitespace-normal">
                      <div className="flex items-start gap-3">
                        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Truck className="size-4" />
                        </div>
                        <div className="min-w-0 space-y-1">
                          <p className="font-medium text-foreground">{supplier.name}</p>
                          {supplier.rejection_reason ? (
                            <button
                              className="group/reason block max-w-full rounded-xl bg-red-50 px-2 py-1 text-right text-xs leading-5 text-red-700 transition hover:bg-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                              onClick={() => setRejectionReasonSupplier(supplier)}
                              type="button"
                            >
                              <span className="line-clamp-2 break-words">
                                سبب الرفض: {supplier.rejection_reason}
                              </span>
                              <span className="mt-1 inline-flex items-center gap-1 text-[11px] font-medium text-red-800">
                                <Ellipsis className="size-3.5" />
                                عرض السبب كامل
                              </span>
                            </button>
                          ) : (
                            <p className="text-xs text-muted-foreground">Supplier Resource</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top whitespace-normal text-sm leading-6">
                      <div className="space-y-1">
                        <p>السجل التجاري: {supplier.commercial_register}</p>
                        <p className="text-muted-foreground">البطاقة الضريبية: {supplier.tax_card}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top whitespace-normal text-sm leading-6">
                      <div className="space-y-1">
                        <p className="font-medium text-foreground">{supplier.contact_person}</p>
                        <p>{supplier.contact_phone}</p>
                        <p className="text-muted-foreground">{supplier.contact_title}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <Badge className={status.className}>{status.label}</Badge>
                    </TableCell>
                    <TableCell className="text-right align-top">
                      {documents.length ? (
                        <div className="flex flex-wrap gap-2">
                          {documents.map((document, index) => (
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
                          لا يوجد
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right align-top">
                      <div className="flex flex-wrap items-center justify-start gap-2">
                        <Button
                          type="button"
                          onClick={() => onEdit(supplier)}
                          size="sm"
                          variant="outline"
                        >
                          <Edit3 className="size-3.5" />
                          تعديل
                        </Button>
                        <Button
                          type="button"
                          onClick={() => onDelete(supplier)}
                          size="sm"
                          variant="destructive"
                        >
                          <Trash2 className="size-3.5" />
                          حذف
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog
        open={Boolean(rejectionReasonSupplier)}
        onOpenChange={(open) => {
          if (!open) {
            setRejectionReasonSupplier(null);
          }
        }}
      >
        <DialogContent className="max-w-2xl rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]" dir="rtl">
          <DialogHeader className="border-b border-border/70 px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold text-foreground">سبب الرفض</DialogTitle>
            <DialogDescription>
              {rejectionReasonSupplier
                ? `المورد: ${rejectionReasonSupplier.name}`
                : "تفاصيل سبب الرفض"}
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[55dvh] overflow-y-auto px-6 py-5">
            <p className="whitespace-pre-wrap break-words rounded-2xl bg-red-50 p-4 text-sm leading-8 text-red-800">
              {rejectionReasonSupplier?.rejection_reason}
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}