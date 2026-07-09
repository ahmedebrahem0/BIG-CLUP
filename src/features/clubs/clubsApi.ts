import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";

import type { Club, ClubPayload } from "./types";

export const clubsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClubs: builder.query<Club[], void>({
      query: () => API_ENDPOINTS.clubs,
      providesTags: (result) =>
        result
          ? [
              ...result.map((club) => ({
                type: QUERY_TAGS.CLUBS,
                id: club.id,
              })),
              { type: QUERY_TAGS.CLUBS, id: "LIST" },
            ]
          : [{ type: QUERY_TAGS.CLUBS, id: "LIST" }],
    }),

    createClub: builder.mutation<Club, ClubPayload>({
      query: (body) => ({
        url: API_ENDPOINTS.clubs,
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: QUERY_TAGS.CLUBS, id: "LIST" }],
    }),

    updateClub: builder.mutation<Club, { id: number; body: ClubPayload }>({
      query: ({ id, body }) => ({
        url: `${API_ENDPOINTS.clubs}${id}/`,
        method: "PUT",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: QUERY_TAGS.CLUBS, id },
        { type: QUERY_TAGS.CLUBS, id: "LIST" },
      ],
    }),

    deleteClub: builder.mutation<void, number>({
      query: (id) => ({
        url: `${API_ENDPOINTS.clubs}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: QUERY_TAGS.CLUBS, id },
        { type: QUERY_TAGS.CLUBS, id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetClubsQuery,
  useCreateClubMutation,
  useUpdateClubMutation,
  useDeleteClubMutation,
} = clubsApi;
