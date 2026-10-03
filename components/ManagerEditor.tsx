"use client";

import { Modal } from "@/components/Modal";
import { renderTrigger, type TriggerSpec } from "@/components/triggerButton";
import { Field, FormActions, FormError, useSave } from "@/components/form";
import { toast } from "@/components/Toaster";
import { saveManager } from "@/app/dashboard/actions";
import type { Manager } from "@/lib/types";

export function ManagerEditor({
  manager,
  trigger,
}: {
  manager?: Manager;
  trigger: TriggerSpec;
}) {
  return (
    <Modal
      trigger={(open) => renderTrigger(trigger, open)}
      title={manager ? "Edit person" : "Add a person"}
    >
      {(close) => <ManagerForm manager={manager} close={close} />}
    </Modal>
  );
}

function ManagerForm({ manager, close }: { manager?: Manager; close: () => void }) {
  const { pending, error, onSubmit } = useSave(saveManager);

  return (
    <form
      onSubmit={onSubmit(() => {
        close();
        toast(manager ? "Person updated" : "Person added");
      })}
      className="space-y-4"
    >
      {manager && <input type="hidden" name="id" value={manager.id} />}

      <Field label="Name" required>
        <input
          name="name"
          required
          defaultValue={manager?.name}
          className="input"
          placeholder="Who brings you this work"
          autoFocus={!manager}
        />
      </Field>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Phone">
          <input
            name="phone"
            type="tel"
            inputMode="tel"
            defaultValue={manager?.phone ?? ""}
            className="input"
            placeholder="+91"
          />
        </Field>
        <Field label="Email">
          <input
            name="email"
            type="email"
            inputMode="email"
            defaultValue={manager?.email ?? ""}
            className="input"
            placeholder="name@email.com"
          />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          name="notes"
          defaultValue={manager?.notes ?? ""}
          rows={3}
          className="input"
          placeholder="Commission split, how you met, anything useful"
        />
      </Field>

      <FormError error={error} />
      <FormActions pending={pending} onCancel={close} submitLabel={manager ? "Save changes" : "Add person"} />
    </form>
  );
}
