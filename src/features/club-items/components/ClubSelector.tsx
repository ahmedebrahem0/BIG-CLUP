"use client";

import { Building2 } from "lucide-react";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Club } from "@/features/clubs/types";

type ClubSelectorProps = {
  clubs: Club[];
  onValueChange: (value: string) => void;
  value: string;
};

export function ClubSelector({ clubs, onValueChange, value }: ClubSelectorProps) {
  return (
    <div className="rounded-[1.75rem] bg-white/80 p-4 shadow-sm">
      <div className="mb-3 flex items-center gap-2 text-sm font-semibold">
        <Building2 className="size-4 text-primary" />
        اختيار النادي
      </div>
      <Label className="sr-only" htmlFor="club-selector">
        النادي
      </Label>
      <Select onValueChange={(nextValue) => onValueChange(nextValue ?? "")} value={value}>
        <SelectTrigger className="h-11 w-full rounded-2xl bg-background/70 px-4" id="club-selector">
          <SelectValue placeholder="اختر النادي" />
        </SelectTrigger>
        <SelectContent>
          {clubs.map((club) => (
            <SelectItem key={club.id} value={String(club.id)}>
              {club.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
