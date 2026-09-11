"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  Wallet,
  LogOut,
  Sparkles,
} from "lucide-react";
import { signOut } from "@/app/dashboard/actions";

const NAV = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/projects", label: "Projects", icon: FolderKanban },
  { href: "/dashboard/people", label: "People", icon: Users },
  { href: "/dashboard/payments", label: "Payments", icon: Wallet },
];

function useActive() {
  const pathname = usePathname();
  return (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);
}

/* ===== Desktop: persistent left sidebar (md and up) ===== */
export function DesktopSidebar({ email }: { email: string }) {
  const isActive = useActive();
  return (
    <aside
      className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r px-4 py-6 md:flex"
      style={{ borderColor: "var(--border)", background: "var(--bg)" }}
    >
      <Link href="/dashboard" className="mb-8 flex items-center gap-2 px-2 font-semibold">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles size={17} />
        </div>
        Projects
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="pressable relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium"
              style={{ color: active ? "var(--text)" : "var(--text-secondary)" }}
            >
              {active && (
                <motion.span
                  layoutId="nav-active-desktop"
                  className="absolute inset-0 -z-10 rounded-xl"
                  style={{ background: "var(--border)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t pt-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-2 truncate px-3 text-xs text-tertiary" title={email}>
          {email}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="pressable flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary hover:bg-[var(--border)]"
          >
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>
    </aside>
  );
}

/* ===== Mobile: slim top header (logo + sign out) ===== */
export function MobileTopBar() {
  return (
    <header
      className="glass sticky top-0 z-30 flex h-14 items-center justify-between border-b px-4 md:hidden"
      style={{ borderColor: "var(--border)" }}
    >
      <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles size={16} />
        </div>
        Projects
      </Link>
      <form action={signOut}>
        <button
          type="submit"
          className="pressable flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-secondary"
          aria-label="Sign out"
        >
          <LogOut size={17} />
        </button>
      </form>
    </header>
  );
}

/* ===== Mobile: fixed bottom tab bar with labels ===== */
export function MobileBottomNav() {
  const isActive = useActive();
  return (
    <nav
      className="glass fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 border-t md:hidden"
      style={{
        borderColor: "var(--border)",
        paddingBottom: "env(safe-area-inset-bottom)",
      }}
    >
      {NAV.map((item) => {
        const active = isActive(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className="pressable relative flex flex-col items-center justify-center gap-1 py-2.5 text-[11px] font-medium"
            style={{ color: active ? "var(--accent)" : "var(--text-secondary)" }}
          >
            {active && (
              <motion.span
                layoutId="nav-active-mobile"
                className="absolute top-0 h-0.5 w-8 rounded-full"
                style={{ background: "var(--accent)" }}
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <item.icon size={21} />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
