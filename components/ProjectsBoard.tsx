"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { ProjectEditor } from "@/components/ProjectEditor";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";
import { PageHeader } from "@/components/PageHeader";
import { formatMoney, relativeDeadline } from "@/lib/format";
import {
  STATUS_ORDER,
  STATUS_META,
  type Manager,
  type ProjectStatus,
  type ProjectWithStats,
} from "@/lib/types";

const DEADLINE_TONE = {
  over: "var(--red)",
  soon: "var(--amber)",
  ok: "var(--text-3)",
  none: "var(--text-3)",
} as const;

export function ProjectsBoard({
  projects,
  managers,
}: {
  projects: ProjectWithStats[];
  managers: Manager[];
}) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "all">("all");

  const counts = useMemo(() => {
    const c: Record<string, number> = { all: projects.length };
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return [p.title, p.client_name ?? "", p.manager?.name ?? ""].some((s) =>
        s.toLowerCase().includes(q)
      );
    });
  }, [projects, query, status]);

  return (
    <div>
      <PageHeader title="Projects" subtitle={`${projects.length} in total`}>
        <ProjectEditor managers={managers} trigger={{ label: "New project", icon: "plus", variant: "primary" }} />
      </PageHeader>

      <div className="fade-in fade-in-d1 mb-6 space-y-3">
        <div className="relative sm:max-w-sm">
          <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, client or source"
            className="input pl-10 pr-10"
            type="search"
            enterKeyHint="search"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="icon-btn absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
              aria-label="Clear search"
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* horizontally scrollable on phones instead of wrapping into a wall of chips */}
        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:px-0">
          <Chip active={status === "all"} onClick={() => setStatus("all")}>
            All <span className="tabular opacity-60">{counts.all}</span>
          </Chip>
          {STATUS_ORDER.map((s) =>
            counts[s] ? (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {STATUS_META[s].label} <span className="tabular opacity-60">{counts[s]}</span>
              </Chip>
            ) : null
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="card px-6 py-16 text-center text-secondary">
          {projects.length === 0 ? "No projects yet. Create your first one." : "No projects match."}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {filtered.map((p) => {
            const pct = p.booked_amount > 0 ? (p.paid / p.booked_amount) * 100 : 0;
            const dl = relativeDeadline(p.deadline);
            return (
              <div key={p.id} className="card relative flex flex-col transition-colors hover:bg-[var(--card-hover)]">
                <Link href={`/dashboard/projects/${p.id}`} className="pressable flex flex-1 flex-col p-5">
                  <div className="mb-3 pr-9">
                    <StatusBadge status={p.status} />
                  </div>
                  <h3 className="text-[17px] font-semibold leading-snug">{p.title}</h3>
                  <div className="mt-1 truncate text-[13px] text-secondary">
                    {p.manager ? `via ${p.manager.name}` : "No source"}
                    {p.client_name ? ` · ${p.client_name}` : ""}
                  </div>

                  <div className="mt-auto pt-5">
                    <div className="flex items-end justify-between gap-3">
                      <div>
                        <div className="text-xs text-tertiary">Received</div>
                        <div className="tabular font-semibold" style={{ color: "var(--green)" }}>
                          {formatMoney(p.paid, p.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-tertiary">Balance</div>
                        <div
                          className="tabular font-semibold"
                          style={{ color: p.balance > 0 ? "var(--amber)" : "var(--text-2)" }}
                        >
                          {formatMoney(p.balance, p.currency)}
                        </div>
                      </div>
                    </div>
                    <ProgressBar value={pct} className="mt-3" />
                    <div className="mt-2 flex items-center justify-between gap-3 text-xs">
                      <span className="tabular text-tertiary">
                        {Math.round(pct)}% of {formatMoney(p.booked_amount, p.currency)}
                      </span>
                      <span style={{ color: DEADLINE_TONE[dl.tone] }}>{dl.text}</span>
                    </div>
                  </div>
                </Link>

                <div className="absolute right-3 top-3">
                  <ProjectEditor
                    managers={managers}
                    project={p}
                    trigger={{ icon: "pencil", variant: "icon", ariaLabel: `Edit ${p.title}` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className="pressable shrink-0 whitespace-nowrap rounded-full px-3.5 py-1.5 text-[13px] font-medium transition-colors"
      style={{
        background: active ? "var(--text)" : "rgba(255,255,255,0.08)",
        color: active ? "#000" : "var(--text-2)",
      }}
    >
      {children}
    </button>
  );
}
