"use client";

import { LayoutGrid } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/features/categories/types";

type ClubCategorySelectorProps = {
  categories: Category[];
  disabled?: boolean;
  onValueChange: (value: string) => void;
  value: string;
};

export function ClubCategorySelector({
  categories,
  disabled = false,
  onValueChange,
  value,
}: ClubCategorySelectorProps) {
  return (
    <div className="rounded-[1.75rem] bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <LayoutGrid className="size-4 text-primary" />
        اختيار الفئة
      </div>
      <Label className="sr-only" htmlFor="club-category-selector">
        الفئة
      </Label>
      <Select onValueChange={(nextValue) => onValueChange(nextValue ?? "")} value={value}>
        <SelectTrigger
          className="h-11 w-full rounded-2xl bg-background/70 px-4"
          disabled={disabled}
          id="club-category-selector"
        >
          <SelectValue placeholder="اختر الفئة التابعة للنادي" />
        </SelectTrigger>
        <SelectContent>
          {categories.map((category) => (
            <SelectItem key={category.id} value={String(category.id)}>
              {category.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
