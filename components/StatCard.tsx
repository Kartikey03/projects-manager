"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";

export function StatCard({
  label,
  value,
  prefix = "",
  tone = "var(--text)",
  index = 0,
  hint,
}: {
  label: string;
  value: number;
  prefix?: string;
  tone?: string;
  index?: number;
  hint?: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 900;
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(value * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="card p-5"
    >
      <div className="text-sm text-secondary">{label}</div>
      <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: tone }}>
        {prefix}
        {Math.round(display).toLocaleString("en-IN")}
      </div>
      {hint && <div className="mt-1 text-xs text-tertiary">{hint}</div>}
    </motion.div>
  );
}
