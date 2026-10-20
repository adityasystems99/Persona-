import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  useRef,
} from 'react';
import confetti from 'canvas-confetti';
import {
  PlacementTab,
  PlacementSettings,
  PlacementReminderSchedule,
  JobApplication,
  ReferralOutreach,
  WeekendAssessment,
  PlacementDailyTask,
  ProjectSessionLog,
  TaskCompletionStatus,
} from '../types/placement';
import {
  loadPlacementSettings,
  savePlacementSettings,
  loadPlacementReminders,
  savePlacementReminders,
  loadJobApplications,
  saveJobApplications,
  loadReferrals,
  saveReferrals,
  loadWeekendAssessments,
  saveWeekendAssessments,
  loadPlacementDailyTasks,
  savePlacementDailyTasks,
  loadProjectSessionLogs,
  saveProjectSessionLogs,
  getDismissedAlertKeys,
  addDismissedAlertKey,
  clearAllPlacementData,
} from '../utils/placementStorage';
import {
  syncPlacementSettingsToCloud,
  fetchPlacementSettingsFromCloud,
  syncReminderToCloud,
  fetchRemindersFromCloud,
  syncApplicationToCloud,
  deleteApplicationFromCloud,
  fetchApplicationsFromCloud,
  syncReferralToCloud,
  deleteReferralFromCloud,
  fetchReferralsFromCloud,
  syncAssessmentToCloud,
  fetchAssessmentsFromCloud,
  syncDailyTaskToCloud,
  fetchDailyTasksFromCloud,
} from '../lib/placementSupabase';
import { soundFx } from '../utils/audio';
import {
  dispatchSystemNotification,
  checkNotificationPermission,
  requestNotificationPermission,
} from '../utils/notifications';
import { useDSA } from './DSAContext';

interface ActiveReminderAlert {
  reminder: PlacementReminderSchedule;
  dueTime: string;
}

interface PlacementContextType {
  activePlacementTab: PlacementTab;
  setActivePlacementTab: (tab: PlacementTab) => void;
  settings: PlacementSettings;
  updateSettings: (updates: Partial<PlacementSettings>) => void;
  reminders: PlacementReminderSchedule[];
  updateReminder: (id: string, updates: Partial<PlacementReminderSchedule>) => void;
  toggleReminderEnabled: (id: string) => void;
  snoozeReminder: (id: string, minutes: 10 | 30 | 60) => void;
  dismissReminder: (id: string) => void;
  rescheduleReminder: (id: string, newTime: string, newDays?: number[]) => void;
  
  // Applications
  applications: JobApplication[];
  addJobApplication: (app: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => { success: boolean; duplicate?: boolean; application?: JobApplication };
  updateJobApplication: (id: string, updates: Partial<JobApplication>) => void;
  deleteJobApplication: (id: string) => void;

  // Referrals
  referrals: ReferralOutreach[];
  addReferral: (ref: Omit<ReferralOutreach, 'id' | 'createdAt' | 'updatedAt'>) => ReferralOutreach;
  updateReferral: (id: string, updates: Partial<ReferralOutreach>) => void;
  deleteReferral: (id: string) => void;

  // Assessments
  assessments: WeekendAssessment[];
  addWeekendAssessment: (assess: Omit<WeekendAssessment, 'id' | 'createdAt' | 'updatedAt'>) => WeekendAssessment;
  updateWeekendAssessment: (id: string, updates: Partial<WeekendAssessment>) => void;
  deleteWeekendAssessment: (id: string) => void;
  rescheduleAssessment: (id: string, newDate: string) => void;

  // Daily Tasks & Project
  dailyTasks: PlacementDailyTask[];
  projectSessions: ProjectSessionLog[];
  toggleTaskStatus: (taskId: string, status: TaskCompletionStatus) => void;
  rescheduleTask: (taskId: string, newDate: string) => void;
  logProjectSession: (title: string, durationMinutes: number, notes?: string, repoOrBranch?: string) => void;

  // Active Reminder Modal & Notification control
  activeReminderAlert: ActiveReminderAlert | null;
  dismissActiveAlert: () => void;
  snoozeActiveAlert: (minutes: 10 | 30 | 60) => void;
  completeActiveAlertTask: () => void;
  notificationPermission: NotificationPermission;
  requestPermission: () => Promise<NotificationPermission>;

  // Analytics & Computed Metrics
  sprintDayNumber: number;
  sprintTotalDays: number;
  sprintProgressPercentage: number;
  todayApplicationsCount: number;
  todayApplicationsTarget: number;
  weeklyReferralsCount: number;
  weeklyReferralsTarget: number;
  followUpsDue: ReferralOutreach[];
  overdueTasks: PlacementDailyTask[];
  todayTasks: PlacementDailyTask[];
  todayDsaSolvedCount: number;
  hasMediumDsaSolvedToday: boolean;
  todayProjectMinutes: number;
  dailyStreak: number;
  completionRate90Day: number;
  resetAllData: () => void;
}

const PlacementContext = createContext<PlacementContextType | undefined>(undefined);

export const PlacementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, problems } = useDSA();

  // State initialization with local storage
  const [activePlacementTab, setActivePlacementTab] = useState<PlacementTab>('overview');
  const [settings, setSettings] = useState<PlacementSettings>(loadPlacementSettings);
  const [reminders, setReminders] = useState<PlacementReminderSchedule[]>(loadPlacementReminders);
  const [applications, setApplications] = useState<JobApplication[]>(loadJobApplications);
  const [referrals, setReferrals] = useState<ReferralOutreach[]>(loadReferrals);
  const [assessments, setAssessments] = useState<WeekendAssessment[]>(loadWeekendAssessments);
  const [dailyTasks, setDailyTasks] = useState<PlacementDailyTask[]>(loadPlacementDailyTasks);
  const [projectSessions, setProjectSessions] = useState<ProjectSessionLog[]>(loadProjectSessionLogs);

  // Active in-app reminder alert
  const [activeReminderAlert, setActiveReminderAlert] = useState<ActiveReminderAlert | null>(null);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>(
    checkNotificationPermission()
  );

  // Save changes to local storage
  useEffect(() => {
    savePlacementSettings(settings);
  }, [settings]);

  useEffect(() => {
    savePlacementReminders(reminders);
  }, [reminders]);

  useEffect(() => {
    saveJobApplications(applications);
  }, [applications]);

  useEffect(() => {
    saveReferrals(referrals);
  }, [referrals]);

  useEffect(() => {
    saveWeekendAssessments(assessments);
  }, [assessments]);

  useEffect(() => {
    savePlacementDailyTasks(dailyTasks);
  }, [dailyTasks]);

  useEffect(() => {
    saveProjectSessionLogs(projectSessions);
  }, [projectSessions]);

  // Cloud Hydration when user logs in
  useEffect(() => {
    if (!currentUser) return;

    let isMounted = true;
    const hydrateFromCloud = async () => {
      try {
        const [cloudSettings, cloudReminders, cloudApps, cloudRefs, cloudAssess, cloudTasks] =
          await Promise.all([
            fetchPlacementSettingsFromCloud(currentUser.id),
            fetchRemindersFromCloud(currentUser.id),
            fetchApplicationsFromCloud(currentUser.id),
            fetchReferralsFromCloud(currentUser.id),
            fetchAssessmentsFromCloud(currentUser.id),
            fetchDailyTasksFromCloud(currentUser.id),
          ]);

        if (!isMounted) return;

        if (cloudSettings) setSettings(cloudSettings);
        if (cloudReminders && cloudReminders.length > 0) setReminders(cloudReminders);
        if (cloudApps && cloudApps.length > 0) setApplications(cloudApps);
        if (cloudRefs && cloudRefs.length > 0) setReferrals(cloudRefs);
        if (cloudAssess && cloudAssess.length > 0) setAssessments(cloudAssess);
        if (cloudTasks && cloudTasks.length > 0) setDailyTasks(cloudTasks);
      } catch (err) {
        console.error('Failed to hydrate placement data from cloud:', err);
      }
    };

    hydrateFromCloud();
    return () => {
      isMounted = false;
    };
  }, [currentUser]);

  // Today string helper
  const getTodayStr = useCallback((): string => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }, []);

  const todayStr = getTodayStr();

  // Ensure daily tasks for today are created idempotently
  useEffect(() => {
    setDailyTasks((prev) => {
      const today = getTodayStr();
      const existingToday = prev.filter((t) => t.date === today);

      if (existingToday.length >= 4) return prev; // Already generated

      const newTasks: PlacementDailyTask[] = [];

      // 1. DSA Task
      if (!existingToday.some((t) => t.category === 'dsa')) {
        newTasks.push({
          id: `task-dsa-${today}`,
          date: today,
          category: 'dsa',
          title: 'Solve 2 LeetCode Problems (1 Medium Required)',
          description: 'Solve 2 LeetCode problems daily with at least 1 Medium-level challenge.',
          status: 'pending',
          targetCount: settings.dailyDsaTarget || 2,
          currentCount: 0,
          timeSpentMinutes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 2. Project Task
      if (!existingToday.some((t) => t.category === 'project')) {
        newTasks.push({
          id: `task-project-${today}`,
          date: today,
          category: 'project',
          title: 'Spend 1 Focused Hour on Project Development',
          description: 'Work on portfolio features, documentation, architecture, or bug fixes.',
          status: 'pending',
          targetCount: (settings.dailyProjectHours || 1) * 60,
          currentCount: 0,
          timeSpentMinutes: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 3. Applications Task
      if (!existingToday.some((t) => t.category === 'applications')) {
        newTasks.push({
          id: `task-apps-${today}`,
          date: today,
          category: 'applications',
          title: `Submit Daily Job Applications (Target: ${settings.dailyApplicationTarget || 10})`,
          description: 'Apply on LinkedIn, Naukri, Wellfound, and company career portals.',
          status: 'pending',
          targetCount: settings.dailyApplicationTarget || 10,
          currentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      // 4. Referrals Task
      if (!existingToday.some((t) => t.category === 'referrals')) {
        newTasks.push({
          id: `task-referrals-${today}`,
          date: today,
          category: 'referrals',
          title: 'Referral Outreach & Follow-ups',
          description: 'Request employee referrals on LinkedIn and check pending follow-ups.',
          status: 'pending',
          targetCount: 2,
          currentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }

      if (newTasks.length === 0) return prev;

      const combined = [...prev, ...newTasks];
      if (currentUser) {
        newTasks.forEach((t) => syncDailyTaskToCloud(t, currentUser.id));
      }
      return combined;
    });
  }, [getTodayStr, settings, currentUser]);

  // Synchronize DSA problems solved today from DSAContext
  const todayDsaSolved = useMemo(() => {
    return problems.filter((p) => {
      const isSolved = p.status === 'Solved Independently' || p.status === 'Solved with Hints';
      if (!isSolved) return false;
      const compDate = p.completionTime ? p.completionTime.slice(0, 10) : '';
      return compDate === todayStr || p.inTodayPlan;
    });
  }, [problems, todayStr]);

  const todayDsaSolvedCount = todayDsaSolved.length;
  const hasMediumDsaSolvedToday = todayDsaSolved.some(
    (p) => p.difficulty === 'Medium' || p.difficulty === 'Hard'
  );

  // Synchronize Project minutes logged today
  const todayProjectMinutes = useMemo(() => {
    return projectSessions
      .filter((s) => s.date === todayStr)
      .reduce((sum, s) => sum + s.durationMinutes, 0);
  }, [projectSessions, todayStr]);

  // Today's applications count
  const todayApplicationsCount = useMemo(() => {
    return applications.filter((a) => a.applicationDate === todayStr).length;
  }, [applications, todayStr]);

  // Weekly referrals count (current week Monday to Sunday)
  const weeklyReferralsCount = useMemo(() => {
    const now = new Date();
    const dayOfWeek = (now.getDay() + 6) % 7; // Monday = 0, Sunday = 6
    const monday = new Date(now);
    monday.setDate(now.getDate() - dayOfWeek);
    const mondayStr = monday.toISOString().slice(0, 10);

    return referrals.filter((r) => r.dateContacted >= mondayStr && r.dateContacted <= todayStr).length;
  }, [referrals, todayStr]);

  // Follow-ups due
  const followUpsDue = useMemo(() => {
    return referrals.filter((r) => {
      if (r.responseStatus !== 'Pending' && r.responseStatus !== 'Connected') return false;
      if (!r.followUpDate) return false;
      return r.followUpDate <= todayStr;
    });
  }, [referrals, todayStr]);

  // Overdue and Today's tasks
  const { todayTasks, overdueTasks } = useMemo(() => {
    const today = todayStr;
    const todayList: PlacementDailyTask[] = [];
    const overdueList: PlacementDailyTask[] = [];

    dailyTasks.forEach((task) => {
      if (task.date === today) {
        todayList.push(task);
      } else if (task.date < today && task.status !== 'completed' && task.status !== 'rescheduled') {
        overdueList.push({
          ...task,
          isOverdue: true,
        });
      }
    });

    return { todayTasks: todayList, overdueTasks: overdueList };
  }, [dailyTasks, todayStr]);

  // 90-Day Sprint Progress Calculation
  const { sprintDayNumber, sprintTotalDays, sprintProgressPercentage, dailyStreak, completionRate90Day } =
    useMemo(() => {
      const startDate = new Date(settings.sprintStartDate || todayStr);
      const today = new Date(todayStr);
      const diffTime = today.getTime() - startDate.getTime();
      const diffDays = Math.max(1, Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1);
      const dayNum = Math.min(90, Math.max(1, diffDays));
      const totalDays = 90;
      const progressPct = Math.round((dayNum / totalDays) * 100);

      // Streak calculation (consecutive days with completed activity)
      let streak = 0;
      for (let i = 0; i < 30; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().slice(0, 10);

        const hasApps = applications.some((a) => a.applicationDate === dateStr);
        const hasDsa = problems.some(
          (p) =>
            (p.completionTime && p.completionTime.slice(0, 10) === dateStr) ||
            (p.inTodayPlan && dateStr === todayStr && (p.status === 'Solved Independently' || p.status === 'Solved with Hints'))
        );
        const hasTask = dailyTasks.some((t) => t.date === dateStr && t.status === 'completed');

        if (hasApps || hasDsa || hasTask) {
          streak++;
        } else if (i > 0) {
          // If today has no activity yet, don't break streak from yesterday
          break;
        }
      }

      // 90-day task completion rate
      const completedTasksCount = dailyTasks.filter((t) => t.status === 'completed').length;
      const totalTasksTracked = Math.max(1, dailyTasks.length);
      const completionRate = Math.min(100, Math.round((completedTasksCount / totalTasksTracked) * 100));

      return {
        sprintDayNumber: dayNum,
        sprintTotalDays: totalDays,
        sprintProgressPercentage: progressPct,
        dailyStreak: Math.max(1, streak),
        completionRate90Day: completionRate,
      };
    }, [settings.sprintStartDate, todayStr, applications, problems, dailyTasks]);

  // Request browser notification permission explicitly
  const requestPermission = async (): Promise<NotificationPermission> => {
    const perm = await requestNotificationPermission();
    setNotificationPermission(perm);
    if (perm === 'granted') {
      setSettings((prev) => ({ ...prev, browserNotificationsEnabled: true }));
      soundFx.playReminderChime();
      dispatchSystemNotification('Persona Notifications Enabled', {
        body: 'You will receive personalized placement & application alerts according to your schedule.',
      });
    }
    return perm;
  };

  // ==============================================================================
  // Smart Reminder Engine Runner
  // ==============================================================================
  const lastTriggerCache = useRef<Record<string, number>>({});

  useEffect(() => {
    const checkReminderEngine = () => {
      const now = new Date();
      const currentDayOfWeek = now.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
      const currentHour = String(now.getHours()).padStart(2, '0');
      const currentMin = String(now.getMinutes()).padStart(2, '0');
      const currentTimeStr = `${currentHour}:${currentMin}`;
      const today = getTodayStr();

      reminders.forEach((rem) => {
        if (!rem.enabled) return;

        // Check if preferredDays includes today
        if (!rem.preferredDays.includes(currentDayOfWeek)) return;

        // Check snooze
        if (rem.snoozedUntil) {
          const snoozedTime = new Date(rem.snoozedUntil).getTime();
          if (Date.now() < snoozedTime) return; // Still snoozed
        }

        // Deduplication & Throttle: max once per minute per reminder
        const cacheKey = `${rem.id}_${today}_${currentTimeStr}`;
        const dismissedKeys = getDismissedAlertKeys();
        if (dismissedKeys.has(cacheKey)) return;
        if (lastTriggerCache.current[cacheKey]) return;

        // Check if target is already completed for today to avoid repeated annoying alerts
        if (rem.type === 'dsa_session' && todayDsaSolvedCount >= (settings.dailyDsaTarget || 2) && hasMediumDsaSolvedToday) {
          return;
        }
        if (rem.type === 'project_session' && todayProjectMinutes >= (settings.dailyProjectHours || 1) * 60) {
          return;
        }
        if (rem.type === 'job_applications' && todayApplicationsCount >= (settings.dailyApplicationTarget || 10)) {
          return;
        }

        // Match reminder time (preferredTime matches or within last 2 minutes)
        const [prefH, prefM] = rem.preferredTime.split(':').map(Number);
        const [curH, curM] = [now.getHours(), now.getMinutes()];
        const prefMinutes = prefH * 60 + prefM;
        const curMinutes = curH * 60 + curM;

        const isTimeMatch = curMinutes >= prefMinutes && curMinutes <= prefMinutes + 1;

        if (isTimeMatch) {
          lastTriggerCache.current[cacheKey] = Date.now();

          // 1. Play Sound
          if (settings.soundEnabled) {
            soundFx.playReminderChime();
          }

          // 2. Mobile / Device Vibration
          if (settings.vibrationEnabled) {
            soundFx.triggerVibration([200, 100, 200]);
          }

          // 3. Browser notification
          if (settings.browserNotificationsEnabled && notificationPermission === 'granted') {
            dispatchSystemNotification(rem.title, {
              body: rem.description,
              requireInteraction: true,
            });
          }

          // 4. In-App Interactive Modal Alert
          setActiveReminderAlert({
            reminder: rem,
            dueTime: rem.preferredTime,
          });
        }
      });
    };

    // Run immediately then every 20 seconds
    checkReminderEngine();
    const interval = setInterval(checkReminderEngine, 20000);
    return () => clearInterval(interval);
  }, [
    reminders,
    settings,
    notificationPermission,
    getTodayStr,
    todayDsaSolvedCount,
    hasMediumDsaSolvedToday,
    todayProjectMinutes,
    todayApplicationsCount,
  ]);

  // ==============================================================================
  // Action Handlers
  // ==============================================================================

  const updateSettings = (updates: Partial<PlacementSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      if (currentUser) syncPlacementSettingsToCloud(next, currentUser.id);
      return next;
    });
  };

  const updateReminder = (id: string, updates: Partial<PlacementReminderSchedule>) => {
    setReminders((prev) => {
      const next = prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
          if (currentUser) syncReminderToCloud(updated, currentUser.id);
          return updated;
        }
        return r;
      });
      return next;
    });
  };

  const toggleReminderEnabled = (id: string) => {
    setReminders((prev) => {
      return prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, enabled: !r.enabled, updatedAt: new Date().toISOString() };
          if (currentUser) syncReminderToCloud(updated, currentUser.id);
          return updated;
        }
        return r;
      });
    });
  };

  const snoozeReminder = (id: string, minutes: 10 | 30 | 60) => {
    const snoozedUntil = new Date(Date.now() + minutes * 60 * 1000).toISOString();
    updateReminder(id, { snoozedUntil });
    soundFx.playTick();
  };

  const dismissReminder = (id: string) => {
    const today = getTodayStr();
    const rem = reminders.find((r) => r.id === id);
    if (rem) {
      addDismissedAlertKey(`${id}_${today}_${rem.preferredTime}`);
    }
    soundFx.playTick();
  };

  const rescheduleReminder = (id: string, newTime: string, newDays?: number[]) => {
    updateReminder(id, {
      preferredTime: newTime,
      preferredDays: newDays || undefined,
      snoozedUntil: undefined,
    });
    soundFx.playTick();
  };

  // Active in-app alert actions
  const dismissActiveAlert = () => {
    if (activeReminderAlert) {
      dismissReminder(activeReminderAlert.reminder.id);
      setActiveReminderAlert(null);
    }
  };

  const snoozeActiveAlert = (minutes: 10 | 30 | 60) => {
    if (activeReminderAlert) {
      snoozeReminder(activeReminderAlert.reminder.id, minutes);
      setActiveReminderAlert(null);
    }
  };

  const completeActiveAlertTask = () => {
    if (activeReminderAlert) {
      const type = activeReminderAlert.reminder.type;
      const today = getTodayStr();

      setDailyTasks((prev) => {
        return prev.map((t) => {
          if (t.date === today) {
            if (
              (type === 'dsa_session' && t.category === 'dsa') ||
              (type === 'project_session' && t.category === 'project') ||
              (type === 'job_applications' && t.category === 'applications') ||
              (type === 'referral_outreach' && t.category === 'referrals')
            ) {
              const updated: PlacementDailyTask = {
                ...t,
                status: 'completed',
                completedAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
              };
              if (currentUser) syncDailyTaskToCloud(updated, currentUser.id);
              return updated;
            }
          }
          return t;
        });
      });

      try {
        confetti({ particleCount: 80, spread: 60 });
      } catch {}
      soundFx.playFanfare();
      setActiveReminderAlert(null);
    }
  };

  // Applications
  const addJobApplication = (
    data: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>
  ): { success: boolean; duplicate?: boolean; application?: JobApplication } => {
    // Duplicate role and company check
    const isDuplicate = applications.some(
      (a) =>
        a.company.trim().toLowerCase() === data.company.trim().toLowerCase() &&
        a.role.trim().toLowerCase() === data.role.trim().toLowerCase()
    );

    const newApp: JobApplication = {
      ...data,
      id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);

    // Check if daily target achieved with this application
    const newCountToday = todayApplicationsCount + 1;
    if (newCountToday >= (settings.dailyApplicationTarget || 10)) {
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {}
      soundFx.playFanfare();
    } else {
      soundFx.playTick();
    }

    if (currentUser) {
      syncApplicationToCloud(newApp, currentUser.id);
    }

    return { success: true, duplicate: isDuplicate, application: newApp };
  };

  const updateJobApplication = (id: string, updates: Partial<JobApplication>) => {
    setApplications((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates, updatedAt: new Date().toISOString() };
          if (currentUser) syncApplicationToCloud(updated, currentUser.id);
          return updated;
        }
        return a;
      })
    );
    soundFx.playTick();
  };

  const deleteJobApplication = (id: string) => {
    setApplications((prev) => prev.filter((a) => a.id !== id));
    if (currentUser) deleteApplicationFromCloud(id, currentUser.id);
    soundFx.playTick();
  };

  // Referrals
  const addReferral = (
    data: Omit<ReferralOutreach, 'id' | 'createdAt' | 'updatedAt'>
  ): ReferralOutreach => {
    const newRef: ReferralOutreach = {
      ...data,
      id: `ref_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setReferrals((prev) => [newRef, ...prev]);
    soundFx.playTick();

    if (currentUser) {
      syncReferralToCloud(newRef, currentUser.id);
    }

    return newRef;
  };

  const updateReferral = (id: string, updates: Partial<ReferralOutreach>) => {
    setReferrals((prev) =>
      prev.map((r) => {
        if (r.id === id) {
          const updated = { ...r, ...updates, updatedAt: new Date().toISOString() };
          if (currentUser) syncReferralToCloud(updated, currentUser.id);
          return updated;
        }
        return r;
      })
    );
    soundFx.playTick();
  };

  const deleteReferral = (id: string) => {
    setReferrals((prev) => prev.filter((r) => r.id !== id));
    if (currentUser) deleteReferralFromCloud(id, currentUser.id);
    soundFx.playTick();
  };

  // Weekend Assessments
  const addWeekendAssessment = (
    data: Omit<WeekendAssessment, 'id' | 'createdAt' | 'updatedAt'>
  ): WeekendAssessment => {
    const newAssess: WeekendAssessment = {
      ...data,
      id: `assess_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setAssessments((prev) => [newAssess, ...prev]);
    soundFx.playTick();

    if (currentUser) {
      syncAssessmentToCloud(newAssess, currentUser.id);
    }

    return newAssess;
  };

  const updateWeekendAssessment = (id: string, updates: Partial<WeekendAssessment>) => {
    setAssessments((prev) =>
      prev.map((a) => {
        if (a.id === id) {
          const updated = { ...a, ...updates, updatedAt: new Date().toISOString() };
          if (currentUser) syncAssessmentToCloud(updated, currentUser.id);
          return updated;
        }
        return a;
      })
    );
    soundFx.playTick();
  };

  const deleteWeekendAssessment = (id: string) => {
    setAssessments((prev) => prev.filter((a) => a.id !== id));
    soundFx.playTick();
  };

  const rescheduleAssessment = (id: string, newDate: string) => {
    updateWeekendAssessment(id, {
      rescheduledDate: newDate,
      status: 'Rescheduled',
    });
  };

  // Daily Tasks & Project
  const toggleTaskStatus = (taskId: string, status: TaskCompletionStatus) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: PlacementDailyTask = {
            ...t,
            status,
            completedAt: status === 'completed' ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
          if (status === 'completed') {
            try {
              confetti({ particleCount: 70, spread: 60 });
            } catch {}
            soundFx.playFanfare();
          } else {
            soundFx.playTick();
          }
          if (currentUser) syncDailyTaskToCloud(updated, currentUser.id);
          return updated;
        }
        return t;
      })
    );
  };

  const rescheduleTask = (taskId: string, newDate: string) => {
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const updated: PlacementDailyTask = {
            ...t,
            status: 'rescheduled',
            rescheduledTo: newDate,
            updatedAt: new Date().toISOString(),
          };
          if (currentUser) syncDailyTaskToCloud(updated, currentUser.id);
          return updated;
        }
        return t;
      })
    );
    soundFx.playTick();
  };

  const logProjectSession = (
    title: string,
    durationMinutes: number,
    notes?: string,
    repoOrBranch?: string
  ) => {
    const newSession: ProjectSessionLog = {
      id: `proj_${Date.now()}`,
      userId: currentUser?.id,
      date: getTodayStr(),
      title,
      durationMinutes,
      notes,
      repoOrBranch,
      completedAt: new Date().toISOString(),
    };

    setProjectSessions((prev) => [newSession, ...prev]);

    // Update today's project daily task progress
    setDailyTasks((prev) =>
      prev.map((t) => {
        if (t.date === getTodayStr() && t.category === 'project') {
          const newMins = (t.timeSpentMinutes || 0) + durationMinutes;
          const target = (settings.dailyProjectHours || 1) * 60;
          const isDone = newMins >= target;
          return {
            ...t,
            timeSpentMinutes: newMins,
            currentCount: newMins,
            status: isDone ? 'completed' : 'partially_completed',
            completedAt: isDone ? new Date().toISOString() : undefined,
            updatedAt: new Date().toISOString(),
          };
        }
        return t;
      })
    );

    try {
      confetti({ particleCount: 60, spread: 50 });
    } catch {}
    soundFx.playFanfare();
  };

  const resetAllData = () => {
    clearAllPlacementData();
    setSettings(loadPlacementSettings());
    setReminders(loadPlacementReminders());
    setApplications(loadJobApplications());
    setReferrals(loadReferrals());
    setAssessments(loadWeekendAssessments());
    setDailyTasks(loadPlacementDailyTasks());
    setProjectSessions([]);
    soundFx.playTick();
  };

  return (
    <PlacementContext.Provider
      value={{
        activePlacementTab,
        setActivePlacementTab,
        settings,
        updateSettings,
        reminders,
        updateReminder,
        toggleReminderEnabled,
        snoozeReminder,
        dismissReminder,
        rescheduleReminder,
        applications,
        addJobApplication,
        updateJobApplication,
        deleteJobApplication,
        referrals,
        addReferral,
        updateReferral,
        deleteReferral,
        assessments,
        addWeekendAssessment,
        updateWeekendAssessment,
        deleteWeekendAssessment,
        rescheduleAssessment,
        dailyTasks,
        projectSessions,
        toggleTaskStatus,
        rescheduleTask,
        logProjectSession,
        activeReminderAlert,
        dismissActiveAlert,
        snoozeActiveAlert,
        completeActiveAlertTask,
        notificationPermission,
        requestPermission,
        sprintDayNumber,
        sprintTotalDays,
        sprintProgressPercentage,
        todayApplicationsCount,
        todayApplicationsTarget: settings.dailyApplicationTarget || 10,
        weeklyReferralsCount,
        weeklyReferralsTarget: settings.weeklyReferralTarget || 7,
        followUpsDue,
        overdueTasks,
        todayTasks,
        todayDsaSolvedCount,
        hasMediumDsaSolvedToday,
        todayProjectMinutes,
        dailyStreak,
        completionRate90Day,
        resetAllData,
      }}
    >
      {children}
    </PlacementContext.Provider>
  );
};

export const usePlacement = (): PlacementContextType => {
  const context = useContext(PlacementContext);
  if (!context) {
    throw new Error('usePlacement must be used within a PlacementProvider');
  }
  return context;
};
