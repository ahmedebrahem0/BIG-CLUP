import type { Category } from "../types";

type CategoryTreeOption = {
  id: number;
  label: string;
  parent: number | null;
};

function buildChildrenMap(categories: Category[]) {
  const childrenMap = new Map<number | null, Category[]>();

  for (const category of categories) {
    const key = category.parent;
    const currentChildren = childrenMap.get(key) ?? [];
    currentChildren.push(category);
    childrenMap.set(key, currentChildren);
  }

  for (const items of childrenMap.values()) {
    items.sort((a, b) => a.name.localeCompare(b.name, "ar"));
  }

  return childrenMap;
}

export function buildCategoryTree(categories: Category[]) {
  const childrenMap = buildChildrenMap(categories);
  const ordered: CategoryTreeOption[] = [];

  function visit(parentId: number | null, depth: number) {
    const children = childrenMap.get(parentId) ?? [];

    for (const child of children) {
      ordered.push({
        id: child.id,
        label: `${"\u00A0\u00A0".repeat(depth)}${depth ? "- " : ""}${child.name}`,
        parent: child.parent,
      });
      visit(child.id, depth + 1);
    }
  }

  visit(null, 0);

  return ordered;
}
