create table if not exists public.research_projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  topic text not null,
  academic_level text not null check (academic_level in ('Bachelor''s', 'Master''s', 'PhD')),
  result_json jsonb not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.research_projects enable row level security;

drop policy if exists "Users can read own research projects" on public.research_projects;
create policy "Users can read own research projects"
  on public.research_projects
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own research projects" on public.research_projects;
create policy "Users can insert own research projects"
  on public.research_projects
  for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "Users can update own research projects" on public.research_projects;
create policy "Users can update own research projects"
  on public.research_projects
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Users can delete own research projects" on public.research_projects;
create policy "Users can delete own research projects"
  on public.research_projects
  for delete
  to authenticated
  using (auth.uid() = user_id);

create index if not exists research_projects_user_updated_idx
  on public.research_projects (user_id, updated_at desc);
