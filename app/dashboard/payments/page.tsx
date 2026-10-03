import type { Metadata } from "next";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { getProjectsWithStats, getRecentPayments, toPaymentOption } from "@/lib/queries";
import { deletePayment } from "@/app/dashboard/actions";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PaymentEditor } from "@/components/PaymentEditor";
import { PageHeader } from "@/components/PageHeader";
import { StatCard } from "@/components/StatCard";
import { formatMoney, formatDate, joinMoney, sumByCurrency } from "@/lib/format";

export const metadata: Metadata = { title: "Payments" };

const zeroINR = [{ currency: "INR", value: 0 }];

export default async function PaymentsPage() {
  const [payments, projects] = await Promise.all([getRecentPayments(500), getProjectsWithStats()]);

  const now = new Date();
  const thisMonth = sumByCurrency(
    payments.filter((p) => {
      const d = new Date(p.paid_on);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }),
    (p) => p.amount,
    (p) => p.currency
  );
  const allTime = sumByCurrency(payments, (p) => p.amount, (p) => p.currency);

  const groups = new Map<string, typeof payments>();
  for (const p of payments) {
    const key = new Date(p.paid_on).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    groups.set(key, [...(groups.get(key) ?? []), p]);
  }

  return (
    <div>
      <PageHeader title="Payments" subtitle="Every payment that's landed, in one ledger.">
        <PaymentEditor
          projects={projects.filter((p) => p.status !== "cancelled").map(toPaymentOption)}
          trigger={{ label: "Record payment", icon: "plus", variant: "primary" }}
        />
      </PageHeader>

      <div className="mb-10 grid grid-cols-2 gap-3 sm:gap-4">
        <StatCard label="This month" money={thisMonth.length ? thisMonth : zeroINR} tone="var(--green)" />
        <StatCard label="All time" money={allTime.length ? allTime : zeroINR} delay={1} />
      </div>

      {payments.length === 0 ? (
        <div className="card px-6 py-16 text-center text-secondary">No payments recorded yet.</div>
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([month, items]) => (
            <section key={month} className="fade-in fade-in-d2">
              <div className="mb-2 flex items-baseline justify-between gap-3 px-1">
                <h2 className="text-[17px] font-semibold">{month}</h2>
                <span className="tabular text-right text-sm font-medium" style={{ color: "var(--green)" }}>
                  {joinMoney(sumByCurrency(items, (p) => p.amount, (p) => p.currency))}
                </span>
              </div>
              <ul className="card divide-y overflow-hidden" style={{ borderColor: "var(--hairline)" }}>
                {items.map((p) => (
                  <li key={p.id} className="flex items-center gap-2 pr-3" style={{ borderColor: "var(--hairline)" }}>
                    <Link
                      href={`/dashboard/projects/${p.project_id}`}
                      className="pressable flex min-w-0 flex-1 items-center justify-between gap-3 py-3.5 pl-5 hover:bg-white/[0.03]"
                    >
                      <div className="min-w-0">
                        <div className="truncate text-sm font-medium">{p.project_title}</div>
                        <div className="truncate text-xs text-tertiary">
                          {formatDate(p.paid_on)}
                          {p.method ? ` · ${p.method}` : ""}
                          {p.notes ? ` · ${p.notes}` : ""}
                        </div>
                      </div>
                      <span className="tabular shrink-0 text-sm font-semibold" style={{ color: "var(--green)" }}>
                        +{formatMoney(p.amount, p.currency)}
                      </span>
                    </Link>
                    <form action={deletePayment}>
                      <input type="hidden" name="id" value={p.id} />
                      <ConfirmSubmit message="Delete this payment?" className="icon-btn hover:text-[var(--red)]" title="Delete payment">
                        <Trash2 size={16} />
                      </ConfirmSubmit>
                    </form>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
