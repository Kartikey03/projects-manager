import { Plus, Pencil, Trash2, Wallet } from "lucide-react";

export type TriggerSpec = {
  label?: string;
  icon?: "plus" | "pencil" | "trash" | "wallet";
  /** visual style; ignored if `className` is provided */
  variant?: "primary" | "ghost" | "icon";
  className?: string;
  ariaLabel?: string;
};

const ICONS = { plus: Plus, pencil: Pencil, trash: Trash2, wallet: Wallet };

const VARIANT_CLASS: Record<NonNullable<TriggerSpec["variant"]>, string> = {
  primary: "btn-primary flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-5 py-2.5 text-sm",
  ghost: "btn-ghost flex shrink-0 items-center justify-center gap-2 whitespace-nowrap px-4 py-2.5 text-sm",
  icon: "pressable rounded-full p-2 text-tertiary hover:bg-[var(--border)] hover:text-[var(--text)]",
};

/** Renders a modal trigger button from a serializable spec. Safe to call inside client components. */
export function renderTrigger(spec: TriggerSpec, open: () => void) {
  const Icon = spec.icon ? ICONS[spec.icon] : null;
  const cls = spec.className ?? VARIANT_CLASS[spec.variant ?? "primary"];
  const iconSize = (spec.variant ?? "primary") === "primary" ? 17 : 15;
  return (
    <button onClick={open} className={cls} aria-label={spec.ariaLabel}>
      {Icon && <Icon size={iconSize} />}
      {spec.label}
    </button>
  );
}
