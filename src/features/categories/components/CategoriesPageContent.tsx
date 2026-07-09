"use client";

import { FolderTree, GitBranch, Plus, Search, Shapes } from "lucide-react";

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

import { CategoryForm } from "./CategoryForm";
import { CategoriesTable } from "./CategoriesTable";
import { useCategories } from "../hooks/useCategories";

export function CategoriesPageContent() {
  const {
    allCategoriesCount,
    cancelDeleteCategory,
    categories,
    categoriesQuery,
    categoryBeingEdited,
    categoryPendingDelete,
    confirmDeleteCategory,
    filteredCategories,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteCategory,
    searchValue,
    setSearchValue,
    submitCategory,
  } = useCategories();

  if (categoriesQuery.isLoading) {
    return <Loader label="جاري تحميل الفئات من الخادم..." />;
  }

  if (categoriesQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب الفئات من الباك اند في الوقت الحالي."
        onRetry={() => {
          void categoriesQuery.refetch();
        }}
        title="فشل تحميل الفئات"
      />
    );
  }

  return (
    <>
      <div className="space-y-6">
        <section className="grid gap-4 lg:grid-cols-4">
          {[
            { label: "هيكل الفئات", value: "رئيسية وفرعية", icon: GitBranch },
            { label: "إجمالي الفئات", value: String(allCategoriesCount), icon: FolderTree },
            { label: "عرض التبعية", value: "اسم الفئة الأب", icon: Shapes },
            { label: "النتائج المعروضة", value: String(filteredCategories.length), icon: FolderTree },
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
            <CardDescription>هيكل الفئات</CardDescription>
            <CardTitle className="text-2xl">إدارة الفئات بهيكل هرمي واضح</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              هذه الصفحة تنظم الفئات التي تعتمد عليها الأصناف، سواء كانت رئيسية أو فرعية.
            </p>
            <div className="rounded-2xl bg-secondary p-4 leading-7 text-foreground">
              تظل علاقة الفئة الأب واضحة لتسهيل مراجعة الهيكل وترتيبه.
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle>أدوات الإدارة</CardTitle>
              <CardDescription>
                ابحث داخل الفئات الحالية أو أضف فئة جديدة رئيسية أو فرعية.
              </CardDescription>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative w-full sm:w-72">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث عن فئة أو أب"
                  value={searchValue}
                />
              </div>
              <Button className="h-11 rounded-2xl px-4" onClick={openCreateForm}>
                <Plus className="size-4" />
                إضافة فئة
              </Button>
            </div>
          </CardHeader>
        </Card>

        <CategoriesTable
          categories={filteredCategories}
          onCreate={openCreateForm}
          onDelete={requestDeleteCategory}
          onEdit={openEditForm}
          searchValue={searchValue}
        />
      </div>

      <CategoryForm
        categories={categories}
        currentCategoryId={categoryBeingEdited?.id}
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitCategory}
      />

      <ConfirmDialog
        actionLabel="تأكيد الحذف"
        description={
          categoryPendingDelete
            ? `سيتم حذف الفئة "${categoryPendingDelete.name}" نهائيًا من النظام.`
            : "سيتم حذف هذه الفئة نهائيًا من النظام."
        }
        isOpen={Boolean(categoryPendingDelete)}
        onConfirm={confirmDeleteCategory}
        onOpenChange={(open) => {
          if (!open) {
            cancelDeleteCategory();
          }
        }}
        title="هل أنت متأكد من الحذف؟"
      />
    </>
  );
}
