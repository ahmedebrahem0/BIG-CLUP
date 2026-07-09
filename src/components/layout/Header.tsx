"use client";

import {
  Bell,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  Search,
  Settings2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSidebarOpen } from "@/store/selectors/dashboardSelectors";
import { toggleSidebar } from "@/store/slices/uiSlice";

type HeaderProps = {
  isMobileSidebarOpen: boolean;
  onMobileMenuToggle: () => void;
};

export function Header({
  isMobileSidebarOpen,
  onMobileMenuToggle,
}: HeaderProps) {
  const dispatch = useAppDispatch();
  const isSidebarOpen = useAppSelector(selectSidebarOpen);

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-3">
          <Button
            aria-label={isMobileSidebarOpen ? "Close navigation menu" : "Open navigation menu"}
            className="xl:hidden"
            onClick={onMobileMenuToggle}
            size="icon"
            variant="outline"
          >
            {isMobileSidebarOpen ? <X className="size-4" /> : <Menu className="size-4" />}
          </Button>

          <Button
            aria-label="Toggle sidebar"
            className="hidden xl:inline-flex"
            onClick={() => dispatch(toggleSidebar())}
            size="icon"
            variant="outline"
          >
            {isSidebarOpen ? (
              <PanelRightClose className="size-4" />
            ) : (
              <PanelRightOpen className="size-4" />
            )}
          </Button>

          <div>
            <p className="text-xs tracking-[0.28em] text-muted-foreground uppercase">
              Admin Workspace
            </p>
            <h1 className="text-lg font-semibold text-foreground sm:text-xl">
              إدارة هادئة وواضحة لكل تفاصيل الأندية
            </h1>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="relative min-w-0 sm:w-80">
            <Search className="pointer-events-none absolute top-1/2 right-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              className="h-11 rounded-2xl border-white/70 bg-white/70 pr-10 shadow-sm"
              placeholder="ابحث في الأندية أو الفئات أو الأصناف"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button size="icon" variant="outline">
              <Bell className="size-4" />
            </Button>
            <Button size="icon" variant="outline">
              <Settings2 className="size-4" />
            </Button>
            <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-semibold">فريق الإدارة</p>
                {/* <p className="text-xs text-muted-foreground">لوحة متابعة وتشغيل</p> */}
              </div>
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                DA
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
