-- ==============================================================================
-- AlgoPulse: Playlists & Video Timestamps Upgrade Migration
-- Adds support for:
-- 1. DSA Topicwise Prep, System Design, DBMS, CN & OS playlists
-- 2. Custom sequential ordering
-- 3. Watch timestamp tracking (watched_seconds, duration_seconds)
-- 4. Timestamp notes / key moment bookmarks
-- ==============================================================================

-- 1. Study Playlists Table
CREATE TABLE IF NOT EXISTS public.study_playlists (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL CHECK (category IN ('dsa', 'system-design', 'dbms', 'cn-os')),
  title TEXT NOT NULL,
  description TEXT,
  topic TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. Playlist Items Table
CREATE TABLE IF NOT EXISTS public.playlist_items (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  playlist_id TEXT NOT NULL REFERENCES public.study_playlists(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  video_url TEXT NOT NULL,
  topic TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  duration_seconds INTEGER NOT NULL DEFAULT 0,
  watched_seconds INTEGER NOT NULL DEFAULT 0,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  notes TEXT,
  bookmarks JSONB NOT NULL DEFAULT '[]'::jsonb,
  last_watched_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_study_playlists_user_category ON public.study_playlists(user_id, category, order_index);
CREATE INDEX IF NOT EXISTS idx_playlist_items_playlist_order ON public.playlist_items(playlist_id, order_index);
CREATE INDEX IF NOT EXISTS idx_playlist_items_user_id ON public.playlist_items(user_id);

-- Enable RLS
ALTER TABLE public.study_playlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.playlist_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for study_playlists
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'study_playlists' AND policyname = 'Users can view own study_playlists'
  ) THEN
    CREATE POLICY "Users can view own study_playlists"
      ON public.study_playlists FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'study_playlists' AND policyname = 'Users can insert own study_playlists'
  ) THEN
    CREATE POLICY "Users can insert own study_playlists"
      ON public.study_playlists FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'study_playlists' AND policyname = 'Users can update own study_playlists'
  ) THEN
    CREATE POLICY "Users can update own study_playlists"
      ON public.study_playlists FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'study_playlists' AND policyname = 'Users can delete own study_playlists'
  ) THEN
    CREATE POLICY "Users can delete own study_playlists"
      ON public.study_playlists FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- RLS Policies for playlist_items
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'playlist_items' AND policyname = 'Users can view own playlist_items'
  ) THEN
    CREATE POLICY "Users can view own playlist_items"
      ON public.playlist_items FOR SELECT
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'playlist_items' AND policyname = 'Users can insert own playlist_items'
  ) THEN
    CREATE POLICY "Users can insert own playlist_items"
      ON public.playlist_items FOR INSERT
      WITH CHECK (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'playlist_items' AND policyname = 'Users can update own playlist_items'
  ) THEN
    CREATE POLICY "Users can update own playlist_items"
      ON public.playlist_items FOR UPDATE
      USING (auth.uid() = user_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'playlist_items' AND policyname = 'Users can delete own playlist_items'
  ) THEN
    CREATE POLICY "Users can delete own playlist_items"
      ON public.playlist_items FOR DELETE
      USING (auth.uid() = user_id);
  END IF;
END $$;

-- Add to Realtime Publication if active
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
    BEGIN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.study_playlists;
      ALTER PUBLICATION supabase_realtime ADD TABLE public.playlist_items;
    EXCEPTION
      WHEN duplicate_object THEN NULL;
    END;
  END IF;
END $$;
