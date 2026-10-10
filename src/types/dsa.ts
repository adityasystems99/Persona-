export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export type ProblemStatus = 
  | 'Not Started'
  | 'In Progress'
  | 'Solved Independently'
  | 'Solved with Hints'
  | 'Needs Revision';

export type DayStatus =
  | 'Locked'
  | 'Available'
  | 'In Progress'
  | 'Completed';

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
  studyDayId?: string; // Links to StudyDay.id
  title: string;
  topic: string;
  subtopic?: string;
  difficulty: Difficulty;
  platform: Platform;
  problemNumber?: string;
  url: string;
  status: ProblemStatus;
  startTime?: string;
  completionTime?: string;
  timeSpentMinutes: number;
  timeSpentSeconds?: number;
  notes?: string;
  approach?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
  attempts: number;
  solvedIndependently: boolean;
  inTodayPlan: boolean;
  orderInPlan: number;
  plannedOrder?: number;
  needsRevision: boolean;
  revisionScheduledDate?: string;
  mistakes?: string;
  patternLearned?: string;
  hintsUsed?: number;
  hintsNotes?: string;
  focusTimeSeconds?: number;
  rescheduleHistory?: RescheduleEvent[];
  spacedRepetitionStage?: number; // 0, 1, 2, 3, 4
  lastRevisionOutcome?: 'success' | 'hints' | 'failed';
  lastRevisionDate?: string;
  revisionHistory: RevisionLog[];
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StudyDay {
  id: string;
  userId?: string;
  dayNumber: number; // 1, 2, 3...
  title: string; // e.g. "Arrays & Hashing Foundations"
  studyDate: string; // YYYY-MM-DD
  deadline?: string; // e.g. "23:00"
  status: DayStatus;
  isUnlocked: boolean;
  requiresStl: boolean; // default true
  targetQuestionCount: number; // e.g. 4
  targetEasy: number;
  targetMedium: number;
  targetHard: number;
  totalTimeMinutes: number;
  notes?: string;
  learningOutcomes?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailyPlan {
  date: string; // YYYY-MM-DD
  dayId?: string;
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
  studyDayId?: string;
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
  timezone?: string;
  requiresStlDefault?: boolean;
  spacedRepetitionIntervals?: number[]; // [1, 3, 7, 14]
  readinessWeights?: {
    coverage: number;
    independent: number;
    revision: number;
    difficulty: number;
    consistency: number;
  };
}

export interface StudyDayLog {
  date: string;
  dayNumber?: number;
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

export type NotificationType = 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'reminder' 
  | 'stl' 
  | 'milestone' 
  | 'recovery';

export type StudyEventType = 
  | 'day_unlocked'
  | 'day_completed'
  | 'stl_pending'
  | 'stl_completed'
  | 'target_reminder'
  | 'hourly_checkin'
  | 'deadline_approaching'
  | 'problem_solved'
  | 'milestone'
  | 'recovery'
  | 'info';

export interface StudyEvent {
  id: string;
  userId?: string;
  studyDayId?: string;
  eventType: StudyEventType;
  title: string;
  message: string;
  createdAt: string;
  readAt?: string | null;
  read: boolean;
}

export interface AppNotification {
  id: string;
  userId?: string;
  studyDayId?: string;
  title: string;
  message: string;
  timestamp: string;
  createdAt?: string;
  type: NotificationType;
  eventType?: StudyEventType;
  read: boolean;
}

export interface RescheduleEvent {
  id: string;
  problemId: string;
  problemTitle: string;
  date: string; // ISO date
  action: 'carry_over' | 'reschedule' | 'skip' | 'retain';
  previousDate?: string;
  targetDate?: string;
  reason?: string;
}

export interface STLExercise {
  id: string;
  topicId: string;
  category: string;
  title: string;
  difficulty: Difficulty;
  description: string;
  starterCode: string;
  solutionCode: string;
  conceptReinforced: string;
  testCasesDescription: string;
  isCompleted: boolean;
  completedAt?: string;
  userCode?: string;
}

export interface FocusSession {
  id: string;
  problemId: string;
  problemTitle: string;
  startedAt: string;
  endedAt?: string;
  activeSeconds: number;
  breakSeconds: number;
  hintsUsed: number;
  hintNotes?: string;
  mistakesRecorded?: string;
  status: 'completed' | 'abandoned';
}

export interface Milestone {
  id: string;
  title: string;
  category: 'solving' | 'revision' | 'stl' | 'consistency' | 'mastery';
  description: string;
  icon: string;
  targetValue: number;
  currentValue: number;
  isUnlocked: boolean;
  unlockedAt?: string;
}

export interface TopicMasteryStats {
  topic: string;
  totalProblems: number;
  solvedCount: number;
  independentCount: number;
  hintsCount: number;
  attemptsTotal: number;
  avgAttempts: number;
  totalMinutes: number;
  revisionFails: number;
  masteryScore: number; // 0 - 100
  status: 'Critical Weakness' | 'Needs Practice' | 'Developing' | 'Proficient' | 'Mastered';
  explanation: string;
  subtopics: {
    name: string;
    solved: number;
    total: number;
    needsHelp: boolean;
  }[];
}

export interface ReadinessBreakdown {
  topicCoverageScore: number;
  independentSolveScore: number;
  revisionSuccessScore: number;
  difficultyDistributionScore: number;
  consistencyScore: number;
  overallScore: number;
  weights: {
    coverage: number;
    independent: number;
    revision: number;
    difficulty: number;
    consistency: number;
  };
  explanation: string;
  actionableGaps: string[];
}

export type ActiveTab = 
  | 'dashboard'
  | 'daily-plan'
  | 'question-bank'
  | 'stl-practice'
  | 'revision-queue'
  | 'weakness-map'
  | 'focus-mode'
  | 'weekly-autopsy'
  | 'milestones'
  | 'analytics'
  | 'settings';

