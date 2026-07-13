"use client";

import { Plus, Search, Truck } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { SupplierForm } from "./SupplierForm";
import { SuppliersTable } from "./SuppliersTable";
import { useSuppliers } from "../hooks/useSuppliers";

export function SuppliersPageContent() {
  const {
    allSuppliersCount,
    cancelDeleteSupplier,
    confirmDeleteSupplier,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteSupplier,
    searchValue,
    setSearchValue,
    submitSupplier,
    supplierPendingDelete,
    suppliers,
    suppliersQuery,
  } = useSuppliers();

  if (suppliersQuery.isLoading) {
    return <Loader label="جاري تحميل الموردين من الخادم..." />;
  }

  if (suppliersQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب قائمة الموردين من الباك اند في الوقت الحالي."
        onRetry={() => {
          void suppliersQuery.refetch();
        }}
        title="فشل تحميل الموردين"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
            <CardHeader>
              <CardDescription>سجل الموردين</CardDescription>
              <CardTitle className="text-2xl">إدارة الموردين بشكل كامل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                من هنا يتم ضبط أسماء الموردين المعتمدين داخل النظام لاستخدامهم في
                العمليات التشغيلية وربطهم بالأصناف لاحقًا.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">إجمالي الموردين</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {allSuppliersCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">النتائج المعروضة</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {suppliers.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">دور الصفحة</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    تعريف الموردين الأساسيين للمشروع
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/80 bg-[linear-gradient(180deg,rgba(230,243,241,0.88),rgba(255,255,255,0.84))] shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
            <CardHeader>
              <CardDescription>لمحة سريعة</CardDescription>
              <CardTitle className="text-xl">ما الذي نديره هنا؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-white/80 p-4 leading-7 text-foreground">
                كل سجل يمثل موردًا واحدًا يمكن إضافته أو تعديله أو حذفه من النظام.
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-foreground">
                <Truck className="size-4 text-primary" />
                صفحة سريعة للحفاظ على قائمة الموردين المعتمدين.
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>أدوات الإدارة</CardTitle>
              <CardDescription>
                ابحث داخل الموردين الحاليين أو أضف موردًا جديدًا مباشرة.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث عن مورد"
                  value={searchValue}
                />
              </div>
              <Button className="h-11 rounded-2xl px-4" onClick={openCreateForm}>
                <Plus className="size-4" />
                إضافة مورد
              </Button>
            </div>
          </CardHeader>
        </Card>

        <SuppliersTable
          onCreate={openCreateForm}
          onDelete={requestDeleteSupplier}
          onEdit={openEditForm}
          searchValue={searchValue}
          suppliers={suppliers}
        />
      </div>

      <SupplierForm
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitSupplier}
      />

      <ConfirmDialog
        actionLabel="تأكيد الحذف"
        description={
          supplierPendingDelete
            ? `سيتم حذف المورد "${supplierPendingDelete.name}" نهائيًا من النظام.`
            : "سيتم حذف هذا المورد نهائيًا من النظام."
        }
        isOpen={Boolean(supplierPendingDelete)}
        onConfirm={confirmDeleteSupplier}
        onOpenChange={(open) => {
          if (!open) {
            cancelDeleteSupplier();
          }
        }}
        title="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
