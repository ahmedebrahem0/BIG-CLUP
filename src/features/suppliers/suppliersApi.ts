import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Supplier, SupplierPayload } from "./types";

export const suppliersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSuppliers: builder.query<Supplier[], void>({
      query: () => API_ENDPOINTS.suppliers,
      providesTags: (result) =>
        result
          ? [
              ...result.map((supplier) => ({
                type: QUERY_TAGS.SUPPLIERS,
                id: supplier.id,
              })),
              { type: QUERY_TAGS.SUPPLIERS, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.SUPPLIERS, id: "LIST" }],
    }),

    getSupplier: builder.query<Supplier, number>({
      query: (id) => `${API_ENDPOINTS.suppliers}${id}/`,
      providesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.SUPPLIERS, id },
      ],
    }),

    createSupplier: builder.mutation<Supplier, SupplierPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.suppliers,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.SUPPLIERS, id: "LIST" }],
    }),

    updateSupplier: builder.mutation<
      Supplier,
      { id: number; body: SupplierPayload }
    >({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.suppliers}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: QUERY_TAGS.SUPPLIERS, id },
        { type: QUERY_TAGS.SUPPLIERS, id: "LIST" },
      ],
    }),

    deleteSupplier: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.suppliers}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.SUPPLIERS, id },
        { type: QUERY_TAGS.SUPPLIERS, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useCreateSupplierMutation,
  useDeleteSupplierMutation,
  useGetSupplierQuery,
  useGetSuppliersQuery,
  useUpdateSupplierMutation,
} = suppliersApi;
