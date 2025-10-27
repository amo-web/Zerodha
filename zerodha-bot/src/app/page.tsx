"use client";
import React, { useMemo, useState } from "react";
import useSWR from "swr";
import { Card, CardTitle, CardSubtitle } from "@/app/components/Card";
import { Button } from "@/app/components/Button";
import { Input } from "@/app/components/Input";
import { Section } from "@/app/components/Section";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function Home() {
  const { data: session, mutate: mutateSession, isLoading: loadingSession } = useSWR("/api/session", fetcher);
  const { data: funds, mutate: mutateFunds } = useSWR(session?.isAuthenticated ? "/api/funds" : null, fetcher);

  const [apiKey, setApiKey] = useState("");
  const [apiSecret, setApiSecret] = useState("");
  const [saving, setSaving] = useState(false);
  const [ordering, setOrdering] = useState(false);

  const canLogin = useMemo(() => session?.hasCredentials, [session]);
  const isAuthed = useMemo(() => session?.isAuthenticated, [session]);

  async function saveCreds() {
    setSaving(true);
    try {
      const res = await fetch("/api/credentials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ apiKey, apiSecret }),
      });
      if (!res.ok) throw new Error("Failed to save credentials");
      await mutateSession();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  }

  async function startLogin() {
    const res = await fetch("/api/login");
    const data = await res.json();
    if (data?.url) {
      window.open(data.url, "_blank");
    }
  }

  async function handleCallback() {
    const requestToken = prompt("Paste the request_token from the URL after login");
    if (!requestToken) return;
    const res = await fetch(`/api/callback?request_token=${encodeURIComponent(requestToken)}`);
    if (res.ok) {
      await mutateSession();
      await mutateFunds();
    }
  }

  async function logout() {
    await fetch("/api/logout", { method: "POST" });
    await mutateSession();
  }

  async function placeOrder(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form.entries());
    const payload = {
      exchange: raw.exchange as string,
      tradingsymbol: raw.tradingsymbol as string,
      transaction_type: raw.transaction_type as "BUY" | "SELL",
      quantity: Number(raw.quantity as string),
      product: raw.product as "CNC" | "MIS" | "NRML" | "BO" | "CO",
      order_type: raw.order_type as "MARKET" | "LIMIT",
      price: raw.price ? Number(raw.price as string) : undefined,
    };
    setOrdering(true);
    try {
      const res = await fetch("/api/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to place order");
      alert(`Order placed: ${data.order_id}`);
    } catch (err: any) {
      alert(err?.message || "Failed to place order");
    } finally {
      setOrdering(false);
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10 dark:bg-black">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-100">Zerodha Auto Trader</h1>
            <p className="text-sm text-zinc-600 dark:text-zinc-400">Login, view balance, and place orders</p>
          </div>
          <div className="flex items-center gap-3">
            {isAuthed ? (
              <Button onClick={logout}>Logout</Button>
            ) : (
              <Button onClick={() => { startLogin(); }}>Login to Kite</Button>
            )}
            <Button onClick={() => window.open("https://kite.trade/apps", "_blank")}>Get API Keys</Button>
          </div>
        </header>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card className="md:col-span-2">
            <CardTitle>Credentials</CardTitle>
            <CardSubtitle>Store your API key and secret locally (file-based)</CardSubtitle>
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Input placeholder="API Key" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
              <Input placeholder="API Secret" value={apiSecret} onChange={(e) => setApiSecret(e.target.value)} />
            </div>
            <div className="mt-4">
              <Button disabled={saving} onClick={saveCreds}>{saving ? "Saving..." : "Save Credentials"}</Button>
            </div>
            <p className="mt-2 text-xs text-zinc-500">Saved to server-side file. Never commit secrets.</p>
          </Card>

          <Card>
            <CardTitle>Status</CardTitle>
            <CardSubtitle>Current authentication state</CardSubtitle>
            <div className="mt-4 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center justify-between"><span>Has credentials</span><span>{canLogin ? "Yes" : "No"}</span></div>
              <div className="flex items-center justify-between"><span>Authenticated</span><span>{isAuthed ? "Yes" : "No"}</span></div>
              <div className="flex items-center justify-between"><span>User</span><span>{session?.userId ?? "-"}</span></div>
              <div className="flex items-center justify-between"><span>Last auth</span><span>{session?.lastAuthenticatedAt ? new Date(session.lastAuthenticatedAt).toLocaleString() : "-"}</span></div>
            </div>
            {!isAuthed && canLogin && (
              <div className="mt-4 flex gap-3">
                <Button onClick={startLogin}>Open Login</Button>
                <Button onClick={handleCallback}>Submit request_token</Button>
              </div>
            )}
          </Card>
        </div>

        <Section title="Funds">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Card>
              <CardTitle>Net</CardTitle>
              <div className="mt-3 text-2xl font-semibold">{funds ? funds.net : "-"}</div>
            </Card>
            <Card>
              <CardTitle>Available</CardTitle>
              <div className="mt-3 text-2xl font-semibold text-emerald-600">{funds ? funds.available : "-"}</div>
            </Card>
            <Card>
              <CardTitle>Utilised</CardTitle>
              <div className="mt-3 text-2xl font-semibold text-rose-600">{funds ? funds.utilised : "-"}</div>
            </Card>
          </div>
        </Section>

        <Section title="Place Order">
          <Card>
            <form className="grid grid-cols-1 gap-4 md:grid-cols-6" onSubmit={placeOrder}>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500">Exchange</label>
                <select name="exchange" className="w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <option value="NSE">NSE</option>
                  <option value="BSE">BSE</option>
                  <option value="NFO">NFO</option>
                  <option value="BFO">BFO</option>
                  <option value="MCX">MCX</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500">Tradingsymbol</label>
                <Input name="tradingsymbol" placeholder="e.g., TCS" required />
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Side</label>
                <select name="transaction_type" className="w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <option value="BUY">BUY</option>
                  <option value="SELL">SELL</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-xs text-zinc-500">Qty</label>
                <Input name="quantity" type="number" min={1} defaultValue={1} required />
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500">Product</label>
                <select name="product" className="w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <option value="CNC">CNC</option>
                  <option value="MIS">MIS</option>
                  <option value="NRML">NRML</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500">Order Type</label>
                <select name="order_type" className="w-full rounded-xl border border-zinc-200 bg-white/70 px-3 py-2 text-sm dark:border-zinc-800 dark:bg-zinc-900">
                  <option value="MARKET">MARKET</option>
                  <option value="LIMIT">LIMIT</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="mb-1 block text-xs text-zinc-500">Price (for LIMIT)</label>
                <Input name="price" type="number" step="0.05" min={0} />
              </div>
              <div className="md:col-span-6">
                <Button type="submit" disabled={!isAuthed || ordering}>{ordering ? "Placing..." : "Place Order"}</Button>
              </div>
            </form>
          </Card>
        </Section>

        <footer className="mt-10 text-center text-xs text-zinc-500">
          Built with Next.js + Tailwind. Keys stored server-side in file.
        </footer>
      </div>
    </div>
  );
}
