import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const INTERNAL_API_PROXY_BASE = "/api/proxy";

export const fetchBaseQueryWithAuth = fetchBaseQuery({
  baseUrl: INTERNAL_API_PROXY_BASE,
  prepareHeaders: (headers) => {
    headers.set("Content-Type", "application/json");

    return headers;
  },
});
