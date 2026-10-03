"use client";

import { useEffect, useOptimistic, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { updateProjectStatus } from "@/app/dashboard/actions";
import { toast } from "@/components/Toaster";
import { STATUS_ORDER, STATUS_META, type ProjectStatus } from "@/lib/types";

export function StatusChanger({
  projectId,
  status,
}: {
  projectId: string;
  status: ProjectStatus;
}) {
  const [open, setOpen] = useState(false);
  const [, start] = useTransition();
  // Badge flips immediately; the server's re-render confirms it a moment later.
  const [shown, setShown] = useOptimistic(status);
  const ref = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[shown];

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pick(s: ProjectStatus) {
    setOpen(false);
    if (s === shown) return;
    start(async () => {
      setShown(s);
      const res = await updateProjectStatus(projectId, s);
      if (res.ok) toast(`Marked ${STATUS_META[s].label}`);
      else toast(res.error, "error");
    });
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="pressable inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[13px] font-medium"
        style={{ background: meta.bg, color: meta.color }}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
        {meta.label}
        <ChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4, pointerEvents: "none" }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 z-30 mt-2 w-48 rounded-2xl p-1.5"
            style={{ background: "#2c2c2e", border: "1px solid var(--hairline-strong)" }}
            role="listbox"
          >
            {STATUS_ORDER.map((s) => {
              const m = STATUS_META[s];
              return (
                <button
                  key={s}
                  type="button"
                  role="option"
                  aria-selected={s === shown}
                  onClick={() => pick(s)}
                  className="pressable flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm hover:bg-white/10"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ background: m.dot }} />
                    {m.label}
                  </span>
                  {s === shown && <Check size={15} style={{ color: "var(--link)" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
