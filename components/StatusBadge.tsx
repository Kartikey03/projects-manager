import { STATUS_META, type ProjectStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: ProjectStatus }) {
  const meta = STATUS_META[status];
  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium"
      style={{ background: meta.bg, color: meta.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.dot }} />
      {meta.label}
    </span>
  );
}

export function ProgressBar({
  value,
  tone = "var(--green)",
  className = "",
}: {
  value: number;
  tone?: string;
  className?: string;
}) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div
      className={`h-1 w-full overflow-hidden rounded-full ${className}`}
      style={{ background: "rgba(255,255,255,0.1)" }}
      role="progressbar"
      aria-valuenow={Math.round(pct)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className="h-full rounded-full transition-[width] duration-500 ease-out"
        style={{ width: `${pct}%`, background: tone }}
      />
    </div>
  );
}
