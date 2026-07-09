"use client";

import { Toaster } from "sonner";

import { StoreProvider } from "./StoreProvider";

type AppProvidersProps = {
  children: React.ReactNode;
};

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <StoreProvider>
      {children}
      <Toaster richColors position="top-center" />
    </StoreProvider>
  );
}