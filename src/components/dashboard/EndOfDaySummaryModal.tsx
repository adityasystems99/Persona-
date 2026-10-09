import React from 'react';
import { X, Trophy, CheckCircle2, AlertCircle, Timer, Clock, Sparkles } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { DifficultyBadge } from '../common/Badge';

interface EndOfDaySummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EndOfDaySummaryModal: React.FC<EndOfDaySummaryModalProps> = ({ isOpen, onClose }) => {
  const { problems, stats, dailyPlan, stlState } = useDSA();

  if (!isOpen) return null;

  const todayPlanned = problems.filter((p) => p.inTodayPlan);
  const solvedList = todayPlanned.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  );
  const pendingList = todayPlanned.filter(
    (p) => p.status !== 'Solved Independently' && p.status !== 'Solved with Hints'
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 to-rose-500 flex items-center justify-center text-white shadow-md">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Daily Study Session Summary
              </h3>
              <p className="text-xs text-slate-400">
                End-of-day execution & accountability debrief
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Solved / Target
              </span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">
                {stats.todaySolvedCount} / {dailyPlan.targetCount}
              </p>
              <span className="text-[11px] text-emerald-600 font-semibold">
                {stats.completionPercentage}% of target
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Focused Time
              </span>
              <p className="text-2xl font-extrabold text-slate-800 mt-1">
                {stats.todayTotalDsaMinutes + stats.todayStlMinutes}m
              </p>
              <span className="text-[11px] text-slate-500 font-medium">
                DSA: {stats.todayTotalDsaMinutes}m • STL: {stats.todayStlMinutes}m
              </span>
            </div>
          </div>

          {/* STL 30-min Status */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              stlState.isCompleted
                ? 'bg-emerald-50/60 border-emerald-200/80 text-emerald-800'
                : 'bg-amber-50/60 border-amber-200/80 text-amber-800'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Timer size={18} />
              <div>
                <p className="text-xs font-bold">
                  30-Min C++ STL Practice
                </p>
                <p className="text-[11px] opacity-80">
                  {stlState.isCompleted
                    ? 'Completed successfully! Practiced containers & algorithms.'
                    : `${Math.floor(stlState.remainingSeconds / 60)} minutes remaining for today.`}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase">
              {stlState.isCompleted ? '✓ Done' : 'Pending'}
            </span>
          </div>

          {/* Solved List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <CheckCircle2 size={13} className="text-emerald-500 mr-1.5" />
              Solved Questions ({solvedList.length})
            </h4>
            {solvedList.length === 0 ? (
              <p className="text-xs text-slate-400 italic">No questions solved yet today.</p>
            ) : (
              <div className="space-y-1.5">
                {solvedList.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate font-semibold text-slate-800">
                        {p.title}
                      </span>
                      <DifficultyBadge difficulty={p.difficulty} size="sm" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-500 flex-shrink-0">
                      {p.solvedIndependently ? 'Solo' : 'With Hints'} • {p.timeSpentMinutes}m
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending List */}
          {pendingList.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
                <AlertCircle size={13} className="text-amber-500 mr-1.5" />
                Pending In Queue ({pendingList.length})
              </h4>
              <div className="space-y-1.5">
                {pendingList.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl bg-slate-50/60 border border-slate-100 flex items-center justify-between text-xs opacity-75"
                  >
                    <span className="truncate font-medium text-slate-700">
                      {p.title}
                    </span>
                    <DifficultyBadge difficulty={p.difficulty} size="sm" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center">
            <Sparkles size={12} className="mr-1 text-rose-500" />
            Every session builds career muscle memory.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral active:scale-95 transition-all"
          >
            Close Summary
          </button>
        </div>
      </div>
    </div>
  );
};
