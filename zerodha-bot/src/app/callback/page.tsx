"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function CallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [message, setMessage] = useState("Processing login...");

  useEffect(() => {
    const token = searchParams.get("request_token");
    if (!token) {
      setMessage("Missing request_token in URL.");
      return;
    }
    (async () => {
      try {
        const res = await fetch(`/api/callback?request_token=${encodeURIComponent(token)}`);
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data?.error || "Failed to exchange token");
        }
        setMessage("Login successful. Redirecting...");
        setTimeout(() => router.replace("/"), 800);
      } catch (err: any) {
        setMessage(err?.message || "Something went wrong.");
      }
    })();
  }, [router, searchParams]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-4 dark:bg-black">
      <div className="rounded-2xl border border-zinc-200/60 bg-white/70 p-8 text-center text-zinc-900 shadow-sm backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/60 dark:text-zinc-100">
        <h1 className="mb-2 text-xl font-semibold">Kite Connect</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400">{message}</p>
      </div>
    </div>
  );
}
