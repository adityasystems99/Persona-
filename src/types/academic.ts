export type AcademicPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type AcademicTaskStatus = 'pending' | 'in_progress' | 'completed' | 'skipped';

export type AssignmentStatus = 'pending' | 'in_progress' | 'completed' | 'submitted' | 'graded';

export type ExamType = 'Mid-Semester' | 'End-Semester' | 'Quiz' | 'Lab Exam' | 'Class Test';

export type ExamPrepStatus = 'Not Started' | 'In Progress' | 'Ready' | 'Mastered';

export type ResourceType =
  | 'Book / Textbook'
  | 'Lecture Slides'
  | 'Video Lecture'
  | 'PYQ / Papers'
  | 'Cheat Sheet'
  | 'Website';

export type AttendanceStatus = 'present' | 'absent' | 'excused';

export type ClassType = 'Lecture' | 'Lab' | 'Tutorial';

export type RevisionOutcome = 'strong' | 'partial' | 'poor';

export interface AcademicSemester {
  id: string;
  userId?: string;
  semesterNumber: number;
  title: string;
  startDate?: string;
  endDate?: string;
  targetGpa?: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicTopic {
  id: string;
  unitId: string;
  subjectId: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  completedAt?: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedMinutes: number;
  orderIndex: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicUnit {
  id: string;
  subjectId: string;
  unitNumber: number;
  title: string;
  description?: string;
  weightagePercentage?: number;
  orderIndex: number;
  topics: AcademicTopic[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicSubject {
  id: string;
  userId?: string;
  semesterId: string;
  code: string;
  name: string;
  credits: number;
  description?: string;
  color: string;
  examDate?: string;
  targetScore?: number;
  syllabusUrl?: string;
  isArchived: boolean;
  orderIndex: number;
  units: AcademicUnit[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicTask {
  id: string;
  userId?: string;
  subjectId: string;
  unitId?: string;
  topicId?: string;
  title: string;
  description?: string;
  scheduledDate: string; // YYYY-MM-DD
  plannedDurationMinutes: number;
  actualTimeMinutes: number;
  priority: AcademicPriority;
  status: AcademicTaskStatus;
  completionTimestamp?: string;
  notes?: string;
  needsRevision: boolean;
  skipReason?: string;
  rescheduleCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicStudySession {
  id: string;
  userId?: string;
  subjectId: string;
  taskId?: string;
  date: string; // YYYY-MM-DD
  durationMinutes: number;
  notes?: string;
  focusScore?: number; // 1-100
  createdAt: string;
}

export interface AcademicAssignment {
  id: string;
  userId?: string;
  subjectId: string;
  title: string;
  description?: string;
  assignedDate?: string;
  dueDate: string; // YYYY-MM-DD
  priority: AcademicPriority;
  status: AssignmentStatus;
  resourceUrl?: string;
  submissionNotes?: string;
  maxMarks?: number;
  obtainedMarks?: number;
  completionTimestamp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicExam {
  id: string;
  userId?: string;
  subjectId: string;
  title: string;
  examDate: string; // YYYY-MM-DD
  examTime: string; // HH:MM
  examType: ExamType;
  syllabusCoverage?: string;
  preparationStatus: ExamPrepStatus;
  targetScore: number;
  weightagePercentage?: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicNote {
  id: string;
  userId?: string;
  subjectId: string;
  unitId?: string;
  topicId?: string;
  title: string;
  content: string;
  tags: string[];
  resourceUrl?: string;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AcademicResource {
  id: string;
  userId?: string;
  subjectId: string;
  title: string;
  resourceType: ResourceType;
  url: string;
  description?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicRevisionHistoryItem {
  id: string;
  date: string;
  outcome: RevisionOutcome;
  confidence: number;
  notes?: string;
}

export interface AcademicRevision {
  id: string;
  userId?: string;
  subjectId: string;
  topicId?: string;
  title: string;
  lastStudiedDate: string;
  lastRevisionDate?: string;
  scheduledDate: string; // YYYY-MM-DD
  stage: number; // 0=1d, 1=3d, 2=7d, 3=14d, 4=30d
  confidenceRating: number; // 1-5
  lastOutcome?: RevisionOutcome;
  history: AcademicRevisionHistoryItem[];
  createdAt: string;
  updatedAt: string;
}

export interface AcademicAttendanceRecord {
  id: string;
  userId?: string;
  subjectId: string;
  classDate: string; // YYYY-MM-DD
  classType: ClassType;
  status: AttendanceStatus;
  notes?: string;
  createdAt: string;
}

export interface AcademicSettings {
  userId?: string;
  semesterId: string;
  minimumAttendanceThreshold: number; // default 75
  dailyStudyTargetMinutes: number; // default 180 (3 hrs)
  revisionIntervals: number[]; // [1, 3, 7, 14, 30]
  remindersEnabled: boolean;
  quietHoursStart?: string;
  quietHoursEnd?: string;
  updatedAt: string;
}

export interface AcademicNotification {
  id: string;
  userId?: string;
  type:
    | 'task_due'
    | 'assignment_deadline'
    | 'exam_approaching'
    | 'attendance_alert'
    | 'revision_due'
    | 'general';
  title: string;
  message: string;
  readAt?: string;
  relatedId?: string;
  createdAt: string;
}

export type AcademicTab =
  | 'dashboard'
  | 'subjects'
  | 'subject-detail'
  | 'planner'
  | 'deadlines'
  | 'notes'
  | 'revision'
  | 'attendance'
  | 'analytics'
  | 'settings';
