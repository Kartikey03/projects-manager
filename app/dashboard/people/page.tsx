import { Trash2, Phone, Mail } from "lucide-react";
import { getManagers, getProjectsWithStats } from "@/lib/queries";
import { deleteManager } from "@/app/dashboard/actions";
import { ManagerEditor } from "@/components/ManagerEditor";
import { ConfirmSubmit } from "@/components/ConfirmSubmit";
import { formatMoney } from "@/lib/format";

export default async function PeoplePage() {
  const [managers, projects] = await Promise.all([
    getManagers(),
    getProjectsWithStats(),
  ]);

  const stats = new Map<string, { count: number; booked: number; paid: number }>();
  for (const p of projects) {
    if (!p.manager_id) continue;
    const s = stats.get(p.manager_id) ?? { count: 0, booked: 0, paid: 0 };
    s.count += 1;
    s.booked += p.booked_amount;
    s.paid += p.paid;
    stats.set(p.manager_id, s);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex flex-col items-start gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">People</h1>
          <p className="mt-1 text-secondary">The folks who bring you work.</p>
        </div>
        <ManagerEditor trigger={{ label: "Add person", icon: "plus", variant: "primary" }} />
      </div>

      {managers.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center" style={{ borderColor: "var(--border-strong)" }}>
          <p className="mb-4 text-secondary">No one added yet. Add the people who send you projects.</p>
          <ManagerEditor trigger={{ label: "Add your first", icon: "plus", variant: "primary" }} />
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {managers.map((m) => {
            const s = stats.get(m.id) ?? { count: 0, booked: 0, paid: 0 };
            return (
              <div key={m.id} className="card group flex flex-col p-5">
                <div className="mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-11 w-11 items-center justify-center rounded-full text-base font-semibold text-white"
                      style={{ background: "linear-gradient(135deg, #0a84ff, #bf5af2)" }}
                    >
                      {m.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="font-semibold">{m.name}</div>
                      <div className="text-xs text-tertiary">
                        {s.count} project{s.count === 1 ? "" : "s"}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1 md:opacity-0 md:transition md:group-hover:opacity-100">
                    <ManagerEditor manager={m} trigger={{ icon: "pencil", variant: "icon" }} />
                    <form action={deleteManager}>
                      <input type="hidden" name="id" value={m.id} />
                      <ConfirmSubmit
                        message={`Remove ${m.name}? Their projects will stay but lose the source link.`}
                        className="pressable rounded-full p-2 text-tertiary hover:bg-[var(--border)] hover:text-[var(--red)]"
                      >
                        <Trash2 size={14} />
                      </ConfirmSubmit>
                    </form>
                  </div>
                </div>

                {(m.phone || m.email) && (
                  <div className="mb-3 space-y-1 text-sm text-secondary">
                    {m.phone && (
                      <div className="flex items-center gap-2">
                        <Phone size={14} className="text-tertiary" /> {m.phone}
                      </div>
                    )}
                    {m.email && (
                      <div className="flex items-center gap-2">
                        <Mail size={14} className="text-tertiary" /> {m.email}
                      </div>
                    )}
                  </div>
                )}

                {m.notes && <p className="mb-3 text-sm text-secondary">{m.notes}</p>}

                <div className="mt-auto grid grid-cols-2 gap-3 border-t pt-3" style={{ borderColor: "var(--border)" }}>
                  <div>
                    <div className="text-xs text-tertiary">Brought in</div>
                    <div className="text-sm font-semibold">{formatMoney(s.booked)}</div>
                  </div>
                  <div>
                    <div className="text-xs text-tertiary">Received</div>
                    <div className="text-sm font-semibold" style={{ color: "var(--green)" }}>
                      {formatMoney(s.paid)}
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
