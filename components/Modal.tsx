"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

const noopSubscribe = () => () => {};

/**
 * Trigger + sheet. The sheet is portaled to <body> so it is always laid out
 * against the viewport — a transformed ancestor (e.g. an animated card) can
 * no longer shrink it or trap clicks.
 */
export function Modal({
  trigger,
  title,
  children,
}: {
  trigger: (open: () => void) => React.ReactNode;
  title: string;
  children: (close: () => void) => React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const close = useCallback(() => setOpen(false), []);
  // false during SSR/hydration, true on the client — document.body exists only then
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  // Escape to close + lock background scroll while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <>
      {trigger(() => setOpen(true))}
      {mounted &&
        createPortal(
          <AnimatePresence>
            {open && (
              <div
                key="sheet"
                className="pointer-events-none fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-label={title}
              >
                <motion.div
                  className="pointer-events-auto absolute inset-0 bg-black/60"
                  onClick={close}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, pointerEvents: "none" }}
                  transition={{ duration: 0.2 }}
                />
                <motion.div
                  className="pointer-events-auto relative max-h-[90dvh] w-full overflow-y-auto rounded-t-[22px] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-[22px] sm:p-7"
                  style={{ background: "var(--card)", border: "1px solid var(--hairline)" }}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 24, pointerEvents: "none" }}
                  transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                >
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={close} className="icon-btn -mr-2" aria-label="Close">
                      <X size={20} />
                    </button>
                  </div>
                  {children(close)}
                </motion.div>
              </div>
            )}
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
