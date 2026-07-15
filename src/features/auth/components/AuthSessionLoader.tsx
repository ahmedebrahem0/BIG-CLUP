"use client";

import { useEffect } from "react";

import { useAppDispatch } from "@/store/hooks";

import { AUTH_STORAGE_KEY, hydrateCredentials, type AuthState } from "../authSlice";

export function AuthSessionLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    try {
      const storedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);
      dispatch(
        hydrateCredentials(storedValue ? (JSON.parse(storedValue) as Partial<AuthState>) : null)
      );
    } catch {
      dispatch(hydrateCredentials(null));
    }
  }, [dispatch]);

  return null;
}