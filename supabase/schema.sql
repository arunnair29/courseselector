-- CourseSelector: accounts, shortlist & admission plan schema.
--
-- How to use: create a free project at supabase.com, open the SQL Editor
-- for that project, paste this whole file in, and run it once. Then copy
-- the Project URL + anon public key (Project Settings -> API) into
-- .env.local (see .env.example) for local dev, and into this repo's
-- GitHub Actions secrets (VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY) so
-- the deployed site can use them too.
--
-- Auth itself (sign up / sign in) is handled entirely by Supabase's
-- built-in `auth.users` table — nothing to create for that. The two
-- tables below are the only app-specific data this site needs, and both
-- use Row Level Security so a signed-in user can only ever read or write
-- their own rows, no matter what the anon key allows elsewhere.

-- 1. Shortlist: which course ids a user has starred.
create table if not exists public.shortlists (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  created_at timestamptz not null default now(),
  unique (user_id, course_id)
);

alter table public.shortlists enable row level security;

create policy "shortlists: select own" on public.shortlists
  for select using (auth.uid() = user_id);

create policy "shortlists: insert own" on public.shortlists
  for insert with check (auth.uid() = user_id);

create policy "shortlists: delete own" on public.shortlists
  for delete using (auth.uid() = user_id);

-- 2. Admission plan items: checklist steps (with optional due date +
--    completed flag) and a single free-text note, per user per course.
create table if not exists public.plan_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  course_id text not null,
  kind text not null default 'checklist' check (kind in ('checklist', 'note')),
  text text not null,
  due_date date,
  completed boolean not null default false,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.plan_items enable row level security;

create policy "plan_items: select own" on public.plan_items
  for select using (auth.uid() = user_id);

create policy "plan_items: insert own" on public.plan_items
  for insert with check (auth.uid() = user_id);

create policy "plan_items: update own" on public.plan_items
  for update using (auth.uid() = user_id);

create policy "plan_items: delete own" on public.plan_items
  for delete using (auth.uid() = user_id);

create index if not exists plan_items_user_course_idx
  on public.plan_items (user_id, course_id);
