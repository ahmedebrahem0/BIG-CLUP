"use client";

import { Edit3, Layers3, Trash2 } from "lucide-react";

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

import type { Category } from "../types";

type CategoriesTableProps = {
  categories: Category[];
  onCreate: () => void;
  onDelete: (category: Category) => void;
  onEdit: (category: Category) => void;
  searchValue: string;
};

export function CategoriesTable({
  categories,
  onCreate,
  onDelete,
  onEdit,
  searchValue,
}: CategoriesTableProps) {
  if (!categories.length) {
    return (
      <EmptyState
        actionLabel="إضافة أول فئة"
        description={
          searchValue
            ? "لا توجد نتائج مطابقة لعبارة البحث الحالية داخل الفئات."
            : "لا توجد فئات حتى الآن. ابدأ بإضافة أول فئة رئيسية أو فرعية حسب احتياجك."
        }
        onAction={onCreate}
        title={searchValue ? "لا توجد نتائج" : "لا توجد فئات بعد"}
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجل الفئات</CardTitle>
        <CardDescription>
          قائمة مباشرة من الـ API مع توضيح العلاقة بين الفئات الرئيسية والفرعية.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-24">المعرف</TableHead>
              <TableHead className="w-[28%]">اسم الفئة</TableHead>
              <TableHead className="w-[22%]">الفئة الأب</TableHead>
              <TableHead className="w-[16%]">النوع</TableHead>
              <TableHead className="w-[20%]">العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.map((category) => (
              <TableRow key={category.id}>
                <TableCell className="font-medium text-right">#{category.id}</TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{category.name}</span>
                    <span className="text-xs text-muted-foreground">Category Resource</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{category.parent_name ?? "-"}</TableCell>
                <TableCell className="text-right">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    <Layers3 className="size-3.5" />
                    {category.parent === null ? "رئيسية" : "فرعية"}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-start gap-2">
                    <Button
                      type="button"
                      onClick={() => onEdit(category)}
                      size="sm"
                      variant="outline"
                    >
                      <Edit3 className="size-3.5" />
                      تعديل
                    </Button>
                    <Button
                      type="button"
                      onClick={() => onDelete(category)}
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