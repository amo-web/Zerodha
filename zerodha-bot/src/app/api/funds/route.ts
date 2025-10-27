import { NextResponse } from "next/server";
import { createKiteFromStore } from "@/lib/kite";

export const runtime = "nodejs";

export async function GET() {
  try {
    const { kite } = await createKiteFromStore();
    const data = await kite.margins("equity");
    const net = data?.net || 0;
    const available = data?.available?.live_balance ?? 0;
    const utilised = data?.utilised?.debits ?? 0;
    return NextResponse.json({ net, available, utilised, raw: data });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to fetch funds" }, { status: 500 });
  }
}
