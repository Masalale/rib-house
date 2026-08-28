"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  Bike,
  CheckCircle2,
  Flame,
  Loader2,
  Minus,
  Phone,
  Plus,
  ShoppingBag,
  Store,
  Trash2,
  X,
} from "lucide-react";
import { useCart } from "@/components/cart-provider";
import { DELIVERY_FEE, RESTAURANT } from "@/lib/menu-data";
import { ksh } from "@/lib/format";

type Step = "cart" | "checkout" | "success";

export function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCode, setOrderCode] = useState<string | null>(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"mpesa" | "cash">("mpesa");

  const deliveryFee = orderType === "delivery" && lines.length > 0 ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  useEffect(() => {
    if (!isOpen && step !== "success") {
      // keep form details, just reset the view
      setTimeout(() => setStep("cart"), 250);
    }
  }, [isOpen, step]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  async function placeOrder() {
    setError(null);
    if (name.trim().length < 2) return setError("Please tell us your name.");
    if (phone.trim().length < 9) return setError("Please enter a valid phone number.");
    if (orderType === "delivery" && address.trim().length < 4)
      return setError("Please tell us where to deliver.");
    if (lines.length === 0) return setError("Your cart is empty.");

    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customerName: name.trim(),
          phone: phone.trim(),
          orderType,
          address: address.trim(),
          notes: notes.trim(),
          paymentMethod: payment,
          items: lines.map((l) =>
            l.kg != null && l.baseSlug
              ? { slug: l.baseSlug, qty: l.qty, kg: l.kg }
              : { slug: l.slug, qty: l.qty },
          ),
        }),
      });
      const data = (await res.json()) as { ok: boolean; code?: string; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setOrderCode(data.code ?? null);
      clear();
      setStep("success");
    } catch {
      setError("Network hiccup — please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 z-[70] bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed inset-y-0 right-0 z-[80] flex w-full max-w-md flex-col border-l border-line bg-white shadow-2xl"
          >
            {/* header */}
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <div className="flex items-center gap-2.5">
                {step === "checkout" && (
                  <button
                    onClick={() => setStep("cart")}
                    className="grid size-8 place-items-center rounded-full border border-line text-sand hover:text-cream"
                    aria-label="Back to cart"
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                )}
                <h3 className="font-display text-2xl tracking-[0.08em]">
                  {step === "cart" && "YOUR ORDER"}
                  {step === "checkout" && "CHECKOUT"}
                  {step === "success" && "ORDER PLACED"}
                </h3>
              </div>
              <button
                onClick={closeCart}
                className="grid size-9 place-items-center rounded-full border border-line text-sand transition-colors hover:border-ember/60 hover:text-cream"
                aria-label="Close cart"
              >
                <X className="size-4.5" />
              </button>
            </div>

            {/* ── CART STEP ─────────────────────────────── */}
            {step === "cart" && (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  {lines.length === 0 ? (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <span className="grid size-16 place-items-center rounded-full border border-dashed border-line">
                        <ShoppingBag className="size-7 text-ash" />
                      </span>
                      <p className="mt-4 font-display text-2xl tracking-wide text-cream">
                        THE GRILL IS WAITING
                      </p>
                      <p className="mt-1 max-w-xs text-sm text-ash">
                        Your cart is empty. Add some choma, a stew, or a cold juice to
                        get started.
                      </p>
                      <a
                        href="/#menu"
                        onClick={closeCart}
                        className="mt-6 rounded-full bg-gradient-to-br from-flame to-ember px-6 py-3 text-xs font-extrabold tracking-widest text-coal uppercase"
                      >
                        Browse the menu
                      </a>
                    </div>
                  ) : (
                    <ul className="space-y-3">
                      <AnimatePresence initial={false}>
                        {lines.map((line) => (
                          <motion.li
                            key={line.slug}
                            layout
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: 40 }}
                            className="flex gap-3 rounded-2xl border border-line bg-soot/50 p-3"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={line.image}
                              alt=""
                              className="size-16 shrink-0 rounded-xl object-cover"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-bold text-cream">
                                {line.name}
                              </p>
                              {line.side && (
                                <p className="truncate text-xs text-ash">{line.side}</p>
                              )}
                              <p className="mt-1 font-display text-lg leading-none text-flame">
                                {ksh(line.price * line.qty)}
                              </p>
                            </div>
                            <div className="flex flex-col items-end justify-between">
                              <button
                                onClick={() => remove(line.slug)}
                                className="text-ash transition-colors hover:text-danger"
                                aria-label="Remove item"
                              >
                                <Trash2 className="size-4" />
                              </button>
                              <div className="flex items-center gap-2 rounded-full border border-line bg-soot px-1.5 py-1">
                                <button
                                  onClick={() => setQty(line.slug, line.qty - 1)}
                                  className="grid size-6 place-items-center rounded-full text-sand hover:bg-soot hover:text-cream"
                                  aria-label="Decrease quantity"
                                >
                                  <Minus className="size-3.5" />
                                </button>
                                <span className="min-w-4 text-center text-sm font-extrabold">
                                  {line.qty}
                                </span>
                                <button
                                  onClick={() => setQty(line.slug, line.qty + 1)}
                                  className="grid size-6 place-items-center rounded-full text-sand hover:bg-soot hover:text-cream"
                                  aria-label="Increase quantity"
                                >
                                  <Plus className="size-3.5" />
                                </button>
                              </div>
                            </div>
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  )}
                </div>

                {lines.length > 0 && (
                  <div className="border-t border-line bg-soot/40 px-5 py-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-ash">Subtotal</span>
                      <span className="font-extrabold text-cream">{ksh(subtotal)}</span>
                    </div>
                    <p className="mt-1 text-xs text-ash">
                      Delivery fee calculated at checkout — {ksh(DELIVERY_FEE)} flat,
                      pickup is free.
                    </p>
                    <button
                      onClick={() => setStep("checkout")}
                      className="mt-4 w-full rounded-full bg-gradient-to-br from-flame via-ember to-blood py-3.5 text-sm font-extrabold tracking-widest text-coal uppercase transition-transform hover:scale-[1.02] active:scale-95"
                    >
                      Checkout · {ksh(subtotal)}
                    </button>
                  </div>
                )}
              </>
            )}

            {/* ── CHECKOUT STEP ─────────────────────────── */}
            {step === "checkout" && (
              <>
                <div className="flex-1 space-y-5 overflow-y-auto px-5 py-5">
                  {/* order type */}
                  <div className="grid grid-cols-2 gap-2 rounded-2xl border border-line bg-soot/40 p-1.5">
                    {(
                      [
                        { id: "delivery", label: "Delivery", icon: Bike, hint: ksh(DELIVERY_FEE) },
                        { id: "pickup", label: "Pickup", icon: Store, hint: "Free" },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setOrderType(opt.id)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition-all ${
                          orderType === opt.id
                            ? "bg-gradient-to-br from-flame to-ember text-coal"
                            : "text-sand hover:text-cream"
                        }`}
                      >
                        <opt.icon className="size-4.5" />
                        {opt.label}
                        <span
                          className={`text-[10px] font-bold ${
                            orderType === opt.id ? "text-coal/70" : "text-ash"
                          }`}
                        >
                          {opt.hint}
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <input
                      className="field"
                      placeholder="Your name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    <input
                      className="field"
                      placeholder="Phone — e.g. 0724 000 000"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {orderType === "delivery" && (
                      <textarea
                        className="field min-h-20 resize-none"
                        placeholder="Delivery location — estate, street, landmark…"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    )}
                    <textarea
                      className="field min-h-16 resize-none"
                      placeholder="Notes for the kitchen (optional) — e.g. extra spicy, no onions"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                    />
                  </div>

                  {/* payment */}
                  <div>
                    <p className="mb-2 text-xs font-extrabold tracking-widest text-ash uppercase">
                      Payment
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {(
                        [
                          { id: "mpesa", label: "M-Pesa", hint: "Till / Send money" },
                          { id: "cash", label: "Cash", hint: "Pay on delivery" },
                        ] as const
                      ).map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => setPayment(opt.id)}
                          className={`rounded-2xl border px-4 py-3 text-left transition-all ${
                            payment === opt.id
                              ? "border-ember/70 bg-ember/10"
                              : "border-line bg-soot/40 hover:border-sand/40"
                          }`}
                        >
                          <p className="text-sm font-extrabold text-cream">{opt.label}</p>
                          <p className="text-xs text-ash">{opt.hint}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  {error && (
                    <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
                      {error}
                    </p>
                  )}
                </div>

                <div className="border-t border-line bg-soot/40 px-5 py-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-ash">
                      <span>Subtotal</span>
                      <span className="font-bold text-cream">{ksh(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-ash">
                      <span>{orderType === "delivery" ? "Delivery" : "Pickup"}</span>
                      <span className="font-bold text-cream">
                        {deliveryFee === 0 ? "Free" : ksh(deliveryFee)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-line pt-2 text-base">
                      <span className="font-extrabold">Total</span>
                      <span className="font-display text-2xl text-flame">{ksh(total)}</span>
                    </div>
                  </div>
                  <button
                    onClick={placeOrder}
                    disabled={submitting}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-flame via-ember to-blood py-3.5 text-sm font-extrabold tracking-widest text-coal uppercase transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 className="size-4.5 animate-spin" /> Sending to the kitchen…
                      </>
                    ) : (
                      <>Place order · {ksh(total)}</>
                    )}
                  </button>
                </div>
              </>
            )}

            {/* ── SUCCESS STEP ──────────────────────────── */}
            {step === "success" && (
              <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
                <motion.div
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", damping: 12 }}
                  className="grid size-20 place-items-center rounded-full bg-gradient-to-br from-flame to-ember text-coal glow-ember"
                >
                  <CheckCircle2 className="size-10" strokeWidth={2.4} />
                </motion.div>
                <h4 className="mt-6 font-display text-4xl tracking-[0.05em]">
                  ORDER ON THE FIRE
                </h4>
                <p className="mt-2 text-sm text-ash">
                  Keep this code — you&apos;ll need it to track your order.
                </p>
                <div className="mt-5 w-full rounded-2xl border border-dashed border-ember/50 bg-ember/10 px-6 py-4">
                  <p className="text-[10px] font-extrabold tracking-[0.3em] text-flame uppercase">
                    Order code
                  </p>
                  <p className="mt-1 font-display text-4xl tracking-[0.2em] text-cream">
                    {orderCode}
                  </p>
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ash">
                  We&apos;ll confirm your order by phone shortly.{" "}
                  {payment === "mpesa"
                    ? "Have your M-Pesa ready — we'll share the till details when we confirm."
                    : "Payment is collected on delivery / pickup."}
                </p>

                <div className="mt-7 flex w-full flex-col gap-2.5">
                  <a
                    href={`tel:${RESTAURANT.phoneIntl}`}
                    className="flex items-center justify-center gap-2 rounded-full border border-ember/60 bg-ember/10 py-3.5 text-sm font-extrabold tracking-widest text-flame uppercase transition-colors hover:bg-ember hover:text-coal"
                  >
                    <Phone className="size-4.5" /> Call {RESTAURANT.phone}
                  </a>
                  <button
                    onClick={() => {
                      setStep("cart");
                      closeCart();
                    }}
                    className="rounded-full border border-line py-3.5 text-sm font-extrabold tracking-widest text-sand uppercase transition-colors hover:text-cream"
                  >
                    Back to the menu
                  </button>
                </div>
              </div>
            )}

            {/* footer brand strip */}
            <div className="flex items-center justify-center gap-2 border-t border-line py-3">
              <Flame className="size-3.5 text-ember" />
              <span className="text-[10px] font-extrabold tracking-[0.3em] text-ash uppercase">
                Rib House · Best Quality Grilled Meat
              </span>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
