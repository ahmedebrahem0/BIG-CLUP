"use client";

import { Boxes, CheckSquare, Package2, Plus, Search, Tags } from "lucide-react";

import { ConfirmDialog } from "@/components/common/ConfirmDialog";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ItemForm } from "./ItemForm";
import { ItemsTable } from "./ItemsTable";
import { useItems } from "../hooks/useItems";

export function ItemsPageContent() {
  const {
    allItemsCount,
    cancelDeleteItem,
    categories,
    categoriesQuery,
    confirmDeleteItem,
    filteredItems,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    itemPendingDelete,
    itemsQuery,
    openCreateForm,
    openEditForm,
    pendingChecklistId,
    requestDeleteItem,
    searchValue,
    setSearchValue,
    submitItem,
    toggleChecklistStatus,
  } = useItems();

  if (itemsQuery.isLoading || categoriesQuery.isLoading) {
    return <Loader label="جاري تحميل الأصناف والفئات من الخادم..." />;
  }

  if (itemsQuery.isError || categoriesQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب بيانات الأصناف أو الفئات من الباك اند في الوقت الحالي."
        onRetry={() => {
          void itemsQuery.refetch();
          void categoriesQuery.refetch();
        }}
        title="فشل تحميل الأصناف"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-4">
          {[
            { label: "الربط الأساسي", value: "فئة لكل صنف", icon: Tags },
            { label: "معرّف الصنف", value: "كود صنف مميز", icon: Package2 },
            { label: "المتابعة", value: "حالات التنفيذ", icon: CheckSquare },
            { label: "إجمالي الأصناف", value: String(allItemsCount), icon: Boxes },
          ].map((item) => (
            <Card key={item.label} className="rounded-[1.8rem] border-white/80 bg-white/80 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.label}</p>
                  <p className="mt-1 font-semibold">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
          <CardHeader>
            <CardDescription>قاعدة الأصناف</CardDescription>
            <CardTitle className="text-2xl">الأصناف الرئيسية مع عرض checklist</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              هذه الصفحة تجمع تعريف الصنف مع فئته وخطوات المتابعة المرتبطة به.
            </p>
            <div className="rounded-2xl bg-secondary p-4 leading-7 text-foreground">
              كل صنف يحتفظ بكود واضح ووصف مباشر ومتابعة للحالة من نفس الجدول.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>أدوات الإدارة</CardTitle>
              <CardDescription>
                ابحث داخل الأصناف الحالية أو أضف صنفًا جديدًا مع ربطه بالفئة المناسبة.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث بالكود أو الوصف أو الفئة"
                  value={searchValue}
                />
              </div>
              <Button className="h-11 rounded-2xl px-4" onClick={openCreateForm}>
                <Plus className="size-4" />
                إضافة صنف
              </Button>
            </div>
          </CardHeader>
        </Card>

        <ItemsTable
          items={filteredItems}
          onCreate={openCreateForm}
          onDelete={requestDeleteItem}
          onEdit={openEditForm}
          onToggleChecklist={(item, checklistId, nextValue) => {
            const checklist = item.checklists.find((entry) => entry.id === checklistId);

            if (!checklist) {
              return;
            }

            void toggleChecklistStatus(item.id, checklist, nextValue);
          }}
          pendingChecklistId={pendingChecklistId}
          searchValue={searchValue}
        />
      </div>

      <ItemForm
        categories={categories}
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitItem}
      />

      <ConfirmDialog
        actionLabel="تأكيد الحذف"
        description={
          itemPendingDelete
            ? `سيتم حذف الصنف "${itemPendingDelete.item_code}" نهائيًا من النظام.`
            : "سيتم حذف هذا الصنف نهائيًا من النظام."
        }
        isOpen={Boolean(itemPendingDelete)}
        onConfirm={confirmDeleteItem}
        onOpenChange={(open) => {
          if (!open) {
            cancelDeleteItem();
          }
        }}
        title="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
