"use client";

import { ClipboardList, Plus, Search } from "lucide-react";

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

import { ChecklistForm } from "./ChecklistForm";
import { ChecklistsTable } from "./ChecklistsTable";
import { useChecklists } from "../hooks/useChecklists";

export function ChecklistsPageContent() {
  const {
    allChecklistsCount,
    cancelDeleteChecklist,
    checklistPendingDelete,
    checklists,
    checklistsQuery,
    confirmDeleteChecklist,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteChecklist,
    searchValue,
    setSearchValue,
    submitChecklist,
  } = useChecklists();

  if (checklistsQuery.isLoading) {
    return <Loader label="جاري تحميل عناصر المتابعة من الخادم..." />;
  }

  if (checklistsQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب عناصر المتابعة من الباك اند في الوقت الحالي."
        onRetry={() => {
          void checklistsQuery.refetch();
        }}
        title="فشل تحميل عناصر المتابعة"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
          <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
            <CardHeader>
              <CardDescription>مكتبة المتابعة</CardDescription>
              <CardTitle className="text-2xl">إدارة عناصر المتابعة بالكامل</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
              <p>
                من هنا يتم تعريف خطوات المتابعة التي يعتمد عليها الفريق أثناء مراجعة
                الأصناف ومتابعة التنفيذ داخل الأندية.
              </p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">إجمالي الخطوات</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {allChecklistsCount}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">النتائج المعروضة</p>
                  <p className="mt-2 text-2xl font-semibold text-foreground">
                    {checklists.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-secondary p-4">
                  <p className="text-xs text-muted-foreground">دور الصفحة</p>
                  <p className="mt-2 text-sm font-semibold text-foreground">
                    خطوات المتابعة القياسية
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-white/80 bg-[linear-gradient(180deg,rgba(230,243,241,0.88),rgba(255,255,255,0.84))] shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
            <CardHeader>
              <CardDescription>لمحة سريعة</CardDescription>
              <CardTitle className="text-xl">كيف تُستخدم هذه العناصر؟</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <div className="rounded-2xl bg-white/80 p-4 leading-7 text-foreground">
                كل سجل هنا يمثل خطوة متابعة يمكن إعادة استخدامها على الأصناف وأصناف الأندية.
              </div>
              <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-foreground">
                <ClipboardList className="size-4 text-primary" />
                قابلة لإعادة الاستخدام في أكثر من مسار تشغيلي بدون تكرار.
              </div>
            </CardContent>
          </Card>
        </section>

        <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>أدوات الإدارة</CardTitle>
              <CardDescription>
                ابحث داخل عناصر المتابعة الحالية أو أضف عنصرًا جديدًا مباشرة.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث عن عنصر متابعة"
                  value={searchValue}
                />
              </div>
              <Button className="h-11 rounded-2xl px-4" onClick={openCreateForm}>
                <Plus className="size-4" />
                إضافة عنصر
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ChecklistsTable
          checklists={checklists}
          onCreate={openCreateForm}
          onDelete={requestDeleteChecklist}
          onEdit={openEditForm}
          searchValue={searchValue}
        />
      </div>

      <ChecklistForm
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitChecklist}
      />

      <ConfirmDialog
        actionLabel="تأكيد الحذف"
        description={
          checklistPendingDelete
            ? `سيتم حذف عنصر المتابعة "${checklistPendingDelete.name}" نهائيًا من النظام.`
            : "سيتم حذف هذا العنصر نهائيًا من النظام."
        }
        isOpen={Boolean(checklistPendingDelete)}
        onConfirm={confirmDeleteChecklist}
        onOpenChange={(open) => {
          if (!open) {
            cancelDeleteChecklist();
          }
        }}
        title="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
