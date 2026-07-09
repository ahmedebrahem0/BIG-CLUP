"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { toast } from "sonner";

import { handleApiError } from "@/lib/api/handleApiError";

import {
  mapCategoryFormValuesToPayload,
  mapCategoryToFormValues,
} from "../api";
import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "../categoriesApi";
import { buildCategoryTree } from "../lib/buildCategoryTree";
import type { Category, CategoryFormValues } from "../types";

export function useCategories() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [categoryBeingEdited, setCategoryBeingEdited] =
    useState<Category | null>(null);
  const [categoryPendingDelete, setCategoryPendingDelete] =
    useState<Category | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const categoriesQuery = useGetCategoriesQuery();
  const [createCategory, createCategoryState] = useCreateCategoryMutation();
  const [updateCategory, updateCategoryState] = useUpdateCategoryMutation();
  const [deleteCategory, deleteCategoryState] = useDeleteCategoryMutation();

  const categories = categoriesQuery.data ?? [];
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();

  const orderedCategories = useMemo(() => {
    const byId = new Map(categories.map((category) => [category.id, category]));

    return buildCategoryTree(categories)
      .map((treeItem) => byId.get(treeItem.id))
      .filter((category): category is Category => Boolean(category));
  }, [categories]);

  const filteredCategories = normalizedQuery
    ? orderedCategories.filter((category) => {
        const parentName = category.parent_name?.toLowerCase() ?? "";

        return (
          category.name.toLowerCase().includes(normalizedQuery) ||
          parentName.includes(normalizedQuery)
        );
      })
    : orderedCategories;

  const formMode: "create" | "edit" = categoryBeingEdited ? "edit" : "create";
  const formDefaultValues: CategoryFormValues =
    mapCategoryToFormValues(categoryBeingEdited);
  const isSubmitting = createCategoryState.isLoading || updateCategoryState.isLoading;

  function openCreateForm() {
    setCategoryBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditForm(category: Category) {
    setCategoryBeingEdited(category);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setCategoryBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  function requestDeleteCategory(category: Category) {
    setCategoryPendingDelete(category);
  }

  function cancelDeleteCategory() {
    setCategoryPendingDelete(null);
  }

  async function submitCategory(values: CategoryFormValues) {
    try {
      const payload = mapCategoryFormValuesToPayload(values);

      if (categoryBeingEdited) {
        await updateCategory({
          id: categoryBeingEdited.id,
          body: payload,
        }).unwrap();

        toast.success("تم تحديث الفئة بنجاح.");
      } else {
        await createCategory(payload).unwrap();
        toast.success("تمت إضافة الفئة بنجاح.");
      }

      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function confirmDeleteCategory() {
    if (!categoryPendingDelete) {
      return;
    }

    try {
      await deleteCategory(categoryPendingDelete.id).unwrap();
      toast.success("تم حذف الفئة بنجاح.");
      setCategoryPendingDelete(null);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return {
    allCategoriesCount: categories.length,
    cancelDeleteCategory,
    categories,
    categoriesQuery,
    categoryBeingEdited,
    categoryPendingDelete,
    confirmDeleteCategory,
    deleteCategoryState,
    filteredCategories,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteCategory,
    searchValue,
    setSearchValue,
    submitCategory,
  };
}
