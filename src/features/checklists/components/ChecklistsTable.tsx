"use client";

import { Edit3, Trash2 } from "lucide-react";

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

import type { Checklist } from "../types";

type ChecklistsTableProps = {
  checklists: Checklist[];
  onCreate: () => void;
  onDelete: (checklist: Checklist) => void;
  onEdit: (checklist: Checklist) => void;
  searchValue: string;
};

export function ChecklistsTable({
  checklists,
  onCreate,
  onDelete,
  onEdit,
  searchValue,
}: ChecklistsTableProps) {
  if (!checklists.length) {
    return (
      <EmptyState
        actionLabel="إضافة أول عنصر"
        description={
          searchValue
            ? "لا توجد نتائج مطابقة لعبارة البحث الحالية داخل عناصر المتابعة."
            : "لا توجد عناصر متابعة حتى الآن. أضف أول عنصر ليُستخدم لاحقًا في الأصناف ومساحة العمل."
        }
        onAction={onCreate}
        title={searchValue ? "لا توجد نتائج" : "لا توجد عناصر متابعة بعد"}
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجل عناصر المتابعة</CardTitle>
        <CardDescription>
          قائمة مباشرة من الـ API مع إمكانية الإدارة الكاملة لكل عنصر.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعرف</TableHead>
              <TableHead>اسم عنصر المتابعة</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {checklists.map((checklist) => (
              <TableRow key={checklist.id}>
                <TableCell className="font-medium">#{checklist.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{checklist.name}</span>
                    <span className="text-xs text-muted-foreground">Checklist Resource</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => onEdit(checklist)} size="sm" variant="outline">
                      <Edit3 className="size-3.5" />
                      تعديل
                    </Button>
                    <Button
                      onClick={() => onDelete(checklist)}
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

