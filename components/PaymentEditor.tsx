"use client";

import { useMemo, useState } from "react";
import { Modal } from "@/components/Modal";
import { renderTrigger, type TriggerSpec } from "@/components/triggerButton";
import { Field, FormActions, FormError, useSave } from "@/components/form";
import { toast } from "@/components/Toaster";
import { addPayment } from "@/app/dashboard/actions";
import { currencySymbol, formatMoney } from "@/lib/format";
import type { PaymentProjectOption } from "@/lib/types";

const METHODS = ["UPI", "Bank transfer", "Cash", "PayPal", "Wise", "Card", "Other"];

function todayLocal() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

/**
 * Record a payment. Pass a single project to lock the form to it (project page,
 * "Record" on a row), or several to let the user pick (home page).
 */
export function PaymentEditor({
  projects,
  projectId,
  trigger,
}: {
  projects: PaymentProjectOption[];
  projectId?: string;
  trigger: TriggerSpec;
}) {
  return (
    <Modal trigger={(open) => renderTrigger(trigger, open)} title="Record a payment">
      {(close) => <PaymentForm projects={projects} initialId={projectId} close={close} />}
    </Modal>
  );
}

function PaymentForm({
  projects,
  initialId,
  close,
}: {
  projects: PaymentProjectOption[];
  initialId?: string;
  close: () => void;
}) {
  const { pending, error, onSubmit } = useSave(addPayment);
  const locked = !!initialId;

  // Projects still owed money first, then the rest — each alphabetically.
  const { owing, settled } = useMemo(() => {
    const byTitle = (a: PaymentProjectOption, b: PaymentProjectOption) =>
      a.title.localeCompare(b.title);
    return {
      owing: projects.filter((p) => p.balance > 0).sort(byTitle),
      settled: projects.filter((p) => p.balance <= 0).sort(byTitle),
    };
  }, [projects]);

  const [selectedId, setSelectedId] = useState(initialId ?? "");
  const selected = projects.find((p) => p.id === selectedId) ?? null;
  const [amount, setAmount] = useState(() =>
    selected && selected.balance > 0 ? String(selected.balance) : ""
  );

  function pick(id: string) {
    setSelectedId(id);
    const p = projects.find((x) => x.id === id);
    setAmount(p && p.balance > 0 ? String(p.balance) : "");
  }

  const currency = selected?.currency ?? "INR";

  if (projects.length === 0) {
    return (
      <div className="space-y-4">
        <p className="text-secondary">Create a project first, then record payments against it.</p>
        <div className="flex justify-end">
          <button type="button" className="btn-secondary" onClick={close}>
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit(() => {
        close();
        toast(`Payment recorded${selected ? ` · ${selected.title}` : ""}`);
      })}
      className="space-y-4"
    >
      <input type="hidden" name="project_id" value={selectedId} />

      {locked && selected ? (
        <div className="rounded-xl px-4 py-3" style={{ background: "var(--field)" }}>
          <div className="truncate font-medium">{selected.title}</div>
          <BalanceLine p={selected} />
        </div>
      ) : (
        <Field label="Project" required>
          <select
            value={selectedId}
            onChange={(e) => pick(e.target.value)}
            className="input"
            required
            autoFocus
          >
            <option value="" disabled>
              Choose a project…
            </option>
            {owing.length > 0 && (
              <optgroup label="Awaiting payment">
                {owing.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {formatMoney(p.balance, p.currency)} due
                  </option>
                ))}
              </optgroup>
            )}
            {settled.length > 0 && (
              <optgroup label="Fully paid">
                {settled.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </optgroup>
            )}
          </select>
          {selected && <BalanceLine p={selected} />}
        </Field>
      )}

      <div className="grid grid-cols-2 gap-3">
        <Field label={`Amount (${currencySymbol(currency).trim()})`} required>
          <input
            name="amount"
            type="number"
            inputMode="decimal"
            step="0.01"
            min="0.01"
            required
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="input tabular"
            placeholder="0"
            autoFocus={locked}
          />
        </Field>
        <Field label="Date received">
          <input name="paid_on" type="date" defaultValue={todayLocal()} className="input" />
        </Field>
      </div>

      <Field label="Method">
        <select name="method" className="input" defaultValue="UPI">
          {METHODS.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Notes">
        <input name="notes" className="input" placeholder="e.g. 50% advance" />
      </Field>

      <FormError error={error} />
      <FormActions pending={pending} onCancel={close} submitLabel="Record payment" />
    </form>
  );
}

function BalanceLine({ p }: { p: PaymentProjectOption }) {
  return (
    <div className="mt-1.5 text-[13px] text-secondary tabular">
      {p.balance > 0 ? (
        <>
          <span style={{ color: "var(--amber)" }}>{formatMoney(p.balance, p.currency)} due</span>
          {" of "}
          {formatMoney(p.booked, p.currency)}
        </>
      ) : (
        "Fully paid"
      )}
      {p.source ? ` · via ${p.source}` : ""}
    </div>
  );
}
