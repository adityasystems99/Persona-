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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-100">
        <div>
          <h2 className="text-lg font-bold text-slate-800 tracking-tight flex items-center space-x-2">
            <span>Today's Problem Queue</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
              {todayProblems.length} scheduled
            </span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Prioritized DSA focus list. Click any row to update status or launch problem link.
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
              className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200/90 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all w-40 sm:w-48"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {(['All', 'Easy', 'Medium', 'Hard'] as const).map((diff) => (
              <button
                key={diff}
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedDifficulty === diff
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'hover:text-slate-900'
                }`}
              >
                {diff}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl text-xs font-medium text-slate-600">
            {(['All', 'Pending', 'In Progress', 'Solved'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg transition-all ${
                  selectedStatusFilter === st
                    ? 'bg-white text-slate-900 shadow-sm font-bold'
                    : 'hover:text-slate-900'
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
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center mb-3">
            <Filter size={24} />
          </div>
          <h4 className="font-bold text-slate-700 text-sm">No questions match criteria</h4>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            {todayProblems.length === 0
              ? "You haven't scheduled any DSA problems for today yet. Add questions to kick off your sprint!"
              : 'Try clearing the search query or difficulty filters to see your scheduled problems.'}
          </p>
          <button
            onClick={onOpenAddModal}
            className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1.5"
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
                    ? 'bg-slate-50/60 border-slate-200/60 opacity-90'
                    : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-soft'
                }`}
              >
                {/* Left side: Order, Title, Topic, Badges */}
                <div className="flex items-start sm:items-center space-x-3 flex-1 min-w-0">
                  {/* Order controls */}
                  <div className="flex flex-col items-center justify-center flex-shrink-0 -space-y-1">
                    <button
                      onClick={() => reorderTodayPlan(problem.id, 'up')}
                      disabled={index === 0}
                      className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                      title="Move up"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <span className="text-[11px] font-bold text-slate-400 font-mono">
                      #{index + 1}
                    </span>
                    <button
                      onClick={() => reorderTodayPlan(problem.id, 'down')}
                      disabled={index === filteredProblems.length - 1}
                      className="p-0.5 text-slate-300 hover:text-slate-600 disabled:opacity-20"
                      title="Move down"
                    >
                      <ChevronDown size={14} />
                    </button>
                  </div>

                  {/* Problem Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <a
                        href={problem.url || '#'}
                        target={problem.url ? '_blank' : '_self'}
                        rel="noreferrer"
                        className="font-bold text-sm text-slate-800 hover:text-rose-600 transition-colors inline-flex items-center group/title"
                      >
                        <span className="truncate">{problem.title}</span>
                        {problem.url && (
                          <ExternalLink
                            size={12}
                            className="ml-1 text-slate-400 group-hover/title:text-rose-600 transition-colors flex-shrink-0"
                          />
                        )}
                      </a>
                      <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                      <PlatformBadge platform={problem.platform} />
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500">
                      <span className="font-medium text-slate-600">
                        {problem.topic}
                        {problem.subtopic ? ` • ${problem.subtopic}` : ''}
                      </span>
                      {problem.timeSpentMinutes > 0 && (
                        <span className="flex items-center text-slate-400">
                          <Clock size={12} className="mr-1" />
                          {problem.timeSpentMinutes} mins
                        </span>
                      )}
                      {problem.timeComplexity && (
                        <span className="font-mono text-[11px] text-slate-400">
                          Time: {problem.timeComplexity}
                        </span>
                      )}
                      {problem.attempts > 1 && (
                        <span className="text-[11px] text-amber-600 font-medium">
                          {problem.attempts} attempts
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right side: Status and Quick Actions */}
                <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex-shrink-0">
                  {/* Status Badge */}
                  <StatusBadge status={problem.status} />

                  {/* Fast Action Buttons */}
                  <div className="flex items-center space-x-1">
                    {/* Launch Focus Mode */}
                    <button
                      onClick={() => startFocusSession(problem)}
                      title="Enter Focus Mode"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                    >
                      <Clock size={16} />
                    </button>

                    {/* Mark Solved Solo */}
                    <button
                      onClick={() => handleMarkStatus(problem, 'Solved Independently')}
                      title="Solved Independently"
                      className={`p-1.5 rounded-lg transition-all ${
                        problem.status === 'Solved Independently'
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
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
                          ? 'bg-purple-100 text-purple-700'
                          : 'text-slate-400 hover:text-purple-600 hover:bg-purple-50'
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
                          ? 'bg-rose-100 text-rose-700'
                          : 'text-slate-400 hover:text-rose-600 hover:bg-rose-50'
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
                        className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        <MoreVertical size={16} />
                      </button>

                      {activeMenuId === problem.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white rounded-xl shadow-soft-lg border border-slate-200 py-1.5 z-20 animate-in fade-in zoom-in-95">
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              onEditProblem(problem);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-700 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <Edit2 size={13} className="text-slate-400" />
                            <span>Edit Problem</span>
                          </button>
                          <button
                            onClick={() => handleMarkStatus(problem, 'In Progress')}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-blue-600 hover:bg-blue-50 flex items-center space-x-2"
                          >
                            <Clock size={13} />
                            <span>Set In Progress</span>
                          </button>
                          <button
                            onClick={() => handleMarkStatus(problem, 'Not Started')}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-slate-600 hover:bg-slate-50 flex items-center space-x-2"
                          >
                            <span>Reset to Not Started</span>
                          </button>
                          <div className="my-1 border-t border-slate-100" />
                          <button
                            onClick={() => {
                              setActiveMenuId(null);
                              deleteProblem(problem.id);
                            }}
                            className="w-full text-left px-3.5 py-1.5 text-xs text-rose-600 hover:bg-rose-50 flex items-center space-x-2 font-medium"
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
