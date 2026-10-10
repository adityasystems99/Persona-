-- ==============================================================================
-- AlgoPulse 2.0: Academic Intelligence Tracker Supabase Schema & Migration
-- Supports Semester 5 Engineering Subjects, Daily Planner, Deadlines,
-- Notes, Spaced Revision, Attendance Tracking, Analytics, & Notifications.
-- ==============================================================================

-- 1. Academic Semesters Table
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

-- 2. Academic Subjects Table
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

-- 3. Academic Units Table (Syllabus Structure)
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

-- 4. Academic Topics Table
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

-- 5. Academic Daily Tasks Table
create table if not exists public.academic_tasks (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    unit_id text references public.academic_units(id) on delete set null,
    topic_id text references public.academic_topics(id) on delete set null,
    title text not null,
    description text,
    scheduled_date text not null, -- YYYY-MM-DD
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

-- 6. Academic Study Sessions Table (Logged Time Records)
create table if not exists public.academic_study_sessions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    task_id text references public.academic_tasks(id) on delete set null,
    date text not null, -- YYYY-MM-DD
    duration_minutes integer default 0,
    notes text,
    focus_score integer,
    created_at timestamptz default now()
);

-- 7. Academic Assignments & Coursework
create table if not exists public.academic_assignments (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    description text,
    assigned_date text,
    due_date text not null, -- YYYY-MM-DD
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

-- 8. Academic Examinations Table
create table if not exists public.academic_exams (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    title text not null,
    exam_date text not null, -- YYYY-MM-DD
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

-- 9. Academic Subject Notes Table
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

-- 10. Academic Resources & References Library
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

-- 11. Smart Spaced Revision Table
create table if not exists public.academic_revisions (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    topic_id text references public.academic_topics(id) on delete set null,
    title text not null,
    last_studied_date text not null,
    last_revision_date text,
    scheduled_date text not null, -- YYYY-MM-DD
    stage integer default 0,
    confidence_rating integer default 3 check (confidence_rating between 1 and 5),
    last_outcome text check (last_outcome in ('strong', 'partial', 'poor')),
    history jsonb default '[]'::jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

-- 12. Class Attendance Log Table
create table if not exists public.academic_attendance (
    id text primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    subject_id text references public.academic_subjects(id) on delete cascade not null,
    class_date text not null, -- YYYY-MM-DD
    class_type text check (class_type in ('Lecture', 'Lab', 'Tutorial')) default 'Lecture',
    status text check (status in ('present', 'absent', 'excused')) default 'present',
    notes text,
    created_at timestamptz default now(),
    unique(user_id, subject_id, class_date, class_type)
);

-- 13. Academic Settings Table
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

-- 14. Academic Notifications Table
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

-- ==============================================================================
-- Indexes for High-Velocity Queries
-- ==============================================================================
create index if not exists idx_academic_subjects_user on public.academic_subjects(user_id, is_archived);
create index if not exists idx_academic_tasks_user_date on public.academic_tasks(user_id, scheduled_date);
create index if not exists idx_academic_tasks_user_subject on public.academic_tasks(user_id, subject_id, status);
create index if not exists idx_academic_assignments_due on public.academic_assignments(user_id, due_date, status);
create index if not exists idx_academic_exams_date on public.academic_exams(user_id, exam_date);
create index if not exists idx_academic_revisions_scheduled on public.academic_revisions(user_id, scheduled_date);
create index if not exists idx_academic_attendance_user_sub on public.academic_attendance(user_id, subject_id, class_date);
create index if not exists idx_academic_notes_user_sub on public.academic_notes(user_id, subject_id);

-- ==============================================================================
-- Row-Level Security (RLS) Policies
-- ==============================================================================
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

-- ==============================================================================
-- Idempotent Semester 5 Seeding Function
-- ==============================================================================
create or replace function public.seed_semester_5_subjects(target_user_id uuid)
returns void language plpgsql security definer as $$
declare
    v_semester_id text := target_user_id::text || '_sem_5';
begin
    -- 1. Seed Semester 5 if not exists
    insert into public.academic_semesters (id, user_id, semester_number, title, is_active)
    values (v_semester_id, target_user_id, 5, 'Semester 5 — Academic Sprint', true)
    on conflict (id) do nothing;

    -- 2. Seed the 6 Core Semester 5 Subjects
    insert into public.academic_subjects (id, user_id, semester_id, code, name, credits, description, color, order_index)
    values
        (target_user_id::text || '_sub_daa', target_user_id, v_semester_id, 'DAA', 'Design and Analysis of Algorithms', 4.0, 'Algorithm design paradigms, asymptotic analysis, divide & conquer, greedy, dynamic programming, and graph algorithms.', '#8b5cf6', 0),
        (target_user_id::text || '_sub_cn', target_user_id, v_semester_id, 'CN', 'Computer Networks', 4.0, 'OSI/TCP-IP models, packet switching, data link protocols, routing algorithms, transport layer protocols, and socket programming.', '#06b6d4', 1),
        (target_user_id::text || '_sub_se', target_user_id, v_semester_id, 'SE', 'Software Engineering', 3.0, 'SDLC methodologies, Agile, requirements engineering, architectural design, software testing, QA, and maintenance.', '#10b981', 2),
        (target_user_id::text || '_sub_ee', target_user_id, v_semester_id, 'EE', 'Engineering Economics', 3.0, 'Cost estimation, interest formulas, cash-flow diagrams, present worth analysis, depreciation, and financial feasibility.', '#f59e0b', 3),
        (target_user_id::text || '_sub_dos', target_user_id, v_semester_id, 'DOS', 'Distributed Operating Systems', 4.0, 'Distributed synchronization, logical clocks, mutual exclusion, election algorithms, deadlock handling, RPC, and distributed file systems.', '#ec4899', 4),
        (target_user_id::text || '_sub_dmdw', target_user_id, v_semester_id, 'DMDW', 'Data Mining and Data Warehousing', 4.0, 'Data warehousing architectures, OLAP cubes, association rule mining, classification, clustering algorithms, and web mining.', '#3b82f6', 5)
    on conflict (id) do nothing;

    -- 3. Seed Default Academic Settings
    insert into public.academic_settings (user_id, semester_id, minimum_attendance_threshold, daily_study_target_minutes, reminders_enabled)
    values (target_user_id, v_semester_id, 75, 180, true)
    on conflict (user_id) do nothing;
end;
$$;
