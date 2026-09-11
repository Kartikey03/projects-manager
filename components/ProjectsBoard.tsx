"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Plus, Search, Pencil } from "lucide-react";
import { ProjectEditor } from "@/components/ProjectEditor";
import { StatusBadge, ProgressBar } from "@/components/StatusBadge";
import { formatMoney, relativeDeadline } from "@/lib/format";
import {
  STATUS_ORDER,
  STATUS_META,
  type Manager,
  type ProjectStatus,
  type ProjectWithStats,
} from "@/lib/types";

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
    for (const s of STATUS_ORDER) c[s] = 0;
    for (const p of projects) c[p.status] = (c[p.status] ?? 0) + 1;
    return c;
  }, [projects]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return projects.filter((p) => {
      if (status !== "all" && p.status !== status) return false;
      if (!q) return true;
      return (
        p.title.toLowerCase().includes(q) ||
        (p.client_name ?? "").toLowerCase().includes(q) ||
        (p.manager?.name ?? "").toLowerCase().includes(q)
      );
    });
  }, [projects, query, status]);

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
          <p className="mt-1 text-secondary">{projects.length} in total</p>
        </div>
        <ProjectEditor
          managers={managers}
          trigger={(open) => (
            <button onClick={open} className="btn-primary flex items-center gap-2 px-5 py-2.5 text-sm">
              <Plus size={17} /> New project
            </button>
          )}
        />
      </div>

      {/* controls */}
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative sm:w-72">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-tertiary"
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search title, client or source…"
            className="input w-full py-2.5 pl-10 pr-4 text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Chip active={status === "all"} onClick={() => setStatus("all")}>
            All <span className="opacity-60">{counts.all}</span>
          </Chip>
          {STATUS_ORDER.map((s) =>
            counts[s] ? (
              <Chip key={s} active={status === s} onClick={() => setStatus(s)}>
                {STATUS_META[s].label} <span className="opacity-60">{counts[s]}</span>
              </Chip>
            ) : null
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed py-20 text-center" style={{ borderColor: "var(--border-strong)" }}>
          <p className="text-secondary">No projects match.</p>
        </div>
      ) : (
        <motion.div layout className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout">
            {filtered.map((p) => {
              const pct = p.booked_amount > 0 ? (p.paid / p.booked_amount) * 100 : 0;
              const dl = relativeDeadline(p.deadline);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                  className="card group relative flex flex-col p-5"
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <StatusBadge status={p.status} />
                    <ProjectEditor
                      managers={managers}
                      project={p}
                      trigger={(open) => (
                        <button
                          onClick={open}
                          className="rounded-full p-1.5 text-tertiary opacity-0 transition hover:bg-[var(--border)] hover:text-[var(--text)] group-hover:opacity-100"
                          aria-label="Edit"
                        >
                          <Pencil size={15} />
                        </button>
                      )}
                    />
                  </div>

                  <Link href={`/dashboard/projects/${p.id}`} className="flex flex-1 flex-col">
                    <h3 className="text-[15px] font-semibold leading-snug">{p.title}</h3>
                    <div className="mt-1 text-xs text-secondary">
                      {p.manager ? `via ${p.manager.name}` : "No source"}
                      {p.client_name ? ` · ${p.client_name}` : ""}
                    </div>

                    <div className="mt-4 flex items-end justify-between">
                      <div>
                        <div className="text-xs text-tertiary">Received</div>
                        <div className="font-semibold" style={{ color: "var(--green)" }}>
                          {formatMoney(p.paid, p.currency)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-tertiary">Balance</div>
                        <div
                          className="font-semibold"
                          style={{ color: p.balance > 0 ? "var(--amber)" : "var(--text-secondary)" }}
                        >
                          {formatMoney(p.balance, p.currency)}
                        </div>
                      </div>
                    </div>

                    <div className="mt-3">
                      <ProgressBar value={pct} />
                      <div className="mt-2 flex items-center justify-between text-xs">
                        <span className="text-tertiary">
                          {Math.round(pct)}% of {formatMoney(p.booked_amount, p.currency)}
                        </span>
                        <span
                          style={{
                            color:
                              dl.tone === "over"
                                ? "var(--red)"
                                : dl.tone === "soon"
                                ? "var(--amber)"
                                : "var(--text-tertiary)",
                          }}
                        >
                          {dl.text}
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
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
      onClick={onClick}
      className="rounded-full border px-3.5 py-1.5 text-sm font-medium transition"
      style={{
        borderColor: active ? "transparent" : "var(--border-strong)",
        background: active ? "var(--accent)" : "transparent",
        color: active ? "#fff" : "var(--text-secondary)",
      }}
    >
      {children}
    </button>
  );
}
