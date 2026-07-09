import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Item, ItemPayload } from "./types";

export const itemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getItems: builder.query<Item[], void>({
      query: () => API_ENDPOINTS.items,
      providesTags: (result) =>
        result
          ? [
              ...result.map((item) => ({
                type: QUERY_TAGS.ITEMS,
                id: item.id,
              })),
              { type: QUERY_TAGS.ITEMS, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.ITEMS, id: "LIST" }],
    }),

    createItem: builder.mutation<Item, ItemPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.items,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.ITEMS, id: "LIST" }],
    }),

    updateItem: builder.mutation<Item, { id: number; body: ItemPayload }>({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.items}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: QUERY_TAGS.ITEMS, id },
        { type: QUERY_TAGS.ITEMS, id: "LIST" },
      ],
    }),

    deleteItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.items}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.ITEMS, id },
        { type: QUERY_TAGS.ITEMS, id: "LIST" },
      ],
    }),

    updateItemChecklistStatus: builder.mutation<
      { message: string; data: { is_completed: boolean } },
      { checklistEntryId: number; body: { is_completed: boolean }; itemId: number }
    >({
      query: ({ checklistEntryId, body }) => ({
        url: API_ENDPOINTS.updateItemChecklistStatus(checklistEntryId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { itemId }) => [
        { type: QUERY_TAGS.ITEMS, id: itemId },
        { type: QUERY_TAGS.ITEMS, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetItemsQuery,
  useCreateItemMutation,
  useUpdateItemMutation,
  useDeleteItemMutation,
  useUpdateItemChecklistStatusMutation,
} = itemsApi;
