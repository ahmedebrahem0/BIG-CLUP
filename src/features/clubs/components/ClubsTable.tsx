"use client";

import { Edit3, Trash2 } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

import type { Club } from "../types";

type ClubsTableProps = {
  clubs: Club[];
  onDelete: (club: Club) => void;
  onEdit: (club: Club) => void;
  onCreate: () => void;
  searchValue: string;
};

export function ClubsTable({
  clubs,
  onDelete,
  onEdit,
  onCreate,
  searchValue,
}: ClubsTableProps) {
  if (!clubs.length) {
    return (
      <EmptyState
        actionLabel="إضافة أول نادي"
        description={
          searchValue
            ? "لا توجد نتائج مطابقة لعبارة البحث الحالية. جرّب اسمًا مختلفًا أو امسح البحث."
            : "لا توجد أندية مسجلة حتى الآن. ابدأ بإضافة أول نادي ليظهر هنا مباشرة."
        }
        onAction={onCreate}
        title={searchValue ? "لا توجد نتائج" : "لا توجد أندية بعد"}
      />
    );
  }

  return (
    <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
      <CardHeader>
        <CardTitle>سجل الأندية</CardTitle>
        <CardDescription>
          قائمة مباشرة من الـ API مع إمكانيات البحث والتعديل والحذف.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>المعرف</TableHead>
              <TableHead>اسم النادي</TableHead>
              <TableHead>العمليات</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {clubs.map((club) => (
              <TableRow key={club.id}>
                <TableCell className="font-medium">#{club.id}</TableCell>
                <TableCell>
                  <div className="flex flex-col gap-1">
                    <span className="font-medium text-foreground">{club.name}</span>
                    <span className="text-xs text-muted-foreground">Club Resource</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button type="button" onClick={() => onEdit(club)} size="sm" variant="outline">
                      <Edit3 className="size-3.5" />
                      تعديل
                    </Button>
                    <Button type="button" onClick={() => onDelete(club)} size="sm" variant="destructive">
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

