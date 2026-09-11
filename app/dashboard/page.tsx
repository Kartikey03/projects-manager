import Link from "next/link";
import { ArrowUpRight, Wallet } from "lucide-react";
import { getProjectsWithStats, getRecentPayments } from "@/lib/queries";
import { getManagers } from "@/lib/queries";
import { StatCard } from "@/components/StatCard";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";
import { ProjectEditor } from "@/components/ProjectEditor";
import { formatMoney, formatDate } from "@/lib/format";

export default async function OverviewPage() {
  const [projects, managers, recentPayments] = await Promise.all([
    getProjectsWithStats(),
    getManagers(),
    getRecentPayments(8),
  ]);

  const live = projects.filter((p) => p.status !== "cancelled");
  const totalBooked = live.reduce((s, p) => s + p.booked_amount, 0);
  const totalReceived = live.reduce((s, p) => s + p.paid, 0);
  const outstanding = live.reduce((s, p) => s + Math.max(0, p.balance), 0);
  const active = projects.filter(
    (p) => p.status === "in_progress" || p.status === "review"
  ).length;

  const needsAttention = live
    .filter((p) => p.balance > 0)
    .sort((a, b) => b.balance - a.balance)
    .slice(0, 5);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-8 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Overview</h1>
          <p className="mt-1 text-secondary">Here&apos;s where your money and work stand.</p>
        </div>
        <ProjectEditor
          managers={managers}
          trigger={{ label: "New project", icon: "plus", variant: "primary" }}
        />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total booked" value={totalBooked} prefix="₹" index={0} />
        <StatCard
          label="Received"
          value={totalReceived}
          prefix="₹"
          tone="var(--green)"
          index={1}
        />
        <StatCard
          label="Outstanding"
          value={outstanding}
          prefix="₹"
          tone="var(--amber)"
          index={2}
        />
        <StatCard
          label="Active projects"
          value={active}
          index={3}
          hint={`${projects.length} total`}
        />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-5">
        {/* Needs attention */}
        <section className="card min-w-0 p-5 sm:p-6 lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-semibold">Awaiting payment</h2>
            <Link
              href="/dashboard/projects"
              className="flex items-center gap-1 text-sm text-secondary transition hover:opacity-70"
            >
              All projects <ArrowUpRight size={15} />
            </Link>
          </div>

          {needsAttention.length === 0 ? (
            <Empty text="Nothing outstanding. You're all paid up. 🎉" />
          ) : (
            <div className="space-y-3">
              {needsAttention.map((p) => {
                const pct = p.booked_amount > 0 ? (p.paid / p.booked_amount) * 100 : 0;
                return (
                  <Link
                    key={p.id}
                    href={`/dashboard/projects/${p.id}`}
                    className="pressable block rounded-2xl border p-4 hover:shadow-[var(--shadow-md)] active:bg-[var(--border)]"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate font-medium">{p.title}</div>
                        <div className="mt-0.5 truncate text-xs text-secondary">
                          {p.manager ? `via ${p.manager.name}` : "No source"}
                          {p.client_name ? ` · ${p.client_name}` : ""}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="whitespace-nowrap font-semibold" style={{ color: "var(--amber)" }}>
                          {formatMoney(p.balance, p.currency)}
                        </div>
                        <div className="whitespace-nowrap text-xs text-tertiary">of {formatMoney(p.booked_amount, p.currency)}</div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <ProgressBar value={pct} />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>

        {/* Recent payments */}
        <section className="card min-w-0 p-5 sm:p-6 lg:col-span-2">
          <h2 className="mb-4 font-semibold">Recent payments</h2>
          {recentPayments.length === 0 ? (
            <Empty text="No payments recorded yet." />
          ) : (
            <div className="space-y-1">
              {recentPayments.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-xl px-2 py-2.5 transition hover:bg-[var(--border)]"
                >
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
                      style={{ background: "rgba(48,209,88,0.14)", color: "var(--green)" }}
                    >
                      <Wallet size={15} />
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.project_title}</div>
                      <div className="text-xs text-tertiary">{formatDate(p.paid_on)}</div>
                    </div>
                  </div>
                  <div className="shrink-0 whitespace-nowrap pl-2 text-sm font-semibold" style={{ color: "var(--green)" }}>
                    +{formatMoney(p.amount)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

function Empty({ text }: { text: string }) {
  return (
    <div className="flex items-center justify-center rounded-2xl border border-dashed py-10 text-center text-sm text-tertiary" style={{ borderColor: "var(--border-strong)" }}>
      {text}
    </div>
  );
}
