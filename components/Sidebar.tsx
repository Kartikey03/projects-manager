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

export function Sidebar({ email }: { email: string }) {
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/dashboard" ? pathname === href : pathname.startsWith(href);

  return (
    <aside className="glass sticky top-0 z-30 flex h-16 items-center gap-1 border-b px-4 md:h-screen md:w-64 md:flex-col md:items-stretch md:gap-0 md:border-b-0 md:border-r md:px-4 md:py-6"
      style={{ borderColor: "var(--border)" }}
    >
      <Link href="/dashboard" className="mr-2 flex items-center gap-2 font-semibold md:mb-8 md:px-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
          style={{ background: "var(--accent)" }}
        >
          <Sparkles size={17} />
        </div>
        <span className="hidden sm:inline">Projects</span>
      </Link>

      <nav className="flex flex-1 items-center gap-1 md:flex-col md:items-stretch md:gap-1">
        {NAV.map((item) => {
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition"
              style={{ color: active ? "var(--text)" : "var(--text-secondary)" }}
            >
              {active && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute inset-0 -z-10 rounded-xl"
                  style={{ background: "var(--border)" }}
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <item.icon size={18} />
              <span className="hidden md:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="hidden md:block md:border-t md:pt-4" style={{ borderColor: "var(--border)" }}>
        <div className="mb-2 truncate px-3 text-xs text-tertiary" title={email}>
          {email}
        </div>
        <form action={signOut}>
          <button
            type="submit"
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-secondary transition hover:bg-[var(--border)]"
          >
            <LogOut size={18} /> Sign out
          </button>
        </form>
      </div>

      {/* mobile signout */}
      <form action={signOut} className="md:hidden">
        <button
          type="submit"
          className="rounded-xl p-2 text-secondary transition hover:bg-[var(--border)]"
          aria-label="Sign out"
        >
          <LogOut size={18} />
        </button>
      </form>
    </aside>
  );
}
