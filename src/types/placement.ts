export type PlacementTab = 
  | 'overview' 
  | 'daily-tasks' 
  | 'applications' 
  | 'referrals' 
  | 'assessments' 
  | 'reminders-config';

export type JobApplicationPlatform = 
  | 'LinkedIn' 
  | 'Naukri' 
  | 'Company Portal' 
  | 'Wellfound' 
  | 'Internshala' 
  | 'Indeed' 
  | 'Other';

export type ApplicationStatus = 
  | 'Applied' 
  | 'Screening' 
  | 'Online Assessment' 
  | 'Technical Interview' 
  | 'HR Round' 
  | 'Offered' 
  | 'Rejected' 
  | 'Withdrawn';

export interface JobApplication {
  id: string;
  userId?: string;
  company: string;
  role: string;
  platform: JobApplicationPlatform;
  jobLink?: string;
  applicationDate: string; // YYYY-MM-DD
  status: ApplicationStatus;
  referralContact?: string;
  notes?: string;
  location?: string;
  salaryRange?: string;
  createdAt: string;
  updatedAt: string;
}

export type ReferralResponseStatus = 
  | 'Pending' 
  | 'Connected' 
  | 'Referral Submitted' 
  | 'Declined' 
  | 'No Response';

export interface ReferralOutreach {
  id: string;
  userId?: string;
  contactName: string;
  company: string;
  role: string;
  profileLink: string;
  dateContacted: string; // YYYY-MM-DD
  responseStatus: ReferralResponseStatus;
  followUpDate?: string; // YYYY-MM-DD
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export type WeekendAssessmentType = 
  | 'mock_test' 
  | 'coding_contest' 
  | 'mock_interview';

export type AssessmentStatus = 
  | 'Pending' 
  | 'Completed' 
  | 'Rescheduled';

export interface WeekendAssessment {
  id: string;
  userId?: string;
  type: WeekendAssessmentType;
  title: string;
  date: string; // YYYY-MM-DD
  status: AssessmentStatus;
  scoreOrRank?: string;
  durationMinutes?: number;
  feedback?: string;
  mistakes?: string;
  improvementAreas?: string;
  partnerOrPlatform?: string;
  rescheduledDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type PlacementReminderType = 
  | 'morning_review' 
  | 'dsa_session' 
  | 'project_session' 
  | 'job_applications' 
  | 'referral_outreach' 
  | 'weekend_assessment' 
  | 'evening_review' 
  | 'custom';

export interface PlacementReminderSchedule {
  id: string;
  userId?: string;
  type: PlacementReminderType;
  title: string;
  description: string;
  preferredTime: string; // "08:30", "10:00", etc.
  preferredDays: number[]; // 0=Sun, 1=Mon, ..., 6=Sat
  enabled: boolean;
  snoozedUntil?: string; // ISO string
  lastTriggeredDate?: string; // YYYY-MM-DD
  targetCount?: number;
  createdAt: string;
  updatedAt: string;
}

export type TaskCompletionStatus = 
  | 'pending' 
  | 'partially_completed' 
  | 'completed' 
  | 'rescheduled';

export interface PlacementDailyTask {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  category: 'dsa' | 'project' | 'applications' | 'referrals' | 'weekend' | 'review';
  title: string;
  description?: string;
  status: TaskCompletionStatus;
  targetCount?: number;
  currentCount?: number;
  timeSpentMinutes?: number;
  notes?: string;
  rescheduledTo?: string; // YYYY-MM-DD
  isOverdue?: boolean;
  completedAt?: string;
  details?: {
    problems?: Array<{
      name: string;
      difficulty: 'Easy' | 'Medium' | 'Hard';
      completed: boolean;
      url?: string;
    }>;
    projectFocus?: string;
    gitLinkOrSummary?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface ProjectSessionLog {
  id: string;
  userId?: string;
  date: string; // YYYY-MM-DD
  title: string;
  durationMinutes: number;
  notes?: string;
  repoOrBranch?: string;
  completedAt: string;
}

export interface PlacementSettings {
  dailyApplicationTarget: number; // default: 10
  weeklyReferralTarget: number; // default: 7
  dailyDsaTarget: number; // default: 2 (min 1 medium)
  dailyProjectHours: number; // default: 1
  sprintStartDate: string; // YYYY-MM-DD (Day 1 of 90)
  sprintEndDate: string; // YYYY-MM-DD (Day 90)
  timezone: string; // e.g. "Asia/Kolkata" or "UTC"
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  browserNotificationsEnabled: boolean;
  snoozeDefaultMinutes: number; // 10, 30, or 60
}

export interface PlacementDayStats {
  date: string;
  applicationsCount: number;
  referralsCount: number;
  dsaSolvedCount: number;
  hasMediumDsa: boolean;
  projectMinutes: number;
  weekendAssessmentsCount: number;
  tasksCompleted: number;
  tasksTotal: number;
}
