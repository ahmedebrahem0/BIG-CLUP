"use client";

import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoaderCircle, PackageCheck } from "lucide-react";

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
import type { ClubItem } from "@/features/club-items/types";

import {
  createAddReceiptSchema,
  type AddReceiptSchemaValues,
} from "../schema/add-receipt.schema";

type AddReceiptFormProps = {
  clubItem: ClubItem | null;
  isOpen: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: AddReceiptSchemaValues) => Promise<void>;
};

const defaultValues: AddReceiptSchemaValues = {
  supplier: "",
  quantity_received: "",
};

export function AddReceiptForm({
  clubItem,
  isOpen,
  isSubmitting = false,
  onOpenChange,
  onSubmit,
}: AddReceiptFormProps) {
  const remainingQuantity = clubItem
    ? Math.max(clubItem.quantity - (clubItem.received_quantity ?? 0), 0)
    : 0;
  const schema = useMemo(
    () => createAddReceiptSchema(remainingQuantity),
    [remainingQuantity]
  );
  const {
    control,
    formState: { errors },
    handleSubmit,
    register,
    reset,
  } = useForm<AddReceiptSchemaValues>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    reset(defaultValues);
  }, [clubItem?.id, isOpen, reset]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl rounded-[2rem] border border-white/70 bg-white/95 p-0 shadow-[0_30px_80px_-46px_rgba(15,23,42,0.45)]"
        dir="rtl"
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6">
            <div className="mb-2 flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <PackageCheck className="size-5" />
            </div>
            <DialogTitle className="text-xl font-semibold text-foreground">
              تأكيد استلام الطلب
            </DialogTitle>
            <DialogDescription className="leading-7">
              اختر المورد وسجّل الكمية المستلمة. بعد الحفظ ستُعاد التشيك ليست إلى حالة غير مكتملة تلقائيًا.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 px-6 py-6">
            <div className="rounded-2xl border border-border/70 bg-secondary/50 px-4 py-3">
              <p className="text-sm font-medium text-foreground">
                {clubItem?.item_code ?? "-"} — {clubItem?.item_description ?? ""}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                الكمية المتبقية للاستلام: {remainingQuantity}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt-supplier">المورد</Label>
              <Controller
                control={control}
                name="supplier"
                render={({ field }) => {
                  const selectedSupplier = clubItem?.suppliers.find(
                    (supplier) => String(supplier.id) === field.value
                  );

                  return (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger
                        className="h-12 w-full rounded-2xl bg-background/70 px-4"
                        disabled={!clubItem?.suppliers.length}
                        id="receipt-supplier"
                      >
                        <SelectValue placeholder="اختر المورد">
                          {selectedSupplier?.name ?? "اختر المورد"}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {clubItem?.suppliers.map((supplier) => (
                          <SelectItem key={supplier.id} value={String(supplier.id)}>
                            {supplier.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }}
              />
              {errors.supplier ? (
                <p className="text-sm text-destructive">{errors.supplier.message}</p>
              ) : null}
              {clubItem && !clubItem.suppliers.length ? (
                <p className="text-sm text-amber-700">لا يوجد مورد مرتبط بهذا الصنف.</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="receipt-quantity">الكمية المستلمة</Label>
              <Input
                className="h-12 rounded-2xl bg-background/70"
                id="receipt-quantity"
                inputMode="numeric"
                max={remainingQuantity}
                min="1"
                placeholder="اكتب الكمية المستلمة"
                type="number"
                {...register("quantity_received")}
              />
              {errors.quantity_received ? (
                <p className="text-sm text-destructive">
                  {errors.quantity_received.message}
                </p>
              ) : null}
            </div>
          </div>

          <DialogFooter className="!-mx-0 !-mb-0 flex-row flex-wrap items-center justify-start gap-3 rounded-b-[2rem] border-t border-border/70 bg-secondary/50 px-6 py-4">
            <Button
              className="min-w-24"
              onClick={() => onOpenChange(false)}
              type="button"
              variant="outline"
            >
              إلغاء
            </Button>
            <Button
              className="min-w-36"
              disabled={
                isSubmitting ||
                !clubItem ||
                !clubItem.suppliers.length ||
                remainingQuantity <= 0
              }
              type="submit"
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle className="size-4 animate-spin" />
                  جاري التسجيل
                </>
              ) : (
                <>
                  <PackageCheck className="size-4" />
                  تأكيد الاستلام
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
