import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Category, CategoryPayload } from "./types";

export const categoriesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCategories: builder.query<Category[], void>({
      query: () => API_ENDPOINTS.categories,
      providesTags: (result) =>
        result
          ? [
              ...result.map((category) => ({
                type: QUERY_TAGS.CATEGORIES,
                id: category.id,
              })),
              { type: QUERY_TAGS.CATEGORIES, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.CATEGORIES, id: "LIST" }],
    }),

    createCategory: builder.mutation<Category, CategoryPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.categories,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.CATEGORIES, id: "LIST" }],
    }),

    updateCategory: builder.mutation<
      Category,
      { id: number; body: CategoryPayload }
    >({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.categories}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: QUERY_TAGS.CATEGORIES, id },
        { type: QUERY_TAGS.CATEGORIES, id: "LIST" },
      ],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.categories}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.CATEGORIES, id },
        { type: QUERY_TAGS.CATEGORIES, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoriesApi;
