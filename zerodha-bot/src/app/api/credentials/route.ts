import { NextResponse } from "next/server";
import { credentialsSchema } from "@/lib/validation";
import { setCredentials } from "@/lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = credentialsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid credentials payload" }, { status: 400 });
    }
    await setCredentials(parsed.data.apiKey, parsed.data.apiSecret);
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message || "Failed to save credentials" }, { status: 500 });
  }
}
