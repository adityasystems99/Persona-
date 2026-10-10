import React, { useState } from 'react';
import {
  ExternalLink,
  Clock,
  MoreVertical,
  CheckCircle,
  HelpCircle,
  Edit2,
  Trash2,
  Repeat2,
  ChevronUp,
  ChevronDown,
  Search,
  Filter,
  Plus,
  Compass,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem, Difficulty, ProblemStatus } from '../../types/dsa';
import { DifficultyBadge, StatusBadge, PlatformBadge } from '../common/Badge';

interface TodayTaskListProps {
  onEditProblem: (problem: Problem) => void;
  onOpenAddModal: () => void;
  onOpenRevisionModal: (problem: Problem) => void;
}

export const TodayTaskList: React.FC<TodayTaskListProps> = ({
  onEditProblem,
  onOpenAddModal,
  onOpenRevisionModal,
}) => {
  const { problems, toggleProblemStatus, reorderTodayPlan, deleteProblem, startFocusSession } = useDSA();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<'All' | 'Solved' | 'In Progress' | 'Pending'>('All');
  const [activeMenuId, setActiveMenuId] = useState<string | null>(null);

  // Filter today's problems
  const todayProblems = problems
    .filter((p) => p.inTodayPlan)
    .sort((a, b) => a.orderInPlan - b.orderInPlan);

  const filteredProblems = todayProblems.filter((p) => {
    // Search query filter
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.topic.toLowerCase().includes(searchQuery.toLowerCase());

    // Difficulty filter
    const matchesDifficulty =
      selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    // Status filter
    let matchesStatus = true;
    if (selectedStatusFilter === 'Solved') {
      matchesStatus =
        p.status === 'Solved Independently' || p.status === 'Solved with Hints';
    } else if (selectedStatusFilter === 'In Progress') {
      matchesStatus = p.status === 'In Progress';
    } else if (selectedStatusFilter === 'Pending') {
      matchesStatus = p.status === 'Not Started' || p.status === 'Needs Revision';
    }

    return matchesSearch && matchesDifficulty && matchesStatus;
  });

  const handleMarkStatus = (problem: Problem, status: ProblemStatus) => {
    setActiveMenuId(null);
    if (status === 'Needs Revision' || status === 'Solved with Hints') {
      toggleProblemStatus(problem.id, status, problem.timeSpentMinutes || 25, false);
      onOpenRevisionModal(problem);
    } else if (status === 'Solved Independently') {
      toggleProblemStatus(problem.id, status, problem.timeSpentMinutes || 20, true);
    } else {
      toggleProblemStatus(problem.id, status);
    }
  };

  return (
    <div className="card-soft p-5 sm:p-6 mb-6">
      {/* Title & Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-violet-900/30">
        <div>
          <h2 className="text-lg font-bold text-white tracking-tight flex items-center space-x-2">
            <span>Today's Orbital Trajectory</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/20">
              {todayProblems.length} scheduled
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Prioritized DSA focus queue. Click any question to launch focus session or update progress.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-[#0b0c1e] text-slate-100 border border-violet-500/20 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 focus:border-violet-500 transition-all w-40 sm:w-48 placeholder:text-slate-500"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1 bg-[#0b0c1e] p-1 rounded-xl text-xs font-medium text-slate-400 border border-violet-500/15">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-violet-600 text-white shadow-sm font-bold'
                    : 'hover:text-slate-200'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-[#0b0c1e] p-1 rounded-xl text-xs font-medium text-slate-400 border border-violet-500/15">
            {(['All', 'Pending', 'In Progress', 'Solved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatusFilter === st
                    ? 'bg-violet-600 text-white shadow-sm font-bold'
                    : 'hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredProblems.length === 0 ? (
        <div className="py-12 text-center flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-2xl bg-violet-950/60 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-3">
            <Compass size={24} className="animate-pulse" />
          </div>
          <h4 className="font-bold text-slate-200 text-sm">
            {todayProblems.length === 0 ? 'Orbit Queue Clear' : 'No questions match criteria'}
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {todayProblems.length === 0
              ? 'No problems scheduled for today yet. Add questions to kick off today\'s focus sprint!'
              : 'Try clearing the search query or difficulty filters to see your scheduled problems.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <Plus size={14} />
            <span>Add Problem to Today</span>
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredProblems.map((problem, index) => {
            const isSolved =
              problem.status === 'Solved Independently' ||
              problem.status === 'Solved with Hints';

            return (
              <div
                key={problem.id}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                  isSolved
                    ? 'bg-[#0e1026]/70 border-violet-900/30 opacity-85'
                    : 'bg-[#12142e]/85 border-violet-500/20 hover:border-violet-400/40 hover:shadow-glow-violet'
                }`}
              >
                {/* Left side: Order, Title, Topic, Badges */}
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  {/* Order controls */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0 -space-y-1">
                    <button
                      onClick={() => reorderTodayPlan(problem.id, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-slate-500 hover:text-violet-300 disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-[10px] font-extrabold text-violet-400">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => reorderTodayPlan(problem.id, 'down')}
                      disabled={index === filteredProblems.length - 1}
                      className="p-0.5 text-slate-500 hover:text-violet-300 disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Problem Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                      {problem.platform && <PlatformBadge platform={problem.platform} />}
                      <span className="text-[11px] font-semibold text-violet-300 bg-violet-950/60 px-2 py-0.5 rounded-md border border-violet-500/20">
                        {problem.topic}
                      </span>
                      {problem.subtopic && (
                        <span className="text-[11px] text-slate-400 hidden md:inline">
                          • {problem.subtopic}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center space-x-2">
                      {problem.url ? (
                        <a
                          href={problem.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-sm text-white hover:text-violet-300 transition-colors flex items-center space-x-1 truncate"
                        >
                          <span className="truncate">{problem.title}</span>
                          <ExternalLink size={12} className="flex-shrink-0 text-slate-500" />
                        </a>
                      ) : (
                        <span className="font-bold text-sm text-white truncate">
                          {problem.title}
                        </span>
                      )}
                    </div>

                    {/* Metadata tags: time, attempts */}
                    <div className="mt-1 flex items-center space-x-3 text-slate-400 text-xs">
                      {problem.timeSpentMinutes ? (
                        <span className="flex items-center text-[11px] text-slate-400">
                          <Clock size={11} className="mr-1 text-slate-500" />
                          {problem.timeSpentMinutes} mins logged
                        </span>
                      ) : null}
                      {problem.timeComplexity && (
                        <span className="text-[11px] text-slate-400 font-mono">
                          Time: {problem.timeComplexity}
                        </span>
                      )}
                      {problem.attempts > 1 && (
                        <span className="text-[11px] text-amber-400 font-medium">
                          {problem.attempts} attempts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Status and Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-violet-900/30 flex-shrink-0">
                  {/* Status Badge */}
                  <StatusBadge status={problem.status} />

                  {/* Fast Action Buttons */}
                  <div className="flex items-center space-x-1">
                    {/* Launch Focus Mode */}
                    <button
                      onClick={() => startFocusSession(problem)}
                      title="Enter Focus Mode"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-violet-300 hover:bg-violet-950/50 transition-all"
                    >
                      <Clock size={16} />
                    </button>

                    {/* Mark Solved Solo */}
                    <button
                      onClick={() => handleMarkStatus(problem, 'Solved Independently')}
                      title="Solved Independently"
                      className={`p-1.5 rounded-lg transition-all ${
                        problem.status === 'Solved Independently'
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/30'
                          : 'text-slate-400 hover:text-emerald-400 hover:bg-emerald-950/30'
                      }`}
                    >
                      <CheckCircle size={16} />
                    </button>

                    {/* Solved with Hints */}
                    <button
                      onClick={() => handleMarkStatus(problem, 'Solved with Hints')}
                      title="Solved with Hints (Adds to Revision)"
                      className={`p-1.5 rounded-lg transition-all ${
                        problem.status === 'Solved with Hints'
                          ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                          : 'text-slate-400 hover:text-purple-300 hover:bg-purple-950/30'
                      }`}
                    >
                      <HelpCircle size={16} />
                    </button>

                    {/* Schedule / Revisit */}
                    <button
                      onClick={() => onOpenRevisionModal(problem)}
                      title="Schedule Revision & Log Learnings"
                      className={`p-1.5 rounded-lg transition-all ${
                        problem.needsRevision
                          ? 'bg-violet-950/70 text-violet-300 border border-violet-500/30'
                          : 'text-slate-400 hover:text-violet-300 hover:bg-violet-950/30'
                      }`}
                    >
                      <Repeat2 size={16} />
                    </button>

                    {/* Overflow menu for Edit/Delete */}
                    <div className="relative">
                      <button
                        onClick={() =>
                          setActiveMenuId(activeMenuId === problem.id ? null : problem.id)
                        }
                        className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-violet-950/50 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === problem.id && (
                        <div className="absolute right-0 top-8 w-44 bg-[#12142e] rounded-xl shadow-glass-panel border border-violet-500/30 py-1.5 z-20 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditProblem(problem);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-200 hover:bg-violet-950/50 flex items-center space-x-2"
                          >
                            <Edit2 size={13} className="text-violet-400" />
                            <span>Edit Problem</span>
                          </button>
                          <button
                            onClick={() => handleMarkStatus(problem, 'In Progress')}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-indigo-300 hover:bg-indigo-950/50 flex items-center space-x-2"
                          >
                            <Clock size={13} />
                            <span>Set In Progress</span>
                          </button>
                          <button
                            onClick={() => handleMarkStatus(problem, 'Not Started')}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-300 hover:bg-violet-950/50 flex items-center space-x-2"
                          >
                            <span>Reset to Not Started</span>
                          </button>
                          <div className="my-1 border-t border-violet-900/30" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              deleteProblem(problem.id);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-rose-400 hover:bg-rose-950/30 flex items-center space-x-2 font-medium"
                          >
                            <Trash2 size={13} />
                            <span>Delete</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
