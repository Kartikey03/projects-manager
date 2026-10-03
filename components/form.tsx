"use client";

import { useState, useTransition } from "react";
import { Loader2, AlertCircle } from "lucide-react";
import type { ActionResult } from "@/app/dashboard/actions";

/**
 * Submits a form to a Server Action without resetting the fields on failure.
 * The action's response already carries the re-rendered page, so no refresh.
 */
export function useSave(action: (fd: FormData) => Promise<ActionResult>) {
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (onDone: () => void) => (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pending) return;
    const fd = new FormData(e.currentTarget);
    setError(null);
    start(async () => {
      const res = await action(fd);
      if (res.ok) onDone();
      else setError(res.error);
    });
  };

  return { pending, error, onSubmit };
}

export function Field({
  label,
  required,
  children,
  className = "",
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="field-label">
        {label}
        {required && <span style={{ color: "var(--red)" }}> *</span>}
      </span>
      {children}
    </label>
  );
}

export function FormError({ error }: { error: string | null }) {
  if (!error) return null;
  return (
    <p
      className="flex items-start gap-2 rounded-xl px-3 py-2.5 text-sm"
      style={{ background: "rgba(255,69,58,0.12)", color: "var(--red)" }}
      role="alert"
    >
      <AlertCircle size={16} className="mt-0.5 shrink-0" />
      {error}
    </p>
  );
}

export function FormActions({
  pending,
  onCancel,
  submitLabel,
  pendingLabel = "Saving…",
}: {
  pending: boolean;
  onCancel: () => void;
  submitLabel: string;
  pendingLabel?: string;
}) {
  return (
    <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
      <button type="button" onClick={onCancel} className="btn-secondary" disabled={pending}>
        Cancel
      </button>
      <button type="submit" className="btn-primary sm:min-w-[140px]" disabled={pending}>
        {pending && <Loader2 size={16} className="animate-spin" />}
        {pending ? pendingLabel : submitLabel}
      </button>
    </div>
  );
}
