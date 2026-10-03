"use client";

import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const noopSubscribe = () => () => {};
const EXIT_MS = 180;

type Phase = "closed" | "open" | "closing";

/**
 * Trigger + sheet. The sheet is portaled to <body> so it is always laid out
 * against the viewport — a transformed ancestor can never shrink it or trap
 * clicks. Motion is plain CSS; while closing, the sheet is click-through.
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
  const [phase, setPhase] = useState<Phase>("closed");
  // false during SSR/hydration, true on the client — document.body exists only then
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);

  const open = useCallback(() => setPhase("open"), []);
  const close = useCallback(() => setPhase((p) => (p === "open" ? "closing" : p)), []);

  // finish the exit animation, then unmount
  useEffect(() => {
    if (phase !== "closing") return;
    const t = setTimeout(() => setPhase("closed"), EXIT_MS);
    return () => clearTimeout(t);
  }, [phase]);

  // Escape to close + lock background scroll while open
  useEffect(() => {
    if (phase !== "open") return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [phase, close]);

  const closing = phase === "closing";

  return (
    <>
      {trigger(open)}
      {mounted &&
        phase !== "closed" &&
        createPortal(
          <div
            className={`fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6 ${
              closing ? "pointer-events-none" : ""
            }`}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div
              className={`absolute inset-0 bg-black/60 ${closing ? "anim-overlay-out" : "anim-overlay-in"}`}
              onClick={close}
            />
            <div
              className={`relative max-h-[90dvh] w-full overflow-y-auto rounded-t-[22px] p-5 pb-[calc(1.25rem+env(safe-area-inset-bottom))] sm:max-w-lg sm:rounded-[22px] sm:p-7 ${
                closing ? "anim-sheet-out" : "anim-sheet-in"
              }`}
              style={{ background: "var(--card)", border: "1px solid var(--hairline)" }}
            >
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold">{title}</h2>
                <button type="button" onClick={close} className="icon-btn -mr-2" aria-label="Close">
                  <X size={20} />
                </button>
              </div>
              {children(close)}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}
