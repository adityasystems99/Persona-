import React from 'react';
import { X, Trophy, CheckCircle2, AlertCircle, Timer, Sparkles } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl max-w-lg w-full p-6 border border-violet-500/30 shadow-glow-violet/30 overflow-hidden relative max-h-[90vh] flex flex-col text-slate-200">
        {/* Top header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl gradient-violet flex items-center justify-center text-white shadow-glow-violet">
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Orbital Mission Debrief
              </h3>
              <p className="text-xs text-slate-400">
                End-of-day execution & accountability telemetry
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto py-4 space-y-4">
          {/* Key metrics grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-2xl bg-[#080918] border border-violet-500/20 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Solved / Target
              </span>
              <p className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats.todaySolvedCount} / {dailyPlan.targetCount}
              </p>
              <span className="text-[11px] text-emerald-400 font-semibold font-mono">
                {stats.completionPercentage}% of target
              </span>
            </div>

            <div className="p-3.5 rounded-2xl bg-[#080918] border border-violet-500/20 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Focused Time
              </span>
              <p className="text-2xl font-extrabold text-white font-mono mt-1">
                {stats.todayTotalDsaMinutes + stats.todayStlMinutes}m
              </p>
              <span className="text-[11px] text-violet-300 font-medium">
                DSA: {stats.todayTotalDsaMinutes}m • STL: {stats.todayStlMinutes}m
              </span>
            </div>
          </div>

          {/* STL 30-min Status */}
          <div
            className={`p-3.5 rounded-2xl border flex items-center justify-between ${
              stlState.isCompleted
                ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
            }`}
          >
            <div className="flex items-center space-x-2.5">
              <Timer size={18} />
              <div>
                <p className="text-xs font-bold text-white">
                  30-Min C++ STL Flight Drill
                </p>
                <p className="text-[11px] opacity-80">
                  {stlState.isCompleted
                    ? 'Completed successfully! Invariants drilled.'
                    : `${Math.floor(stlState.remainingSeconds / 60)} minutes remaining for today.`}
                </p>
              </div>
            </div>
            <span className="text-xs font-extrabold uppercase font-mono">
              {stlState.isCompleted ? '✓ Done' : 'Pending'}
            </span>
          </div>

          {/* Solved List */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center">
              <CheckCircle2 size={13} className="text-emerald-400 mr-1.5" />
              Solved Questions ({solvedList.length})
            </h4>
            {solvedList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No questions solved yet today.</p>
            ) : (
              <div className="space-y-1.5">
                {solvedList.map((p) => (
                  <div
                    key={p.id}
                    className="p-2.5 rounded-xl bg-[#080918] border border-violet-500/20 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center space-x-2 truncate">
                      <span className="truncate font-semibold text-white">
                        {p.title}
                      </span>
                      <DifficultyBadge difficulty={p.difficulty} size="sm" />
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 flex-shrink-0">
                      {p.solvedIndependently ? 'Solo' : 'Hints'} • {p.timeSpentMinutes}m
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
                <AlertCircle size={13} className="text-amber-400 mr-1.5" />
                Pending In Orbit Queue ({pendingList.length})
              </h4>
              <div className="space-y-1.5">
                {pendingList.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 rounded-xl bg-[#080918]/60 border border-violet-500/10 flex items-center justify-between text-xs opacity-75"
                  >
                    <span className="truncate font-medium text-slate-300">
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
        <div className="pt-3 border-t border-violet-500/10 flex items-center justify-between">
          <span className="text-[11px] text-slate-400 flex items-center">
            <Sparkles size={12} className="mr-1 text-violet-400" />
            Every session cements orbital muscle memory.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet active:scale-95 transition-all hover:opacity-95"
          >
            Close Debrief
          </button>
        </div>
      </div>
    </div>
  );
};
