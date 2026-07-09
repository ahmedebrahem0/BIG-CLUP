import type { ReactNode } from "react";

import { DashboardLayout } from "@/components/layout/DashboardLayout";

type DashboardRouteLayoutProps = {
  children: ReactNode;
};

export default function DashboardRouteLayout({
  children,
}: DashboardRouteLayoutProps) {
  return <DashboardLayout>{children}</DashboardLayout>;
}
