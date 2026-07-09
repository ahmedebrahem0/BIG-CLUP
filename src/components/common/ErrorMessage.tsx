import { AlertTriangle, RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ErrorMessageProps = {
  className?: string;
  description?: string;
  title?: string;
  onRetry?: () => void;
};

export function ErrorMessage({
  className,
  description = "تعذر تحميل هذه البيانات الآن. حاول مرة أخرى بعد قليل.",
  title = "حدث خطأ في عرض المحتوى",
  onRetry,
}: ErrorMessageProps) {
  return (
    <div
      className={cn(
        "flex min-h-40 flex-col items-center justify-center gap-4 rounded-3xl border border-destructive/20 bg-destructive/5 px-6 py-10 text-center",
        className
      )}
    >
      <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <AlertTriangle className="size-5" />
      </div>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-foreground">{title}</h3>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      {onRetry ? (
        <Button onClick={onRetry} variant="outline">
          <RotateCcw />
          إعادة المحاولة
        </Button>
      ) : null}
    </div>
  );
}
