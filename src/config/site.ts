import {
  Building2,
  ClipboardList,
  FolderTree,
  LayoutGrid,
  Package2,
} from "lucide-react";

import { ROUTES } from "@/constants/routes";

export const siteConfig = {
  name: "Clubs Dashboard",
  description:
    "Control center for clubs, categories, checklists, items, and club item operations.",
  navigation: [
    { title: "الأندية", href: ROUTES.clubs, icon: Building2 },
    { title: "الفئات", href: ROUTES.categories, icon: FolderTree },
    { title: "التشيك ليست", href: ROUTES.checklists, icon: ClipboardList },
    { title: "المنتجات", href: ROUTES.items, icon: Package2 },
    { title: "مساحة العمل", href: ROUTES.clubItems, icon: LayoutGrid },
  ],
} as const;

export type SiteNavigationItem = (typeof siteConfig.navigation)[number];
