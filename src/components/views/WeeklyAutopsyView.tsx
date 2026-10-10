import React, { useState } from 'react';
import {
  FileSearch,
  CheckCircle2,
  Calendar,
  TrendingUp,
  BrainCircuit,
  Timer,
  Repeat2,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Info,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';

export const WeeklyAutopsyView: React.FC = () => {
  const { getWeeklyAutopsyData } = useDSA();
  const [weekOffset, setWeekOffset] = useState(0);

  const data = getWeeklyAutopsyData(weekOffset);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner & Week Navigator */}
      <div className="card-soft p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="p-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow-coral">
                <FileSearch size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Weekly Performance Autopsy
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Synthesized directly from your actual study logs, focus sessions, and revision outcomes.
              Evaluates execution against target milestones and yields high-impact adjustments for next week.
            </p>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center space-x-2 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-xs">
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-1.5 rounded-xl hover:bg-slate-100 text-slate-500 transition-colors"
              title="Previous Week"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 text-xs font-bold text-slate-700 text-center">
              <span>{data.startDate} — {data.endDate}</span>
              <span className="block text-[10px] text-slate-400 font-normal">
                {weekOffset === 0 ? 'Current 7-Day Window' : `${weekOffset} Week(s) Ago`}
              </span>
            </div>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className={`p-1.5 rounded-xl transition-colors ${
                weekOffset === 0 ? 'text-slate-300 cursor-not-allowed' : 'hover:bg-slate-100 text-slate-500'
              }`}
              title="Next Week"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {!data.hasEnoughData ? (
        <div className="card-soft p-12 text-center bg-white border border-slate-200">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
            <Info size={26} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm mb-1">
            Baseline History Gathering in Progress
          </h4>
          <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
            AlgoPulse requires at least 3 active study days to render an authentic statistical autopsy without fabricating metrics.
            Continue logging daily problems and 30-min STL practice sessions to unlock deep comparative trends.
          </p>
        </div>
      ) : null}

      {/* Part 1: Measured Statistics (Strict Database Records) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-500 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Part 1: Measured Weekly Statistics (Factual Database Records)</span>
          </h3>
          <span className="text-[11px] text-slate-400">Zero synthetic data • Audited log telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium block">Planned vs Solved</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{data.completedCount}</span>
              <span className="text-xs text-slate-400">/ {data.plannedCount}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{ width: `${data.completionRate}%` }}
              />
            </div>
            <span className="block text-[10px] text-slate-500 mt-1 font-semibold">{data.completionRate}% target adherence</span>
          </div>

          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium block">Independent Solve Rate</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{data.independentRate}%</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-2">
              {data.independentCount} of {data.completedCount} solved without hints
            </span>
          </div>

          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium block">STL Practice Consistency</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{data.stlDaysCompleted}</span>
              <span className="text-xs text-slate-400">/ 7 days</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-2">
              {data.totalStlMinutes} total minutes in STL Arena
            </span>
          </div>

          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-[11px] text-slate-400 font-medium block">Revision Recall Success</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-slate-800">{data.revisionSuccessRate}%</span>
            </div>
            <span className="block text-[11px] text-slate-500 mt-2">
              {data.revisionAttempts} spaced repetition tests logged
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">Difficulty Distribution</span>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-emerald-700 font-semibold">Easy Problems</span>
              <span className="font-extrabold text-slate-800">{data.easyCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1 border-b border-slate-100">
              <span className="text-amber-700 font-semibold">Medium Problems</span>
              <span className="font-extrabold text-slate-800">{data.mediumCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1">
              <span className="text-rose-700 font-semibold">Hard Problems</span>
              <span className="font-extrabold text-slate-800">{data.hardCount}</span>
            </div>
          </div>

          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">Topic Dynamics</span>
            <div className="space-y-2">
              <div className="p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <span className="block text-[10px] text-emerald-600 font-bold uppercase">Highest Velocity Topic</span>
                <span className="font-extrabold text-xs text-emerald-900">{data.strongestTopic}</span>
              </div>
              <div className="p-2 rounded-lg bg-rose-50/70 border border-rose-100">
                <span className="block text-[10px] text-rose-600 font-bold uppercase">Lowest Velocity Topic</span>
                <span className="font-extrabold text-xs text-rose-900">{data.weakestTopic}</span>
              </div>
            </div>
          </div>

          <div className="card-soft p-4 bg-white border border-slate-200">
            <span className="text-xs font-bold text-slate-700 block mb-2">Time & Resilience Telemetry</span>
            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Total DSA Solving Time:</span>
                <strong className="text-slate-800">{data.totalDsaMinutes} mins</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Dedicated Focus Mode:</span>
                <strong className="text-slate-800">{data.totalFocusMinutes} mins</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Recovered Tasks:</span>
                <strong className="text-rose-600 font-bold">{data.recoveredCount} carried over</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Actionable Strategic Suggestions (Delineated from Measured Data) */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Lightbulb size={18} className="text-amber-500" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700">
            Part 2: Actionable Prescriptions for Next Week (Derived Insights)
          </h3>
        </div>

        <div className="card-soft p-5 bg-gradient-to-br from-amber-50/30 via-white to-rose-50/20 border border-amber-200/80 space-y-3">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start space-x-3 text-xs text-slate-700 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
                {i + 1}
              </span>
              <p>{rec}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
