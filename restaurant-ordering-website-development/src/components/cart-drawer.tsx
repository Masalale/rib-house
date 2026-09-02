"use client";

import { useEffect, useMemo, useState } from "react";
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

function buildWhatsAppUrl(opts: {
  name: string;
  phone: string;
  orderType: "delivery" | "pickup";
  address: string;
  notes: string;
  payment: "mpesa" | "cash";
  total: number;
  lines: { name: string; side: string | null; price: number; qty: number }[];
}): string {
  const lines = opts.lines
    .map((l, i) => {
      const side = l.side ? ` (${l.side})` : "";
      return `${i + 1}. ${l.qty}× ${l.name}${side}: ${ksh(l.price * l.qty)}`;
    })
    .join("\n");
  const message = [
    `Hello Rib House, I'd like to place an order:`,
    ``,
    `*Name:* ${opts.name}`,
    `*Phone:* ${opts.phone}`,
    `*Type:* ${opts.orderType === "delivery" ? `Delivery${opts.address ? ` (${opts.address})` : ""}` : "Pickup"}`,
    `*Payment:* ${opts.payment === "mpesa" ? "M-Pesa" : "Cash"}`,
    opts.notes ? `*Notes:* ${opts.notes}` : ``,
    ``,
    `*Order:*`,
    lines,
    ``,
    `*Total:* ${ksh(opts.total)}`,
  ]
    .filter(Boolean)
    .join("\n");
  // wa.me requires only digits, no '+'
  const num = RESTAURANT.phoneIntl.replace(/\D/g, "");
  return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
}

export function CartDrawer() {
  const { lines, subtotal, isOpen, closeCart, setQty, remove, clear } = useCart();
  const [step, setStep] = useState<Step>("cart");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [orderType, setOrderType] = useState<"delivery" | "pickup">("delivery");
  const [address, setAddress] = useState("");
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<"mpesa" | "cash">("mpesa");

  const deliveryFee = 0;
  const total = subtotal;

  const [validationError, setValidationError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (!isOpen && step !== "success") {
      setTimeout(() => setStep("cart"), 250);
    }
  }, [isOpen, step]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const checkoutValid = useMemo(() => {
    if (name.trim().length < 2) return "Please tell us your name.";
    if (phone.replace(/\D/g, "").length < 9) return "Please enter a valid phone number.";
    if (orderType === "delivery" && address.trim().length < 4)
      return "Please tell us where to deliver.";
    return null;
  }, [name, phone, orderType, address]);

  function sendToWhatsApp() {
    setValidationError(null);
    const err = checkoutValid;
    if (err) {
      setValidationError(err);
      return;
    }
    if (lines.length === 0) {
      setValidationError("Your cart is empty.");
      return;
    }
    setSending(true);
    const url = buildWhatsAppUrl({
      name: name.trim(),
      phone: phone.trim(),
      orderType,
      address: address.trim(),
      notes: notes.trim(),
      payment,
      total,
      lines,
    });
    // open in a new tab so the page stays put
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    setStep("success");
    setSending(false);
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
                  {step === "success" && "ORDER SENT"}
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
                            exit={{ opacity: 0 }}
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
                                className="text-ash hover:text-cream cursor-pointer"
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
                    <button
                      onClick={() => setStep("checkout")}
                      className="w-full rounded-full bg-gradient-to-br from-flame via-ember to-blood py-3.5 text-sm font-extrabold tracking-widest text-black uppercase transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
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
                        { id: "delivery", label: "Delivery", icon: Bike },
                        { id: "pickup", label: "Pickup", icon: Store },
                      ] as const
                    ).map((opt) => (
                      <button
                        key={opt.id}
                        onClick={() => setOrderType(opt.id)}
                        className={`flex items-center justify-center gap-2 rounded-xl px-3 py-3 text-sm font-extrabold transition-all cursor-pointer ${
                          orderType === opt.id
                            ? "bg-gradient-to-br from-flame to-ember text-black"
                            : "text-sand hover:text-cream"
                        }`}
                      >
                        <opt.icon className="size-4.5" />
                        {opt.label}
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
                      placeholder="Phone (e.g. 0724 000 000)"
                      inputMode="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                    {orderType === "delivery" && (
                      <textarea
                        className="field min-h-20 resize-none"
                        placeholder="Delivery location (estate, street, landmark…)"
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    )}
                    <textarea
                      className="field min-h-16 resize-none"
                      placeholder="Notes for the kitchen (optional, e.g. extra spicy, no onions)"
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
                          { id: "mpesa", label: "M-Pesa", hint: "We'll share till on confirm" },
                          { id: "cash", label: "Cash", hint: "Pay on delivery / pickup" },
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

                  {validationError && (
                    <p className="rounded-xl border border-danger/40 bg-danger/10 px-4 py-3 text-sm font-semibold text-danger">
                      {validationError}
                    </p>
                  )}
                </div>

                <div className="border-t border-line bg-soot/40 px-5 py-4">
                  <div className="flex items-center justify-between text-base">
                    <span className="font-extrabold text-cream">Total</span>
                    <span className="font-display text-2xl text-flame">{ksh(total)}</span>
                  </div>
                  <button
                    onClick={sendToWhatsApp}
                    disabled={sending}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-flame via-ember to-blood py-3.5 text-sm font-extrabold tracking-widest text-black uppercase transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60 cursor-pointer"
                  >
                    {sending ? (
                      <>
                        <Loader2 className="size-4.5 animate-spin" /> Opening WhatsApp…
                      </>
                    ) : (
                      <>Send order via WhatsApp · {ksh(total)}</>
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
                <p className="mt-2 max-w-sm text-sm text-ash">
                  We&apos;ve opened WhatsApp with your order ready to send. Hit send
                  and we&apos;ll confirm by phone in a minute or two.
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