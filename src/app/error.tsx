"use client";

import { useEffect } from "react";

import { ErrorMessage } from "@/components/common/ErrorMessage";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="bg-background p-6">
      <ErrorMessage
        description="حدث خطأ على مستوى التطبيق. أعد المحاولة أو ارجع للصفحة السابقة."
        onRetry={reset}
        title="تعذر تحميل لوحة التحكم"
      />
    </div>
  );
}
