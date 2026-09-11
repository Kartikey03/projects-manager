"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Wallet,
  FolderKanban,
  Users,
  TrendingUp,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as const },
  }),
};

const features = [
  {
    icon: FolderKanban,
    title: "Every project, one place",
    desc: "Track status from lead to delivered — no more scattered spreadsheets.",
  },
  {
    icon: Wallet,
    title: "Irregular payments, tamed",
    desc: "See booked vs. received vs. outstanding for each project, instantly.",
  },
  {
    icon: Users,
    title: "Know your sources",
    desc: "Attribute every gig to the person who brought it in.",
  },
  {
    icon: TrendingUp,
    title: "Cashflow at a glance",
    desc: "Live totals so you always know what you're owed.",
  },
];

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* animated background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="blob-1 absolute -top-32 -left-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: "radial-gradient(circle, #0a84ff, transparent 70%)" }}
        />
        <div
          className="blob-2 absolute top-40 -right-24 h-[480px] w-[480px] rounded-full opacity-30 blur-3xl"
          style={{ background: "radial-gradient(circle, #bf5af2, transparent 70%)" }}
        />
        <div
          className="blob-1 absolute bottom-0 left-1/3 h-[360px] w-[360px] rounded-full opacity-25 blur-3xl"
          style={{ background: "radial-gradient(circle, #30d158, transparent 70%)" }}
        />
      </div>

      {/* nav */}
      <header className="glass sticky top-0 z-20 border-b" style={{ borderColor: "var(--border)" }}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2 font-semibold">
            <div
              className="flex h-8 w-8 items-center justify-center rounded-xl text-white"
              style={{ background: "var(--accent)" }}
            >
              <Sparkles size={17} />
            </div>
            Projects Manager
          </div>
          <Link
            href="/login"
            className="btn-primary px-5 py-2 text-sm"
          >
            Sign in
          </Link>
        </div>
      </header>

      {/* hero */}
      <section className="mx-auto max-w-6xl px-6 pt-20 pb-16 text-center sm:pt-28">
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={0}
          className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm text-secondary"
          style={{ borderColor: "var(--border)", background: "var(--card-solid)" }}
        >
          <ShieldCheck size={15} style={{ color: "var(--green)" }} />
          Your data stays private — visible only after you sign in
        </motion.div>

        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={1}
          className="mx-auto max-w-3xl text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl"
        >
          Freelance projects &amp; payments,
          <br />
          <span
            style={{
              background: "linear-gradient(90deg, #0a84ff, #bf5af2)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            finally organised.
          </span>
        </motion.h1>

        <motion.p
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={2}
          className="mx-auto mt-6 max-w-xl text-lg text-secondary"
        >
          Ditch the spreadsheet. Manage projects, the people who bring them to you,
          and every irregular payment — all in one calm, fast dashboard.
        </motion.p>

        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="show"
          custom={3}
          className="mt-9 flex items-center justify-center gap-3"
        >
          <Link href="/login" className="btn-primary inline-flex items-center gap-2 px-7 py-3 text-[15px]">
            Open your dashboard <ArrowRight size={17} />
          </Link>
        </motion.div>

        {/* preview mock */}
        <motion.div
          initial={{ opacity: 0, y: 60, rotateX: 12 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ delay: 0.4, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="card mx-auto mt-16 max-w-4xl overflow-hidden p-0 text-left"
          style={{ boxShadow: "var(--shadow-lg)" }}
        >
          <div className="flex items-center gap-1.5 border-b px-4 py-3" style={{ borderColor: "var(--border)" }}>
            <span className="h-3 w-3 rounded-full" style={{ background: "#ff5f57" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#febc2e" }} />
            <span className="h-3 w-3 rounded-full" style={{ background: "#28c840" }} />
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-3">
            {[
              { label: "Total booked", value: "₹4,80,000", tone: "var(--text)" },
              { label: "Received", value: "₹3,15,000", tone: "var(--green)" },
              { label: "Outstanding", value: "₹1,65,000", tone: "var(--amber)" },
            ].map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + i * 0.1 }}
                className="rounded-2xl border p-4"
                style={{ borderColor: "var(--border)", background: "var(--bg)" }}
              >
                <div className="text-xs text-secondary">{s.label}</div>
                <div className="mt-1 text-2xl font-semibold" style={{ color: s.tone }}>
                  {s.value}
                </div>
              </motion.div>
            ))}
          </div>
          <div className="space-y-2 px-6 pb-6">
            {["Landing page for Acme", "Mobile app UI kit", "Brand identity — Nova"].map(
              (t, i) => (
                <motion.div
                  key={t}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 + i * 0.12 }}
                  className="flex items-center justify-between rounded-xl border px-4 py-3"
                  style={{ borderColor: "var(--border)", background: "var(--card-solid)" }}
                >
                  <span className="text-sm font-medium">{t}</span>
                  <span
                    className="rounded-full px-2.5 py-1 text-xs font-medium"
                    style={{
                      background: "rgba(10,132,255,0.12)",
                      color: "var(--accent)",
                    }}
                  >
                    In Progress
                  </span>
                </motion.div>
              )
            )}
          </div>
        </motion.div>
      </section>

      {/* features */}
      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-60px" }}
              custom={i}
              className="card p-6"
            >
              <div
                className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl"
                style={{ background: "rgba(10,132,255,0.12)", color: "var(--accent)" }}
              >
                <f.icon size={20} />
              </div>
              <h3 className="mb-1.5 font-semibold">{f.title}</h3>
              <p className="text-sm text-secondary">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <footer className="border-t py-8 text-center text-sm text-tertiary" style={{ borderColor: "var(--border)" }}>
        Built for freelancers who&apos;d rather be creating than reconciling.
      </footer>
    </div>
  );
}
