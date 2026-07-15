"use client";

import { Toaster } from "sonner";

import { AuthSessionLoader } from "@/features/auth/components/AuthSessionLoader";

import { StoreProvider } from "./StoreProvider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      <AuthSessionLoader />
      {children}
      <Toaster richColors position="top-center" />
    </StoreProvider>
  );
}