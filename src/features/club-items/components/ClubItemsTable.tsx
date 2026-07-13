"use client";

import { PackageCheck, PencilLine } from "lucide-react";

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
  onConfirmReceipt: (clubItem: ClubItem) => void;
  onEditClubItem: (clubItem: ClubItem) => void;
  onToggleChecklist: (checklist: ClubItemChecklistEntry, nextValue: boolean) => void;
  pendingChecklistId: number | null;
  selectedCategoryName?: string;
  selectedClubName?: string;
};

export function ClubItemsTable({
  clubItems,
  onConfirmReceipt,
  onEditClubItem,
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
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[1100px]">
          <TableHeader>
            <TableRow>
              <TableHead>الكود</TableHead>
              <TableHead>الوصف</TableHead>
              <TableHead>الكمية</TableHead>
              <TableHead>المستلم</TableHead>
              <TableHead>المتبقي</TableHead>
              <TableHead>الموردين</TableHead>
              <TableHead>ملاحظات</TableHead>
              <TableHead>التشيك ليست الخاصة بالنادي</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubItems.map((clubItem) => {
              const receivedQuantity = clubItem.received_quantity ?? 0;
              const remainingQuantity = Math.max(clubItem.quantity - receivedQuantity, 0);
              const areAllChecklistsCompleted =
                clubItem.checklists.length > 0 &&
                clubItem.checklists.every((checklist) => checklist.is_completed);
              const isReceiptDisabled =
                !areAllChecklistsCompleted || remainingQuantity <= 0;
              const receiptButtonTitle = !areAllChecklistsCompleted
                ? "أكمل جميع عناصر التشيك ليست أولًا."
                : remainingQuantity <= 0
                  ? "تم استلام الكمية المطلوبة بالكامل."
                  : "تسجيل استلام جديد لهذا الصنف.";

              return (
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
                    <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                      {receivedQuantity}
                    </span>
                  </TableCell>
                  <TableCell>
                    <span className="rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
                      {remainingQuantity}
                    </span>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {clubItem.suppliers?.length ? (
                      <div className="flex flex-col gap-1">
                        {clubItem.suppliers.map((supplier) => (
                          <span key={supplier.id}>{supplier.name}</span>
                        ))}
                      </div>
                    ) : (
                      "لا يوجد"
                    )}
                  </TableCell>
                  <TableCell className="max-w-48 whitespace-normal text-sm leading-6 text-muted-foreground">
                    {clubItem.note?.trim() || "-"}
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
                    <div className="flex min-w-48 flex-wrap gap-2">
                      <Button
                        onClick={() => onEditClubItem(clubItem)}
                        size="sm"
                        variant="outline"
                      >
                        <PencilLine className="size-3.5" />
                        تعديل البيانات
                      </Button>
                      <Button
                        disabled={isReceiptDisabled}
                        onClick={() => onConfirmReceipt(clubItem)}
                        size="sm"
                        title={receiptButtonTitle}
                      >
                        <PackageCheck className="size-3.5" />
                        تأكيد الطلب
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
  );
}
