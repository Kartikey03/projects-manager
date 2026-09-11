import Link from "next/link";
import { Wallet, Trash2 } from "lucide-react";
import { getRecentPayments } from "@/lib/queries";
import { deletePayment } from "@/app/dashboard/actions";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { formatMoney, formatDate } from "@/lib/format";

export default async function PaymentsPage() {
  const payments = await getRecentPayments(500);

  const now = new Date();
  const thisMonth = payments
    .filter((p) => {
      const d = new Date(p.paid_on);
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    })
    .reduce((s, p) => s + p.amount, 0);
  const allTime = payments.reduce((s, p) => s + p.amount, 0);

  // group by "Month YYYY"
  const groups = new Map<string, typeof payments>();
  for (const p of payments) {
    const d = new Date(p.paid_on);
    const key = d.toLocaleDateString("en-IN", { month: "long", year: "numeric" });
    const arr = groups.get(key) ?? [];
    arr.push(p);
    groups.set(key, arr);
  }

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-6">
        <h1 className="text-3xl font-semibold tracking-tight">Payments</h1>
        <p className="mt-1 text-secondary">Every rupee that&apos;s landed, in one ledger.</p>
      </div>

      <div className="mb-8 grid grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="text-sm text-secondary">This month</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight" style={{ color: "var(--green)" }}>
            {formatMoney(thisMonth)}
          </div>
        </div>
        <div className="card p-5">
          <div className="text-sm text-secondary">All time</div>
          <div className="mt-2 text-3xl font-semibold tracking-tight">{formatMoney(allTime)}</div>
        </div>
      </div>

      {payments.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center" style={{ borderColor: "var(--border-strong)" }}>
          <p className="text-secondary">No payments recorded yet.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {[...groups.entries()].map(([month, items]) => {
            const monthTotal = items.reduce((s, p) => s + p.amount, 0);
            return (
              <section key={month}>
                <div className="mb-2 flex items-center justify-between px-1">
                  <h2 className="text-sm font-semibold text-secondary">{month}</h2>
                  <span className="text-sm font-medium" style={{ color: "var(--green)" }}>
                    {formatMoney(monthTotal)}
                  </span>
                </div>
                <div className="card divide-y p-2" style={{ borderColor: "var(--border)" }}>
                  {items.map((p) => (
                    <div key={p.id} className="flex items-center justify-between px-3 py-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <div
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full"
                          style={{ background: "rgba(48,209,88,0.14)", color: "var(--green)" }}
                        >
                          <Wallet size={16} />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/dashboard/projects/${p.project_id}`}
                            className="truncate text-sm font-medium transition hover:text-[var(--accent)]"
                          >
                            {p.project_title}
                          </Link>
                          <div className="text-xs text-tertiary">
                            {formatDate(p.paid_on)}
                            {p.method ? ` · ${p.method}` : ""}
                            {p.notes ? ` · ${p.notes}` : ""}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold" style={{ color: "var(--green)" }}>
                          +{formatMoney(p.amount)}
                        </span>
                        <form action={deletePayment}>
                          <input type="hidden" name="id" value={p.id} />
                          <input type="hidden" name="project_id" value={p.project_id} />
                          <ConfirmSubmit
                            message="Delete this payment?"
                            className="rounded-full p-1.5 text-tertiary transition hover:bg-[var(--border)] hover:text-[var(--red)]"
                          >
                            <Trash2 size={14} />
                          </ConfirmSubmit>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
