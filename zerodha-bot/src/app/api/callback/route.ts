import { NextResponse } from "next/server";
import { exchangeRequestToken } from "@/lib/kite";

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const requestToken = url.searchParams.get("request_token");
    if (!requestToken) return NextResponse.json({ error: "Missing request_token" }, { status: 400 });
    const tokens = await exchangeRequestToken(requestToken);
    return NextResponse.json({ ok: true, ...tokens });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to exchange token" }, { status: 500 });
  }
}
