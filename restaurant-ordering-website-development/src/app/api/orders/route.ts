import { NextResponse } from "next/server";
import { z } from "zod";
import crypto from "node:crypto";
import { db } from "@/db";
import { orderItems, orders } from "@/db/schema";
import { priceLookup } from "@/lib/menu-service";
import { DELIVERY_FEE } from "@/lib/menu-data";

const PHONE_RE = /^(\+?254|0)(7|1)\d{8}$/;

const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Name is too short").max(80),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s-]/g, ""))
    .refine((v) => PHONE_RE.test(v), "Enter a valid Kenyan phone number"),
  orderType: z.enum(["delivery", "pickup"]),
  address: z.string().trim().max(300).optional().default(""),
  notes: z.string().trim().max(300).optional().default(""),
  paymentMethod: z.enum(["mpesa", "cash"]),
  items: z
    .array(
      z.object({
        slug: z.string().min(1).max(80),
        qty: z.number().int().min(1).max(99),
        kg: z.number().min(0.25).max(10).optional(),
      }),
    )
    .min(1, "Cart is empty")
    .max(60),
});

function makeCode(): string {
  const rand = crypto.randomBytes(3).toString("hex").toUpperCase(); // 6 chars
  return `RH-${rand.slice(0, 3)}${rand.slice(3)}`;
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid request body" }, { status: 400 });
  }

  const parsed = createOrderSchema.safeParse(body);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      { ok: false, error: first?.message ?? "Invalid order" },
      { status: 400 },
    );
  }

  const data = parsed.data;

  if (data.orderType === "delivery" && data.address.length < 4) {
    return NextResponse.json(
      { ok: false, error: "Please tell us where to deliver" },
      { status: 400 },
    );
  }

  // Server-side pricing — never trust client totals.
  const slugs = data.items.map((i) => i.slug);
  const rows = await priceLookup(slugs);

  const lines: { menuItemId: number; name: string; price: number; qty: number }[] = [];
  for (let i = 0; i < data.items.length; i++) {
    const row = rows[i];
    const reqItem = data.items[i];
    if (!row) {
      return NextResponse.json(
        { ok: false, error: `Unknown item "${reqItem.slug}"` },
        { status: 400 },
      );
    }

    // Kg-editable handling: if kg is provided, calculate price based on per-kg base
    if (reqItem.kg != null) {
      const side = (row.side ?? "").toUpperCase();
      const isPerKg = side === "1 KG";
      // allow only 1 KG base items for kg scaling
      if (!isPerKg) {
        return NextResponse.json(
          { ok: false, error: `Kg amount not allowed for "${reqItem.slug}"` },
          { status: 400 },
        );
      }
      // validate kg increments to 0.05 precision to avoid floating abuse
      const kg = Math.round(reqItem.kg * 100) / 100;
      if (Math.abs(kg - reqItem.kg) > 0.001) {
        return NextResponse.json(
          { ok: false, error: "Kg must be at most 2 decimal places" },
          { status: 400 },
        );
      }
      // enforce 0.25kg steps (0.25, 0.5, 0.75, 1.0 ... ) - allow any 0.25 multiple
      const isQuarter = Math.abs(kg * 4 - Math.round(kg * 4)) < 0.001;
      if (!isQuarter) {
        return NextResponse.json(
          { ok: false, error: "Kg must be in 0.25 kg increments" },
          { status: 400 },
        );
      }
      const unitPrice = Math.round(row.price * kg);
      const sideLabel = kg % 1 === 0 ? `${kg} KG` : `${kg} KG`;
      lines.push({
        menuItemId: row.id,
        name: `${row.name} — ${sideLabel}`,
        price: unitPrice,
        qty: reqItem.qty,
      });
    } else {
      lines.push({
        menuItemId: row.id,
        name: row.side ? `${row.name} — ${row.side}` : row.name,
        price: row.price,
        qty: reqItem.qty,
      });
    }
  }

  const subtotal = lines.reduce((n, l) => n + l.price * l.qty, 0);
  const deliveryFee = data.orderType === "delivery" ? DELIVERY_FEE : 0;
  const total = subtotal + deliveryFee;

  // Retry a few times in the unlikely case of a code collision.
  for (let attempt = 0; attempt < 4; attempt++) {
    const code = makeCode();
    try {
      const created = await db.transaction(async (tx) => {
        const [order] = await tx
          .insert(orders)
          .values({
            code,
            customerName: data.customerName,
            phone: data.phone,
            orderType: data.orderType,
            address: data.orderType === "delivery" ? data.address : null,
            notes: data.notes || null,
            paymentMethod: data.paymentMethod,
            subtotal,
            deliveryFee,
            total,
            status: "pending",
          })
          .returning();

        await tx.insert(orderItems).values(
          lines.map((l) => ({
            orderId: order.id,
            menuItemId: l.menuItemId,
            name: l.name,
            price: l.price,
            qty: l.qty,
          })),
        );
        return order;
      });

      return NextResponse.json({
        ok: true,
        code: created.code,
        total: created.total,
        id: created.id,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "";
      if (msg.includes("orders_code_unique") || msg.includes("duplicate key")) continue;
      console.error("order create failed", err);
      return NextResponse.json(
        { ok: false, error: "Could not place the order. Please call us instead." },
        { status: 500 },
      );
    }
  }

  return NextResponse.json(
    { ok: false, error: "Could not place the order. Please try again." },
    { status: 500 },
  );
}
