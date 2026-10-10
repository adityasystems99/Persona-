import {
  Problem,
  DailyPlan,
  STLPracticeState,
  AccountabilitySettings,
  StudyDayLog,
  AppNotification,
  STLTopicItem,
  STLExercise,
  FocusSession,
  Milestone,
  RescheduleEvent,
} from '../types/dsa';
import {
  INITIAL_PROBLEMS,
  DEFAULT_SETTINGS,
  INITIAL_STL_STATE,
  INITIAL_PAST_LOGS,
  getTodayDateString,
} from '../data/initialData';
import { INITIAL_STL_TOPICS } from '../data/stlTopics';
import { INITIAL_STL_EXERCISES } from '../data/stlExercises';
import { INITIAL_MILESTONES } from '../data/milestonesData';

const STORAGE_KEYS = {
  PROBLEMS: 'algopulse_problems_v1',
  DAILY_PLAN: 'algopulse_daily_plan_v1',
  STL_STATE: 'algopulse_stl_state_v1',
  STL_TOPICS: 'algopulse_stl_topics_v1',
  SETTINGS: 'algopulse_settings_v1',
  STUDY_LOGS: 'algopulse_study_logs_v1',
  NOTIFICATIONS: 'algopulse_notifications_v1',
  LAST_REMINDER: 'algopulse_last_reminder_v1',
  STL_EXERCISES: 'algopulse_stl_exercises_v2',
  FOCUS_SESSIONS: 'algopulse_focus_sessions_v2',
  ACTIVE_FOCUS: 'algopulse_active_focus_state_v2',
  MILESTONES: 'algopulse_milestones_v2',
  RESCHEDULE_EVENTS: 'algopulse_reschedule_events_v2',
};

export const loadStoredProblems = (): Problem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PROBLEMS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading problems from localStorage', e);
  }
  return INITIAL_PROBLEMS;
};

export const saveStoredProblems = (problems: Problem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.PROBLEMS, JSON.stringify(problems));
  } catch (e) {
    console.error('Error saving problems to localStorage', e);
  }
};

export const loadStoredDailyPlan = (): DailyPlan => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DAILY_PLAN);
    if (raw) {
      const plan: DailyPlan = JSON.parse(raw);
      if (plan.date === today) return plan;
    }
  } catch (e) {
    console.error('Error loading daily plan', e);
  }
  return {
    date: today,
    targetCount: 4,
    targetEasy: 2,
    targetMedium: 2,
    targetHard: 1,
    deadlineTime: '23:00',
    notes: 'Focus on clean implementation, optimal space complexity, and independent reasoning.',
    stlCompleted: false,
  };
};

export const saveStoredDailyPlan = (plan: DailyPlan): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY_PLAN, JSON.stringify(plan));
  } catch (e) {
    console.error('Error saving daily plan', e);
  }
};

export const loadStoredSTLState = (): STLPracticeState => {
  const today = getTodayDateString();
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STL_STATE);
    if (raw) {
      const state: STLPracticeState = JSON.parse(raw);
      if (state.date === today) {
        // Safe refresh handling: if it was running, calculate elapsed time
        if (state.isRunning && state.lastTickTimestamp) {
          const elapsed = Math.floor((Date.now() - state.lastTickTimestamp) / 1000);
          const newRemaining = Math.max(0, state.remainingSeconds - elapsed);
          return {
            ...state,
            remainingSeconds: newRemaining,
            isCompleted: newRemaining === 0 ? true : state.isCompleted,
            isRunning: newRemaining > 0,
            lastTickTimestamp: Date.now(),
          };
        }
        return state;
      }
    }
  } catch (e) {
    console.error('Error loading STL state', e);
  }
  return { ...INITIAL_STL_STATE, date: today };
};

export const saveStoredSTLState = (state: STLPracticeState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STL_STATE, JSON.stringify(state));
  } catch (e) {
    console.error('Error saving STL state', e);
  }
};

export const loadStoredSTLTopics = (): STLTopicItem[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STL_TOPICS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading STL topics', e);
  }
  return INITIAL_STL_TOPICS;
};

export const saveStoredSTLTopics = (topics: STLTopicItem[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STL_TOPICS, JSON.stringify(topics));
  } catch (e) {
    console.error('Error saving STL topics', e);
  }
};

export const loadStoredSettings = (): AccountabilitySettings => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (e) {
    console.error('Error loading settings', e);
  }
  return DEFAULT_SETTINGS;
};

export const saveStoredSettings = (settings: AccountabilitySettings): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Error saving settings', e);
  }
};

export const loadStoredStudyLogs = (): StudyDayLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STUDY_LOGS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading study logs', e);
  }
  return INITIAL_PAST_LOGS;
};

export const saveStoredStudyLogs = (logs: StudyDayLog[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STUDY_LOGS, JSON.stringify(logs));
  } catch (e) {
    console.error('Error saving study logs', e);
  }
};

export const loadStoredNotifications = (): AppNotification[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading notifications', e);
  }
  return [
    {
      id: 'notif-welcome',
      title: 'Welcome to AlgoPulse',
      message: 'Your personal DSA command center is ready. Start your 30-min STL session or begin today\'s problem set.',
      timestamp: new Date().toISOString(),
      type: 'info',
      read: false,
    }
  ];
};

export const saveStoredNotifications = (notifications: AppNotification[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  } catch (e) {
    console.error('Error saving notifications', e);
  }
};

export const getLastHourlyReminderTimestamp = (): number => {
  try {
    const val = localStorage.getItem(STORAGE_KEYS.LAST_REMINDER);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
};

export const setLastHourlyReminderTimestamp = (ts: number): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.LAST_REMINDER, String(ts));
  } catch {}
};

// --- STL Exercises Storage ---
export const loadStoredSTLExercises = (): STLExercise[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STL_EXERCISES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading STL exercises', e);
  }
  return INITIAL_STL_EXERCISES;
};

export const saveStoredSTLExercises = (exercises: STLExercise[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.STL_EXERCISES, JSON.stringify(exercises));
  } catch (e) {
    console.error('Error saving STL exercises', e);
  }
};

// --- Focus Sessions Storage ---
export const loadStoredFocusSessions = (): FocusSession[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.FOCUS_SESSIONS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading focus sessions', e);
  }
  return [];
};

export const saveStoredFocusSessions = (sessions: FocusSession[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.FOCUS_SESSIONS, JSON.stringify(sessions));
  } catch (e) {
    console.error('Error saving focus sessions', e);
  }
};

export interface ActiveFocusState {
  problemId: string;
  problemTitle: string;
  sessionStartTime: number; // Date.now() timestamp
  accumulatedFocusSeconds: number;
  accumulatedBreakSeconds: number;
  lastStateTimestamp: number;
  status: 'running' | 'paused';
  hintsUsed: number;
  hintNotes: string;
  mistakesRecorded: string;
}

export const loadStoredActiveFocus = (): ActiveFocusState | null => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVE_FOCUS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading active focus session', e);
  }
  return null;
};

export const saveStoredActiveFocus = (state: ActiveFocusState | null): void => {
  try {
    if (state === null) {
      localStorage.removeItem(STORAGE_KEYS.ACTIVE_FOCUS);
    } else {
      localStorage.setItem(STORAGE_KEYS.ACTIVE_FOCUS, JSON.stringify(state));
    }
  } catch (e) {
    console.error('Error saving active focus state', e);
  }
};

// --- Milestones Storage ---
export const loadStoredMilestones = (): Milestone[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.MILESTONES);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading milestones', e);
  }
  return INITIAL_MILESTONES;
};

export const saveStoredMilestones = (milestones: Milestone[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MILESTONES, JSON.stringify(milestones));
  } catch (e) {
    console.error('Error saving milestones', e);
  }
};

// --- Reschedule Events Storage ---
export const loadStoredRescheduleEvents = (): RescheduleEvent[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESCHEDULE_EVENTS);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    console.error('Error loading reschedule events', e);
  }
  return [];
};

export const saveStoredRescheduleEvents = (events: RescheduleEvent[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.RESCHEDULE_EVENTS, JSON.stringify(events));
  } catch (e) {
    console.error('Error saving reschedule events', e);
  }
};

export const clearAllAlgoPulseData = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach((key) => localStorage.removeItem(key));
  } catch (e) {
    console.error('Error clearing data', e);
  }
};

