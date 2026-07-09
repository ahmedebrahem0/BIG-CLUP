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

export function useClubItemsWorkspace() {
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchValue, setSearchValue] = useState("");
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

  const filteredClubItems = useMemo(() => {
    const normalizedQuery = deferredSearch.trim().toLowerCase();

    if (!normalizedQuery) {
      return clubItems;
    }

    return clubItems.filter((clubItem) => {
      return (
        clubItem.item_code.toLowerCase().includes(normalizedQuery) ||
        clubItem.item_description.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [clubItems, deferredSearch]);

  const itemsForSelectedCategory = useMemo(() => {
    if (!numericCategoryId) {
      return [] as Item[];
    }

    return items.filter((item) => item.category === numericCategoryId);
  }, [items, numericCategoryId]);

  const formMode: "create" | "edit" = clubItemBeingEdited ? "edit" : "create";
  const formDefaultValues: ClubItemFormValues = mapClubItemToFormValues(clubItemBeingEdited);
  const isSubmitting = addOrUpdateItemInClubState.isLoading;

  function handleClubChange(value: string) {
    setSelectedClubId(value);
    setSelectedCategoryId("");
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
  }

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
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
    clubCategories,
    clubCategoriesQuery,
    clubItemBeingEdited,
    clubItems: filteredClubItems,
    clubItemsQuery,
    clubs,
    clubsQuery,
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
    searchValue,
    selectedCategory,
    selectedCategoryId,
    selectedClub,
    selectedClubId,
    setSearchValue,
    submitClubItem,
    toggleChecklistStatus,
  };
}
