"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, AlertCircle } from "lucide-react";

type Toast = { id: number; message: string; tone: "success" | "error" };

const EVENT = "pm:toast";

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
      const t = { id: ++id, message, tone };
      setItems((list) => [...list.slice(-2), t]);
      setTimeout(() => setItems((list) => list.filter((x) => x.id !== t.id)), 2600);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div
      className="pointer-events-none fixed inset-x-0 top-[60px] z-[60] flex flex-col items-center gap-2 px-4"
      aria-live="polite"
    >
      <AnimatePresence initial={false}>
        {items.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
            className="glass flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium"
            style={{ border: "1px solid var(--hairline-strong)" }}
          >
            {t.tone === "success" ? (
              <CheckCircle2 size={17} style={{ color: "var(--green)" }} />
            ) : (
              <AlertCircle size={17} style={{ color: "var(--red)" }} />
            )}
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
