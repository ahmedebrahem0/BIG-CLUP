"use client";

import { useDeferredValue, useState } from "react";
import { toast } from "sonner";

import { handleApiError } from "@/lib/api/handleApiError";

import { mapSupplierToFormValues } from "../api";
import {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} from "../suppliersApi";
import type { Supplier, SupplierFormValues } from "../types";

export function useSuppliers() {
  const [searchValue, setSearchValue] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [supplierBeingEdited, setSupplierBeingEdited] = useState<Supplier | null>(null);
  const [supplierPendingDelete, setSupplierPendingDelete] =
    useState<Supplier | null>(null);
  const deferredSearchValue = useDeferredValue(searchValue);

  const suppliersQuery = useGetSuppliersQuery();
  const [createSupplier, createSupplierState] = useCreateSupplierMutation();
  const [updateSupplier, updateSupplierState] = useUpdateSupplierMutation();
  const [deleteSupplier, deleteSupplierState] = useDeleteSupplierMutation();

  const suppliers = suppliersQuery.data ?? [];
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();
  const filteredSuppliers = normalizedQuery
    ? suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(normalizedQuery)
      )
    : suppliers;

  const formMode: "create" | "edit" = supplierBeingEdited ? "edit" : "create";
  const formDefaultValues: SupplierFormValues =
    mapSupplierToFormValues(supplierBeingEdited);
  const isSubmitting = createSupplierState.isLoading || updateSupplierState.isLoading;

  function openCreateForm() {
    setSupplierBeingEdited(null);
    setIsFormOpen(true);
  }

  function openEditForm(supplier: Supplier) {
    setSupplierBeingEdited(supplier);
    setIsFormOpen(true);
  }

  function closeForm() {
    setIsFormOpen(false);
    setSupplierBeingEdited(null);
  }

  function handleFormOpenChange(open: boolean) {
    if (open) {
      setIsFormOpen(true);
      return;
    }

    closeForm();
  }

  function requestDeleteSupplier(supplier: Supplier) {
    setSupplierPendingDelete(supplier);
  }

  function cancelDeleteSupplier() {
    setSupplierPendingDelete(null);
  }

  async function submitSupplier(values: SupplierFormValues) {
    try {
      if (supplierBeingEdited) {
        await updateSupplier({
          id: supplierBeingEdited.id,
          body: values,
        }).unwrap();

        toast.success("تم تحديث المورد بنجاح.");
      } else {
        await createSupplier(values).unwrap();
        toast.success("تمت إضافة المورد بنجاح.");
      }

      closeForm();
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  async function confirmDeleteSupplier() {
    if (!supplierPendingDelete) {
      return;
    }

    try {
      await deleteSupplier(supplierPendingDelete.id).unwrap();
      toast.success("تم حذف المورد بنجاح.");
      setSupplierPendingDelete(null);
    } catch (error) {
      toast.error(handleApiError(error));
    }
  }

  return {
    allSuppliersCount: suppliers.length,
    cancelDeleteSupplier,
    closeForm,
    confirmDeleteSupplier,
    deleteSupplierState,
    formDefaultValues,
    formMode,
    handleFormOpenChange,
    isFormOpen,
    isSubmitting,
    openCreateForm,
    openEditForm,
    requestDeleteSupplier,
    searchValue,
    setSearchValue,
    submitSupplier,
    supplierPendingDelete,
    suppliers: filteredSuppliers,
    suppliersQuery,
  };
}
