-- ==============================================================================
-- Persona / AlgoPulse: 3-Month Placement Preparation & Job Application Schema
-- Supports 90-Day Placement Sprint, Daily DSA (2 LC, min 1 Medium), 
-- 1-Hour Project Focus, 10 Daily Applications, 5-7 Weekly Referrals, 
-- Weekend Mock Tests/Contests/Interviews, and Smart Reminders Engine.
-- ==============================================================================

-- 1. Placement Settings Table
create table if not exists public.placement_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    daily_application_target integer default 10,
    weekly_referral_target integer default 7,
    daily_dsa_target integer default 2,
    daily_project_hours integer default 1,
    sprint_start_date text,
    sprint_end_date text,
    timezone text default 'Asia/Kolkata',
    sound_enabled boolean default true,
    vibration_enabled boolean default true,
    browser_notifications_enabled boolean default false,
    snooze_default_minutes integer default 10,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. Placement Reminder Schedules
create table if not exists public.placement_reminders (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null, -- 'morning_review', 'dsa_session', 'project_session', 'job_applications', 'referral_outreach', 'weekend_assessment', 'evening_review', 'custom'
    title text not null,
    description text,
    preferred_time text not null default '10:00', -- "HH:MM"
    preferred_days jsonb default '[1,2,3,4,5]'::jsonb, -- array of day numbers [0..6]
    enabled boolean default true,
    snoozed_until timestamptz,
    last_triggered_date text,
    target_count integer,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. Job Applications Table
create table if not exists public.placement_applications (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    company text not null,
    role text not null,
    platform text not null default 'LinkedIn', -- 'LinkedIn', 'Naukri', 'Company Portal', 'Wellfound', etc.
    job_link text,
    application_date text not null, -- YYYY-MM-DD
    status text not null default 'Applied', -- 'Applied', 'Screening', 'Online Assessment', 'Technical Interview', 'HR Round', 'Offered', 'Rejected', 'Withdrawn'
    referral_contact text,
    notes text,
    location text,
    salary_range text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Referral Outreach Table
create table if not exists public.placement_referrals (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    contact_name text not null,
    company text not null,
    role text not null,
    profile_link text not null,
    date_contacted text not null, -- YYYY-MM-DD
    response_status text not null default 'Pending', -- 'Pending', 'Connected', 'Referral Submitted', 'Declined', 'No Response'
    follow_up_date text, -- YYYY-MM-DD
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 5. Weekend Assessments Table
create table if not exists public.placement_assessments (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null, -- 'mock_test', 'coding_contest', 'mock_interview'
    title text not null,
    date text not null, -- YYYY-MM-DD
    status text not null default 'Pending', -- 'Pending', 'Completed', 'Rescheduled'
    score_or_rank text,
    duration_minutes integer,
    feedback text,
    mistakes text,
    improvement_areas text,
    partner_or_platform text,
    rescheduled_date text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 6. Placement Daily Tasks (Recurring and Overdue Tracker)
create table if not exists public.placement_daily_tasks (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    date text not null, -- YYYY-MM-DD
    category text not null, -- 'dsa', 'project', 'applications', 'referrals', 'weekend', 'review'
    title text not null,
    description text,
    status text not null default 'pending', -- 'pending', 'partially_completed', 'completed', 'rescheduled'
    target_count integer,
    current_count integer default 0,
    time_spent_minutes integer default 0,
    notes text,
    rescheduled_to text,
    is_overdue boolean default false,
    completed_at timestamptz,
    details jsonb default '{}'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 7. Project Session Logs Table
create table if not exists public.placement_project_sessions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    date text not null, -- YYYY-MM-DD
    title text not null,
    duration_minutes integer not null default 60,
    notes text,
    repo_or_branch text,
    completed_at timestamptz default now()
);

-- ==============================================================================
-- Row Level Security (RLS) Setup
-- ==============================================================================

alter table public.placement_settings enable row level security;
alter table public.placement_reminders enable row level security;
alter table public.placement_applications enable row level security;
alter table public.placement_referrals enable row level security;
alter table public.placement_assessments enable row level security;
alter table public.placement_daily_tasks enable row level security;
alter table public.placement_project_sessions enable row level security;

-- Policies for placement_settings
create policy "Users can view their own placement settings"
    on public.placement_settings for select using (auth.uid() = user_id);
create policy "Users can insert/update their own placement settings"
    on public.placement_settings for insert with check (auth.uid() = user_id);
create policy "Users can update their placement settings"
    on public.placement_settings for update using (auth.uid() = user_id);

-- Policies for placement_reminders
create policy "Users can view their own reminders"
    on public.placement_reminders for select using (auth.uid() = user_id);
create policy "Users can insert their own reminders"
    on public.placement_reminders for insert with check (auth.uid() = user_id);
create policy "Users can update their own reminders"
    on public.placement_reminders for update using (auth.uid() = user_id);
create policy "Users can delete their own reminders"
    on public.placement_reminders for delete using (auth.uid() = user_id);

-- Policies for placement_applications
create policy "Users can view their own job applications"
    on public.placement_applications for select using (auth.uid() = user_id);
create policy "Users can insert their own job applications"
    on public.placement_applications for insert with check (auth.uid() = user_id);
create policy "Users can update their own job applications"
    on public.placement_applications for update using (auth.uid() = user_id);
create policy "Users can delete their own job applications"
    on public.placement_applications for delete using (auth.uid() = user_id);

-- Policies for placement_referrals
create policy "Users can view their own referrals"
    on public.placement_referrals for select using (auth.uid() = user_id);
create policy "Users can insert their own referrals"
    on public.placement_referrals for insert with check (auth.uid() = user_id);
create policy "Users can update their own referrals"
    on public.placement_referrals for update using (auth.uid() = user_id);
create policy "Users can delete their own referrals"
    on public.placement_referrals for delete using (auth.uid() = user_id);

-- Policies for placement_assessments
create policy "Users can view their own assessments"
    on public.placement_assessments for select using (auth.uid() = user_id);
create policy "Users can insert their own assessments"
    on public.placement_assessments for insert with check (auth.uid() = user_id);
create policy "Users can update their own assessments"
    on public.placement_assessments for update using (auth.uid() = user_id);
create policy "Users can delete their own assessments"
    on public.placement_assessments for delete using (auth.uid() = user_id);

-- Policies for placement_daily_tasks
create policy "Users can view their own placement tasks"
    on public.placement_daily_tasks for select using (auth.uid() = user_id);
create policy "Users can insert their own placement tasks"
    on public.placement_daily_tasks for insert with check (auth.uid() = user_id);
create policy "Users can update their own placement tasks"
    on public.placement_daily_tasks for update using (auth.uid() = user_id);
create policy "Users can delete their own placement tasks"
    on public.placement_daily_tasks for delete using (auth.uid() = user_id);

-- Policies for placement_project_sessions
create policy "Users can view their own project sessions"
    on public.placement_project_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own project sessions"
    on public.placement_project_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own project sessions"
    on public.placement_project_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own project sessions"
    on public.placement_project_sessions for delete using (auth.uid() = user_id);

-- Helpful indices for high performance queries
create index if not exists idx_placement_apps_user_date on public.placement_applications(user_id, application_date);
create index if not exists idx_placement_referrals_user_date on public.placement_referrals(user_id, date_contacted);
create index if not exists idx_placement_tasks_user_date on public.placement_daily_tasks(user_id, date);
