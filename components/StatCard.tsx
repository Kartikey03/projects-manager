"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import {
  currencySymbol,
  formatMoney,
  localeForCurrency,
  type CurrencyAmount,
} from "@/lib/format";

export function StatCard({
  label,
  value,
  money,
  prefix = "",
  tone = "var(--text)",
  index = 0,
  hint,
}: {
  label: string;
  /** plain-number mode (e.g. a count) */
  value?: number;
  /** money mode: one total per currency, largest first */
  money?: CurrencyAmount[];
  prefix?: string;
  tone?: string;
  index?: number;
  hint?: string;
}) {
  const list = money && money.length ? money : null;
  const primary = list ? list[0] : null;
  const target = primary ? primary.value : value ?? 0;

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
      setDisplay(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target]);

  const sym = primary ? currencySymbol(primary.currency) : prefix;
  const locale = primary ? localeForCurrency(primary.currency) : "en-IN";

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
        {sym}
        {Math.round(display).toLocaleString(locale)}
      </div>
      {list && list.length > 1 ? (
        <div className="mt-1 truncate text-xs text-tertiary">
          + {list.slice(1).map((m) => formatMoney(m.value, m.currency)).join(" · ")}
        </div>
      ) : hint ? (
        <div className="mt-1 text-xs text-tertiary">{hint}</div>
      ) : null}
    </motion.div>
  );
}
