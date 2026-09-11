"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, Check } from "lucide-react";
import { updateProjectStatus } from "@/app/dashboard/actions";
import { STATUS_ORDER, STATUS_META, type ProjectStatus } from "@/lib/types";

export function StatusChanger({
  projectId,
  status,
}: {
  projectId: string;
  status: ProjectStatus;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const meta = STATUS_META[status];

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  async function pick(s: ProjectStatus) {
    setOpen(false);
    if (s === status) return;
    const fd = new FormData();
    fd.set("id", projectId);
    fd.set("status", s);
    await updateProjectStatus(fd);
    router.refresh();
  }

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition"
        style={{ background: meta.bg, color: meta.color }}
      >
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
        {meta.label}
        <ChevronDown size={14} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.16 }}
            className="card absolute left-0 z-20 mt-2 w-44 p-1.5"
            style={{ boxShadow: "var(--shadow-lg)" }}
          >
            {STATUS_ORDER.map((s) => {
              const m = STATUS_META[s];
              return (
                <button
                  key={s}
                  onClick={() => pick(s)}
                  className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition hover:bg-[var(--border)]"
                >
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ background: m.dot }} />
                    {m.label}
                  </span>
                  {s === status && <Check size={15} style={{ color: "var(--accent)" }} />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
