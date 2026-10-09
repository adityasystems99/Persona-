import React, { useState } from 'react';
import {
  Calendar,
  Clock,
  Target,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Timer,
  Coffee,
  Sparkles,
  ArrowRight,
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
  onEditProblem,
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
      <div className="card-soft p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="p-1.5 rounded-xl gradient-coral text-white shadow-glow-coral">
                <Calendar size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-800">
                Daily Study Execution Plan
              </h2>
            </div>
            <p className="text-xs text-slate-500">
              Customize today's target distribution, strict deadline, and estimated problem solving blocks.
            </p>
          </div>

          {/* Deadline Picker */}
          <div className="flex items-center space-x-3 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
            <Clock size={16} className="text-rose-500" />
            <div className="text-xs">
              <span className="block font-bold text-slate-700">Daily Deadline:</span>
              <input
                type="time"
                value={dailyPlan.deadlineTime}
                onChange={(e) => updateDailyPlan({ deadlineTime: e.target.value })}
                className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Target Counters (Default: 2 Easy, 2 Medium, 1 Hard -> adjustable) */}
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-sm flex flex-col justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Target
            </span>
            <div className="flex items-baseline space-x-1 my-2">
              <span className="text-3xl font-extrabold text-slate-800">
                {dailyPlan.targetCount}
              </span>
              <span className="text-xs text-slate-400 font-semibold">questions</span>
            </div>
            <span className="text-[11px] text-slate-500">
              {todayProblems.length} currently queued
            </span>
          </div>

          {/* Easy Target */}
          <div className="p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-emerald-800">Easy Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('easy', -1)}
                  className="w-5 h-5 rounded-md bg-white border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('easy', 1)}
                  className="w-5 h-5 rounded-md bg-white border border-emerald-200 text-emerald-700 font-bold text-xs hover:bg-emerald-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-emerald-900">
                {dailyPlan.targetEasy}
              </span>
              <span className="text-xs text-emerald-700 ml-1">target</span>
            </div>
            <span className="text-[11px] text-emerald-600 font-medium">
              Solved: {stats.todayEasySolved}
            </span>
          </div>

          {/* Medium Target */}
          <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-800">Medium Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('med', -1)}
                  className="w-5 h-5 rounded-md bg-white border border-amber-200 text-amber-700 font-bold text-xs hover:bg-amber-100"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('med', 1)}
                  className="w-5 h-5 rounded-md bg-white border border-amber-200 text-amber-700 font-bold text-xs hover:bg-amber-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-amber-900">
                {dailyPlan.targetMedium}
              </span>
              <span className="text-xs text-amber-700 ml-1">target</span>
            </div>
            <span className="text-[11px] text-amber-600 font-medium">
              Solved: {stats.todayMediumSolved}
            </span>
          </div>

          {/* Hard Target */}
          <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-100 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-rose-800">Hard Target</span>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => handleTargetChange('hard', -1)}
                  className="w-5 h-5 rounded-md bg-white border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100"
                >
                  -
                </button>
                <button
                  onClick={() => handleTargetChange('hard', 1)}
                  className="w-5 h-5 rounded-md bg-white border border-rose-200 text-rose-700 font-bold text-xs hover:bg-rose-100"
                >
                  +
                </button>
              </div>
            </div>
            <div className="my-2">
              <span className="text-2xl font-extrabold text-rose-900">
                {dailyPlan.targetHard}
              </span>
              <span className="text-xs text-rose-700 ml-1">target</span>
            </div>
            <span className="text-[11px] text-rose-600 font-medium">
              Solved: {stats.todayHardSolved}
            </span>
          </div>
        </div>
      </div>

      {/* Main Plan Checklist Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Checklist of Assigned Questions & Blocks */}
        <div className="lg:col-span-2 space-y-4">
          <div className="card-soft p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-bold text-base text-slate-800">
                  Daily Execution Checklist
                </h3>
                <p className="text-xs text-slate-400">
                  Check off items as you complete them throughout the day
                </p>
              </div>
              <button
                onClick={onOpenAddModal}
                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1"
              >
                <Plus size={14} />
                <span>Add to Today</span>
              </button>
            </div>

            {/* 1. Mandatory 30-min STL Block */}
            <div
              className={`p-4 rounded-2xl border mb-3 flex items-center justify-between ${
                stlState.isCompleted
                  ? 'bg-emerald-50/60 border-emerald-200/80'
                  : 'bg-rose-50/40 border-rose-200/60'
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
                  className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                />
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-800">
                      30-Minute C++ STL Practice Block
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                      Mandatory
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Drill containers, algorithms & custom comparators (Est: 30 mins)
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveTab('stl-practice')}
                className="text-xs font-bold text-rose-600 hover:underline flex items-center"
              >
                {stlState.isCompleted ? 'View Notes' : 'Start Timer'}
                <ArrowRight size={13} className="ml-1" />
              </button>
            </div>

            {/* 2. Questions List */}
            {todayProblems.length === 0 ? (
              <div className="py-8 text-center text-slate-400 text-xs">
                No DSA questions currently in today's plan.
                <button
                  onClick={() => setActiveTab('question-bank')}
                  className="block mx-auto mt-2 text-rose-600 font-bold hover:underline"
                >
                  Select problems from Question Bank →
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
                          ? 'bg-slate-50/70 border-slate-200/60'
                          : 'bg-white border-slate-200/90'
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
                          className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-800 truncate">
                              #{idx + 1} {problem.title}
                            </span>
                            <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                          </div>
                          <div className="flex items-center space-x-3 text-xs text-slate-400 mt-0.5">
                            <span>{problem.topic}</span>
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
                          className="p-1 text-slate-400 hover:text-rose-600"
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
          <div className="card-soft p-5">
            <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center">
              <Target size={16} className="text-rose-500 mr-2" />
              Remaining Work Summary
            </h4>

            <div className="space-y-2.5 text-xs">
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Unsolved DSA Questions:</span>
                <span className="font-bold text-slate-800">
                  {stats.todayPlanRemainingCount}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">STL Practice:</span>
                <span
                  className={`font-bold ${
                    stlState.isCompleted ? 'text-emerald-600' : 'text-amber-600'
                  }`}
                >
                  {stlState.isCompleted ? 'Completed' : 'Pending (30 mins)'}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500">Estimated Total Session:</span>
                <span className="font-bold text-slate-800 font-mono">
                  {totalEstTime} mins (~{(totalEstTime / 60).toFixed(1)} hrs)
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-500">Daily Target Met?</span>
                <span
                  className={`font-bold ${
                    stats.completionPercentage >= 100
                      ? 'text-emerald-600'
                      : 'text-slate-700'
                  }`}
                >
                  {stats.completionPercentage}%
                </span>
              </div>
            </div>
          </div>

          {/* Optional Breaks & Focus Notes */}
          <div className="card-soft p-5">
            <h4 className="font-bold text-sm text-slate-800 mb-2 flex items-center">
              <Coffee size={16} className="text-amber-500 mr-2" />
              Session Strategy & Break Notes
            </h4>
            <p className="text-xs text-slate-400 mb-2.5">
              Plan your 5-10 min stretch breaks between Medium and Hard problems.
            </p>
            <textarea
              rows={5}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="e.g. Break 1: 10 mins walk after 2 Easy questions. Don't look at hints for at least 25 mins on Medium problem."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <span className="text-[10px] text-slate-400 block mt-1">
              Auto-saves when you click outside the box.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
