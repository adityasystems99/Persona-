import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import confetti from 'canvas-confetti';
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
  getLastHourlyReminderTimestamp,
  setLastHourlyReminderTimestamp,
  clearAllAlgoPulseData,
} from '../utils/storage';
import { soundFx } from '../utils/audio';
import {
  dispatchSystemNotification,
  isWithinStudyWindow,
} from '../utils/notifications';
import {
  INITIAL_PROBLEMS,
  INITIAL_PAST_LOGS,
  INITIAL_STL_STATE,
  DEFAULT_SETTINGS,
  getTodayDateString,
} from '../data/initialData';
import { INITIAL_STL_TOPICS } from '../data/stlTopics';

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

  // STL actions
  startSTLTimer: () => void;
  pauseSTLTimer: () => void;
  resetSTLTimer: () => void;
  extendSTLTimer: (seconds: number) => void;
  updateSTLState: (updates: Partial<STLPracticeState>) => void;
  toggleSTLTopicComplete: (topicId: string) => void;
  markSTLComplete: () => void;

  // Revision actions
  scheduleRevision: (
    problemId: string,
    scheduledDate: string,
    mistakes?: string,
    patternLearned?: string
  ) => void;
  logRevisionAttempt: (problemId: string, success: boolean, notes: string) => void;
  removeRevision: (problemId: string) => void;

  // Settings & alerts
  updateSettings: (updates: Partial<AccountabilitySettings>) => void;
  addNotification: (
    title: string,
    message: string,
    type?: AppNotification['type']
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
  const [problems, setProblems] = useState<Problem[]>(loadStoredProblems);
  const [dailyPlan, setDailyPlan] = useState<DailyPlan>(loadStoredDailyPlan);
  const [stlState, setStlState] = useState<STLPracticeState>(loadStoredSTLState);
  const [stlTopics, setStlTopics] = useState<STLTopicItem[]>(loadStoredSTLTopics);
  const [settings, setSettings] = useState<AccountabilitySettings>(loadStoredSettings);
  const [studyLogs, setStudyLogs] = useState<StudyDayLog[]>(loadStoredStudyLogs);
  const [notifications, setNotifications] = useState<AppNotification[]>(loadStoredNotifications);
  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');

  const todayStr = getTodayDateString();

  // Keep localStorage updated
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
    saveStoredSettings(settings);
  }, [settings]);

  useEffect(() => {
    saveStoredStudyLogs(studyLogs);
  }, [studyLogs]);

  useEffect(() => {
    saveStoredNotifications(notifications);
  }, [notifications]);

  // Add Notification helper
  const addNotification = useCallback(
    (title: string, message: string, type: AppNotification['type'] = 'info') => {
      const newNotif: AppNotification = {
        id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        title,
        message,
        timestamp: new Date().toISOString(),
        type,
        read: false,
      };

      setNotifications((prev) => [newNotif, ...prev.slice(0, 39)]);

      if (settings.browserNotificationsEnabled) {
        dispatchSystemNotification(title, { body: message });
      }

      if (settings.soundEnabled) {
        if (type === 'success' || type === 'stl') {
          soundFx.playFanfare();
        } else {
          soundFx.playChime();
        }
      }
    },
    [settings.browserNotificationsEnabled, settings.soundEnabled]
  );

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
          // Timer reached zero!
          clearInterval(interval);
          if (settings.soundEnabled) {
            soundFx.playFanfare();
          }

          try {
            confetti({
              particleCount: 100,
              spread: 70,
              origin: { y: 0.6 },
            });
          } catch {}

          addNotification(
            '30-Min STL Session Completed!',
            'Outstanding dedication! You wrapped up your daily 30-minute C++ STL practice session.',
            'stl'
          );

          // Mark daily plan STL as completed
          setDailyPlan((p) => ({ ...p, stlCompleted: true }));

          // Update study log for today
          updateTodayStudyLog({ stlMinutes: 30, stlCompleted: true });

          return {
            ...curr,
            remainingSeconds: 0,
            isRunning: false,
            isCompleted: true,
            completedAt: new Date().toISOString(),
            lastTickTimestamp: Date.now(),
          };
        }

        return {
          ...curr,
          remainingSeconds: nextRemaining,
          lastTickTimestamp: Date.now(),
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [stlState.isRunning, settings.soundEnabled, addNotification]);

  // Hourly Accountability & Reminder Runner
  useEffect(() => {
    if (!settings.hourlyRemindersEnabled) return;

    const checkReminders = () => {
      const nowMs = Date.now();
      const lastCheck = getLastHourlyReminderTimestamp();
      const intervalMs = settings.reminderIntervalMinutes * 60 * 1000;

      if (nowMs - lastCheck < intervalMs) return;

      // Verify study window
      if (!isWithinStudyWindow(settings.studyStartTime, settings.studyEndTime)) {
        return;
      }

      setLastHourlyReminderTimestamp(nowMs);

      // 1. Check unsolved target
      const todayProblems = problems.filter((p) => p.inTodayPlan);
      const solvedToday = todayProblems.filter(
        (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
      );
      const pendingCount = todayProblems.length - solvedToday.length;

      // 2. Check STL status
      if (settings.stlReminderEnabled && !stlStateRef.current.isCompleted) {
        addNotification(
          'STL Practice Pending',
          '30-minute C++ STL session is still pending today! Take 30 mins to drill containers & iterators.',
          'reminder'
        );
      } else if (pendingCount > 0) {
        addNotification(
          'Hourly DSA Check-in',
          `You've solved ${solvedToday.length} of ${todayProblems.length} planned problems today. ${pendingCount} remaining. Keep up the focus!`,
          'reminder'
        );
      } else if (todayProblems.length > 0) {
        addNotification(
          'Daily Target Achieved!',
          'All assigned DSA problems for today are completed! Great work.',
          'success'
        );
      }
    };

    // Check on initial load and every 60 seconds
    checkReminders();
    const reminderInterval = setInterval(checkReminders, 60000);
    return () => clearInterval(reminderInterval);
  }, [settings, problems, addNotification]);

  // Study log updater helper
  const updateTodayStudyLog = (diff: Partial<StudyDayLog>) => {
    setStudyLogs((prev) => {
      const todayIndex = prev.findIndex((l) => l.date === todayStr);
      if (todayIndex >= 0) {
        const updated = [...prev];
        updated[todayIndex] = { ...updated[todayIndex], ...diff };
        return updated;
      } else {
        const newLog: StudyDayLog = {
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
        return [newLog, ...prev];
      }
    });
  };

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
      revisionHistory: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setProblems((prev) => [newProblem, ...prev]);
    addNotification('Problem Added', `"${newProblem.title}" added to question bank.`, 'info');
    return newProblem;
  };

  const updateProblem = (id: string, updates: Partial<Problem>) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      })
    );
  };

  const deleteProblem = (id: string) => {
    setProblems((prev) => prev.filter((p) => p.id !== id));
    addNotification('Problem Removed', 'Problem removed from database.', 'info');
  };

  const toggleProblemStatus = (
    id: string,
    newStatus: ProblemStatus,
    timeSpent?: number,
    solvedIndependently?: boolean
  ) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;

        const isSolvedNow =
          newStatus === 'Solved Independently' || newStatus === 'Solved with Hints';
        const isIndependent =
          solvedIndependently ?? (newStatus === 'Solved Independently');

        const updated: Problem = {
          ...p,
          status: newStatus,
          solvedIndependently: isIndependent,
          timeSpentMinutes: timeSpent !== undefined ? timeSpent : (p.timeSpentMinutes || 20),
          attempts: p.attempts ? p.attempts + (isSolvedNow ? 0 : 1) : 1,
          completionTime: isSolvedNow ? new Date().toISOString() : p.completionTime,
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
  };

  const toggleInTodayPlan = (id: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p;
        const nextInPlan = !p.inTodayPlan;
        return {
          ...p,
          inTodayPlan: nextInPlan,
          orderInPlan: nextInPlan ? 999 : 0,
          updatedAt: new Date().toISOString(),
        };
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
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setProblems((prev) => [...newItems, ...prev]);
    addNotification('Bulk Import Successful', `Added ${newItems.length} problems to your library.`, 'info');
    return newItems.length;
  };

  const updateDailyPlan = (updates: Partial<DailyPlan>) => {
    setDailyPlan((prev) => ({ ...prev, ...updates }));
  };

  // STL Timer actions
  const startSTLTimer = () => {
    if (stlState.remainingSeconds <= 0) return;
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => ({
      ...prev,
      isRunning: true,
      lastTickTimestamp: Date.now(),
    }));
  };

  const pauseSTLTimer = () => {
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => ({
      ...prev,
      isRunning: false,
      lastTickTimestamp: Date.now(),
    }));
  };

  const resetSTLTimer = () => {
    if (settings.soundEnabled) soundFx.playTick();
    setStlState((prev) => ({
      ...prev,
      isRunning: false,
      remainingSeconds: prev.totalSeconds,
      isCompleted: false,
      lastTickTimestamp: Date.now(),
    }));
  };

  const extendSTLTimer = (seconds: number) => {
    setStlState((prev) => ({
      ...prev,
      remainingSeconds: prev.remainingSeconds + seconds,
      totalSeconds: Math.max(prev.totalSeconds, prev.remainingSeconds + seconds),
    }));
  };

  const updateSTLState = (updates: Partial<STLPracticeState>) => {
    setStlState((prev) => ({ ...prev, ...updates }));
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

    setStlState((prev) => ({
      ...prev,
      isRunning: false,
      remainingSeconds: 0,
      isCompleted: true,
      completedAt: new Date().toISOString(),
    }));
    setDailyPlan((prev) => ({ ...prev, stlCompleted: true }));
    updateTodayStudyLog({ stlMinutes: 30, stlCompleted: true });
    addNotification('STL Session Marked Complete', 'Logged 30-min STL practice for today.', 'stl');
  };

  // Revision actions
  const scheduleRevision = (
    problemId: string,
    scheduledDate: string,
    mistakes?: string,
    patternLearned?: string
  ) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        return {
          ...p,
          needsRevision: true,
          revisionScheduledDate: scheduledDate,
          mistakes: mistakes !== undefined ? mistakes : p.mistakes,
          patternLearned: patternLearned !== undefined ? patternLearned : p.patternLearned,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addNotification('Revision Scheduled', `Problem queued for revision on ${scheduledDate}.`, 'info');
  };

  const logRevisionAttempt = (problemId: string, success: boolean, notes: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        const newLog = {
          id: `rev-${Date.now()}`,
          date: todayStr,
          success,
          notes,
        };
        return {
          ...p,
          revisionHistory: [newLog, ...p.revisionHistory],
          needsRevision: !success, // resolve if successfully solved!
          status: success ? 'Solved Independently' : p.status,
          solvedIndependently: success ? true : p.solvedIndependently,
          updatedAt: new Date().toISOString(),
        };
      })
    );

    if (success) {
      if (settings.soundEnabled) soundFx.playFanfare();
      addNotification(
        'Revision Mastered!',
        'You solved the revised problem independently! Marked resolved.',
        'success'
      );
    } else {
      addNotification('Revision Logged', 'Mistakes noted. Keep it in the revision queue.', 'info');
    }
  };

  const removeRevision = (problemId: string) => {
    setProblems((prev) =>
      prev.map((p) => {
        if (p.id !== problemId) return p;
        return {
          ...p,
          needsRevision: false,
          updatedAt: new Date().toISOString(),
        };
      })
    );
    addNotification('Removed from Revision Queue', 'Problem marked resolved.', 'info');
  };

  // Settings & notifications
  const updateSettings = (updates: Partial<AccountabilitySettings>) => {
    setSettings((prev) => ({ ...prev, ...updates }));
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
    setSettings(DEFAULT_SETTINGS);
    setStudyLogs(INITIAL_PAST_LOGS);
    setNotifications([
      {
        id: 'sample-reset',
        title: 'Sample Data Loaded',
        message: 'Loaded sample questions, 7-day analytics history, and STL topics.',
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
    setStudyLogs([]);
    setNotifications([]);
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
      if (data.settings && typeof data.settings === 'object') {
        setSettings(data.settings as AccountabilitySettings);
      }
      if (Array.isArray(data.studyLogs)) setStudyLogs(data.studyLogs as StudyDayLog[]);

      addNotification('Import Successful', 'All backup data successfully imported.', 'success');
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
        scheduleRevision,
        logRevisionAttempt,
        removeRevision,
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
