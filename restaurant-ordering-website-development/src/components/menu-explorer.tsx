"use client";

import { useMemo, useState } from "react";
import {
  Check,
  Layers,
  Minus,
  Plus,
  Scale,
  Search,
  Utensils,
} from "lucide-react";
import type { MenuItemRow } from "@/db/schema";
import { CATEGORIES, type CategoryId } from "@/lib/menu-data";
import { ksh } from "@/lib/format";
import { useCart } from "@/components/cart-provider";

interface Group {
  key: string;
  label: string;
  category: CategoryId;
  items: MenuItemRow[];
}

const KG_GROUP_KEYS = new Set(["choma-zone", "chemsha-zone", "tumbukiza"]);

function isKgGroup(groupKey: string): boolean {
  return KG_GROUP_KEYS.has(groupKey);
}

function getSpecificImage(groupKey: string, category: string, slug?: string): string {
  if (slug === "barista-dawa" || slug?.includes("dawa")) return "/images/dawa.jpg";
  if (slug === "extra-chips-masala" || groupKey === "chips-masala" || groupKey === "specials") return "/images/chips-masala.jpg";
  if (slug === "chicken-platter-4" || groupKey === "platters") return "/images/story.jpg";
  if (groupKey === "tumbukiza" || groupKey === "soups") return "/images/tumbukiza.jpg";
  if (groupKey === "choma-zone" || groupKey === "chemsha-zone") return "/images/choma.jpg";
  if (groupKey === "shakes") return "/images/smoothie.jpg";
  if (groupKey === "barista" || groupKey === "coffee" || groupKey === "hot") return "/images/dawa.jpg";
  if (category === "chicken") return "/images/chicken.jpg";
  if (category === "fish") return "/images/fish.jpg";
  if (category === "mains") return "/images/stew.jpg";
  if (category === "extras") return "/images/pilau.jpg";
  if (category === "snacks") return "/images/snacks.jpg";
  if (category === "drinks") return "/images/drinks.jpg";
  return "/images/choma.jpg";
}

function groupBy(items: MenuItemRow[]): Group[] {
  const map = new Map<string, Group>();
  for (const item of items) {
    const g = map.get(item.groupKey) ?? {
      key: item.groupKey,
      label: item.groupLabel,
      category: item.category as CategoryId,
      items: [],
    };
    g.items.push(item);
    map.set(item.groupKey, g);
  }
  return [...map.values()];
}

/* ─────────────────────────────────────────────────────────────
   Add Button
   ───────────────────────────────────────────────────────────── */
function AddButton({
  item,
  image,
}: {
  item: MenuItemRow;
  image: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handle = () => {
    add({ slug: item.slug, name: item.name, side: item.side, price: item.price, image });
    setAdded(true);
    window.setTimeout(() => setAdded(false), 900);
  };

  return (
    <button
      onClick={handle}
      aria-label={`Add ${item.name} ${item.side ?? ""} to cart`}
      className={`grid size-7 shrink-0 place-items-center rounded-full transition-all duration-200 active:scale-90 ${
        added
          ? "bg-leaf text-white"
          : "border border-line bg-white text-cream hover:border-ember hover:bg-ember hover:text-white shadow-xs"
      }`}
    >
      {added ? (
        <Check className="size-3.5" strokeWidth={3} />
      ) : (
        <Plus className="size-3.5" strokeWidth={2.5} />
      )}
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────
   KG Weight Dish Card (Choma, Chemsha, Tumbukiza)
   ───────────────────────────────────────────────────────────── */
function KgDishCard({
  baseItem,
  perKgPrice,
  baseSlug,
  image,
}: {
  baseItem: MenuItemRow;
  perKgPrice: number;
  baseSlug: string;
  image: string;
}) {
  const { add } = useCart();
  const [kg, setKg] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [kgInput, setKgInput] = useState<string>("1");

  const total = Math.round(perKgPrice * kg);
  const presets = [0.5, 1, 1.5, 2, 3];

  const updateKg = (val: number) => {
    const clamped = Math.min(10, Math.max(0.25, Math.round(val * 4) / 4));
    setKg(clamped);
    setKgInput(String(clamped));
  };

  const handleKgInputChange = (v: string) => {
    setKgInput(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n >= 0.25 && n <= 10) {
      setKg(n);
    }
  };

  const handleKgBlur = () => {
    let n = parseFloat(kgInput);
    if (isNaN(n) || n < 0.25) n = 0.25;
    if (n > 10) n = 10;
    n = Math.round(n * 4) / 4;
    setKg(n);
    setKgInput(String(n));
  };

  const handleAdd = () => {
    const kgRounded = Math.round(kg * 4) / 4;
    const price = Math.round(perKgPrice * kgRounded);
    const cartSlug = `${baseSlug}::${kgRounded}`;
    add(
      {
        slug: cartSlug,
        name: baseItem.name,
        side: `${kgRounded} KG`,
        price,
        image,
        kg: kgRounded,
        baseSlug,
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="flex flex-col justify-between rounded-3xl border border-line bg-white p-5 shadow-xs transition-all hover:border-ember/40">
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                {baseItem.name}
              </h4>
              <span className="rounded-full bg-ember/10 border border-ember/20 px-2 py-0.5 text-[10px] font-extrabold text-flame uppercase">
                By KG
              </span>
            </div>
            {baseItem.description && (
              <p className="mt-1 text-xs text-ash leading-relaxed">
                {baseItem.description}
              </p>
            )}
          </div>
          <span className="font-display text-xl text-flame shrink-0">
            {ksh(perKgPrice)} <span className="text-xs text-ash font-sans">/ KG</span>
          </span>
        </div>

        {/* Portion presets */}
        <div className="mt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-sand mr-1">Portion:</span>
          {presets.map((p) => (
            <button
              key={p}
              onClick={() => updateKg(p)}
              className={`rounded-lg px-2.5 py-1 text-xs font-bold transition-all ${
                kg === p
                  ? "bg-cream text-white shadow-xs"
                  : "border border-line bg-soot text-sand hover:border-sand hover:text-cream"
              }`}
            >
              {p} KG
            </button>
          ))}
        </div>
      </div>

      {/* Stepper + live total + Add */}
      <div className="mt-5 pt-4 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line bg-soot p-1">
          <button
            onClick={() => updateKg(kg - 0.25)}
            className="grid size-7 place-items-center rounded-full bg-white text-cream hover:bg-soot shadow-xs transition-colors"
            aria-label="Decrease weight"
          >
            <Minus className="size-3" />
          </button>
          <input
            type="text"
            inputMode="decimal"
            value={kgInput}
            onChange={(e) => handleKgInputChange(e.target.value)}
            onBlur={handleKgBlur}
            className="w-11 bg-transparent text-center text-xs font-extrabold text-cream outline-none"
            aria-label="Kilograms"
          />
          <span className="text-[10px] font-bold text-ash pr-1">KG</span>
          <button
            onClick={() => updateKg(kg + 0.25)}
            className="grid size-7 place-items-center rounded-full bg-cream text-white hover:bg-ember transition-colors shadow-xs"
            aria-label="Increase weight"
          >
            <Plus className="size-3" />
          </button>
        </div>

        <button
          onClick={handleAdd}
          className={`flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 rounded-full py-2.5 px-5 text-xs font-extrabold tracking-wide uppercase transition-all active:scale-95 ${
            added
              ? "bg-leaf text-white"
              : "bg-gradient-to-br from-flame to-ember text-white shadow-xs hover:scale-[1.02]"
          }`}
        >
          {added ? (
            <>
              <Check className="size-3.5" strokeWidth={3} /> Added
            </>
          ) : (
            <>
              <Plus className="size-3.5" strokeWidth={2.8} /> Add {kg} KG · {ksh(total)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Multi-Side Dish Card (Clean, direct accompaniment list with prices & +)
   ───────────────────────────────────────────────────────────── */
function MultiSideDishCard({
  group,
  image,
}: {
  group: Group;
  image: string;
}) {
  return (
    <div className="flex flex-col rounded-3xl border border-line bg-white p-5 shadow-xs transition-all hover:border-ember/40">
      <div className="mb-3">
        <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
          {group.label}
        </h4>
        {group.items[0]?.description && (
          <p className="mt-0.5 text-xs text-ash leading-relaxed">
            {group.items[0].description}
          </p>
        )}
      </div>

      <div className="divide-y divide-line/60 rounded-2xl border border-line/60 bg-soot/40 p-1.5 mt-auto">
        {group.items.map((it) => (
          <div
            key={it.slug}
            className="flex items-center justify-between px-3 py-2 text-xs transition-colors hover:bg-white rounded-xl"
          >
            <span className="font-bold text-cream truncate pr-2">
              {it.side ?? "Regular"}
            </span>
            <div className="flex items-center gap-3 shrink-0">
              <span className="font-display text-base text-flame">{ksh(it.price)}</span>
              <AddButton item={it} image={image} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Clean Dish List Row (Sides, Snacks, Drinks)
   ───────────────────────────────────────────────────────────── */
function DishListItem({
  item,
  image,
}: {
  item: MenuItemRow;
  image: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2.5 transition-colors hover:bg-soot">
      <div className="min-w-0 pr-3">
        <p className="text-sm font-bold text-cream truncate">
          {item.name}
          {item.side && (
            <span className="text-sand font-normal text-xs ml-1.5">
              · {item.side}
            </span>
          )}
          {item.tag && (
            <span className="ml-2 rounded-full bg-flame/10 border border-flame/30 px-2 py-0.5 text-[9px] font-extrabold text-flame uppercase">
              {item.tag}
            </span>
          )}
        </p>
        {item.description && (
          <p className="text-xs text-ash truncate mt-0.5">{item.description}</p>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="font-display text-lg text-cream">{ksh(item.price)}</span>
        <AddButton item={item} image={image} />
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Spotlight Card (Sharing Platter)
   ───────────────────────────────────────────────────────────── */
function PlatterCard({
  item,
  image,
}: {
  item: MenuItemRow;
  image: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({
      slug: item.slug,
      name: item.name,
      side: item.side,
      price: item.price,
      image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-white shadow-xs transition-all hover:border-ember/40">
      <div className="p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                {item.name}
              </h4>
              <span className="rounded-full bg-flame/10 border border-flame/20 px-2.5 py-0.5 text-[10px] font-extrabold text-flame uppercase">
                Feeds 4
              </span>
            </div>
            <p className="mt-1.5 max-w-xl text-xs text-sand leading-relaxed">
              {item.description}
            </p>
          </div>
          <span className="font-display text-3xl text-flame">{ksh(item.price)}</span>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-6 text-xs font-extrabold tracking-wide uppercase transition-all active:scale-95 ${
            added
              ? "bg-leaf text-white"
              : "bg-gradient-to-br from-flame to-ember text-white shadow-xs hover:scale-[1.01]"
          }`}
        >
          {added ? (
            <>
              <Check className="size-3.5" strokeWidth={3} /> Added to order
            </>
          ) : (
            <>
              <Plus className="size-3.5" strokeWidth={2.8} /> Add Platter to order · {ksh(item.price)}
            </>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Menu Explorer with Desktop Sidebar & Mobile Tabs
   ───────────────────────────────────────────────────────────── */
export function MenuExplorer({ items }: { items: MenuItemRow[] }) {
  const [activeCat, setActiveCat] = useState<CategoryId | "all">("all");
  const [query, setQuery] = useState("");

  const byCategory = useMemo(() => {
    const map = new Map<CategoryId, MenuItemRow[]>();
    for (const cat of CATEGORIES) map.set(cat.id, []);
    for (const item of items) {
      const arr = map.get(item.category as CategoryId);
      if (arr) arr.push(item);
    }
    return map;
  }, [items]);

  const filteredCategories = useMemo(() => {
    if (activeCat === "all") return CATEGORIES;
    return CATEGORIES.filter((c) => c.id === activeCat);
  }, [activeCat]);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    return items.filter((i) =>
      `${i.name} ${i.side ?? ""} ${i.groupLabel} ${i.description ?? ""}`.toLowerCase().includes(q),
    );
  }, [items, query]);

  const searching = searchResults !== null;

  const platterItem = useMemo(
    () => items.find((i) => i.slug === "chicken-platter-4"),
    [items],
  );

  return (
    <div className="flex flex-col gap-8 lg:flex-row">
      {/* ── DESKTOP SIDEBAR: Clean, simple category list & search ── */}
      <aside className="w-full shrink-0 lg:w-72 lg:sticky lg:top-20 lg:self-start space-y-4">
        <div className="rounded-3xl border border-line bg-white p-5 shadow-xs space-y-5">
          {/* Search Box with proper padding to eliminate icon overlap */}
          <div className="relative">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ash z-10" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search dishes…"
              style={{ paddingLeft: "2.5rem" }}
              className="field w-full pr-8 text-sm py-2.5 rounded-2xl"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-ash hover:text-cream"
              >
                ×
              </button>
            )}
          </div>

          {/* Category List */}
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-extrabold tracking-[0.25em] text-ash uppercase mb-3">
              <Layers className="size-3.5" /> Categories
            </p>
            <div className="grid grid-cols-2 gap-1.5 lg:grid-cols-1">
              <button
                onClick={() => setActiveCat("all")}
                className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold tracking-wide uppercase transition-all ${
                  activeCat === "all"
                    ? "bg-gradient-to-br from-flame to-ember text-white shadow-xs"
                    : "border border-line bg-soot text-sand hover:border-sand hover:text-cream"
                }`}
              >
                <span>All Items</span>
                <span className={`text-[10px] rounded-full px-2 py-0.5 ${activeCat === "all" ? "bg-white/20 text-white" : "bg-white text-ash"}`}>
                  {items.length}
                </span>
              </button>
              {CATEGORIES.map((cat) => {
                const count = byCategory.get(cat.id)?.length ?? 0;
                const active = activeCat === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCat(cat.id)}
                    className={`flex items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-extrabold tracking-wide uppercase transition-all ${
                      active
                        ? "bg-gradient-to-br from-flame to-ember text-white shadow-xs"
                        : "border border-line bg-soot text-sand hover:border-sand hover:text-cream"
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`text-[10px] rounded-full px-2 py-0.5 ${active ? "bg-white/20 text-white" : "bg-white text-ash"}`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN CONTENT: Dishes & Offerings with Accompaniments ── */}
      <div className="min-w-0 flex-1 space-y-16">
        {/* Search Results */}
        {searching ? (
          <div className="space-y-6">
            <p className="text-sm text-ash">
              Found <span className="font-bold text-cream">{searchResults.length}</span> item
              {searchResults.length === 1 ? "" : "s"} for{" "}
              <span className="font-bold text-cream">“{query.trim()}”</span>
            </p>

            <div className="rounded-2xl border border-line bg-white p-3 divide-y divide-line shadow-xs">
              {searchResults.map((item) => {
                const img = getSpecificImage(item.groupKey, item.category, item.slug);
                return <DishListItem key={item.slug} item={item} image={img} />;
              })}
            </div>

            {searchResults.length === 0 && (
              <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center shadow-xs">
                <Utensils className="mx-auto size-9 text-ember/60" />
                <p className="mt-3 font-display text-3xl tracking-wide text-cream">
                  NO DISHES FOUND
                </p>
                <p className="mt-1 text-sm text-sand">
                  Try searching for “goat choma”, “stew”, “tilapia”, or “dawa”.
                </p>
              </div>
            )}
          </div>
        ) : (
          /* Category Sections */
          <div className="space-y-16">
            {filteredCategories.map((cat) => {
              const catItems = byCategory.get(cat.id) ?? [];
              const groups = groupBy(catItems);

              return (
                <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24 space-y-6">
                  {/* Category Header with representative section photo */}
                  <div className="relative overflow-hidden rounded-3xl border border-line shadow-xs">
                    <div className="relative h-32 sm:h-40">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
                      <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-10">
                        <h3 className="font-display text-4xl leading-none tracking-[0.04em] text-white sm:text-5xl">
                          {cat.label.toUpperCase()}
                        </h3>
                        <p className="mt-1.5 max-w-lg text-xs sm:text-sm text-white/80 line-clamp-1">
                          {cat.blurb}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* ── CHOMA ZONE ── */}
                  {cat.id === "choma" && (
                    <div className="space-y-6">
                      <div className="grid gap-4 md:grid-cols-2">
                        {groups
                          .filter((g) => isKgGroup(g.key))
                          .map((g) => {
                            const perKgMap = new Map<string, MenuItemRow>();
                            for (const it of g.items) {
                              if (it.side === "1 KG") perKgMap.set(it.name, it);
                            }
                            if (perKgMap.size === 0) {
                              for (const it of g.items) perKgMap.set(it.slug, it);
                            }
                            return [...perKgMap.values()].map((base) => (
                              <KgDishCard
                                key={base.slug}
                                baseItem={base}
                                perKgPrice={base.price}
                                baseSlug={base.slug}
                                image={getSpecificImage(g.key, cat.id)}
                              />
                            ));
                          })}
                      </div>

                      {/* Sharing Platter */}
                      {platterItem && (
                        <PlatterCard
                          item={platterItem}
                          image="/images/story.jpg"
                        />
                      )}
                    </div>
                  )}

                  {/* ── SIGNATURE MAINS (with clean accompaniments table) ── */}
                  {cat.id === "mains" && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {groups.map((group) => (
                        <MultiSideDishCard
                          key={group.key}
                          group={group}
                          image="/images/stew.jpg"
                        />
                      ))}
                    </div>
                  )}

                  {/* ── CHICKEN & FISH (with clean accompaniments table) ── */}
                  {(cat.id === "chicken" || cat.id === "fish") && (
                    <div className="grid gap-4 md:grid-cols-2">
                      {groups.map((group) => (
                        <MultiSideDishCard
                          key={group.key}
                          group={group}
                          image={cat.id === "chicken" ? "/images/chicken.jpg" : "/images/fish.jpg"}
                        />
                      ))}
                    </div>
                  )}

                  {/* ── SIDES & EXTRAS ── */}
                  {cat.id === "extras" && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {groups.map((group) => (
                        <div key={group.key} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                          <h4 className="font-display text-xl tracking-[0.03em] text-cream mb-2 px-2">
                            {group.label}
                          </h4>
                          <div className="divide-y divide-line/60">
                            {group.items.map((it) => (
                              <DishListItem
                                key={it.slug}
                                item={it}
                                image={getSpecificImage(group.key, cat.id, it.slug)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── SNACKS & SOUPS ── */}
                  {cat.id === "snacks" && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {groups.map((group) => (
                        <div key={group.key} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                          <h4 className="font-display text-xl tracking-[0.03em] text-cream mb-2 px-2">
                            {group.label}
                          </h4>
                          <div className="divide-y divide-line/60">
                            {group.items.map((it) => (
                              <DishListItem
                                key={it.slug}
                                item={it}
                                image={getSpecificImage(group.key, cat.id, it.slug)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── DRINKS & BARISTA ── */}
                  {cat.id === "drinks" && (
                    <div className="grid gap-6 md:grid-cols-2">
                      {groups.map((group) => (
                        <div key={group.key} className="rounded-2xl border border-line bg-white p-4 shadow-xs">
                          <h4 className="font-display text-xl tracking-[0.03em] text-cream mb-2 px-2">
                            {group.label}
                          </h4>
                          <div className="divide-y divide-line/60">
                            {group.items.map((it) => (
                              <DishListItem
                                key={it.slug}
                                item={it}
                                image={getSpecificImage(group.key, cat.id, it.slug)}
                              />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
