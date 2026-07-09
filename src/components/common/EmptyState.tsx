import type { LucideIcon } from "lucide-react";
import { DatabaseZap } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  actionLabel?: string;
  className?: string;
  description: string;
  icon?: LucideIcon;
  onAction?: () => void;
  title: string;
};

export function EmptyState({
  actionLabel,
  className,
  description,
  icon: Icon = DatabaseZap,
  onAction,
  title,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex min-h-52 flex-col items-center justify-center gap-4 rounded-[2rem] border border-dashed border-border/80 bg-card/75 px-6 py-10 text-center shadow-sm",
        className
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Icon className="size-6" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="max-w-lg text-sm leading-6 text-muted-foreground">
          {description}
        </p>
      </div>
      {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
    </div>
  );
}
