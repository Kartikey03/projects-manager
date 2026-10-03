import Link from "next/link";
import { ChevronRight } from "lucide-react";
import {
  getManagers,
  getProjectsWithStats,
  getRecentPayments,
  toPaymentOption,
} from "@/lib/queries";
import { StatCard } from "@/components/StatCard";
import { ProgressBar } from "@/components/StatusBadge";
import { ProjectEditor } from "@/components/ProjectEditor";
import { PaymentEditor } from "@/components/PaymentEditor";
import { PageHeader, SectionTitle } from "@/components/PageHeader";
import { formatMoney, formatDate, sumByCurrency } from "@/lib/format";

const zeroINR = [{ currency: "INR", value: 0 }];

export default async function OverviewPage() {
  const [projects, managers, recentPayments] = await Promise.all([
    getProjectsWithStats(),
    getManagers(),
    getRecentPayments(6),
  ]);

  const live = projects.filter((p) => p.status !== "cancelled");
  const booked = sumByCurrency(live, (p) => p.booked_amount, (p) => p.currency);
  const received = sumByCurrency(live, (p) => p.paid, (p) => p.currency);
  const outstanding = sumByCurrency(live, (p) => Math.max(0, p.balance), (p) => p.currency);
  const active = projects.filter((p) => p.status === "in_progress" || p.status === "review").length;

  const awaiting = live.filter((p) => p.balance > 0).sort((a, b) => b.balance - a.balance);
  const paymentOptions = live.map(toPaymentOption);

  return (
    <div>
      <PageHeader title="Overview" subtitle="Where your money and work stand.">
        <PaymentEditor
          projects={paymentOptions}
          trigger={{ label: "Record payment", icon: "plus", variant: "primary" }}
        />
        <ProjectEditor managers={managers} trigger={{ label: "New project", variant: "secondary" }} />
      </PageHeader>

      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard label="Booked" money={booked.length ? booked : zeroINR} />
        <StatCard label="Received" money={received.length ? received : zeroINR} tone="var(--green)" delay={1} />
        <StatCard
          label="Outstanding"
          money={outstanding.length ? outstanding : zeroINR}
          tone="var(--amber)"
          delay={2}
        />
        <StatCard label="Active projects" value={active} hint={`${projects.length} total`} delay={3} />
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-5 lg:gap-6">
        {/* Awaiting payment — tap a row to open, tap + to record a payment right here */}
        <section className="fade-in fade-in-d2 min-w-0 lg:col-span-3">
          <SectionTitle
            action={
              <Link href="/dashboard/projects" className="link pressable flex items-center text-sm">
                All projects <ChevronRight size={16} />
              </Link>
            }
          >
            Awaiting payment
          </SectionTitle>

          {awaiting.length === 0 ? (
            <div className="card px-6 py-12 text-center text-secondary">Nothing outstanding. You&apos;re all paid up.</div>
          ) : (
            <ul className="card divide-y overflow-hidden" style={{ borderColor: "var(--hairline)" }}>
              {awaiting.slice(0, 6).map((p) => {
                const pct = p.booked_amount > 0 ? (p.paid / p.booked_amount) * 100 : 0;
                return (
                  <li key={p.id} className="flex items-center gap-2 pr-3" style={{ borderColor: "var(--hairline)" }}>
                    <Link
                      href={`/dashboard/projects/${p.id}`}
                      className="pressable min-w-0 flex-1 py-4 pl-5 pr-2 hover:bg-white/[0.03]"
                    >
                      <div className="flex items-baseline justify-between gap-3">
                        <span className="truncate font-medium">{p.title}</span>
                        <span className="tabular shrink-0 font-semibold" style={{ color: "var(--amber)" }}>
                          {formatMoney(p.balance, p.currency)}
                        </span>
                      </div>
                      <div className="mt-0.5 flex justify-between gap-3 text-xs text-tertiary">
                        <span className="truncate">
                          {p.manager ? `via ${p.manager.name}` : "No source"}
                          {p.client_name ? ` · ${p.client_name}` : ""}
                        </span>
                        <span className="tabular shrink-0">of {formatMoney(p.booked_amount, p.currency)}</span>
                      </div>
                      <ProgressBar value={pct} className="mt-3" />
                    </Link>
                    <PaymentEditor
                      projects={[toPaymentOption(p)]}
                      projectId={p.id}
                      trigger={{
                        icon: "plus",
                        variant: "icon",
                        ariaLabel: `Record payment for ${p.title}`,
                        className: "shrink-0 text-[var(--link)]",
                      }}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="fade-in fade-in-d3 min-w-0 lg:col-span-2">
          <SectionTitle
            action={
              <Link href="/dashboard/payments" className="link pressable flex items-center text-sm">
                Ledger <ChevronRight size={16} />
              </Link>
            }
          >
            Recent payments
          </SectionTitle>
          {recentPayments.length === 0 ? (
            <div className="card px-6 py-12 text-center text-secondary">No payments recorded yet.</div>
          ) : (
            <ul className="card divide-y overflow-hidden" style={{ borderColor: "var(--hairline)" }}>
              {recentPayments.map((p) => (
                <li key={p.id} style={{ borderColor: "var(--hairline)" }}>
                  <Link
                    href={`/dashboard/projects/${p.project_id}`}
                    className="pressable flex items-center justify-between gap-3 px-5 py-3.5 hover:bg-white/[0.03]"
                  >
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">{p.project_title}</div>
                      <div className="text-xs text-tertiary">
                        {formatDate(p.paid_on)}
                        {p.method ? ` · ${p.method}` : ""}
                      </div>
                    </div>
                    <div className="tabular shrink-0 text-sm font-semibold" style={{ color: "var(--green)" }}>
                      +{formatMoney(p.amount, p.currency)}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
