-- ==============================================================================
-- AlgoPulse: Supabase Cloud Database Schema & Row Level Security (RLS)
-- Dynamic Day Progression, Questions, STL Sessions, & Realtime Events
-- Run this script in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Study Days Table (Dynamic Multi-Day Progression)
create table if not exists public.study_days (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    day_number integer not null,
    title text not null,
    study_date text not null, -- YYYY-MM-DD
    deadline text default '23:00',
    status text not null check (status in ('Locked', 'Available', 'In Progress', 'Completed')) default 'Locked',
    is_unlocked boolean default false,
    requires_stl boolean default true,
    target_question_count integer default 4,
    target_easy integer default 2,
    target_medium integer default 2,
    target_hard integer default 1,
    total_time_minutes integer default 0,
    notes text,
    learning_outcomes text,
    completed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 2. DSA Problems / Questions Table
create table if not exists public.dsa_problems (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    study_day_id text references public.study_days(id) on delete set null,
    title text not null,
    topic text not null,
    subtopic text,
    difficulty text not null check (difficulty in ('Easy', 'Medium', 'Hard')),
    platform text not null,
    problem_number text,
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
    planned_order integer default 0,
    needs_revision boolean default false,
    revision_scheduled_date text,
    mistakes text,
    pattern_learned text,
    revision_history jsonb default '[]'::jsonb,
    completed_at timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 3. STL Practice Sessions Table
create table if not exists public.stl_practice_sessions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    study_day_id text references public.study_days(id) on delete set null,
    date text not null, -- YYYY-MM-DD
    total_seconds integer default 1800,
    remaining_seconds integer default 1800,
    is_completed boolean default false,
    completed_at timestamptz,
    current_topic_id text default 'vectors',
    notes text,
    code_snippet text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 4. Study Events / Notifications Table (WhatsApp Web Style)
create table if not exists public.study_events (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    study_day_id text references public.study_days(id) on delete cascade,
    event_type text not null,
    title text not null,
    message text not null,
    read_at timestamptz,
    created_at timestamptz default now()
);

-- 5. User Preferences & Settings Table
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
    timezone text default 'UTC',
    requires_stl_default boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 6. Study Logs (Daily Statistics) Table
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

alter table public.study_days enable row level security;
alter table public.dsa_problems enable row level security;
alter table public.stl_practice_sessions enable row level security;
alter table public.study_events enable row level security;
alter table public.user_settings enable row level security;
alter table public.study_logs enable row level security;

-- Policies for study_days
create policy "Users can view their own study days"
    on public.study_days for select
    using (auth.uid() = user_id);

create policy "Users can insert their own study days"
    on public.study_days for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own study days"
    on public.study_days for update
    using (auth.uid() = user_id);

create policy "Users can delete their own study days"
    on public.study_days for delete
    using (auth.uid() = user_id);

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

-- Policies for study_events
create policy "Users can view their own study events"
    on public.study_events for select
    using (auth.uid() = user_id);

create policy "Users can insert their own study events"
    on public.study_events for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own study events"
    on public.study_events for update
    using (auth.uid() = user_id);

create policy "Users can delete their own study events"
    on public.study_events for delete
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

-- 7. Focus Sessions Table (Feature 5: Focus Mode)
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

-- 8. STL Exercises Table (Feature 4: STL Mastery Arena)
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

-- 9. Milestones Table (Feature 7: Proof-of-Skill Milestones)
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

-- 10. Reschedule Events Table (Feature 1: Adaptive Recovery Engine)
create table if not exists public.reschedule_events (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    problem_id text references public.dsa_problems(id) on delete set null,
    problem_title text not null,
    date text not null,
    action text not null check (action in ('carry_over', 'reschedule', 'skip', 'retain')),
    previous_date text,
    target_date text,
    reason text,
    created_at timestamptz default now()
);

-- Enable RLS
alter table public.focus_sessions enable row level security;
alter table public.stl_exercises enable row level security;
alter table public.milestones enable row level security;
alter table public.reschedule_events enable row level security;

-- Focus Sessions RLS
create policy "Users can view their own focus sessions"
    on public.focus_sessions for select using (auth.uid() = user_id);
create policy "Users can insert their own focus sessions"
    on public.focus_sessions for insert with check (auth.uid() = user_id);
create policy "Users can update their own focus sessions"
    on public.focus_sessions for update using (auth.uid() = user_id);
create policy "Users can delete their own focus sessions"
    on public.focus_sessions for delete using (auth.uid() = user_id);

-- STL Exercises RLS
create policy "Users can view their own STL exercises"
    on public.stl_exercises for select using (auth.uid() = user_id);
create policy "Users can insert their own STL exercises"
    on public.stl_exercises for insert with check (auth.uid() = user_id);
create policy "Users can update their own STL exercises"
    on public.stl_exercises for update using (auth.uid() = user_id);

-- Milestones RLS
create policy "Users can view their own milestones"
    on public.milestones for select using (auth.uid() = user_id);
create policy "Users can insert their own milestones"
    on public.milestones for insert with check (auth.uid() = user_id);
create policy "Users can update their own milestones"
    on public.milestones for update using (auth.uid() = user_id);

-- Reschedule Events RLS
create policy "Users can view their own reschedule events"
    on public.reschedule_events for select using (auth.uid() = user_id);
create policy "Users can insert their own reschedule events"
    on public.reschedule_events for insert with check (auth.uid() = user_id);

-- Indexes for high-performance lookup
create index if not exists idx_study_days_user on public.study_days(user_id, day_number);
create index if not exists idx_study_days_status on public.study_days(user_id, status);
create index if not exists idx_dsa_problems_user on public.dsa_problems(user_id);
create index if not exists idx_dsa_problems_day on public.dsa_problems(study_day_id);
create index if not exists idx_stl_sessions_user on public.stl_practice_sessions(user_id, date);
create index if not exists idx_study_events_user on public.study_events(user_id, created_at desc);
create index if not exists idx_focus_sessions_user on public.focus_sessions(user_id, started_at desc);
create index if not exists idx_focus_sessions_problem on public.focus_sessions(problem_id);
create index if not exists idx_stl_exercises_user on public.stl_exercises(user_id, topic_id);
create index if not exists idx_milestones_user on public.milestones(user_id, milestone_id);
create index if not exists idx_reschedule_events_user on public.reschedule_events(user_id, created_at desc);

-- Realtime Publications for live auto-updating without manual page refresh
alter publication supabase_realtime add table public.study_days;
alter publication supabase_realtime add table public.dsa_problems;
alter publication supabase_realtime add table public.stl_practice_sessions;
alter publication supabase_realtime add table public.study_events;
-- 11. Study Playlists Table (Playlist Tracker & Timestamp Intelligence)
create table if not exists public.study_playlists (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    category text not null check (category in ('dsa', 'system-design', 'dbms', 'cn-os')),
    title text not null,
    description text,
    topic text,
    order_index integer not null default 0,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- 12. Playlist Items Table (Sequential Videos & Timestamp Tracking)
create table if not exists public.playlist_items (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    playlist_id text references public.study_playlists(id) on delete cascade not null,
    title text not null,
    video_url text not null,
    topic text,
    order_index integer not null default 0,
    duration_seconds integer not null default 0,
    watched_seconds integer not null default 0,
    is_completed boolean not null default false,
    notes text,
    bookmarks jsonb not null default '[]'::jsonb,
    last_watched_at timestamptz,
    updated_at timestamptz not null default now()
);

alter table public.study_playlists enable row level security;
alter table public.playlist_items enable row level security;

create policy "Users can view their own study playlists"
    on public.study_playlists for select using (auth.uid() = user_id);
create policy "Users can insert their own study playlists"
    on public.study_playlists for insert with check (auth.uid() = user_id);
create policy "Users can update their own study playlists"
    on public.study_playlists for update using (auth.uid() = user_id);
create policy "Users can delete their own study playlists"
    on public.study_playlists for delete using (auth.uid() = user_id);

create policy "Users can view their own playlist items"
    on public.playlist_items for select using (auth.uid() = user_id);
create policy "Users can insert their own playlist items"
    on public.playlist_items for insert with check (auth.uid() = user_id);
create policy "Users can update their own playlist items"
    on public.playlist_items for update using (auth.uid() = user_id);
create policy "Users can delete their own playlist items"
    on public.playlist_items for delete using (auth.uid() = user_id);

create index if not exists idx_study_playlists_user_category on public.study_playlists(user_id, category, order_index);
create index if not exists idx_playlist_items_playlist_order on public.playlist_items(playlist_id, order_index);
create index if not exists idx_playlist_items_user on public.playlist_items(user_id);

alter publication supabase_realtime add table public.study_playlists;
alter publication supabase_realtime add table public.playlist_items;

-- ==============================================================================
-- AlgoPulse 2.0: Academic Intelligence Tracker Supabase Schema
-- ==============================================================================

create table if not exists public.academic_semesters (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    semester_number integer not null default 5,
    title text not null default 'Semester 5 — Academic Sprint',
    start_date text,
    end_date text,
    target_gpa numeric(3, 2) default 9.00,
    is_active boolean default true,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_subjects (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    semester_id text references public.academic_semesters(id) on delete cascade,
    code text not null,
    name text not null,
    credits numeric(3, 1) default 4.0,
    description text,
    color text default '#8b5cf6',
    exam_date text,
    target_score numeric(4, 1) default 85.0,
    syllabus_url text,
    is_archived boolean default false,
    order_index integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_units (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    unit_number integer not null,
    title text not null,
    description text,
    weightage_percentage integer,
    order_index integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_topics (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    unit_id text references public.academic_units(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    description text,
    is_completed boolean default false,
    completed_at timestamptz,
    difficulty text check (difficulty in ('Easy', 'Medium', 'Hard')) default 'Medium',
    estimated_minutes integer default 45,
    order_index integer default 0,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_tasks (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    unit_id text references public.academic_units(id) on delete set null,
    topic_id text references public.academic_topics(id) on delete set null,
    title text not null,
    description text,
    scheduled_date text not null,
    planned_duration_minutes integer default 60,
    actual_time_minutes integer default 0,
    priority text check (priority in ('Low', 'Medium', 'High', 'Urgent')) default 'Medium',
    status text check (status in ('pending', 'in_progress', 'completed', 'skipped')) default 'pending',
    completion_timestamp timestamptz,
    notes text,
    needs_revision boolean default false,
    skip_reason text,
    reschedule_count integer default 0,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_study_sessions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    task_id text references public.academic_tasks(id) on delete set null,
    date text not null,
    duration_minutes integer default 0,
    notes text,
    focus_score integer,
    created_at timestamptz default now()
);

create table if not exists public.academic_assignments (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    description text,
    assigned_date text,
    due_date text not null,
    priority text check (priority in ('Low', 'Medium', 'High', 'Urgent')) default 'Medium',
    status text check (status in ('pending', 'in_progress', 'completed', 'submitted', 'graded')) default 'pending',
    resource_url text,
    submission_notes text,
    max_marks numeric(5, 2),
    obtained_marks numeric(5, 2),
    completion_timestamp timestamptz,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_exams (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    exam_date text not null,
    exam_time text default '10:00',
    exam_type text check (exam_type in ('Mid-Semester', 'End-Semester', 'Quiz', 'Lab Exam', 'Class Test')) default 'Mid-Semester',
    syllabus_coverage text,
    preparation_status text check (preparation_status in ('Not Started', 'In Progress', 'Ready', 'Mastered')) default 'Not Started',
    target_score numeric(4, 1) default 85.0,
    weightage_percentage integer,
    notes text,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_notes (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    unit_id text references public.academic_units(id) on delete set null,
    topic_id text references public.academic_topics(id) on delete set null,
    title text not null,
    content text not null,
    tags text[] default '{}'::text[],
    resource_url text,
    is_pinned boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_resources (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    resource_type text check (resource_type in ('Book / Textbook', 'Lecture Slides', 'Video Lecture', 'PYQ / Papers', 'Cheat Sheet', 'Website')) default 'Lecture Slides',
    url text not null,
    description text,
    tags text[] default '{}'::text[],
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_revisions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    topic_id text references public.academic_topics(id) on delete set null,
    title text not null,
    last_studied_date text not null,
    last_revision_date text,
    scheduled_date text not null,
    stage integer default 0,
    confidence_rating integer default 3 check (confidence_rating between 1 and 5),
    last_outcome text check (last_outcome in ('strong', 'partial', 'poor')),
    history jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create table if not exists public.academic_attendance (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    class_date text not null,
    class_type text check (class_type in ('Lecture', 'Lab', 'Tutorial')) default 'Lecture',
    status text check (status in ('present', 'absent', 'excused')) default 'present',
    notes text,
    created_at timestamptz default now(),
    unique(user_id, subject_id, class_date, class_type)
);

create table if not exists public.academic_settings (
    user_id uuid primary key references auth.users(id) on delete cascade,
    semester_id text,
    minimum_attendance_threshold integer default 75,
    daily_study_target_minutes integer default 180,
    revision_intervals integer[] default '{1, 3, 7, 14, 30}'::integer[],
    reminders_enabled boolean default true,
    quiet_hours_start text default '23:30',
    quiet_hours_end text default '07:30',
    updated_at timestamptz default now()
);

create table if not exists public.academic_notifications (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    type text not null,
    title text not null,
    message text not null,
    read_at timestamptz,
    related_id text,
    created_at timestamptz default now()
);

-- Indexes
create index if not exists idx_academic_subjects_user on public.academic_subjects(user_id, is_archived);
create index if not exists idx_academic_tasks_user_date on public.academic_tasks(user_id, scheduled_date);
create index if not exists idx_academic_assignments_due on public.academic_assignments(user_id, due_date, status);
create index if not exists idx_academic_exams_date on public.academic_exams(user_id, exam_date);
create index if not exists idx_academic_revisions_scheduled on public.academic_revisions(user_id, scheduled_date);
create index if not exists idx_academic_attendance_user_sub on public.academic_attendance(user_id, subject_id, class_date);

-- Enable RLS
alter table public.academic_semesters enable row level security;
alter table public.academic_subjects enable row level security;
alter table public.academic_units enable row level security;
alter table public.academic_topics enable row level security;
alter table public.academic_tasks enable row level security;
alter table public.academic_study_sessions enable row level security;
alter table public.academic_assignments enable row level security;
alter table public.academic_exams enable row level security;
alter table public.academic_notes enable row level security;
alter table public.academic_resources enable row level security;
alter table public.academic_revisions enable row level security;
alter table public.academic_attendance enable row level security;
alter table public.academic_settings enable row level security;
alter table public.academic_notifications enable row level security;

-- Policies
create policy "Users manage own semesters" on public.academic_semesters for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own subjects" on public.academic_subjects for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own units" on public.academic_units for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own topics" on public.academic_topics for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own tasks" on public.academic_tasks for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own study sessions" on public.academic_study_sessions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own assignments" on public.academic_assignments for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own exams" on public.academic_exams for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own notes" on public.academic_notes for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own resources" on public.academic_resources for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own revisions" on public.academic_revisions for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own attendance" on public.academic_attendance for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own settings" on public.academic_settings for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "Users manage own notifications" on public.academic_notifications for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Realtime publication
alter publication supabase_realtime add table public.academic_subjects;
alter publication supabase_realtime add table public.academic_tasks;
alter publication supabase_realtime add table public.academic_assignments;
alter publication supabase_realtime add table public.academic_attendance;


