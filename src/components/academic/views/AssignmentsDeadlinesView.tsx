import React, { useState } from 'react';
import {
  FileText,
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  Edit2,
  Trash2,
  Award,
} from 'lucide-react';
import { AcademicAssignment, AcademicExam, AssignmentStatus } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AssignmentsDeadlinesViewProps {
  onOpenAddAssignment: () => void;
  onOpenEditAssignment: (a: AcademicAssignment) => void;
  onOpenAddExam: () => void;
  onOpenEditExam: (exam: AcademicExam) => void;
}

export const AssignmentsDeadlinesView: React.FC<AssignmentsDeadlinesViewProps> = ({
  onOpenAddAssignment,
  onOpenEditAssignment,
  onOpenAddExam,
  onOpenEditExam,
}) => {
  const {
    assignments,
    exams,
    subjects,
    deleteAssignment,
    deleteExam,
    updateAssignment,
    upcomingAssignments,
    overdueAssignments,
    upcomingExams,
  } = useAcademic();

  const [activeTab, setActiveTab] = useState<'assignments' | 'exams'>('assignments');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const todayStr = getTodayDateStr();

  const filteredAssignments = assignments.filter((a) => {
    if (statusFilter === 'all') return true;
    return a.status === statusFilter;
  });

  const getDaysDiff = (dateStr: string) => {
    const target = new Date(dateStr);
    const today = new Date(todayStr);
    const diff = Math.ceil((target.getTime() - today.getTime()) / (1000 * 3600 * 24));
    return diff;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Clock className="text-indigo-400" size={24} />
            Assignments & Examination Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Submission deadlines, mid-sem exam dates, marks and readiness
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'assignments' ? (
            <button
              onClick={onOpenAddAssignment}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Add Assignment</span>
            </button>
          ) : (
            <button
              onClick={onOpenAddExam}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Schedule Exam</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Switcher & Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-900/30 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('assignments')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'assignments'
                ? 'bg-violet-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white bg-[#0f1128] border border-violet-500/20'
            }`}
          >
            <FileText size={15} />
            <span>Assignments ({assignments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('exams')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'exams'
                ? 'bg-violet-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white bg-[#0f1128] border border-violet-500/20'
            }`}
          >
            <Target size={15} />
            <span>Examinations ({exams.length})</span>
          </button>
        </div>

        {activeTab === 'assignments' && (
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-mono">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
            >
              <option value="all">All ({assignments.length})</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="graded">Graded</option>
            </select>
          </div>
        )}
      </div>

      {/* Tab 1: Assignments */}
      {activeTab === 'assignments' && (
        <div className="space-y-4">
          {filteredAssignments.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
              <FileText size={36} className="mx-auto text-indigo-400 opacity-40" />
              <h3 className="text-base font-bold text-white">No assignments found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Keep track of lab sheets, assignment problems, and deadline submissions.
              </p>
              <button
                onClick={onOpenAddAssignment}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
              >
                Add First Assignment
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredAssignments.map((a) => {
                const sub = subjects.find((s) => s.id === a.subjectId);
                const diffDays = getDaysDiff(a.dueDate);
                const isOverdue = diffDays < 0 && a.status !== 'completed' && a.status !== 'submitted';

                return (
                  <div
                    key={a.id}
                    className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 hover:border-violet-500/40 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        {sub && (
                          <span
                            className="px-2.5 py-0.5 rounded text-xs font-bold font-mono text-white"
                            style={{ backgroundColor: sub.color || '#8b5cf6' }}
                          >
                            {sub.code}
                          </span>
                        )}
                        <span
                          className={`text-xs font-mono font-bold px-2 py-0.5 rounded-full border ${
                            isOverdue
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                              : diffDays === 0
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                              : 'bg-slate-900 text-slate-300 border-slate-700'
                          }`}
                        >
                          {isOverdue
                            ? `Overdue (${Math.abs(diffDays)}d)`
                            : diffDays === 0
                            ? 'Due Today!'
                            : `Due in ${diffDays}d`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white line-clamp-2">{a.title}</h3>
                      {a.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{a.description}</p>
                      )}

                      <div className="flex items-center justify-between text-xs font-mono pt-2 border-t border-violet-900/30 text-slate-400">
                        <span>Due: {a.dueDate}</span>
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

                      {/* Marks display if graded */}
                      {a.maxMarks !== undefined && (
                        <div className="flex items-center justify-between text-xs font-mono bg-[#090a16] p-2 rounded-lg">
                          <span className="text-slate-500">Marks:</span>
                          <span className="text-white font-bold">
                            {a.obtainedMarks !== undefined ? a.obtainedMarks : '—'} / {a.maxMarks}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between">
                      <select
                        value={a.status}
                        onChange={(e) =>
                          updateAssignment(a.id, { status: e.target.value as AssignmentStatus })
                        }
                        className="px-2.5 py-1 bg-[#090a16] border border-violet-500/20 rounded-lg text-xs font-mono text-violet-300 focus:outline-none"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="completed">Completed</option>
                        <option value="submitted">Submitted</option>
                        <option value="graded">Graded</option>
                      </select>

                      <div className="flex items-center space-x-1">
                        {a.resourceUrl && (
                          <a
                            href={a.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => onOpenEditAssignment(a)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteAssignment(a.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Exams */}
      {activeTab === 'exams' && (
        <div className="space-y-4">
          {exams.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
              <Target size={36} className="mx-auto text-violet-400 opacity-40" />
              <h3 className="text-base font-bold text-white">No exams scheduled</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Add mid-semester exams, quizzes, or lab practical tests to compute countdown and syllabus targets.
              </p>
              <button
                onClick={onOpenAddExam}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
              >
                Schedule First Exam
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {exams.map((exam) => {
                const sub = subjects.find((s) => s.id === exam.subjectId);
                const diffDays = getDaysDiff(exam.examDate);

                return (
                  <div
                    key={exam.id}
                    className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 hover:border-violet-500/40 shadow-xl flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded text-[11px] font-bold font-mono bg-violet-600/20 border border-violet-500/30 text-violet-300 uppercase">
                            {exam.examType}
                          </span>
                          {sub && (
                            <span className="text-xs font-mono text-slate-400 font-bold">
                              {sub.code}
                            </span>
                          )}
                        </div>
                        <span
                          className={`text-xs font-mono font-bold px-2.5 py-0.5 rounded-full border ${
                            diffDays < 0
                              ? 'bg-slate-900 text-slate-500 border-slate-800'
                              : diffDays <= 3
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          }`}
                        >
                          {diffDays < 0
                            ? 'Exam Concluded'
                            : diffDays === 0
                            ? 'Today! 🔥'
                            : `${diffDays} days left`}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{exam.title}</h3>

                      <div className="p-3 rounded-xl bg-[#090a16] border border-violet-500/10 space-y-1.5 text-xs font-mono">
                        <div className="flex justify-between text-slate-400">
                          <span>Exam Date & Time:</span>
                          <span className="text-white font-bold">
                            {exam.examDate} @ {exam.examTime}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Target Score:</span>
                          <span className="text-emerald-400 font-bold">{exam.targetScore}%</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>Readiness Status:</span>
                          <span className="text-violet-300 font-bold">
                            {exam.preparationStatus}
                          </span>
                        </div>
                      </div>

                      {exam.syllabusCoverage && (
                        <p className="text-xs text-slate-400">
                          <strong>Coverage:</strong> {exam.syllabusCoverage}
                        </p>
                      )}
                    </div>

                    <div className="pt-3 border-t border-violet-900/30 flex justify-end space-x-2">
                      <button
                        onClick={() => onOpenEditExam(exam)}
                        className="p-1.5 text-slate-400 hover:text-white"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => deleteExam(exam.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
