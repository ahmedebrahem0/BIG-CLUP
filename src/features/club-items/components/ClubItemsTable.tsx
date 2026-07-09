"use client";

import { PencilLine } from "lucide-react";

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

import { ClubItemChecklistStatus } from "./ClubItemChecklistStatus";
import type { ClubItem, ClubItemChecklistEntry } from "../types";

type ClubItemsTableProps = {
  clubItems: ClubItem[];
  onEditQuantity: (clubItem: ClubItem) => void;
  onToggleChecklist: (checklist: ClubItemChecklistEntry, nextValue: boolean) => void;
  pendingChecklistId: number | null;
  selectedCategoryName?: string;
  selectedClubName?: string;
};

export function ClubItemsTable({
  clubItems,
  onEditQuantity,
  onToggleChecklist,
  pendingChecklistId,
  selectedCategoryName,
  selectedClubName,
}: ClubItemsTableProps) {
  if (!clubItems.length) {
    return (
      <EmptyState
        description="لا توجد أصناف مرتبطة بهذا النادي داخل الفئة المختارة حاليًا. يمكنك إضافة صنف جديد من الأعلى ليظهر هنا مباشرة."
        title="لا توجد نتائج داخل مساحة العمل"
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>الأصناف المرتبطة بالنادي</CardTitle>
        <CardDescription>
          {selectedClubName && selectedCategoryName
            ? `عرض تشغيلي للأصناف داخل ${selectedClubName} ضمن فئة ${selectedCategoryName}.`
            : "عرض تشغيلي للأصناف المرتبطة بالنادي والفئة المختارين."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>التشيك ليست الخاصة بالنادي</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubItems.map((clubItem) => (
              <TableRow key={clubItem.id}>
                <TableCell className="font-medium">{clubItem.item_code}</TableCell>
                <TableCell className="max-w-sm whitespace-normal text-sm leading-6 text-muted-foreground">
                  {clubItem.item_description}
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs text-primary">
                    {clubItem.quantity}
                  </span>
                </TableCell>
                <TableCell>
                  <div className="flex max-w-lg flex-wrap gap-2">
                    {clubItem.checklists.map((checklist) => (
                      <ClubItemChecklistStatus
                        checklist={checklist}
                        isPending={pendingChecklistId === checklist.id}
                        key={checklist.id}
                        onToggle={onToggleChecklist}
                      />
                    ))}
                  </div>
                </TableCell>
                <TableCell>
                  <Button onClick={() => onEditQuantity(clubItem)} size="sm" variant="outline">
                    <PencilLine className="size-3.5" />
                    تعديل الكمية
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
