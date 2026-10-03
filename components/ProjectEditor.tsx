"use client";

import { Modal } from "@/components/Modal";
import { renderTrigger, type TriggerSpec } from "@/components/triggerButton";
import { Field, FormActions, FormError, useSave } from "@/components/form";
import { toast } from "@/components/Toaster";
import { saveProject } from "@/app/dashboard/actions";
import { STATUS_ORDER, STATUS_META, type Manager, type Project } from "@/lib/types";

export const CURRENCIES = [
  { code: "INR", label: "₹ INR" },
  { code: "USD", label: "$ USD" },
  { code: "GBP", label: "£ GBP" },
  { code: "EUR", label: "€ EUR" },
  { code: "AED", label: "د.إ AED" },
];

export function ProjectEditor({
  managers,
  project,
  trigger,
}: {
  managers: Manager[];
  project?: Project;
  trigger: TriggerSpec;
}) {
  return (
    <Modal
      trigger={(open) => renderTrigger(trigger, open)}
      title={project ? "Edit project" : "New project"}
    >
      {(close) => <ProjectForm managers={managers} project={project} close={close} />}
    </Modal>
  );
}

function ProjectForm({
  managers,
  project,
  close,
}: {
  managers: Manager[];
  project?: Project;
  close: () => void;
}) {
  const { pending, error, onSubmit } = useSave(saveProject);

  return (
    <form
      onSubmit={onSubmit(() => {
        close();
        toast(project ? "Project updated" : "Project created");
      })}
      className="space-y-4"
    >
      {project && <input type="hidden" name="id" value={project.id} />}

      <Field label="Project title" required>
        <input
          name="title"
          required
          defaultValue={project?.title}
          className="input"
          placeholder="e.g. Landing page for Acme"
          autoFocus={!project}
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Brought in by">
          <select name="manager_id" defaultValue={project?.manager_id ?? ""} className="input">
            <option value="">None</option>
            {managers.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Status">
          <select name="status" defaultValue={project?.status ?? "lead"} className="input">
            {STATUS_ORDER.map((s) => (
              <option key={s} value={s}>
                {STATUS_META[s].label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <Field label="Client name">
        <input
          name="client_name"
          defaultValue={project?.client_name ?? ""}
          className="input"
          placeholder="End client, if you know it"
        />
      </Field>

      <div className="grid grid-cols-[1fr_120px] gap-3">
        <Field label="Booked amount">
          <input
            name="booked_amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0"
            defaultValue={project?.booked_amount ?? ""}
            className="input tabular"
            placeholder="0"
          />
        </Field>
        <Field label="Currency">
          <select name="currency" defaultValue={project?.currency ?? "INR"} className="input">
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.label}
              </option>
            ))}
          </select>
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Started on">
          <input name="started_at" type="date" defaultValue={project?.started_at ?? ""} className="input" />
        </Field>
        <Field label="Deadline">
          <input name="deadline" type="date" defaultValue={project?.deadline ?? ""} className="input" />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          name="description"
          defaultValue={project?.description ?? ""}
          rows={3}
          className="input"
          placeholder="Scope, deliverables, anything to remember"
        />
      </Field>

      <FormError error={error} />
      <FormActions
        pending={pending}
        onCancel={close}
        submitLabel={project ? "Save changes" : "Create project"}
      />
    </form>
  );
}
