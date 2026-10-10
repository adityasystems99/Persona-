-- ==============================================================================
-- AlgoPulse 2.0 Migration: Adaptive DSA Intelligence Upgrade
-- Version: 20261010_algopulse_2_0
-- Safe, additive migration preserving existing tables and data
-- ==============================================================================

-- 1. Enhance public.dsa_problems with AlgoPulse 2.0 telemetry
alter table public.dsa_problems 
  add column if not exists hints_used integer default 0,
  add column if not exists hints_notes text,
  add column if not exists focus_time_seconds integer default 0,
  add column if not exists spaced_repetition_stage integer default 0,
  add column if not exists last_revision_outcome text check (last_revision_outcome in ('success', 'hints', 'failed', null)),
  add column if not exists last_revision_date text,
  add column if not exists reschedule_history jsonb default '[]'::jsonb;

-- 2. Enhance public.user_settings with configurable intervals & readiness weights
alter table public.user_settings
  add column if not exists spaced_repetition_intervals jsonb default '[1, 3, 7, 14]'::jsonb,
  add column if not exists readiness_weights jsonb default '{"coverage": 25, "independent": 25, "revision": 20, "difficulty": 15, "consistency": 15}'::jsonb;

-- 3. Dedicated Focus Sessions Table
create table if not exists public.focus_sessions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    problem_id text references public.dsa_problems(id) on delete set null,
    problem_title text not null,
    started_at timestamptz not null default now(),
    ended_at timestamptz,
    active_seconds integer default 0,
    break_seconds integer default 0,
    hints_used integer default 0,
    hint_notes text,
    mistakes_recorded text,
    status text not null check (status in ('completed', 'abandoned')) default 'completed',
    created_at timestamptz default now()
);

-- 4. STL Exercises Progress Table (for mastery milestones)
create table if not exists public.stl_exercises (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    exercise_id text not null,
    topic_id text not null,
    is_completed boolean default false,
    completed_at timestamptz,
    user_code text,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, exercise_id)
);

-- 5. Proof-of-Skill Milestones Table (idempotent tracking)
create table if not exists public.milestones (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    milestone_id text not null,
    title text not null,
    category text not null,
    target_value integer not null,
    current_value integer default 0,
    is_unlocked boolean default false,
    unlocked_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),
    unique(user_id, milestone_id)
);

-- 6. Reschedule & Adaptive Recovery Audit Table
create table if not exists public.reschedule_events (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    problem_id text references public.dsa_problems(id) on delete set null,
    problem_title text not null,
    date text not null, -- YYYY-MM-DD
    action text not null check (action in ('carry_over', 'reschedule', 'skip', 'retain')),
    previous_date text,
    target_date text,
    reason text,
    created_at timestamptz default now()
);

-- ==============================================================================
-- Row Level Security (RLS) for New Tables
-- ==============================================================================

alter table public.focus_sessions enable row level security;
alter table public.stl_exercises enable row level security;
alter table public.milestones enable row level security;
alter table public.reschedule_events enable row level security;

-- Focus Sessions RLS
create policy "Users can view their own focus sessions"
    on public.focus_sessions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own focus sessions"
    on public.focus_sessions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own focus sessions"
    on public.focus_sessions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own focus sessions"
    on public.focus_sessions for delete
    using (auth.uid() = user_id);

-- STL Exercises RLS
create policy "Users can view their own STL exercises"
    on public.stl_exercises for select
    using (auth.uid() = user_id);

create policy "Users can insert their own STL exercises"
    on public.stl_exercises for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own STL exercises"
    on public.stl_exercises for update
    using (auth.uid() = user_id);

-- Milestones RLS
create policy "Users can view their own milestones"
    on public.milestones for select
    using (auth.uid() = user_id);

create policy "Users can insert their own milestones"
    on public.milestones for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own milestones"
    on public.milestones for update
    using (auth.uid() = user_id);

-- Reschedule Events RLS
create policy "Users can view their own reschedule events"
    on public.reschedule_events for select
    using (auth.uid() = user_id);

create policy "Users can insert their own reschedule events"
    on public.reschedule_events for insert
    with check (auth.uid() = user_id);

-- ==============================================================================
-- Indexes for Sub-Millisecond Telemetry Queries
-- ==============================================================================

create index if not exists idx_focus_sessions_user on public.focus_sessions(user_id, started_at desc);
create index if not exists idx_focus_sessions_problem on public.focus_sessions(problem_id);
create index if not exists idx_stl_exercises_user on public.stl_exercises(user_id, topic_id);
create index if not exists idx_milestones_user on public.milestones(user_id, milestone_id);
create index if not exists idx_reschedule_events_user on public.reschedule_events(user_id, created_at desc);

-- Realtime Publications for AlgoPulse 2.0
alter publication supabase_realtime add table public.focus_sessions;
alter publication supabase_realtime add table public.stl_exercises;
alter publication supabase_realtime add table public.milestones;
alter publication supabase_realtime add table public.reschedule_events;
