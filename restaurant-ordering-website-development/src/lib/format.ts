export function ksh(amount: number): string {
  return `Ksh ${amount.toLocaleString("en-KE")}`;
}

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const STATUS_META: Record<
  OrderStatus,
  { label: string; step: number; tone: string }
> = {
  pending: { label: "Order Received", step: 0, tone: "#FFB03A" },
  confirmed: { label: "Confirmed", step: 1, tone: "#FFB03A" },
  preparing: { label: "On the Fire", step: 2, tone: "#FF5A1F" },
  on_the_way: { label: "On the Way", step: 3, tone: "#FF5A1F" },
  delivered: { label: "Delivered", step: 4, tone: "#6FCF97" },
  cancelled: { label: "Cancelled", step: -1, tone: "#E5484D" },
};

export const FLOW_STEPS: OrderStatus[] = [
  "confirmed",
  "preparing",
  "on_the_way",
  "delivered",
];

export function formatTime(d: Date | string): string {
  const date = typeof d === "string" ? new Date(d) : d;
  return date.toLocaleString("en-KE", {
    day: "numeric",
    month: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}
