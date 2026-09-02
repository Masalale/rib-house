"use client";

import { useMemo, useState } from "react";
import {
  Check,
  ChevronRight,
  Minus,
  Plus,
  Search,
  Utensils,
} from "lucide-react";
import {
  CATEGORIES,
  MENU_DISHES,
  type CategoryId,
  type MenuDish,
  type SeedItem,
} from "@/lib/menu-data";
import { ksh } from "@/lib/format";
import { useCart } from "@/components/cart-provider";
import { DishCustomizerModal } from "@/components/dish-customizer-modal";

function categoryImage(catId: CategoryId): string {
  return CATEGORIES.find((c) => c.id === catId)?.image ?? "/images/choma.jpg";
}

/* ─────────────────────────────────────────────────────────────
   Kiosk Dish Card (Mains, Chicken, Fish: with accompaniments)
   ───────────────────────────────────────────────────────────── */
function KioskDishCard({
  dish,
  onCustomize,
}: {
  dish: MenuDish;
  onCustomize: (dish: MenuDish) => void;
}) {
  return (
    <div
      onClick={() => onCustomize(dish)}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white shadow-xs transition-all duration-300 hover:-translate-y-1 hover:border-ember/60 hover:shadow-lg cursor-pointer"
    >
      <div>
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-soot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={dish.image}
            alt={dish.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div className="absolute bottom-3 right-3 rounded-full bg-black/75 px-3 py-1 backdrop-blur-sm">
            <span className="font-display text-lg text-flame leading-none">
              {ksh(dish.basePrice)}
            </span>
          </div>
        </div>

        <div className="p-4 pb-2">
          <h4 className="font-display text-xl tracking-[0.03em] text-cream group-hover:text-ember transition-colors">
            {dish.name}
          </h4>
          {dish.description && (
            <p className="mt-1 text-xs text-sand line-clamp-2 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>
      </div>

      <div className="px-4 pb-4 pt-1">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onCustomize(dish);
          }}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-soot border border-line py-2.5 px-4 text-xs font-extrabold tracking-wide uppercase text-cream transition-all duration-200 group-hover:bg-gradient-to-r group-hover:from-flame group-hover:to-ember group-hover:text-white group-hover:border-transparent group-hover:shadow-sm"
        >
          <span>Choose &amp; Order</span>
          <ChevronRight className="size-3.5 opacity-70 group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   KG Weight Dish Card (Choma, Chemsha, Tumbukiza)
   Proportioned image height to prevent oversized layout
   ───────────────────────────────────────────────────────────── */
function KgDishCard({
  dish,
}: {
  dish: MenuDish;
}) {
  const { add } = useCart();
  const [kg, setKg] = useState<number>(1);
  const [added, setAdded] = useState(false);
  const [kgInput, setKgInput] = useState<string>("1");

  const perKgPrice = dish.perKgPrice ?? dish.basePrice;
  const total = Math.round(perKgPrice * kg);

  const updateKg = (val: number) => {
    const clamped = Math.min(10, Math.max(0.5, Math.round(val * 2) / 2));
    setKg(clamped);
    setKgInput(String(clamped));
  };

  const handleKgInputChange = (v: string) => {
    setKgInput(v);
    const n = parseFloat(v);
    if (!isNaN(n) && n >= 0.5 && n <= 10) setKg(Math.round(n * 2) / 2);
  };

  const handleKgBlur = () => {
    let n = parseFloat(kgInput);
    if (isNaN(n) || n < 0.5) n = 0.5;
    if (n > 10) n = 10;
    n = Math.round(n * 2) / 2;
    setKg(n);
    setKgInput(String(n));
  };

  const handleAdd = () => {
    const kgRounded = Math.round(kg * 2) / 2;
    const price = Math.round(perKgPrice * kgRounded);
    add(
      {
        slug: `${dish.slug}::${kgRounded}`,
        name: dish.name,
        side: `${kgRounded} KG`,
        price,
        image: dish.image,
        kg: kgRounded,
        baseSlug: dish.slug,
      },
      1,
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="flex flex-col justify-between overflow-hidden rounded-3xl border border-line bg-white shadow-xs transition-all hover:border-ember/40">
      <div>
        <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-soot">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={dish.image} alt={dish.name} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
            <h4 className="font-display text-2xl text-white tracking-[0.03em]">
              {dish.name}
            </h4>
            <span className="font-display text-xl text-flame">
              {ksh(perKgPrice)}<span className="text-xs text-white/80 font-sans"> / KG</span>
            </span>
          </div>
        </div>

        {dish.description && (
          <div className="p-4 sm:p-5 pb-2">
            <p className="text-xs text-ash leading-relaxed">{dish.description}</p>
          </div>
        )}
      </div>

      <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-2 border-t border-line flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1 rounded-full border border-line bg-soot p-1">
          <button
            onClick={() => updateKg(kg - 0.5)}
            className="grid size-7 place-items-center rounded-full bg-white text-cream hover:bg-soot shadow-xs transition-colors"
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
          />
          <span className="text-[10px] font-bold text-ash pr-1">KG</span>
          <button
            onClick={() => updateKg(kg + 0.5)}
            className="grid size-7 place-items-center rounded-full bg-cream text-white hover:bg-ember transition-colors shadow-xs"
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
            <><Check className="size-3.5" strokeWidth={3} /> Added</>
          ) : (
            <><Plus className="size-3.5" strokeWidth={2.8} /> Add {kg} KG · {ksh(total)}</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Standard Dish Card (Sides, Snacks, Drinks)
   Proportioned image size: size-24 sm:size-28 (instead of size-16)
   ───────────────────────────────────────────────────────────── */
function StandardDishCard({
  dish,
  onCustomize,
}: {
  dish: MenuDish;
  onCustomize: (dish: MenuDish) => void;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dish.variants && dish.variants.length > 0) {
      onCustomize(dish);
      return;
    }
    add({
      slug: dish.slug,
      name: dish.name,
      side: dish.side ?? null,
      price: dish.basePrice,
      image: dish.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div
      onClick={() => onCustomize(dish)}
      className="group flex gap-3.5 sm:gap-4 rounded-2xl border border-line bg-white p-3 sm:p-3.5 shadow-xs transition-all hover:border-ember/50 hover:shadow-md cursor-pointer"
    >
      <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-xl bg-soot border border-line/60">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={dish.image}
          alt={dish.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
      </div>

      <div className="min-w-0 flex-1 flex flex-col justify-between py-0.5">
        <div>
          <h5 className="font-bold text-sm sm:text-base text-cream group-hover:text-ember transition-colors truncate">
            {dish.name}
          </h5>
          {dish.description && (
            <p className="mt-0.5 text-xs text-ash line-clamp-2 leading-relaxed">
              {dish.description}
            </p>
          )}
        </div>

        <div className="mt-2 flex items-center justify-between">
          <span className="font-display text-lg text-cream">
            {ksh(dish.basePrice)}
          </span>
          <button
            type="button"
            onClick={handleQuickAdd}
            className={`grid size-7 sm:size-8 place-items-center rounded-full transition-all duration-200 active:scale-90 ${
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
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Platter Card
   ───────────────────────────────────────────────────────────── */
function PlatterCard({ dish }: { dish: MenuDish }) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    add({
      slug: dish.slug,
      name: dish.name,
      side: null,
      price: dish.basePrice,
      image: dish.image,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 900);
  };

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-line bg-white shadow-xs transition-all hover:border-ember/40">
      <div className="p-5 sm:p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
              {dish.name}
            </h4>
            <p className="mt-1.5 max-w-xl text-xs text-sand leading-relaxed">
              {dish.description}
            </p>
          </div>
          <span className="font-display text-3xl text-flame">{ksh(dish.basePrice)}</span>
        </div>

        <button
          onClick={handleAdd}
          className={`mt-4 sm:mt-5 w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full py-2.5 px-6 text-xs font-extrabold tracking-wide uppercase transition-all active:scale-95 ${
            added
              ? "bg-leaf text-white"
              : "bg-gradient-to-br from-flame to-ember text-white shadow-xs hover:scale-[1.01]"
          }`}
        >
          {added ? (
            <><Check className="size-3.5" strokeWidth={3} /> Added</>
          ) : (
            <><Plus className="size-3.5" strokeWidth={2.8} /> Add · {ksh(dish.basePrice)}</>
          )}
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Main Menu Explorer (Search only, no sidebar filter)
   ───────────────────────────────────────────────────────────── */
export function MenuExplorer({ items }: { items?: SeedItem[] }) {
  const [query, setQuery] = useState("");
  const [modalDish, setModalDish] = useState<MenuDish | null>(null);

  const dishesByCategory = useMemo(() => {
    const map = new Map<CategoryId, MenuDish[]>();
    for (const cat of CATEGORIES) map.set(cat.id, []);
    for (const dish of MENU_DISHES) {
      const arr = map.get(dish.category);
      if (arr) arr.push(dish);
    }
    return map;
  }, []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q.length < 2) return null;
    return MENU_DISHES.filter((d) =>
      `${d.name} ${d.groupLabel} ${d.description ?? ""}`.toLowerCase().includes(q),
    );
  }, [query]);

  const searching = searchResults !== null;

  const platterDish = useMemo(
    () => MENU_DISHES.find((d) => d.slug === "chicken-platter-4"),
    [],
  );

  return (
    <>
      {/* Search Bar */}
      <div className="relative max-w-md mb-8 sm:mb-10">
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

      {/* Content */}
      {searching ? (
        <div className="space-y-6">
          <p className="text-sm text-ash">
            Found <span className="font-bold text-cream">{searchResults.length}</span>{" "}
            dish{searchResults.length === 1 ? "" : "es"} for{" "}
            <span className="font-bold text-cream">"{query.trim()}"</span>
          </p>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((dish) =>
              dish.accompaniments ? (
                <KioskDishCard key={dish.slug} dish={dish} onCustomize={setModalDish} />
              ) : dish.isKgPricing ? (
                <KgDishCard key={dish.slug} dish={dish} />
              ) : (
                <StandardDishCard key={dish.slug} dish={dish} onCustomize={setModalDish} />
              ),
            )}
          </div>

          {searchResults.length === 0 && (
            <div className="rounded-3xl border border-dashed border-line bg-white p-12 text-center shadow-xs">
              <Utensils className="mx-auto size-9 text-ember/60" />
              <p className="mt-3 font-display text-3xl tracking-wide text-cream">
                NO DISHES FOUND
              </p>
              <p className="mt-1 text-sm text-sand">
                Try a different search term.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-10 sm:space-y-12">
          {CATEGORIES.map((cat) => {
            const catDishes = dishesByCategory.get(cat.id) ?? [];

            return (
              <section key={cat.id} id={`cat-${cat.id}`} className="scroll-mt-24 space-y-4 sm:space-y-5">
                {/* Category Header Banner - Proportioned height */}
                <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl border border-line shadow-xs">
                  <div className="relative h-20 sm:h-24 md:h-28">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={cat.image} alt={cat.label} className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-transparent" />
                    <div className="absolute inset-0 flex flex-col justify-center px-5 sm:px-8">
                      <h3 className="font-display text-2xl sm:text-3xl md:text-4xl leading-none tracking-[0.04em] text-white">
                        {cat.label.toUpperCase()}
                      </h3>
                      <p className="mt-1 max-w-lg text-xs sm:text-sm text-white/85 line-clamp-1">
                        {cat.blurb}
                      </p>
                    </div>
                  </div>
                </div>

                {/* CHOMA ZONE */}
                {cat.id === "choma" && (
                  <div className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      {catDishes
                        .filter((d) => d.slug !== "chicken-platter-4")
                        .map((dish) => (
                          <KgDishCard key={dish.slug} dish={dish} />
                        ))}
                    </div>
                    {platterDish && <PlatterCard dish={platterDish} />}
                  </div>
                )}

                {/* MAINS / CHICKEN / FISH */}
                {(cat.id === "mains" || cat.id === "chicken" || cat.id === "fish") && (
                  <div className="grid gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {catDishes.map((dish) => (
                      <KioskDishCard key={dish.slug} dish={dish} onCustomize={setModalDish} />
                    ))}
                  </div>
                )}

                {/* SIDES / SNACKS / DRINKS */}
                {(cat.id === "extras" || cat.id === "snacks" || cat.id === "drinks") && (
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {catDishes.map((dish) => (
                      <StandardDishCard key={dish.slug} dish={dish} onCustomize={setModalDish} />
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </div>
      )}

      {/* Customizer Modal */}
      {modalDish && (
        <DishCustomizerModal dish={modalDish} onClose={() => setModalDish(null)} />
      )}
    </>
  );
}