import {
  PlacementReminderSchedule,
  PlacementSettings,
  JobApplication,
  ReferralOutreach,
  WeekendAssessment,
  PlacementDailyTask,
} from '../types/placement';

// Helpers
export const getFormattedToday = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const getOffsetDate = (daysOffset: number): string => {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_PLACEMENT_SETTINGS: PlacementSettings = {
  dailyApplicationTarget: 10,
  weeklyReferralTarget: 7,
  dailyDsaTarget: 2,
  dailyProjectHours: 1,
  sprintStartDate: getOffsetDate(-10), // Sprint started 10 days ago by default
  sprintEndDate: getOffsetDate(80),   // 90 days total
  timezone: typeof Intl !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone || 'Asia/Kolkata' : 'Asia/Kolkata',
  soundEnabled: true,
  vibrationEnabled: true,
  browserNotificationsEnabled: false,
  snoozeDefaultMinutes: 10,
};

export const DEFAULT_PLACEMENT_REMINDERS: PlacementReminderSchedule[] = [
  {
    id: 'reminder-morning-review',
    type: 'morning_review',
    title: 'Morning Preparation Plan Review',
    description: 'Review your 90-day trajectory, prioritize 2 LeetCode problems, and review today target applications.',
    preferredTime: '08:30',
    preferredDays: [1, 2, 3, 4, 5], // Monday to Friday
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-dsa-session',
    type: 'dsa_session',
    title: 'Daily DSA Grind (2 LeetCode, min 1 Medium)',
    description: 'Deep focus: Solve 2 LeetCode problems with at least 1 Medium difficulty problem.',
    preferredTime: '10:00',
    preferredDays: [1, 2, 3, 4, 5], // Monday to Friday
    enabled: true,
    targetCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-project-session',
    type: 'project_session',
    title: 'Project Development Power Hour',
    description: 'Spend 1 uninterrupted, focused hour building, refactoring, or polishing your portfolio project.',
    preferredTime: '15:00',
    preferredDays: [1, 2, 3, 4, 5], // Monday to Friday
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-job-applications',
    type: 'job_applications',
    title: 'Daily Job Application Target (10 Roles)',
    description: 'Submit your 10 daily applications across LinkedIn, Naukri, and company career pages.',
    preferredTime: '17:30',
    preferredDays: [0, 1, 2, 3, 4, 5, 6], // Every Day
    enabled: true,
    targetCount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-referral-outreach',
    type: 'referral_outreach',
    title: 'Weekly Referral Outreach Sprint',
    description: 'Send 5–7 referral requests to alumni and software engineers at your dream target companies.',
    preferredTime: '19:00',
    preferredDays: [1, 2, 3, 4, 5], // Weekdays
    enabled: true,
    targetCount: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-weekend-assessment',
    type: 'weekend_assessment',
    title: 'Weekend Mock Test, Contest & Interview Practice',
    description: 'Complete 1 mock test, participate in 1 coding contest, and schedule 1 peer/senior mock interview.',
    preferredTime: '11:00',
    preferredDays: [0, 6], // Saturday and Sunday
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'reminder-evening-review',
    type: 'evening_review',
    title: 'Evening Daily Reflection & Reschedule Unfinished Tasks',
    description: 'Review what you accomplished today, celebrate small wins, and reschedule unfinished tasks to keep momentum.',
    preferredTime: '21:30',
    preferredDays: [0, 1, 2, 3, 4, 5, 6], // Every Day
    enabled: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_JOB_APPLICATIONS: JobApplication[] = [
  {
    id: 'app-google-swe',
    company: 'Google',
    role: 'Software Engineer - Early Career',
    platform: 'Company Portal',
    jobLink: 'https://careers.google.com/jobs/results/',
    applicationDate: getFormattedToday(),
    status: 'Applied',
    referralContact: 'Rohit Sharma (Senior SWE)',
    notes: 'Submitted via internal referral link with resume tailored to Distributed Systems.',
    location: 'Bengaluru / Hyderabad',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-microsoft-sde',
    company: 'Microsoft',
    role: 'Software Engineer (SDE-1)',
    platform: 'LinkedIn',
    jobLink: 'https://www.linkedin.com/jobs/view/microsoft-sde',
    applicationDate: getFormattedToday(),
    status: 'Screening',
    referralContact: 'Priya Patel (Engineering Manager)',
    notes: 'Recruiter responded on LinkedIn asking for updated transcript.',
    location: 'Hyderabad',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'app-atlassian-grad',
    company: 'Atlassian',
    role: 'Graduate Software Engineer',
    platform: 'Company Portal',
    jobLink: 'https://www.atlassian.com/company/careers',
    applicationDate: getOffsetDate(-2),
    status: 'Online Assessment',
    referralContact: 'Aman Verma',
    notes: 'Hackerrank OA received. 90 minutes test with 2 DSA + System Design basics.',
    location: 'Bengaluru (Hybrid)',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_REFERRALS: ReferralOutreach[] = [
  {
    id: 'ref-uber-sde',
    contactName: 'Ananya Deshmukh',
    company: 'Uber',
    role: 'Senior SDE-2',
    profileLink: 'https://linkedin.com/in/ananya-deshmukh-example',
    dateContacted: getOffsetDate(-3),
    responseStatus: 'Connected',
    followUpDate: getFormattedToday(),
    notes: 'Warm connection via university alumni group. Follow-up today regarding Job ID #UB-8902.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ref-amazon-sde',
    contactName: 'Vikram Singhania',
    company: 'Amazon',
    role: 'Software Development Engineer',
    profileLink: 'https://linkedin.com/in/vikram-singhania-example',
    dateContacted: getOffsetDate(-1),
    responseStatus: 'Referral Submitted',
    followUpDate: getOffsetDate(5),
    notes: 'Referred for SDE-1 position in AWS Database Services team.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'ref-salesforce-swe',
    contactName: 'Neha Kapoor',
    company: 'Salesforce',
    role: 'Lead MTS',
    profileLink: 'https://linkedin.com/in/neha-kapoor-example',
    dateContacted: getOffsetDate(-4),
    responseStatus: 'Pending',
    followUpDate: getFormattedToday(),
    notes: 'Sent personalized message highlighting matching skills in React and Java backend.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_WEEKEND_ASSESSMENTS: WeekendAssessment[] = [
  {
    id: 'assess-mock-test-1',
    type: 'mock_test',
    title: 'DSA Comprehensive Mock Test (Trees & Graphs)',
    date: getOffsetDate(-2),
    status: 'Completed',
    scoreOrRank: '85/100',
    durationMinutes: 90,
    feedback: 'Strong grasp of BFS/DFS traversal. Need faster implementation on Dijkstra and cycle detection.',
    mistakes: 'Missed visited set edge-case on disconnected components.',
    improvementAreas: 'Graph cycle detection in directed vs undirected graphs.',
    partnerOrPlatform: 'LeetCode Assessment',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'assess-contest-1',
    type: 'coding_contest',
    title: 'LeetCode Weekly Contest 420',
    date: getOffsetDate(-1),
    status: 'Completed',
    scoreOrRank: 'Rank 3140 / 22,000 (3/4 Solved)',
    durationMinutes: 90,
    feedback: 'Solved Q1 (Easy) in 4 mins, Q2 (Medium) in 18 mins, Q3 (Medium) in 38 mins. Q4 Hard timed out.',
    mistakes: 'Spent too long on Q4 before realizing it required segment tree with lazy propagation.',
    improvementAreas: 'Hard segment trees and interval DP.',
    partnerOrPlatform: 'LeetCode',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'assess-interview-1',
    type: 'mock_interview',
    title: 'Senior Mock Interview: System Design & DSA',
    date: getOffsetDate(5),
    status: 'Pending',
    partnerOrPlatform: 'Arjun Sen (Google L5 Senior Mentor)',
    durationMinutes: 60,
    feedback: '',
    improvementAreas: 'Practice talking through edge cases before writing code out loud.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export const INITIAL_DAILY_TASKS: PlacementDailyTask[] = [
  {
    id: 'task-dsa-today',
    date: getFormattedToday(),
    category: 'dsa',
    title: 'Solve 2 LeetCode Problems (1 Medium Required)',
    description: 'Complete 2 DSA problems, focusing on Trees or Dynamic Programming.',
    status: 'partially_completed',
    targetCount: 2,
    currentCount: 1,
    timeSpentMinutes: 45,
    details: {
      problems: [
        { name: 'Binary Tree Right Side View', difficulty: 'Medium', completed: true, url: 'https://leetcode.com/problems/binary-tree-right-side-view/' },
        { name: 'Lowest Common Ancestor of a Binary Tree', difficulty: 'Medium', completed: false, url: 'https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-tree/' },
      ],
    },
    notes: 'First problem solved with BFS queue in 35 mins.',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-project-today',
    date: getFormattedToday(),
    category: 'project',
    title: '1 Focused Hour on Project Development',
    description: 'Implement real-time notification engine & polish user profile UI.',
    status: 'pending',
    targetCount: 60,
    currentCount: 20,
    timeSpentMinutes: 20,
    details: {
      projectFocus: 'Focus Fox / Persona Placement System',
      gitLinkOrSummary: 'feature/placement-prep branch',
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-apps-today',
    date: getFormattedToday(),
    category: 'applications',
    title: 'Daily Job Applications (Target: 10)',
    description: 'Apply to 10 verified software engineering openings.',
    status: 'partially_completed',
    targetCount: 10,
    currentCount: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'task-referrals-weekly',
    date: getFormattedToday(),
    category: 'referrals',
    title: 'Weekly Referral Outreach (Goal: 5–7)',
    description: 'Reach out to 2 new alumni/recruiters today toward your weekly goal.',
    status: 'partially_completed',
    targetCount: 7,
    currentCount: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
