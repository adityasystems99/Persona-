import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import confetti from 'canvas-confetti';
import { User } from '@supabase/supabase-js';
import {
  Problem,
  ProblemStatus,
  DailyPlan,
  STLPracticeState,
  STLTopicItem,
  AccountabilitySettings,
  StudyDayLog,
  AppNotification,
  ActiveTab,
  Difficulty,
  Platform,
  STLExercise,
  FocusSession,
  Milestone,
  RescheduleEvent,
  TopicMasteryStats,
  ReadinessBreakdown,
  NotificationType,
  Playlist,
  PlaylistCategory,
  PlaylistItem,
  TimestampBookmark,
} from '../types/dsa';
import {
  loadStoredProblems,
  saveStoredProblems,
  loadStoredDailyPlan,
  saveStoredDailyPlan,
  loadStoredSTLState,
  saveStoredSTLState,
  loadStoredSTLTopics,
  saveStoredSTLTopics,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredStudyLogs,
  saveStoredStudyLogs,
  loadStoredNotifications,
  saveStoredNotifications,
  loadStoredSTLExercises,
  saveStoredSTLExercises,
  loadStoredFocusSessions,
  saveStoredFocusSessions,
  loadStoredActiveFocus,
  saveStoredActiveFocus,
  loadStoredMilestones,
  saveStoredMilestones,
  loadStoredRescheduleEvents,
  saveStoredRescheduleEvents,
  loadStoredPlaylists,
  saveStoredPlaylists,
  getLastHourlyReminderTimestamp,
  setLastHourlyReminderTimestamp,
  clearAllAlgoPulseData,
  ActiveFocusState,
} from '../utils/storage';
import { soundFx } from '../utils/audio';
import {
  dispatchSystemNotification,
  isWithinStudyWindow,
  hasNotificationBeenDispatchedRecently,
} from '../utils/notifications';
import {
  INITIAL_PROBLEMS,
  INITIAL_PAST_LOGS,
  INITIAL_STL_STATE,
  DEFAULT_SETTINGS,
  getTodayDateString,
} from '../data/initialData';
import { INITIAL_STL_TOPICS } from '../data/stlTopics';
import { INITIAL_STL_EXERCISES } from '../data/stlExercises';
import { INITIAL_MILESTONES } from '../data/milestonesData';
import { INITIAL_PLAYLISTS } from '../data/playlistData';
import {
  computeTopicMasteryMap,
  computeInterviewReadiness,
  computeWeeklyAutopsy,
  calculateNextSpacedRepetitionDate,
} from '../utils/intelligence';
import {
  supabase,
  isSupabaseConfigured,
  fetchAllUserDataFromCloud,
  syncProblemToCloud,
  deleteProblemFromCloud,
  syncDailyPlanToCloud,
  syncSTLSessionToCloud,
  syncSettingsToCloud,
  syncStudyLogToCloud,
  syncFocusSessionToCloud,
  syncSTLExerciseToCloud,
  syncMilestoneToCloud,
  syncRescheduleEventToCloud,
  syncPlaylistToCloud,
  syncPlaylistItemToCloud,
  deletePlaylistFromCloud,
  deletePlaylistItemFromCloud,
} from '../lib/supabase';

interface DSAContextType {
  problems: Problem[];
  dailyPlan: DailyPlan;
  stlState: STLPracticeState;
  stlTopics: STLTopicItem[];
  settings: AccountabilitySettings;
  studyLogs: StudyDayLog[];
  notifications: AppNotification[];
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;

  // Supabase Auth & Cloud Sync
  currentUser: User | null;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  syncLocalDataToCloud: () => Promise<void>;

  // Problem actions
  addProblem: (data: Partial<Problem>) => Problem;
  updateProblem: (id: string, updates: Partial<Problem>) => void;
  deleteProblem: (id: string) => void;
  toggleProblemStatus: (
    id: string,
    status: ProblemStatus,
    timeSpent?: number,
    solvedIndependently?: boolean
  ) => void;
  toggleInTodayPlan: (id: string) => void;
  reorderTodayPlan: (problemId: string, direction: 'up' | 'down') => void;
  bulkAddProblems: (
    items: {
      title: string;
      difficulty: Difficulty;
      topic: string;
      url?: string;
      platform?: Platform;
    }[]
  ) => number;

  // Plan actions
  updateDailyPlan: (updates: Partial<DailyPlan>) => void;

  // STL actions & Exercises (Feature 4)
  startSTLTimer: () => void;
  pauseSTLTimer: () => void;
  resetSTLTimer: () => void;
  extendSTLTimer: (seconds: number) => void;
  updateSTLState: (updates: Partial<STLPracticeState>) => void;
  toggleSTLTopicComplete: (topicId: string) => void;
  markSTLComplete: () => void;
  stlExercises: STLExercise[];
  toggleSTLExerciseComplete: (exerciseId: string, userCode?: string) => void;
  updateSTLExerciseCode: (exerciseId: string, userCode: string) => void;

  // Revision & Spaced Repetition (Feature 3)
  scheduleRevision: (
    problemId: string,
    scheduledDate: string,
    mistakes?: string,
    patternLearned?: string
  ) => void;
  logRevisionAttempt: (problemId: string, success: boolean, notes: string) => void;
  logSpacedRepetitionOutcome: (
    problemId: string,
    outcome: 'success' | 'hints' | 'failed',
    notes: string
  ) => void;
  removeRevision: (problemId: string) => void;
  spacedRepetitionQueue: {
    overdue: Problem[];
    dueToday: Problem[];
    upcoming: Problem[];
  };

  // Focus Mode (Feature 5)
  focusSessions: FocusSession[];
  activeFocusSession: ActiveFocusState | null;
  startFocusSession: (problem: Problem) => void;
  pauseFocusSession: () => void;
  resumeFocusSession: () => void;
  recordFocusHint: (notes?: string) => void;
  recordFocusMistake: (mistakeText: string) => void;
  finishFocusSession: (solvedStatus: ProblemStatus, approachNotes?: string) => void;
  cancelFocusSession: () => void;

  // Adaptive Recovery Engine (Feature 1)
  rescheduleEvents: RescheduleEvent[];
  incompleteTasks: Problem[];
  carryOverTasksToToday: (problemIds: string[]) => void;
  rescheduleTaskDate: (problemId: string, newDate: string, reason?: string) => void;
  skipTaskWithReason: (problemId: string, reason: string) => void;
  retainTaskInQueue: (problemId: string) => void;
  recalculateDailyTargets: () => void;

  // Weakness Intelligence Map (Feature 2)
  topicMasteryMap: TopicMasteryStats[];
  weakestTopics: TopicMasteryStats[];
  recommendedRevisionProblems: Problem[];

  // Interview Readiness Meter (Feature 8)
  readinessBreakdown: ReadinessBreakdown;

  // Weekly Performance Autopsy (Feature 6)
  getWeeklyAutopsyData: (offsetWeeks?: number) => ReturnType<typeof computeWeeklyAutopsy>;

  // Proof-of-Skill Milestones (Feature 7)
  milestones: Milestone[];
  checkMilestoneProgress: () => void;

  // Playlist Tracker & Sequential Timestamps
  playlists: Playlist[];
  activePlaylistCategory: PlaylistCategory;
  setActivePlaylistCategory: (category: PlaylistCategory) => void;
  selectedPlaylistId: string | null;
  setSelectedPlaylistId: (id: string | null) => void;
  addPlaylist: (playlist: {
    category: PlaylistCategory;
    title: string;
    description?: string;
    topic?: string;
  }) => Playlist;
  updatePlaylist: (id: string, updates: Partial<Playlist>) => void;
  deletePlaylist: (id: string) => void;
  reorderPlaylists: (playlistId: string, direction: 'up' | 'down') => void;
  addPlaylistItem: (
    playlistId: string,
    item: {
      title: string;
      videoUrl: string;
      topic?: string;
      durationSeconds: number;
      notes?: string;
    }
  ) => PlaylistItem;
  updatePlaylistItem: (playlistId: string, itemId: string, updates: Partial<PlaylistItem>) => void;
  deletePlaylistItem: (playlistId: string, itemId: string) => void;
  reorderPlaylistItems: (playlistId: string, itemId: string, direction: 'up' | 'down') => void;
  updateWatchTimestamp: (
    playlistId: string,
    itemId: string,
    watchedSeconds: number,
    markCompleted?: boolean
  ) => void;
  addTimestampBookmark: (
    playlistId: string,
    itemId: string,
    bookmark: {
      timestampSeconds: number;
      label: string;
      note?: string;
    }
  ) => void;
  deleteTimestampBookmark: (playlistId: string, itemId: string, bookmarkId: string) => void;

  // Settings & alerts (Feature 9)
  updateSettings: (updates: Partial<AccountabilitySettings>) => void;
  addNotification: (
    title: string,
    message: string,
    type?: NotificationType,
    dedupKey?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;

  // Data reset & recovery
  resetToSampleData: () => void;
  clearAllData: () => void;
  importAllData: (data: Record<string, unknown>) => boolean;

  // Real computed stats
  stats: {
    todaySolvedCount: number;
    todayEasySolved: number;
    todayMediumSolved: number;
    todayHardSolved: number;
    todayIndependentSolved: number;
    todayWithHintsSolved: number;
    todayTotalDsaMinutes: number;
    todayStlMinutes: number;
    todayPlanAssignedCount: number;
    todayPlanRemainingCount: number;
    completionPercentage: number;
    revisionQueueCount: number;
    totalProblemsCount: number;
  };
}

const DSAContext = createContext<DSAContextType | null>(null);

export const DSAProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State Initialization from localStorage
  const [problems, setProblems] = useState<Problem[]>(loadStoredProblems);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(loadStoredDailyPlan);
  const [stlState, setStlState] = useState<STLPracticeState>(loadStoredSTLState);
  const [stlTopics, setStlTopics] = useState<STLTopicItem[]>(loadStoredSTLTopics);
  const [stlExercises, setStlExercises] = useState<STLExercise[]>(loadStoredSTLExercises);
  const [settings, setSettings] = useState<AccountabilitySettings>(loadStoredSettings);
  const [studyLogs, setStudyLogs] = useState<StudyDayLog[]>(loadStoredStudyLogs);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadStoredNotifications);
  const [focusSessions, setFocusSessions] = useState<FocusSession[]>(loadStoredFocusSessions);
  const [activeFocusSession, setActiveFocusSession] = useState<ActiveFocusState | null>(loadStoredActiveFocus);
  const [milestones, setMilestones] = useState<Milestone[]>(loadStoredMilestones);
  const [rescheduleEvents, setRescheduleEvents] = useState<RescheduleEvent[]>(loadStoredRescheduleEvents);
  const [playlists, setPlaylists] = useState<Playlist[]>(loadStoredPlaylists);
  const [activePlaylistCategory, setActivePlaylistCategory] = useState<PlaylistCategory>('dsa');
  const [selectedPlaylistId, setSelectedPlaylistId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  // Supabase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authModalOpen, setAuthModalOpen] = useState(false);

  const todayStr = getTodayDateString();

  // Listen for Supabase Auth state changes & sync initial data
  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      setCurrentUser(session?.user ?? null);
      if (session?.user) {
        loadCloudData(session.user.id);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        loadCloudData(user.id);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadCloudData = async (userId: string) => {
    const cloudData = await fetchAllUserDataFromCloud(userId);
    if (!cloudData) return;

    if (cloudData.problems && cloudData.problems.length > 0) {
      setProblems(cloudData.problems);
    }
    if (cloudData.dailyPlans && cloudData.dailyPlans.length > 0) {
      const todayPlan = cloudData.dailyPlans.find((p) => p.date === todayStr);
      if (todayPlan) setDailyPlan(todayPlan);
    }
    if (cloudData.stlSessions && cloudData.stlSessions.length > 0) {
      const todaySTL = cloudData.stlSessions.find((s) => s.date === todayStr);
      if (todaySTL) setStlState(todaySTL);
    }
    if (cloudData.settings) {
      setSettings(cloudData.settings);
    }
    if (cloudData.studyLogs && cloudData.studyLogs.length > 0) {
      setStudyLogs(cloudData.studyLogs);
    }
    if (cloudData.focusSessions && cloudData.focusSessions.length > 0) {
      setFocusSessions(cloudData.focusSessions);
    }
    if (cloudData.rescheduleEvents && cloudData.rescheduleEvents.length > 0) {
      setRescheduleEvents(cloudData.rescheduleEvents);
    }
  };

  const syncLocalDataToCloud = async () => {
    if (!currentUser) return;
    const userId = currentUser.id;

    for (const p of problems) {
      await syncProblemToCloud(p, userId);
    }
    await syncDailyPlanToCloud(dailyPlan, userId);
    await syncSTLSessionToCloud(stlState, userId);
    await syncSettingsToCloud(settings, userId);
    for (const l of studyLogs) {
      await syncStudyLogToCloud(l, userId);
    }
    for (const f of focusSessions) {
      await syncFocusSessionToCloud(f, userId);
    }
    for (const e of stlExercises) {
      await syncSTLExerciseToCloud(e, userId);
    }
    for (const m of milestones) {
      await syncMilestoneToCloud(m, userId);
    }
    for (const r of rescheduleEvents) {
      await syncRescheduleEventToCloud(r, userId);
    }
    for (const pl of playlists) {
      await syncPlaylistToCloud(pl, userId);
    }
  };

  // Local storage synchronization
  useEffect(() => {
    saveStoredProblems(problems);
  }, [problems]);

  useEffect(() => {
    saveStoredDailyPlan(dailyPlan);
  }, [dailyPlan]);

  useEffect(() => {
    saveStoredSTLState(stlState);
  }, [stlState]);

  useEffect(() => {
    saveStoredSTLTopics(stlTopics);
  }, [stlTopics]);

  useEffect(() => {
    saveStoredSTLExercises(stlExercises);
  }, [stlExercises]);

  useEffect(() => {
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredStudyLogs(studyLogs);
  }, [studyLogs]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  useEffect(() => {
    saveStoredFocusSessions(focusSessions);
  }, [focusSessions]);

  useEffect(() => {
    saveStoredActiveFocus(activeFocusSession);
  }, [activeFocusSession]);

  useEffect(() => {
    saveStoredMilestones(milestones);
  }, [milestones]);

  useEffect(() => {
    saveStoredRescheduleEvents(rescheduleEvents);
  }, [rescheduleEvents]);

  useEffect(() => {
    saveStoredPlaylists(playlists);
  }, [playlists]);

  // Feature 9: Notification Intelligence & Deduplication
  const addNotification = useCallback(
    (
      title: string,
      message: string,
      type: NotificationType = 'info',
      dedupKey?: string
    ) => {
      // Respect quiet hours / study window unless it's a critical milestone or focus event
      if (type === 'reminder') {
        if (!isWithinStudyWindow(settings.studyStartTime, settings.studyEndTime)) {
          return;
        }
      }

      // Deduplicate if needed
      if (dedupKey && hasNotificationBeenDispatchedRecently(dedupKey, 3600000)) {
        return;
      }

      const newNotif: AppNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        message,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        type,
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 39)]);

      if (settings.browserNotificationsEnabled) {
        dispatchSystemNotification(title, { body: message });
      }

      if (settings.soundEnabled) {
        if (type === 'success' || type === 'stl' || type === 'milestone') {
          soundFx.playFanfare();
        } else {
          soundFx.playChime();
        }
      }
    },
    [settings.studyStartTime, settings.studyEndTime, settings.browserNotificationsEnabled, settings.soundEnabled]
  );

  // Study log updater helper
  const updateTodayStudyLog = (diff: Partial<StudyDayLog>) => {
    setStudyLogs((prev) => {
      const todayIndex = prev.findIndex((l) => l.date === todayStr);
      let updatedLog: StudyDayLog;

      if (todayIndex >= 0) {
        const updated = [...prev];
        updatedLog = { ...updated[todayIndex], ...diff };
        updated[todayIndex] = updatedLog;
        if (currentUser) syncStudyLogToCloud(updatedLog, currentUser.id);
        return updated;
      } else {
        updatedLog = {
          date: todayStr,
          solvedCount: 0,
          easySolved: 0,
          mediumSolved: 0,
          hardSolved: 0,
          independentCount: 0,
          hintsCount: 0,
          dsaMinutes: 0,
          stlMinutes: 0,
          stlCompleted: false,
          targetMet: false,
          ...diff,
        };
        if (currentUser) syncStudyLogToCloud(updatedLog, currentUser.id);
        return [updatedLog, ...prev];
      }
    });
  };

  // Feature 7: Proof-of-Skill Milestones Evaluation (Idempotent)
  const checkMilestoneProgress = useCallback(() => {
    setMilestones((prev) => {
      let changed = false;
      const updated = prev.map((m) => {
        if (m.isUnlocked) return m;

        let shouldUnlock = false;
        let nextVal = m.currentValue;

        if (m.id === 'first_blood') {
          const count = problems.filter((p) => p.solvedIndependently).length;
          nextVal = count;
          shouldUnlock = count >= 1;
        } else if (m.id === 'memory_architect') {
          const successRev = problems.some((p) =>
            p.revisionHistory?.some((r) => r.success)
          );
          nextVal = successRev ? 1 : 0;
          shouldUnlock = successRev;
        } else if (m.id === 'stl_marathoner') {
          const count = studyLogs.filter((l) => l.stlCompleted).length;
          nextVal = count;
          shouldUnlock = count >= 7;
        } else if (m.id === 'topic_champion') {
          const topicCounts: Record<string, number> = {};
          problems
            .filter((p) => p.solvedIndependently)
            .forEach((p) => {
              topicCounts[p.topic] = (topicCounts[p.topic] || 0) + 1;
            });
          const maxTopic = Math.max(0, ...Object.values(topicCounts));
          nextVal = maxTopic;
          shouldUnlock = maxTopic >= 3;
        } else if (m.id === 'complexity_analyst') {
          const analyzed = problems.filter(
            (p) =>
              Boolean(p.timeComplexity && p.timeComplexity.trim() !== '') &&
              Boolean(p.spaceComplexity && p.spaceComplexity.trim() !== '')
          ).length;
          nextVal = analyzed;
          shouldUnlock = analyzed >= 5;
        } else if (m.id === 'resilient_recovery') {
          const recovered = rescheduleEvents.some((r) => r.action === 'carry_over');
          nextVal = recovered ? 1 : 0;
          shouldUnlock = recovered;
        } else if (m.id === 'stl_drill_master') {
          const completedExercises = stlExercises.filter((e) => e.isCompleted).length;
          nextVal = completedExercises;
          shouldUnlock = completedExercises >= 5;
        } else if (m.id === 'deep_focus') {
          const hasDeep = focusSessions.some((f) => f.activeSeconds >= 1500); // 25 mins
          nextVal = hasDeep ? 1 : 0;
          shouldUnlock = hasDeep;
        }

        if (shouldUnlock && !m.isUnlocked) {
          changed = true;
          try {
            confetti({ particleCount: 120, spread: 80 });
          } catch {}
          addNotification(
            `Milestone Unlocked: ${m.title}!`,
            m.description,
            'milestone',
            `milestone-${m.id}`
          );

          const unlockedMilestone = {
            ...m,
            currentValue: nextVal,
            isUnlocked: true,
            unlockedAt: new Date().toISOString(),
          };
          if (currentUser) syncMilestoneToCloud(unlockedMilestone, currentUser.id);
          return unlockedMilestone;
        }

        if (nextVal !== m.currentValue) {
          changed = true;
          return { ...m, currentValue: nextVal };
        }

        return m;
      });

      return changed ? updated : prev;
    });
  }, [problems, studyLogs, rescheduleEvents, stlExercises, focusSessions, addNotification, currentUser]);

  // STL Timer Countdown Effect
  const stlStateRef = useRef(stlState);
  stlStateRef.current = stlState;

  useEffect(() => {
    if (!stlState.isRunning) return;

    const interval = setInterval(() => {
      setStlState((curr) => {
        if (!curr.isRunning) return curr;

        const nextRemaining = curr.remainingSeconds - 1;
        if (nextRemaining <= 0) {
          clearInterval(interval);
          if (settings.soundEnabled) soundFx.playFanfare();

          try {
            confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
          } catch {}

          addNotification(
            '30-Min STL Session Completed!',
            'Outstanding dedication! You wrapped up your daily 30-minute C++ STL practice session.',
            'stl'
          );

          const updatedPlan = { ...dailyPlan, stlCompleted: true };
          setDailyPlan(updatedPlan);
          if (currentUser) syncDailyPlanToCloud(updatedPlan, currentUser.id);

          updateTodayStudyLog({ stlMinutes: 30, stlCompleted: true });

          const completedState = {
            ...curr,
            remainingSeconds: 0,
            isRunning: false,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            lastTickTimestamp: Date.now(),
          };
          if (currentUser) syncSTLSessionToCloud(completedState, currentUser.id);

          // Evaluate STL Milestone
          checkMilestoneProgress();
          return completedState;
        }

        return {
          ...curr,
          remainingSeconds: nextRemaining,
          lastTickTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stlState.isRunning, settings.soundEnabled, addNotification, currentUser, dailyPlan, checkMilestoneProgress]);

  // Hourly Accountability & Reminder Runner
  useEffect(() => {
    if (!settings.hourlyRemindersEnabled) return;

    const checkReminders = () => {
      const nowMs = Date.now();
      const lastCheck = getLastHourlyReminderTimestamp();
      const intervalMs = settings.reminderIntervalMinutes * 60 * 1000;

      if (nowMs - lastCheck < intervalMs) return;
      if (!isWithinStudyWindow(settings.studyStartTime, settings.studyEndTime)) return;

      setLastHourlyReminderTimestamp(nowMs);

      const todayProblems = problems.filter((p) => p.inTodayPlan);
      const solvedToday = todayProblems.filter(
        (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
      );
      const pendingCount = todayProblems.length - solvedToday.length;

      if (settings.stlReminderEnabled && !stlStateRef.current.isCompleted) {
        addNotification(
          'STL Practice Pending',
          '30-minute C++ STL session is still pending today! Take 30 mins to drill containers & iterators.',
          'reminder',
          `stl-pending-${todayStr}`
        );
      } else if (pendingCount > 0) {
        addNotification(
          'Hourly DSA Check-in',
          `You've solved ${solvedToday.length} of ${todayProblems.length} planned problems today. ${pendingCount} remaining. Keep up the focus!`,
          'reminder',
          `hourly-${Math.floor(nowMs / 3600000)}`
        );
      } else if (todayProblems.length > 0) {
        addNotification(
          'Daily Target Achieved!',
          'All assigned DSA problems for today are completed! Great work.',
          'success',
          `target-achieved-${todayStr}`
        );
      }
    };

    checkReminders();
    const reminderInterval = setInterval(checkReminders, 60000);
    return () => clearInterval(reminderInterval);
  }, [settings, problems, addNotification, todayStr]);

  // Problem actions
  const addProblem = (data: Partial<Problem>): Problem => {
    const todayProblems = problems.filter((p) => p.inTodayPlan);
    const newProblem: Problem = {
      id: `prob-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      title: data.title?.trim() || 'Untitled Problem',
      topic: data.topic?.trim() || 'General DSA',
      subtopic: data.subtopic?.trim() || '',
      difficulty: data.difficulty || 'Easy',
      platform: data.platform || 'LeetCode',
      url: data.url?.trim() || '',
      status: data.status || 'Not Started',
      timeSpentMinutes: data.timeSpentMinutes || 0,
      notes: data.notes || '',
      approach: data.approach || '',
      timeComplexity: data.timeComplexity || '',
      spaceComplexity: data.spaceComplexity || '',
      attempts: data.attempts || (data.status?.startsWith('Solved') ? 1 : 0),
      solvedIndependently: data.solvedIndependently ?? (data.status === 'Solved Independently'),
      inTodayPlan: data.inTodayPlan ?? true,
      orderInPlan: todayProblems.length + 1,
      needsRevision: data.needsRevision ?? false,
      revisionScheduledDate: data.revisionScheduledDate,
      mistakes: data.mistakes,
      patternLearned: data.patternLearned,
      hintsUsed: data.hintsUsed || 0,
      hintsNotes: data.hintsNotes || '',
      focusTimeSeconds: data.focusTimeSeconds || 0,
      spacedRepetitionStage: 0,
      revisionHistory: [],
      rescheduleHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProblems((prev) => [newProblem, ...prev]);
    if (currentUser) syncProblemToCloud(newProblem, currentUser.id);
    addNotification('Problem Added', `"${newProblem.title}" added to question bank.`, 'info');
    setTimeout(checkMilestoneProgress, 100);
    return newProblem;
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const updated = {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );
    setTimeout(checkMilestoneProgress, 100);
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
    if (currentUser) deleteProblemFromCloud(id, currentUser.id);
    addNotification('Problem Removed', 'Problem removed from database.', 'info');
  };

  const toggleProblemStatus = (
    id: string,
    newStatus: ProblemStatus,
    timeSpent?: number,
    solvedIndependently?: boolean
  ) => {
    const isSolvedNow =
      newStatus === 'Solved Independently' || newStatus === 'Solved with Hints';
    const isIndependent =
      solvedIndependently ?? (newStatus === 'Solved Independently');

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const updated: Problem = {
          ...p,
          status: newStatus,
          solvedIndependently: isIndependent,
          timeSpentMinutes: timeSpent !== undefined ? timeSpent : (p.timeSpentMinutes || 20),
          attempts: p.attempts ? p.attempts + (isSolvedNow ? 0 : 1) : 1,
          completionTime: isSolvedNow ? new Date().toISOString() : p.completionTime,
          completedAt: isSolvedNow ? (p.completedAt || new Date().toISOString()) : p.completedAt,
          needsRevision:
            newStatus === 'Solved with Hints' || newStatus === 'Needs Revision'
              ? true
              : p.needsRevision,
          revisionScheduledDate:
            newStatus === 'Solved with Hints' || newStatus === 'Needs Revision'
              ? p.revisionScheduledDate || todayStr
              : p.revisionScheduledDate,
          updatedAt: new Date().toISOString(),
        };

        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    if (newStatus === 'Solved Independently') {
      if (settings.soundEnabled) soundFx.playTick();
      addNotification('Problem Solved Independently!', 'Great job! Solved without hints.', 'success');
    } else if (newStatus === 'Solved with Hints') {
      addNotification(
        'Solved with Hints',
        'Marked in Revision Queue so you can test your intuition again later.',
        'info'
      );
    }

    setTimeout(checkMilestoneProgress, 200);
  };

  const toggleInTodayPlan = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextInPlan = !p.inTodayPlan;
        const updated = {
          ...p,
          inTodayPlan: nextInPlan,
          orderInPlan: nextInPlan ? 999 : 0,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );
  };

  const reorderTodayPlan = (problemId: string, direction: 'up' | 'down') => {
    setProblems((prev) => {
      const todayList = prev
        .filter((p) => p.inTodayPlan)
        .sort((a, b) => a.orderInPlan - b.orderInPlan);

      const idx = todayList.findIndex((p) => p.id === problemId);
      if (idx === -1) return prev;

      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= todayList.length) return prev;

      const currentItem = todayList[idx];
      const targetItem = todayList[targetIdx];

      const currentOrder = currentItem.orderInPlan;
      currentItem.orderInPlan = targetItem.orderInPlan;
      targetItem.orderInPlan = currentOrder;

      if (currentUser) {
        syncProblemToCloud(currentItem, currentUser.id);
        syncProblemToCloud(targetItem, currentUser.id);
      }

      return [...prev];
    });
  };

  const bulkAddProblems = (
    items: {
      title: string;
      difficulty: Difficulty;
      topic: string;
      url?: string;
      platform?: Platform;
    }[]
  ): number => {
    const newItems: Problem[] = items.map((item, i) => ({
      id: `prob-bulk-${Date.now()}-${i}`,
      title: item.title,
      topic: item.topic || 'General DSA',
      subtopic: '',
      difficulty: item.difficulty || 'Easy',
      platform: item.platform || 'LeetCode',
      url: item.url || '',
      status: 'Not Started',
      timeSpentMinutes: 0,
      attempts: 0,
      solvedIndependently: false,
      inTodayPlan: false,
      orderInPlan: 0,
      needsRevision: false,
      revisionHistory: [],
      rescheduleHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setProblems((prev) => [...newItems, ...prev]);
    if (currentUser) {
      newItems.forEach((p) => syncProblemToCloud(p, currentUser.id));
    }
    addNotification('Bulk Import Successful', `Added ${newItems.length} problems to your library.`, 'info');
    return newItems.length;
  };

  const updateDailyPlan = (updates: Partial<DailyPlan>) => {
    setDailyPlan((prev) => {
      const updated = { ...prev, ...updates };
      if (currentUser) syncDailyPlanToCloud(updated, currentUser.id);
      return updated;
    });
  };

  // STL Timer actions
  const startSTLTimer = () => {
    if (stlState.remainingSeconds <= 0) return;
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => {
      const updated = {
        ...prev,
        isRunning: true,
        lastTickTimestamp: Date.now(),
      };
      if (currentUser) syncSTLSessionToCloud(updated, currentUser.id);
      return updated;
    });
  };

  const pauseSTLTimer = () => {
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => {
      const updated = {
        ...prev,
        isRunning: false,
        lastTickTimestamp: Date.now(),
      };
      if (currentUser) syncSTLSessionToCloud(updated, currentUser.id);
      return updated;
    });
  };

  const resetSTLTimer = () => {
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => {
      const updated = {
        ...prev,
        isRunning: false,
        remainingSeconds: prev.totalSeconds,
        isCompleted: false,
        lastTickTimestamp: Date.now(),
      };
      if (currentUser) syncSTLSessionToCloud(updated, currentUser.id);
      return updated;
    });
  };

  const extendSTLTimer = (seconds: number) => {
    setStlState((prev) => {
      const updated = {
        ...prev,
        remainingSeconds: prev.remainingSeconds + seconds,
        totalSeconds: Math.max(prev.totalSeconds, prev.remainingSeconds + seconds),
      };
      if (currentUser) syncSTLSessionToCloud(updated, currentUser.id);
      return updated;
    });
  };

  const updateSTLState = (updates: Partial<STLPracticeState>) => {
    setStlState((prev) => {
      const updated = { ...prev, ...updates };
      if (currentUser) syncSTLSessionToCloud(updated, currentUser.id);
      return updated;
    });
  };

  const toggleSTLTopicComplete = (topicId: string) => {
    setStlTopics((prev) =>
      prev.map((t) => {
        if (t.id !== topicId) return t;
        const exists = t.completedDates.includes(todayStr);
        const nextDates = exists
          ? t.completedDates.filter((d) => d !== todayStr)
          : [...t.completedDates, todayStr];
        return { ...t, completedDates: nextDates };
      })
    );
  };

  const markSTLComplete = () => {
    if (settings.soundEnabled) soundFx.playFanfare();
    try {
      confetti({ particleCount: 80, spread: 60 });
    } catch {}

    const completedState = {
      ...stlState,
      isRunning: false,
      remainingSeconds: 0,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    };
    setStlState(completedState);

    const updatedPlan = { ...dailyPlan, stlCompleted: true };
    setDailyPlan(updatedPlan);

    if (currentUser) {
      syncSTLSessionToCloud(completedState, currentUser.id);
      syncDailyPlanToCloud(updatedPlan, currentUser.id);
    }

    updateTodayStudyLog({ stlMinutes: 30, stlCompleted: true });
    addNotification('STL Session Marked Complete', 'Logged 30-min STL practice for today.', 'stl');
    setTimeout(checkMilestoneProgress, 200);
  };

  // Feature 4: STL Exercises Actions
  const toggleSTLExerciseComplete = (exerciseId: string, userCode?: string) => {
    setStlExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const nextStatus = !ex.isCompleted;
        const updated = {
          ...ex,
          isCompleted: nextStatus,
          completedAt: nextStatus ? new Date().toISOString() : undefined,
          userCode: userCode !== undefined ? userCode : ex.userCode,
        };
        if (currentUser) syncSTLExerciseToCloud(updated, currentUser.id);
        return updated;
      })
    );
    if (settings.soundEnabled) soundFx.playTick();
    addNotification('Exercise Progress Saved', 'STL arena exercise status updated.', 'info');
    setTimeout(checkMilestoneProgress, 200);
  };

  const updateSTLExerciseCode = (exerciseId: string, userCode: string) => {
    setStlExercises((prev) =>
      prev.map((ex) => {
        if (ex.id !== exerciseId) return ex;
        const updated = { ...ex, userCode };
        if (currentUser) syncSTLExerciseToCloud(updated, currentUser.id);
        return updated;
      })
    );
  };

  // Feature 3: Smart Spaced Repetition Actions
  const scheduleRevision = (
    problemId: string,
    scheduledDate: string,
    mistakes?: string,
    patternLearned?: string
  ) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const updated = {
          ...p,
          needsRevision: true,
          revisionScheduledDate: scheduledDate,
          mistakes: mistakes !== undefined ? mistakes : p.mistakes,
          patternLearned: patternLearned !== undefined ? patternLearned : p.patternLearned,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );
    addNotification('Revision Scheduled', `Problem queued for revision on ${scheduledDate}.`, 'info');
  };

  const logRevisionAttempt = (problemId: string, success: boolean, notes: string) => {
    logSpacedRepetitionOutcome(problemId, success ? 'success' : 'failed', notes);
  };

  const logSpacedRepetitionOutcome = (
    problemId: string,
    outcome: 'success' | 'hints' | 'failed',
    notes: string
  ) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;

    const currentStage = target.spacedRepetitionStage || 0;
    const intervals = settings.spacedRepetitionIntervals || [1, 3, 7, 14];
    const { nextStage, nextScheduledDate } = calculateNextSpacedRepetitionDate(
      currentStage,
      outcome,
      intervals
    );

    const newLog = {
      id: `rev-${Date.now()}`,
      date: todayStr,
      success: outcome === 'success',
      notes,
    };

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const updated: Problem = {
          ...p,
          revisionHistory: [newLog, ...p.revisionHistory],
          spacedRepetitionStage: nextStage,
          lastRevisionOutcome: outcome,
          lastRevisionDate: todayStr,
          needsRevision: outcome !== 'success' || nextStage < intervals.length,
          revisionScheduledDate: nextScheduledDate,
          status: (outcome === 'success' ? 'Solved Independently' : p.status) as ProblemStatus,
          solvedIndependently: outcome === 'success' ? true : p.solvedIndependently,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    if (outcome === 'success') {
      if (settings.soundEnabled) soundFx.playFanfare();
      try {
        confetti({ particleCount: 70, spread: 50 });
      } catch {}
      addNotification(
        'Revision Mastered!',
        `Problem intuition solidified! Next interval extended to stage ${nextStage} (due ${nextScheduledDate}).`,
        'success'
      );
    } else if (outcome === 'hints') {
      addNotification(
        'Revision Solved with Hints',
        `Retained shorter review interval. Re-testing on ${nextScheduledDate}.`,
        'info'
      );
    } else {
      addNotification(
        'Revision Failed — Priority Queued',
        `Mistakes noted. Re-queued for tomorrow (${nextScheduledDate}) for immediate reinforcement.`,
        'warning'
      );
    }

    setTimeout(checkMilestoneProgress, 200);
  };

  const removeRevision = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const updated = {
          ...p,
          needsRevision: false,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );
    addNotification('Removed from Revision Queue', 'Problem marked resolved.', 'info');
  };

  // Feature 5: Focus Mode Runner & Timing Engine (Wall-Clock Based)
  useEffect(() => {
    if (!activeFocusSession || activeFocusSession.status !== 'running') return;

    const interval = setInterval(() => {
      setActiveFocusSession((curr) => {
        if (!curr || curr.status !== 'running') return curr;
        const now = Date.now();
        const deltaSeconds = Math.max(1, Math.round((now - curr.lastStateTimestamp) / 1000));
        return {
          ...curr,
          accumulatedFocusSeconds: curr.accumulatedFocusSeconds + deltaSeconds,
          lastStateTimestamp: now,
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeFocusSession?.status]);

  const startFocusSession = (problem: Problem) => {
    const session: ActiveFocusState = {
      problemId: problem.id,
      problemTitle: problem.title,
      sessionStartTime: Date.now(),
      accumulatedFocusSeconds: 0,
      accumulatedBreakSeconds: 0,
      lastStateTimestamp: Date.now(),
      status: 'running',
      hintsUsed: 0,
      hintNotes: '',
      mistakesRecorded: '',
    };
    setActiveFocusSession(session);
    setActiveTab('focus-mode');
    if (settings.soundEnabled) soundFx.playTick();
    addNotification('Focus Mode Started', `Immersion mode active for "${problem.title}".`, 'info');
  };

  const pauseFocusSession = () => {
    if (!activeFocusSession || activeFocusSession.status !== 'running') return;
    const now = Date.now();
    const deltaSeconds = Math.max(0, Math.round((now - activeFocusSession.lastStateTimestamp) / 1000));
    setActiveFocusSession({
      ...activeFocusSession,
      status: 'paused',
      accumulatedFocusSeconds: activeFocusSession.accumulatedFocusSeconds + deltaSeconds,
      lastStateTimestamp: now,
    });
    if (settings.soundEnabled) soundFx.playTick();
  };

  const resumeFocusSession = () => {
    if (!activeFocusSession || activeFocusSession.status !== 'paused') return;
    const now = Date.now();
    const breakDelta = Math.max(0, Math.round((now - activeFocusSession.lastStateTimestamp) / 1000));
    setActiveFocusSession({
      ...activeFocusSession,
      status: 'running',
      accumulatedBreakSeconds: activeFocusSession.accumulatedBreakSeconds + breakDelta,
      lastStateTimestamp: now,
    });
    if (settings.soundEnabled) soundFx.playTick();
  };

  const recordFocusHint = (notes?: string) => {
    if (!activeFocusSession) return;
    setActiveFocusSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        hintsUsed: prev.hintsUsed + 1,
        hintNotes: notes ? (prev.hintNotes ? `${prev.hintNotes}\n• ${notes}` : `• ${notes}`) : prev.hintNotes,
      };
    });
    addNotification('Hint Logged', 'Hint counter incremented for this focus block.', 'info');
  };

  const recordFocusMistake = (mistakeText: string) => {
    if (!activeFocusSession) return;
    setActiveFocusSession((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        mistakesRecorded: prev.mistakesRecorded
          ? `${prev.mistakesRecorded}\n• ${mistakeText}`
          : `• ${mistakeText}`,
      };
    });
    addNotification('Mistake Tracked', 'Mistake logged for post-session autopsy.', 'info');
  };

  const finishFocusSession = (solvedStatus: ProblemStatus, approachNotes?: string) => {
    if (!activeFocusSession) return;

    const completedSession: FocusSession = {
      id: `focus-${Date.now()}`,
      problemId: activeFocusSession.problemId,
      problemTitle: activeFocusSession.problemTitle,
      startedAt: new Date(activeFocusSession.sessionStartTime).toISOString(),
      endedAt: new Date().toISOString(),
      activeSeconds: activeFocusSession.accumulatedFocusSeconds,
      breakSeconds: activeFocusSession.accumulatedBreakSeconds,
      hintsUsed: activeFocusSession.hintsUsed,
      hintNotes: activeFocusSession.hintNotes,
      mistakesRecorded: activeFocusSession.mistakesRecorded,
      status: 'completed',
    };

    setFocusSessions((prev) => [completedSession, ...prev]);
    if (currentUser) syncFocusSessionToCloud(completedSession, currentUser.id);

    // Update Problem with telemetry
    const minutes = Math.max(1, Math.round(activeFocusSession.accumulatedFocusSeconds / 60));
    const isIndep = solvedStatus === 'Solved Independently';

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== activeFocusSession.problemId) return p;
        const updated: Problem = {
          ...p,
          status: solvedStatus,
          solvedIndependently: isIndep,
          timeSpentMinutes: (p.timeSpentMinutes || 0) + minutes,
          focusTimeSeconds: (p.focusTimeSeconds || 0) + activeFocusSession.accumulatedFocusSeconds,
          hintsUsed: (p.hintsUsed || 0) + activeFocusSession.hintsUsed,
          mistakes: activeFocusSession.mistakesRecorded
            ? (p.mistakes ? `${p.mistakes}\n${activeFocusSession.mistakesRecorded}` : activeFocusSession.mistakesRecorded)
            : p.mistakes,
          approach: approachNotes || p.approach,
          attempts: (p.attempts || 0) + 1,
          completedAt: solvedStatus.startsWith('Solved') ? new Date().toISOString() : p.completedAt,
          needsRevision: solvedStatus === 'Solved with Hints' || solvedStatus === 'Needs Revision',
          revisionScheduledDate:
            solvedStatus === 'Solved with Hints' || solvedStatus === 'Needs Revision'
              ? todayStr
              : p.revisionScheduledDate,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    // Update Today's study log with DSA minutes
    updateTodayStudyLog({
      dsaMinutes: (studyLogs.find((l) => l.date === todayStr)?.dsaMinutes || 0) + minutes,
    });

    if (solvedStatus === 'Solved Independently') {
      if (settings.soundEnabled) soundFx.playFanfare();
      try {
        confetti({ particleCount: 100, spread: 70 });
      } catch {}
      addNotification('Focus Session Conquered!', `Solved independently in ${minutes} minutes.`, 'success');
    } else {
      addNotification('Focus Session Concluded', `Logged ${minutes} min active study time.`, 'info');
    }

    setActiveFocusSession(null);
    saveStoredActiveFocus(null);
    setTimeout(checkMilestoneProgress, 200);
  };

  const cancelFocusSession = () => {
    setActiveFocusSession(null);
    saveStoredActiveFocus(null);
    addNotification('Focus Session Abandoned', 'Session ended without saving progress.', 'info');
  };

  // Feature 1: Adaptive Recovery Engine Actions
  const incompleteTasks = useMemo(() => {
    return problems.filter((p) => {
      const isNotSolved =
        p.status === 'Not Started' ||
        p.status === 'In Progress' ||
        p.status === 'Needs Revision';
      return isNotSolved && p.inTodayPlan;
    });
  }, [problems]);

  const carryOverTasksToToday = (problemIds: string[]) => {
    const todayAssigned = problems.filter((p) => p.inTodayPlan);
    let orderCounter = todayAssigned.length;

    const events: RescheduleEvent[] = [];

    setProblems((prev) =>
      prev.map((p) => {
        if (!problemIds.includes(p.id)) return p;
        orderCounter++;
        const event: RescheduleEvent = {
          id: `resched-${Date.now()}-${p.id}`,
          problemId: p.id,
          problemTitle: p.title,
          date: todayStr,
          action: 'carry_over',
          previousDate: p.updatedAt.slice(0, 10),
          targetDate: todayStr,
          reason: 'Carried over via Adaptive Recovery Engine',
        };
        events.push(event);

        const updated = {
          ...p,
          inTodayPlan: true,
          orderInPlan: orderCounter,
          rescheduleHistory: [...(p.rescheduleHistory || []), event],
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    setRescheduleEvents((prev) => [...events, ...prev]);
    if (currentUser) {
      events.forEach((ev) => syncRescheduleEventToCloud(ev, currentUser.id));
    }

    recalculateDailyTargets();
    if (settings.soundEnabled) soundFx.playTick();
    addNotification(
      'Workload Carried Over',
      `Carried ${problemIds.length} incomplete tasks into today's schedule. Daily targets re-indexed.`,
      'recovery'
    );
    setTimeout(checkMilestoneProgress, 200);
  };

  const rescheduleTaskDate = (problemId: string, newDate: string, reason?: string) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;

    const event: RescheduleEvent = {
      id: `resched-${Date.now()}-${problemId}`,
      problemId,
      problemTitle: target.title,
      date: todayStr,
      action: 'reschedule',
      previousDate: todayStr,
      targetDate: newDate,
      reason: reason || 'Postponed via Recovery Planner',
    };

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const updated = {
          ...p,
          inTodayPlan: newDate === todayStr,
          revisionScheduledDate: newDate,
          rescheduleHistory: [...(p.rescheduleHistory || []), event],
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    setRescheduleEvents((prev) => [event, ...prev]);
    if (currentUser) syncRescheduleEventToCloud(event, currentUser.id);

    recalculateDailyTargets();
    addNotification('Task Rescheduled', `"${target.title}" deferred to ${newDate}.`, 'info');
  };

  const skipTaskWithReason = (problemId: string, reason: string) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;

    const event: RescheduleEvent = {
      id: `resched-${Date.now()}-${problemId}`,
      problemId,
      problemTitle: target.title,
      date: todayStr,
      action: 'skip',
      reason,
    };

    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const updated = {
          ...p,
          inTodayPlan: false,
          rescheduleHistory: [...(p.rescheduleHistory || []), event],
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncProblemToCloud(updated, currentUser.id);
        return updated;
      })
    );

    setRescheduleEvents((prev) => [event, ...prev]);
    if (currentUser) syncRescheduleEventToCloud(event, currentUser.id);

    recalculateDailyTargets();
    addNotification('Task Explicitly Skipped', `Skipped "${target.title}" (Reason: ${reason}).`, 'info');
  };

  const retainTaskInQueue = (problemId: string) => {
    const target = problems.find((p) => p.id === problemId);
    if (!target) return;

    const event: RescheduleEvent = {
      id: `resched-${Date.now()}-${problemId}`,
      problemId,
      problemTitle: target.title,
      date: todayStr,
      action: 'retain',
      reason: 'Retained in study queue',
    };

    setRescheduleEvents((prev) => [event, ...prev]);
    if (currentUser) syncRescheduleEventToCloud(event, currentUser.id);
    addNotification('Task Retained', `"${target.title}" kept visibly pending in current session.`, 'info');
  };

  const recalculateDailyTargets = () => {
    const todayAssigned = problems.filter((p) => p.inTodayPlan);
    const count = Math.max(1, todayAssigned.length);
    const easy = todayAssigned.filter((p) => p.difficulty === 'Easy').length;
    const med = todayAssigned.filter((p) => p.difficulty === 'Medium').length;
    const hard = todayAssigned.filter((p) => p.difficulty === 'Hard').length;

    updateDailyPlan({
      targetCount: count,
      targetEasy: easy,
      targetMedium: med,
      targetHard: hard,
    });
  };

  // Feature 2: Weakness Intelligence Map Calculations
  const topicMasteryMap = useMemo(() => computeTopicMasteryMap(problems), [problems]);
  const weakestTopics = useMemo(() => {
    return topicMasteryMap.filter(
      (t) => t.status === 'Critical Weakness' || t.status === 'Needs Practice'
    );
  }, [topicMasteryMap]);

  const recommendedRevisionProblems = useMemo(() => {
    const weakNames = new Set(weakestTopics.map((w) => w.topic));
    return problems
      .filter((p) => {
        return (
          weakNames.has(p.topic) &&
          (p.needsRevision ||
            !p.solvedIndependently ||
            (p.hintsUsed && p.hintsUsed > 0) ||
            p.attempts > 1)
        );
      })
      .slice(0, 6);
  }, [problems, weakestTopics]);

  // Feature 3: Spaced Repetition Queue
  const spacedRepetitionQueue = useMemo(() => {
    const revisionCandidates = problems.filter(
      (p) => p.needsRevision || p.status === 'Needs Revision' || p.status === 'Solved with Hints'
    );

    const overdue: Problem[] = [];
    const dueToday: Problem[] = [];
    const upcoming: Problem[] = [];

    revisionCandidates.forEach((p) => {
      const scheduled = p.revisionScheduledDate;
      if (!scheduled || scheduled === todayStr) {
        dueToday.push(p);
      } else if (scheduled < todayStr) {
        overdue.push(p);
      } else {
        upcoming.push(p);
      }
    });

    return { overdue, dueToday, upcoming };
  }, [problems, todayStr]);

  // Feature 8: Interview Readiness Meter
  const readinessBreakdown = useMemo(() => {
    return computeInterviewReadiness(problems, studyLogs, settings.readinessWeights);
  }, [problems, studyLogs, settings.readinessWeights]);

  // Feature 6: Weekly Performance Autopsy Getter
  const getWeeklyAutopsyData = useCallback(
    (offsetWeeks = 0) => {
      return computeWeeklyAutopsy(problems, studyLogs, focusSessions, rescheduleEvents, offsetWeeks);
    },
    [problems, studyLogs, focusSessions, rescheduleEvents]
  );

  // Playlist Tracker & Sequential Timestamps
  const addPlaylist = (data: {
    category: PlaylistCategory;
    title: string;
    description?: string;
    topic?: string;
  }): Playlist => {
    const categoryPlaylists = playlists.filter((p) => p.category === data.category);
    const newPlaylist: Playlist = {
      id: `pl-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      category: data.category,
      title: data.title.trim(),
      description: data.description?.trim(),
      topic: data.topic?.trim(),
      order: categoryPlaylists.length + 1,
      items: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setPlaylists((prev) => [...prev, newPlaylist]);
    if (currentUser) syncPlaylistToCloud(newPlaylist, currentUser.id);
    addNotification('Playlist Created', `Created playlist "${newPlaylist.title}".`, 'info');
    return newPlaylist;
  };

  const updatePlaylist = (id: string, updates: Partial<Playlist>) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== id) return pl;
        const updated = {
          ...pl,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) syncPlaylistToCloud(updated, currentUser.id);
        return updated;
      })
    );
  };

  const deletePlaylist = (id: string) => {
    setPlaylists((prev) => prev.filter((pl) => pl.id !== id));
    if (currentUser) deletePlaylistFromCloud(id, currentUser.id);
    addNotification('Playlist Removed', 'Playlist and video list deleted.', 'info');
  };

  const reorderPlaylists = (playlistId: string, direction: 'up' | 'down') => {
    setPlaylists((prev) => {
      const target = prev.find((p) => p.id === playlistId);
      if (!target) return prev;
      const categoryPlaylists = prev
        .filter((p) => p.category === target.category)
        .sort((a, b) => a.order - b.order);

      const idx = categoryPlaylists.findIndex((p) => p.id === playlistId);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
      if (targetIdx < 0 || targetIdx >= categoryPlaylists.length) return prev;

      const currentItem = categoryPlaylists[idx];
      const otherItem = categoryPlaylists[targetIdx];

      const currentOrder = currentItem.order;
      currentItem.order = otherItem.order;
      otherItem.order = currentOrder;

      if (currentUser) {
        syncPlaylistToCloud(currentItem, currentUser.id);
        syncPlaylistToCloud(otherItem, currentUser.id);
      }

      return [...prev];
    });
  };

  const addPlaylistItem = (
    playlistId: string,
    itemData: {
      title: string;
      videoUrl: string;
      topic?: string;
      durationSeconds: number;
      notes?: string;
    }
  ): PlaylistItem => {
    const playlist = playlists.find((p) => p.id === playlistId);
    const existingItems = playlist ? playlist.items : [];
    const newItem: PlaylistItem = {
      id: `vi-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      playlistId,
      title: itemData.title.trim(),
      videoUrl: itemData.videoUrl.trim(),
      topic: itemData.topic?.trim(),
      order: existingItems.length + 1,
      durationSeconds: itemData.durationSeconds || 0,
      watchedSeconds: 0,
      isCompleted: false,
      notes: itemData.notes?.trim(),
      bookmarks: [],
    };

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const updated = {
          ...pl,
          items: [...pl.items, newItem],
          updatedAt: new Date().toISOString(),
        };
        if (currentUser) {
          syncPlaylistToCloud(updated, currentUser.id);
          syncPlaylistItemToCloud(newItem, currentUser.id);
        }
        return updated;
      })
    );
    addNotification('Video Added', `Added "${newItem.title}" to sequence #${newItem.order}.`, 'info');
    return newItem;
  };

  const updatePlaylistItem = (playlistId: string, itemId: string, updates: Partial<PlaylistItem>) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const updatedItems = pl.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = { ...item, ...updates };
          if (currentUser) syncPlaylistItemToCloud(updated, currentUser.id);
          return updated;
        });
        return { ...pl, items: updatedItems, updatedAt: new Date().toISOString() };
      })
    );
  };

  const deletePlaylistItem = (playlistId: string, itemId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const remaining = pl.items.filter((it) => it.id !== itemId);
        const reindexed = remaining.map((it, idx) => ({ ...it, order: idx + 1 }));
        if (currentUser) {
          deletePlaylistItemFromCloud(itemId, currentUser.id);
          reindexed.forEach((it) => syncPlaylistItemToCloud(it, currentUser.id));
        }
        return { ...pl, items: reindexed, updatedAt: new Date().toISOString() };
      })
    );
    addNotification('Video Removed', 'Item removed from playlist sequence.', 'info');
  };

  const reorderPlaylistItems = (playlistId: string, itemId: string, direction: 'up' | 'down') => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const sorted = [...pl.items].sort((a, b) => a.order - b.order);
        const idx = sorted.findIndex((it) => it.id === itemId);
        if (idx === -1) return pl;
        const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
        if (targetIdx < 0 || targetIdx >= sorted.length) return pl;

        const currentItem = sorted[idx];
        const otherItem = sorted[targetIdx];

        const tempOrder = currentItem.order;
        currentItem.order = otherItem.order;
        otherItem.order = tempOrder;

        if (currentUser) {
          syncPlaylistItemToCloud(currentItem, currentUser.id);
          syncPlaylistItemToCloud(otherItem, currentUser.id);
        }

        return {
          ...pl,
          items: [...sorted].sort((a, b) => a.order - b.order),
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const updateWatchTimestamp = (
    playlistId: string,
    itemId: string,
    watchedSeconds: number,
    markCompleted?: boolean
  ) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const updatedItems = pl.items.map((item) => {
          if (item.id !== itemId) return item;
          const isDone =
            markCompleted !== undefined
              ? markCompleted
              : item.durationSeconds > 0 && watchedSeconds >= item.durationSeconds;

          const updated: PlaylistItem = {
            ...item,
            watchedSeconds,
            isCompleted: isDone,
            lastWatchedAt: new Date().toISOString(),
          };
          if (currentUser) syncPlaylistItemToCloud(updated, currentUser.id);
          return updated;
        });
        return { ...pl, items: updatedItems, updatedAt: new Date().toISOString() };
      })
    );
  };

  const addTimestampBookmark = (
    playlistId: string,
    itemId: string,
    bookmark: {
      timestampSeconds: number;
      label: string;
      note?: string;
    }
  ) => {
    const newBookmark: TimestampBookmark = {
      id: `bm-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      timestampSeconds: bookmark.timestampSeconds,
      label: bookmark.label.trim(),
      note: bookmark.note?.trim(),
      createdAt: new Date().toISOString(),
    };

    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const updatedItems = pl.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = {
            ...item,
            bookmarks: [...item.bookmarks, newBookmark].sort(
              (a, b) => a.timestampSeconds - b.timestampSeconds
            ),
          };
          if (currentUser) syncPlaylistItemToCloud(updated, currentUser.id);
          return updated;
        });
        return { ...pl, items: updatedItems, updatedAt: new Date().toISOString() };
      })
    );
    addNotification('Timestamp Saved', `Bookmarked key moment at ${bookmark.label}.`, 'info');
  };

  const deleteTimestampBookmark = (playlistId: string, itemId: string, bookmarkId: string) => {
    setPlaylists((prev) =>
      prev.map((pl) => {
        if (pl.id !== playlistId) return pl;
        const updatedItems = pl.items.map((item) => {
          if (item.id !== itemId) return item;
          const updated = {
            ...item,
            bookmarks: item.bookmarks.filter((b) => b.id !== bookmarkId),
          };
          if (currentUser) syncPlaylistItemToCloud(updated, currentUser.id);
          return updated;
        });
        return { ...pl, items: updatedItems, updatedAt: new Date().toISOString() };
      })
    );
  };

  // Settings & notifications
  const updateSettings = (updates: Partial<AccountabilitySettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...updates };
      if (currentUser) syncSettingsToCloud(updated, currentUser.id);
      return updated;
    });
    addNotification('Settings Updated', 'Your preferences have been saved.', 'info');
  };

  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const clearNotifications = () => {
    setNotifications([]);
  };

  // Data reset & restore
  const resetToSampleData = () => {
    setProblems(INITIAL_PROBLEMS);
    setDailyPlan({
      date: todayStr,
      targetCount: 4,
      targetEasy: 2,
      targetMedium: 2,
      targetHard: 1,
      deadlineTime: '23:00',
      stlCompleted: false,
    });
    setStlState({ ...INITIAL_STL_STATE, date: todayStr });
    setStlTopics(INITIAL_STL_TOPICS);
    setStlExercises(INITIAL_STL_EXERCISES);
    setPlaylists(INITIAL_PLAYLISTS);
    setSettings(DEFAULT_SETTINGS);
    setStudyLogs(INITIAL_PAST_LOGS);
    setMilestones(INITIAL_MILESTONES);
    setFocusSessions([]);
    setActiveFocusSession(null);
    setRescheduleEvents([]);
    setNotifications([
      {
        id: 'sample-reset',
        title: 'AlgoPulse 2.0 Telemetry Initialized',
        message: 'Loaded sample questions, 7-day analytics history, STL exercises, playlists, and milestones.',
        timestamp: new Date().toISOString(),
        type: 'info',
        read: false,
      },
    ]);
  };

  const clearAllData = () => {
    clearAllAlgoPulseData();
    setProblems([]);
    setDailyPlan({
      date: todayStr,
      targetCount: 4,
      targetEasy: 2,
      targetMedium: 2,
      targetHard: 1,
      deadlineTime: '23:00',
      stlCompleted: false,
    });
    setStlState({ ...INITIAL_STL_STATE, date: todayStr, notes: '', codeSnippet: '' });
    setStlExercises(INITIAL_STL_EXERCISES);
    setPlaylists([]);
    setStudyLogs([]);
    setNotifications([]);
    setFocusSessions([]);
    setActiveFocusSession(null);
    setMilestones(INITIAL_MILESTONES);
    setRescheduleEvents([]);
  };

  const importAllData = (data: Record<string, unknown>): boolean => {
    try {
      if (Array.isArray(data.problems)) setProblems(data.problems as Problem[]);
      if (data.dailyPlan && typeof data.dailyPlan === 'object') {
        setDailyPlan(data.dailyPlan as DailyPlan);
      }
      if (data.stlState && typeof data.stlState === 'object') {
        setStlState(data.stlState as STLPracticeState);
      }
      if (Array.isArray(data.stlTopics)) setStlTopics(data.stlTopics as STLTopicItem[]);
      if (Array.isArray(data.stlExercises)) setStlExercises(data.stlExercises as STLExercise[]);
      if (Array.isArray(data.playlists)) setPlaylists(data.playlists as Playlist[]);
      if (data.settings && typeof data.settings === 'object') {
        setSettings(data.settings as AccountabilitySettings);
      }
      if (Array.isArray(data.studyLogs)) setStudyLogs(data.studyLogs as StudyDayLog[]);
      if (Array.isArray(data.focusSessions)) setFocusSessions(data.focusSessions as FocusSession[]);
      if (Array.isArray(data.milestones)) setMilestones(data.milestones as Milestone[]);
      if (Array.isArray(data.rescheduleEvents)) setRescheduleEvents(data.rescheduleEvents as RescheduleEvent[]);

      addNotification('Import Successful', 'All backup telemetry successfully imported.', 'success');
      return true;
    } catch (e) {
      console.error(e);
      addNotification('Import Failed', 'Invalid backup format.', 'info');
      return false;
    }
  };

  // Real computed stats for the dashboard & daily target
  const todayPlannedProblems = problems.filter((p) => p.inTodayPlan);
  const todaySolved = todayPlannedProblems.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  );
  const todayEasy = todaySolved.filter((p) => p.difficulty === 'Easy').length;
  const todayMedium = todaySolved.filter((p) => p.difficulty === 'Medium').length;
  const todayHard = todaySolved.filter((p) => p.difficulty === 'Hard').length;
  const todayIndependent = todaySolved.filter((p) => p.solvedIndependently).length;
  const todayHints = todaySolved.filter((p) => !p.solvedIndependently).length;
  const totalDsaMins = todayPlannedProblems.reduce((sum, p) => sum + (p.timeSpentMinutes || 0), 0);
  const stlMins = stlState.isCompleted
    ? 30
    : Math.floor((stlState.totalSeconds - stlState.remainingSeconds) / 60);

  const targetCount = dailyPlan.targetCount || 4;
  const completionPercentage = Math.min(
    100,
    Math.round((todaySolved.length / targetCount) * 100)
  );

  const stats = {
    todaySolvedCount: todaySolved.length,
    todayEasySolved: todayEasy,
    todayMediumSolved: todayMedium,
    todayHardSolved: todayHard,
    todayIndependentSolved: todayIndependent,
    todayWithHintsSolved: todayHints,
    todayTotalDsaMinutes: totalDsaMins,
    todayStlMinutes: stlMins,
    todayPlanAssignedCount: todayPlannedProblems.length,
    todayPlanRemainingCount: Math.max(0, todayPlannedProblems.length - todaySolved.length),
    completionPercentage,
    revisionQueueCount: problems.filter((p) => p.needsRevision).length,
    totalProblemsCount: problems.length,
  };

  return (
    <DSAContext.Provider
      value={{
        problems,
        dailyPlan,
        stlState,
        stlTopics,
        settings,
        studyLogs,
        notifications,
        activeTab,
        setActiveTab,
        currentUser,
        authModalOpen,
        setAuthModalOpen,
        syncLocalDataToCloud,
        addProblem,
        updateProblem,
        deleteProblem,
        toggleProblemStatus,
        toggleInTodayPlan,
        reorderTodayPlan,
        bulkAddProblems,
        updateDailyPlan,
        startSTLTimer,
        pauseSTLTimer,
        resetSTLTimer,
        extendSTLTimer,
        updateSTLState,
        toggleSTLTopicComplete,
        markSTLComplete,
        stlExercises,
        toggleSTLExerciseComplete,
        updateSTLExerciseCode,
        scheduleRevision,
        logRevisionAttempt,
        logSpacedRepetitionOutcome,
        removeRevision,
        spacedRepetitionQueue,
        focusSessions,
        activeFocusSession,
        startFocusSession,
        pauseFocusSession,
        resumeFocusSession,
        recordFocusHint,
        recordFocusMistake,
        finishFocusSession,
        cancelFocusSession,
        rescheduleEvents,
        incompleteTasks,
        carryOverTasksToToday,
        rescheduleTaskDate,
        skipTaskWithReason,
        retainTaskInQueue,
        recalculateDailyTargets,
        topicMasteryMap,
        weakestTopics,
        recommendedRevisionProblems,
        readinessBreakdown,
        getWeeklyAutopsyData,
        milestones,
        checkMilestoneProgress,
        playlists,
        activePlaylistCategory,
        setActivePlaylistCategory,
        selectedPlaylistId,
        setSelectedPlaylistId,
        addPlaylist,
        updatePlaylist,
        deletePlaylist,
        reorderPlaylists,
        addPlaylistItem,
        updatePlaylistItem,
        deletePlaylistItem,
        reorderPlaylistItems,
        updateWatchTimestamp,
        addTimestampBookmark,
        deleteTimestampBookmark,
        updateSettings,
        addNotification,
        markNotificationRead,
        clearNotifications,
        resetToSampleData,
        clearAllData,
        importAllData,
        stats,
      }}
    >
      {children}
    </DSAContext.Provider>
  );
};

export const useDSA = (): DSAContextType => {
  const context = useContext(DSAContext);
  if (!context) {
    throw new Error('useDSA must be used within a DSAProvider');
  }
  return context;
};
