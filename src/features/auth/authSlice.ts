import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { AuthUser, LoginResponse, UserRole } from "./types";

export type AuthState = {
  accessToken: string | null;
  isHydrated: boolean;
  permissions: string[];
  user: AuthUser | null;
};

export const AUTH_STORAGE_KEY = "big-club-auth";

export const emptyAuthState: AuthState = {
  accessToken: null,
  isHydrated: false,
  permissions: [],
  user: null,
};

function normalizeRole(role: string | undefined): UserRole {
  return role?.toLowerCase() === "supplier" ? "supplier" : "admin";
}

function persistAuth(state: AuthState) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    AUTH_STORAGE_KEY,
    JSON.stringify({
      accessToken: state.accessToken,
      permissions: state.permissions,
      user: state.user,
    })
  );
}

function removeStoredAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
}

const authSlice = createSlice({
  name: "auth",
  initialState: emptyAuthState,
  reducers: {
    hydrateCredentials: (state, action: PayloadAction<Partial<AuthState> | null>) => {
      const storedAuth = action.payload;
      state.isHydrated = true;

      if (!storedAuth?.accessToken || !storedAuth.user?.role) {
        state.accessToken = null;
        state.permissions = [];
        state.user = null;
        return;
      }

      state.accessToken = storedAuth.accessToken;
      state.permissions = Array.isArray(storedAuth.permissions)
        ? storedAuth.permissions
        : [];
      state.user = {
        ...storedAuth.user,
        role: normalizeRole(storedAuth.user.role),
      };
    },
    setCredentials: (state, action: PayloadAction<LoginResponse>) => {
      const nextState: AuthState = {
        accessToken: action.payload.token,
        isHydrated: true,
        permissions: [],
        user: {
          id: action.payload.user_id,
          role: normalizeRole(action.payload.role),
        },
      };

      state.accessToken = nextState.accessToken;
      state.isHydrated = nextState.isHydrated;
      state.permissions = nextState.permissions;
      state.user = nextState.user;
      persistAuth(nextState);
    },
    clearCredentials: () => {
      removeStoredAuth();
      return { ...emptyAuthState, isHydrated: true };
    },
  },
});

export const { clearCredentials, hydrateCredentials, setCredentials } = authSlice.actions;

export default authSlice.reducer;