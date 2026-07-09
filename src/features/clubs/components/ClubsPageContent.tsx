"use client";

import { Building2, Plus, Search } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ClubForm } from "./ClubForm";
import { ClubsTable } from "./ClubsTable";
import { useClubs } from "../hooks/useClubs";

export function ClubsPageContent() {
  const {
    allClubsCount,
    cancelDeleteClub,
    clubPendingDelete,
    clubs,
    clubsQuery,
    confirmDeleteClub,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteClub,
    searchValue,
    setSearchValue,
    submitClub,
  } = useClubs();

  if (clubsQuery.isLoading) {
    return <Loader label="جاري تحميل الأندية من الخادم..." />;
  }

  if (clubsQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب قائمة الأندية من الباك اند في الوقت الحالي."
        onRetry={() => {
          void clubsQuery.refetch();
        }}
        title="فشل تحميل الأندية"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
            <CardHeader>
              <CardDescription>سجل الأندية</CardDescription>
              <CardTitle className="text-2xl">إدارة الأندية بشكل كامل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                من هنا يتم ضبط أسماء الأندية المعتمدة داخل النظام حتى تبقى كل العمليات
                اللاحقة مرتبطة بجهة واضحة ومحدثة.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">إجمالي الأندية</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {allClubsCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">النتائج المعروضة</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">{clubs.length}</p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">دور الصفحة</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    تعريف الأندية الأساسية للمشروع
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
                كل سجل يمثل ناديًا واحدًا يُستخدم لاحقًا في ربط الفئات والأصناف.
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-foreground">
                <Building2 className="size-4 text-primary" />
                صفحة سريعة للحفاظ على قائمة الأندية المعتمدة.
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>أدوات الإدارة</CardTitle>
              <CardDescription>
                ابحث داخل الأندية الحالية أو أضف ناديًا جديدًا مباشرة.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث عن نادي"
                  value={searchValue}
                />
              </div>
              <Button className="h-11 rounded-2xl px-4" onClick={openCreateForm}>
                <Plus className="size-4" />
                إضافة نادي
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ClubsTable
          clubs={clubs}
          onCreate={openCreateForm}
          onDelete={requestDeleteClub}
          onEdit={openEditForm}
          searchValue={searchValue}
        />
      </div>

      <ClubForm
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitClub}
      />

      <ConfirmDialog
        actionLabel="تأكيد الحذف"
        description={
          clubPendingDelete
            ? `سيتم حذف النادي "${clubPendingDelete.name}" نهائيًا من النظام.`
            : "سيتم حذف هذا النادي نهائيًا من النظام."
        }
        isOpen={Boolean(clubPendingDelete)}
        onConfirm={confirmDeleteClub}
        onOpenChange={(open) => {
          if (!open) {
            cancelDeleteClub();
          }
        }}
        title="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
