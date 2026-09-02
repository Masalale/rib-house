"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Flame, Menu, Phone, ShoppingBag, X } from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { RESTAURANT } from "@/lib/menu-data";

const NAV = [
  { href: "/#menu", label: "Menu" },
  { href: "/#fire", label: "The Fire" },
];

export function SiteHeader() {
  const { count, openCart } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-line/80 bg-white/85 backdrop-blur-xl shadow-sm"
          : "bg-white/70 backdrop-blur-md"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-2.5">
          <img
            src="/logo_no_background.png"
            alt="Rib House Logo"
            className="size-11 object-contain transition-transform duration-300 group-hover:scale-105"
          />
          <span className="leading-none">
            <span className="block font-display text-2xl tracking-[0.08em] text-cream">
              RIB HOUSE
            </span>
            <span className="block text-[10px] font-bold tracking-[0.28em] text-ember uppercase">
              Grilled Meat
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-semibold text-sand transition-colors hover:bg-soot hover:text-cream"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="hidden items-center gap-2 rounded-full border border-line bg-soot px-4 py-2 text-sm font-bold text-cream transition-colors hover:border-ember/60 hover:text-flame lg:inline-flex"
          >
            <Phone className="size-4 text-ember" />
            Contact Us
          </a>

          <button
            onClick={openCart}
            className="relative inline-flex items-center gap-2 rounded-full bg-gradient-to-br from-flame via-ember to-blood px-4 py-2 text-sm font-extrabold text-coal transition-transform duration-200 hover:scale-[1.04] active:scale-95"
            aria-label="Open cart"
          >
            <ShoppingBag className="size-4" strokeWidth={2.5} />
            <span className="hidden sm:inline">Cart</span>
            <AnimatePresence>
              {count > 0 && (
                <motion.span
                  key={count}
                  initial={{ scale: 0.4, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.4, opacity: 0 }}
                  className="absolute -top-1.5 -right-1.5 grid min-size-6 place-items-center rounded-full border-2 border-coal bg-cream px-1 text-[11px] font-extrabold text-coal"
                >
                  {count}
                </motion.span>
              )}
            </AnimatePresence>
          </button>

          <button
            className="grid size-10 place-items-center rounded-full border border-line bg-white text-cream shadow-sm md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-line bg-white/95 backdrop-blur-xl shadow-md md:hidden"
          >
            <div className="space-y-1 px-4 pb-4">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-semibold text-sand hover:bg-soot hover:text-cream"
                >
                  {item.label}
                </Link>
              ))}
              <a
                href="#contact"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2 rounded-xl px-3 py-3 text-sm font-bold text-flame"
              >
                <Phone className="size-4" /> Contact Us
              </a>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
