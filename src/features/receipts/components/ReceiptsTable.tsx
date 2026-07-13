"use client";

import { CalendarClock, PackageCheck } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
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

import type { Receipt } from "../types";

type ReceiptsTableProps = {
  receipts: Receipt[];
  searchValue: string;
};

export function ReceiptsTable({ receipts, searchValue }: ReceiptsTableProps) {
  if (!receipts.length) {
    return (
      <EmptyState
        description={
          searchValue
            ? "لا توجد سجلات استلام مطابقة لعبارة البحث الحالية. جرّب البحث باسم النادي أو المورد أو كود الصنف."
            : "لا توجد سجلات استلام مسجلة حتى الآن. ستظهر هنا تلقائيًا بعد تسجيل عمليات الاستلام من الباك اند."
        }
        title={searchValue ? "لا توجد نتائج" : "لا توجد سجلات استلام بعد"}
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجلات الاستلام</CardTitle>
        <CardDescription>
          سجل قراءة فقط يعرض النادي، الصنف، الكمية المستلمة، المورد، ووقت التسجيل.
        </CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table className="min-w-[920px]">
          <TableHeader>
            <TableRow>
              <TableHead>المعرف</TableHead>
              <TableHead>النادي</TableHead>
              <TableHead>كود الصنف</TableHead>
              <TableHead>الكمية المستلمة</TableHead>
              <TableHead>المورد</TableHead>
              <TableHead>تاريخ الاستلام</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((receipt) => (
              <TableRow key={receipt.id}>
                <TableCell className="font-medium">#{receipt.id}</TableCell>
                <TableCell>{receipt.club_name}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <PackageCheck className="size-4 text-primary" />
                    <span className="font-medium text-foreground">{receipt.club_item}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
                    {receipt.quantity_received}
                  </span>
                </TableCell>
                <TableCell>{receipt.supplier}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarClock className="size-4 text-primary" />
                    {receipt.created_at}
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
