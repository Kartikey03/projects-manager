export function formatMoney(amount: number, currency = "INR") {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount || 0);
  } catch {
    return `${currency} ${Math.round(amount || 0).toLocaleString("en-IN")}`;
  }
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
