import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  Plus,
  CheckCircle2,
  Circle,
  Layers,
  Edit2,
  Trash2,
  ChevronDown,
  ChevronRight,
  Calendar,
  FileText,
  Bookmark,
  Target,
  RotateCcw,
  Percent,
  Sparkles,
} from 'lucide-react';
import { AcademicSubject, AcademicUnit, AcademicTopic } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface SubjectDetailViewProps {
  subjectId: string;
  onBack: () => void;
  onOpenAddUnit: (subjectId: string) => void;
  onOpenEditUnit: (unit: AcademicUnit) => void;
  onOpenAddTopic: (subjectId: string, unitId: string) => void;
  onOpenEditTopic: (topic: AcademicTopic) => void;
  onOpenEditSubject: (subject: AcademicSubject) => void;
  onOpenAddTask: (defaultSubjectId: string) => void;
  onOpenAddAssignment: (defaultSubjectId: string) => void;
  onOpenAddNote: (defaultSubjectId: string) => void;
  onOpenAddResource: (defaultSubjectId: string) => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({
  subjectId,
  onBack,
  onOpenAddUnit,
  onOpenEditUnit,
  onOpenAddTopic,
  onOpenEditTopic,
  onOpenEditSubject,
  onOpenAddTask,
  onOpenAddAssignment,
  onOpenAddNote,
  onOpenAddResource,
}) => {
  const {
    subjects,
    toggleTopicComplete,
    deleteTopic,
    deleteUnit,
    assignments,
    notes,
    resources,
    exams,
    subjectAttendanceStats,
    scheduleRevisionForTopic,
  } = useAcademic();

  const [activeSubTab, setActiveSubTab] = useState<
    'syllabus' | 'assignments' | 'notes' | 'resources' | 'exams'
  >('syllabus');

  // Expanded units state
  const [expandedUnits, setExpandedUnits] = useState<Record<string, boolean>>({});

  const subject = subjects.find((s) => s.id === subjectId);

  if (!subject) {
    return (
      <div className="p-8 text-center space-y-4">
        <p className="text-slate-400">Subject not found or was removed.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-violet-600 text-white text-xs font-semibold"
        >
          Return to Subjects
        </button>
      </div>
    );
  }

  // Calculate metrics
  let totalTopics = 0;
  let completedTopics = 0;
  subject.units.forEach((u) => {
    u.topics.forEach((t) => {
      totalTopics++;
      if (t.isCompleted) completedTopics++;
    });
  });
  const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
  const attStat = subjectAttendanceStats[subject.id];

  const subjectAssignments = assignments.filter((a) => a.subjectId === subject.id);
  const subjectNotes = notes.filter((n) => n.subjectId === subject.id);
  const subjectResources = resources.filter((r) => r.subjectId === subject.id);
  const subjectExams = exams.filter((e) => e.subjectId === subject.id);

  const toggleUnitExpand = (unitId: string) => {
    setExpandedUnits((prev) => ({
      ...prev,
      [unitId]: prev[unitId] === undefined ? false : !prev[unitId],
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Navigation & Back Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Subjects</span>
        </button>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onOpenEditSubject(subject)}
            className="px-3 py-1.5 rounded-xl border border-violet-500/20 text-xs font-semibold text-slate-300 hover:text-white hover:bg-violet-950/40 transition-colors flex items-center gap-1.5"
          >
            <Edit2 size={13} />
            <span>Edit Subject</span>
          </button>
        </div>
      </div>

      {/* Subject Hero Header */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#0f1128] border border-violet-500/20 relative overflow-hidden shadow-2xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <span
                className="px-3 py-1 rounded-lg text-sm font-bold font-mono text-white shadow-md"
                style={{ backgroundColor: subject.color || '#8b5cf6' }}
              >
                {subject.code}
              </span>
              <span className="text-xs font-mono text-slate-400 px-2.5 py-1 rounded-full bg-slate-900 border border-slate-800">
                {subject.credits} Academic Credits
              </span>
              {attStat && attStat.totalClasses > 0 && (
                <span
                  className={`text-xs font-mono px-2.5 py-1 rounded-full border ${
                    attStat.isBelowThreshold
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  }`}
                >
                  Attendance: {attStat.percentage}%
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {subject.name}
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              {subject.description || 'No course overview provided. Configure syllabus units below.'}
            </p>
          </div>

          {/* Quick Progress Dial */}
          <div className="p-4 rounded-xl bg-[#090a16] border border-violet-500/20 min-w-[200px] space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Syllabus Completion</span>
              <span className="text-violet-300 font-bold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${progress}%`,
                  backgroundColor: subject.color || '#8b5cf6',
                }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-500 font-mono">
              <span>{completedTopics} Done</span>
              <span>{totalTopics} Total Topics</span>
            </div>
          </div>
        </div>

        {/* Sub-Tabs Nav */}
        <div className="flex items-center gap-2 border-t border-violet-900/30 pt-4 overflow-x-auto">
          {[
            { id: 'syllabus', label: 'Units & Syllabus', count: totalTopics },
            { id: 'assignments', label: 'Assignments', count: subjectAssignments.length },
            { id: 'notes', label: 'Notes & Formulae', count: subjectNotes.length },
            { id: 'resources', label: 'Resources & PYQs', count: subjectResources.length },
            { id: 'exams', label: 'Exams & Quizzes', count: subjectExams.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                activeSubTab === tab.id
                  ? 'bg-violet-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-white hover:bg-violet-950/30'
              }`}
            >
              <span>{tab.label}</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-black/40 text-slate-300">
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: Syllabus Units & Topics */}
      {activeSubTab === 'syllabus' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Layers size={18} className="text-violet-400" />
              Units & Modules ({subject.units.length})
            </h2>
            <button
              onClick={() => onOpenAddUnit(subject.id)}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-glow-violet transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Unit</span>
            </button>
          </div>

          {subject.units.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
              <Layers size={32} className="mx-auto text-violet-400 opacity-40" />
              <h3 className="text-sm font-bold text-white">No Units Created Yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Break this subject down into modules or chapters to track topic-level completion.
              </p>
              <button
                onClick={() => onOpenAddUnit(subject.id)}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
              >
                Add Unit 1
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {subject.units.map((unit) => {
                const isExpanded = expandedUnits[unit.id] !== false; // expanded by default
                const unitCompleted = unit.topics.filter((t) => t.isCompleted).length;
                const unitProgress =
                  unit.topics.length > 0
                    ? Math.round((unitCompleted / unit.topics.length) * 100)
                    : 0;

                return (
                  <div
                    key={unit.id}
                    className="rounded-2xl bg-[#0f1128] border border-violet-500/20 overflow-hidden shadow-lg transition-all"
                  >
                    {/* Unit Accordion Header */}
                    <div
                      onClick={() => toggleUnitExpand(unit.id)}
                      className="p-4 sm:p-5 flex items-center justify-between cursor-pointer hover:bg-violet-950/20 transition-colors select-none"
                    >
                      <div className="flex items-center space-x-3 min-w-0">
                        <button className="text-slate-400">
                          {isExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </button>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold text-violet-400">
                              Unit {unit.unitNumber}
                            </span>
                            {unit.weightagePercentage && (
                              <span className="text-[10px] text-slate-400 font-mono">
                                ({unit.weightagePercentage}% weightage)
                              </span>
                            )}
                          </div>
                          <h3 className="text-sm sm:text-base font-bold text-white truncate">
                            {unit.title}
                          </h3>
                        </div>
                      </div>

                      <div
                        className="flex items-center space-x-3 flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
                          {unitCompleted}/{unit.topics.length} ({unitProgress}%)
                        </span>

                        <button
                          onClick={() => onOpenAddTopic(subject.id, unit.id)}
                          className="px-2.5 py-1 rounded-lg bg-[#090a16] border border-violet-500/20 hover:border-violet-500/50 text-xs font-semibold text-violet-300 flex items-center gap-1"
                        >
                          <Plus size={12} />
                          <span className="hidden sm:inline">Add Topic</span>
                        </button>

                        <button
                          onClick={() => onOpenEditUnit(unit)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>

                        <button
                          onClick={() => deleteUnit(unit.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>

                    {/* Unit Topics Checklist */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-violet-900/20 space-y-2 bg-[#090a16]/40">
                        {unit.topics.length === 0 ? (
                          <div className="py-4 text-center text-xs text-slate-500">
                            No topics added in this unit yet.{' '}
                            <button
                              onClick={() => onOpenAddTopic(subject.id, unit.id)}
                              className="text-violet-400 hover:underline"
                            >
                              Add first topic
                            </button>
                          </div>
                        ) : (
                          unit.topics.map((topic) => (
                            <div
                              key={topic.id}
                              className={`p-3 rounded-xl border flex items-center justify-between transition-all ${
                                topic.isCompleted
                                  ? 'bg-slate-900/30 border-slate-800/80 opacity-70'
                                  : 'bg-[#090a16] border-violet-500/10 hover:border-violet-500/30'
                              }`}
                            >
                              <div className="flex items-center space-x-3 min-w-0">
                                <button
                                  onClick={() => toggleTopicComplete(topic.id)}
                                  className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                                    topic.isCompleted
                                      ? 'bg-emerald-500 border-emerald-500 text-black'
                                      : 'border-slate-600 hover:border-emerald-400 text-transparent'
                                  }`}
                                >
                                  <CheckCircle2 size={14} />
                                </button>

                                <div className="min-w-0">
                                  <p
                                    className={`text-xs sm:text-sm font-medium truncate ${
                                      topic.isCompleted
                                        ? 'line-through text-slate-400'
                                        : 'text-slate-100'
                                    }`}
                                  >
                                    {topic.title}
                                  </p>
                                  {topic.description && (
                                    <p className="text-[11px] text-slate-500 truncate">
                                      {topic.description}
                                    </p>
                                  )}
                                </div>
                              </div>

                              <div className="flex items-center space-x-2 flex-shrink-0">
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                                    topic.difficulty === 'Hard'
                                      ? 'bg-rose-500/20 text-rose-300'
                                      : topic.difficulty === 'Medium'
                                      ? 'bg-amber-500/20 text-amber-300'
                                      : 'bg-emerald-500/20 text-emerald-300'
                                  }`}
                                >
                                  {topic.difficulty}
                                </span>

                                <span className="text-[11px] font-mono text-slate-400 hidden sm:inline">
                                  {topic.estimatedMinutes}m
                                </span>

                                <button
                                  onClick={() =>
                                    scheduleRevisionForTopic(topic.id, subject.id, topic.title)
                                  }
                                  title="Queue for Spaced Revision"
                                  className="p-1 text-slate-400 hover:text-pink-400 transition-colors"
                                >
                                  <RotateCcw size={13} />
                                </button>

                                <button
                                  onClick={() => onOpenEditTopic(topic)}
                                  className="p-1 text-slate-400 hover:text-white"
                                >
                                  <Edit2 size={13} />
                                </button>

                                <button
                                  onClick={() => deleteTopic(topic.id)}
                                  className="p-1 text-slate-400 hover:text-rose-400"
                                >
                                  <Trash2 size={13} />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Assignments */}
      {activeSubTab === 'assignments' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-indigo-400" />
              {subject.code} Coursework & Assignments
            </h2>
            <button
              onClick={() => onOpenAddAssignment(subject.id)}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-glow-violet transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Add Assignment</span>
            </button>
          </div>

          {subjectAssignments.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-2">
              <p className="text-xs text-slate-400">
                No assignments logged for {subject.name}.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjectAssignments.map((a) => (
                <div
                  key={a.id}
                  className="p-4 rounded-xl bg-[#0f1128] border border-violet-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-400 uppercase font-mono">
                      {a.status}
                    </span>
                    <span className="text-xs font-mono text-slate-400">Due: {a.dueDate}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{a.title}</h3>
                  {a.description && (
                    <p className="text-xs text-slate-400">{a.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Notes */}
      {activeSubTab === 'notes' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <FileText size={18} className="text-violet-400" />
              {subject.code} Notes Library
            </h2>
            <button
              onClick={() => onOpenAddNote(subject.id)}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-glow-violet transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Create Note</span>
            </button>
          </div>

          {subjectNotes.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-2">
              <p className="text-xs text-slate-400">No notes written for {subject.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subjectNotes.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-xl bg-[#0f1128] border border-violet-500/20 space-y-2"
                >
                  <h3 className="text-sm font-bold text-white">{n.title}</h3>
                  <p className="text-xs text-slate-300 font-mono line-clamp-3 bg-[#090a16] p-2 rounded-lg">
                    {n.content}
                  </p>
                  <div className="flex items-center gap-1 flex-wrap pt-1">
                    {n.tags.map((t) => (
                      <span
                        key={t}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-300 border border-violet-500/20"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Resources */}
      {activeSubTab === 'resources' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Bookmark size={18} className="text-cyan-400" />
              {subject.code} Study Resources
            </h2>
            <button
              onClick={() => onOpenAddResource(subject.id)}
              className="px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold shadow-glow-violet transition-all flex items-center gap-1.5"
            >
              <Plus size={14} />
              <span>Save Resource</span>
            </button>
          </div>

          {subjectResources.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-2">
              <p className="text-xs text-slate-400">No resources linked for {subject.name}.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjectResources.map((r) => (
                <div
                  key={r.id}
                  className="p-4 rounded-xl bg-[#0f1128] border border-violet-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-cyan-400">{r.resourceType}</span>
                    <a
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-violet-400 hover:underline"
                    >
                      Open Link ↗
                    </a>
                  </div>
                  <h3 className="text-sm font-bold text-white">{r.title}</h3>
                  {r.description && (
                    <p className="text-xs text-slate-400">{r.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Exams */}
      {activeSubTab === 'exams' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Target size={18} className="text-violet-400" />
            {subject.code} Exam Countdown
          </h2>
          {subjectExams.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-2">
              <p className="text-xs text-slate-400">No exams registered for this subject.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {subjectExams.map((e) => (
                <div
                  key={e.id}
                  className="p-4 rounded-xl bg-[#0f1128] border border-violet-500/20 space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-violet-400">{e.examType}</span>
                    <span className="text-xs font-mono text-slate-300 font-bold">
                      {e.examDate}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{e.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-violet-900/30">
                    <span>Target: {e.targetScore}%</span>
                    <span>Status: {e.preparationStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
