"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

function str(v: FormDataEntryValue | null): string | null {
  const s = (v ?? "").toString().trim();
  return s.length ? s : null;
}
function num(v: FormDataEntryValue | null): number {
  const n = parseFloat((v ?? "").toString().replace(/,/g, ""));
  return isNaN(n) ? 0 : n;
}

async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  return { supabase, user };
}

/* ===== Managers ===== */
export async function saveManager(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = str(formData.get("id"));
  const payload = {
    name: str(formData.get("name")) ?? "Untitled",
    phone: str(formData.get("phone")),
    email: str(formData.get("email")),
    notes: str(formData.get("notes")),
    user_id: user.id,
  };
  if (id) {
    await supabase.from("managers").update(payload).eq("id", id);
  } else {
    await supabase.from("managers").insert(payload);
  }
  revalidatePath("/dashboard/people");
  revalidatePath("/dashboard/projects");
}

export async function deleteManager(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  if (id) await supabase.from("managers").delete().eq("id", id);
  revalidatePath("/dashboard/people");
}

/* ===== Projects ===== */
export async function saveProject(formData: FormData) {
  const { supabase, user } = await requireUser();
  const id = str(formData.get("id"));
  const payload = {
    title: str(formData.get("title")) ?? "Untitled project",
    description: str(formData.get("description")),
    manager_id: str(formData.get("manager_id")),
    client_name: str(formData.get("client_name")),
    status: (str(formData.get("status")) ?? "lead") as string,
    booked_amount: num(formData.get("booked_amount")),
    currency: str(formData.get("currency")) ?? "INR",
    deadline: str(formData.get("deadline")),
    started_at: str(formData.get("started_at")),
    user_id: user.id,
  };
  if (id) {
    await supabase.from("projects").update(payload).eq("id", id);
  } else {
    await supabase.from("projects").insert(payload);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
}

export async function updateProjectStatus(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  const status = str(formData.get("status"));
  if (id && status) {
    await supabase.from("projects").update({ status }).eq("id", id);
  }
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  revalidatePath(`/dashboard/projects/${id}`);
}

export async function deleteProject(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  if (id) await supabase.from("projects").delete().eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/projects");
  redirect("/dashboard/projects");
}

/* ===== Payments ===== */
export async function addPayment(formData: FormData) {
  const { supabase, user } = await requireUser();
  const project_id = str(formData.get("project_id"));
  if (!project_id) return;
  await supabase.from("payments").insert({
    project_id,
    amount: num(formData.get("amount")),
    paid_on: str(formData.get("paid_on")) ?? new Date().toISOString().slice(0, 10),
    method: str(formData.get("method")),
    notes: str(formData.get("notes")),
    user_id: user.id,
  });
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  revalidatePath(`/dashboard/projects/${project_id}`);
}

export async function deletePayment(formData: FormData) {
  const { supabase } = await requireUser();
  const id = str(formData.get("id"));
  const project_id = str(formData.get("project_id"));
  if (id) await supabase.from("payments").delete().eq("id", id);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/payments");
  if (project_id) revalidatePath(`/dashboard/projects/${project_id}`);
}

/* ===== Auth ===== */
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
