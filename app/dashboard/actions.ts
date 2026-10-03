"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { ok: true } | { ok: false; error: string };

function str(v: FormDataEntryValue | null): string | null {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}
function num(v: FormDataEntryValue | null): number {
  const n = parseFloat((v ?? "").toString().replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

/**
 * Verifies the session JWT locally against the project's ES256 signing keys
 * (no round-trip to the Auth server), then returns a client + the user id.
 */
async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getClaims();
  const userId = data?.claims?.sub;
  if (!userId) redirect("/login");
  return { supabase, userId };
}

// One call refreshes every page under /dashboard, and Next.js streams the
// re-rendered current page back in the same response — no extra client refresh.
function refreshDashboard() {
  revalidatePath("/dashboard", "layout");
}

function fail(error: { message: string } | null): ActionResult | null {
  return error ? { ok: false, error: error.message } : null;
}

/* ===== Managers ===== */
export async function saveManager(formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  const id = str(formData.get("id"));
  const name = str(formData.get("name"));
  if (!name) return { ok: false, error: "Name is required." };

  const payload = {
    name,
    phone: str(formData.get("phone")),
    email: str(formData.get("email")),
    notes: str(formData.get("notes")),
    user_id: userId,
  };
  const { error } = id
    ? await supabase.from("managers").update(payload).eq("id", id)
    : await supabase.from("managers").insert(payload);
  const bad = fail(error);
  if (bad) return bad;

  refreshDashboard();
  return { ok: true };
}

export async function deleteManager(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  if (id) await supabase.from("managers").delete().eq("id", id);
  refreshDashboard();
}

/* ===== Projects ===== */
export async function saveProject(formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  const id = str(formData.get("id"));
  const title = str(formData.get("title"));
  if (!title) return { ok: false, error: "Project title is required." };

  const payload = {
    title,
    description: str(formData.get("description")),
    manager_id: str(formData.get("manager_id")),
    client_name: str(formData.get("client_name")),
    status: str(formData.get("status")) ?? "lead",
    booked_amount: num(formData.get("booked_amount")),
    currency: str(formData.get("currency")) ?? "INR",
    deadline: str(formData.get("deadline")),
    started_at: str(formData.get("started_at")),
    user_id: userId,
  };
  const { error } = id
    ? await supabase.from("projects").update(payload).eq("id", id)
    : await supabase.from("projects").insert(payload);
  const bad = fail(error);
  if (bad) return bad;

  refreshDashboard();
  return { ok: true };
}

export async function updateProjectStatus(id: string, status: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  const { error } = await supabase.from("projects").update({ status }).eq("id", id);
  const bad = fail(error);
  if (bad) return bad;

  refreshDashboard();
  return { ok: true };
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  if (id) await supabase.from("projects").delete().eq("id", id);
  refreshDashboard();
  redirect("/dashboard/projects");
}

/* ===== Payments ===== */
export async function addPayment(formData: FormData): Promise<ActionResult> {
  const { supabase, userId } = await requireUser();
  const project_id = str(formData.get("project_id"));
  const amount = num(formData.get("amount"));
  if (!project_id) return { ok: false, error: "Choose a project." };
  if (amount <= 0) return { ok: false, error: "Enter an amount greater than zero." };

  const { error } = await supabase.from("payments").insert({
    project_id,
    amount,
    paid_on: str(formData.get("paid_on")) ?? new Date().toISOString().slice(0, 10),
    method: str(formData.get("method")),
    notes: str(formData.get("notes")),
    user_id: userId,
  });
  const bad = fail(error);
  if (bad) return bad;

  refreshDashboard();
  return { ok: true };
}

export async function deletePayment(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  if (id) await supabase.from("payments").delete().eq("id", id);
  refreshDashboard();
}

/* ===== Auth ===== */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
