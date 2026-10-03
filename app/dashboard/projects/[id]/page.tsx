import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Trash2, Calendar, User, Briefcase } from "lucide-react";
import { getManagers, getProjectDetail, toPaymentOption } from "@/lib/queries";
import { deletePayment, deleteProject } from "@/app/dashboard/actions";
import { ProgressBar } from "@/components/StatusBadge";
import { StatusChanger } from "@/components/StatusChanger";
import { ProjectEditor } from "@/components/ProjectEditor";
import { PaymentEditor } from "@/components/PaymentEditor";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { SectionTitle } from "@/components/PageHeader";
import { formatMoney, formatDate } from "@/lib/format";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { project } = await getProjectDetail((await params).id);
  return { title: project?.title ?? "Project" };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [{ project, payments }, managers] = await Promise.all([getProjectDetail(id), getManagers()]);
  if (!project) notFound();

  const pct = project.booked_amount > 0 ? (project.paid / project.booked_amount) * 100 : 0;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/dashboard/projects" className="link pressable -ml-1 mb-5 inline-flex items-center text-sm">
        <ChevronLeft size={18} /> Projects
      </Link>

      <header className="fade-in mb-6">
        <div className="mb-3">
          <StatusChanger projectId={project.id} status={project.status} />
        </div>
        <h1 className="break-words text-[32px] font-semibold leading-[1.1] sm:text-[40px]">{project.title}</h1>
        <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-sm text-secondary">
          <span className="inline-flex items-center gap-1.5">
            <User size={15} /> {project.manager ? project.manager.name : "No source"}
          </span>
          {project.client_name && (
            <span className="inline-flex items-center gap-1.5">
              <Briefcase size={15} /> {project.client_name}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <Calendar size={15} /> {formatDate(project.started_at)} → {formatDate(project.deadline)}
          </span>
        </div>
        <div className="mt-5 flex gap-2">
          <ProjectEditor
            managers={managers}
            project={project}
            trigger={{ label: "Edit", icon: "pencil", variant: "secondary" }}
          />
          <form action={deleteProject}>
            <input type="hidden" name="id" value={project.id} />
            <ConfirmSubmit
              message="Delete this project and all its payments? This cannot be undone."
              className="btn-secondary px-3.5 text-[var(--red)]"
              title="Delete project"
            >
              <Trash2 size={16} />
            </ConfirmSubmit>
          </form>
        </div>
      </header>

      <section className="card fade-in fade-in-d1 mb-8 p-5 sm:p-7">
        <div className="grid grid-cols-3 gap-3">
          <Metric label="Booked" value={formatMoney(project.booked_amount, project.currency)} />
          <Metric label="Received" value={formatMoney(project.paid, project.currency)} tone="var(--green)" />
          <Metric
            label="Balance"
            value={formatMoney(project.balance, project.currency)}
            tone={project.balance > 0 ? "var(--amber)" : "var(--text-2)"}
          />
        </div>
        <ProgressBar value={pct} className="mt-6" />
        <div className="mt-2 text-xs text-tertiary tabular">{Math.round(pct)}% collected</div>
      </section>

      {project.description && (
        <section className="fade-in fade-in-d2 mb-8">
          <SectionTitle>Notes</SectionTitle>
          <p className="card whitespace-pre-wrap p-5 text-[15px] text-secondary">{project.description}</p>
        </section>
      )}

      <section className="fade-in fade-in-d2">
        <SectionTitle
          action={
            <PaymentEditor
              projects={[toPaymentOption(project)]}
              projectId={project.id}
              trigger={{ label: "Record payment", icon: "plus", variant: "primary" }}
            />
          }
        >
          Payments <span className="text-tertiary tabular">{payments.length}</span>
        </SectionTitle>

        {payments.length === 0 ? (
          <div className="card px-6 py-12 text-center text-secondary">
            No payments yet. Record one when money comes in.
          </div>
        ) : (
          <ul className="card divide-y overflow-hidden" style={{ borderColor: "var(--hairline)" }}>
            {payments.map((pay) => (
              <li
                key={pay.id}
                className="flex items-center justify-between gap-3 py-3 pl-5 pr-3"
                style={{ borderColor: "var(--hairline)" }}
              >
                <div className="min-w-0">
                  <div className="tabular font-semibold" style={{ color: "var(--green)" }}>
                    +{formatMoney(Number(pay.amount), project.currency)}
                  </div>
                  <div className="truncate text-xs text-tertiary">
                    {formatDate(pay.paid_on)}
                    {pay.method ? ` · ${pay.method}` : ""}
                    {pay.notes ? ` · ${pay.notes}` : ""}
                  </div>
                </div>
                <form action={deletePayment}>
                  <input type="hidden" name="id" value={pay.id} />
                  <ConfirmSubmit message="Delete this payment?" className="icon-btn hover:text-[var(--red)]" title="Delete payment">
                    <Trash2 size={16} />
                  </ConfirmSubmit>
                </form>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}

function Metric({ label, value, tone = "var(--text)" }: { label: string; value: string; tone?: string }) {
  return (
    <div className="min-w-0">
      <div className="text-xs text-tertiary">{label}</div>
      <div className="display tabular mt-1 truncate text-lg font-semibold sm:text-[26px]" style={{ color: tone }}>
        {value}
      </div>
    </div>
  );
}
