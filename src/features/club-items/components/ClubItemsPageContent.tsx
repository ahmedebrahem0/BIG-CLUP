"use client";

import {
  ArrowLeftRight,
  CheckSquare2,
  Filter,
  LayoutGrid,
  PackagePlus,
  Search,
} from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { AddReceiptForm } from "@/features/receipts/components/AddReceiptForm";

import { AddOrUpdateClubItemForm } from "./AddOrUpdateClubItemForm";
import { ClubCategorySelector } from "./ClubCategorySelector";
import { ClubItemsTable } from "./ClubItemsTable";
import { ClubSelector } from "./ClubSelector";
import { useClubItemsWorkspace } from "../hooks/useClubItemsWorkspace";

export function ClubItemsPageContent() {
  const {
    checklistNameOptions,
    clubCategories,
    clubCategoriesQuery,
    clearChecklistNameSelection,
    clubItemInsights,
    clubItemForReceipt,
    clubItems,
    clubItemsQuery,
    clubs,
    clubsQuery,
    completedCountFilter,
    filteredClubItemsCount,
    formDefaultValues,
    formMode,
    handleCategoryChange,
    handleClubChange,
    handleFormOpenChange,
    handleReceiptFormOpenChange,
    isFormOpen,
    isReceiptFormOpen,
    isSubmitting,
    isReceiptSubmitting,
    itemsAvailableToAdd,
    itemsForSelectedCategory,
    itemsQuery,
    numericCategoryId,
    numericClubId,
    openCreateForm,
    openEditClubItemForm,
    openReceiptForm,
    pendingChecklistId,
    resetFilters,
    searchValue,
    selectedCategory,
    selectedCategoryId,
    selectedChecklistNames,
    selectedClub,
    selectedClubId,
    setCompletedCountFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    submitClubItem,
    submitReceipt,
    suppliers,
    suppliersQuery,
    toggleChecklistNameSelection,
    toggleChecklistStatus,
  } = useClubItemsWorkspace();

  if (clubsQuery.isLoading || itemsQuery.isLoading || suppliersQuery.isLoading) {
    return <Loader label="جاري تجهيز مساحة عمل الأندية..." />;
  }

  if (clubsQuery.isError || itemsQuery.isError || suppliersQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر تجهيز بيانات البداية لمساحة العمل من الباك اند."
        onRetry={() => {
          void clubsQuery.refetch();
          void itemsQuery.refetch();
          void suppliersQuery.refetch();
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
                بعد اختيار النادي والفئة، يمكن ربط صنف جديد فقط. تعديل بيانات الصنف يتم من زر تعديل البيانات داخل الصف الموجود.
              </p>
              <Button
                className="mt-4 h-11 w-full rounded-2xl"
                disabled={!numericClubId || !numericCategoryId}
                onClick={openCreateForm}
              >
                <PackagePlus className="size-4" />
                إضافة صنف
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
            <CardHeader className="gap-5">
              <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                <div>
                  <CardTitle>بحث وفلترة داخل مساحة العمل</CardTitle>
                  <CardDescription>
                    ابدأ بحالة التنفيذ وعدد الخطوات المكتملة، ثم ضيّق النتائج باختيار اسم
                    أو أكثر من التشيك ليست.
                  </CardDescription>
                </div>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                  <div className="relative w-full sm:w-80">
                    <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      className="h-11 rounded-2xl bg-background/70 pr-10"
                      onChange={(event) => setSearchValue(event.target.value)}
                      placeholder="ابحث بالكود أو الوصف"
                      value={searchValue}
                    />
                  </div>
                  <Button onClick={resetFilters} size="sm" variant="outline">
                    <Filter className="size-4" />
                    إعادة ضبط الفلاتر
                  </Button>
                </div>
              </div>

              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/80">حالة التنفيذ</p>
                  <Select onValueChange={(value) => setStatusFilter(value as typeof statusFilter)} value={statusFilter}>
                    <SelectTrigger className="h-11 w-full rounded-2xl bg-background/70 px-4">
                      <SelectValue placeholder="حالة التنفيذ" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الأصناف</SelectItem>
                      <SelectItem value="all-completed">كل الـ checklist مكتملة</SelectItem>
                      <SelectItem value="has-pending">فيها عناصر غير مكتملة</SelectItem>
                      <SelectItem value="none-completed">ولا عنصر مكتمل</SelectItem>
                      <SelectItem value="mixed">بعضها مكتمل وبعضها لا</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-foreground/80">عدد الخطوات المكتملة</p>
                  <Select
                    onValueChange={(value) => setCompletedCountFilter(value as typeof completedCountFilter)}
                    value={completedCountFilter}
                  >
                    <SelectTrigger className="h-11 w-full rounded-2xl bg-background/70 px-4">
                      <SelectValue placeholder="عدد المكتمل" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">كل الأعداد</SelectItem>
                      <SelectItem value="0">بدون أي عنصر مكتمل</SelectItem>
                      <SelectItem value="1">عنصر واحد مكتمل</SelectItem>
                      <SelectItem value="2plus">عنصران أو أكثر مكتملان</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

              </div>

              <div className="rounded-[1.5rem] border border-border/60 bg-background/70 p-4">
                <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground/80">اختيار أسماء التشيك ليست</p>
                    <p className="text-xs text-muted-foreground">
                      الأسماء المتاحة مبنية على النتائج الحالية. اختر اسمًا واحدًا أو أكثر
                      لعرض الأصناف التي تحتوي على كل الأسماء المحددة.
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="rounded-full" variant="secondary">
                      {selectedChecklistNames.length} محدد
                    </Badge>
                    <Button
                      className="rounded-full"
                      disabled={selectedChecklistNames.length === 0}
                      onClick={clearChecklistNameSelection}
                      size="sm"
                      variant="outline"
                    >
                      مسح الاختيار
                    </Button>
                  </div>
                </div>

                {checklistNameOptions.length ? (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {checklistNameOptions.map((checklistName) => {
                      const isSelected = selectedChecklistNames.includes(checklistName);

                      return (
                        <button
                          key={checklistName}
                          className={[
                            "flex items-center gap-3 rounded-2xl border px-4 py-3 text-right transition-colors",
                            isSelected
                              ? "border-primary/40 bg-primary/10 text-foreground"
                              : "border-border/60 bg-white/80 hover:border-primary/30 hover:bg-primary/5",
                          ].join(" ")}
                          onClick={() => toggleChecklistNameSelection(checklistName)}
                          type="button"
                        >
                          <Checkbox checked={isSelected} />
                          <span className="text-sm font-medium leading-6">{checklistName}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    لا توجد أسماء checklist متاحة داخل النتائج الحالية.
                  </p>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Badge className="rounded-full bg-primary/10 px-4 py-1.5 text-primary hover:bg-primary/10" variant="secondary">
                  {filteredClubItemsCount} نتيجة من أصل {clubItemInsights.total}
                </Badge>
                <Button
                  className="rounded-full"
                  onClick={() => {
                    setStatusFilter("all");
                    setCompletedCountFilter("all");
                  }}
                  size="sm"
                  variant={statusFilter === "all" && completedCountFilter === "all" ? "default" : "outline"}
                >
                  الكل ({clubItemInsights.total})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setStatusFilter("all-completed")}
                  size="sm"
                  variant={statusFilter === "all-completed" ? "default" : "outline"}
                >
                  مكتمل بالكامل ({clubItemInsights.allCompleted})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setStatusFilter("has-pending")}
                  size="sm"
                  variant={statusFilter === "has-pending" ? "default" : "outline"}
                >
                  فيه نواقص ({clubItemInsights.hasPending})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setStatusFilter("none-completed")}
                  size="sm"
                  variant={statusFilter === "none-completed" ? "default" : "outline"}
                >
                  ولا خطوة ({clubItemInsights.noneCompleted})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setStatusFilter("mixed")}
                  size="sm"
                  variant={statusFilter === "mixed" ? "default" : "outline"}
                >
                  حالة مختلطة ({clubItemInsights.mixed})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setCompletedCountFilter("1")}
                  size="sm"
                  variant={completedCountFilter === "1" ? "default" : "outline"}
                >
                  نوع واحد متعلم ({clubItemInsights.exactlyOneCompleted})
                </Button>
                <Button
                  className="rounded-full"
                  onClick={() => setCompletedCountFilter("2plus")}
                  size="sm"
                  variant={completedCountFilter === "2plus" ? "default" : "outline"}
                >
                  نوعان أو أكثر ({clubItemInsights.twoOrMoreCompleted})
                </Button>
              </div>
            </CardHeader>
          </Card>
        ) : null}

        {showClubPrompt ? (
          <EmptyState
            description="ابدأ أولًا باختيار النادي، ثم اختر أي فئة لإضافة صنف جديد أو متابعة الأصناف المرتبطة به."
            title="اختر النادي للمتابعة"
          />
        ) : showCategoryPrompt ? (
          clubCategoriesQuery.isFetching ? (
            <Loader label="جاري تحميل فئات النادي..." />
          ) : clubCategoriesQuery.isError ? (
            <ErrorMessage
              description="تعذر جلب فئات النادي المختار من الباك اند."
              onRetry={() => {
                void clubCategoriesQuery.refetch();
              }}
              title="فشل تحميل فئات النادي"
            />
          ) : clubCategories.length ? (
            <EmptyState
              description="اختر فئة من فئات النادي لعرض الأصناف المرتبطة بها أو إضافة صنف جديد داخلها."
              title="اختر الفئة للمتابعة"
            />
          ) : (
            <EmptyState
              description="هذا النادي لا يحتوي حاليًا على فئات مرتبطة عبر Club Items."
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
            onConfirmReceipt={openReceiptForm}
            onEditClubItem={openEditClubItemForm}
            onToggleChecklist={toggleChecklistStatus}
            pendingChecklistId={pendingChecklistId}
            selectedCategoryName={selectedCategory?.name}
            selectedClubName={selectedClub?.name}
          />
        )}
      </div>

      <AddReceiptForm
        clubItem={clubItemForReceipt}
        isOpen={isReceiptFormOpen}
        isSubmitting={isReceiptSubmitting}
        onOpenChange={handleReceiptFormOpenChange}
        onSubmit={submitReceipt}
      />
      <AddOrUpdateClubItemForm
        defaultValues={formDefaultValues}
        isOpen={isFormOpen}
        isSubmitting={isSubmitting}
        items={formMode === "create" ? itemsAvailableToAdd : itemsForSelectedCategory}
        mode={formMode}
        onOpenChange={handleFormOpenChange}
        onSubmit={submitClubItem}
        suppliers={suppliers}
      />
    </>
  );
}
