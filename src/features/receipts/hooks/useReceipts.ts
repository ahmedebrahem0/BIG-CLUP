"use client";

import { useDeferredValue, useMemo, useState } from "react";

import { useGetReceiptsQuery } from "../receiptsApi";

export function useReceipts() {
  const [searchValue, setSearchValue] = useState("");
  const deferredSearchValue = useDeferredValue(searchValue);

  const receiptsQuery = useGetReceiptsQuery();
  const receipts = useMemo(() => receiptsQuery.data ?? [], [receiptsQuery.data]);
  const normalizedQuery = deferredSearchValue.trim().toLowerCase();

  const filteredReceipts = useMemo(() => {
    if (!normalizedQuery) {
      return receipts;
    }

    return receipts.filter((receipt) => {
      return (
        receipt.club_name.toLowerCase().includes(normalizedQuery) ||
        receipt.club_item.toLowerCase().includes(normalizedQuery) ||
        receipt.supplier.toLowerCase().includes(normalizedQuery) ||
        receipt.created_at.toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, receipts]);

  const totalReceivedQuantity = useMemo(() => {
    return receipts.reduce(
      (total, receipt) => total + receipt.quantity_received,
      0
    );
  }, [receipts]);

  return {
    allReceiptsCount: receipts.length,
    filteredReceipts,
    receiptsQuery,
    searchValue,
    setSearchValue,
    totalReceivedQuantity,
  };
}
