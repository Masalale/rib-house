"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Minus,
  Plus,
  X,
} from "lucide-react";
import {
  type MenuDish,
  type DishAccompaniment,
  MENU_DISHES,
} from "@/lib/menu-data";
import { ksh } from "@/lib/format";
import { useCart } from "@/components/cart-provider";

/* ─── Add-on category tabs for the "Add Something Extra" section ─── */
const ADDON_TABS = [
  { key: "all", label: "All" },
  { key: "cold", label: "Juices" },
  { key: "shakes", label: "Shakes" },
  { key: "coffee", label: "Coffee" },
  { key: "barista", label: "Barista" },
  { key: "hot", label: "Hot Drinks" },
  { key: "snacks", label: "Snacks" },
  { key: "soups", label: "Soups" },
  { key: "sides", label: "Sides" },
  { key: "specials", label: "Extras" },
] as const;

/** Dishes eligible as add-ons (drinks, snacks, soups, sides) */
function getAddonDishes(): MenuDish[] {
  return MENU_DISHES.filter(
    (d) =>
      d.category === "drinks" ||
      d.category === "snacks" ||
      d.category === "extras",
  );
}

interface DishCustomizerModalProps {
  dish: MenuDish | null;
  onClose: () => void;
}

export function DishCustomizerModal({ dish, onClose }: DishCustomizerModalProps) {
  const { add } = useCart();

  const [selectedAcc, setSelectedAcc] = useState<DishAccompaniment | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<{
    slug: string;
    name: string;
    price: number;
  } | null>(null);
  const [selectedKg, setSelectedKg] = useState<number>(1);
  const [qty, setQty] = useState<number>(1);
  const [added, setAdded] = useState(false);

  // Add-on section
  const [addonTab, setAddonTab] = useState<string>("all");
  const [addonCart, setAddonCart] = useState<Map<string, number>>(new Map());

  const addonDishes = useMemo(() => getAddonDishes(), []);
  const filteredAddons = useMemo(() => {
    if (addonTab === "all") return addonDishes;
    return addonDishes.filter((d) => d.groupKey === addonTab);
  }, [addonDishes, addonTab]);

  // Reset state on dish change
  useEffect(() => {
    if (dish) {
      setSelectedAcc(
        dish.accompaniments && dish.accompaniments.length > 0
          ? dish.accompaniments[0]
          : null,
      );
      setSelectedVariant(
        dish.variants && dish.variants.length > 0 ? dish.variants[0] : null,
      );
      setSelectedKg(1);
      setQty(1);
      setAdded(false);
      setAddonTab("all");
      setAddonCart(new Map());
    }
  }, [dish]);

  // Lock body scroll
  useEffect(() => {
    if (dish) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [dish]);

  const unitPrice = useMemo(() => {
    if (!dish) return 0;
    if (dish.isKgPricing && dish.perKgPrice) {
      return Math.round(dish.perKgPrice * selectedKg);
    }
    if (selectedAcc) return selectedAcc.price;
    if (selectedVariant) return selectedVariant.price;
    return dish.basePrice;
  }, [dish, selectedAcc, selectedVariant, selectedKg]);

  const addonsTotal = useMemo(() => {
    let total = 0;
    addonCart.forEach((addonQty, slug) => {
      const d = addonDishes.find((ad) => ad.slug === slug);
      if (d) total += d.basePrice * addonQty;
    });
    return total;
  }, [addonCart, addonDishes]);

  const grandTotal = useMemo(() => {
    return unitPrice * qty + addonsTotal;
  }, [unitPrice, qty, addonsTotal]);

  const toggleAddon = (slug: string) => {
    setAddonCart((prev) => {
      const next = new Map(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        next.set(slug, 1);
      }
      return next;
    });
  };

  const setAddonQty = (slug: string, q: number) => {
    setAddonCart((prev) => {
      const next = new Map(prev);
      if (q <= 0) {
        next.delete(slug);
      } else {
        next.set(slug, q);
      }
      return next;
    });
  };

  const handleAddToCart = () => {
    if (!dish) return;

    let sideLabel: string | null = null;
    let itemSlug = dish.slug;

    if (dish.isKgPricing) {
      sideLabel = `${selectedKg} KG`;
      itemSlug = `${dish.slug}::${selectedKg}`;
    } else if (selectedAcc) {
      sideLabel = selectedAcc.name;
      itemSlug = `${dish.slug}-${selectedAcc.slug}`;
    } else if (selectedVariant) {
      sideLabel = selectedVariant.name;
      itemSlug = `${dish.slug}-${selectedVariant.slug}`;
    }

    add(
      {
        slug: itemSlug,
        name: dish.name,
        side: sideLabel,
        price: unitPrice,
        image: dish.image,
        kg: dish.isKgPricing ? selectedKg : undefined,
        baseSlug: dish.isKgPricing ? dish.slug : undefined,
      },
      qty,
    );

    // Add any selected add-on items
    addonCart.forEach((addonQty, slug) => {
      const addonDish = addonDishes.find((d) => d.slug === slug);
      if (addonDish) {
        add(
          {
            slug: addonDish.slug,
            name: addonDish.name,
            side: null,
            price: addonDish.basePrice,
            image: addonDish.image,
          },
          addonQty,
        );
      }
    });

    setAdded(true);
    window.setTimeout(() => onClose(), 600);
  };

  if (!dish) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="fixed inset-0 z-[100] flex flex-col bg-white overflow-hidden"
      >
        {/* ── TOP HEADER BAR ── */}
        <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-line bg-white/95 px-4 sm:px-8 backdrop-blur-md">
          <button
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-soot px-4 py-2 text-xs font-extrabold uppercase tracking-wide text-cream transition-colors hover:border-ember hover:text-ember cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            <span>Back to Menu</span>
          </button>

          <span className="font-display text-xl text-cream tracking-wide hidden sm:block truncate max-w-xs">
            {dish.name}
          </span>

          <button
            onClick={onClose}
            aria-label="Close"
            className="grid size-10 place-items-center rounded-full border border-line bg-soot text-cream transition-all hover:bg-ember hover:text-white hover:border-transparent cursor-pointer shadow-xs"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* ── SCROLLABLE FULL-SCREEN CONTENT ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="mx-auto max-w-6xl w-full px-4 sm:px-8 py-6 sm:py-8 space-y-8">
            {/* Hero Dish Banner / Split Section */}
            <div className="grid gap-6 md:grid-cols-12 items-center rounded-3xl border border-line bg-soot/40 p-4 sm:p-6">
              <div className="md:col-span-5 lg:col-span-4">
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white border border-line/60 shadow-xs">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={dish.image}
                    alt={dish.name}
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>

              <div className="md:col-span-7 lg:col-span-8 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h2 className="font-display text-4xl sm:text-5xl text-cream tracking-[0.02em]">
                      {dish.name}
                    </h2>
                    <span className="font-display text-3xl sm:text-4xl text-flame leading-none">
                      {ksh(dish.basePrice)}
                      {dish.isKgPricing && (
                        <span className="text-sm font-sans text-sand"> / KG</span>
                      )}
                    </span>
                  </div>

                  {dish.description && (
                    <p className="mt-2 text-sm sm:text-base text-sand leading-relaxed max-w-2xl">
                      {dish.description}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* ── ACCOMPANIMENT SELECTION ── */}
            {dish.accompaniments && dish.accompaniments.length > 0 && (
              <div className="space-y-3.5">
                <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                  ACCOMPANIMENT
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
                  {dish.accompaniments.map((acc) => {
                    const isSelected = selectedAcc?.slug === acc.slug;
                    return (
                      <button
                        key={acc.slug}
                        type="button"
                        onClick={() => setSelectedAcc(acc)}
                        className={`flex flex-col justify-between rounded-2xl p-4 text-left transition-all duration-200 cursor-pointer min-h-[5.5rem] ${
                          isSelected
                            ? "border-2 border-ember bg-soot shadow-sm"
                            : "border border-line bg-white hover:border-ember/40 hover:bg-soot/40"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className={`text-sm font-extrabold ${
                              isSelected ? "text-cream" : "text-sand"
                            }`}
                          >
                            {acc.name}
                          </span>
                          <div
                            className={`grid size-5 shrink-0 place-items-center rounded-full border transition-colors ${
                              isSelected
                                ? "border-ember bg-ember text-white"
                                : "border-sand/40 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-3" strokeWidth={3} />
                            )}
                          </div>
                        </div>
                        <span
                          className={`mt-3 font-display text-xl ${
                            isSelected ? "text-flame" : "text-cream"
                          }`}
                        >
                          {ksh(acc.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── VARIANTS SELECTION ── */}
            {dish.variants && dish.variants.length > 0 && (
              <div className="space-y-3.5">
                <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                  OPTIONS
                </h4>
                <div className="grid gap-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {dish.variants.map((v) => {
                    const isSelected = selectedVariant?.slug === v.slug;
                    return (
                      <button
                        key={v.slug}
                        type="button"
                        onClick={() => setSelectedVariant(v)}
                        className={`flex items-center justify-between rounded-2xl p-4 text-left transition-all cursor-pointer ${
                          isSelected
                            ? "border-2 border-ember bg-soot shadow-sm"
                            : "border border-line bg-white hover:border-ember/40"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`grid size-5 place-items-center rounded-full border ${
                              isSelected
                                ? "border-ember bg-ember text-white"
                                : "border-sand/40 bg-white"
                            }`}
                          >
                            {isSelected && (
                              <Check className="size-3" strokeWidth={3} />
                            )}
                          </div>
                          <span className="text-sm font-bold text-cream">
                            {v.name}
                          </span>
                        </div>
                        <span className="font-display text-lg text-flame">
                          {ksh(v.price)}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── KG PORTION SELECTION ── */}
            {dish.isKgPricing && dish.perKgPrice && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                    PORTION
                  </h4>
                  <span className="font-display text-2xl text-flame">
                    {ksh(unitPrice)}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2.5">
                  {[0.5, 1, 1.5, 2, 3].map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setSelectedKg(p)}
                      className={`rounded-2xl px-5 py-3 text-xs font-extrabold transition-all cursor-pointer ${
                        selectedKg === p
                          ? "bg-cream text-white shadow-sm"
                          : "border border-line bg-white text-sand hover:border-sand"
                      }`}
                    >
                      {p} KG · {ksh(Math.round(dish.perKgPrice! * p))}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── ADD SOMETHING EXTRA ── */}
            <div className="space-y-4 pt-6 border-t border-line">
              <h4 className="font-display text-2xl tracking-[0.03em] text-cream">
                ADD SOMETHING EXTRA
              </h4>

              {/* Category Tab Switcher */}
              <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                {ADDON_TABS.map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setAddonTab(tab.key)}
                    className={`shrink-0 rounded-full px-4 py-2 text-xs font-bold tracking-wide transition-all cursor-pointer ${
                      addonTab === tab.key
                        ? "bg-cream text-white shadow-xs"
                        : "border border-line bg-white text-sand hover:border-sand hover:text-cream"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Add-on Grid (Spacious Full Screen Layout) */}
              <div className="grid gap-3.5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {filteredAddons.map((addonDish) => {
                  const inCart = addonCart.get(addonDish.slug) ?? 0;
                  const isAdded = inCart > 0;

                  return (
                    <div
                      key={addonDish.slug}
                      className={`flex gap-3 rounded-2xl p-3 transition-all ${
                        isAdded
                          ? "border-2 border-ember/50 bg-soot/60 shadow-xs"
                          : "border border-line bg-white hover:border-ember/30"
                      }`}
                    >
                      {/* Thumbnail */}
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-xl bg-soot border border-line/40">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={addonDish.image}
                          alt={addonDish.name}
                          className="h-full w-full object-cover"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0 flex flex-col justify-between">
                        <div>
                          <p className="text-xs font-bold text-cream truncate">
                            {addonDish.name}
                          </p>
                          <span className="font-display text-base text-flame">
                            {ksh(addonDish.basePrice)}
                          </span>
                        </div>

                        {/* Add / Qty controls */}
                        <div className="flex items-center justify-end">
                          {isAdded ? (
                            <div className="flex items-center gap-1 rounded-full border border-line bg-soot p-0.5">
                              <button
                                type="button"
                                onClick={() =>
                                  setAddonQty(addonDish.slug, inCart - 1)
                                }
                                className="grid size-6 place-items-center rounded-full bg-white text-cream shadow-xs cursor-pointer"
                              >
                                <Minus className="size-2.5" />
                              </button>
                              <span className="w-5 text-center text-xs font-black text-cream">
                                {inCart}
                              </span>
                              <button
                                type="button"
                                onClick={() =>
                                  setAddonQty(addonDish.slug, inCart + 1)
                                }
                                className="grid size-6 place-items-center rounded-full bg-cream text-white shadow-xs cursor-pointer"
                              >
                                <Plus className="size-2.5" />
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => toggleAddon(addonDish.slug)}
                              className="grid size-7 place-items-center rounded-full border border-line bg-white text-cream hover:border-ember hover:bg-ember hover:text-white shadow-xs transition-all cursor-pointer"
                            >
                              <Plus className="size-3.5" strokeWidth={2.5} />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* ── STICKY FULL-SCREEN BOTTOM ACTION BAR ── */}
        <footer className="sticky bottom-0 z-20 shrink-0 border-t border-line bg-white/95 backdrop-blur-md px-4 sm:px-8 py-4">
          <div className="mx-auto max-w-6xl flex flex-wrap items-center justify-between gap-4">
            {/* Qty Stepper */}
            <div className="flex items-center gap-1 rounded-full border border-line bg-soot p-1">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="grid size-9 place-items-center rounded-full bg-white text-cream hover:bg-soot shadow-xs transition-colors cursor-pointer"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </button>
              <span className="w-10 text-center text-base font-black text-cream">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(Math.min(20, qty + 1))}
                className="grid size-9 place-items-center rounded-full bg-cream text-white hover:bg-ember transition-colors shadow-xs cursor-pointer"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </button>
            </div>

            {/* Add to Order Button */}
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={added}
              className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2.5 rounded-full py-3.5 px-10 text-sm font-extrabold tracking-wider uppercase transition-all duration-200 active:scale-95 shadow-md cursor-pointer ${
                added
                  ? "bg-leaf text-white"
                  : "bg-gradient-to-br from-flame via-ember to-blood text-white hover:scale-[1.02]"
              }`}
            >
              {added ? (
                <>
                  <CheckCircle2 className="size-5" strokeWidth={2.5} />
                  Added to Order!
                </>
              ) : (
                <>
                  Add {qty > 1 ? `${qty}× ` : ""}to Order · {ksh(grandTotal)}
                </>
              )}
            </button>
          </div>
        </footer>
      </motion.div>
    </AnimatePresence>
  );
}
