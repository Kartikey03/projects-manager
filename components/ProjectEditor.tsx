"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { saveProject } from "@/app/dashboard/actions";
import { STATUS_ORDER, STATUS_META, type Manager, type Project } from "@/lib/types";

const CURRENCIES = ["INR", "USD", "EUR", "GBP", "AED"];

export function ProjectEditor({
  managers,
  project,
  trigger,
}: {
  managers: Manager[];
  project?: Project;
  trigger: (open: () => void) => React.ReactNode;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();

  return (
    <Modal trigger={trigger} title={project ? "Edit project" : "New project"}>
      {(close) => (
        <form
          action={(fd) =>
            start(async () => {
              await saveProject(fd);
              close();
              router.refresh();
            })
          }
          className="space-y-4"
        >
          {project && <input type="hidden" name="id" value={project.id} />}

          <Field label="Project title" required>
            <input
              name="title"
              required
              defaultValue={project?.title}
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="e.g. Landing page for Acme"
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Brought in by">
              <select
                name="manager_id"
                defaultValue={project?.manager_id ?? ""}
                className="input w-full px-3 py-2.5 text-sm"
              >
                <option value="">— None —</option>
                {managers.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Status">
              <select
                name="status"
                defaultValue={project?.status ?? "lead"}
                className="input w-full px-3 py-2.5 text-sm"
              >
                {STATUS_ORDER.map((s) => (
                  <option key={s} value={s}>
                    {STATUS_META[s].label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <Field label="Client name (optional)">
            <input
              name="client_name"
              defaultValue={project?.client_name ?? ""}
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="End client, if you know it"
            />
          </Field>

          <div className="grid grid-cols-[1fr_110px] gap-3">
            <Field label="Booked amount">
              <input
                name="booked_amount"
                type="number"
                step="0.01"
                min="0"
                defaultValue={project?.booked_amount ?? ""}
                className="input w-full px-4 py-2.5 text-sm"
                placeholder="0"
              />
            </Field>
            <Field label="Currency">
              <select
                name="currency"
                defaultValue={project?.currency ?? "INR"}
                className="input w-full px-3 py-2.5 text-sm"
              >
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Started on">
              <input
                name="started_at"
                type="date"
                defaultValue={project?.started_at ?? ""}
                className="input w-full px-3 py-2.5 text-sm"
              />
            </Field>
            <Field label="Deadline">
              <input
                name="deadline"
                type="date"
                defaultValue={project?.deadline ?? ""}
                className="input w-full px-3 py-2.5 text-sm"
              />
            </Field>
          </div>

          <Field label="Notes">
            <textarea
              name="description"
              defaultValue={project?.description ?? ""}
              rows={3}
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="Scope, deliverables, anything to remember…"
            />
          </Field>

          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={close} className="btn-ghost px-5 py-2.5 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={pending}
              className="btn-primary flex items-center gap-2 px-6 py-2.5 text-sm disabled:opacity-60"
            >
              {pending && <Loader2 size={15} className="animate-spin" />}
              {project ? "Save changes" : "Create project"}
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium">
        {label}
        {required && <span style={{ color: "var(--red)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}
