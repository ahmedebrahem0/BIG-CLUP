import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { QUERY_TAGS } from "@/constants/query-tags";
import { baseApi } from "@/store/baseApi";
import type { Category } from "@/features/categories/types";

import type {
  AddOrUpdateClubItemPayload,
  AddOrUpdateClubItemResponse,
  ClubItem,
  UpdateClubChecklistStatusPayload,
  UpdateClubChecklistStatusResponse,
} from "./types";

export const clubItemsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getClubCategories: builder.query<Category[], number>({
      query: (clubId) => API_ENDPOINTS.clubCategories(clubId),
      providesTags: (_result, _error, clubId) => [
        { type: QUERY_TAGS.CLUB_CATEGORIES, id: clubId },
      ],
    }),

    getClubItemsByCategory: builder.query<ClubItem[], { clubId: number; categoryId: number }>({
      query: ({ clubId, categoryId }) =>
        API_ENDPOINTS.clubItemsByCategory(clubId, categoryId),
      providesTags: (_result, _error, { clubId, categoryId }) => [
        { type: QUERY_TAGS.CLUB_ITEMS, id: `${clubId}-${categoryId}` },
      ],
    }),

    addOrUpdateItemInClub: builder.mutation<
      AddOrUpdateClubItemResponse,
      { clubId: number; body: AddOrUpdateClubItemPayload; categoryId?: number }
    >({
      query: ({ clubId, body }) => ({
        url: API_ENDPOINTS.addOrUpdateItemInClub(clubId),
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { clubId, categoryId }) => {
        const tags: Array<{ type: typeof QUERY_TAGS.CLUB_ITEMS | typeof QUERY_TAGS.CLUB_CATEGORIES; id: string | number }> = [
          { type: QUERY_TAGS.CLUB_CATEGORIES, id: clubId },
        ];

        if (categoryId) {
          tags.push({ type: QUERY_TAGS.CLUB_ITEMS, id: `${clubId}-${categoryId}` });
        }

        return tags;
      },
    }),

    updateClubChecklistStatus: builder.mutation<
      UpdateClubChecklistStatusResponse,
      {
        checklistEntryId: number;
        body: UpdateClubChecklistStatusPayload;
        clubId: number;
        categoryId: number;
      }
    >({
      query: ({ checklistEntryId, body }) => ({
        url: API_ENDPOINTS.updateClubChecklistStatus(checklistEntryId),
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { clubId, categoryId }) => [
        { type: QUERY_TAGS.CLUB_ITEMS, id: `${clubId}-${categoryId}` },
      ],
    }),
  }),
});

export const {
  useAddOrUpdateItemInClubMutation,
  useGetClubCategoriesQuery,
  useGetClubItemsByCategoryQuery,
  useUpdateClubChecklistStatusMutation,
} = clubItemsApi;
