"use client";

import { useEffect } from "react";

import { ErrorMessage } from "@/components/common/ErrorMessage";

type DashboardErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <ErrorMessage
      description="حدث خطأ أثناء تحميل هذه الصفحة داخل لوحة التحكم."
      onRetry={reset}
      title="تعذر عرض الصفحة"
    />
  );
}
