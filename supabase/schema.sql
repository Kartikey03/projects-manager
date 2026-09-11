-- ===== Enums =====
do $$ begin
  create type project_status as enum ('lead','in_progress','review','completed','on_hold','cancelled');
exception when duplicate_object then null; end $$;

-- ===== managers (the people who bring you clients) =====
create table if not exists public.managers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  phone text,
  email text,
  notes text,
  created_at timestamptz not null default now()
);

-- ===== projects =====
create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  manager_id uuid references public.managers(id) on delete set null,
  client_name text,
  status project_status not null default 'lead',
  booked_amount numeric(12,2) not null default 0,
  currency text not null default 'INR',
  deadline date,
  started_at date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ===== payments =====
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  project_id uuid not null references public.projects(id) on delete cascade,
  amount numeric(12,2) not null,
  paid_on date not null default current_date,
  method text,
  notes text,
  created_at timestamptz not null default now()
);

-- ===== indexes =====
create index if not exists idx_projects_user on public.projects(user_id);
create index if not exists idx_projects_manager on public.projects(manager_id);
create index if not exists idx_payments_project on public.payments(project_id);
create index if not exists idx_payments_user on public.payments(user_id);
create index if not exists idx_managers_user on public.managers(user_id);

-- ===== updated_at trigger =====
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trg_projects_updated on public.projects;
create trigger trg_projects_updated before update on public.projects
  for each row execute function public.set_updated_at();

-- ===== Row Level Security =====
alter table public.managers enable row level security;
alter table public.projects enable row level security;
alter table public.payments enable row level security;

-- managers policies
drop policy if exists "own managers" on public.managers;
create policy "own managers" on public.managers
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- projects policies
drop policy if exists "own projects" on public.projects;
create policy "own projects" on public.projects
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- payments policies
drop policy if exists "own payments" on public.payments;
create policy "own payments" on public.payments
  for all to authenticated using (auth.uid() = user_id) with check (auth.uid() = user_id);
