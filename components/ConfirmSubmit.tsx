"use client";

import { useFormStatus } from "react-dom";
import { Loader2 } from "lucide-react";

/** Submit button that asks first, then shows a spinner until the action finishes. */
export function ConfirmSubmit({
  message,
  className,
  children,
  title,
}: {
  message: string;
  className?: string;
  children: React.ReactNode;
  title?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      title={title}
      aria-label={title}
      className={className}
      disabled={pending}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {pending ? <Loader2 size={16} className="animate-spin" /> : children}
    </button>
  );
}
