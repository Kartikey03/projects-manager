"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Loader2 } from "lucide-react";
import { Modal } from "@/components/Modal";
import { renderTrigger, type TriggerSpec } from "@/components/triggerButton";
import { addPayment } from "@/app/dashboard/actions";

const METHODS = ["UPI", "Bank transfer", "Cash", "PayPal", "Wise", "Card", "Other"];

export function PaymentEditor({
  projectId,
  currency = "INR",
  suggested,
  trigger,
}: {
  projectId: string;
  currency?: string;
  suggested?: number;
  trigger: TriggerSpec;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const today = new Date().toISOString().slice(0, 10);

  return (
    <Modal trigger={(open) => renderTrigger(trigger, open)} title="Record a payment">
      {(close) => (
        <form
          action={(fd) =>
            start(async () => {
              await addPayment(fd);
              close();
              router.refresh();
            })
          }
          className="space-y-4"
        >
          <input type="hidden" name="project_id" value={projectId} />

          <div className="grid grid-cols-2 gap-3">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">
                Amount ({currency})<span style={{ color: "var(--red)" }}> *</span>
              </span>
              <input
                name="amount"
                type="number"
                step="0.01"
                min="0"
                required
                defaultValue={suggested && suggested > 0 ? suggested : ""}
                className="input w-full px-4 py-2.5 text-sm"
                placeholder="0"
                autoFocus
              />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium">Date received</span>
              <input
                name="paid_on"
                type="date"
                defaultValue={today}
                className="input w-full px-3 py-2.5 text-sm"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Method</span>
            <select name="method" className="input w-full px-3 py-2.5 text-sm" defaultValue="UPI">
              {METHODS.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1.5 block text-sm font-medium">Notes</span>
            <input
              name="notes"
              className="input w-full px-4 py-2.5 text-sm"
              placeholder="e.g. 50% advance"
            />
          </label>

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
              Add payment
            </button>
          </div>
        </form>
      )}
    </Modal>
  );
}
