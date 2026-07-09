"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { handleApiError } from "@/lib/api/handleApiError";

import { mapClubToFormValues } from "../api";
import {
  useCreateClubMutation,
  useDeleteClubMutation,
  useGetClubsQuery,
  useUpdateClubMutation,
} from "../clubsApi";
import type { Club, ClubFormValues } from "../types";

export function useClubs() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [clubBeingEdited, setClubBeingEdited] = useState<Club | null>(null);
  const [clubPendingDelete, setClubPendingDelete] = useState<Club | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const clubsQuery = useGetClubsQuery();
  const [createClub, createClubState] = useCreateClubMutation();
  const [updateClub, updateClubState] = useUpdateClubMutation();
  const [deleteClub, deleteClubState] = useDeleteClubMutation();

  const clubs = clubsQuery.data ?? [];
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const filteredClubs = normalizedQuery
    ? clubs.filter((club) => club.name.toLowerCase().includes(normalizedQuery))
    : clubs;

  const formMode: "create" | "edit" = clubBeingEdited ? "edit" : "create";
  const formDefaultValues: ClubFormValues = mapClubToFormValues(clubBeingEdited);
  const isSubmitting = createClubState.isLoading || updateClubState.isLoading;

  function openCreateForm() {
    setClubBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditForm(club: Club) {
    setClubBeingEdited(club);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setClubBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  function requestDeleteClub(club: Club) {
    setClubPendingDelete(club);
  }

  function cancelDeleteClub() {
    setClubPendingDelete(null);
  }

  async function submitClub(values: ClubFormValues) {
    try {
      if (clubBeingEdited) {
        await updateClub({
          id: clubBeingEdited.id,
          body: values,
        }).unwrap();

        toast.success("تم تحديث النادي بنجاح.");
      } else {
        await createClub(values).unwrap();
        toast.success("تمت إضافة النادي بنجاح.");
      }

      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function confirmDeleteClub() {
    if (!clubPendingDelete) {
      return;
    }

    try {
      await deleteClub(clubPendingDelete.id).unwrap();
      toast.success("تم حذف النادي بنجاح.");
      setClubPendingDelete(null);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return {
    allClubsCount: clubs.length,
    cancelDeleteClub,
    closeForm,
    clubPendingDelete,
    clubs: filteredClubs,
    clubsQuery,
    confirmDeleteClub,
    deleteClubState,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteClub,
    searchValue,
    setSearchValue,
    submitClub,
  };
}
