"use client";

import { useMemo } from "react";

import { ROUTES } from "@/constants/routes";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import { useGetChecklistsQuery } from "@/features/checklists/checklistsApi";
import { useGetClubsQuery } from "@/features/clubs/clubsApi";
import { useGetItemsQuery } from "@/features/items/itemsApi";

type DashboardNotification = {
  id: string;
  title: string;
  description: string;
  href: string;
  tone: "default" | "warning" | "success";
  count?: number;
};

export function useDashboardInsights() {
  const clubsQuery = useGetClubsQuery();
  const categoriesQuery = useGetCategoriesQuery();
  const checklistsQuery = useGetChecklistsQuery();
  const itemsQuery = useGetItemsQuery();

  const clubs = clubsQuery.data ?? [];
  const categories = categoriesQuery.data ?? [];
  const checklists = checklistsQuery.data ?? [];
  const items = itemsQuery.data ?? [];

  const counts = useMemo(() => {
    const topLevelCategories = categories.filter((category) => category.parent === null).length;
    const subcategories = categories.length - topLevelCategories;
    const itemsWithoutChecklist = items.filter((item) => item.checklists.length === 0).length;
    const pendingItemChecklistCount = items.reduce((total, item) => {
      return total + item.checklists.filter((checklist) => !checklist.is_completed).length;
    }, 0);

    return {
      clubs: clubs.length,
      categories: categories.length,
      checklists: checklists.length,
      items: items.length,
      workspace: pendingItemChecklistCount,
      topLevelCategories,
      subcategories,
      itemsWithoutChecklist,
      pendingItemChecklistCount,
    };
  }, [categories, checklists, clubs, items]);

  const notifications = useMemo<DashboardNotification[]>(() => {
    const nextNotifications: DashboardNotification[] = [];

    if (counts.pendingItemChecklistCount > 0) {
      nextNotifications.push({
        id: "pending-item-checklists",
        title: "خطوات متابعة غير مكتملة",
        description: `يوجد ${counts.pendingItemChecklistCount} خطوة checklist غير مكتملة على مستوى الأصناف.`,
        href: ROUTES.items,
        tone: "warning",
        count: counts.pendingItemChecklistCount,
      });
    }

    if (counts.itemsWithoutChecklist > 0) {
      nextNotifications.push({
        id: "items-without-checklists",
        title: "أصناف بدون checklist",
        description: `يوجد ${counts.itemsWithoutChecklist} صنف لا يحتوي على عناصر متابعة مرتبطة.`,
        href: ROUTES.items,
        tone: "warning",
        count: counts.itemsWithoutChecklist,
      });
    }

    if (counts.subcategories > 0) {
      nextNotifications.push({
        id: "category-structure",
        title: "الهيكل الهرمي للفئات جاهز",
        description: `لديك ${counts.topLevelCategories} فئة رئيسية و${counts.subcategories} فئة فرعية.`,
        href: ROUTES.categories,
        tone: "success",
      });
    }

    nextNotifications.push({
      id: "clubs-total",
      title: "تحديث الموارد الأساسية",
      description: `تم تحميل ${counts.clubs} نادي، ${counts.categories} فئة، و${counts.items} صنف في النظام الحالي.`,
      href: ROUTES.clubs,
      tone: "default",
    });

    return nextNotifications;
  }, [counts]);

  const unreadCount = notifications.filter(
    (notification) => notification.tone === "warning"
  ).length;

  const badgesByRoute: Record<string, number> = {
    [ROUTES.clubs]: counts.clubs,
    [ROUTES.categories]: counts.categories,
    [ROUTES.checklists]: counts.checklists,
    [ROUTES.items]: counts.items,
    [ROUTES.clubItems]: counts.workspace,
  };

  return {
    badgesByRoute,
    counts,
    isLoading:
      clubsQuery.isLoading ||
      categoriesQuery.isLoading ||
      checklistsQuery.isLoading ||
      itemsQuery.isLoading,
    notifications,
    unreadCount,
  };
}
