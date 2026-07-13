import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Receipt } from "./types";

export const receiptsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getReceipts: builder.query<Receipt[], void>({
      query: () => API_ENDPOINTS.receipts,
      providesTags: (result) =>
        result
          ? [
              ...result.map((receipt) => ({
                type: QUERY_TAGS.RECEIPTS,
                id: receipt.id,
              })),
              { type: QUERY_TAGS.RECEIPTS, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.RECEIPTS, id: "LIST" }],
    }),

    getReceipt: builder.query<Receipt, number>({
      query: (id) => `${API_ENDPOINTS.receipts}${id}/`,
      providesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.RECEIPTS, id },
      ],
    }),
  }),
});

export const { useGetReceiptQuery, useGetReceiptsQuery } = receiptsApi;
