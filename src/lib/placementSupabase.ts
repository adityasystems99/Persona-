import { supabase } from './supabase';
import {
  PlacementSettings,
  PlacementReminderSchedule,
  JobApplication,
  ReferralOutreach,
  WeekendAssessment,
  PlacementDailyTask,
  ProjectSessionLog,
} from '../types/placement';

// Check if client is initialized
export const isPlacementSupabaseReady = (): boolean => {
  return Boolean(supabase);
};

// ==============================================================================
// 1. Placement Settings Sync
// ==============================================================================

export const syncPlacementSettingsToCloud = async (
  settings: PlacementSettings,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_settings').upsert({
      user_id: userId,
      daily_application_target: settings.dailyApplicationTarget,
      weekly_referral_target: settings.weeklyReferralTarget,
      daily_dsa_target: settings.dailyDsaTarget,
      daily_project_hours: settings.dailyProjectHours,
      sprint_start_date: settings.sprintStartDate,
      sprint_end_date: settings.sprintEndDate,
      timezone: settings.timezone,
      sound_enabled: settings.soundEnabled,
      vibration_enabled: settings.vibrationEnabled,
      browser_notifications_enabled: settings.browserNotificationsEnabled,
      snooze_default_minutes: settings.snoozeDefaultMinutes,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const fetchPlacementSettingsFromCloud = async (
  userId: string
): Promise<PlacementSettings | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return {
      dailyApplicationTarget: data.daily_application_target ?? 10,
      weeklyReferralTarget: data.weekly_referral_target ?? 7,
      dailyDsaTarget: data.daily_dsa_target ?? 2,
      dailyProjectHours: data.daily_project_hours ?? 1,
      sprintStartDate: data.sprint_start_date,
      sprintEndDate: data.sprint_end_date,
      timezone: data.timezone ?? 'Asia/Kolkata',
      soundEnabled: data.sound_enabled ?? true,
      vibrationEnabled: data.vibration_enabled ?? true,
      browserNotificationsEnabled: data.browser_notifications_enabled ?? false,
      snoozeDefaultMinutes: data.snooze_default_minutes ?? 10,
    };
  } catch {
    return null;
  }
};

// ==============================================================================
// 2. Reminders Sync
// ==============================================================================

export const syncReminderToCloud = async (
  reminder: PlacementReminderSchedule,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_reminders').upsert({
      id: reminder.id,
      user_id: userId,
      type: reminder.type,
      title: reminder.title,
      description: reminder.description,
      preferred_time: reminder.preferredTime,
      preferred_days: reminder.preferredDays,
      enabled: reminder.enabled,
      snoozed_until: reminder.snoozedUntil || null,
      last_triggered_date: reminder.lastTriggeredDate || null,
      target_count: reminder.targetCount || null,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const fetchRemindersFromCloud = async (
  userId: string
): Promise<PlacementReminderSchedule[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_reminders')
      .select('*')
      .eq('user_id', userId);

    if (error || !data) return null;
    return data.map((r) => ({
      id: r.id,
      userId: r.user_id,
      type: r.type,
      title: r.title,
      description: r.description || '',
      preferredTime: r.preferred_time || '10:00',
      preferredDays: Array.isArray(r.preferred_days) ? r.preferred_days : [1, 2, 3, 4, 5],
      enabled: r.enabled ?? true,
      snoozedUntil: r.snoozed_until || undefined,
      lastTriggeredDate: r.last_triggered_date || undefined,
      targetCount: r.target_count || undefined,
      createdAt: r.created_at,
      updatedAt: r.updated_at,
    }));
  } catch {
    return null;
  }
};

// ==============================================================================
// 3. Applications Sync
// ==============================================================================

export const syncApplicationToCloud = async (
  app: JobApplication,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_applications').upsert({
      id: app.id,
      user_id: userId,
      company: app.company,
      role: app.role,
      platform: app.platform,
      job_link: app.jobLink || null,
      application_date: app.applicationDate,
      status: app.status,
      referral_contact: app.referralContact || null,
      notes: app.notes || null,
      location: app.location || null,
      salary_range: app.salaryRange || null,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const deleteApplicationFromCloud = async (
  appId: string,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase
      .from('placement_applications')
      .delete()
      .eq('id', appId)
      .eq('user_id', userId);
    return !error;
  } catch {
    return false;
  }
};

export const fetchApplicationsFromCloud = async (
  userId: string
): Promise<JobApplication[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_applications')
      .select('*')
      .eq('user_id', userId)
      .order('application_date', { ascending: false });

    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      company: row.company,
      role: row.role,
      platform: row.platform,
      jobLink: row.job_link || '',
      applicationDate: row.application_date,
      status: row.status,
      referralContact: row.referral_contact || '',
      notes: row.notes || '',
      location: row.location || '',
      salaryRange: row.salary_range || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
};

// ==============================================================================
// 4. Referrals Sync
// ==============================================================================

export const syncReferralToCloud = async (
  ref: ReferralOutreach,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_referrals').upsert({
      id: ref.id,
      user_id: userId,
      contact_name: ref.contactName,
      company: ref.company,
      role: ref.role,
      profile_link: ref.profileLink,
      date_contacted: ref.dateContacted,
      response_status: ref.responseStatus,
      follow_up_date: ref.followUpDate || null,
      notes: ref.notes || null,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const deleteReferralFromCloud = async (
  refId: string,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase
      .from('placement_referrals')
      .delete()
      .eq('id', refId)
      .eq('user_id', userId);
    return !error;
  } catch {
    return false;
  }
};

export const fetchReferralsFromCloud = async (
  userId: string
): Promise<ReferralOutreach[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_referrals')
      .select('*')
      .eq('user_id', userId)
      .order('date_contacted', { ascending: false });

    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      contactName: row.contact_name,
      company: row.company,
      role: row.role,
      profileLink: row.profile_link,
      dateContacted: row.date_contacted,
      responseStatus: row.response_status,
      followUpDate: row.follow_up_date || undefined,
      notes: row.notes || '',
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
};

// ==============================================================================
// 5. Assessments Sync
// ==============================================================================

export const syncAssessmentToCloud = async (
  assessment: WeekendAssessment,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_assessments').upsert({
      id: assessment.id,
      user_id: userId,
      type: assessment.type,
      title: assessment.title,
      date: assessment.date,
      status: assessment.status,
      score_or_rank: assessment.scoreOrRank || null,
      duration_minutes: assessment.durationMinutes || null,
      feedback: assessment.feedback || null,
      mistakes: assessment.mistakes || null,
      improvement_areas: assessment.improvementAreas || null,
      partner_or_platform: assessment.partnerOrPlatform || null,
      rescheduled_date: assessment.rescheduledDate || null,
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const fetchAssessmentsFromCloud = async (
  userId: string
): Promise<WeekendAssessment[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_assessments')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      type: row.type,
      title: row.title,
      date: row.date,
      status: row.status,
      scoreOrRank: row.score_or_rank || undefined,
      durationMinutes: row.duration_minutes || undefined,
      feedback: row.feedback || undefined,
      mistakes: row.mistakes || undefined,
      improvementAreas: row.improvement_areas || undefined,
      partnerOrPlatform: row.partner_or_platform || undefined,
      rescheduledDate: row.rescheduled_date || undefined,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
};

// ==============================================================================
// 6. Placement Daily Tasks Sync
// ==============================================================================

export const syncDailyTaskToCloud = async (
  task: PlacementDailyTask,
  userId: string
): Promise<boolean> => {
  if (!supabase || !userId) return false;
  try {
    const { error } = await supabase.from('placement_daily_tasks').upsert({
      id: task.id,
      user_id: userId,
      date: task.date,
      category: task.category,
      title: task.title,
      description: task.description || null,
      status: task.status,
      target_count: task.targetCount || null,
      current_count: task.currentCount || 0,
      time_spent_minutes: task.timeSpentMinutes || 0,
      notes: task.notes || null,
      rescheduled_to: task.rescheduledTo || null,
      is_overdue: task.isOverdue || false,
      completed_at: task.completedAt || null,
      details: task.details || {},
      updated_at: new Date().toISOString(),
    });
    return !error;
  } catch {
    return false;
  }
};

export const fetchDailyTasksFromCloud = async (
  userId: string
): Promise<PlacementDailyTask[] | null> => {
  if (!supabase || !userId) return null;
  try {
    const { data, error } = await supabase
      .from('placement_daily_tasks')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error || !data) return null;
    return data.map((row) => ({
      id: row.id,
      userId: row.user_id,
      date: row.date,
      category: row.category,
      title: row.title,
      description: row.description || '',
      status: row.status,
      targetCount: row.target_count || undefined,
      currentCount: row.current_count || 0,
      timeSpentMinutes: row.time_spent_minutes || 0,
      notes: row.notes || '',
      rescheduledTo: row.rescheduled_to || undefined,
      isOverdue: row.is_overdue || false,
      completedAt: row.completed_at || undefined,
      details: row.details || {},
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));
  } catch {
    return null;
  }
};
