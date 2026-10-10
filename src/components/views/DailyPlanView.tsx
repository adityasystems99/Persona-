import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  Plus,
  Trash2,
  Coffee,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { DifficultyBadge, StatusBadge } from '../common/Badge';
import { Problem } from '../../types/dsa';

interface DailyPlanViewProps {
  onOpenAddModal: () => void;
  onEditProblem: (problem: Problem) => void;
}

export const DailyPlanView: React.FC<DailyPlanViewProps> = ({
  onOpenAddModal,
}) => {
  const {
    dailyPlan,
    updateDailyPlan,
    problems,
    toggleProblemStatus,
    toggleInTodayPlan,
    stats,
    stlState,
    setActiveTab,
  } = useDSA();

  const [notes, setNotes] = useState(dailyPlan.notes || '');

  const todayProblems = problems
    .filter((p) => p.inTodayPlan)
    .sort((a, b) => a.orderInPlan - b.orderInPlan);

  const totalEstTime =
    todayProblems.reduce((sum, p) => sum + (p.timeSpentMinutes || 30), 0) + 30; // + 30 mins for STL

  const handleNotesBlur = () => {
    updateDailyPlan({ notes });
  };

  const handleTargetChange = (type: 'easy' | 'med' | 'hard', delta: number) => {
    let nextEasy = dailyPlan.targetEasy;
    let nextMed = dailyPlan.targetMedium;
    let nextHard = dailyPlan.targetHard;

    if (type === 'easy') nextEasy = Math.max(0, nextEasy + delta);
    if (type === 'med') nextMed = Math.max(0, nextMed + delta);
    if (type === 'hard') nextHard = Math.max(0, nextHard + delta);

    const nextCount = nextEasy + nextMed + nextHard;
    updateDailyPlan({
      targetEasy: nextEasy,
      targetMedium: nextMed,
      targetHard: nextHard,
      targetCount: nextCount,
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner & Target Adjuster */}
      <div className="card-soft p-6 bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-violet-500/10">
          <div>
            <div className="flex items-center space-x-2.5 mb-1">
              <span className="p-2 rounded-xl gradient-violet text-white shadow-glow-violet">
                <Calendar size={18} />
              </span>
              <div>
                <h2 className="text-xl font-extrabold text-white tracking-tight flex items-center gap-2">
                  Daily Orbit Mission Plan
                  <span className="px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-widest bg-violet-500/20 text-violet-300 border border-violet-500/30">
                    Live
                  </span>
                </h2>
              </div>
            </div>
            <p className="text-xs text-slate-400">
              Configure daily difficulty trajectory, mission cut-off timeline, and real-time execution blocks.
            </p>
          </div>

          {/* Deadline Picker */}
          <div className="flex items-center space-x-3 bg-[#0a0b18]/80 p-2.5 px-3.5 rounded-2xl border border-violet-500/20 shadow-inner">
            <Clock size={16} className="text-violet-400" />
            <div className="text-xs">
              <span className="block font-bold text-slate-400 text-[10px] uppercase tracking-wider">Mission Deadline</span>
              <input
                type="time"
                value={dailyPlan.deadlineTime}
                onChange={(e) => updateDailyPlan({ deadlineTime: e.target.value })}
                className="text-xs font-bold text-violet-200 bg-transparent focus:outline-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Target Counters */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-[#0a0b18]/60 border border-violet-500/20 flex flex-col justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Total Target
            </span>
            <div className="flex items-baseline space-x-1.5 my-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">
                {dailyPlan.targetCount}
              </span>
              <span className="text-xs text-violet-400 font-semibold">questions</span>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">
              {todayProblems.length} currently queued
            </span>
          </div>

          {/* Easy Target */}
          <div className="p-4 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">Easy Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('easy', -1)}
                  className="w-5 h-5 rounded-md bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-800/60 transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('easy', 1)}
                  className="w-5 h-5 rounded-md bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 font-bold text-xs hover:bg-emerald-800/60 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-200">
                {dailyPlan.targetEasy}
              </span>
              <span className="text-xs text-emerald-400 ml-1">target</span>
            </div>
            <span className="text-[11px] text-emerald-400/80 font-medium">
              Solved: {stats.todayEasySolved}
            </span>
          </div>

          {/* Medium Target */}
          <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">Medium Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('med', -1)}
                  className="w-5 h-5 rounded-md bg-amber-900/40 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-800/60 transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('med', 1)}
                  className="w-5 h-5 rounded-md bg-amber-900/40 border border-amber-500/40 text-amber-300 font-bold text-xs hover:bg-amber-800/60 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-amber-200">
                {dailyPlan.targetMedium}
              </span>
              <span className="text-xs text-amber-400 ml-1">target</span>
            </div>
            <span className="text-[11px] text-amber-400/80 font-medium">
              Solved: {stats.todayMediumSolved}
            </span>
          </div>

          {/* Hard Target */}
          <div className="p-4 rounded-2xl bg-violet-950/30 border border-violet-500/30 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-violet-300">Hard Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('hard', -1)}
                  className="w-5 h-5 rounded-md bg-violet-900/40 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-800/60 transition-colors"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('hard', 1)}
                  className="w-5 h-5 rounded-md bg-violet-900/40 border border-violet-500/40 text-violet-300 font-bold text-xs hover:bg-violet-800/60 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-violet-200">
                {dailyPlan.targetHard}
              </span>
              <span className="text-xs text-violet-400 ml-1">target</span>
            </div>
            <span className="text-[11px] text-violet-300 font-medium">
              Solved: {stats.todayHardSolved}
            </span>
          </div>
        </div>
      </div>

      {/* Main Plan Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist of Assigned Questions & Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-soft p-5 sm:p-6 bg-[#0c0e22]/90 border border-violet-500/20">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-white">
                  Orbital Execution Checklist
                </h3>
                <p className="text-xs text-slate-400">
                  Execute mission blocks and confirm telemetry in real-time
                </p>
              </div>
              <button
                onClick={onOpenAddModal}
                className="px-3.5 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95 transition-all flex items-center space-x-1.5"
              >
                <Plus size={14} />
                <span>Add Question</span>
              </button>
            </div>

            {/* 1. Mandatory 30-min STL Block */}
            <div
              className={`p-4 rounded-2xl border mb-3 flex items-center justify-between transition-all ${
                stlState.isCompleted
                  ? 'bg-emerald-950/20 border-emerald-500/30'
                  : 'bg-violet-950/20 border-violet-500/30'
              }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  checked={stlState.isCompleted}
                  onChange={() => {
                    if (!stlState.isCompleted) {
                      setActiveTab('stl-practice');
                    }
                  }}
                  className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-violet-500/40 focus:ring-violet-500 cursor-pointer"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-white">
                      30-Minute C++ STL Flight Drill
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Drill containers, algorithms & custom comparators (Est: 30 mins)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('stl-practice')}
                className="text-xs font-bold text-violet-400 hover:text-violet-300 hover:underline flex items-center transition-colors"
              >
                {stlState.isCompleted ? 'Review Drill' : 'Launch Drill'}
                <ArrowRight size={13} className="ml-1" />
              </button>
            </div>

            {/* 2. Questions List */}
            {todayProblems.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs border border-dashed border-violet-500/20 rounded-2xl p-6 bg-[#090a18]/50">
                <Sparkles size={28} className="mx-auto text-violet-400/50 mb-2" />
                <p className="font-semibold text-slate-300">No questions currently in today's orbit plan.</p>
                <p className="text-[11px] text-slate-500 mt-1">Add a new problem above or select from the Question Bank.</p>
                <button
                  onClick={() => setActiveTab('question-bank')}
                  className="inline-block mt-3 px-3 py-1.5 rounded-xl text-xs font-bold text-violet-300 bg-violet-500/10 border border-violet-500/30 hover:bg-violet-500/20 transition-all"
                >
                  Explore Question Bank →
                </button>
              </div>
            ) : (
              <div className="space-y-2.5">
                {todayProblems.map((problem, idx) => {
                  const isSolved =
                    problem.status === 'Solved Independently' ||
                    problem.status === 'Solved with Hints';

                  return (
                    <div
                      key={problem.id}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between gap-3 ${
                        isSolved
                          ? 'bg-[#0e1026]/50 border-emerald-500/30'
                          : 'bg-[#10122e]/80 border-violet-500/20 hover:border-violet-500/40'
                      }`}
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <input
                          type="checkbox"
                          checked={isSolved}
                          onChange={() => {
                            if (isSolved) {
                              toggleProblemStatus(problem.id, 'In Progress');
                            } else {
                              toggleProblemStatus(problem.id, 'Solved Independently', 25, true);
                            }
                          }}
                          className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-violet-500/40 focus:ring-violet-500 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-white truncate">
                              #{idx + 1} {problem.title}
                            </span>
                            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                            <span className="text-violet-300">{problem.topic}</span>
                            <span>•</span>
                            <span>
                              Est: {problem.timeSpentMinutes || 30} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 flex-shrink-0">
                        <StatusBadge status={problem.status} />
                        <button
                          onClick={() => toggleInTodayPlan(problem.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-rose-500/10 transition-colors"
                          title="Remove from today's plan"
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
        </div>

        {/* Right Col: Remaining Work & Plan Notes */}
        <div className="space-y-4">
          {/* Remaining Work Summary */}
          <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
            <h4 className="font-bold text-sm text-white mb-3 flex items-center">
              <Target size={16} className="text-violet-400 mr-2" />
              Orbital Telemetry Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-violet-500/10">
                <span className="text-slate-400">Unsolved DSA Questions:</span>
                <span className="font-bold text-white font-mono">
                  {stats.todayPlanRemainingCount}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-violet-500/10">
                <span className="text-slate-400">STL Practice Block:</span>
                <span
                  className={`font-bold ${
                    stlState.isCompleted ? 'text-emerald-400' : 'text-amber-400'
                  }`}
                >
                  {stlState.isCompleted ? 'Completed' : 'Pending (30m)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-violet-500/10">
                <span className="text-slate-400">Estimated Total Session:</span>
                <span className="font-bold text-violet-300 font-mono">
                  {totalEstTime} mins (~{(totalEstTime / 60).toFixed(1)} hrs)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Daily Target Met:</span>
                <span
                  className={`font-bold font-mono ${
                    stats.completionPercentage >= 100
                      ? 'text-emerald-400'
                      : 'text-violet-400'
                  }`}
                >
                  {stats.completionPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Optional Breaks & Focus Notes */}
          <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
            <h4 className="font-bold text-sm text-white mb-2 flex items-center">
              <Coffee size={16} className="text-violet-400 mr-2" />
              Mission Directives & Tactical Notes
            </h4>
            <p className="text-xs text-slate-400 mb-2.5">
              Plan focus intervals, recovery pauses, and key patterns.
            </p>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="e.g. Flight protocol: 10 min break after 2 Easy questions. No hints for 25 mins on Medium problem."
              className="w-full text-xs bg-[#090a18]/80 border border-violet-500/30 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all resize-none"
            />
            <span className="text-[10px] text-slate-500 block mt-1">
              Auto-saves to cosmic storage on blur.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
