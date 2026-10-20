import {
  PlacementSettings,
  PlacementReminderSchedule,
  JobApplication,
  ReferralOutreach,
  WeekendAssessment,
  PlacementDailyTask,
  ProjectSessionLog,
} from '../types/placement';
import {
  DEFAULT_PLACEMENT_SETTINGS,
  DEFAULT_PLACEMENT_REMINDERS,
  INITIAL_JOB_APPLICATIONS,
  INITIAL_REFERRALS,
  INITIAL_WEEKEND_ASSESSMENTS,
  INITIAL_DAILY_TASKS,
} from '../data/placementInitialData';

const SETTINGS_KEY = 'persona_placement_settings_v1';
const REMINDERS_KEY = 'persona_placement_reminders_v1';
const APPLICATIONS_KEY = 'persona_placement_applications_v1';
const REFERRALS_KEY = 'persona_placement_referrals_v1';
const ASSESSMENTS_KEY = 'persona_placement_assessments_v1';
const DAILY_TASKS_KEY = 'persona_placement_daily_tasks_v1';
const PROJECT_LOGS_KEY = 'persona_placement_project_logs_v1';
const DISMISSED_ALERTS_KEY = 'persona_placement_dismissed_alerts_v1';

export const loadPlacementSettings = (): PlacementSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_PLACEMENT_SETTINGS;
    return { ...DEFAULT_PLACEMENT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_PLACEMENT_SETTINGS;
  }
};

export const savePlacementSettings = (settings: PlacementSettings): void => {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
};

export const loadPlacementReminders = (): PlacementReminderSchedule[] => {
  try {
    const raw = localStorage.getItem(REMINDERS_KEY);
    if (!raw) return DEFAULT_PLACEMENT_REMINDERS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : DEFAULT_PLACEMENT_REMINDERS;
  } catch {
    return DEFAULT_PLACEMENT_REMINDERS;
  }
};

export const savePlacementReminders = (reminders: PlacementReminderSchedule[]): void => {
  try {
    localStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch {}
};

export const loadJobApplications = (): JobApplication[] => {
  try {
    const raw = localStorage.getItem(APPLICATIONS_KEY);
    if (!raw) return INITIAL_JOB_APPLICATIONS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_JOB_APPLICATIONS;
  } catch {
    return INITIAL_JOB_APPLICATIONS;
  }
};

export const saveJobApplications = (applications: JobApplication[]): void => {
  try {
    localStorage.setItem(APPLICATIONS_KEY, JSON.stringify(applications));
  } catch {}
};

export const loadReferrals = (): ReferralOutreach[] => {
  try {
    const raw = localStorage.getItem(REFERRALS_KEY);
    if (!raw) return INITIAL_REFERRALS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_REFERRALS;
  } catch {
    return INITIAL_REFERRALS;
  }
};

export const saveReferrals = (referrals: ReferralOutreach[]): void => {
  try {
    localStorage.setItem(REFERRALS_KEY, JSON.stringify(referrals));
  } catch {}
};

export const loadWeekendAssessments = (): WeekendAssessment[] => {
  try {
    const raw = localStorage.getItem(ASSESSMENTS_KEY);
    if (!raw) return INITIAL_WEEKEND_ASSESSMENTS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_WEEKEND_ASSESSMENTS;
  } catch {
    return INITIAL_WEEKEND_ASSESSMENTS;
  }
};

export const saveWeekendAssessments = (assessments: WeekendAssessment[]): void => {
  try {
    localStorage.setItem(ASSESSMENTS_KEY, JSON.stringify(assessments));
  } catch {}
};

export const loadPlacementDailyTasks = (): PlacementDailyTask[] => {
  try {
    const raw = localStorage.getItem(DAILY_TASKS_KEY);
    if (!raw) return INITIAL_DAILY_TASKS;
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : INITIAL_DAILY_TASKS;
  } catch {
    return INITIAL_DAILY_TASKS;
  }
};

export const savePlacementDailyTasks = (tasks: PlacementDailyTask[]): void => {
  try {
    localStorage.setItem(DAILY_TASKS_KEY, JSON.stringify(tasks));
  } catch {}
};

export const loadProjectSessionLogs = (): ProjectSessionLog[] => {
  try {
    const raw = localStorage.getItem(PROJECT_LOGS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const saveProjectSessionLogs = (logs: ProjectSessionLog[]): void => {
  try {
    localStorage.setItem(PROJECT_LOGS_KEY, JSON.stringify(logs));
  } catch {}
};

export const getDismissedAlertKeys = (): Set<string> => {
  try {
    const raw = localStorage.getItem(DISMISSED_ALERTS_KEY);
    if (!raw) return new Set();
    return new Set(JSON.parse(raw));
  } catch {
    return new Set();
  }
};

export const addDismissedAlertKey = (key: string): void => {
  try {
    const set = getDismissedAlertKeys();
    set.add(key);
    localStorage.setItem(DISMISSED_ALERTS_KEY, JSON.stringify(Array.from(set)));
  } catch {}
};

export const clearAllPlacementData = (): void => {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(REMINDERS_KEY);
    localStorage.removeItem(APPLICATIONS_KEY);
    localStorage.removeItem(REFERRALS_KEY);
    localStorage.removeItem(ASSESSMENTS_KEY);
    localStorage.removeItem(DAILY_TASKS_KEY);
    localStorage.removeItem(PROJECT_LOGS_KEY);
    localStorage.removeItem(DISMISSED_ALERTS_KEY);
  } catch {}
};
