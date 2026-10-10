import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import {
  AcademicSemester,
  AcademicSubject,
  AcademicUnit,
  AcademicTopic,
  AcademicTask,
  AcademicStudySession,
  AcademicAssignment,
  AcademicExam,
  AcademicNote,
  AcademicResource,
  AcademicRevision,
  AcademicAttendanceRecord,
  AcademicSettings,
  AcademicNotification,
  AcademicTab,
  RevisionOutcome,
  AcademicPriority,
  AssignmentStatus,
  ExamType,
  ExamPrepStatus,
  ClassType,
  AttendanceStatus,
} from '../types/academic';
import {
  INITIAL_SEMESTER_5,
  INITIAL_SEMESTER_5_SUBJECTS,
  DEFAULT_ACADEMIC_SETTINGS,
} from '../data/academicInitialData';
import {
  fetchFullAcademicData,
  ensureSemester5SeededInCloud,
  syncSubjectToCloud,
  deleteSubjectFromCloud,
  syncUnitToCloud,
  deleteUnitFromCloud,
  syncTopicToCloud,
  deleteTopicFromCloud,
  syncTaskToCloud,
  deleteTaskFromCloud,
  syncAssignmentToCloud,
  deleteAssignmentFromCloud,
  syncExamToCloud,
  deleteExamFromCloud,
  syncNoteToCloud,
  deleteNoteFromCloud,
  syncResourceToCloud,
  deleteResourceFromCloud,
  syncRevisionToCloud,
  deleteRevisionFromCloud,
  syncAttendanceToCloud,
  deleteAttendanceFromCloud,
  syncAcademicSettingsToCloud,
} from '../lib/academicSupabase';

// Storage keys
const STORAGE_PREFIX = 'algopulse_academic_';
const KEYS = {
  SEMESTERS: `${STORAGE_PREFIX}semesters`,
  SUBJECTS: `${STORAGE_PREFIX}subjects`,
  TASKS: `${STORAGE_PREFIX}tasks`,
  SESSIONS: `${STORAGE_PREFIX}sessions`,
  ASSIGNMENTS: `${STORAGE_PREFIX}assignments`,
  EXAMS: `${STORAGE_PREFIX}exams`,
  NOTES: `${STORAGE_PREFIX}notes`,
  RESOURCES: `${STORAGE_PREFIX}resources`,
  REVISIONS: `${STORAGE_PREFIX}revisions`,
  ATTENDANCE: `${STORAGE_PREFIX}attendance`,
  SETTINGS: `${STORAGE_PREFIX}settings`,
  NOTIFICATIONS: `${STORAGE_PREFIX}notifications`,
};

const getLocal = <T,>(key: string, fallback: T): T => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.warn(`Error reading ${key} from localStorage:`, e);
    return fallback;
  }
};

const setLocal = <T,>(key: string, val: T): void => {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.warn(`Error writing ${key} to localStorage:`, e);
  }
};

export const getTodayDateStr = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export interface SubjectAttendanceStat {
  subjectId: string;
  totalClasses: number;
  attendedClasses: number;
  excusedClasses: number;
  absentClasses: number;
  percentage: number;
  isBelowThreshold: boolean;
  canBunkCount: number;
  needToAttendCount: number;
}

export interface AcademicContextType {
  // State
  semesters: AcademicSemester[];
  subjects: AcademicSubject[];
  activeSubject: AcademicSubject | null;
  selectedSubjectId: string | null;
  tasks: AcademicTask[];
  studySessions: AcademicStudySession[];
  assignments: AcademicAssignment[];
  exams: AcademicExam[];
  notes: AcademicNote[];
  resources: AcademicResource[];
  revisions: AcademicRevision[];
  attendance: AcademicAttendanceRecord[];
  settings: AcademicSettings;
  notifications: AcademicNotification[];
  activeAcademicTab: AcademicTab;
  isLoading: boolean;
  isCloudConnected: boolean;
  lastSyncTime: string | null;

  // Navigation
  setActiveAcademicTab: (tab: AcademicTab, subjectId?: string) => void;
  setSelectedSubjectId: (id: string | null) => void;

  // Subjects CRUD
  addSubject: (sub: Omit<AcademicSubject, 'id' | 'createdAt' | 'updatedAt' | 'units'>) => Promise<AcademicSubject>;
  updateSubject: (id: string, updates: Partial<AcademicSubject>) => Promise<void>;
  archiveSubject: (id: string, isArchived?: boolean) => Promise<void>;
  deleteSubject: (id: string) => Promise<void>;

  // Units CRUD
  addUnit: (subjectId: string, unit: Omit<AcademicUnit, 'id' | 'subjectId' | 'topics' | 'createdAt' | 'updatedAt'>) => Promise<AcademicUnit>;
  updateUnit: (unitId: string, updates: Partial<AcademicUnit>) => Promise<void>;
  deleteUnit: (unitId: string) => Promise<void>;

  // Topics CRUD
  addTopic: (unitId: string, topic: Omit<AcademicTopic, 'id' | 'unitId' | 'subjectId' | 'isCompleted' | 'createdAt' | 'updatedAt'>) => Promise<AcademicTopic>;
  updateTopic: (topicId: string, updates: Partial<AcademicTopic>) => Promise<void>;
  toggleTopicComplete: (topicId: string) => Promise<void>;
  deleteTopic: (topicId: string) => Promise<void>;

  // Tasks CRUD
  addTask: (task: Omit<AcademicTask, 'id' | 'rescheduleCount' | 'actualTimeMinutes' | 'createdAt' | 'updatedAt'>) => Promise<AcademicTask>;
  updateTask: (taskId: string, updates: Partial<AcademicTask>) => Promise<void>;
  toggleTaskComplete: (taskId: string) => Promise<void>;
  rescheduleTask: (taskId: string, newDate: string) => Promise<void>;
  skipTask: (taskId: string, reason?: string) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;

  // Assignments CRUD
  addAssignment: (a: Omit<AcademicAssignment, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AcademicAssignment>;
  updateAssignment: (id: string, updates: Partial<AcademicAssignment>) => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  // Exams CRUD
  addExam: (exam: Omit<AcademicExam, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AcademicExam>;
  updateExam: (id: string, updates: Partial<AcademicExam>) => Promise<void>;
  deleteExam: (id: string) => Promise<void>;

  // Notes CRUD
  addNote: (note: Omit<AcademicNote, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AcademicNote>;
  updateNote: (id: string, updates: Partial<AcademicNote>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  togglePinNote: (id: string) => Promise<void>;

  // Resources CRUD
  addResource: (res: Omit<AcademicResource, 'id' | 'createdAt' | 'updatedAt'>) => Promise<AcademicResource>;
  updateResource: (id: string, updates: Partial<AcademicResource>) => Promise<void>;
  deleteResource: (id: string) => Promise<void>;

  // Revision CRUD
  scheduleRevisionForTopic: (topicId: string, subjectId: string, topicTitle: string) => Promise<void>;
  logRevisionReview: (revisionId: string, outcome: RevisionOutcome, confidence: number, notes?: string) => Promise<void>;
  deleteRevision: (id: string) => Promise<void>;

  // Attendance CRUD
  logAttendance: (record: Omit<AcademicAttendanceRecord, 'id' | 'createdAt'>) => Promise<AcademicAttendanceRecord>;
  deleteAttendance: (id: string) => Promise<void>;

  // Settings
  updateSettings: (updates: Partial<AcademicSettings>) => Promise<void>;

  // Notifications
  markNotificationRead: (id: string) => void;
  clearAllNotifications: () => void;

  // Computed Intelligence
  semesterCompletionPercentage: number;
  totalTopicsCount: number;
  completedTopicsCount: number;
  todayTasks: AcademicTask[];
  todayCompletedTasksCount: number;
  overdueTasks: AcademicTask[];
  upcomingAssignments: AcademicAssignment[];
  overdueAssignments: AcademicAssignment[];
  upcomingExams: AcademicExam[];
  revisionsDueToday: AcademicRevision[];
  subjectAttendanceStats: Record<string, SubjectAttendanceStat>;
  totalStudyMinutesWeek: number;
  weeklyConsistencyDays: number;
  refreshAcademicData: () => Promise<void>;
}

const AcademicContext = createContext<AcademicContextType | undefined>(undefined);

export const AcademicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Local state initialized with fallback / local storage
  const [semesters, setSemesters] = useState<AcademicSemester[]>(() =>
    getLocal(KEYS.SEMESTERS, [INITIAL_SEMESTER_5])
  );
  const [subjects, setSubjects] = useState<AcademicSubject[]>(() =>
    getLocal(KEYS.SUBJECTS, INITIAL_SEMESTER_5_SUBJECTS)
  );
  const [tasks, setTasks] = useState<AcademicTask[]>(() => getLocal(KEYS.TASKS, []));
  const [studySessions, setStudySessions] = useState<AcademicStudySession[]>(() =>
    getLocal(KEYS.SESSIONS, [])
  );
  const [assignments, setAssignments] = useState<AcademicAssignment[]>(() =>
    getLocal(KEYS.ASSIGNMENTS, [])
  );
  const [exams, setExams] = useState<AcademicExam[]>(() => getLocal(KEYS.EXAMS, []));
  const [notes, setNotes] = useState<AcademicNote[]>(() => getLocal(KEYS.NOTES, []));
  const [resources, setResources] = useState<AcademicResource[]>(() =>
    getLocal(KEYS.RESOURCES, [])
  );
  const [revisions, setRevisions] = useState<AcademicRevision[]>(() =>
    getLocal(KEYS.REVISIONS, [])
  );
  const [attendance, setAttendance] = useState<AcademicAttendanceRecord[]>(() =>
    getLocal(KEYS.ATTENDANCE, [])
  );
  const [settings, setSettings] = useState<AcademicSettings>(() =>
    getLocal(KEYS.SETTINGS, DEFAULT_ACADEMIC_SETTINGS)
  );
  const [notifications, setNotifications] = useState<AcademicNotification[]>(() =>
    getLocal(KEYS.NOTIFICATIONS, [])
  );

  const [activeAcademicTab, setActiveAcademicTabState] = useState<AcademicTab>('dashboard');
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string | null>(null);

  const isCloudConnected = Boolean(supabase && currentUser);

  // Sync to localStorage
  useEffect(() => { setLocal(KEYS.SEMESTERS, semesters); }, [semesters]);
  useEffect(() => { setLocal(KEYS.SUBJECTS, subjects); }, [subjects]);
  useEffect(() => { setLocal(KEYS.TASKS, tasks); }, [tasks]);
  useEffect(() => { setLocal(KEYS.SESSIONS, studySessions); }, [studySessions]);
  useEffect(() => { setLocal(KEYS.ASSIGNMENTS, assignments); }, [assignments]);
  useEffect(() => { setLocal(KEYS.EXAMS, exams); }, [exams]);
  useEffect(() => { setLocal(KEYS.NOTES, notes); }, [notes]);
  useEffect(() => { setLocal(KEYS.RESOURCES, resources); }, [resources]);
  useEffect(() => { setLocal(KEYS.REVISIONS, revisions); }, [revisions]);
  useEffect(() => { setLocal(KEYS.ATTENDANCE, attendance); }, [attendance]);
  useEffect(() => { setLocal(KEYS.SETTINGS, settings); }, [settings]);
  useEffect(() => { setLocal(KEYS.NOTIFICATIONS, notifications); }, [notifications]);

  // Auth & Cloud Initial Hydration
  const loadCloudAcademicData = useCallback(async (user: User) => {
    setIsLoading(true);
    try {
      await ensureSemester5SeededInCloud(user.id);
      const data = await fetchFullAcademicData(user.id);
      if (data) {
        if (data.semesters.length > 0) setSemesters(data.semesters);
        if (data.subjects.length > 0) setSubjects(data.subjects);
        setTasks(data.tasks);
        setAssignments(data.assignments);
        setExams(data.exams);
        setNotes(data.notes);
        setResources(data.resources);
        setRevisions(data.revisions);
        setAttendance(data.attendance);
        if (data.settings) setSettings(data.settings);
        setLastSyncTime(new Date().toLocaleTimeString());
      }
    } catch (err) {
      console.error('Failed to load academic data from cloud:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        loadCloudAcademicData(user);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      const user = session?.user ?? null;
      setCurrentUser(user);
      if (user) {
        loadCloudAcademicData(user);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [loadCloudAcademicData]);

  // Realtime Subscriptions
  useEffect(() => {
    if (!supabase || !currentUser) return;

    const channel = supabase
      .channel(`academic-realtime-${currentUser.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_subjects', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_tasks', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_assignments', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_exams', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_revisions', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'academic_attendance', filter: `user_id=eq.${currentUser.id}` },
        () => {
          loadCloudAcademicData(currentUser);
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [currentUser, loadCloudAcademicData]);

  // Navigation Helper
  const setActiveAcademicTab = useCallback((tab: AcademicTab, subjectId?: string) => {
    setActiveAcademicTabState(tab);
    if (subjectId) {
      setSelectedSubjectId(subjectId);
    }
  }, []);

  const activeSubject = useMemo(() => {
    if (!selectedSubjectId) return null;
    return subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [subjects, selectedSubjectId]);

  // ==============================================================================
  // SUBJECT CRUD
  // ==============================================================================
  const addSubject = useCallback(
    async (subData: Omit<AcademicSubject, 'id' | 'createdAt' | 'updatedAt' | 'units'>) => {
      const newSubject: AcademicSubject = {
        ...subData,
        id: `sub_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        units: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSubjects((prev) => [...prev, newSubject]);

      if (currentUser) {
        await syncSubjectToCloud(newSubject, currentUser.id);
      }

      return newSubject;
    },
    [currentUser]
  );

  const updateSubject = useCallback(
    async (id: string, updates: Partial<AcademicSubject>) => {
      let updatedTarget: AcademicSubject | null = null;

      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id === id) {
            updatedTarget = { ...s, ...updates, updatedAt: new Date().toISOString() };
            return updatedTarget;
          }
          return s;
        })
      );

      if (currentUser && updatedTarget) {
        await syncSubjectToCloud(updatedTarget, currentUser.id);
      }
    },
    [currentUser]
  );

  const archiveSubject = useCallback(
    async (id: string, isArchived: boolean = true) => {
      await updateSubject(id, { isArchived });
    },
    [updateSubject]
  );

  const deleteSubject = useCallback(
    async (id: string) => {
      setSubjects((prev) => prev.filter((s) => s.id !== id));
      if (selectedSubjectId === id) setSelectedSubjectId(null);

      if (currentUser) {
        await deleteSubjectFromCloud(id, currentUser.id);
      }
    },
    [currentUser, selectedSubjectId]
  );

  // ==============================================================================
  // UNIT CRUD
  // ==============================================================================
  const addUnit = useCallback(
    async (
      subjectId: string,
      unitData: Omit<AcademicUnit, 'id' | 'subjectId' | 'topics' | 'createdAt' | 'updatedAt'>
    ) => {
      const newUnit: AcademicUnit = {
        ...unitData,
        id: `unit_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        subjectId,
        topics: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSubjects((prev) =>
        prev.map((s) => {
          if (s.id === subjectId) {
            return {
              ...s,
              units: [...s.units, newUnit],
              updatedAt: new Date().toISOString(),
            };
          }
          return s;
        })
      );

      if (currentUser) {
        await syncUnitToCloud(newUnit, currentUser.id);
      }

      return newUnit;
    },
    [currentUser]
  );

  const updateUnit = useCallback(
    async (unitId: string, updates: Partial<AcademicUnit>) => {
      let targetUnit: AcademicUnit | null = null;

      setSubjects((prev) =>
        prev.map((s) => {
          const unitIdx = s.units.findIndex((u) => u.id === unitId);
          if (unitIdx === -1) return s;

          const updatedUnits = [...s.units];
          targetUnit = {
            ...updatedUnits[unitIdx],
            ...updates,
            updatedAt: new Date().toISOString(),
          };
          updatedUnits[unitIdx] = targetUnit;

          return { ...s, units: updatedUnits, updatedAt: new Date().toISOString() };
        })
      );

      if (currentUser && targetUnit) {
        await syncUnitToCloud(targetUnit, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteUnit = useCallback(
    async (unitId: string) => {
      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          units: s.units.filter((u) => u.id !== unitId),
          updatedAt: new Date().toISOString(),
        }))
      );

      if (currentUser) {
        await deleteUnitFromCloud(unitId, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // TOPIC CRUD
  // ==============================================================================
  const addTopic = useCallback(
    async (
      unitId: string,
      topicData: Omit<AcademicTopic, 'id' | 'unitId' | 'subjectId' | 'isCompleted' | 'createdAt' | 'updatedAt'>
    ) => {
      // Find subject for this unit
      let targetSubjectId = '';
      for (const s of subjects) {
        if (s.units.some((u) => u.id === unitId)) {
          targetSubjectId = s.id;
          break;
        }
      }

      const newTopic: AcademicTopic = {
        ...topicData,
        id: `topic_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        unitId,
        subjectId: targetSubjectId,
        isCompleted: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          units: s.units.map((u) => {
            if (u.id === unitId) {
              return {
                ...u,
                topics: [...u.topics, newTopic],
                updatedAt: new Date().toISOString(),
              };
            }
            return u;
          }),
        }))
      );

      if (currentUser) {
        await syncTopicToCloud(newTopic, currentUser.id);
      }

      return newTopic;
    },
    [subjects, currentUser]
  );

  const updateTopic = useCallback(
    async (topicId: string, updates: Partial<AcademicTopic>) => {
      let targetTopic: AcademicTopic | null = null;

      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          units: s.units.map((u) => {
            const topIdx = u.topics.findIndex((t) => t.id === topicId);
            if (topIdx === -1) return u;

            const updatedTopics = [...u.topics];
            targetTopic = {
              ...updatedTopics[topIdx],
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            updatedTopics[topIdx] = targetTopic;

            return { ...u, topics: updatedTopics, updatedAt: new Date().toISOString() };
          }),
        }))
      );

      if (currentUser && targetTopic) {
        await syncTopicToCloud(targetTopic, currentUser.id);
      }
    },
    [currentUser]
  );

  const toggleTopicComplete = useCallback(
    async (topicId: string) => {
      let targetTopic: AcademicTopic | null = null;

      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          units: s.units.map((u) => {
            const topIdx = u.topics.findIndex((t) => t.id === topicId);
            if (topIdx === -1) return u;

            const updatedTopics = [...u.topics];
            const current = updatedTopics[topIdx];
            const isCompleted = !current.isCompleted;
            targetTopic = {
              ...current,
              isCompleted,
              completedAt: isCompleted ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString(),
            };
            updatedTopics[topIdx] = targetTopic;

            return { ...u, topics: updatedTopics, updatedAt: new Date().toISOString() };
          }),
        }))
      );

      if (currentUser && targetTopic) {
        await syncTopicToCloud(targetTopic, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteTopic = useCallback(
    async (topicId: string) => {
      setSubjects((prev) =>
        prev.map((s) => ({
          ...s,
          units: s.units.map((u) => ({
            ...u,
            topics: u.topics.filter((t) => t.id !== topicId),
            updatedAt: new Date().toISOString(),
          })),
        }))
      );

      if (currentUser) {
        await deleteTopicFromCloud(topicId, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // TASKS CRUD
  // ==============================================================================
  const addTask = useCallback(
    async (
      taskData: Omit<AcademicTask, 'id' | 'rescheduleCount' | 'actualTimeMinutes' | 'createdAt' | 'updatedAt'>
    ) => {
      const newTask: AcademicTask = {
        ...taskData,
        id: `actask_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        actualTimeMinutes: 0,
        rescheduleCount: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setTasks((prev) => [newTask, ...prev]);

      if (currentUser) {
        await syncTaskToCloud(newTask, currentUser.id);
      }

      return newTask;
    },
    [currentUser]
  );

  const updateTask = useCallback(
    async (taskId: string, updates: Partial<AcademicTask>) => {
      let updatedTask: AcademicTask | null = null;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            updatedTask = {
              ...t,
              ...updates,
              updatedAt: new Date().toISOString(),
            };
            return updatedTask;
          }
          return t;
        })
      );

      if (currentUser && updatedTask) {
        await syncTaskToCloud(updatedTask, currentUser.id);
      }
    },
    [currentUser]
  );

  const toggleTaskComplete = useCallback(
    async (taskId: string) => {
      let updatedTask: AcademicTask | null = null;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            const isCompleted = t.status === 'completed';
            const newStatus = isCompleted ? 'pending' : 'completed';
            updatedTask = {
              ...t,
              status: newStatus,
              completionTimestamp: newStatus === 'completed' ? new Date().toISOString() : undefined,
              updatedAt: new Date().toISOString(),
            };
            return updatedTask;
          }
          return t;
        })
      );

      if (currentUser && updatedTask) {
        await syncTaskToCloud(updatedTask, currentUser.id);
      }
    },
    [currentUser]
  );

  const rescheduleTask = useCallback(
    async (taskId: string, newDate: string) => {
      let updatedTask: AcademicTask | null = null;

      setTasks((prev) =>
        prev.map((t) => {
          if (t.id === taskId) {
            updatedTask = {
              ...t,
              scheduledDate: newDate,
              rescheduleCount: (t.rescheduleCount || 0) + 1,
              status: t.status === 'skipped' ? 'pending' : t.status,
              updatedAt: new Date().toISOString(),
            };
            return updatedTask;
          }
          return t;
        })
      );

      if (currentUser && updatedTask) {
        await syncTaskToCloud(updatedTask, currentUser.id);
      }
    },
    [currentUser]
  );

  const skipTask = useCallback(
    async (taskId: string, reason?: string) => {
      await updateTask(taskId, {
        status: 'skipped',
        skipReason: reason || 'Skipped by student',
      });
    },
    [updateTask]
  );

  const deleteTask = useCallback(
    async (taskId: string) => {
      setTasks((prev) => prev.filter((t) => t.id !== taskId));

      if (currentUser) {
        await deleteTaskFromCloud(taskId, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // ASSIGNMENTS CRUD
  // ==============================================================================
  const addAssignment = useCallback(
    async (aData: Omit<AcademicAssignment, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newAssign: AcademicAssignment = {
        ...aData,
        id: `asg_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setAssignments((prev) => [newAssign, ...prev]);

      if (currentUser) {
        await syncAssignmentToCloud(newAssign, currentUser.id);
      }

      return newAssign;
    },
    [currentUser]
  );

  const updateAssignment = useCallback(
    async (id: string, updates: Partial<AcademicAssignment>) => {
      let target: AcademicAssignment | null = null;

      setAssignments((prev) =>
        prev.map((a) => {
          if (a.id === id) {
            target = { ...a, ...updates, updatedAt: new Date().toISOString() };
            return target;
          }
          return a;
        })
      );

      if (currentUser && target) {
        await syncAssignmentToCloud(target, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteAssignment = useCallback(
    async (id: string) => {
      setAssignments((prev) => prev.filter((a) => a.id !== id));

      if (currentUser) {
        await deleteAssignmentFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // EXAMS CRUD
  // ==============================================================================
  const addExam = useCallback(
    async (examData: Omit<AcademicExam, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newExam: AcademicExam = {
        ...examData,
        id: `exam_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setExams((prev) => [newExam, ...prev]);

      if (currentUser) {
        await syncExamToCloud(newExam, currentUser.id);
      }

      return newExam;
    },
    [currentUser]
  );

  const updateExam = useCallback(
    async (id: string, updates: Partial<AcademicExam>) => {
      let target: AcademicExam | null = null;

      setExams((prev) =>
        prev.map((e) => {
          if (e.id === id) {
            target = { ...e, ...updates, updatedAt: new Date().toISOString() };
            return target;
          }
          return e;
        })
      );

      if (currentUser && target) {
        await syncExamToCloud(target, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteExam = useCallback(
    async (id: string) => {
      setExams((prev) => prev.filter((e) => e.id !== id));

      if (currentUser) {
        await deleteExamFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // NOTES CRUD
  // ==============================================================================
  const addNote = useCallback(
    async (noteData: Omit<AcademicNote, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newNote: AcademicNote = {
        ...noteData,
        id: `note_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setNotes((prev) => [newNote, ...prev]);

      if (currentUser) {
        await syncNoteToCloud(newNote, currentUser.id);
      }

      return newNote;
    },
    [currentUser]
  );

  const updateNote = useCallback(
    async (id: string, updates: Partial<AcademicNote>) => {
      let target: AcademicNote | null = null;

      setNotes((prev) =>
        prev.map((n) => {
          if (n.id === id) {
            target = { ...n, ...updates, updatedAt: new Date().toISOString() };
            return target;
          }
          return n;
        })
      );

      if (currentUser && target) {
        await syncNoteToCloud(target, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteNote = useCallback(
    async (id: string) => {
      setNotes((prev) => prev.filter((n) => n.id !== id));

      if (currentUser) {
        await deleteNoteFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  const togglePinNote = useCallback(
    async (id: string) => {
      const target = notes.find((n) => n.id === id);
      if (target) {
        await updateNote(id, { isPinned: !target.isPinned });
      }
    },
    [notes, updateNote]
  );

  // ==============================================================================
  // RESOURCES CRUD
  // ==============================================================================
  const addResource = useCallback(
    async (resData: Omit<AcademicResource, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newRes: AcademicResource = {
        ...resData,
        id: `res_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setResources((prev) => [newRes, ...prev]);

      if (currentUser) {
        await syncResourceToCloud(newRes, currentUser.id);
      }

      return newRes;
    },
    [currentUser]
  );

  const updateResource = useCallback(
    async (id: string, updates: Partial<AcademicResource>) => {
      let target: AcademicResource | null = null;

      setResources((prev) =>
        prev.map((r) => {
          if (r.id === id) {
            target = { ...r, ...updates, updatedAt: new Date().toISOString() };
            return target;
          }
          return r;
        })
      );

      if (currentUser && target) {
        await syncResourceToCloud(target, currentUser.id);
      }
    },
    [currentUser]
  );

  const deleteResource = useCallback(
    async (id: string) => {
      setResources((prev) => prev.filter((r) => r.id !== id));

      if (currentUser) {
        await deleteResourceFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // REVISION PLANNER
  // ==============================================================================
  const scheduleRevisionForTopic = useCallback(
    async (topicId: string, subjectId: string, topicTitle: string) => {
      // Check if already in queue
      const existing = revisions.find((r) => r.topicId === topicId);
      if (existing) return;

      const intervals = settings.revisionIntervals || [1, 3, 7, 14, 30];
      const nextDays = intervals[0] || 1;
      const targetDate = new Date();
      targetDate.setDate(targetDate.getDate() + nextDays);
      const scheduledDateStr = targetDate.toISOString().split('T')[0];

      const newRev: AcademicRevision = {
        id: `rev_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        subjectId,
        topicId,
        title: topicTitle,
        lastStudiedDate: getTodayDateStr(),
        scheduledDate: scheduledDateStr,
        stage: 0,
        confidenceRating: 3,
        history: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setRevisions((prev) => [...prev, newRev]);

      if (currentUser) {
        await syncRevisionToCloud(newRev, currentUser.id);
      }
    },
    [revisions, settings.revisionIntervals, currentUser]
  );

  const logRevisionReview = useCallback(
    async (revisionId: string, outcome: RevisionOutcome, confidence: number, reviewNotes?: string) => {
      const rev = revisions.find((r) => r.id === revisionId);
      if (!rev) return;

      const intervals = settings.revisionIntervals || [1, 3, 7, 14, 30];
      let newStage = rev.stage;

      // Spaced repetition progression logic
      if (outcome === 'strong') {
        newStage = Math.min(rev.stage + 1, intervals.length - 1);
      } else if (outcome === 'poor') {
        newStage = 0; // restart cycle
      }

      const daysToAdd = intervals[newStage] || 3;
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + daysToAdd);
      const nextDateStr = nextDate.toISOString().split('T')[0];

      const historyEntry = {
        id: `rh_${Date.now()}`,
        date: getTodayDateStr(),
        outcome,
        confidence,
        notes: reviewNotes,
      };

      const updatedRev: AcademicRevision = {
        ...rev,
        lastRevisionDate: getTodayDateStr(),
        scheduledDate: nextDateStr,
        stage: newStage,
        confidenceRating: confidence,
        lastOutcome: outcome,
        history: [...rev.history, historyEntry],
        updatedAt: new Date().toISOString(),
      };

      setRevisions((prev) => prev.map((r) => (r.id === revisionId ? updatedRev : r)));

      if (currentUser) {
        await syncRevisionToCloud(updatedRev, currentUser.id);
      }
    },
    [revisions, settings.revisionIntervals, currentUser]
  );

  const deleteRevision = useCallback(
    async (id: string) => {
      setRevisions((prev) => prev.filter((r) => r.id !== id));

      if (currentUser) {
        await deleteRevisionFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // ATTENDANCE CRUD
  // ==============================================================================
  const logAttendance = useCallback(
    async (recordData: Omit<AcademicAttendanceRecord, 'id' | 'createdAt'>) => {
      const newRecord: AcademicAttendanceRecord = {
        ...recordData,
        id: `att_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
        createdAt: new Date().toISOString(),
      };

      setAttendance((prev) => [newRecord, ...prev]);

      if (currentUser) {
        await syncAttendanceToCloud(newRecord, currentUser.id);
      }

      return newRecord;
    },
    [currentUser]
  );

  const deleteAttendance = useCallback(
    async (id: string) => {
      setAttendance((prev) => prev.filter((a) => a.id !== id));

      if (currentUser) {
        await deleteAttendanceFromCloud(id, currentUser.id);
      }
    },
    [currentUser]
  );

  // ==============================================================================
  // SETTINGS
  // ==============================================================================
  const updateSettings = useCallback(
    async (updates: Partial<AcademicSettings>) => {
      const newSettings = {
        ...settings,
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      setSettings(newSettings);

      if (currentUser) {
        await syncAcademicSettingsToCloud(newSettings, currentUser.id);
      }
    },
    [settings, currentUser]
  );

  // ==============================================================================
  // NOTIFICATIONS
  // ==============================================================================
  const markNotificationRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, readAt: new Date().toISOString() } : n))
    );
  }, []);

  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const refreshAcademicData = useCallback(async () => {
    if (currentUser) {
      await loadCloudAcademicData(currentUser);
    }
  }, [currentUser, loadCloudAcademicData]);

  // ==============================================================================
  // COMPUTED METRICS & INTELLIGENCE
  // ==============================================================================
  const todayStr = getTodayDateStr();

  // Topics and Semester Progress
  const { totalTopicsCount, completedTopicsCount } = useMemo(() => {
    let total = 0;
    let completed = 0;
    subjects.filter((s) => !s.isArchived).forEach((s) => {
      s.units.forEach((u) => {
        u.topics.forEach((t) => {
          total++;
          if (t.isCompleted) completed++;
        });
      });
    });
    return { totalTopicsCount: total, completedTopicsCount: completed };
  }, [subjects]);

  const semesterCompletionPercentage = useMemo(() => {
    if (totalTopicsCount === 0) return 0;
    return Math.round((completedTopicsCount / totalTopicsCount) * 100);
  }, [totalTopicsCount, completedTopicsCount]);

  // Tasks
  const todayTasks = useMemo(() => {
    return tasks.filter((t) => t.scheduledDate === todayStr);
  }, [tasks, todayStr]);

  const todayCompletedTasksCount = useMemo(() => {
    return todayTasks.filter((t) => t.status === 'completed').length;
  }, [todayTasks]);

  const overdueTasks = useMemo(() => {
    return tasks.filter(
      (t) => t.scheduledDate < todayStr && t.status !== 'completed' && t.status !== 'skipped'
    );
  }, [tasks, todayStr]);

  // Deadlines
  const upcomingAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.dueDate >= todayStr && a.status !== 'completed' && a.status !== 'submitted')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [assignments, todayStr]);

  const overdueAssignments = useMemo(() => {
    return assignments
      .filter((a) => a.dueDate < todayStr && a.status !== 'completed' && a.status !== 'submitted')
      .sort((a, b) => a.dueDate.localeCompare(b.dueDate));
  }, [assignments, todayStr]);

  const upcomingExams = useMemo(() => {
    return exams
      .filter((e) => e.examDate >= todayStr)
      .sort((a, b) => a.examDate.localeCompare(b.examDate));
  }, [exams, todayStr]);

  const revisionsDueToday = useMemo(() => {
    return revisions.filter((r) => r.scheduledDate <= todayStr);
  }, [revisions, todayStr]);

  // Attendance Statistics per subject
  const subjectAttendanceStats = useMemo(() => {
    const threshold = settings.minimumAttendanceThreshold || 75;
    const stats: Record<string, SubjectAttendanceStat> = {};

    subjects.forEach((s) => {
      const records = attendance.filter((a) => a.subjectId === s.id);
      const totalClasses = records.length;
      const attendedClasses = records.filter((a) => a.status === 'present').length;
      const excusedClasses = records.filter((a) => a.status === 'excused').length;
      const absentClasses = records.filter((a) => a.status === 'absent').length;

      // Effective total: excludes excused classes if needed or treats present/total
      const countedTotal = totalClasses - excusedClasses;
      const percentage =
        countedTotal > 0 ? Math.round((attendedClasses / countedTotal) * 100) : 100;
      const isBelowThreshold = percentage < threshold && totalClasses > 0;

      // How many classes can bunk or need to attend
      let canBunkCount = 0;
      let needToAttendCount = 0;

      if (countedTotal > 0) {
        if (percentage >= threshold) {
          // Solves: attended / (total + x) >= threshold / 100 => x <= (attended / threshold*100) - total
          canBunkCount = Math.max(0, Math.floor((attendedClasses * 100) / threshold - countedTotal));
        } else {
          // Solves: (attended + x) / (total + x) >= threshold / 100 => x >= (threshold*total - 100*attended) / (100 - threshold)
          needToAttendCount = Math.max(
            0,
            Math.ceil((threshold * countedTotal - 100 * attendedClasses) / (100 - threshold))
          );
        }
      }

      stats[s.id] = {
        subjectId: s.id,
        totalClasses,
        attendedClasses,
        excusedClasses,
        absentClasses,
        percentage,
        isBelowThreshold,
        canBunkCount,
        needToAttendCount,
      };
    });

    return stats;
  }, [subjects, attendance, settings.minimumAttendanceThreshold]);

  // Study time & consistency
  const totalStudyMinutesWeek = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const minDateStr = sevenDaysAgo.toISOString().split('T')[0];

    return studySessions
      .filter((s) => s.date >= minDateStr)
      .reduce((acc, curr) => acc + curr.durationMinutes, 0);
  }, [studySessions]);

  const weeklyConsistencyDays = useMemo(() => {
    const dates = new Set(tasks.filter((t) => t.status === 'completed').map((t) => t.scheduledDate));
    return dates.size;
  }, [tasks]);

  return (
    <AcademicContext.Provider
      value={{
        semesters,
        subjects,
        activeSubject,
        selectedSubjectId,
        tasks,
        studySessions,
        assignments,
        exams,
        notes,
        resources,
        revisions,
        attendance,
        settings,
        notifications,
        activeAcademicTab,
        isLoading,
        isCloudConnected,
        lastSyncTime,

        setActiveAcademicTab,
        setSelectedSubjectId,

        addSubject,
        updateSubject,
        archiveSubject,
        deleteSubject,

        addUnit,
        updateUnit,
        deleteUnit,

        addTopic,
        updateTopic,
        toggleTopicComplete,
        deleteTopic,

        addTask,
        updateTask,
        toggleTaskComplete,
        rescheduleTask,
        skipTask,
        deleteTask,

        addAssignment,
        updateAssignment,
        deleteAssignment,

        addExam,
        updateExam,
        deleteExam,

        addNote,
        updateNote,
        deleteNote,
        togglePinNote,

        addResource,
        updateResource,
        deleteResource,

        scheduleRevisionForTopic,
        logRevisionReview,
        deleteRevision,

        logAttendance,
        deleteAttendance,

        updateSettings,

        markNotificationRead,
        clearAllNotifications,

        semesterCompletionPercentage,
        totalTopicsCount,
        completedTopicsCount,
        todayTasks,
        todayCompletedTasksCount,
        overdueTasks,
        upcomingAssignments,
        overdueAssignments,
        upcomingExams,
        revisionsDueToday,
        subjectAttendanceStats,
        totalStudyMinutesWeek,
        weeklyConsistencyDays,
        refreshAcademicData,
      }}
    >
      {children}
    </AcademicContext.Provider>
  );
};

export const useAcademic = (): AcademicContextType => {
  const context = useContext(AcademicContext);
  if (!context) {
    throw new Error('useAcademic must be used within an AcademicProvider');
  }
  return context;
};
