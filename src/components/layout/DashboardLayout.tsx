"use client";

import { useState, type ReactNode } from "react";

import { Header } from "./Header";
import { Sidebar } from "./Sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(43,108,94,0.08),transparent_26%),linear-gradient(180deg,#f7f8f7_0%,#f3f5f4_42%,#eef2f1_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen max-w-[1800px] xl:items-start">
        <Sidebar
          isMobileOpen={isMobileSidebarOpen}
          onMobileOpenChange={setIsMobileSidebarOpen}
        />
        <div className="flex min-w-0 flex-1 flex-col">
          <Header
            isMobileSidebarOpen={isMobileSidebarOpen}
            onMobileMenuToggle={() => setIsMobileSidebarOpen((current) => !current)}
          />
          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}
