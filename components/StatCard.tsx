import { formatMoney, type CurrencyAmount } from "@/lib/format";

/**
 * KPI tile. Static numbers with tabular digits — values update in place after a
 * save instead of re-counting from zero, so nothing flickers or shifts.
 */
export function StatCard({
  label,
  value,
  money,
  tone = "var(--text)",
  hint,
  delay = 0,
}: {
  label: string;
  value?: number;
  money?: CurrencyAmount[];
  tone?: string;
  hint?: string;
  delay?: 0 | 1 | 2 | 3;
}) {
  const list = money && money.length ? money : null;
  const primary = list
    ? formatMoney(list[0].value, list[0].currency)
    : (value ?? 0).toLocaleString("en-IN");
  const extra = list && list.length > 1 ? list.slice(1) : null;

  return (
    <div className={`card fade-in ${delay ? `fade-in-d${delay}` : ""} p-5 sm:p-6`}>
      <div className="text-[13px] font-medium text-secondary">{label}</div>
      <div
        className="display tabular mt-2 truncate text-[26px] font-semibold leading-tight sm:text-[30px]"
        style={{ color: tone }}
      >
        {primary}
      </div>
      <div className="mt-1 h-4 truncate text-xs text-tertiary tabular">
        {extra ? `+ ${extra.map((m) => formatMoney(m.value, m.currency)).join(" · ")}` : hint ?? ""}
      </div>
    </div>
  );
}
