"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Bell,
  Menu,
  PanelRightClose,
  PanelRightOpen,
  Search,
  LogOut,
  Settings2,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { ROUTES } from "@/constants/routes";
import { cn } from "@/lib/utils";
import { useDashboardInsights } from "@/hooks/useDashboardInsights";
import { baseApi } from "@/store/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { selectSidebarOpen } from "@/store/selectors/dashboardSelectors";
import { clearCredentials } from "@/features/auth/authSlice";
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
  const router = useRouter();
  const isSidebarOpen = useAppSelector(selectSidebarOpen);
  const { notifications, unreadCount } = useDashboardInsights();

  function handleLogout() {
    dispatch(clearCredentials());
    dispatch(baseApi.util.resetApiState());
    router.replace(ROUTES.login);
  }

  return (
    <header className="sticky top-0 z-20 border-b border-white/60 bg-background/80 backdrop-blur-xl">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 xl:flex-row xl:items-center xl:justify-between shadow-[0px_2px_1px_#585858]">
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
              تفاصيل واضحة لكل تفاصيل الأندية
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
            <Button className="h-11 gap-2 rounded-2xl px-4" onClick={handleLogout} type="button" variant="outline">
              <LogOut className="size-4" />
              <span>تسجيل الخروج</span>
            </Button>
            {/* <DropdownMenu>
              <DropdownMenuTrigger
                render={<Button className="relative" size="icon" variant="outline" />}
              >
                <Bell className="size-4" />
                {unreadCount > 0 ? (
                  <span className="absolute -top-1 -left-1 flex min-w-5 items-center justify-center rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-semibold text-primary-foreground">
                    {unreadCount}
                  </span>
                ) : null}
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-[22rem] rounded-2xl border border-white/70 bg-white/95 p-2 shadow-[0_30px_70px_-40px_rgba(15,23,42,0.35)]"
                sideOffset={10}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="px-3 py-2 text-sm font-semibold text-foreground">
                    مركز الإشعارات
                  </DropdownMenuLabel>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <div className="max-h-96 space-y-2 overflow-y-auto p-1">
                  {notifications.map((notification) => (
                    <Link
                      key={notification.id}
                      href={notification.href}
                      className="block rounded-2xl border border-transparent px-3 py-3 transition hover:border-border/80 hover:bg-secondary/50"
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-1 flex size-2.5 shrink-0 rounded-full",
                            notification.tone === "warning"
                              ? "bg-amber-500"
                              : notification.tone === "success"
                                ? "bg-emerald-500"
                                : "bg-primary"
                          )}
                        />
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground">
                              {notification.title}
                            </p>
                            {typeof notification.count === "number" ? (
                              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                                {notification.count}
                              </span>
                            ) : null}
                          </div>
                          <p className="text-xs leading-6 text-muted-foreground">
                            {notification.description}
                          </p>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu> */}

            {/* <Button size="icon" variant="outline">
              <Settings2 className="size-4" />
            </Button> */}
            {/* <div className="flex items-center gap-3 rounded-2xl border border-white/70 bg-white/70 px-3 py-2 shadow-sm">
              <div className="text-right">
                <p className="text-sm font-semibold">فريق الإدارة</p>
              </div>
              <div className="flex size-10 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                DA
              </div>
            </div> */}
          </div>
        </div>
      </div>
    </header>
  );
}
