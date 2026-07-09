"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";
import { useAppSelector } from "@/store/hooks";
import { selectSidebarOpen } from "@/store/selectors/dashboardSelectors";

type SidebarProps = {
  isMobileOpen: boolean;
  onMobileOpenChange: (open: boolean) => void;
};

type SidebarContentProps = {
  isExpanded: boolean;
  onNavigate?: () => void;
  showMobileHeader?: boolean;
};

function SidebarContent({
  isExpanded,
  onNavigate,
  showMobileHeader = false,
}: SidebarContentProps) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-black/5 px-5 py-6">
        <div className={cn("flex items-center gap-3", !isExpanded && "justify-center")}>
          <div className="flex size-12 items-center justify-center rounded-2xl bg-[radial-gradient(circle_at_top,rgba(43,108,94,0.24),rgba(43,108,94,0.1),transparent)] text-primary ring-1 ring-primary/15">
            <Sparkles className="size-5" />
          </div>
          {isExpanded ? (
            <div className="flex-1 space-y-1">
              <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase">
                Big Club
              </p>
              <h2 className="text-lg font-semibold text-foreground">Clubs Dashboard</h2>
            </div>
          ) : null}

          {showMobileHeader ? (
            <DialogClose
              render={
                <Button
                  aria-label="Close navigation menu"
                  className="shrink-0 rounded-xl"
                  size="icon-sm"
                  variant="ghost"
                />
              }
            >
              <ChevronLeft className="size-4" />
            </DialogClose>
          ) : null}
        </div>
      </div>

      <nav className="flex-1 space-y-2 overflow-y-auto px-4 py-5">
        {siteConfig.navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-medium transition-all",
                isActive
                  ? "bg-white text-foreground shadow-[0_12px_40px_-28px_rgba(15,23,42,0.55)] ring-1 ring-black/5"
                  : "text-muted-foreground hover:bg-white/70 hover:text-foreground"
              )}
            >
              <span
                className={cn(
                  "flex size-10 items-center justify-center rounded-xl transition-colors",
                  isActive ? "bg-primary/10 text-primary" : "bg-transparent text-current"
                )}
              >
                <Icon className="size-[18px]" />
              </span>
              {isExpanded ? (
                <>
                  <span className="flex-1">{item.title}</span>
                  <ChevronLeft
                    className={cn(
                      "size-4 transition-transform",
                      isActive
                        ? "translate-x-0 text-primary"
                        : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
                    )}
                  />
                </>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="px-4 pb-4">
        <div className="rounded-[1.75rem] border border-white/70 bg-white/75 p-4 shadow-[0_16px_40px_-30px_rgba(15,23,42,0.4)]">
          {isExpanded ? (
            <>
              <p className="text-sm font-semibold">نظام مرتب وقابل للتوسع</p>
              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                نثبت الآن الـ foundation والـ CRUD pattern حتى تكون كل feature القادمة
                أسرع وأكثر ثباتًا.
              </p>
            </>
          ) : (
            <div className="flex justify-center">
              <Sparkles className="size-4 text-primary" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export function Sidebar({ isMobileOpen, onMobileOpenChange }: SidebarProps) {
  const isDesktopExpanded = useAppSelector(selectSidebarOpen);

  return (
    <>
      <aside
        className={cn(
          "sticky top-0 hidden h-screen shrink-0 self-start overflow-y-auto border-l border-white/60 bg-[linear-gradient(180deg,rgba(248,250,252,0.94),rgba(239,244,244,0.88))] backdrop-blur xl:flex xl:flex-col",
          isDesktopExpanded ? "xl:w-78" : "xl:w-24"
        )}
      >
        <SidebarContent isExpanded={isDesktopExpanded} />
      </aside>

      <Dialog open={isMobileOpen} onOpenChange={onMobileOpenChange}>
        <DialogContent
          className="top-0 right-0 left-auto h-dvh w-[min(22rem,calc(100%-1rem))] max-w-none translate-x-0 translate-y-0 gap-0 rounded-none rounded-l-[2rem] border border-white/70 border-r-0 bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(239,244,244,0.94))] p-0 shadow-[0_30px_80px_-40px_rgba(15,23,42,0.55)] xl:hidden"
          dir="rtl"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">القائمة الجانبية</DialogTitle>
          <SidebarContent
            isExpanded={true}
            onNavigate={() => onMobileOpenChange(false)}
            showMobileHeader
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
