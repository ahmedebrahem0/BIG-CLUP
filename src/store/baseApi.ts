import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { QUERY_TAGS } from "@/constants/query-tags";

const INTERNAL_API_PROXY_BASE = "/api/proxy";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: INTERNAL_API_PROXY_BASE,

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");

      return headers;
    },
  }),

  tagTypes: [
    QUERY_TAGS.CLUBS,
    QUERY_TAGS.CATEGORIES,
    QUERY_TAGS.CHECKLISTS,
    QUERY_TAGS.ITEMS,
    QUERY_TAGS.SUPPLIERS,
    QUERY_TAGS.RECEIPTS,
    QUERY_TAGS.CLUB_CATEGORIES,
    QUERY_TAGS.CLUB_ITEMS,
  ],

  endpoints: () => ({}),
});
