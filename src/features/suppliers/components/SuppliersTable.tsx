"use client";

import { Edit3, Trash2, Truck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
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

import type { Supplier } from "../types";

type SuppliersTableProps = {
  onCreate: () => void;
  onDelete: (supplier: Supplier) => void;
  onEdit: (supplier: Supplier) => void;
  searchValue: string;
  suppliers: Supplier[];
};

export function SuppliersTable({
  onCreate,
  onDelete,
  onEdit,
  searchValue,
  suppliers,
}: SuppliersTableProps) {
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
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجل الموردين</CardTitle>
        <CardDescription>
          قائمة مباشرة من الـ API مع إمكانيات البحث والتعديل والحذف.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعرف</TableHead>
              <TableHead>اسم المورد</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {suppliers.map((supplier) => (
              <TableRow key={supplier.id}>
                <TableCell className="font-medium">#{supplier.id}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Truck className="size-4" />
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-foreground">{supplier.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Supplier Resource
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
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
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
