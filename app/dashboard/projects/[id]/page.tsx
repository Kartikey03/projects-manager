import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Plus, Trash2, Pencil, Calendar, User, Briefcase } from "lucide-react";
import { getManagers, getProjectDetail } from "@/lib/queries";
import { deletePayment, deleteProject } from "@/app/dashboard/actions";
import { ProgressBar } from "@/components/StatusBadge";
import { StatusChanger } from "@/components/StatusChanger";
import { ProjectEditor } from "@/components/ProjectEditor";
import { PaymentEditor } from "@/components/PaymentEditor";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { formatMoney, formatDate } from "@/lib/format";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ project, payments }, managers] = await Promise.all([
    getProjectDetail(id),
    getManagers(),
  ]);

  if (!project) notFound();

  const pct = project.booked_amount > 0 ? (project.paid / project.booked_amount) * 100 : 0;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/dashboard/projects"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-secondary transition hover:opacity-70"
      >
        <ArrowLeft size={16} /> Projects
      </Link>

      {/* header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2">
            <StatusChanger projectId={project.id} status={project.status} />
          </div>
          <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
        </div>
        <div className="flex items-center gap-2">
          <ProjectEditor
            managers={managers}
            project={project}
            trigger={(open) => (
              <button onClick={open} className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm">
                <Pencil size={15} /> Edit
              </button>
            )}
          />
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <ConfirmSubmit
              message="Delete this project and all its payments? This cannot be undone."
              className="btn-ghost flex items-center gap-2 px-4 py-2.5 text-sm"
              title="Delete project"
            >
              <Trash2 size={15} style={{ color: "var(--red)" }} />
            </ConfirmSubmit>
          </form>
        </div>
      </div>

      {/* meta */}
      <div className="mb-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-secondary">
        <span className="inline-flex items-center gap-1.5">
          <User size={15} /> {project.manager ? project.manager.name : "No source"}
        </span>
        {project.client_name && (
          <span className="inline-flex items-center gap-1.5">
            <Briefcase size={15} /> {project.client_name}
          </span>
        )}
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={15} /> Started {formatDate(project.started_at)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar size={15} /> Due {formatDate(project.deadline)}
        </span>
      </div>

      {/* money card */}
      <div className="card mb-6 p-6">
        <div className="grid grid-cols-3 gap-4">
          <Metric label="Booked" value={formatMoney(project.booked_amount, project.currency)} />
          <Metric
            label="Received"
            value={formatMoney(project.paid, project.currency)}
            tone="var(--green)"
          />
          <Metric
            label="Balance"
            value={formatMoney(project.balance, project.currency)}
            tone={project.balance > 0 ? "var(--amber)" : "var(--text-secondary)"}
          />
        </div>
        <div className="mt-5">
          <ProgressBar value={pct} />
          <div className="mt-2 text-xs text-tertiary">{Math.round(pct)}% collected</div>
        </div>
      </div>

      {project.description && (
        <div className="card mb-6 p-6">
          <h2 className="mb-2 text-sm font-semibold">Notes</h2>
          <p className="whitespace-pre-wrap text-sm text-secondary">{project.description}</p>
        </div>
      )}

      {/* payments */}
      <div className="card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-semibold">
            Payments <span className="text-tertiary">({payments.length})</span>
          </h2>
          <PaymentEditor
            projectId={project.id}
            currency={project.currency}
            suggested={project.balance > 0 ? project.balance : undefined}
            trigger={(open) => (
              <button onClick={open} className="btn-primary flex items-center gap-2 px-4 py-2 text-sm">
                <Plus size={16} /> Record payment
              </button>
            )}
          />
        </div>

        {payments.length === 0 ? (
          <div className="rounded-2xl border border-dashed py-10 text-center text-sm text-tertiary" style={{ borderColor: "var(--border-strong)" }}>
            No payments yet. Add the first one when money comes in.
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: "var(--border)" }}>
            {payments.map((pay) => (
              <div key={pay.id} className="flex items-center justify-between py-3">
                <div>
                  <div className="font-medium" style={{ color: "var(--green)" }}>
                    +{formatMoney(Number(pay.amount), project.currency)}
                  </div>
                  <div className="text-xs text-tertiary">
                    {formatDate(pay.paid_on)}
                    {pay.method ? ` · ${pay.method}` : ""}
                    {pay.notes ? ` · ${pay.notes}` : ""}
                  </div>
                </div>
                <form action={deletePayment}>
                  <input type="hidden" name="id" value={pay.id} />
                  <input type="hidden" name="project_id" value={project.id} />
                  <ConfirmSubmit
                    message="Delete this payment?"
                    className="rounded-full p-2 text-tertiary transition hover:bg-[var(--border)] hover:text-[var(--red)]"
                  >
                    <Trash2 size={15} />
                  </ConfirmSubmit>
                </form>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function Metric({ label, value, tone = "var(--text)" }: { label: string; value: string; tone?: string }) {
  return (
    <div>
      <div className="text-xs text-tertiary">{label}</div>
      <div className="mt-1 text-xl font-semibold tracking-tight sm:text-2xl" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}
