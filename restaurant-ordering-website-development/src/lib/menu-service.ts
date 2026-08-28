import { db } from "@/db";
import { menuItems, type MenuItemRow } from "@/db/schema";
import { MENU_ITEMS } from "@/lib/menu-data";
import { asc, eq } from "drizzle-orm";

let seedingPromise: Promise<unknown> | null = null;

function seed(): Promise<unknown> {
  seedingPromise ??= db
    .insert(menuItems)
    .values(
      MENU_ITEMS.map((m) => ({
        slug: m.slug,
        name: m.name,
        side: m.side,
        category: m.category,
        groupKey: m.groupKey,
        groupLabel: m.groupLabel,
        price: m.price,
        description: m.description ?? null,
        tag: m.tag ?? null,
        popular: m.popular ?? false,
      })),
    )
    .onConflictDoNothing()
    .catch((err) => {
      seedingPromise = null;
      throw err;
    });
  return seedingPromise;
}

function toRows(): MenuItemRow[] {
  return MENU_ITEMS.map((m, i) => ({
    id: i + 1,
    slug: m.slug,
    name: m.name,
    side: m.side,
    category: m.category,
    groupKey: m.groupKey,
    groupLabel: m.groupLabel,
    price: m.price,
    description: m.description ?? null,
    tag: m.tag ?? null,
    popular: m.popular ?? false,
    active: true,
  }));
}

/** Fetch active menu items; lazily seed the table on first run. Falls back to static data if DB unreachable (so `npm run dev` works without Postgres). */
export async function getMenuItems(): Promise<MenuItemRow[]> {
  if (!process.env.DATABASE_URL) {
    return toRows();
  }
  try {
    let rows = await db
      .select()
      .from(menuItems)
      .where(eq(menuItems.active, true))
      .orderBy(asc(menuItems.id));

    if (rows.length === 0) {
      await seed();
      rows = await db
        .select()
        .from(menuItems)
        .where(eq(menuItems.active, true))
        .orderBy(asc(menuItems.id));
    }
    if (rows.length > 0) return rows;
  } catch (e) {
    console.warn("[menu-service] DB unavailable, falling back to static MENU_ITEMS", e instanceof Error ? e.message : e);
  }
  return toRows();
}

/** Look up live prices by slug — the source of truth at checkout. */
export async function priceLookup(slugs: string[]) {
  const all = await getMenuItems();
  const map = new Map<string, MenuItemRow>();
  for (const row of all) map.set(row.slug, row);
  return slugs.map((s) => map.get(s) ?? null);
}
