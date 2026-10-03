export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: React.ReactNode;
  /** action buttons, right-aligned on desktop, full-width row on phones */
  children?: React.ReactNode;
}) {
  return (
    <div className="fade-in mb-8 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[34px] font-semibold leading-[1.1] sm:text-[44px]">{title}</h1>
        {subtitle && <p className="mt-2 text-[15px] text-secondary sm:text-[17px]">{subtitle}</p>}
      </div>
      {children && <div className="flex shrink-0 flex-wrap gap-2 [&>*]:flex-1 sm:[&>*]:flex-none">{children}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: React.ReactNode; action?: React.ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between gap-3 px-1">
      <h2 className="text-[19px] font-semibold">{children}</h2>
      {action}
    </div>
  );
}

export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-4 px-6 py-14 text-center text-secondary">
      {children}
    </div>
  );
}
