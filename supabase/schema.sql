-- ==============================================================================
-- AlgoPulse: Supabase Cloud Database Schema & Row Level Security (RLS)
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. DSA Problems Table
create table if not exists public.dsa_problems (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    title text not null,
    topic text not null,
    subtopic text,
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    platform text not null,
    url text,
    status text not null check (status in ('Not Started', 'In Progress', 'Solved Independently', 'Solved with Hints', 'Needs Revision')),
    start_time timestamptz,
    completion_time timestamptz,
    time_spent_minutes integer default 0,
    notes text,
    approach text,
    time_complexity text,
    space_complexity text,
    attempts integer default 0,
    solved_independently boolean default false,
    in_today_plan boolean default false,
    order_in_plan integer default 0,
    needs_revision boolean default false,
    revision_scheduled_date text,
    mistakes text,
    pattern_learned text,
    revision_history jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. Daily Plans Table
create table if not exists public.daily_plans (
    id text primary key, -- formatted as {user_id}_{date}
    user_id uuid references auth.users(id) on delete cascade not null,
    date text not null, -- YYYY-MM-DD
    target_count integer default 4,
    target_easy integer default 2,
    target_medium integer default 2,
    target_hard integer default 1,
    deadline_time text default '23:00',
    notes text,
    stl_completed boolean default false,
    updated_at timestamptz default now()
);

-- 3. STL Practice Sessions Table
create table if not exists public.stl_practice_sessions (
    id text primary key, -- formatted as {user_id}_{date}
    user_id uuid references auth.users(id) on delete cascade not null,
    date text not null, -- YYYY-MM-DD
    total_seconds integer default 1800,
    remaining_seconds integer default 1800,
    is_completed boolean default false,
    completed_at timestamptz,
    current_topic_id text default 'vectors',
    notes text,
    code_snippet text,
    updated_at timestamptz default now()
);

-- 4. User Settings Table
create table if not exists public.user_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    study_start_time text default '09:00',
    study_end_time text default '23:30',
    hourly_reminders_enabled boolean default true,
    stl_reminder_enabled boolean default true,
    incomplete_target_reminder_enabled boolean default true,
    browser_notifications_enabled boolean default false,
    sound_enabled boolean default true,
    reminder_interval_minutes integer default 60,
    daily_target_easy integer default 2,
    daily_target_medium integer default 2,
    daily_target_hard integer default 1,
    updated_at timestamptz default now()
);

-- 5. Study Logs (Daily Statistics) Table
create table if not exists public.study_logs (
    id text primary key, -- formatted as {user_id}_{date}
    user_id uuid references auth.users(id) on delete cascade not null,
    date text not null, -- YYYY-MM-DD
    solved_count integer default 0,
    easy_solved integer default 0,
    medium_solved integer default 0,
    hard_solved integer default 0,
    independent_count integer default 0,
    hints_count integer default 0,
    dsa_minutes integer default 0,
    stl_minutes integer default 0,
    stl_completed boolean default false,
    target_met boolean default false,
    updated_at timestamptz default now()
);

-- ==============================================================================
-- Row Level Security (RLS) - Isolate user data so users only access their own
-- ==============================================================================

alter table public.dsa_problems enable row level security;
alter table public.daily_plans enable row level security;
alter table public.stl_practice_sessions enable row level security;
alter table public.user_settings enable row level security;
alter table public.study_logs enable row level security;

-- Policies for dsa_problems
create policy "Users can view their own problems"
    on public.dsa_problems for select
    using (auth.uid() = user_id);

create policy "Users can insert their own problems"
    on public.dsa_problems for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own problems"
    on public.dsa_problems for update
    using (auth.uid() = user_id);

create policy "Users can delete their own problems"
    on public.dsa_problems for delete
    using (auth.uid() = user_id);

-- Policies for daily_plans
create policy "Users can view their own daily plans"
    on public.daily_plans for select
    using (auth.uid() = user_id);

create policy "Users can insert their own daily plans"
    on public.daily_plans for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own daily plans"
    on public.daily_plans for update
    using (auth.uid() = user_id);

create policy "Users can delete their own daily plans"
    on public.daily_plans for delete
    using (auth.uid() = user_id);

-- Policies for stl_practice_sessions
create policy "Users can view their own STL sessions"
    on public.stl_practice_sessions for select
    using (auth.uid() = user_id);

create policy "Users can insert their own STL sessions"
    on public.stl_practice_sessions for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own STL sessions"
    on public.stl_practice_sessions for update
    using (auth.uid() = user_id);

create policy "Users can delete their own STL sessions"
    on public.stl_practice_sessions for delete
    using (auth.uid() = user_id);

-- Policies for user_settings
create policy "Users can view their own settings"
    on public.user_settings for select
    using (auth.uid() = user_id);

create policy "Users can insert/update their own settings"
    on public.user_settings for insert
    with check (auth.uid() = user_id);

create policy "Users can update their settings"
    on public.user_settings for update
    using (auth.uid() = user_id);

-- Policies for study_logs
create policy "Users can view their own study logs"
    on public.study_logs for select
    using (auth.uid() = user_id);

create policy "Users can insert their own study logs"
    on public.study_logs for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own study logs"
    on public.study_logs for update
    using (auth.uid() = user_id);

-- Indexes for performance
create index if not exists idx_dsa_problems_user_id on public.dsa_problems(user_id);
create index if not exists idx_dsa_problems_today on public.dsa_problems(user_id, in_today_plan);
create index if not exists idx_daily_plans_user_date on public.daily_plans(user_id, date);
create index if not exists idx_stl_sessions_user_date on public.stl_practice_sessions(user_id, date);
create index if not exists idx_study_logs_user_date on public.study_logs(user_id, date);
