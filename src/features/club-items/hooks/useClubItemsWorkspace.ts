"use client";

import { skipToken } from "@reduxjs/toolkit/query";
import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";

import { useGetClubsQuery } from "@/features/clubs/clubsApi";
import { useGetItemsQuery } from "@/features/items/itemsApi";
import type { Item } from "@/features/items/types";
import { useAddReceiptMutation } from "@/features/receipts/receiptsApi";
import type { AddReceiptSchemaValues } from "@/features/receipts/schema/add-receipt.schema";
import { useGetSuppliersQuery } from "@/features/suppliers/suppliersApi";
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

export function useClubItemsWorkspace() {
  const [selectedClubId, setSelectedClubId] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [searchValue, setSearchValue] = useState("");
  const [statusFilter, setStatusFilter] = useState<WorkspaceStatusFilter>("all");
  const [completedCountFilter, setCompletedCountFilter] =
    useState<CompletedCountFilter>("all");
  const [checklistNameSelection, setChecklistNameSelection] = useState<string[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clubItemBeingEdited, setClubItemBeingEdited] = useState<ClubItem | null>(null);
  const [clubItemForReceipt, setClubItemForReceipt] = useState<ClubItem | null>(null);
  const [isReceiptFormOpen, setIsReceiptFormOpen] = useState(false);
  const [pendingChecklistId, setPendingChecklistId] = useState<number | null>(null);
  const deferredSearch = useDeferredValue(searchValue);

  const clubsQuery = useGetClubsQuery();
  const itemsQuery = useGetItemsQuery();
  const suppliersQuery = useGetSuppliersQuery();

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
  const [addReceipt, addReceiptState] = useAddReceiptMutation();

  const clubs = clubsQuery.data ?? [];
  const clubCategories = useMemo(
    () => clubCategoriesQuery.data ?? [],
    [clubCategoriesQuery.data]
  );
  const items = useMemo(() => itemsQuery.data ?? [], [itemsQuery.data]);
  const suppliers = useMemo(() => suppliersQuery.data ?? [], [suppliersQuery.data]);
  const clubItems = useMemo(() => clubItemsQuery.data ?? [], [clubItemsQuery.data]);

  const selectedClub = clubs.find((club) => club.id === numericClubId) ?? null;
  const selectedCategory =
    clubCategories.find((category) => category.id === numericCategoryId) ?? null;

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

  const itemsMatchingPrimaryFilters = useMemo(() => {
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

      return matchesSearch && matchesStatus && matchesCompletedCount;
    });
  }, [
    clubItems,
    completedCountFilter,
    deferredSearch,
    statusFilter,
  ]);

  const checklistNameOptions = useMemo(() => {
    return Array.from(
      new Set(
        itemsMatchingPrimaryFilters.flatMap((clubItem) =>
          clubItem.checklists.map((checklist) => checklist.checklist_name)
        )
      )
    ).sort((a, b) => a.localeCompare(b, "ar"));
  }, [itemsMatchingPrimaryFilters]);

  const selectedChecklistNames = useMemo(
    () =>
      checklistNameSelection.filter((checklistName) =>
        checklistNameOptions.includes(checklistName)
      ),
    [checklistNameOptions, checklistNameSelection]
  );

  const filteredClubItems = useMemo(() => {
    if (selectedChecklistNames.length === 0) {
      return itemsMatchingPrimaryFilters;
    }

    return itemsMatchingPrimaryFilters.filter((clubItem) =>
      selectedChecklistNames.every((selectedChecklistName) =>
        clubItem.checklists.some(
          (checklist) => checklist.checklist_name === selectedChecklistName
        )
      )
    );
  }, [itemsMatchingPrimaryFilters, selectedChecklistNames]);

  const itemsForSelectedCategory = useMemo(() => {
    if (!numericCategoryId) {
      return [] as Item[];
    }

    return items.filter((item) => item.category === numericCategoryId);
  }, [items, numericCategoryId]);

  const itemsAvailableToAdd = useMemo(() => {
    const linkedItemIds = new Set(clubItems.map((clubItem) => clubItem.item));

    return itemsForSelectedCategory.filter((item) => !linkedItemIds.has(item.id));
  }, [clubItems, itemsForSelectedCategory]);

  const formMode: "create" | "edit" = clubItemBeingEdited ? "edit" : "create";
  const formDefaultValues: ClubItemFormValues = mapClubItemToFormValues(clubItemBeingEdited);
  const isSubmitting = addOrUpdateItemInClubState.isLoading;
  const isReceiptSubmitting = addReceiptState.isLoading;

  function resetFilters() {
    setSearchValue("");
    setStatusFilter("all");
    setCompletedCountFilter("all");
    setChecklistNameSelection([]);
  }

  function toggleChecklistNameSelection(checklistName: string) {
    setChecklistNameSelection((currentValue) => {
      const availableCurrentValue = currentValue.filter((value) =>
        checklistNameOptions.includes(value)
      );

      if (availableCurrentValue.includes(checklistName)) {
        return availableCurrentValue.filter((value) => value !== checklistName);
      }

      return [...availableCurrentValue, checklistName];
    });
  }

  function clearChecklistNameSelection() {
    setChecklistNameSelection([]);
  }

  function handleClubChange(value: string) {
    setSelectedClubId(value);
    setSelectedCategoryId("");
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
    setClubItemForReceipt(null);
    setIsReceiptFormOpen(false);
    resetFilters();
  }

  function handleCategoryChange(value: string) {
    setSelectedCategoryId(value);
    setClubItemBeingEdited(null);
    setIsFormOpen(false);
    setClubItemForReceipt(null);
    setIsReceiptFormOpen(false);
    resetFilters();
  }

  function openCreateForm() {
    setClubItemBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditClubItemForm(clubItem: ClubItem) {
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

  function openReceiptForm(clubItem: ClubItem) {
    const allChecklistsCompleted =
      clubItem.checklists.length > 0 &&
      clubItem.checklists.every((checklist) => checklist.is_completed);
    const remainingQuantity = Math.max(
      clubItem.quantity - (clubItem.received_quantity ?? 0),
      0
    );

    if (!allChecklistsCompleted) {
      toast.error("أكمل جميع عناصر التشيك ليست قبل تأكيد الطلب.");
      return;
    }

    if (remainingQuantity <= 0) {
      toast.error("تم استلام الكمية المطلوبة بالكامل.");
      return;
    }

    setClubItemForReceipt(clubItem);
    setIsReceiptFormOpen(true);
  }

  function closeReceiptForm() {
    setIsReceiptFormOpen(false);
    setClubItemForReceipt(null);
  }

  function handleReceiptFormOpenChange(open: boolean) {
    if (open) {
      setIsReceiptFormOpen(true);
      return;
    }

    closeReceiptForm();
  }

  async function submitReceipt(values: AddReceiptSchemaValues) {
    if (!clubItemForReceipt || !numericClubId || !numericCategoryId) {
      toast.error("تعذر تحديد بيانات الصنف المطلوب استلامه.");
      return;
    }

    try {
      const response = await addReceipt({
        body: {
          club_item: clubItemForReceipt.id,
          supplier: Number(values.supplier),
          quantity_received: Number(values.quantity_received),
        },
        categoryId: numericCategoryId,
        clubId: numericClubId,
      }).unwrap();

      toast.success(response.message);
      closeReceiptForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
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
    checklistNameOptions,
    clubCategories,
    clubCategoriesQuery,
    clearChecklistNameSelection,
    clubItemInsights,
    clubItemBeingEdited,
    clubItemForReceipt,
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
    handleReceiptFormOpenChange,
    isFormOpen,
    isReceiptFormOpen,
    isSubmitting,
    isReceiptSubmitting,
    itemsAvailableToAdd,
    itemsForSelectedCategory,
    itemsQuery,
    numericCategoryId,
    numericClubId,
    openCreateForm,
    openEditClubItemForm,
    openReceiptForm,
    pendingChecklistId,
    resetFilters,
    searchValue,
    selectedCategory,
    selectedCategoryId,
    selectedChecklistNames,
    selectedClub,
    selectedClubId,
    setCompletedCountFilter,
    setSearchValue,
    setStatusFilter,
    statusFilter,
    submitClubItem,
    suppliers,
    suppliersQuery,
    submitReceipt,
    toggleChecklistNameSelection,
    toggleChecklistStatus,
  };
}
