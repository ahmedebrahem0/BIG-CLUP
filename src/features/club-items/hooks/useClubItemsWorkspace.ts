"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";

import { useGetClubsQuery } from "@/features/clubs/clubsApi";
import { useGetItemsQuery } from "@/features/items/itemsApi";
import type { Item } from "@/features/items/types";
import { handleApiError } from "@/lib/api/handleApiError";

import {
  mapClubItemFormValuesToPayload,
  mapClubItemToFormValues,
} from "../api";
import {
  useAddOrUpdateItemInClubMutation,
  useGetClubCategoriesQuery,
  useGetClubItemsByCategoryQuery,
  useUpdateClubChecklistStatusMutation,
} from "../clubItemsApi";
import type {
  ClubItem,
  ClubItemChecklistEntry,
  ClubItemFormValues,
} from "../types";

type WorkspaceStatusFilter =
  | "all"
  | "all-completed"
  | "has-pending"
  | "none-completed"
  | "mixed";

type CompletedCountFilter = "all" | "0" | "1" | "2plus";
type ChecklistMatchFilter = "all" | "checked" | "unchecked";

export function useClubItemsWorkspace() {
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkspaceStatusFilter>("all");
  const [completedCountFilter, setCompletedCountFilter] =
    useState<CompletedCountFilter>("all");
  const [selectedChecklistNames, setSelectedChecklistNames] = useState<string[]>([]);
  const [checklistMatchFilter, setChecklistMatchFilter] =
    useState<ChecklistMatchFilter>("all");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clubItemBeingEdited, setClubItemBeingEdited] = useState<ClubItem | null>(null);
  const [pendingChecklistId, setPendingChecklistId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchValue);

  const clubsQuery = useGetClubsQuery();
  const itemsQuery = useGetItemsQuery();

  const numericClubId = selectedClubId ? Number(selectedClubId) : null;
  const numericCategoryId = selectedCategoryId ? Number(selectedCategoryId) : null;

  const clubCategoriesQuery = useGetClubCategoriesQuery(numericClubId ?? skipToken);
  const clubItemsQuery = useGetClubItemsByCategoryQuery(
    numericClubId && numericCategoryId
      ? { clubId: numericClubId, categoryId: numericCategoryId }
      : skipToken
  );

  const [addOrUpdateItemInClub, addOrUpdateItemInClubState] =
    useAddOrUpdateItemInClubMutation();
  const [updateClubChecklistStatus] = useUpdateClubChecklistStatusMutation();

  const clubs = clubsQuery.data ?? [];
  const items = itemsQuery.data ?? [];
  const clubCategories = clubCategoriesQuery.data ?? [];
  const clubItems = clubItemsQuery.data ?? [];

  const selectedClub = clubs.find((club) => club.id === numericClubId) ?? null;
  const selectedCategory =
    clubCategories.find((category) => category.id === numericCategoryId) ?? null;

  const checklistNameOptions = useMemo(() => {
    return Array.from(
      new Set(
        clubItems.flatMap((clubItem) =>
          clubItem.checklists.map((checklist) => checklist.checklist_name)
        )
      )
    ).sort((a, b) => a.localeCompare(b, "ar"));
  }, [clubItems]);

  const clubItemInsights = useMemo(() => {
    return clubItems.reduce(
      (accumulator, clubItem) => {
        const completedCount = clubItem.checklists.filter(
          (checklist) => checklist.is_completed
        ).length;
        const totalCount = clubItem.checklists.length;
        const hasPending = clubItem.checklists.some((checklist) => !checklist.is_completed);

        accumulator.total += 1;

        if (completedCount === 0) {
          accumulator.noneCompleted += 1;
        }

        if (completedCount === 1) {
          accumulator.exactlyOneCompleted += 1;
        }

        if (completedCount >= 2) {
          accumulator.twoOrMoreCompleted += 1;
        }

        if (completedCount > 0) {
          accumulator.anyCompleted += 1;
        }

        if (totalCount > 0 && completedCount === totalCount) {
          accumulator.allCompleted += 1;
        }

        if (hasPending) {
          accumulator.hasPending += 1;
        }

        if (completedCount > 0 && completedCount < totalCount) {
          accumulator.mixed += 1;
        }

        return accumulator;
      },
      {
        allCompleted: 0,
        anyCompleted: 0,
        exactlyOneCompleted: 0,
        hasPending: 0,
        mixed: 0,
        noneCompleted: 0,
        total: 0,
        twoOrMoreCompleted: 0,
      }
    );
  }, [clubItems]);

  const filteredClubItems = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    return clubItems.filter((clubItem) => {
      const completedCount = clubItem.checklists.filter(
        (checklist) => checklist.is_completed
      ).length;
      const totalCount = clubItem.checklists.length;
      const hasCompleted = completedCount > 0;
      const hasPending = clubItem.checklists.some((checklist) => !checklist.is_completed);
      const isAllCompleted = totalCount > 0 && completedCount === totalCount;
      const isNoneCompleted = totalCount > 0 && completedCount === 0;
      const isMixed = hasCompleted && hasPending;

      const matchesSearch =
        !normalizedQuery ||
        clubItem.item_code.toLowerCase().includes(normalizedQuery) ||
        clubItem.item_description.toLowerCase().includes(normalizedQuery);

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "all-completed" && isAllCompleted) ||
        (statusFilter === "has-pending" && hasPending) ||
        (statusFilter === "none-completed" && isNoneCompleted) ||
        (statusFilter === "mixed" && isMixed);

      const matchesCompletedCount =
        completedCountFilter === "all" ||
        (completedCountFilter === "0" && completedCount === 0) ||
        (completedCountFilter === "1" && completedCount === 1) ||
        (completedCountFilter === "2plus" && completedCount >= 2);

      const matchesSelectedChecklistNames =
        selectedChecklistNames.length === 0 ||
        selectedChecklistNames.every((selectedChecklistName) => {
          const checklist = clubItem.checklists.find(
            (entry) => entry.checklist_name === selectedChecklistName
          );

          if (!checklist) {
            return false;
          }

          if (checklistMatchFilter === "all") {
            return true;
          }

          if (checklistMatchFilter === "checked") {
            return checklist.is_completed;
          }

          return !checklist.is_completed;
        });

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCompletedCount &&
        matchesSelectedChecklistNames
      );
    });
  }, [
    checklistMatchFilter,
    clubItems,
    completedCountFilter,
    deferredSearch,
    selectedChecklistNames,
    statusFilter,
  ]);

  const itemsForSelectedCategory = useMemo(() => {
    if (!numericCategoryId) {
      return [] as Item[];
    }

    return items.filter((item) => item.category === numericCategoryId);
  }, [items, numericCategoryId]);

  const formMode: "create" | "edit" = clubItemBeingEdited ? "edit" : "create";
  const formDefaultValues: ClubItemFormValues = mapClubItemToFormValues(clubItemBeingEdited);
  const isSubmitting = addOrUpdateItemInClubState.isLoading;

  function resetFilters() {
    setSearchValue("");
    setStatusFilter("all");
    setCompletedCountFilter("all");
    setSelectedChecklistNames([]);
    setChecklistMatchFilter("all");
  }

  function toggleChecklistNameSelection(checklistName: string) {
    setSelectedChecklistNames((currentValue) => {
      if (currentValue.includes(checklistName)) {
        return currentValue.filter((value) => value !== checklistName);
      }

      return [...currentValue, checklistName];
    });
  }

  function clearChecklistNameSelection() {
    setSelectedChecklistNames([]);
  }

  function handleClubChange(value: string) {
    setSelectedClubId(value);
    setSelectedCategoryId("");
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
    resetFilters();
  }

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
    resetFilters();
  }

  function openCreateForm() {
    setClubItemBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditQuantityForm(clubItem: ClubItem) {
    setClubItemBeingEdited(clubItem);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setClubItemBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  async function submitClubItem(values: ClubItemFormValues) {
    if (!numericClubId) {
      toast.error("اختر النادي أولًا.");
      return;
    }

    try {
      const payload = mapClubItemFormValuesToPayload(values);
      const response = await addOrUpdateItemInClub({
        clubId: numericClubId,
        body: payload,
        categoryId: numericCategoryId ?? undefined,
      }).unwrap();

      toast.success(response.message);
      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function toggleChecklistStatus(
    checklist: ClubItemChecklistEntry,
    nextValue: boolean
  ) {
    if (!numericClubId || !numericCategoryId) {
      return;
    }

    setPendingChecklistId(checklist.id);

    try {
      const response = await updateClubChecklistStatus({
        checklistEntryId: checklist.id,
        body: { is_completed: nextValue },
        clubId: numericClubId,
        categoryId: numericCategoryId,
      }).unwrap();

      toast.success(response.message);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setPendingChecklistId(null);
    }
  }

  return {
    checklistMatchFilter,
    checklistNameOptions,
    clearChecklistNameSelection,
    clubItemInsights,
    clubCategories,
    clubCategoriesQuery,
    clubItemBeingEdited,
    clubItems: filteredClubItems,
    clubItemsQuery,
    clubs,
    clubsQuery,
    completedCountFilter,
    filteredClubItemsCount: filteredClubItems.length,
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
    resetFilters,
    searchValue,
    selectedCategory,
    selectedCategoryId,
    selectedChecklistNames,
    selectedClub,
    selectedClubId,
    setChecklistMatchFilter,
    setCompletedCountFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    submitClubItem,
    toggleChecklistNameSelection,
    toggleChecklistStatus,
  };
}
