"use client";

import { PackageCheck, Search } from "lucide-react";

import { ErrorMessage } from "@/components/common/ErrorMessage";
import { Loader } from "@/components/common/Loader";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { ReceiptsTable } from "./ReceiptsTable";
import { useReceipts } from "../hooks/useReceipts";

export function ReceiptsPageContent() {
  const {
    allReceiptsCount,
    filteredReceipts,
    receiptsQuery,
    searchValue,
    setSearchValue,
    totalReceivedQuantity,
  } = useReceipts();

  if (receiptsQuery.isLoading) {
    return <Loader label="جاري تحميل سجلات الاستلام من الخادم..." />;
  }

  if (receiptsQuery.isError) {
    return (
      <ErrorMessage
        description="تعذر جلب سجلات الاستلام من الباك اند في الوقت الحالي."
        onRetry={() => {
          void receiptsQuery.refetch();
        }}
        title="فشل تحميل سجلات الاستلام"
      />
    );
  }

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-[1.4fr_0.9fr]">
        <Card className="rounded-[2rem] border-white/80 bg-white/80 shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
          <CardHeader>
            <CardDescription>هيستوري الاستلام</CardDescription>
            <CardTitle className="text-2xl">سجل استلام الموردين للأصناف</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-7 text-muted-foreground">
            <p>
              هذه الصفحة تعرض سجلات الاستلام للقراءة فقط، وتشمل النادي، كود الصنف،
              الكمية المستلمة، اسم المورد، وتاريخ إنشاء السجل.
            </p>
            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">إجمالي السجلات</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {allReceiptsCount}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">النتائج المعروضة</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {filteredReceipts.length}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary p-4">
                <p className="text-xs text-muted-foreground">إجمالي المستلم</p>
                <p className="mt-2 text-2xl font-semibold text-foreground">
                  {totalReceivedQuantity}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-white/80 bg-[linear-gradient(180deg,rgba(230,243,241,0.88),rgba(255,255,255,0.84))] shadow-[0_30px_70px_-48px_rgba(15,23,42,0.4)]">
          <CardHeader>
            <CardDescription>قراءة فقط</CardDescription>
            <CardTitle className="text-xl">ما الذي يظهر هنا؟</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <div className="rounded-2xl bg-white/80 p-4 leading-7 text-foreground">
              سجلات الاستلام يتم حسابها تلقائيًا من العلاقات المرتبطة في قاعدة البيانات.
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/70 px-4 py-3 text-foreground">
              <PackageCheck className="size-4 text-primary" />
              لا توجد عمليات إضافة أو تعديل من هذه الصفحة.
            </div>
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-[2rem] border-white/80 bg-white/84 shadow-[0_30px_70px_-52px_rgba(15,23,42,0.36)]">
        <CardHeader className="gap-4 lg:flex lg:flex-row lg:items-center lg:justify-between">
          <div>
            <CardTitle>بحث داخل سجل الاستلام</CardTitle>
            <CardDescription>
              ابحث باسم النادي أو كود الصنف أو اسم المورد أو تاريخ السجل.
            </CardDescription>
          </div>
          <div className="relative w-full sm:w-80">
            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 rounded-2xl bg-background/70 pr-10"
              onChange={(event) => setSearchValue(event.target.value)}
              placeholder="ابحث في سجل الاستلام"
              value={searchValue}
            />
          </div>
        </CardHeader>
      </Card>

      <ReceiptsTable receipts={filteredReceipts} searchValue={searchValue} />
    </div>
  );
}
