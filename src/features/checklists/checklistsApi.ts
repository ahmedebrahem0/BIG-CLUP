import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Checklist, ChecklistPayload } from "./types";

export const checklistsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getChecklists: builder.query<Checklist[], void>({
      query: () => API_ENDPOINTS.checklists,
      providesTags: (result) =>
        result
          ? [
              ...result.map((checklist) => ({
                type: QUERY_TAGS.CHECKLISTS,
                id: checklist.id,
              })),
              { type: QUERY_TAGS.CHECKLISTS, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.CHECKLISTS, id: "LIST" }],
    }),

    createChecklist: builder.mutation<Checklist, ChecklistPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.checklists,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.CHECKLISTS, id: "LIST" }],
    }),

    updateChecklist: builder.mutation<
      Checklist,
      { id: number; body: ChecklistPayload }
    >({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.checklists}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: QUERY_TAGS.CHECKLISTS, id },
        { type: QUERY_TAGS.CHECKLISTS, id: "LIST" },
      ],
    }),

    deleteChecklist: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.checklists}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.CHECKLISTS, id },
        { type: QUERY_TAGS.CHECKLISTS, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetChecklistsQuery,
  useCreateChecklistMutation,
  useUpdateChecklistMutation,
  useDeleteChecklistMutation,
} = checklistsApi;
