import { API_ENDPOINTS } from "@/constants/api-endpoints";
import { baseApi } from "@/store/baseApi";

import type { LoginCredentials, LoginResponse } from "./types";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginCredentials>({
      query: (body) => ({
        url: API_ENDPOINTS.login,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLoginMutation } = authApi;