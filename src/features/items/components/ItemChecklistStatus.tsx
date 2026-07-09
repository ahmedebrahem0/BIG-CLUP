"use client";

import { LoaderCircle } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

import type { ItemChecklistEntry } from "../types";

type ItemChecklistStatusProps = {
  checklist: ItemChecklistEntry;
  isPending?: boolean;
  onToggle: (nextValue: boolean) => void;
};

export function ItemChecklistStatus({
  checklist,
  isPending = false,
  onToggle,
}: ItemChecklistStatusProps) {
  return (
    <label
      className={cn(
        "flex items-center gap-3 rounded-2xl border px-3 py-2 text-sm transition-colors",
        checklist.is_completed
          ? "border-primary/15 bg-primary/5"
          : "border-border/80 bg-secondary/50"
      )}
    >
      {isPending ? (
        <div className="flex size-4 items-center justify-center text-primary">
          <LoaderCircle className="size-3.5 animate-spin" />
        </div>
      ) : (
        <Checkbox
          checked={checklist.is_completed}
          onCheckedChange={(checked) => onToggle(Boolean(checked))}
        />
      )}
      <div className="flex flex-col gap-0.5">
        <span className="font-medium text-foreground">{checklist.checklist_name}</span>
        <span className="text-xs text-muted-foreground">
          {checklist.is_completed ? "مكتمل" : "غير مكتمل"}
        </span>
      </div>
    </label>
  );
}
