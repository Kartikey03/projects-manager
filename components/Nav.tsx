"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useFormStatus } from "react-dom";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Wallet,
  LogOut,
  Loader2,
} from "lucide-react";
import { signOut } from "@/app/dashboard/actions";
import { Logo } from "@/components/Logo";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/people", label: "People", icon: Users },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
];

function useIsActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

/* Translucent top bar, apple.com style. Links show on md+, tab bar takes over on phones. */
export function TopNav({ email }: { email: string }) {
  const isActive = useIsActive();
  return (
    <header
      className="glass sticky top-0 z-40 border-b"
      style={{ borderColor: "var(--hairline)" }}
    >
      <div className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="pressable flex items-center gap-2 text-[15px] font-semibold">
          <Logo size={26} />
          Projects
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Main">
          {NAV.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                prefetch
                aria-current={active ? "page" : undefined}
                className="pressable rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
                style={{
                  color: active ? "var(--text)" : "var(--text-2)",
                  background: active ? "rgba(255,255,255,0.1)" : "transparent",
                }}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <span className="hidden max-w-[180px] truncate text-xs text-tertiary lg:inline" title={email}>
            {email}
          </span>
          <form action={signOut}>
            <SignOutButton />
          </form>
        </div>
      </div>
    </header>
  );
}

function SignOutButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" className="icon-btn" aria-label="Sign out" title="Sign out" disabled={pending}>
      {pending ? <Loader2 size={17} className="animate-spin" /> : <LogOut size={17} />}
    </button>
  );
}

/* iOS-style bottom tab bar for phones. */
export function TabBar() {
  const isActive = useIsActive();
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-40 grid grid-cols-4 border-t md:hidden"
      style={{ borderColor: "var(--hairline)", paddingBottom: "env(safe-area-inset-bottom)" }}
      aria-label="Main"
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            prefetch
            aria-current={active ? "page" : undefined}
            className="pressable flex flex-col items-center justify-center gap-1 pb-1.5 pt-2.5 text-[10.5px] font-medium"
            style={{ color: active ? "var(--link)" : "var(--text-2)" }}
          >
            <item.icon size={22} strokeWidth={active ? 2.2 : 1.8} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
