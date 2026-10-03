# Ordo

A calm, fast dashboard for freelancers to track **projects**, the **people who bring
them in**, and **irregular payments** — replacing the spreadsheet.

Built with **Next.js (App Router) + React + Supabase**, with lightweight CSS animations,
styled with **Tailwind CSS** and Apple's system font (San Francisco).

## Features

- 🔐 **Private by default** — the landing page is public, but all your data lives behind
  login and is enforced at the database level with Row Level Security. Sign-ups are
  disabled, so sharing the link never exposes your numbers.
- 📁 **Projects** — status (lead → in progress → review → completed / on hold / cancelled),
  booked amount, client, deadline, and the person who brought it in.
- 👥 **People** — the middlemen/sources who send you work, with per-person totals.
- 💰 **Payments** — log each irregular payment; the app computes received vs. outstanding
  balance per project and a monthly ledger.
- 📊 **Overview** — total booked, received, outstanding, and what's awaiting payment.
- ✨ Smooth animations, dark mode, fully responsive.

## Tech stack

| Layer     | Choice                                   |
| --------- | ---------------------------------------- |
| Framework | Next.js 16 (App Router, Server Actions)  |
| UI        | React, Tailwind CSS, lucide-react |
| Backend   | Supabase (Postgres + Auth + RLS)         |
| Auth      | Supabase email/password via `@supabase/ssr` |

## Local development

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase project values:
   ```bash
   cp .env.example .env.local
   ```
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-publishable-anon-key>
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000 and sign in.

## Database

The schema (tables `managers`, `projects`, `payments`, an enum `project_status`, an
`updated_at` trigger, and RLS policies) lives in [`supabase/schema.sql`](supabase/schema.sql).
Every row is scoped to its owner via `user_id = auth.uid()`, and RLS policies only allow
the authenticated owner to read or write. Anonymous requests return nothing.

## Deploying

Deploy on Vercel: import the repo, add the two `NEXT_PUBLIC_SUPABASE_*` environment
variables, and deploy. Then set your Supabase project's **Auth → URL Configuration →
Site URL** to your production domain.

## Managing your login

- Change your password from the Supabase dashboard (**Authentication → Users**), or wire
  up a password-reset email later.
- New sign-ups are disabled. To add another user, create them in the Supabase dashboard.
