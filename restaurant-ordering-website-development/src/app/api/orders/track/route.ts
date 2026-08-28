import { NextResponse } from "next/server";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { eq } from "drizzle-orm";

const digits = (v: string) => v.replace(/\D/g, "").slice(-9);

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();
  const phone = (searchParams.get("phone") ?? "").trim();

  if (!code || !phone) {
    return NextResponse.json(
      { ok: false, error: "Order code and phone number are required" },
      { status: 400 },
    );
  }

  const [order] = await db.select().from(orders).where(eq(orders.code, code)).limit(1);

  if (!order || digits(order.phone) !== digits(phone)) {
    return NextResponse.json(
      { ok: false, error: "We couldn't find an order with that code and phone number." },
      { status: 404 },
    );
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, order.id));

  return NextResponse.json({
    ok: true,
    order: {
      code: order.code,
      status: order.status,
      orderType: order.orderType,
      customerName: order.customerName,
      subtotal: order.subtotal,
      deliveryFee: order.deliveryFee,
      total: order.total,
      createdAt: order.createdAt,
      items: items.map((i) => ({ name: i.name, qty: i.qty, price: i.price })),
    },
  });
}
