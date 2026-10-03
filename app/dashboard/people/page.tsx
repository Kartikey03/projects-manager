import { Trash2, Phone, Mail } from "lucide-react";
import { getManagers, getProjectsWithStats } from "@/lib/queries";
import { deleteManager } from "@/app/dashboard/actions";
import { ManagerEditor } from "@/components/ManagerEditor";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { PageHeader } from "@/components/PageHeader";
import { joinMoney, sumByCurrency } from "@/lib/format";

export default async function PeoplePage() {
  const [managers, projects] = await Promise.all([getManagers(), getProjectsWithStats()]);

  return (
    <div>
      <PageHeader title="People" subtitle="The folks who bring you work.">
        <ManagerEditor trigger={{ label: "Add person", icon: "plus", variant: "primary" }} />
      </PageHeader>

      {managers.length === 0 ? (
        <div className="card px-6 py-16 text-center text-secondary">
          No one added yet. Add the people who send you projects.
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {managers.map((m, i) => {
            const theirs = projects.filter((p) => p.manager_id === m.id && p.status !== "cancelled");
            const booked = sumByCurrency(theirs, (p) => p.booked_amount, (p) => p.currency);
            const paid = sumByCurrency(theirs, (p) => p.paid, (p) => p.currency);
            return (
              <div
                key={m.id}
                className={`card fade-in ${i < 3 ? `fade-in-d${i + 1}` : ""} flex flex-col p-5`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[17px] font-semibold"
                      style={{ background: "#2c2c2e" }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[17px] font-semibold">{m.name}</div>
                      <div className="text-[13px] text-tertiary tabular">
                        {theirs.length} project{theirs.length === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 -mt-1 flex shrink-0">
                    <ManagerEditor manager={m} trigger={{ icon: "pencil", variant: "icon", ariaLabel: `Edit ${m.name}` }} />
                    <form action={deleteManager}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmSubmit
                        message={`Remove ${m.name}? Their projects stay but lose the source link.`}
                        className="icon-btn hover:text-[var(--red)]"
                        title={`Remove ${m.name}`}
                      >
                        <Trash2 size={16} />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>

                {(m.phone || m.email) && (
                  <div className="mt-4 space-y-1.5 text-sm">
                    {m.phone && (
                      <a href={`tel:${m.phone}`} className="link pressable flex items-center gap-2">
                        <Phone size={14} /> {m.phone}
                      </a>
                    )}
                    {m.email && (
                      <a href={`mailto:${m.email}`} className="link pressable flex min-w-0 items-center gap-2">
                        <Mail size={14} className="shrink-0" /> <span className="truncate">{m.email}</span>
                      </a>
                    )}
                  </div>
                )}

                {m.notes && <p className="mt-3 text-sm text-secondary">{m.notes}</p>}

                <div className="mt-auto grid grid-cols-2 gap-3 border-t pt-4" style={{ borderColor: "var(--hairline)", marginTop: "1.25rem" }}>
                  <div className="min-w-0">
                    <div className="text-xs text-tertiary">Brought in</div>
                    <div className="tabular truncate text-sm font-semibold">{joinMoney(booked)}</div>
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs text-tertiary">Received</div>
                    <div className="tabular truncate text-sm font-semibold" style={{ color: "var(--green)" }}>
                      {joinMoney(paid)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
