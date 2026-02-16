-- WISE App: profiles, survey_responses, analysis_results
-- Run this in Supabase Dashboard → SQL Editor (or via Supabase CLI)

-- Profiles (user/contact and health context)
create table if not exists public.profiles (
  id uuid primary key default gen_random_uuid(),
  anonymous_id text unique,
  name text,
  email text,
  phone text,
  age int default 28,
  user_persona text default 'Self',
  is_pregnant boolean default false,
  is_postpartum boolean default false,
  contraception text,
  known_conditions jsonb default '[]'::jsonb,
  medications jsonb default '[]'::jsonb,
  is_upgraded boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Survey submissions (one per assessment)
create table if not exists public.survey_responses (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete set null,
  anonymous_id text,
  answers jsonb not null default '{}'::jsonb,
  selected_date text,
  created_at timestamptz default now()
);

-- Analysis results (one per survey response)
create table if not exists public.analysis_results (
  id uuid primary key default gen_random_uuid(),
  survey_response_id uuid references public.survey_responses(id) on delete cascade,
  triage_status text not null,
  ranked_conditions jsonb not null default '[]'::jsonb,
  red_flag_messages jsonb not null default '[]'::jsonb,
  summary text,
  report_date text,
  created_at timestamptz default now()
);

-- Indexes for lookups
create index if not exists idx_profiles_anonymous_id on public.profiles(anonymous_id);
create index if not exists idx_survey_responses_profile_id on public.survey_responses(profile_id);
create index if not exists idx_survey_responses_anonymous_id on public.survey_responses(anonymous_id);
create index if not exists idx_analysis_results_survey_response_id on public.analysis_results(survey_response_id);

-- RLS: enable row level security
alter table public.profiles enable row level security;
alter table public.survey_responses enable row level security;
alter table public.analysis_results enable row level security;

-- Policies: allow anon and authenticated to insert/select (app works without auth; tighten when you add auth)
create policy "Allow anon and auth insert profiles"
  on public.profiles for insert with check (true);
create policy "Allow anon and auth select profiles"
  on public.profiles for select using (true);
create policy "Allow anon and auth update profiles"
  on public.profiles for update using (true);

create policy "Allow anon and auth insert survey_responses"
  on public.survey_responses for insert with check (true);
create policy "Allow anon and auth select survey_responses"
  on public.survey_responses for select using (true);

create policy "Allow anon and auth insert analysis_results"
  on public.analysis_results for insert with check (true);
create policy "Allow anon and auth select analysis_results"
  on public.analysis_results for select using (true);

-- Optional: trigger to keep updated_at on profiles
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();
