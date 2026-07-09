"use client";

import {
  ArrowLeftRight,
  CheckSquare2,
  LayoutGrid,
  PackagePlus,
  Search,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { AddOrUpdateClubItemForm } from "./AddOrUpdateClubItemForm";
import { ClubCategorySelector } from "./ClubCategorySelector";
import { ClubItemsTable } from "./ClubItemsTable";
import { ClubSelector } from "./ClubSelector";
import { useClubItemsWorkspace } from "../hooks/useClubItemsWorkspace";

export function ClubItemsPageContent() {
  const {
    clubCategories,
    clubCategoriesQuery,
    clubItems,
    clubItemsQuery,
    clubs,
    clubsQuery,
    filteredClubItemsCount,
    formDefaultValues,
    formMode,
    handleCategoryChange,
    handleClubChange,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    itemsForSelectedCategory,
    itemsQuery,
    numericCategoryId,
    numericClubId,
    openCreateForm,
    openEditQuantityForm,
    pendingChecklistId,
    searchValue,
    selectedCategory,
    selectedCategoryId,
    selectedClub,
    selectedClubId,
    setSearchValue,
    submitClubItem,
    toggleChecklistStatus,
  } = useClubItemsWorkspace();

  if (clubsQuery.isLoading || itemsQuery.isLoading) {
    return <Loader label="جاري تجهيز مساحة عمل الأندية..." />;
  }

  if (clubsQuery.isError || itemsQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر تجهيز بيانات البداية لمساحة العمل من الباك اند."
        onRetry={() => {
          void clubsQuery.refetch();
          void itemsQuery.refetch();
        }}
        title="فشل تحميل مساحة العمل"
      />
    );
  }

  const showClubPrompt = !numericClubId;
  const showCategoryPrompt = numericClubId && !numericCategoryId;

  return (
    <>
      <div className="space-y-6">
        <Card className="rounded-[2rem] border-white/80 bg-[linear-gradient(180deg,rgba(255,255,255,0.88),rgba(232,242,240,0.78))] shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
          <CardHeader>
            <CardDescription>تشغيل أصناف الأندية</CardDescription>
            <CardTitle className="text-2xl">مساحة تشغيل النادي من البداية للنهاية</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-3">
            <ClubSelector clubs={clubs} onValueChange={handleClubChange} value={selectedClubId} />
            <ClubCategorySelector
              categories={clubCategories}
              disabled={!numericClubId || clubCategoriesQuery.isFetching}
              onValueChange={handleCategoryChange}
              value={selectedCategoryId}
            />
            <div className="rounded-[1.75rem] bg-white/80 p-4 shadow-sm">
              <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
                <PackagePlus className="size-4 text-primary" />
                إضافة صنف للنادي
              </div>
              <p className="text-sm leading-7 text-muted-foreground">
                بعد اختيار النادي والفئة، يمكن ربط الصنف بالكمية المطلوبة أو تعديل الكمية
                الحالية مباشرة من نفس الخطوة.
              </p>
              <Button
                className="mt-4 h-11 w-full rounded-2xl"
                disabled={!numericClubId || !numericCategoryId || !itemsForSelectedCategory.length}
                onClick={openCreateForm}
              >
                <PackagePlus className="size-4" />
                إضافة أو تحديث صنف
              </Button>
            </div>
          </CardContent>
        </Card>

        <section className="grid gap-4 lg:grid-cols-3">
          {[
            {
              title: "تسلسل العمل",
              description: "نادي ثم فئة ثم أصناف",
              icon: ArrowLeftRight,
            },
            {
              title: "النتائج المعروضة",
              description: String(filteredClubItemsCount),
              icon: LayoutGrid,
            },
            {
              title: "المتابعة Scope",
              description: "حالة مستقلة لكل صنف داخل النادي",
              icon: CheckSquare2,
            },
          ].map((item) => (
            <Card key={item.title} className="rounded-[1.8rem] border-white/80 bg-white/80 shadow-sm">
              <CardContent className="flex items-center gap-4 p-5">
                <div className="flex size-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <item.icon className="size-5" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{item.title}</p>
                  <p className="mt-1 font-semibold">{item.description}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </section>

        {numericClubId && numericCategoryId ? (
          <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
            <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle>بحث داخل مساحة العمل</CardTitle>
                <CardDescription>
                  ابحث في أصناف النادي الحالية باستخدام الكود أو الوصف.
                </CardDescription>
              </div>
              <div className="relative w-full sm:w-80">
                <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="h-11 rounded-2xl bg-background/70 pr-10"
                  onChange={(event) => setSearchValue(event.target.value)}
                  placeholder="ابحث بالكود أو الوصف"
                  value={searchValue}
                />
              </div>
            </CardHeader>
          </Card>
        ) : null}

        {showClubPrompt ? (
          <EmptyState
            description="ابدأ أولًا باختيار النادي حتى نتمكن من جلب الفئات المرتبطة به ومساحة العمل الخاصة به."
            title="اختر النادي للمتابعة"
          />
        ) : showCategoryPrompt ? (
          clubCategoriesQuery.isFetching ? (
            <Loader label="جاري تحميل الفئات المرتبطة بالنادي..." />
          ) : clubCategories.length ? (
            <EmptyState
              description="اختر فئة من الفئات المرتبطة بهذا النادي حتى نعرض الأصناف الخاصة بها."
              title="اختر الفئة للمتابعة"
            />
          ) : (
            <EmptyState
              description="هذا النادي لا يحتوي حاليًا على فئات مرتبطة عبر Club Items. أضف ربطًا أولًا من خلال البيانات التشغيلية أو راجع الباك اند."
              title="لا توجد فئات مرتبطة بهذا النادي"
            />
          )
        ) : clubItemsQuery.isLoading || clubItemsQuery.isFetching ? (
          <Loader label="جاري تحميل أصناف النادي داخل الفئة المختارة..." />
        ) : clubItemsQuery.isError ? (
          <ErrorMessage
            description="تعذر جلب أصناف النادي داخل الفئة المختارة من الباك اند."
            onRetry={() => {
              void clubItemsQuery.refetch();
            }}
            title="فشل تحميل أصناف النادي"
          />
        ) : (
          <ClubItemsTable
            clubItems={clubItems}
            onEditQuantity={openEditQuantityForm}
            onToggleChecklist={toggleChecklistStatus}
            pendingChecklistId={pendingChecklistId}
            selectedCategoryName={selectedCategory?.name}
            selectedClubName={selectedClub?.name}
          />
        )}
      </div>

      <AddOrUpdateClubItemForm
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        items={itemsForSelectedCategory}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitClubItem}
      />
    </>
  );
}
