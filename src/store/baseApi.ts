import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { QUERY_TAGS } from "@/constants/query-tags";
import { AUTH_STORAGE_KEY, type AuthState } from "@/features/auth/authSlice";

import type { RootState } from ".";

const INTERNAL_API_PROXY_BASE = "/api/proxy";

function readStoredToken() {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
    if (!storedValue) {
      return null;
    }

    const storedAuth = JSON.parse(storedValue) as Partial<AuthState>;
    return typeof storedAuth.accessToken === "string" ? storedAuth.accessToken : null;
  } catch {
    return null;
  }
}

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: INTERNAL_API_PROXY_BASE,

    prepareHeaders: (headers, { getState }) => {
      const stateToken = (getState() as RootState).auth.accessToken;
      const token = stateToken ?? readStoredToken();

      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }

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