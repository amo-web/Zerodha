import { NextResponse } from "next/server";
import { readStore } from "@/lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const store = await readStore();
  return NextResponse.json({
    hasCredentials: Boolean(store.apiKey && store.apiSecret),
    isAuthenticated: Boolean(store.accessToken),
    userId: store.userId || null,
    lastAuthenticatedAt: store.lastAuthenticatedAt || null,
  });
}
