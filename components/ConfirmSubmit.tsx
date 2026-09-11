"use client";

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
  return (
    <button
      type="submit"
      title={title}
      className={className}
      onClick={(e) => {
        if (!confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
