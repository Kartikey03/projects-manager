import Link from "next/link";
import { ChevronRight, FolderKanban, Wallet, Users, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Every project, one place.",
    desc: "Track each job from lead to delivered without a spreadsheet in sight.",
  },
  {
    icon: Wallet,
    title: "Irregular payments, handled.",
    desc: "Booked, received and outstanding — per project, in every currency you bill.",
  },
  {
    icon: Users,
    title: "Know your sources.",
    desc: "See exactly how much work each person who refers you has brought in.",
  },
  {
    icon: ShieldCheck,
    title: "Private by design.",
    desc: "Your numbers are visible only after you sign in. Sharing the link shows nothing.",
  },
];

const preview = [
  { title: "Landing page for Acme", due: "₹25,000", pct: 50 },
  { title: "Mobile app UI kit", due: "$400", pct: 20 },
  { title: "Brand identity — Nova", due: "£300", pct: 70 },
];

export default function Landing() {
  return (
    <div className="min-h-screen">
      <header className="glass sticky top-0 z-40 border-b" style={{ borderColor: "var(--hairline)" }}>
        <div className="mx-auto flex h-12 max-w-[1080px] items-center justify-between px-4 sm:px-6">
          <span className="flex items-center gap-2 text-[15px] font-semibold">
            <Sparkles size={17} strokeWidth={2.2} /> Projects
          </span>
          <Link href="/login" className="link pressable text-sm">
            Sign in
          </Link>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-[1080px] px-5 pb-16 pt-20 text-center sm:pt-28">
          <p className="fade-in text-[17px] font-semibold text-secondary sm:text-[21px]">Projects Manager</p>
          <h1 className="fade-in fade-in-d1 mx-auto mt-2 max-w-3xl text-[44px] font-semibold leading-[1.05] sm:text-[72px]">
            Freelance work.
            <br />
            Finally in order.
          </h1>
          <p className="fade-in fade-in-d2 mx-auto mt-5 max-w-xl text-[19px] leading-snug text-secondary sm:text-[21px]">
            Projects, the people who bring them, and every irregular payment — in one calm place.
          </p>
          <div className="fade-in fade-in-d3 mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-6">
            <Link href="/login" className="btn-primary min-h-11 px-6 text-[17px]">
              Sign in
            </Link>
            <a href="#features" className="link pressable inline-flex items-center text-[17px]">
              Learn more <ChevronRight size={18} />
            </a>
          </div>
        </section>

        {/* product shot */}
        <section className="fade-in fade-in-d3 mx-auto max-w-4xl px-5">
          <div className="card overflow-hidden p-5 sm:p-8" style={{ border: "1px solid var(--hairline)" }}>
            <div className="grid grid-cols-3 gap-3 sm:gap-4">
              {[
                { label: "Booked", value: "₹4,80,000", tone: "var(--text)" },
                { label: "Received", value: "₹3,15,000", tone: "var(--green)" },
                { label: "Outstanding", value: "₹1,65,000", tone: "var(--amber)" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl p-3 sm:p-5" style={{ background: "var(--surface)" }}>
                  <div className="text-[11px] text-secondary sm:text-[13px]">{s.label}</div>
                  <div className="display tabular mt-1 truncate text-[15px] font-semibold sm:text-[26px]" style={{ color: s.tone }}>
                    {s.value}
                  </div>
                </div>
              ))}
            </div>
            <ul className="mt-4 divide-y rounded-2xl" style={{ background: "var(--surface)", borderColor: "var(--hairline)" }}>
              {preview.map((r) => (
                <li key={r.title} className="px-4 py-3.5 sm:px-5" style={{ borderColor: "var(--hairline)" }}>
                  <div className="flex items-baseline justify-between gap-3 text-sm sm:text-[15px]">
                    <span className="truncate font-medium">{r.title}</span>
                    <span className="tabular shrink-0 font-semibold" style={{ color: "var(--amber)" }}>
                      {r.due}
                    </span>
                  </div>
                  <div className="mt-2.5 h-1 overflow-hidden rounded-full" style={{ background: "rgba(255,255,255,0.1)" }}>
                    <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: "var(--green)" }} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-[1080px] scroll-mt-16 px-5 py-24">
          <h2 className="mx-auto max-w-2xl text-center text-[32px] font-semibold leading-tight sm:text-[48px]">
            Built for how freelancing actually works.
          </h2>
          <div className="mt-12 grid gap-3 sm:grid-cols-2 sm:gap-4">
            {features.map((f) => (
              <div key={f.title} className="card p-7 sm:p-9">
                <f.icon size={28} strokeWidth={1.8} className="text-secondary" />
                <h3 className="mt-5 text-[21px] font-semibold sm:text-[24px]">{f.title}</h3>
                <p className="mt-2 text-[15px] text-secondary sm:text-[17px]">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="border-t py-8 text-center text-xs text-tertiary" style={{ borderColor: "var(--hairline)" }}>
        Projects Manager · Your data stays private.
      </footer>
    </div>
  );
}
