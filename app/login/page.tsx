"use client";

import { useActionState } from "react";
import Link from "next/link";
import { ChevronLeft, Loader2, Sparkles } from "lucide-react";
import { FormError } from "@/components/form";
import { signIn, type SignInState } from "./actions";

const initial: SignInState = { error: null, email: "" };

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, initial);

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

          <form action={action} className="space-y-3">
            <input
              name="email"
              type="email"
              required
              defaultValue={state.email}
              key={state.email}
              className="input min-h-12"
              placeholder="Email"
              autoComplete="email"
              inputMode="email"
              aria-label="Email"
            />
            <input
              name="password"
              type="password"
              required
              className="input min-h-12"
              placeholder="Password"
              autoComplete="current-password"
              aria-label="Password"
            />

            <FormError error={state.error} />

            <button type="submit" disabled={pending} className="btn-primary min-h-12 w-full text-[15px]">
              {pending && <Loader2 size={17} className="animate-spin" />}
              {pending ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
