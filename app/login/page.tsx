"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { FormError } from "@/components/form";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password });
    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }
    // The session cookie is set; a single navigation renders the dashboard.
    router.replace("/dashboard");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="mx-auto flex h-12 w-full max-w-[1080px] items-center px-4 sm:px-6">
        <Link href="/" className="link pressable -ml-1 inline-flex items-center text-sm">
          <ChevronLeft size={18} /> Home
        </Link>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 pb-24">
        <div className="fade-in w-full max-w-[360px]">
          <div className="mb-8 text-center">
            <Sparkles size={34} strokeWidth={1.8} className="mx-auto" />
            <h1 className="mt-4 text-[32px] font-semibold">Sign in</h1>
            <p className="mt-1 text-[15px] text-secondary">to your projects dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input min-h-12"
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              aria-label="Email"
            />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input min-h-12"
              placeholder="Password"
              autoComplete="current-password"
              aria-label="Password"
            />

            <FormError error={error} />

            <button type="submit" disabled={loading} className="btn-primary min-h-12 w-full text-[15px]">
              {loading && <Loader2 size={17} className="animate-spin" />}
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
