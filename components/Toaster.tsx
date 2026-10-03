"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "error"; leaving: boolean };

const EVENT = "pm:toast";
const SHOW_MS = 2400;
const EXIT_MS = 180;

/** Fire-and-forget notification, callable from any client component. */
export function toast(message: string, tone: Toast["tone"] = "success") {
  window.dispatchEvent(new CustomEvent(EVENT, { detail: { message, tone } }));
}

export function Toaster() {
  const [items, setItems] = useState<Toast[]>([]);

  useEffect(() => {
    let id = 0;
    const onToast = (e: Event) => {
      const { message, tone } = (e as CustomEvent).detail;
      const t: Toast = { id: ++id, message, tone, leaving: false };
      setItems((list) => [...list.slice(-2), t]);
      setTimeout(
        () => setItems((list) => list.map((x) => (x.id === t.id ? { ...x, leaving: true } : x))),
        SHOW_MS
      );
      setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), SHOW_MS + EXIT_MS);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[60px] z-[60] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      {items.map((t) => (
        <div
          key={t.id}
          className={`glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium ${
            t.leaving ? "anim-pop-out" : "anim-pop-in"
          }`}
          style={{ border: "1px solid var(--hairline-strong)" }}
        >
          {t.tone === "success" ? (
            <CheckCircle2 size={17} style={{ color: "var(--green)" }} />
          ) : (
            <AlertCircle size={17} style={{ color: "var(--red)" }} />
          )}
          {t.message}
        </div>
      ))}
    </div>
  );
}
