export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Solved Independently'
  | 'Solved with Hints'
  | 'Needs Revision';

export type Platform = 
  | 'LeetCode'
  | 'Codeforces'
  | 'GeeksforGeeks'
  | 'CodeStudio'
  | 'HackerRank'
  | 'Other';

export interface RevisionLog {
  id: string;
  date: string;
  success: boolean;
  notes: string;
}

export interface Problem {
  id: string;
  title: string;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  platform: Platform;
  url: string;
  status: ProblemStatus;
  startTime?: string;
  completionTime?: string;
  timeSpentMinutes: number;
  notes?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  attempts: number;
  solvedIndependently: boolean;
  inTodayPlan: boolean;
  orderInPlan: number;
  needsRevision: boolean;
  revisionScheduledDate?: string;
  mistakes?: string;
  patternLearned?: string;
  revisionHistory: RevisionLog[];
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  targetCount: number;
  targetEasy: number;
  targetMedium: number;
  targetHard: number;
  deadlineTime: string; // e.g. "23:00"
  notes?: string;
  stlCompleted: boolean;
}

export interface STLTopicItem {
  id: string;
  title: string;
  category: string;
  methods: string[];
  description: string;
  keyUseCases: string;
  codeExample: string;
  completedDates: string[];
}

export interface STLPracticeState {
  date: string; // YYYY-MM-DD
  totalSeconds: number; // default 1800 (30 mins)
  remainingSeconds: number;
  isRunning: boolean;
  isCompleted: boolean;
  completedAt?: string;
  currentTopicId: string;
  notes: string;
  codeSnippet: string;
  lastTickTimestamp?: number;
}

export interface AccountabilitySettings {
  studyStartTime: string; // "09:00"
  studyEndTime: string; // "23:30"
  hourlyRemindersEnabled: boolean;
  stlReminderEnabled: boolean;
  incompleteTargetReminderEnabled: boolean;
  browserNotificationsEnabled: boolean;
  soundEnabled: boolean;
  reminderIntervalMinutes: number;
  dailyTargetEasy: number;
  dailyTargetMedium: number;
  dailyTargetHard: number;
}

export interface StudyDayLog {
  date: string;
  solvedCount: number;
  easySolved: number;
  mediumSolved: number;
  hardSolved: number;
  independentCount: number;
  hintsCount: number;
  dsaMinutes: number;
  stlMinutes: number;
  stlCompleted: boolean;
  targetMet: boolean;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'reminder' | 'target' | 'stl' | 'success' | 'info';
  read: boolean;
}

export type ActiveTab = 
  | 'dashboard'
  | 'daily-plan'
  | 'question-bank'
  | 'stl-practice'
  | 'revision-queue'
  | 'analytics'
  | 'settings';
