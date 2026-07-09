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

import { ItemChecklistStatus } from "./ItemChecklistStatus";
import type { Item } from "../types";

type ItemsTableProps = {
  items: Item[];
  onCreate: () => void;
  onDelete: (item: Item) => void;
  onEdit: (item: Item) => void;
  onToggleChecklist: (item: Item, checklistId: number, nextValue: boolean) => void;
  pendingChecklistId: number | null;
  searchValue: string;
};

export function ItemsTable({
  items,
  onCreate,
  onDelete,
  onEdit,
  onToggleChecklist,
  pendingChecklistId,
  searchValue,
}: ItemsTableProps) {
  if (!items.length) {
    return (
      <EmptyState
        actionLabel="إضافة أول صنف"
        description={
          searchValue
            ? "لا توجد نتائج مطابقة لعبارة البحث الحالية داخل الأصناف."
            : "لا توجد أصناف حتى الآن. ابدأ بإضافة أول صنف مع ربطه بالفئة المناسبة."
        }
        onAction={onCreate}
        title={searchValue ? "لا توجد نتائج" : "لا توجد أصناف بعد"}
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجل الأصناف</CardTitle>
        <CardDescription>
          قائمة مباشرة من الـ API تشمل بيانات الصنف الأساسية وحالات المتابعة مع إمكانية تحديثها.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>الفئة</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>حالات المتابعة</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.item_code}</TableCell>
                <TableCell>{item.category_name}</TableCell>
                <TableCell className="max-w-sm whitespace-normal text-sm leading-6 text-muted-foreground">
                  {item.description}
                </TableCell>
                <TableCell>
                  <div className="flex max-w-sm flex-wrap gap-2">
                    {item.checklists.length ? (
                      item.checklists.map((checklist) => (
                        <ItemChecklistStatus
                          checklist={checklist}
                          isPending={pendingChecklistId === checklist.id}
                          key={checklist.id}
                          onToggle={(nextValue) =>
                            onToggleChecklist(item, checklist.id, nextValue)
                          }
                        />
                      ))
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        لا توجد حالات متابعة مرتبطة
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => onEdit(item)} size="sm" variant="outline">
                      <Edit3 className="size-3.5" />
                      تعديل
                    </Button>
                    <Button type="button" onClick={() => onDelete(item)} size="sm" variant="destructive">
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

