import { Plus, Pencil, Trash2, Wallet } from "lucide-react";

export type TriggerSpec = {
  label?: string;
  icon?: "plus" | "pencil" | "trash" | "wallet";
  variant?: "primary" | "secondary" | "icon" | "link";
  /** extra classes appended to the variant's classes */
  className?: string;
  ariaLabel?: string;
};

const ICONS = { plus: Plus, pencil: Pencil, trash: Trash2, wallet: Wallet };

const VARIANT_CLASS: Record<NonNullable<TriggerSpec["variant"]>, string> = {
  primary: "btn-primary",
  secondary: "btn-secondary",
  icon: "icon-btn",
  link: "link pressable inline-flex items-center gap-1 text-sm font-medium",
};

/** Renders a modal trigger from a serializable spec (safe to pass from Server Components). */
export function renderTrigger(spec: TriggerSpec, open: () => void) {
  const Icon = spec.icon ? ICONS[spec.icon] : null;
  const variant = spec.variant ?? "primary";
  return (
    <button
      type="button"
      onClick={open}
      className={`${VARIANT_CLASS[variant]} ${spec.className ?? ""}`}
      aria-label={spec.ariaLabel ?? spec.label}
    >
      {Icon && <Icon size={variant === "icon" ? 17 : 16} strokeWidth={2.2} />}
      {spec.label}
    </button>
  );
}
