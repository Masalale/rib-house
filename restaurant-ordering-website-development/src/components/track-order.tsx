"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  Bike,
  Check,
  ChefHat,
  ClipboardCheck,
  Loader2,
  PackageCheck,
  PackageSearch,
  Phone,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { RESTAURANT } from "@/lib/menu-data";
import { FLOW_STEPS, STATUS_META, formatTime, ksh, type OrderStatus } from "@/lib/format";

interface TrackedOrder {
  code: string;
  status: OrderStatus;
  orderType: string;
  customerName: string;
  subtotal: number;
  deliveryFee: number;
  total: number;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
}

const STEP_ICONS = [ClipboardCheck, ChefHat, Bike, PackageCheck] as const;
const STEP_LABELS: Record<string, string> = {
  confirmed: "Confirmed",
  preparing: "On the fire",
  on_the_way: "On the way",
  delivered: "Delivered",
};

export function TrackOrder({
  initialCode,
  initialPhone,
}: {
  initialCode: string;
  initialPhone: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [phone, setPhone] = useState(initialPhone);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastSync, setLastSync] = useState<Date | null>(null);
  const tried = useRef(false);

  const lookup = useCallback(
    async (c: string, p: string, silent = false) => {
      if (!c.trim() || !p.trim()) {
        setError("Enter your order code and phone number.");
        return;
      }
      if (!silent) setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/orders/track?code=${encodeURIComponent(c.trim())}&phone=${encodeURIComponent(p.trim())}`,
        );
        const data = (await res.json()) as { ok: boolean; order?: TrackedOrder; error?: string };
        if (!res.ok || !data.ok || !data.order) {
          if (!silent) {
            setOrder(null);
            setError(data.error ?? "Order not found.");
          }
          return;
        }
        setOrder(data.order);
        setLastSync(new Date());
      } catch {
        if (!silent) setError("Network hiccup — please try again.");
      } finally {
        if (!silent) setLoading(false);
      }
    },
    [],
  );

  // auto-lookup when arriving from checkout, then poll
  useEffect(() => {
    if (tried.current) return;
    tried.current = true;
    if (initialCode && initialPhone) lookup(initialCode, initialPhone);
  }, [initialCode, initialPhone, lookup]);

  useEffect(() => {
    if (!order) return;
    if (order.status === "delivered" || order.status === "cancelled") return;
    const t = setInterval(() => lookup(code, phone, true), 20000);
    return () => clearInterval(t);
  }, [order, code, phone, lookup]);

  const meta = order ? STATUS_META[order.status] : null;
  const isPickup = order?.orderType === "pickup";

  return (
    <div className="relative mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <div className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-ember/10 blur-[110px]" />

      <div className="relative text-center">
        <p className="text-[11px] font-extrabold tracking-[0.35em] text-flame uppercase">
          Order tracking
        </p>
        <h1 className="mt-3 font-display text-5xl leading-none tracking-[0.03em] sm:text-6xl">
          WHERE&apos;S MY <span className="ember-gradient-text">ORDER?</span>
        </h1>
        <p className="mx-auto mt-3 max-w-md text-sm text-ash">
          Enter the order code from checkout plus the phone number you ordered
          with — we&apos;ll show you exactly where things stand.
        </p>
      </div>

      {/* form */}
      <div className="relative mt-9 rounded-3xl border border-line bg-card/70 p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="field"
            placeholder="Order code — e.g. RH-AB12CD"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            onKeyDown={(e) => e.key === "Enter" && lookup(code, phone)}
          />
          <input
            className="field"
            placeholder="Phone — e.g. 0724 000 000"
            inputMode="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && lookup(code, phone)}
          />
          <button
            onClick={() => lookup(code, phone)}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-flame to-ember px-6 py-3 text-sm font-extrabold tracking-widest text-coal uppercase transition-transform hover:scale-[1.03] active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <PackageSearch className="size-4.5" />
            )}
            Track
          </button>
        </div>
        {error && <p className="mt-3 text-sm font-semibold text-danger">{error}</p>}
      </div>

      {/* result */}
      {order && meta && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="relative mt-8 rounded-3xl border border-line bg-card/70 p-6 sm:p-8"
        >
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="text-[10px] font-extrabold tracking-[0.3em] text-ash uppercase">
                Order
              </p>
              <p className="font-display text-3xl tracking-[0.15em] text-cream">{order.code}</p>
              <p className="mt-1 text-xs text-ash">
                Placed {formatTime(order.createdAt)} · {order.customerName} ·{" "}
                {isPickup ? "Pickup" : "Delivery"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="rounded-full px-4 py-1.5 text-xs font-extrabold tracking-widest uppercase"
                style={{ backgroundColor: `${meta.tone}22`, color: meta.tone }}
              >
                {order.status === "on_the_way" && isPickup ? "Ready for pickup" : meta.label}
              </span>
              <button
                onClick={() => lookup(code, phone)}
                className="grid size-9 place-items-center rounded-full border border-line text-ash transition-colors hover:text-cream"
                aria-label="Refresh"
              >
                <RefreshCw className="size-4" />
              </button>
            </div>
          </div>

          {/* timeline */}
          {order.status === "cancelled" ? (
            <div className="mt-8 flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger/10 p-5">
              <XCircle className="size-8 shrink-0 text-danger" />
              <div>
                <p className="font-bold text-cream">This order was cancelled.</p>
                <p className="text-sm text-ash">
                  Think that&apos;s a mistake? Call us on {RESTAURANT.phone}.
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-9">
              <div className="flex items-center">
                {FLOW_STEPS.map((step, i) => {
                  const Icon = STEP_ICONS[i];
                  const stepIndex = STATUS_META[step].step;
                  const current = meta.step;
                  // for pickup orders, "on_the_way" means ready for pickup
                  const done = current > stepIndex;
                  const active = current === stepIndex || (current === 0 && stepIndex === 1);
                  return (
                    <div key={step} className="flex flex-1 items-center last:flex-none">
                      <div className="flex flex-col items-center gap-2">
                        <motion.span
                          animate={
                            active
                              ? { scale: [1, 1.12, 1], transition: { repeat: Infinity, duration: 1.6 } }
                              : {}
                          }
                          className={`grid size-11 place-items-center rounded-full border-2 transition-colors ${
                            done || active
                              ? "border-ember bg-gradient-to-br from-flame to-ember text-coal"
                              : "border-line bg-soot text-ash"
                          }`}
                        >
                          {done ? <Check className="size-5" strokeWidth={3} /> : <Icon className="size-5" />}
                        </motion.span>
                        <span
                          className={`text-center text-[10px] font-extrabold tracking-wider uppercase sm:text-[11px] ${
                            done || active ? "text-flame" : "text-ash"
                          }`}
                        >
                          {step === "on_the_way" && isPickup ? "Ready" : STEP_LABELS[step]}
                        </span>
                      </div>
                      {i < FLOW_STEPS.length - 1 && (
                        <div className="mx-2 mb-5 h-0.5 flex-1 overflow-hidden rounded bg-line">
                          <div
                            className="h-full bg-gradient-to-r from-flame to-ember transition-all duration-700"
                            style={{ width: current > stepIndex ? "100%" : "0%" }}
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <p className="mt-5 text-center text-xs text-ash">
                {order.status === "pending" &&
                  "We've got your order — confirming it with the kitchen now."}
                {order.status === "confirmed" &&
                  "Confirmed! Your food is queued for the grill."}
                {order.status === "preparing" &&
                  "It's on the fire — fresh off charcoal soon."}
                {order.status === "on_the_way" &&
                  (isPickup
                    ? "Your order is packed and ready — come through!"
                    : "The rider is on the way. Keep your phone close.")}
                {order.status === "delivered" &&
                  "Delivered. Karibu tena — come back hungry! "}
                {lastSync && (
                  <span className="ml-1 opacity-60">
                    · Updated {lastSync.toLocaleTimeString("en-KE", { hour: "numeric", minute: "2-digit" })}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* items */}
          <div className="mt-8 rounded-2xl border border-line bg-soot/40 p-4 sm:p-5">
            <p className="mb-3 text-[10px] font-extrabold tracking-[0.3em] text-ash uppercase">
              Your order
            </p>
            <ul className="space-y-2">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-baseline text-sm">
                  <span className="font-bold text-cream">
                    {item.qty}× {item.name}
                  </span>
                  <span className="dots-leader" />
                  <span className="font-bold text-sand">{ksh(item.price * item.qty)}</span>
                </li>
              ))}
            </ul>
            <div className="mt-3 space-y-1 border-t border-line pt-3 text-sm">
              <div className="flex justify-between text-ash">
                <span>Subtotal</span>
                <span>{ksh(order.subtotal)}</span>
              </div>
              <div className="flex justify-between text-ash">
                <span>Delivery</span>
                <span>{order.deliveryFee === 0 ? "Free" : ksh(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between pt-1 text-base">
                <span className="font-extrabold">Total</span>
                <span className="font-display text-2xl text-flame">{ksh(order.total)}</span>
              </div>
            </div>
          </div>

          <a
            href={`tel:${RESTAURANT.phoneIntl}`}
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold text-ash transition-colors hover:text-flame"
          >
            <Phone className="size-3.5" /> Need to change something? Call {RESTAURANT.phone}
          </a>
        </motion.div>
      )}
    </div>
  );
}
