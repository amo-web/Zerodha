import { NextResponse } from "next/server";
import { createKiteFromStore } from "@/lib/kite";
import { orderSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = orderSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid order payload" }, { status: 400 });
    }
    const { kite } = await createKiteFromStore();

    const params = {
      exchange: parsed.data.exchange,
      tradingsymbol: parsed.data.tradingsymbol,
      transaction_type: parsed.data.transaction_type,
      quantity: parsed.data.quantity,
      product: parsed.data.product,
      order_type: parsed.data.order_type,
      price: parsed.data.price ?? 0,
    };

    const order = await kite.placeOrder("regular", params);
    return NextResponse.json({ ok: true, order_id: order.order_id });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to place order" }, { status: 500 });
  }
}
