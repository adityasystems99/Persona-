import { createClient, SupabaseClient, User, Session } from '@supabase/supabase-js';
import {
  Problem,
  DailyPlan,
  STLPracticeState,
  AccountabilitySettings,
  StudyDayLog,
  Playlist,
  PlaylistItem,
} from '../types/dsa';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(
  supabaseUrl &&
  supabaseAnonKey &&
  supabaseUrl.startsWith('https://') &&
  !supabaseUrl.includes('your-project-id')
);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    })
  : null;

// ==============================================================================
// Data Serialization Mappers (camelCase <-> snake_case)
// ==============================================================================

export const mapProblemToRow = (problem: Problem, userId: string) => ({
  id: problem.id,
  user_id: userId,
  title: problem.title,
  topic: problem.topic,
  subtopic: problem.subtopic || null,
  difficulty: problem.difficulty,
  platform: problem.platform,
  url: problem.url || null,
  status: problem.status,
  start_time: problem.startTime || null,
  completion_time: problem.completionTime || null,
  time_spent_minutes: problem.timeSpentMinutes || 0,
  notes: problem.notes || null,
  approach: problem.approach || null,
  time_complexity: problem.timeComplexity || null,
  space_complexity: problem.spaceComplexity || null,
  attempts: problem.attempts || 0,
  solved_independently: problem.solvedIndependently || false,
  in_today_plan: problem.inTodayPlan || false,
  order_in_plan: problem.orderInPlan || 0,
  needs_revision: problem.needsRevision || false,
  revision_scheduled_date: problem.revisionScheduledDate || null,
  mistakes: problem.mistakes || null,
  pattern_learned: problem.patternLearned || null,
  hints_used: problem.hintsUsed || 0,
  hints_notes: problem.hintsNotes || null,
  focus_time_seconds: problem.focusTimeSeconds || 0,
  spaced_repetition_stage: problem.spacedRepetitionStage || 0,
  last_revision_outcome: problem.lastRevisionOutcome || null,
  last_revision_date: problem.lastRevisionDate || null,
  reschedule_history: problem.rescheduleHistory || [],
  revision_history: problem.revisionHistory || [],
  updated_at: new Date().toISOString(),
});

export const mapRowToProblem = (row: any): Problem => ({
  id: row.id,
  title: row.title,
  topic: row.topic,
  subtopic: row.subtopic || '',
  difficulty: row.difficulty,
  platform: row.platform,
  url: row.url || '',
  status: row.status,
  startTime: row.start_time || undefined,
  completionTime: row.completion_time || undefined,
  timeSpentMinutes: row.time_spent_minutes || 0,
  notes: row.notes || '',
  approach: row.approach || '',
  timeComplexity: row.time_complexity || '',
  spaceComplexity: row.space_complexity || '',
  attempts: row.attempts || 0,
  solvedIndependently: row.solved_independently || false,
  inTodayPlan: row.in_today_plan || false,
  orderInPlan: row.order_in_plan || 0,
  needsRevision: row.needs_revision || false,
  revisionScheduledDate: row.revision_scheduled_date || undefined,
  mistakes: row.mistakes || undefined,
  patternLearned: row.pattern_learned || undefined,
  hintsUsed: row.hints_used || 0,
  hintsNotes: row.hints_notes || '',
  focusTimeSeconds: row.focus_time_seconds || 0,
  spacedRepetitionStage: row.spaced_repetition_stage || 0,
  lastRevisionOutcome: row.last_revision_outcome || undefined,
  lastRevisionDate: row.last_revision_date || undefined,
  rescheduleHistory: row.reschedule_history || [],
  revisionHistory: row.revision_history || [],
  createdAt: row.created_at || new Date().toISOString(),
  updatedAt: row.updated_at || new Date().toISOString(),
});

export const mapDailyPlanToRow = (plan: DailyPlan, userId: string) => ({
  id: `${userId}_${plan.date}`,
  user_id: userId,
  date: plan.date,
  target_count: plan.targetCount,
  target_easy: plan.targetEasy,
  target_medium: plan.targetMedium,
  target_hard: plan.targetHard,
  deadline_time: plan.deadlineTime,
  notes: plan.notes || null,
  stl_completed: plan.stlCompleted || false,
  updated_at: new Date().toISOString(),
});

export const mapRowToDailyPlan = (row: any): DailyPlan => ({
  date: row.date,
  targetCount: row.target_count || 4,
  targetEasy: row.target_easy || 2,
  targetMedium: row.target_medium || 2,
  targetHard: row.target_hard || 1,
  deadlineTime: row.deadline_time || '23:00',
  notes: row.notes || '',
  stlCompleted: row.stl_completed || false,
});

export const mapSTLSessionToRow = (state: STLPracticeState, userId: string) => ({
  id: `${userId}_${state.date}`,
  user_id: userId,
  date: state.date,
  total_seconds: state.totalSeconds,
  remaining_seconds: state.remainingSeconds,
  is_completed: state.isCompleted,
  completed_at: state.completedAt || null,
  current_topic_id: state.currentTopicId,
  notes: state.notes || '',
  code_snippet: state.codeSnippet || '',
  updated_at: new Date().toISOString(),
});

export const mapRowToSTLSession = (row: any): STLPracticeState => ({
  date: row.date,
  totalSeconds: row.total_seconds || 1800,
  remainingSeconds: row.remaining_seconds || 1800,
  isRunning: false,
  isCompleted: row.is_completed || false,
  completedAt: row.completed_at || undefined,
  currentTopicId: row.current_topic_id || 'vectors',
  notes: row.notes || '',
  codeSnippet: row.code_snippet || '',
});

export const mapSettingsToRow = (settings: AccountabilitySettings, userId: string) => ({
  user_id: userId,
  study_start_time: settings.studyStartTime,
  study_end_time: settings.studyEndTime,
  hourly_reminders_enabled: settings.hourlyRemindersEnabled,
  stl_reminder_enabled: settings.stlReminderEnabled,
  incomplete_target_reminder_enabled: settings.incompleteTargetReminderEnabled,
  browser_notifications_enabled: settings.browserNotificationsEnabled,
  sound_enabled: settings.soundEnabled,
  reminder_interval_minutes: settings.reminderIntervalMinutes,
  daily_target_easy: settings.dailyTargetEasy,
  daily_target_medium: settings.dailyTargetMedium,
  daily_target_hard: settings.dailyTargetHard,
  spaced_repetition_intervals: settings.spacedRepetitionIntervals || [1, 3, 7, 14],
  readiness_weights: settings.readinessWeights || { coverage: 25, independent: 25, revision: 20, difficulty: 15, consistency: 15 },
  updated_at: new Date().toISOString(),
});

export const mapRowToSettings = (row: any): AccountabilitySettings => ({
  studyStartTime: row.study_start_time || '09:00',
  studyEndTime: row.study_end_time || '23:30',
  hourlyRemindersEnabled: row.hourly_reminders_enabled ?? true,
  stlReminderEnabled: row.stl_reminder_enabled ?? true,
  incompleteTargetReminderEnabled: row.incomplete_target_reminder_enabled ?? true,
  browserNotificationsEnabled: row.browser_notifications_enabled ?? false,
  soundEnabled: row.sound_enabled ?? true,
  reminderIntervalMinutes: row.reminder_interval_minutes || 60,
  dailyTargetEasy: row.daily_target_easy || 2,
  dailyTargetMedium: row.daily_target_medium || 2,
  dailyTargetHard: row.daily_target_hard || 1,
  spacedRepetitionIntervals: row.spaced_repetition_intervals || [1, 3, 7, 14],
  readinessWeights: row.readiness_weights || { coverage: 25, independent: 25, revision: 20, difficulty: 15, consistency: 15 },
});

export const mapStudyLogToRow = (log: StudyDayLog, userId: string) => ({
  id: `${userId}_${log.date}`,
  user_id: userId,
  date: log.date,
  solved_count: log.solvedCount,
  easy_solved: log.easySolved,
  medium_solved: log.mediumSolved,
  hard_solved: log.hardSolved,
  independent_count: log.independentCount,
  hints_count: log.hintsCount,
  dsa_minutes: log.dsaMinutes,
  stl_minutes: log.stlMinutes,
  stl_completed: log.stlCompleted,
  target_met: log.targetMet,
  updated_at: new Date().toISOString(),
});

export const mapRowToStudyLog = (row: any): StudyDayLog => ({
  date: row.date,
  solvedCount: row.solved_count || 0,
  easySolved: row.easy_solved || 0,
  mediumSolved: row.medium_solved || 0,
  hardSolved: row.hard_solved || 0,
  independentCount: row.independent_count || 0,
  hintsCount: row.hints_count || 0,
  dsaMinutes: row.dsa_minutes || 0,
  stlMinutes: row.stl_minutes || 0,
  stlCompleted: row.stl_completed || false,
  targetMet: row.target_met || false,
});

// Focus Sessions Mappers
export const mapFocusSessionToRow = (session: any, userId: string) => ({
  id: session.id,
  user_id: userId,
  problem_id: session.problemId || null,
  problem_title: session.problemTitle,
  started_at: session.startedAt,
  ended_at: session.endedAt || null,
  active_seconds: session.activeSeconds || 0,
  break_seconds: session.breakSeconds || 0,
  hints_used: session.hintsUsed || 0,
  hint_notes: session.hintNotes || null,
  mistakes_recorded: session.mistakesRecorded || null,
  status: session.status || 'completed',
});

export const mapRowToFocusSession = (row: any) => ({
  id: row.id,
  problemId: row.problem_id || '',
  problemTitle: row.problem_title || '',
  startedAt: row.started_at,
  endedAt: row.ended_at || undefined,
  activeSeconds: row.active_seconds || 0,
  breakSeconds: row.break_seconds || 0,
  hintsUsed: row.hints_used || 0,
  hintNotes: row.hint_notes || '',
  mistakesRecorded: row.mistakes_recorded || '',
  status: row.status || 'completed',
});

// STL Exercises Mappers
export const mapSTLExerciseToRow = (ex: any, userId: string) => ({
  id: `${userId}_${ex.id}`,
  user_id: userId,
  exercise_id: ex.id,
  topic_id: ex.topicId,
  is_completed: ex.isCompleted || false,
  completed_at: ex.completedAt || null,
  user_code: ex.userCode || null,
  notes: ex.notes || null,
  updated_at: new Date().toISOString(),
});

// Milestones Mappers
export const mapMilestoneToRow = (m: any, userId: string) => ({
  id: `${userId}_${m.id}`,
  user_id: userId,
  milestone_id: m.id,
  title: m.title,
  category: m.category,
  target_value: m.targetValue,
  current_value: m.currentValue || 0,
  is_unlocked: m.isUnlocked || false,
  unlocked_at: m.unlockedAt || null,
  updated_at: new Date().toISOString(),
});

// ==============================================================================
// Cloud Database CRUD Services
// ==============================================================================

export const fetchAllUserDataFromCloud = async (userId: string) => {
  if (!supabase) return null;

  try {
    const [problemsRes, plansRes, stlRes, settingsRes, logsRes, focusRes, stlExRes, milestonesRes, reschedRes] = await Promise.all([
      supabase.from('dsa_problems').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('daily_plans').select('*').eq('user_id', userId),
      supabase.from('stl_practice_sessions').select('*').eq('user_id', userId),
      supabase.from('user_settings').select('*').eq('user_id', userId).single(),
      supabase.from('study_logs').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('focus_sessions').select('*').eq('user_id', userId).order('started_at', { ascending: false }).limit(50),
      supabase.from('stl_exercises').select('*').eq('user_id', userId),
      supabase.from('milestones').select('*').eq('user_id', userId),
      supabase.from('reschedule_events').select('*').eq('user_id', userId).order('created_at', { ascending: false }).limit(50),
    ]);

    return {
      problems: (problemsRes.data || []).map(mapRowToProblem),
      dailyPlans: (plansRes.data || []).map(mapRowToDailyPlan),
      stlSessions: (stlRes.data || []).map(mapRowToSTLSession),
      settings: settingsRes.data ? mapRowToSettings(settingsRes.data) : null,
      studyLogs: (logsRes.data || []).map(mapRowToStudyLog),
      focusSessions: (focusRes.data || []).map(mapRowToFocusSession),
      stlExercises: stlExRes.data || [],
      milestones: milestonesRes.data || [],
      rescheduleEvents: reschedRes.data || [],
    };
  } catch (error) {
    console.error('Error fetching data from Supabase:', error);
    return null;
  }
};

export const syncProblemToCloud = async (problem: Problem, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapProblemToRow(problem, userId);
    await supabase.from('dsa_problems').upsert(row);
  } catch (err) {
    console.error('Failed to sync problem to Supabase', err);
  }
};

export const deleteProblemFromCloud = async (problemId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('dsa_problems').delete().eq('id', problemId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete problem from Supabase', err);
  }
};

export const syncDailyPlanToCloud = async (plan: DailyPlan, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapDailyPlanToRow(plan, userId);
    await supabase.from('daily_plans').upsert(row);
  } catch (err) {
    console.error('Failed to sync daily plan to Supabase', err);
  }
};

export const syncSTLSessionToCloud = async (state: STLPracticeState, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapSTLSessionToRow(state, userId);
    await supabase.from('stl_practice_sessions').upsert(row);
  } catch (err) {
    console.error('Failed to sync STL session to Supabase', err);
  }
};

export const syncSettingsToCloud = async (settings: AccountabilitySettings, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapSettingsToRow(settings, userId);
    await supabase.from('user_settings').upsert(row);
  } catch (err) {
    console.error('Failed to sync settings to Supabase', err);
  }
};

export const syncStudyLogToCloud = async (log: StudyDayLog, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapStudyLogToRow(log, userId);
    await supabase.from('study_logs').upsert(row);
  } catch (err) {
    console.error('Failed to sync study log to Supabase', err);
  }
};

export const syncFocusSessionToCloud = async (session: any, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapFocusSessionToRow(session, userId);
    await supabase.from('focus_sessions').upsert(row);
  } catch (err) {
    console.error('Failed to sync focus session to Supabase', err);
  }
};

export const syncSTLExerciseToCloud = async (exercise: any, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapSTLExerciseToRow(exercise, userId);
    await supabase.from('stl_exercises').upsert(row);
  } catch (err) {
    console.error('Failed to sync STL exercise to Supabase', err);
  }
};

export const syncMilestoneToCloud = async (milestone: any, userId: string) => {
  if (!supabase) return;
  try {
    const row = mapMilestoneToRow(milestone, userId);
    await supabase.from('milestones').upsert(row);
  } catch (err) {
    console.error('Failed to sync milestone to Supabase', err);
  }
};

export const syncRescheduleEventToCloud = async (event: any, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('reschedule_events').upsert({
      id: event.id,
      user_id: userId,
      problem_id: event.problemId || null,
      problem_title: event.problemTitle,
      date: event.date,
      action: event.action,
      previous_date: event.previousDate || null,
      target_date: event.targetDate || null,
      reason: event.reason || null,
    });
  } catch (err) {
    console.error('Failed to sync reschedule event to Supabase', err);
  }
};

// ==============================================================================
// Playlists & Video Timestamps Cloud Sync
// ==============================================================================

export const syncPlaylistToCloud = async (playlist: Playlist, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('study_playlists').upsert({
      id: playlist.id,
      user_id: userId,
      category: playlist.category,
      title: playlist.title,
      description: playlist.description || null,
      topic: playlist.topic || null,
      order_index: playlist.order,
      created_at: playlist.createdAt,
      updated_at: new Date().toISOString(),
    });

    // Also sync all items inside this playlist
    if (playlist.items && playlist.items.length > 0) {
      for (const item of playlist.items) {
        await syncPlaylistItemToCloud(item, userId);
      }
    }
  } catch (err) {
    console.error('Failed to sync playlist to Supabase', err);
  }
};

export const syncPlaylistItemToCloud = async (item: PlaylistItem, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('playlist_items').upsert({
      id: item.id,
      user_id: userId,
      playlist_id: item.playlistId,
      title: item.title,
      video_url: item.videoUrl,
      topic: item.topic || null,
      order_index: item.order,
      duration_seconds: item.durationSeconds,
      watched_seconds: item.watchedSeconds,
      is_completed: item.isCompleted,
      notes: item.notes || null,
      bookmarks: item.bookmarks || [],
      last_watched_at: item.lastWatchedAt || null,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to sync playlist item to Supabase', err);
  }
};

export const deletePlaylistFromCloud = async (playlistId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('study_playlists').delete().eq('id', playlistId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete playlist from Supabase', err);
  }
};

export const deletePlaylistItemFromCloud = async (itemId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('playlist_items').delete().eq('id', itemId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete playlist item from Supabase', err);
  }
};


