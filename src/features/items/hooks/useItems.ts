"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import { handleApiError } from "@/lib/api/handleApiError";

import { mapItemFormValuesToPayload, mapItemToFormValues } from "../api";
import {
  useCreateItemMutation,
  useDeleteItemMutation,
  useGetItemsQuery,
  useUpdateItemChecklistStatusMutation,
  useUpdateItemMutation,
} from "../itemsApi";
import type { Item, ItemChecklistEntry, ItemFormValues } from "../types";

export function useItems() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [itemBeingEdited, setItemBeingEdited] = useState<Item | null>(null);
  const [itemPendingDelete, setItemPendingDelete] = useState<Item | null>(null);
  const [pendingChecklistId, setPendingChecklistId] = useState<number | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const itemsQuery = useGetItemsQuery();
  const categoriesQuery = useGetCategoriesQuery();
  const [createItem, createItemState] = useCreateItemMutation();
  const [updateItem, updateItemState] = useUpdateItemMutation();
  const [deleteItem, deleteItemState] = useDeleteItemMutation();
  const [updateItemChecklistStatus] = useUpdateItemChecklistStatusMutation();

  const items = itemsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const filteredItems = normalizedQuery
    ? items.filter((item) => {
        return (
          item.item_code.toLowerCase().includes(normalizedQuery) ||
          item.description.toLowerCase().includes(normalizedQuery) ||
          item.category_name.toLowerCase().includes(normalizedQuery)
        );
      })
    : items;

  const formMode: "create" | "edit" = itemBeingEdited ? "edit" : "create";
  const formDefaultValues: ItemFormValues = mapItemToFormValues(itemBeingEdited);
  const isSubmitting = createItemState.isLoading || updateItemState.isLoading;

  function openCreateForm() {
    setItemBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditForm(item: Item) {
    setItemBeingEdited(item);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setItemBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  function requestDeleteItem(item: Item) {
    setItemPendingDelete(item);
  }

  function cancelDeleteItem() {
    setItemPendingDelete(null);
  }

  async function submitItem(values: ItemFormValues) {
    try {
      const payload = mapItemFormValuesToPayload(values);

      if (itemBeingEdited) {
        await updateItem({
          id: itemBeingEdited.id,
          body: payload,
        }).unwrap();

        toast.success("تم تحديث الصنف بنجاح.");
      } else {
        await createItem(payload).unwrap();
        toast.success("تمت إضافة الصنف بنجاح.");
      }

      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function confirmDeleteItem() {
    if (!itemPendingDelete) {
      return;
    }

    try {
      await deleteItem(itemPendingDelete.id).unwrap();
      toast.success("تم حذف الصنف بنجاح.");
      setItemPendingDelete(null);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function toggleChecklistStatus(
    itemId: number,
    checklist: ItemChecklistEntry,
    nextValue: boolean
  ) {
    setPendingChecklistId(checklist.id);

    try {
      const response = await updateItemChecklistStatus({
        checklistEntryId: checklist.id,
        body: { is_completed: nextValue },
        itemId,
      }).unwrap();

      toast.success(response.message);
    } catch (error) {
      toast.error(handleApiError(error));
    } finally {
      setPendingChecklistId(null);
    }
  }

  return {
    allItemsCount: items.length,
    cancelDeleteItem,
    categories,
    categoriesQuery,
    confirmDeleteItem,
    deleteItemState,
    filteredItems,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    itemBeingEdited,
    itemPendingDelete,
    itemsQuery,
    openCreateForm,
    openEditForm,
    pendingChecklistId,
    requestDeleteItem,
    searchValue,
    setSearchValue,
    submitItem,
    toggleChecklistStatus,
  };
}
