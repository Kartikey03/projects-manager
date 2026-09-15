export const CURRENCY_SYMBOL: Record<string, string> = {
  INR: "₹",
  USD: "$",
  EUR: "€",
  GBP: "£",
  AED: "AED ",
};

export function currencySymbol(code: string) {
  return CURRENCY_SYMBOL[code] ?? `${code} `;
}

// ₹ (INR) uses the Indian lakh/crore grouping; every other currency uses
// standard thousands grouping. Never mix currencies into a single sum.
export function localeForCurrency(currency: string) {
  return currency === "INR" ? "en-IN" : "en-US";
}

export function formatMoney(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat(localeForCurrency(currency), {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${currencySymbol(currency)}${Math.round(amount || 0).toLocaleString("en-US")}`;
  }
}

export type CurrencyAmount = { currency: string; value: number };

/** Sum a list of items into one total per currency, largest first, zeros dropped. */
export function sumByCurrency<T>(
  items: T[],
  amount: (t: T) => number,
  currency: (t: T) => string
): CurrencyAmount[] {
  const m = new Map<string, number>();
  for (const it of items) {
    const c = currency(it) || "INR";
    m.set(c, (m.get(c) ?? 0) + amount(it));
  }
  return [...m.entries()]
    .map(([cur, value]) => ({ currency: cur, value }))
    .filter((x) => Math.round(x.value) !== 0)
    .sort((a, b) => b.value - a.value);
}

/** "₹2,15,000 · $600" — each currency formatted on its own, joined. */
export function joinMoney(list: CurrencyAmount[]): string {
  if (!list.length) return formatMoney(0);
  return list.map((m) => formatMoney(m.value, m.currency)).join(" · ");
}

export function formatDate(value: string | null) {
  if (!value) return "—";
  const d = new Date(value);
  if (isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function relativeDeadline(value: string | null): {
  text: string;
  tone: "none" | "soon" | "over" | "ok";
} {
  if (!value) return { text: "No deadline", tone: "none" };
  const d = new Date(value);
  const now = new Date();
  const days = Math.ceil((d.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (days < 0) return { text: `${Math.abs(days)}d overdue`, tone: "over" };
  if (days === 0) return { text: "Due today", tone: "soon" };
  if (days <= 5) return { text: `${days}d left`, tone: "soon" };
  return { text: `${days}d left`, tone: "ok" };
}
