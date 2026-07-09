"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { handleApiError } from "@/lib/api/handleApiError";

import { mapChecklistToFormValues } from "../api";
import {
  useCreateChecklistMutation,
  useDeleteChecklistMutation,
  useGetChecklistsQuery,
  useUpdateChecklistMutation,
} from "../checklistsApi";
import type { Checklist, ChecklistFormValues } from "../types";

export function useChecklists() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [checklistBeingEdited, setChecklistBeingEdited] =
    useState<Checklist | null>(null);
  const [checklistPendingDelete, setChecklistPendingDelete] =
    useState<Checklist | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const checklistsQuery = useGetChecklistsQuery();
  const [createChecklist, createChecklistState] = useCreateChecklistMutation();
  const [updateChecklist, updateChecklistState] = useUpdateChecklistMutation();
  const [deleteChecklist, deleteChecklistState] = useDeleteChecklistMutation();

  const checklists = checklistsQuery.data ?? [];
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const filteredChecklists = normalizedQuery
    ? checklists.filter((checklist) =>
        checklist.name.toLowerCase().includes(normalizedQuery)
      )
    : checklists;

  const formMode: "create" | "edit" = checklistBeingEdited ? "edit" : "create";
  const formDefaultValues: ChecklistFormValues =
    mapChecklistToFormValues(checklistBeingEdited);
  const isSubmitting =
    createChecklistState.isLoading || updateChecklistState.isLoading;

  function openCreateForm() {
    setChecklistBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditForm(checklist: Checklist) {
    setChecklistBeingEdited(checklist);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setChecklistBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  function requestDeleteChecklist(checklist: Checklist) {
    setChecklistPendingDelete(checklist);
  }

  function cancelDeleteChecklist() {
    setChecklistPendingDelete(null);
  }

  async function submitChecklist(values: ChecklistFormValues) {
    try {
      if (checklistBeingEdited) {
        await updateChecklist({
          id: checklistBeingEdited.id,
          body: values,
        }).unwrap();

        toast.success("تم تحديث عنصر المتابعة بنجاح.");
      } else {
        await createChecklist(values).unwrap();
        toast.success("تمت إضافة عنصر المتابعة بنجاح.");
      }

      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function confirmDeleteChecklist() {
    if (!checklistPendingDelete) {
      return;
    }

    try {
      await deleteChecklist(checklistPendingDelete.id).unwrap();
      toast.success("تم حذف عنصر المتابعة بنجاح.");
      setChecklistPendingDelete(null);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return {
    allChecklistsCount: checklists.length,
    cancelDeleteChecklist,
    checklistPendingDelete,
    checklists: filteredChecklists,
    checklistsQuery,
    confirmDeleteChecklist,
    deleteChecklistState,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteChecklist,
    searchValue,
    setSearchValue,
    submitChecklist,
  };
}
