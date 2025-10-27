"use client";
import React from "react";

export function StatusPill({ status }: { status: "ok" | "warn" | "error" }) {
  const map = {
    ok: { text: "OK", cls: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300" },
    warn: { text: "Needs Action", cls: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300" },
    error: { text: "Error", cls: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300" },
  } as const;
  const { text, cls } = map[status];
  return <span className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${cls}`}>{text}</span>;
}
