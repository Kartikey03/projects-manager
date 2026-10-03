import { createClient } from "@/lib/supabase/server";
import type {
  Manager,
  Payment,
  PaymentProjectOption,
  Project,
  ProjectWithStats,
} from "@/lib/types";

export async function getManagers(): Promise<Manager[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("managers")
    .select("*")
    .order("created_at", { ascending: true });
  return data ?? [];
}

export async function getProjectsWithStats(): Promise<ProjectWithStats[]> {
  const supabase = await createClient();

  const [{ data: projects }, { data: managers }, { data: payments }] =
    await Promise.all([
      supabase.from("projects").select("*").order("created_at", { ascending: false }),
      supabase.from("managers").select("*"),
      supabase.from("payments").select("*"),
    ]);

  const managerMap = new Map((managers ?? []).map((m) => [m.id, m as Manager]));
  const paidByProject = new Map<string, { sum: number; count: number }>();
  for (const p of (payments ?? []) as Payment[]) {
    const cur = paidByProject.get(p.project_id) ?? { sum: 0, count: 0 };
    cur.sum += Number(p.amount);
    cur.count += 1;
    paidByProject.set(p.project_id, cur);
  }

  return ((projects ?? []) as Project[]).map((p) => {
    const stats = paidByProject.get(p.id) ?? { sum: 0, count: 0 };
    const paid = stats.sum;
    return {
      ...p,
      booked_amount: Number(p.booked_amount),
      manager: p.manager_id ? managerMap.get(p.manager_id) ?? null : null,
      paid,
      balance: Number(p.booked_amount) - paid,
      payments_count: stats.count,
    };
  });
}

export async function getProjectDetail(id: string): Promise<{
  project: ProjectWithStats | null;
  payments: Payment[];
}> {
  const supabase = await createClient();
  const [{ data: project }, { data: managers }, { data: payments }] =
    await Promise.all([
      supabase.from("projects").select("*").eq("id", id).maybeSingle(),
      supabase.from("managers").select("*"),
      supabase
        .from("payments")
        .select("*")
        .eq("project_id", id)
        .order("paid_on", { ascending: false }),
    ]);

  if (!project) return { project: null, payments: [] };

  const managerMap = new Map((managers ?? []).map((m) => [m.id, m as Manager]));
  const paid = (payments ?? []).reduce((s, p) => s + Number(p.amount), 0);

  return {
    project: {
      ...(project as Project),
      booked_amount: Number(project.booked_amount),
      manager: project.manager_id ? managerMap.get(project.manager_id) ?? null : null,
      paid,
      balance: Number(project.booked_amount) - paid,
      payments_count: (payments ?? []).length,
    },
    payments: (payments ?? []) as Payment[],
  };
}

export async function getRecentPayments(limit = 12): Promise<
  (Payment & { project_title: string; currency: string })[]
> {
  const supabase = await createClient();
  const [{ data: payments }, { data: projects }] = await Promise.all([
    supabase
      .from("payments")
      .select("*")
      .order("paid_on", { ascending: false })
      .limit(limit),
    supabase.from("projects").select("id,title,currency"),
  ]);
  const projMap = new Map(
    (projects ?? []).map((p) => [
      p.id,
      { title: p.title as string, currency: (p.currency as string) ?? "INR" },
    ])
  );
  return ((payments ?? []) as Payment[]).map((p) => {
    const info = projMap.get(p.project_id);
    return {
      ...p,
      amount: Number(p.amount),
      project_title: info?.title ?? "Unknown project",
      currency: info?.currency ?? "INR",
    };
  });
}

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
