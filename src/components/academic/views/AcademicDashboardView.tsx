import React from 'react';
import {
  BookOpen,
  CalendarCheck2,
  Clock,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  FileText,
  Target,
  ArrowRight,
  Plus,
  Sparkles,
  BarChart3,
  Calendar,
  Layers,
  Percent,
} from 'lucide-react';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';
import { AcademicTab } from '../../../types/academic';

interface AcademicDashboardViewProps {
  onOpenAddTask: () => void;
  onOpenAddSubject: () => void;
  onOpenLogAttendance: (subjectId?: string) => void;
  onOpenAddNote: () => void;
  onSelectSubject: (subjectId: string) => void;
  onNavigateTab: (tab: AcademicTab) => void;
}

export const AcademicDashboardView: React.FC<AcademicDashboardViewProps> = ({
  onOpenAddTask,
  onOpenAddSubject,
  onOpenLogAttendance,
  onOpenAddNote,
  onSelectSubject,
  onNavigateTab,
}) => {
  const {
    subjects,
    tasks,
    todayTasks,
    todayCompletedTasksCount,
    overdueTasks,
    upcomingAssignments,
    overdueAssignments,
    upcomingExams,
    revisionsDueToday,
    subjectAttendanceStats,
    semesterCompletionPercentage,
    totalTopicsCount,
    completedTopicsCount,
    toggleTaskComplete,
    isCloudConnected,
    lastSyncTime,
  } = useAcademic();

  const activeSubjects = subjects.filter((s) => !s.isArchived);
  const lowAttendanceSubjects = Object.values(subjectAttendanceStats).filter(
    (st) => st.isBelowThreshold
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Banner & Quick Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-950/60 via-[#0f1128] to-indigo-950/40 border border-violet-500/20 p-6 md:p-8 backdrop-blur-xl shadow-2xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-56 h-56 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-xs font-mono uppercase tracking-wider">
              <Sparkles size={12} className="text-violet-400" />
              Semester 5 Engineering Sprint
              {isCloudConnected && (
                <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-1" title="Connected to Supabase" />
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Academic Intelligence Hub
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              Real-time telemetry across your 6 core engineering subjects. Track dynamic syllabus completion, daily planner tasks, exam countdowns, and spaced recall.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenAddTask}
              className="px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Study Task</span>
            </button>
            <button
              onClick={() => onOpenLogAttendance()}
              className="px-3.5 py-2.5 rounded-xl bg-[#090a16] hover:bg-violet-950/40 border border-violet-500/20 text-slate-300 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <Calendar size={15} className="text-violet-400" />
              <span>Log Class</span>
            </button>
            <button
              onClick={onOpenAddSubject}
              className="px-3.5 py-2.5 rounded-xl bg-[#090a16] hover:bg-violet-950/40 border border-violet-500/20 text-slate-300 text-sm font-medium transition-colors flex items-center gap-2"
            >
              <BookOpen size={15} className="text-violet-400" />
              <span>New Subject</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overdue Task Alert Banner */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-between text-rose-300 text-sm animate-pulse">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-rose-400 flex-shrink-0" />
            <span>
              <strong>{overdueTasks.length} Overdue Academic Task{overdueTasks.length > 1 ? 's' : ''}:</strong> Unfinished work from previous study days.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('planner')}
            className="text-xs font-bold text-rose-400 hover:text-white underline underline-offset-4 flex items-center gap-1"
          >
            Review & Reschedule <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Low Attendance Alert */}
      {lowAttendanceSubjects.length > 0 && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between text-amber-300 text-sm">
          <div className="flex items-center gap-3">
            <AlertTriangle size={20} className="text-amber-400 flex-shrink-0" />
            <span>
              <strong>Attendance Warning:</strong> {lowAttendanceSubjects.length} subject(s) currently below the 75% minimum threshold.
            </span>
          </div>
          <button
            onClick={() => onNavigateTab('attendance')}
            className="text-xs font-bold text-amber-400 hover:text-white underline underline-offset-4 flex items-center gap-1"
          >
            View Attendance Radar <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Core Telemetry Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Semester Syllabus Progress */}
        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 font-mono">
              Syllabus Coverage
            </span>
            <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400">
              <Layers size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {semesterCompletionPercentage}%
            </span>
            <span className="text-xs text-slate-400">
              ({completedTopicsCount}/{totalTopicsCount} topics)
            </span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-violet-500 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, semesterCompletionPercentage)}%` }}
            />
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 font-mono">
              Today's Plan
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-600/20 flex items-center justify-center text-emerald-400">
              <CalendarCheck2 size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {todayCompletedTasksCount}/{todayTasks.length}
            </span>
            <span className="text-xs text-slate-400">tasks done</span>
          </div>
          <div className="mt-3 w-full bg-slate-800/80 rounded-full h-1.5 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{
                width: `${todayTasks.length > 0 ? (todayCompletedTasksCount / todayTasks.length) * 100 : 0}%`,
              }}
            />
          </div>
        </div>

        {/* Due Deadlines */}
        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 font-mono">
              Upcoming Deadlines
            </span>
            <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {upcomingAssignments.length + upcomingExams.length}
            </span>
            <span className="text-xs text-slate-400">assignments & exams</span>
          </div>
          <p className="mt-2 text-xs text-slate-400 truncate">
            {upcomingExams[0]
              ? `Next exam: ${upcomingExams[0].title}`
              : upcomingAssignments[0]
              ? `Due next: ${upcomingAssignments[0].title}`
              : 'No imminent deadlines'}
          </p>
        </div>

        {/* Spaced Revisions Due */}
        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 relative overflow-hidden group hover:border-violet-500/40 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase text-slate-400 font-mono">
              Revisions Due
            </span>
            <div className="w-8 h-8 rounded-lg bg-pink-600/20 flex items-center justify-center text-pink-400">
              <RotateCcw size={16} />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {revisionsDueToday.length}
            </span>
            <span className="text-xs text-slate-400">topics to review</span>
          </div>
          <p className="mt-2 text-xs text-slate-400">
            {revisionsDueToday.length > 0
              ? 'Spaced repetition queue active'
              : 'All revisions up to date!'}
          </p>
        </div>
      </div>

      {/* Semester 5 Subject Matrix */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen size={18} className="text-violet-400" />
              Semester 5 Subjects ({activeSubjects.length})
            </h2>
            <p className="text-xs text-slate-400">
              Dynamic courses loaded from Supabase live schema
            </p>
          </div>
          <button
            onClick={() => onNavigateTab('subjects')}
            className="text-xs text-violet-400 hover:text-violet-300 font-semibold flex items-center gap-1"
          >
            Manage Subjects <ArrowRight size={14} />
          </button>
        </div>

        {activeSubjects.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/30 text-center space-y-3">
            <BookOpen size={32} className="mx-auto text-violet-400 opacity-60" />
            <h3 className="text-base font-bold text-white">No Subjects Configured</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Add your 5th semester engineering subjects to start tracking topics, notes, and attendance.
            </p>
            <button
              onClick={onOpenAddSubject}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
            >
              Add First Subject
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeSubjects.map((sub) => {
              // Calculate topic progress for this subject
              let totalTopics = 0;
              let completedTopics = 0;
              sub.units.forEach((u) => {
                u.topics.forEach((t) => {
                  totalTopics++;
                  if (t.isCompleted) completedTopics++;
                });
              });
              const subjectProgress =
                totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
              const attStat = subjectAttendanceStats[sub.id];

              return (
                <div
                  key={sub.id}
                  onClick={() => onSelectSubject(sub.id)}
                  className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 hover:border-violet-500/50 cursor-pointer transition-all hover:-translate-y-0.5 group shadow-lg flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span
                        className="px-2.5 py-1 rounded-md text-xs font-bold font-mono text-white"
                        style={{ backgroundColor: sub.color || '#8b5cf6' }}
                      >
                        {sub.code}
                      </span>
                      <div className="flex items-center gap-2">
                        {attStat && attStat.totalClasses > 0 && (
                          <span
                            className={`text-[11px] font-mono px-2 py-0.5 rounded-full border ${
                              attStat.isBelowThreshold
                                ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                                : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                            }`}
                          >
                            Att: {attStat.percentage}%
                          </span>
                        )}
                        <span className="text-xs text-slate-400 font-mono">
                          {sub.credits} cr
                        </span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-violet-300 transition-colors line-clamp-1">
                      {sub.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px]">
                      {sub.description || 'No description provided'}
                    </p>
                  </div>

                  <div className="mt-4 pt-4 border-t border-violet-900/30">
                    <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-mono">
                      <span>Syllabus Progress</span>
                      <span>
                        {completedTopics}/{totalTopics} ({subjectProgress}%)
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${subjectProgress}%`,
                          backgroundColor: sub.color || '#8b5cf6',
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Split Grid: Today's Tasks & Deadlines / Revisions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Today's Planner Queue */}
        <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <CalendarCheck2 size={18} className="text-emerald-400" />
              <h2 className="text-base font-bold text-white">Today's Academic Work</h2>
            </div>
            <button
              onClick={onOpenAddTask}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              <Plus size={14} /> Add Task
            </button>
          </div>

          {todayTasks.length === 0 ? (
            <div className="py-8 text-center space-y-2 text-slate-400 border border-dashed border-violet-900/40 rounded-xl">
              <CalendarCheck2 size={24} className="mx-auto opacity-40 text-violet-400" />
              <p className="text-xs">No study tasks scheduled for today.</p>
              <button
                onClick={onOpenAddTask}
                className="text-xs text-violet-400 hover:underline font-semibold"
              >
                Schedule today's reading or practice
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {todayTasks.map((t) => {
                const sub = subjects.find((s) => s.id === t.subjectId);
                const isDone = t.status === 'completed';

                return (
                  <div
                    key={t.id}
                    className={`p-3.5 rounded-xl border flex items-center justify-between transition-all ${
                      isDone
                        ? 'bg-slate-900/40 border-slate-800/60 opacity-60'
                        : 'bg-[#090a16] border-violet-500/20 hover:border-violet-500/40'
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <button
                        onClick={() => toggleTaskComplete(t.id)}
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-colors flex-shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-500 text-black'
                            : 'border-slate-600 hover:border-emerald-400 text-transparent'
                        }`}
                      >
                        <CheckCircle2 size={14} className={isDone ? 'text-black' : ''} />
                      </button>
                      <div className="min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isDone ? 'line-through text-slate-400' : 'text-slate-100'
                          }`}
                        >
                          {t.title}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400 font-mono">
                          {sub && (
                            <span
                              className="px-1.5 py-0.2 rounded text-[10px] text-white"
                              style={{ backgroundColor: sub.color }}
                            >
                              {sub.code}
                            </span>
                          )}
                          <span>{t.plannedDurationMinutes}m</span>
                          <span>•</span>
                          <span
                            className={
                              t.priority === 'Urgent'
                                ? 'text-rose-400 font-bold'
                                : t.priority === 'High'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }
                          >
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Deadlines & Revisions Queue */}
        <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Clock size={18} className="text-indigo-400" />
              <h2 className="text-base font-bold text-white">Upcoming Deadlines & Tests</h2>
            </div>
            <button
              onClick={() => onNavigateTab('deadlines')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              All Deadlines <ArrowRight size={14} />
            </button>
          </div>

          {upcomingAssignments.length === 0 && upcomingExams.length === 0 ? (
            <div className="py-8 text-center space-y-2 text-slate-400 border border-dashed border-violet-900/40 rounded-xl">
              <Clock size={24} className="mx-auto opacity-40 text-violet-400" />
              <p className="text-xs">No upcoming assignments or exams registered.</p>
              <button
                onClick={() => onNavigateTab('deadlines')}
                className="text-xs text-violet-400 hover:underline font-semibold"
              >
                Log an assignment or test
              </button>
            </div>
          ) : (
            <div className="space-y-2.5">
              {/* Upcoming Exams first */}
              {upcomingExams.slice(0, 2).map((exam) => {
                const sub = subjects.find((s) => s.id === exam.subjectId);
                return (
                  <div
                    key={exam.id}
                    className="p-3.5 rounded-xl bg-violet-950/20 border border-violet-500/30 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-violet-600/20 flex items-center justify-center text-violet-400 flex-shrink-0">
                        <Target size={16} />
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-violet-300 uppercase font-mono">
                            {exam.examType}
                          </span>
                          {sub && (
                            <span className="text-[10px] text-slate-400 font-mono">
                              ({sub.code})
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-semibold text-white truncate">{exam.title}</p>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono text-xs text-violet-300 font-semibold">
                      {exam.examDate}
                    </div>
                  </div>
                );
              })}

              {/* Upcoming Assignments */}
              {upcomingAssignments.slice(0, 3).map((a) => {
                const sub = subjects.find((s) => s.id === a.subjectId);
                return (
                  <div
                    key={a.id}
                    className="p-3.5 rounded-xl bg-[#090a16] border border-violet-500/20 flex items-center justify-between"
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-indigo-600/20 flex items-center justify-center text-indigo-400 flex-shrink-0">
                        <FileText size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-white truncate">{a.title}</p>
                        <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                          {sub && <span>{sub.code}</span>}
                          <span>•</span>
                          <span
                            className={
                              a.priority === 'Urgent'
                                ? 'text-rose-400 font-bold'
                                : a.priority === 'High'
                                ? 'text-amber-400'
                                : 'text-slate-400'
                            }
                          >
                            {a.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0 font-mono text-xs text-slate-300">
                      Due: {a.dueDate}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
