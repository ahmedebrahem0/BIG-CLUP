# CLUBS DASHBOARD — Codex Master Prompt

> استخدم هذا الملف كـ **Master Prompt** لـ Codex عشان ينفذ المشروع خطوة خطوة، بنفس الـ architecture المتفق عليها.

---

## 1. Project Overview

We are building a **Next.js Frontend Dashboard** called **Clubs Dashboard**.

The dashboard manages these main resources:

1. Clubs
2. Categories
3. Checklists
4. Items
5. Club Items Workspace

The app is mainly a data/admin dashboard with tables, forms, CRUD actions, and checklist status updates.

The backend is already available through an API. The frontend must consume the backend using **RTK Query with fetchBaseQuery**.

Do **not** use Axios unless explicitly requested later.

---

## 2. Tech Stack

Use the current installed stack:

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS v4
- shadcn/ui v4 using Base UI
- `@base-ui/react`
- Redux Toolkit
- RTK Query
- React Redux
- React Hook Form
- Zod
- `@hookform/resolvers`
- Sonner for toasts
- Lucide React for icons
- date-fns for date formatting
- clsx
- tailwind-merge
- class-variance-authority

Do **not** add unnecessary libraries.

Avoid these unless explicitly needed later:

- axios
- redux-persist
- framer-motion
- next-themes
- react-icons
- emailjs
- lottie
- confetti
- jose

---

## 3. Backend Base URL

The `.env.local` file should contain:

```env
NEXT_PUBLIC_API_BASE_URL=https://grindable-unplumb-jacoby.ngrok-free.dev/api
```

The endpoint constants should only contain paths like `/items/clubs/`.

Example final URL should become:

```txt
https://grindable-unplumb-jacoby.ngrok-free.dev/api/items/clubs/
```

Because the backend is exposed through ngrok, `fetchBaseQuery` should include this header:

```ts
headers.set("ngrok-skip-browser-warning", "true");
```

---

## 4. Current Project Structure

The project already has this structure:

```txt
src
├── app
│   ├── error.tsx
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.tsx
│   ├── loading.tsx
│   ├── not-found.tsx
│   ├── page.tsx
│   └── (dashboard)
│       ├── error.tsx
│       ├── layout.tsx
│       ├── loading.tsx
│       ├── categories
│       │   ├── loading.tsx
│       │   └── page.tsx
│       ├── checklists
│       │   ├── loading.tsx
│       │   └── page.tsx
│       ├── club-items
│       │   ├── loading.tsx
│       │   └── page.tsx
│       ├── clubs
│       │   ├── loading.tsx
│       │   └── page.tsx
│       └── items
│           ├── loading.tsx
│           └── page.tsx
│
├── components
│   ├── common
│   │   ├── ConfirmDialog.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── Loader.tsx
│   ├── layout
│   │   ├── DashboardLayout.tsx
│   │   ├── Header.tsx
│   │   └── Sidebar.tsx
│   ├── providers
│   │   ├── AppProviders.tsx
│   │   └── StoreProvider.tsx
│   └── ui
│
├── config
│   └── site.ts
│
├── constants
│   ├── api-endpoints.ts
│   ├── query-tags.ts
│   └── routes.ts
│
├── features
│   ├── categories
│   ├── checklists
│   ├── club-items
│   ├── clubs
│   └── items
│
├── hooks
│   ├── useDebounce.ts
│   ├── useDisclosure.ts
│   └── useIsClient.ts
│
├── lib
│   ├── api
│   │   ├── fetchBaseQueryWithAuth.ts
│   │   └── handleApiError.ts
│   └── utils
│       ├── cn.ts
│       ├── formatDate.ts
│       └── getErrorMessage.ts
│
├── store
│   ├── baseApi.ts
│   ├── hooks.ts
│   ├── index.ts
│   ├── middleware
│   │   └── listenerMiddleware.ts
│   ├── selectors
│   │   └── dashboardSelectors.ts
│   └── slices
│       └── uiSlice.ts
│
└── types
    ├── api.types.ts
    └── common.types.ts
```

Preserve this structure.

Do not flatten the project.

---

## 5. Architecture Rules

### 5.1 RTK Query Rule

All server data must be handled through RTK Query.

Each feature must inject endpoints into:

```ts
src/store/baseApi.ts
```

using:

```ts
baseApi.injectEndpoints({ ... })
```

Do not put all endpoints in `baseApi.ts`.

Each feature has its own API file:

```txt
features/clubs/clubsApi.ts
features/categories/categoriesApi.ts
features/checklists/checklistsApi.ts
features/items/itemsApi.ts
features/club-items/clubItemsApi.ts
```

### 5.2 `api.ts` Rule

Inside each feature, `api.ts` is **not** the RTK Query file.

Use `api.ts` only for:

- normalization helpers
- mapping API data to form values
- mapping form values to API payloads
- server-side/manual helpers if needed later

The RTK Query file should be named like:

```txt
clubsApi.ts
itemsApi.ts
clubItemsApi.ts
```

### 5.3 `types.ts` Rule

Each feature must define its own request/response/model types in `types.ts`.

Do not put feature-specific types in global `/types` unless they are reused across many features.

### 5.4 `schema/` Rule

Use Zod schemas for all forms.

Example:

```txt
features/clubs/schema/club.schema.ts
```

### 5.5 `hooks/` Rule

Use hooks as a business-flow layer between UI and RTK Query.

Hooks can handle:

- mutation unwrap
- success toast
- error toast
- closing dialog
- resetting form
- selected IDs
- table search/filter state

Do not put heavy business logic directly inside UI components.

### 5.6 `components/` Rule

Components should focus on UI only.

Examples:

```txt
ClubsTable.tsx
ClubForm.tsx
ClubsPageContent.tsx
```

Any component using RTK Query hooks, React Hook Form, state, or event handlers must start with:

```tsx
"use client";
```

### 5.7 Redux Slices Rule

Do not store server data in Redux slices.

Server data belongs to RTK Query cache.

Slices are only for local UI state like:

- sidebar open/closed
- global layout state
- table density
- selected UI-only filters if needed

---

## 6. Foundation Files

The foundation should exist before building features.

### 6.1 `src/constants/query-tags.ts`

```ts
export const QUERY_TAGS = {
  CLUBS: "Clubs",
  CATEGORIES: "Categories",
  CHECKLISTS: "Checklists",
  ITEMS: "Items",
  CLUB_CATEGORIES: "ClubCategories",
  CLUB_ITEMS: "ClubItems",
} as const;

export type QueryTag = (typeof QUERY_TAGS)[keyof typeof QUERY_TAGS];
```

### 6.2 `src/constants/api-endpoints.ts`

```ts
export const API_ENDPOINTS = {
  clubs: "/items/clubs/",
  categories: "/items/categories/",
  checklists: "/items/checklists/",
  items: "/items/items/",

  clubCategories: (clubId: number) =>
    `/items/clubs/${clubId}/categories/`,

  clubItemsByCategory: (clubId: number, categoryId: number) =>
    `/items/clubs/${clubId}/categories/${categoryId}/`,

  addOrUpdateItemInClub: (clubId: number) =>
    `/items/clubs/${clubId}/add-item/`,

  updateClubChecklistStatus: (checklistEntryId: number) =>
    `/items/checklists/${checklistEntryId}/update/`,

  updateItemChecklistStatus: (checklistEntryId: number) =>
    `/items/items/checklists/${checklistEntryId}/update/`,
} as const;
```

### 6.3 `src/constants/routes.ts`

```ts
export const ROUTES = {
  home: "/",
  clubs: "/clubs",
  categories: "/categories",
  checklists: "/checklists",
  items: "/items",
  clubItems: "/club-items",
} as const;
```

### 6.4 `src/store/baseApi.ts`

```ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { QUERY_TAGS } from "@/constants/query-tags";

export const baseApi = createApi({
  reducerPath: "api",

  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,

    prepareHeaders: (headers) => {
      headers.set("Content-Type", "application/json");
      headers.set("ngrok-skip-browser-warning", "true");

      return headers;
    },
  }),

  tagTypes: [
    QUERY_TAGS.CLUBS,
    QUERY_TAGS.CATEGORIES,
    QUERY_TAGS.CHECKLISTS,
    QUERY_TAGS.ITEMS,
    QUERY_TAGS.CLUB_CATEGORIES,
    QUERY_TAGS.CLUB_ITEMS,
  ],

  endpoints: () => ({}),
});
```

---

## 7. API Endpoints

### 7.1 Clubs CRUD

Base path:

```txt
/items/clubs/
```

Supported operations:

```txt
GET    /items/clubs/
GET    /items/clubs/{id}/
POST   /items/clubs/
PUT    /items/clubs/{id}/
DELETE /items/clubs/{id}/
```

Response:

```ts
type Club = {
  id: number;
  name: string;
};
```

Payload:

```ts
type ClubPayload = {
  name: string;
};
```

---

### 7.2 Categories CRUD

Base path:

```txt
/items/categories/
```

Supported operations:

```txt
GET    /items/categories/
GET    /items/categories/{id}/
POST   /items/categories/
PUT    /items/categories/{id}/
DELETE /items/categories/{id}/
```

Response:

```ts
type Category = {
  id: number;
  name: string;
  parent: number | null;
  parent_name: string | null;
};
```

Payload:

```ts
type CategoryPayload = {
  name: string;
  parent: number | null;
};
```

Important:

- Categories support hierarchy.
- `parent_name` is read-only.
- Top-level categories have `parent: null`.

---

### 7.3 Checklists CRUD

Base path:

```txt
/items/checklists/
```

Supported operations:

```txt
GET    /items/checklists/
GET    /items/checklists/{id}/
POST   /items/checklists/
PUT    /items/checklists/{id}/
DELETE /items/checklists/{id}/
```

Response:

```ts
type Checklist = {
  id: number;
  name: string;
};
```

Payload:

```ts
type ChecklistPayload = {
  name: string;
};
```

Important:

This is checklist master data only. It represents checklist names/templates, not completion status.

---

### 7.4 Items CRUD + Global Item Checklist Status

Base path:

```txt
/items/items/
```

Supported operations:

```txt
GET    /items/items/
GET    /items/items/{id}
POST   /items/items/
PUT    /items/items/{id}
DELETE /items/items/{id}
PATCH  /items/items/checklists/{pk}/update/
```

Response:

```ts
type ItemChecklist = {
  id: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

type Item = {
  id: number;
  category: number;
  category_name: string;
  item_code: string;
  description: string;
  checklists: ItemChecklist[];
};
```

Payload:

```ts
type ItemPayload = {
  category: number;
  item_code: string;
  description: string;
};
```

Checklist status payload:

```ts
type UpdateChecklistStatusPayload = {
  is_completed: boolean;
};
```

Important:

- `category_name` is read-only.
- `checklists[].id` is the ItemCheckList entry ID.
- This status is global for the item, not per club.

---

### 7.5 Club Items Workspace

This is the main operational feature.

It handles the relationship:

```txt
Club → ClubItem → Item → Category
```

Endpoints:

```txt
GET   /items/clubs/{club_id}/categories/
GET   /items/clubs/{club_id}/categories/{category_id}/
POST  /items/clubs/{club_id}/add-item/
PATCH /items/checklists/{pk}/update/
```

#### Get Club Categories

```txt
GET /items/clubs/{club_id}/categories/
```

Returns categories linked to a specific club with no duplicates.

Response uses the same `Category` type.

#### Get Club Items by Category

```txt
GET /items/clubs/{club_id}/categories/{category_id}/
```

Response:

```ts
type ClubCategoryItemChecklist = {
  id: number;
  checklist: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

type ClubCategoryItem = {
  id: number; // ClubItem ID
  club: number;
  item: number; // Item ID
  item_code: string;
  item_description: string;
  quantity: number;
  checklists: ClubCategoryItemChecklist[];
};
```

Important:

- `id` is ClubItem ID.
- `item` is the actual Item ID.
- `checklists[].id` is ClubItemCheckList entry ID.
- Checklist status here is per club item, not global.

#### Add or Update Item in Club

```txt
POST /items/clubs/{club_id}/add-item/
```

Payload:

```ts
type AddOrUpdateClubItemPayload = {
  item: number;
  quantity: number;
};
```

Response:

```ts
type AddOrUpdateClubItemResponse = {
  message: string;
  data: {
    id: number;
    club_id: number;
    club_name: string;
    item_code: string;
    quantity: number;
  };
};
```

Important:

- This is an upsert.
- If item exists in club, quantity is overwritten, not incremented.
- Both create and update return `200 OK`.

#### Update Club Checklist Status

```txt
PATCH /items/checklists/{pk}/update/
```

Payload:

```ts
type UpdateChecklistStatusPayload = {
  is_completed: boolean;
};
```

Response:

```ts
type UpdateChecklistStatusResponse = {
  message: string;
  data: {
    is_completed: boolean;
  };
};
```

Important:

- `pk` is ClubItemCheckList entry ID.
- Get this ID from `clubItem.checklists[].id`.
- This is not the checklist template ID.

---

## 8. Tag Invalidation Rules

Use these RTK Query tags:

```txt
Clubs
Categories
Checklists
Items
ClubCategories
ClubItems
```

Recommended invalidation:

```txt
create/update/delete club
→ invalidate Clubs

create/update/delete category
→ invalidate Categories + ClubCategories

create/update/delete checklist
→ invalidate Checklists + Items + ClubItems

create/update/delete item
→ invalidate Items + ClubItems + ClubCategories

add/update item in club
→ invalidate ClubItems + ClubCategories

update club item checklist status
→ invalidate ClubItems

update global item checklist status
→ invalidate Items
```

For list endpoints, use list tags like:

```ts
providesTags: [{ type: QUERY_TAGS.CLUBS, id: "LIST" }]
```

For item detail endpoints, use entity tags like:

```ts
providesTags: (_result, _error, id) => [{ type: QUERY_TAGS.CLUBS, id }]
```

---

## 9. Feature Implementation Plan

Implement features in this exact order.

After each phase, run:

```powershell
pnpm exec tsc --noEmit
```

And make sure the app can still run:

```powershell
pnpm dev
```

---

### Phase 1 — Foundation Check

Verify and fix these files if needed:

```txt
src/constants/query-tags.ts
src/constants/api-endpoints.ts
src/constants/routes.ts
src/store/baseApi.ts
src/store/index.ts
src/store/hooks.ts
src/store/slices/uiSlice.ts
src/components/providers/StoreProvider.tsx
src/components/providers/AppProviders.tsx
src/app/layout.tsx
```

Requirements:

- Root layout must wrap the app with `AppProviders`.
- App should use Arabic direction: `lang="ar" dir="rtl"`.
- Store must include `baseApi.reducer` and `baseApi.middleware`.
- Do not break Next App Router exports.

---

### Phase 2 — Layout

Implement:

```txt
src/components/layout/DashboardLayout.tsx
src/components/layout/Sidebar.tsx
src/components/layout/Header.tsx
src/app/(dashboard)/layout.tsx
```

Dashboard routes:

```txt
/clubs
/categories
/checklists
/items
/club-items
```

Use `ROUTES` constants.

Sidebar should contain links to all dashboard pages.

Keep the layout simple, clean, responsive, and RTL-friendly.

---

### Phase 3 — Clubs Feature

Files:

```txt
features/clubs/types.ts
features/clubs/clubsApi.ts
features/clubs/schema/club.schema.ts
features/clubs/hooks/useClubs.ts
features/clubs/components/ClubsPageContent.tsx
features/clubs/components/ClubsTable.tsx
features/clubs/components/ClubForm.tsx
app/(dashboard)/clubs/page.tsx
```

Required UI:

- Table of clubs
- Add club form/dialog
- Edit club form/dialog
- Delete club confirmation
- Loading state
- Error state
- Empty state
- Success/error toasts

Do not make the UI complex yet.

---

### Phase 4 — Categories Feature

Files:

```txt
features/categories/types.ts
features/categories/categoriesApi.ts
features/categories/schema/category.schema.ts
features/categories/lib/buildCategoryTree.ts
features/categories/hooks/useCategories.ts
features/categories/components/CategoriesPageContent.tsx
features/categories/components/CategoriesTable.tsx
features/categories/components/CategoryForm.tsx
app/(dashboard)/categories/page.tsx
```

Required UI:

- Table of categories
- Add/edit/delete category
- Parent category select
- Display `parent_name`
- Support `parent: null`

Important:

- The parent select should load categories from `getCategories`.
- Prevent selecting the same category as its own parent in edit mode.

---

### Phase 5 — Checklists Feature

Files:

```txt
features/checklists/types.ts
features/checklists/checklistsApi.ts
features/checklists/schema/checklist.schema.ts
features/checklists/hooks/useChecklists.ts
features/checklists/components/ChecklistsPageContent.tsx
features/checklists/components/ChecklistsTable.tsx
features/checklists/components/ChecklistForm.tsx
app/(dashboard)/checklists/page.tsx
```

Required UI:

- Table of checklist templates
- Add/edit/delete checklist
- Show Arabic checklist names

Important:

This page manages checklist names only, not completion status.

---

### Phase 6 — Items Feature

Files:

```txt
features/items/types.ts
features/items/itemsApi.ts
features/items/schema/item.schema.ts
features/items/hooks/useItems.ts
features/items/components/ItemsPageContent.tsx
features/items/components/ItemsTable.tsx
features/items/components/ItemForm.tsx
features/items/components/ItemChecklistStatus.tsx
app/(dashboard)/items/page.tsx
```

Required UI:

- Table of items
- Add/edit/delete item
- Category select
- Display item code
- Display item description
- Display category name
- Show global item checklist statuses
- Toggle global item checklist status using:

```txt
PATCH /items/items/checklists/{pk}/update/
```

Important:

- Use `checklists[].id` from item response as `pk`.
- This status is global item-level status.

---

### Phase 7 — Club Items Workspace Feature

Files:

```txt
features/club-items/types.ts
features/club-items/clubItemsApi.ts
features/club-items/schema/club-item.schema.ts
features/club-items/hooks/useClubItemsWorkspace.ts
features/club-items/components/ClubItemsPageContent.tsx
features/club-items/components/ClubSelector.tsx
features/club-items/components/ClubCategorySelector.tsx
features/club-items/components/AddOrUpdateClubItemForm.tsx
features/club-items/components/ClubItemsTable.tsx
features/club-items/components/ClubItemChecklistStatus.tsx
app/(dashboard)/club-items/page.tsx
```

Required flow:

```txt
User selects Club
↓
Fetch club categories
↓
User selects Category
↓
Fetch club items by category
↓
Show club items table
↓
User can add/update item quantity in club
↓
User can toggle checklist status per ClubItem
```

Required UI:

- Club selector
- Category selector filtered by selected club
- Add/update item form
- Items table for selected club/category
- Quantity display
- Club item checklist status toggles
- Loading/empty/error states

Important:

- `getClubCategories` should be skipped until `clubId` exists.
- `getClubItemsByCategory` should be skipped until both `clubId` and `categoryId` exist.
- Use RTK Query `skipToken` or `skip` option.
- After adding/updating an item in club, invalidate `ClubItems` and `ClubCategories`.
- After updating club checklist status, invalidate `ClubItems`.

---

## 10. Suggested Type Files

### 10.1 `features/clubs/types.ts`

```ts
export type Club = {
  id: number;
  name: string;
};

export type ClubPayload = {
  name: string;
};
```

### 10.2 `features/categories/types.ts`

```ts
export type Category = {
  id: number;
  name: string;
  parent: number | null;
  parent_name: string | null;
};

export type CategoryPayload = {
  name: string;
  parent: number | null;
};
```

### 10.3 `features/checklists/types.ts`

```ts
export type Checklist = {
  id: number;
  name: string;
};

export type ChecklistPayload = {
  name: string;
};
```

### 10.4 `features/items/types.ts`

```ts
export type ItemChecklist = {
  id: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

export type Item = {
  id: number;
  category: number;
  category_name: string;
  item_code: string;
  description: string;
  checklists: ItemChecklist[];
};

export type ItemPayload = {
  category: number;
  item_code: string;
  description: string;
};

export type UpdateChecklistStatusPayload = {
  is_completed: boolean;
};

export type UpdateChecklistStatusResponse = {
  message: string;
  data: {
    is_completed: boolean;
  };
};
```

### 10.5 `features/club-items/types.ts`

```ts
export type ClubCategoryItemChecklist = {
  id: number;
  checklist: number;
  checklist_name: string;
  is_completed: boolean;
  updated_at: string;
};

export type ClubCategoryItem = {
  id: number;
  club: number;
  item: number;
  item_code: string;
  item_description: string;
  quantity: number;
  checklists: ClubCategoryItemChecklist[];
};

export type AddOrUpdateClubItemPayload = {
  item: number;
  quantity: number;
};

export type AddOrUpdateClubItemResponse = {
  message: string;
  data: {
    id: number;
    club_id: number;
    club_name: string;
    item_code: string;
    quantity: number;
  };
};

export type UpdateClubChecklistStatusPayload = {
  is_completed: boolean;
};

export type UpdateClubChecklistStatusResponse = {
  message: string;
  data: {
    is_completed: boolean;
  };
};
```

---

## 11. UI/UX Rules

- The UI language can be Arabic.
- App direction should be RTL.
- Use clean dashboard styling.
- Use shadcn components where available.
- Use Sonner for toasts.
- Use Lucide icons when useful.
- Keep components simple.
- Do not over-engineer animations.
- Do not add dark mode yet.
- Do not add authentication yet.

Recommended Arabic labels:

```txt
الأندية
التصنيفات
قوائم المراجعة
المنتجات
منتجات الأندية
إضافة
تعديل
حذف
حفظ
إلغاء
لا توجد بيانات
حدث خطأ
جاري التحميل
```

---

## 12. Error Handling

Create reusable error helpers:

```txt
src/lib/utils/getErrorMessage.ts
src/lib/api/handleApiError.ts
```

Use them in hooks to show useful toast messages.

RTK Query errors can have different shapes, so handle safely.

Example behavior:

```txt
try mutation.unwrap()
show success toast
catch error
show parsed error message
```

---

## 13. Form Rules

Use React Hook Form + Zod.

Each form should:

- receive optional `defaultValues`
- receive `onSubmit`
- support create and edit mode
- show validation messages
- disable submit while loading

Validation examples:

```txt
Club name: required
Category name: required
Checklist name: required
Item code: required
Item description: required
Item category: required number
Club item quantity: positive integer
```

---

## 14. Page Rules

Pages in `app/(dashboard)` should be simple server components that render a client PageContent component.

Example:

```tsx
import { ClubsPageContent } from "@/features/clubs/components/ClubsPageContent";

export default function ClubsPage() {
  return <ClubsPageContent />;
}
```

The PageContent component should be a client component:

```tsx
"use client";
```

because it will use RTK Query hooks.

---

## 15. Do Not Do

Do not:

- create a different folder structure
- move feature files outside their feature folder
- put all RTK Query endpoints in `baseApi.ts`
- use Axios
- use Redux slices for server data
- add authentication unless requested
- add Next API routes unless requested
- add extra packages without asking
- rewrite the whole app layout unnecessarily
- delete existing files unless clearly needed
- mix English and Arabic randomly in UI labels

---

## 16. Final Deliverable

At the end, the app should have:

1. Working dashboard layout
2. Working Redux store and RTK Query setup
3. Clubs CRUD page
4. Categories CRUD page
5. Checklists CRUD page
6. Items CRUD page
7. Club Items Workspace page
8. Forms with validation
9. Toasts for success/error
10. Loading/error/empty states
11. TypeScript passing with:

```powershell
pnpm exec tsc --noEmit
```

12. App running with:

```powershell
pnpm dev
```

---

## 17. Recommended Execution Style for Codex

Work one phase at a time.

After finishing each phase:

1. Show a summary of changed files.
2. Mention any assumptions.
3. Ask before moving to the next phase if the change is large.
4. Run or suggest running:

```powershell
pnpm exec tsc --noEmit
```

Keep code clean, typed, and consistent with the existing structure.

