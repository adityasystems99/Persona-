import React, { useState } from 'react';
import {
  RotateCcw,
  Sparkles,
  Calendar,
  CheckCircle2,
  Clock,
  Star,
  AlertCircle,
  History,
  Trash2,
} from 'lucide-react';
import { AcademicRevision } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AcademicRevisionViewProps {
  onOpenLogRevisionModal: (revision: AcademicRevision) => void;
}

export const AcademicRevisionView: React.FC<AcademicRevisionViewProps> = ({
  onOpenLogRevisionModal,
}) => {
  const { revisions, revisionsDueToday, subjects, deleteRevision } = useAcademic();
  const [filterSubjectId, setFilterSubjectId] = useState('all');
  const [selectedRevisionHistory, setSelectedRevisionHistory] = useState<AcademicRevision | null>(null);

  const todayStr = getTodayDateStr();

  const filteredRevisions = revisions.filter((r) => {
    if (filterSubjectId === 'all') return true;
    return r.subjectId === filterSubjectId;
  });

  const dueRevisions = filteredRevisions.filter((r) => r.scheduledDate <= todayStr);
  const upcomingRevisions = filteredRevisions.filter((r) => r.scheduledDate > todayStr);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <RotateCcw className="text-pink-400" size={24} />
            Smart Spaced Revision Planner
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Scientifically timed memory reviews (1, 3, 7, 14, 30 days) to prevent forgetting curves
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={filterSubjectId}
            onChange={(e) => setFilterSubjectId(e.target.value)}
            className="px-3 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500 font-mono"
          >
            <option value="all">All Subjects</option>
            {subjects
              .filter((s) => !s.isArchived)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Spaced Intervals Explanation Banner */}
      <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xl">
        <div className="space-y-1">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles size={16} className="text-pink-400" />
            Adaptive Spaced Repetition Engine
          </h3>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            Whenever you complete an academic topic, it enters Stage 1 (1 day review). Rating <strong>Strong</strong> advances the stage (3d → 7d → 14d → 30d). Rating <strong>Poor</strong> resets back to day 1.
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono text-pink-300 font-bold bg-pink-500/10 px-3 py-2 rounded-xl border border-pink-500/30">
          <span>{dueRevisions.length} Due for Review Today</span>
        </div>
      </div>

      {/* Due Today Queue */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Clock size={18} className="text-pink-400" />
          Due for Review Today ({dueRevisions.length})
        </h2>

        {dueRevisions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 text-slate-400 space-y-1">
            <CheckCircle2 size={24} className="mx-auto text-emerald-400 opacity-60 mb-2" />
            <p className="text-sm font-bold text-white">All caught up!</p>
            <p className="text-xs">No topics due for spaced recall today.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dueRevisions.map((rev) => {
              const sub = subjects.find((s) => s.id === rev.subjectId);

              return (
                <div
                  key={rev.id}
                  className="p-5 rounded-2xl bg-[#0f1128] border border-pink-500/40 shadow-xl flex flex-col justify-between space-y-4 relative overflow-hidden group hover:border-pink-500/60"
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
                      <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
                        Stage {rev.stage + 1}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-white">{rev.title}</h3>

                    <div className="p-2.5 rounded-xl bg-[#090a16] border border-violet-500/10 space-y-1 text-xs font-mono text-slate-400">
                      <div className="flex justify-between">
                        <span>Last Studied:</span>
                        <span className="text-white">{rev.lastStudiedDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Confidence:</span>
                        <span className="text-amber-400">{'★'.repeat(rev.confidenceRating)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Reviews Completed:</span>
                        <span className="text-white">{rev.history.length}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between">
                    <button
                      onClick={() => onOpenLogRevisionModal(rev)}
                      className="px-4 py-2 rounded-xl bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <RotateCcw size={13} />
                      <span>Log Recall Review</span>
                    </button>

                    <div className="flex items-center space-x-1">
                      {rev.history.length > 0 && (
                        <button
                          onClick={() => setSelectedRevisionHistory(rev)}
                          className="p-1.5 text-slate-400 hover:text-white"
                          title="View Revision History"
                        >
                          <History size={14} />
                        </button>
                      )}
                      <button
                        onClick={() => deleteRevision(rev.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400"
                        title="Delete from Queue"
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

      {/* Upcoming Revisions Queue */}
      <div className="space-y-3 pt-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Calendar size={18} className="text-violet-400" />
          Scheduled Future Reviews ({upcomingRevisions.length})
        </h2>

        {upcomingRevisions.length === 0 ? (
          <div className="p-8 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 text-slate-500 text-xs">
            No future spaced revisions scheduled. Mark syllabus topics complete to auto-queue!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {upcomingRevisions.map((rev) => {
              const sub = subjects.find((s) => s.id === rev.subjectId);

              return (
                <div
                  key={rev.id}
                  className="p-4 rounded-xl bg-[#0f1128] border border-violet-500/20 flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      {sub && (
                        <span
                          className="px-2 py-0.5 rounded text-[10px] font-bold font-mono text-white"
                          style={{ backgroundColor: sub.color || '#8b5cf6' }}
                        >
                          {sub.code}
                        </span>
                      )}
                      <span className="text-xs font-mono text-slate-400">
                        Due: {rev.scheduledDate}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{rev.title}</h3>
                    <div className="flex items-center gap-3 text-xs text-slate-500 font-mono mt-1">
                      <span>Stage {rev.stage + 1}</span>
                      <span>•</span>
                      <span>Confidence: {rev.confidenceRating}/5</span>
                    </div>
                  </div>

                  <div className="flex justify-end pt-2 border-t border-violet-900/30">
                    <button
                      onClick={() => onOpenLogRevisionModal(rev)}
                      className="text-xs text-violet-400 hover:text-violet-300 font-semibold"
                    >
                      Review Early →
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* History Dialog */}
      {selectedRevisionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1128] border border-violet-500/30 rounded-2xl p-6 max-w-md w-full space-y-4">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <History size={18} className="text-violet-400" />
              Recall History: {selectedRevisionHistory.title}
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {selectedRevisionHistory.history.map((h, idx) => (
                <div
                  key={h.id || idx}
                  className="p-3 rounded-xl bg-[#090a16] border border-violet-500/10 text-xs font-mono space-y-1"
                >
                  <div className="flex justify-between">
                    <span className="text-slate-400">{h.date}</span>
                    <span
                      className={`font-bold uppercase ${
                        h.outcome === 'strong'
                          ? 'text-emerald-400'
                          : h.outcome === 'partial'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      {h.outcome} (Rating: {h.confidence}/5)
                    </span>
                  </div>
                  {h.notes && <p className="text-slate-300 font-sans">{h.notes}</p>}
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedRevisionHistory(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white"
              >
                Close History
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
