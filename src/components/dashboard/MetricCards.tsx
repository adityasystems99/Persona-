import React from 'react';
import { CheckCircle, Target, Timer, Clock, ArrowUpRight, Flame } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';

export const MetricCards: React.FC = () => {
  const { stats, dailyPlan, stlState, setActiveTab } = useDSA();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-6">
      {/* 1. Questions Solved Today - Gradient Cosmic Violet Hero Card */}
      <div className="relative overflow-hidden rounded-3xl p-5 gradient-violet text-white shadow-glow-violet group transition-transform duration-200 hover:-translate-y-0.5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-white/80">
            Mission Solved
          </span>
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <CheckCircle size={18} className="text-white" />
          </div>
        </div>

        <div className="flex items-baseline space-x-2">
          <span className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {stats.todaySolvedCount}
          </span>
          <span className="text-white/80 text-sm font-semibold">
            / {dailyPlan.targetCount} target
          </span>
        </div>

        {/* Breakdown pills */}
        <div className="mt-4 flex items-center space-x-1.5 text-[11px] font-semibold text-white/90">
          <span className="bg-white/20 px-2 py-0.5 rounded-full">
            {stats.todayEasySolved} Easy
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full">
            {stats.todayMediumSolved} Med
          </span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full">
            {stats.todayHardSolved} Hard
          </span>
        </div>

        {/* Progress bar */}
        <div className="mt-3.5 w-full bg-black/20 rounded-full h-1.5 overflow-hidden">
          <div
            className="bg-white h-full rounded-full transition-all duration-500 shadow-sm"
            style={{ width: `${stats.completionPercentage}%` }}
          />
        </div>
      </div>

      {/* 2. Target Completion % */}
      <div className="card-soft p-5 card-soft-hover flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Daily Velocity Rate
            </span>
            <div className="w-8 h-8 rounded-full bg-violet-950/60 text-violet-400 border border-violet-500/20 flex items-center justify-center">
              <Target size={18} />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.completionPercentage}%
            </span>
            <span className="text-xs font-semibold text-emerald-400 flex items-center">
              <Flame size={13} className="mr-0.5" />
              {stats.completionPercentage >= 100 ? 'Target Conquered' : 'In Flight'}
            </span>
          </div>

          <p className="text-xs text-slate-400 mt-1 font-medium">
            {stats.todayPlanRemainingCount === 0
              ? 'All planned problems conquered!'
              : `${stats.todayPlanRemainingCount} problem${stats.todayPlanRemainingCount > 1 ? 's' : ''} left in today's orbit`}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-violet-900/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">Deadline: {dailyPlan.deadlineTime}</span>
          <button
            onClick={() => setActiveTab('daily-plan')}
            className="text-violet-400 font-bold hover:text-violet-300 hover:underline flex items-center"
          >
            Adjust Target <ArrowUpRight size={12} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* 3. Mandatory 30-min STL Status */}
      <div className="card-soft p-5 card-soft-hover flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              30-Min STL Arena
            </span>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center border ${
                stlState.isCompleted
                  ? 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30'
                  : stlState.isRunning
                  ? 'bg-violet-950/60 text-violet-400 border-violet-500/40 animate-pulse'
                  : 'bg-amber-950/60 text-amber-400 border-amber-500/30'
              }`}
            >
              <Timer size={18} />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-mono">
              {stlState.isCompleted
                ? '30:00'
                : `${Math.floor(stlState.remainingSeconds / 60)}:${String(
                    stlState.remainingSeconds % 60
                  ).padStart(2, '0')}`}
            </span>
          </div>

          <div className="mt-1 flex items-center space-x-2">
            {stlState.isCompleted ? (
              <span className="text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-500/30 px-2 py-0.5 rounded-full inline-flex items-center">
                ✓ Conquered Today
              </span>
            ) : stlState.isRunning ? (
              <span className="text-xs font-bold text-violet-300 bg-violet-950/70 border border-violet-500/40 px-2 py-0.5 rounded-full inline-flex items-center">
                ● Live Countdown
              </span>
            ) : (
              <span className="text-xs font-medium text-amber-300 bg-amber-950/60 border border-amber-500/30 px-2 py-0.5 rounded-full">
                {stlState.remainingSeconds < stlState.totalSeconds ? 'Paused Session' : 'Pending (30 mins)'}
              </span>
            )}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-violet-900/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-400 truncate max-w-[120px]">
            Topic: {stlState.currentTopicId}
          </span>
          <button
            onClick={() => setActiveTab('stl-practice')}
            className="text-violet-400 font-bold hover:text-violet-300 hover:underline flex items-center"
          >
            Launch Arena <ArrowUpRight size={12} className="ml-0.5" />
          </button>
        </div>
      </div>

      {/* 4. Total Focused Time */}
      <div className="card-soft p-5 card-soft-hover flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Deep Work
            </span>
            <div className="w-8 h-8 rounded-full bg-indigo-950/60 text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Clock size={18} />
            </div>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {stats.todayTotalDsaMinutes + stats.todayStlMinutes}
            </span>
            <span className="text-slate-400 text-sm font-semibold">minutes</span>
          </div>

          <div className="mt-2 flex items-center space-x-3 text-xs text-slate-400 font-medium">
            <span>DSA: {stats.todayTotalDsaMinutes}m</span>
            <span>•</span>
            <span>STL: {stats.todayStlMinutes}m</span>
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-violet-900/30 flex items-center justify-between text-[11px]">
          <span className="text-slate-400">
            {stats.todayIndependentSolved} solo / {stats.todayWithHintsSolved} hints
          </span>
          <button
            onClick={() => setActiveTab('analytics')}
            className="text-indigo-400 font-bold hover:text-indigo-300 hover:underline flex items-center"
          >
            Full Telemetry <ArrowUpRight size={12} className="ml-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
