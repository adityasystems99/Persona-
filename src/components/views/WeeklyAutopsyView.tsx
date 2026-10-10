import React, { useState } from 'react';
import {
  FileSearch,
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
      <div className="card-soft p-6 bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className="p-2 rounded-xl gradient-violet text-white shadow-glow-violet">
                <FileSearch size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Weekly Flight Telemetry & Mission Autopsy
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Synthesized directly from your live study logs, focus telemetry, and revision outcomes.
              Audits trajectory execution against target milestones and yields high-impact calibrations for upcoming orbits.
            </p>
          </div>

          {/* Week Navigation */}
          <div className="flex items-center space-x-2 bg-[#090a18] p-1.5 rounded-2xl border border-violet-500/20 shadow-inner">
            <button
              onClick={() => setWeekOffset(weekOffset + 1)}
              className="p-1.5 rounded-xl hover:bg-violet-500/10 text-slate-400 hover:text-white transition-colors"
              title="Previous Orbit Window"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="px-3 text-xs font-bold text-white text-center">
              <span>{data.startDate} — {data.endDate}</span>
              <span className="block text-[10px] text-violet-400 font-normal">
                {weekOffset === 0 ? 'Current 7-Day Window' : `${weekOffset} Orbit Window(s) Ago`}
              </span>
            </div>
            <button
              onClick={() => setWeekOffset(Math.max(0, weekOffset - 1))}
              disabled={weekOffset === 0}
              className={`p-1.5 rounded-xl transition-colors ${
                weekOffset === 0 ? 'text-slate-600 cursor-not-allowed' : 'hover:bg-violet-500/10 text-slate-400 hover:text-white'
              }`}
              title="Next Orbit Window"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {!data.hasEnoughData ? (
        <div className="card-soft p-12 text-center bg-[#0c0e22]/90 border border-violet-500/20">
          <div className="w-14 h-14 rounded-2xl bg-violet-950/40 border border-violet-500/30 text-violet-400 flex items-center justify-center mx-auto mb-3">
            <Info size={26} />
          </div>
          <h4 className="font-bold text-white text-sm mb-1">
            Flight History Calibration in Progress
          </h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            Requires active study telemetry across at least 3 days to synthesize genuine statistical evaluations without synthetic values.
            Continue logging live problem completions and 30-min STL flight drills to unlock comparative trajectory models.
          </p>
        </div>
      ) : null}

      {/* Part 1: Measured Statistics (Strict Database Records) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Part 1: Measured Flight Telemetry (Verified Live Records)</span>
          </h3>
          <span className="text-[11px] text-violet-400 font-mono">Zero synthetic data • Audited log telemetry</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-[11px] text-slate-400 font-medium block">Planned vs Solved</span>
            <div className="flex items-baseline space-x-1.5 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono">{data.completedCount}</span>
              <span className="text-xs text-slate-500">/ {data.plannedCount}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-[#080916] overflow-hidden mt-2">
              <div
                className="h-full bg-emerald-400 rounded-full"
                style={{ width: `${data.completionRate}%` }}
              />
            </div>
            <span className="block text-[10px] text-emerald-400 mt-1 font-semibold">{data.completionRate}% target adherence</span>
          </div>

          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-[11px] text-slate-400 font-medium block">Independent Solve Rate</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono">{data.independentRate}%</span>
            </div>
            <span className="block text-[11px] text-slate-400 mt-2">
              {data.independentCount} of {data.completedCount} solved without hints
            </span>
          </div>

          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-[11px] text-slate-400 font-medium block">STL Practice Consistency</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono">{data.stlDaysCompleted}</span>
              <span className="text-xs text-slate-500">/ 7 days</span>
            </div>
            <span className="block text-[11px] text-slate-400 mt-2">
              {data.totalStlMinutes} total minutes in STL Arena
            </span>
          </div>

          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-[11px] text-slate-400 font-medium block">Revision Recall Success</span>
            <div className="flex items-baseline space-x-1 mt-1">
              <span className="text-2xl font-extrabold text-white font-mono">{data.revisionSuccessRate}%</span>
            </div>
            <span className="block text-[11px] text-slate-400 mt-2">
              {data.revisionAttempts} spaced repetition tests logged
            </span>
          </div>
        </div>

        {/* Detailed Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-xs font-bold text-slate-300 block mb-2">Difficulty Distribution</span>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-violet-500/10">
              <span className="text-emerald-400 font-semibold">Easy Problems</span>
              <span className="font-extrabold text-white font-mono">{data.easyCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5 border-b border-violet-500/10">
              <span className="text-amber-400 font-semibold">Medium Problems</span>
              <span className="font-extrabold text-white font-mono">{data.mediumCount}</span>
            </div>
            <div className="flex items-center justify-between text-xs py-1.5">
              <span className="text-violet-400 font-semibold">Hard Problems</span>
              <span className="font-extrabold text-white font-mono">{data.hardCount}</span>
            </div>
          </div>

          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-xs font-bold text-slate-300 block mb-2">Topic Dynamics</span>
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-950/20 border border-emerald-500/30">
                <span className="block text-[10px] text-emerald-400 font-bold uppercase">Highest Velocity Topic</span>
                <span className="font-extrabold text-xs text-emerald-200">{data.strongestTopic}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-violet-950/20 border border-violet-500/30">
                <span className="block text-[10px] text-violet-400 font-bold uppercase">Topic Requiring Calibration</span>
                <span className="font-extrabold text-xs text-violet-200">{data.weakestTopic}</span>
              </div>
            </div>
          </div>

          <div className="card-soft p-4 bg-[#0c0e22]/90 border border-violet-500/20">
            <span className="text-xs font-bold text-slate-300 block mb-2">Time & Resilience Telemetry</span>
            <div className="space-y-1.5 text-xs text-slate-400">
              <div className="flex justify-between py-1 border-b border-violet-500/10">
                <span>Total DSA Solving Time:</span>
                <strong className="text-white font-mono">{data.totalDsaMinutes} mins</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-violet-500/10">
                <span>Dedicated Focus Mode:</span>
                <strong className="text-white font-mono">{data.totalFocusMinutes} mins</strong>
              </div>
              <div className="flex justify-between py-1">
                <span>Recovered Tasks:</span>
                <strong className="text-violet-300 font-bold font-mono">{data.recoveredCount} carried over</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Part 2: Actionable Strategic Suggestions */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <Lightbulb size={18} className="text-violet-400" />
          <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-300">
            Part 2: Tactical Flight Directives for Next Orbit (Derived Telemetry)
          </h3>
        </div>

        <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20 space-y-3">
          {data.recommendations.map((rec, i) => (
            <div key={i} className="flex items-start space-x-3 text-xs text-slate-300 leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-violet-500/20 border border-violet-500/40 text-violet-300 font-bold flex items-center justify-center flex-shrink-0 text-[10px] mt-0.5">
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
