import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type {
  Manager,
  Payment,
  PaymentProjectOption,
  Project,
  ProjectWithStats,
} from "@/lib/types";

// Each query uses PostgREST embeds, so a project arrives with its source and
// payments in one request, and cache() dedupes repeat calls within a render.

type ProjectRow = Project & {
  manager: Manager | null;
  payments: Pick<Payment, "amount">[] | null;
};

function withStats(p: ProjectRow): ProjectWithStats {
  const { payments, manager, ...rest } = p;
  const paid = (payments ?? []).reduce((s, x) => s + Number(x.amount), 0);
  const booked = Number(p.booked_amount);
  return {
    ...rest,
    booked_amount: booked,
    manager: manager ?? null,
    paid,
    balance: booked - paid,
    payments_count: payments?.length ?? 0,
  };
}

export const getManagers = cache(async (): Promise<Manager[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("managers")
    .select("*")
    .order("created_at", { ascending: true });
  return (data ?? []) as Manager[];
});

export const getProjectsWithStats = cache(async (): Promise<ProjectWithStats[]> => {
  const supabase = await createClient();
  const { data } = await supabase
    .from("projects")
    .select("*, manager:managers(*), payments(amount)")
    .order("created_at", { ascending: false });
  return ((data ?? []) as ProjectRow[]).map(withStats);
});

export const getProjectDetail = cache(
  async (id: string): Promise<{ project: ProjectWithStats | null; payments: Payment[] }> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("projects")
      .select("*, manager:managers(*), payments(*)")
      .eq("id", id)
      .order("paid_on", { referencedTable: "payments", ascending: false })
      .maybeSingle();
    if (!data) return { project: null, payments: [] };

    const row = data as ProjectRow & { payments: Payment[] | null };
    return { project: withStats(row), payments: row.payments ?? [] };
  }
);

export const getRecentPayments = cache(
  async (limit = 12): Promise<(Payment & { project_title: string; currency: string })[]> => {
    const supabase = await createClient();
    const { data } = await supabase
      .from("payments")
      .select("*, project:projects(title, currency)")
      .order("paid_on", { ascending: false })
      .order("created_at", { ascending: false })
      .limit(limit);

    type Row = Payment & { project: { title: string; currency: string } | null };
    return ((data ?? []) as Row[]).map(({ project, ...p }) => ({
      ...p,
      amount: Number(p.amount),
      project_title: project?.title ?? "Unknown project",
      currency: project?.currency ?? "INR",
    }));
  }
);

/** Shape a project for the payment picker (plain data, safe to pass to client components). */
export function toPaymentOption(p: ProjectWithStats): PaymentProjectOption {
  return {
    id: p.id,
    title: p.title,
    currency: p.currency,
    balance: p.balance,
    booked: p.booked_amount,
    source: p.manager?.name ?? null,
  };
}
