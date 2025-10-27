import { NextResponse } from "next/server";
import { getLoginUrl } from "@/lib/kite";
import { hasCredentials } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  try {
    const ready = await hasCredentials();
    if (!ready) return NextResponse.json({ error: "Credentials not set" }, { status: 400 });
    const url = await getLoginUrl();
    return NextResponse.json({ url });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to get login URL" }, { status: 500 });
  }
}
