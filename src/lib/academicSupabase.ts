import { supabase } from './supabase';
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
} from '../types/academic';
import { INITIAL_SEMESTER_5, INITIAL_SEMESTER_5_SUBJECTS, DEFAULT_ACADEMIC_SETTINGS } from '../data/academicInitialData';

// ==============================================================================
// Serialization Mappers
// ==============================================================================

export const mapSemesterToRow = (sem: AcademicSemester, userId: string) => ({
  id: sem.id,
  user_id: userId,
  semester_number: sem.semesterNumber,
  title: sem.title,
  start_date: sem.startDate || null,
  end_date: sem.endDate || null,
  target_gpa: sem.targetGpa || null,
  is_active: sem.isActive,
  updated_at: new Date().toISOString(),
});

export const mapRowToSemester = (row: any): AcademicSemester => ({
  id: row.id,
  userId: row.user_id,
  semesterNumber: row.semester_number,
  title: row.title,
  startDate: row.start_date || undefined,
  endDate: row.end_date || undefined,
  targetGpa: row.target_gpa ? Number(row.target_gpa) : undefined,
  isActive: row.is_active ?? true,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapSubjectToRow = (sub: AcademicSubject, userId: string) => ({
  id: sub.id,
  user_id: userId,
  semester_id: sub.semesterId,
  code: sub.code,
  name: sub.name,
  credits: sub.credits,
  description: sub.description || null,
  color: sub.color,
  exam_date: sub.examDate || null,
  target_score: sub.targetScore || null,
  syllabus_url: sub.syllabusUrl || null,
  is_archived: sub.isArchived,
  order_index: sub.orderIndex,
  updated_at: new Date().toISOString(),
});

export const mapRowToSubject = (row: any, units: AcademicUnit[] = []): AcademicSubject => ({
  id: row.id,
  userId: row.user_id,
  semesterId: row.semester_id,
  code: row.code,
  name: row.name,
  credits: Number(row.credits) || 4,
  description: row.description || '',
  color: row.color || '#8b5cf6',
  examDate: row.exam_date || undefined,
  targetScore: row.target_score ? Number(row.target_score) : undefined,
  syllabusUrl: row.syllabus_url || undefined,
  isArchived: row.is_archived || false,
  orderIndex: row.order_index || 0,
  units,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapUnitToRow = (unit: AcademicUnit, userId: string) => ({
  id: unit.id,
  user_id: userId,
  subject_id: unit.subjectId,
  unit_number: unit.unitNumber,
  title: unit.title,
  description: unit.description || null,
  weightage_percentage: unit.weightagePercentage || null,
  order_index: unit.orderIndex,
  updated_at: new Date().toISOString(),
});

export const mapRowToUnit = (row: any, topics: AcademicTopic[] = []): AcademicUnit => ({
  id: row.id,
  subjectId: row.subject_id,
  unitNumber: row.unit_number,
  title: row.title,
  description: row.description || '',
  weightagePercentage: row.weightage_percentage ? Number(row.weightage_percentage) : undefined,
  orderIndex: row.order_index || 0,
  topics,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapTopicToRow = (topic: AcademicTopic, userId: string) => ({
  id: topic.id,
  user_id: userId,
  unit_id: topic.unitId,
  subject_id: topic.subjectId,
  title: topic.title,
  description: topic.description || null,
  is_completed: topic.isCompleted,
  completed_at: topic.completedAt || null,
  difficulty: topic.difficulty,
  estimated_minutes: topic.estimatedMinutes,
  order_index: topic.orderIndex,
  notes: topic.notes || null,
  updated_at: new Date().toISOString(),
});

export const mapRowToTopic = (row: any): AcademicTopic => ({
  id: row.id,
  unitId: row.unit_id,
  subjectId: row.subject_id,
  title: row.title,
  description: row.description || '',
  isCompleted: row.is_completed || false,
  completedAt: row.completed_at || undefined,
  difficulty: row.difficulty || 'Medium',
  estimatedMinutes: row.estimated_minutes || 45,
  orderIndex: row.order_index || 0,
  notes: row.notes || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapTaskToRow = (task: AcademicTask, userId: string) => ({
  id: task.id,
  user_id: userId,
  subject_id: task.subjectId,
  unit_id: task.unitId || null,
  topic_id: task.topicId || null,
  title: task.title,
  description: task.description || null,
  scheduled_date: task.scheduledDate,
  planned_duration_minutes: task.plannedDurationMinutes,
  actual_time_minutes: task.actualTimeMinutes,
  priority: task.priority,
  status: task.status,
  completion_timestamp: task.completionTimestamp || null,
  notes: task.notes || null,
  needs_revision: task.needsRevision,
  skip_reason: task.skipReason || null,
  reschedule_count: task.rescheduleCount || 0,
  updated_at: new Date().toISOString(),
});

export const mapRowToTask = (row: any): AcademicTask => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  unitId: row.unit_id || undefined,
  topicId: row.topic_id || undefined,
  title: row.title,
  description: row.description || '',
  scheduledDate: row.scheduled_date,
  plannedDurationMinutes: row.planned_duration_minutes || 60,
  actualTimeMinutes: row.actual_time_minutes || 0,
  priority: row.priority || 'Medium',
  status: row.status || 'pending',
  completionTimestamp: row.completion_timestamp || undefined,
  notes: row.notes || '',
  needsRevision: row.needs_revision || false,
  skipReason: row.skip_reason || undefined,
  rescheduleCount: row.reschedule_count || 0,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapAssignmentToRow = (a: AcademicAssignment, userId: string) => ({
  id: a.id,
  user_id: userId,
  subject_id: a.subjectId,
  title: a.title,
  description: a.description || null,
  assigned_date: a.assignedDate || null,
  due_date: a.dueDate,
  priority: a.priority,
  status: a.status,
  resource_url: a.resourceUrl || null,
  submission_notes: a.submissionNotes || null,
  max_marks: a.maxMarks || null,
  obtained_marks: a.obtainedMarks || null,
  completion_timestamp: a.completionTimestamp || null,
  updated_at: new Date().toISOString(),
});

export const mapRowToAssignment = (row: any): AcademicAssignment => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  title: row.title,
  description: row.description || '',
  assignedDate: row.assigned_date || undefined,
  dueDate: row.due_date,
  priority: row.priority || 'Medium',
  status: row.status || 'pending',
  resourceUrl: row.resource_url || '',
  submissionNotes: row.submission_notes || '',
  maxMarks: row.max_marks ? Number(row.max_marks) : undefined,
  obtainedMarks: row.obtained_marks ? Number(row.obtained_marks) : undefined,
  completionTimestamp: row.completion_timestamp || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapExamToRow = (e: AcademicExam, userId: string) => ({
  id: e.id,
  user_id: userId,
  subject_id: e.subjectId,
  title: e.title,
  exam_date: e.examDate,
  exam_time: e.examTime,
  exam_type: e.examType,
  syllabus_coverage: e.syllabusCoverage || null,
  preparation_status: e.preparationStatus,
  target_score: e.targetScore,
  weightage_percentage: e.weightagePercentage || null,
  notes: e.notes || null,
  updated_at: new Date().toISOString(),
});

export const mapRowToExam = (row: any): AcademicExam => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  title: row.title,
  examDate: row.exam_date,
  examTime: row.exam_time || '10:00',
  examType: row.exam_type || 'Mid-Semester',
  syllabusCoverage: row.syllabus_coverage || '',
  preparationStatus: row.preparation_status || 'Not Started',
  targetScore: Number(row.target_score) || 85,
  weightagePercentage: row.weightage_percentage ? Number(row.weightage_percentage) : undefined,
  notes: row.notes || '',
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapNoteToRow = (n: AcademicNote, userId: string) => ({
  id: n.id,
  user_id: userId,
  subject_id: n.subjectId,
  unit_id: n.unitId || null,
  topic_id: n.topicId || null,
  title: n.title,
  content: n.content,
  tags: n.tags || [],
  resource_url: n.resourceUrl || null,
  is_pinned: n.isPinned || false,
  updated_at: new Date().toISOString(),
});

export const mapRowToNote = (row: any): AcademicNote => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  unitId: row.unit_id || undefined,
  topicId: row.topic_id || undefined,
  title: row.title,
  content: row.content || '',
  tags: row.tags || [],
  resourceUrl: row.resource_url || '',
  isPinned: row.is_pinned || false,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapResourceToRow = (r: AcademicResource, userId: string) => ({
  id: r.id,
  user_id: userId,
  subject_id: r.subjectId,
  title: r.title,
  resource_type: r.resourceType,
  url: r.url,
  description: r.description || null,
  tags: r.tags || [],
  updated_at: new Date().toISOString(),
});

export const mapRowToResource = (row: any): AcademicResource => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  title: row.title,
  resourceType: row.resource_type || 'Lecture Slides',
  url: row.url,
  description: row.description || '',
  tags: row.tags || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapRevisionToRow = (rev: AcademicRevision, userId: string) => ({
  id: rev.id,
  user_id: userId,
  subject_id: rev.subjectId,
  topic_id: rev.topicId || null,
  title: rev.title,
  last_studied_date: rev.lastStudiedDate,
  last_revision_date: rev.lastRevisionDate || null,
  scheduled_date: rev.scheduledDate,
  stage: rev.stage,
  confidence_rating: rev.confidenceRating,
  last_outcome: rev.lastOutcome || null,
  history: rev.history || [],
  updated_at: new Date().toISOString(),
});

export const mapRowToRevision = (row: any): AcademicRevision => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  topicId: row.topic_id || undefined,
  title: row.title,
  lastStudiedDate: row.last_studied_date,
  lastRevisionDate: row.last_revision_date || undefined,
  scheduledDate: row.scheduled_date,
  stage: row.stage || 0,
  confidenceRating: row.confidence_rating || 3,
  lastOutcome: row.last_outcome || undefined,
  history: row.history || [],
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapAttendanceToRow = (att: AcademicAttendanceRecord, userId: string) => ({
  id: att.id,
  user_id: userId,
  subject_id: att.subjectId,
  class_date: att.classDate,
  class_type: att.classType,
  status: att.status,
  notes: att.notes || null,
});

export const mapRowToAttendance = (row: any): AcademicAttendanceRecord => ({
  id: row.id,
  userId: row.user_id,
  subjectId: row.subject_id,
  classDate: row.class_date,
  classType: row.class_type || 'Lecture',
  status: row.status || 'present',
  notes: row.notes || '',
  createdAt: row.created_at,
});

// ==============================================================================
// Cloud CRUD Functions
// ==============================================================================

export const fetchAllAcademicDataFromCloud = async (userId: string) => {
  if (!supabase) return null;

  try {
    const [
      semRes,
      subRes,
      unitRes,
      topicRes,
      taskRes,
      sessionRes,
      assignRes,
      examRes,
      noteRes,
      resRes,
      revRes,
      attRes,
      setRes,
    ] = await Promise.all([
      supabase.from('academic_semesters').select('*').eq('user_id', userId),
      supabase.from('academic_subjects').select('*').eq('user_id', userId).order('order_index'),
      supabase.from('academic_units').select('*').eq('user_id', userId).order('order_index'),
      supabase.from('academic_topics').select('*').eq('user_id', userId).order('order_index'),
      supabase.from('academic_tasks').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('academic_study_sessions').select('*').eq('user_id', userId).order('date', { ascending: false }),
      supabase.from('academic_assignments').select('*').eq('user_id', userId).order('due_date'),
      supabase.from('academic_exams').select('*').eq('user_id', userId).order('exam_date'),
      supabase.from('academic_notes').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('academic_resources').select('*').eq('user_id', userId).order('created_at', { ascending: false }),
      supabase.from('academic_revisions').select('*').eq('user_id', userId).order('scheduled_date'),
      supabase.from('academic_attendance').select('*').eq('user_id', userId).order('class_date', { ascending: false }),
      supabase.from('academic_settings').select('*').eq('user_id', userId).single(),
    ]);

    // Build hierarchical subjects -> units -> topics
    const topicsByUnit: Record<string, AcademicTopic[]> = {};
    (topicRes.data || []).forEach((row) => {
      const top = mapRowToTopic(row);
      if (!topicsByUnit[top.unitId]) topicsByUnit[top.unitId] = [];
      topicsByUnit[top.unitId].push(top);
    });

    const unitsBySubject: Record<string, AcademicUnit[]> = {};
    (unitRes.data || []).forEach((row) => {
      const u = mapRowToUnit(row, topicsByUnit[row.id] || []);
      if (!unitsBySubject[u.subjectId]) unitsBySubject[u.subjectId] = [];
      unitsBySubject[u.subjectId].push(u);
    });

    const subjects = (subRes.data || []).map((row) => mapRowToSubject(row, unitsBySubject[row.id] || []));

    return {
      semesters: (semRes.data || []).map(mapRowToSemester),
      subjects,
      tasks: (taskRes.data || []).map(mapRowToTask),
      studySessions: sessionRes.data || [],
      assignments: (assignRes.data || []).map(mapRowToAssignment),
      exams: (examRes.data || []).map(mapRowToExam),
      notes: (noteRes.data || []).map(mapRowToNote),
      resources: (resRes.data || []).map(mapRowToResource),
      revisions: (revRes.data || []).map(mapRowToRevision),
      attendance: (attRes.data || []).map(mapRowToAttendance),
      settings: setRes.data ? {
        userId: setRes.data.user_id,
        semesterId: setRes.data.semester_id,
        minimumAttendanceThreshold: setRes.data.minimum_attendance_threshold || 75,
        dailyStudyTargetMinutes: setRes.data.daily_study_target_minutes || 180,
        revisionIntervals: setRes.data.revision_intervals || [1, 3, 7, 14, 30],
        remindersEnabled: setRes.data.reminders_enabled ?? true,
        quietHoursStart: setRes.data.quiet_hours_start,
        quietHoursEnd: setRes.data.quiet_hours_end,
        updatedAt: setRes.data.updated_at,
      } : null,
    };
  } catch (error) {
    console.error('Error fetching academic data from Supabase:', error);
    return null;
  }
};

export const fetchFullAcademicData = fetchAllAcademicDataFromCloud;

// Idempotent Seeding for Semester 5
export const ensureSemester5SeededInCloud = async (userId: string) => {
  if (!supabase) return;

  try {
    // Check if user has subjects
    const { count } = await supabase
      .from('academic_subjects')
      .select('id', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (count === 0) {
      // 1. Seed Semester 5
      const semId = `${userId}_sem_5`;
      await supabase.from('academic_semesters').upsert({
        id: semId,
        user_id: userId,
        semester_number: 5,
        title: 'Semester 5 — Academic Sprint',
        is_active: true,
      });

      // 2. Seed the 6 subjects
      for (const sub of INITIAL_SEMESTER_5_SUBJECTS) {
        await supabase.from('academic_subjects').upsert({
          id: `${userId}_${sub.id}`,
          user_id: userId,
          semester_id: semId,
          code: sub.code,
          name: sub.name,
          credits: sub.credits,
          description: sub.description,
          color: sub.color,
          target_score: sub.targetScore,
          order_index: sub.orderIndex,
        });
      }

      // 3. Seed Settings
      await supabase.from('academic_settings').upsert({
        user_id: userId,
        semester_id: semId,
        minimum_attendance_threshold: 75,
        daily_study_target_minutes: 180,
        reminders_enabled: true,
      });
    }
  } catch (err) {
    console.error('Failed to run idempotent Semester 5 seed in Supabase:', err);
  }
};

// Single Item Sync Functions
export const syncSubjectToCloud = async (sub: AcademicSubject, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_subjects').upsert(mapSubjectToRow(sub, userId));
  } catch (err) {
    console.error('Failed to sync subject to Supabase:', err);
  }
};

export const deleteSubjectFromCloud = async (subjectId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_subjects').delete().eq('id', subjectId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete subject from Supabase:', err);
  }
};

export const syncUnitToCloud = async (unit: AcademicUnit, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_units').upsert(mapUnitToRow(unit, userId));
  } catch (err) {
    console.error('Failed to sync unit to Supabase:', err);
  }
};

export const deleteUnitFromCloud = async (unitId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_units').delete().eq('id', unitId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete unit from Supabase:', err);
  }
};

export const syncTopicToCloud = async (topic: AcademicTopic, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_topics').upsert(mapTopicToRow(topic, userId));
  } catch (err) {
    console.error('Failed to sync topic to Supabase:', err);
  }
};

export const deleteTopicFromCloud = async (topicId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_topics').delete().eq('id', topicId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete topic from Supabase:', err);
  }
};

export const syncTaskToCloud = async (task: AcademicTask, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_tasks').upsert(mapTaskToRow(task, userId));
  } catch (err) {
    console.error('Failed to sync task to Supabase:', err);
  }
};

export const deleteTaskFromCloud = async (taskId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_tasks').delete().eq('id', taskId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete task from Supabase:', err);
  }
};

export const syncAssignmentToCloud = async (a: AcademicAssignment, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_assignments').upsert(mapAssignmentToRow(a, userId));
  } catch (err) {
    console.error('Failed to sync assignment to Supabase:', err);
  }
};

export const deleteAssignmentFromCloud = async (assignmentId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_assignments').delete().eq('id', assignmentId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete assignment from Supabase:', err);
  }
};

export const syncExamToCloud = async (exam: AcademicExam, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_exams').upsert(mapExamToRow(exam, userId));
  } catch (err) {
    console.error('Failed to sync exam to Supabase:', err);
  }
};

export const deleteExamFromCloud = async (examId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_exams').delete().eq('id', examId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete exam from Supabase:', err);
  }
};

export const syncNoteToCloud = async (note: AcademicNote, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_notes').upsert(mapNoteToRow(note, userId));
  } catch (err) {
    console.error('Failed to sync note to Supabase:', err);
  }
};

export const deleteNoteFromCloud = async (noteId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_notes').delete().eq('id', noteId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete note from Supabase:', err);
  }
};

export const syncResourceToCloud = async (res: AcademicResource, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_resources').upsert(mapResourceToRow(res, userId));
  } catch (err) {
    console.error('Failed to sync resource to Supabase:', err);
  }
};

export const deleteResourceFromCloud = async (resId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_resources').delete().eq('id', resId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete resource from Supabase:', err);
  }
};

export const syncRevisionToCloud = async (rev: AcademicRevision, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_revisions').upsert(mapRevisionToRow(rev, userId));
  } catch (err) {
    console.error('Failed to sync revision to Supabase:', err);
  }
};

export const deleteRevisionFromCloud = async (revId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_revisions').delete().eq('id', revId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete revision from Supabase:', err);
  }
};

export const syncAttendanceToCloud = async (att: AcademicAttendanceRecord, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_attendance').upsert(mapAttendanceToRow(att, userId));
  } catch (err) {
    console.error('Failed to sync attendance to Supabase:', err);
  }
};

export const deleteAttendanceFromCloud = async (attId: string, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_attendance').delete().eq('id', attId).eq('user_id', userId);
  } catch (err) {
    console.error('Failed to delete attendance from Supabase:', err);
  }
};

export const syncAcademicSettingsToCloud = async (settings: AcademicSettings, userId: string) => {
  if (!supabase) return;
  try {
    await supabase.from('academic_settings').upsert({
      user_id: userId,
      semester_id: settings.semesterId,
      minimum_attendance_threshold: settings.minimumAttendanceThreshold,
      daily_study_target_minutes: settings.dailyStudyTargetMinutes,
      revision_intervals: settings.revisionIntervals,
      reminders_enabled: settings.remindersEnabled,
      quiet_hours_start: settings.quietHoursStart,
      quiet_hours_end: settings.quietHoursEnd,
      updated_at: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Failed to sync academic settings to Supabase:', err);
  }
};
