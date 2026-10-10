import React, { useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Award,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  Clock,
  Sparkles,
  Layers,
  Calendar,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
} from 'recharts';
import { useAcademic } from '../../../context/AcademicContext';

export const AcademicAnalyticsView: React.FC = () => {
  const {
    subjects,
    tasks,
    assignments,
    exams,
    revisions,
    attendance,
    semesterCompletionPercentage,
    totalTopicsCount,
    completedTopicsCount,
    subjectAttendanceStats,
  } = useAcademic();

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  // Subject syllabus progress data
  const subjectProgressData = useMemo(() => {
    return activeSubjects.map((sub) => {
      let total = 0;
      let completed = 0;
      sub.units.forEach((u) => {
        u.topics.forEach((t) => {
          total++;
          if (t.isCompleted) completed++;
        });
      });
      const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
      return {
        name: sub.code,
        fullName: sub.name,
        percentage: percent,
        completed,
        total,
        color: sub.color || '#8b5cf6',
      };
    });
  }, [activeSubjects]);

  // Tasks completion breakdown
  const taskStats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'completed').length;
    const skipped = tasks.filter((t) => t.status === 'skipped').length;
    const pending = tasks.filter((t) => t.status === 'pending' || t.status === 'in_progress').length;
    return {
      total,
      completed,
      skipped,
      pending,
      rate: total > 0 ? Math.round((completed / total) * 100) : 0,
    };
  }, [tasks]);

  // Assignments completion rate
  const assignmentStats = useMemo(() => {
    const total = assignments.length;
    const submittedOrDone = assignments.filter(
      (a) => a.status === 'completed' || a.status === 'submitted' || a.status === 'graded'
    ).length;
    return {
      total,
      submittedOrDone,
      rate: total > 0 ? Math.round((submittedOrDone / total) * 100) : 0,
    };
  }, [assignments]);

  // Revision consistency & recall metrics
  const revisionStats = useMemo(() => {
    let totalReviews = 0;
    let strongCount = 0;
    let partialCount = 0;
    let poorCount = 0;

    revisions.forEach((r) => {
      r.history.forEach((h) => {
        totalReviews++;
        if (h.outcome === 'strong') strongCount++;
        else if (h.outcome === 'partial') partialCount++;
        else if (h.outcome === 'poor') poorCount++;
      });
    });

    const retentionRate =
      totalReviews > 0 ? Math.round((strongCount / totalReviews) * 100) : 0;

    return { totalReviews, strongCount, partialCount, poorCount, retentionRate };
  }, [revisions]);

  // Topics requiring attention (marked Hard or with Poor recall)
  const weakTopics = useMemo(() => {
    const list: { title: string; subjectCode: string; reason: string }[] = [];

    // Find poor recall revisions
    revisions
      .filter((r) => r.lastOutcome === 'poor' || r.confidenceRating <= 2)
      .forEach((r) => {
        const sub = subjects.find((s) => s.id === r.subjectId);
        list.push({
          title: r.title,
          subjectCode: sub?.code || 'SUB',
          reason: `Low confidence (${r.confidenceRating}/5) on last recall`,
        });
      });

    // Find incomplete Hard topics
    activeSubjects.forEach((sub) => {
      sub.units.forEach((u) => {
        u.topics
          .filter((t) => t.difficulty === 'Hard' && !t.isCompleted)
          .forEach((t) => {
            if (!list.some((item) => item.title === t.title)) {
              list.push({
                title: t.title,
                subjectCode: sub.code,
                reason: 'Hard syllabus topic pending completion',
              });
            }
          });
      });
    });

    return list.slice(0, 5);
  }, [revisions, activeSubjects, subjects]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <BarChart3 className="text-violet-400" size={24} />
            Academic Intelligence & Telemetry
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Telemetry computed from persisted database records. Distinguishes measurements from estimates.
          </p>
        </div>
      </div>

      {/* Summary Metagrid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20">
          <span className="text-xs font-mono uppercase text-slate-400">
            Semester Completion
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white">
              {semesterCompletionPercentage}%
            </span>
            <span className="text-xs text-slate-400">
              ({completedTopicsCount}/{totalTopicsCount})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Measured from completed syllabus topics</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20">
          <span className="text-xs font-mono uppercase text-slate-400">
            Task Execution Rate
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-400">
              {taskStats.rate}%
            </span>
            <span className="text-xs text-slate-400">
              ({taskStats.completed}/{taskStats.total})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Tasks marked complete vs scheduled</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20">
          <span className="text-xs font-mono uppercase text-slate-400">
            Coursework Completion
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-indigo-400">
              {assignmentStats.rate}%
            </span>
            <span className="text-xs text-slate-400">
              ({assignmentStats.submittedOrDone}/{assignmentStats.total})
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Submitted or completed assignments</p>
        </div>

        <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20">
          <span className="text-xs font-mono uppercase text-slate-400">
            Spaced Recall Accuracy
          </span>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-pink-400">
              {revisionStats.retentionRate}%
            </span>
            <span className="text-xs text-slate-400">
              ({revisionStats.totalReviews} reviews)
            </span>
          </div>
          <p className="text-[11px] text-slate-500 mt-1">Percentage of 'Strong' reviews logged</p>
        </div>
      </div>

      {/* Subject Syllabus Bar Chart */}
      <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Layers size={18} className="text-violet-400" />
            Subject-wise Syllabus Completion (%)
          </h2>
          <p className="text-xs text-slate-400">
            Comparative coverage across Semester 5 core engineering subjects
          </p>
        </div>

        {totalTopicsCount === 0 ? (
          <div className="py-12 text-center text-xs text-slate-500 border border-dashed border-violet-900/40 rounded-xl">
            No syllabus topics recorded yet. Add units and topics under your subjects to generate analytics.
          </div>
        ) : (
          <div className="h-64 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={subjectProgressData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis
                  dataKey="name"
                  stroke="#94a3b8"
                  fontSize={12}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                />
                <YAxis
                  stroke="#94a3b8"
                  fontSize={12}
                  domain={[0, 100]}
                  tickLine={false}
                  axisLine={{ stroke: '#334155' }}
                  tickFormatter={(val) => `${val}%`}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="p-3 bg-[#090a16] border border-violet-500/30 rounded-xl text-xs font-mono shadow-xl space-y-1">
                          <p className="font-bold text-white">{data.fullName}</p>
                          <p className="text-violet-300">Completion: {data.percentage}%</p>
                          <p className="text-slate-400">
                            {data.completed} of {data.total} topics mastered
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="percentage" radius={[6, 6, 0, 0]}>
                  {subjectProgressData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Split Cards: Weak Topics & Exam Preparedness */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Topics Requiring Attention */}
        <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <AlertTriangle size={18} className="text-amber-400" />
              Topics Requiring Revision Focus
            </h2>
            <p className="text-xs text-slate-400">
              Flagged from poor recall ratings and pending complex concepts
            </p>
          </div>

          {weakTopics.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-violet-900/40 rounded-xl">
              No weak concepts currently flagged. All logged topics are in good standing!
            </div>
          ) : (
            <div className="space-y-2.5">
              {weakTopics.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#090a16] border border-violet-500/20 flex items-center justify-between"
                >
                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.2 rounded text-[10px] font-bold font-mono bg-violet-600/20 text-violet-300 border border-violet-500/30">
                        {item.subjectCode}
                      </span>
                      <h3 className="text-sm font-semibold text-white truncate">{item.title}</h3>
                    </div>
                    <p className="text-xs text-slate-400">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Exam Readiness Radar */}
        <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Award size={18} className="text-indigo-400" />
              Examination Readiness Status
            </h2>
            <p className="text-xs text-slate-400">
              Exam countdown and student-assessed readiness state
            </p>
          </div>

          {exams.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500 border border-dashed border-violet-900/40 rounded-xl">
              No upcoming exams registered. Schedule your mid-terms or quizzes in the Deadlines tab.
            </div>
          ) : (
            <div className="space-y-2.5">
              {exams.map((e) => {
                const sub = subjects.find((s) => s.id === e.subjectId);

                return (
                  <div
                    key={e.id}
                    className="p-3.5 rounded-xl bg-[#090a16] border border-violet-500/20 flex items-center justify-between"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {sub && (
                          <span className="text-xs font-mono font-bold text-violet-400">
                            {sub.code}:
                          </span>
                        )}
                        <h3 className="text-sm font-semibold text-white truncate">{e.title}</h3>
                      </div>
                      <p className="text-xs text-slate-400 font-mono mt-0.5">
                        Date: {e.examDate} • Target: {e.targetScore}%
                      </p>
                    </div>

                    <span
                      className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${
                        e.preparationStatus === 'Mastered'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                          : e.preparationStatus === 'Ready'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40'
                          : e.preparationStatus === 'In Progress'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {e.preparationStatus}
                    </span>
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
