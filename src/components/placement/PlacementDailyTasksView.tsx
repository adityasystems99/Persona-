import React, { useState } from 'react';
import {
  CheckCircle2,
  Clock,
  Code2,
  Calendar,
  AlertTriangle,
  RotateCcw,
  Plus,
  Target,
  ExternalLink,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { PlacementDailyTask, TaskCompletionStatus } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useDSA } from '../../context/DSAContext';
import { useTheme } from '../../context/ThemeContext';
import { RescheduleTaskModal } from './RescheduleTaskModal';

interface PlacementDailyTasksViewProps {
  onOpenLogProject: () => void;
}

export const PlacementDailyTasksView: React.FC<PlacementDailyTasksViewProps> = ({
  onOpenLogProject,
}) => {
  const {
    todayTasks,
    overdueTasks,
    toggleTaskStatus,
    todayDsaSolvedCount,
    hasMediumDsaSolvedToday,
    todayProjectMinutes,
    settings,
  } = usePlacement();
  const { theme } = useTheme();

  const [rescheduleModalTask, setRescheduleModalTask] = useState<PlacementDailyTask | null>(null);

  // Quick problem log form
  const [showAddProblemForm, setShowAddProblemForm] = useState(false);
  const [problemName, setProblemName] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [problemUrl, setProblemUrl] = useState('');
  const [problemTimeSpent, setProblemTimeSpent] = useState(30);
  const [problemNotes, setProblemNotes] = useState('');

  const { addProblem } = useDSA();

  const handleLogProblem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!problemName.trim()) return;

    // Add to core DSA problem bank
    addProblem({
      title: problemName.trim(),
      difficulty,
      topic: 'Placement Prep Sprint',
      platform: 'LeetCode',
      url: problemUrl.trim() || undefined,
      status: 'Solved Independently',
      timeSpentMinutes: Number(problemTimeSpent) || 30,
      notes: problemNotes.trim() || undefined,
      inTodayPlan: true,
      solvedIndependently: true,
    });

    setProblemName('');
    setProblemUrl('');
    setProblemNotes('');
    setShowAddProblemForm(false);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner: Mon-Fri DSA + Project Blueprint */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#0e1024] border border-violet-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
              Monday–Friday Sprint
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Core Technical Competence
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            DSA Grind + Project Development Hour
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every weekday: Solve at least 2 LeetCode problems (min 1 Medium) and dedicate 1 focused hour to building, debugging, or shipping portfolio features.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-stretch md:self-auto">
          <button
            onClick={() => setShowAddProblemForm(!showAddProblemForm)}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={15} />
            <span>{showAddProblemForm ? 'Close Form' : 'Log DSA Problem'}</span>
          </button>
          <button
            onClick={onOpenLogProject}
            className="flex-1 md:flex-initial px-4 py-2 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/30 transition-all flex items-center justify-center gap-1.5"
          >
            <Code2 size={15} />
            <span>Log Project Hour</span>
          </button>
        </div>
      </div>

      {/* Quick Add Problem Form Dropdown */}
      {showAddProblemForm && (
        <form
          onSubmit={handleLogProblem}
          className="p-5 rounded-2xl bg-[#12142e] border border-violet-500/40 shadow-2xl space-y-3.5 animate-slide-down"
        >
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Target size={16} className="text-violet-400" />
              <span>Log LeetCode Problem Solved</span>
            </h3>
            <span className="text-xs text-amber-300 font-medium">
              * Minimum 1 Medium problem required daily
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Problem Name *
              </label>
              <input
                type="text"
                required
                placeholder="e.g. 3Sum, Lowest Common Ancestor, Course Schedule"
                value={problemName}
                onChange={(e) => setProblemName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard')}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              >
                <option value="Easy" className="bg-slate-900 text-emerald-400">Easy</option>
                <option value="Medium" className="bg-slate-900 text-amber-400">Medium (Target)</option>
                <option value="Hard" className="bg-slate-900 text-rose-400">Hard</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                LeetCode URL (Optional)
              </label>
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={problemUrl}
                onChange={(e) => setProblemUrl(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Time Spent (Minutes)
              </label>
              <input
                type="number"
                min={5}
                max={180}
                value={problemTimeSpent}
                onChange={(e) => setProblemTimeSpent(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-black/40 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Key Pattern Learned / Notes
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Used two-pointer approach after sorting to achieve O(n^2) instead of O(n^3)."
              value={problemNotes}
              onChange={(e) => setProblemNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/40 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-2 border-t border-white/10">
            <button
              type="button"
              onClick={() => setShowAddProblemForm(false)}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-slate-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md"
            >
              Save Problem
            </button>
          </div>
        </form>
      )}

      {/* Overdue / Missed Tasks Section (Preserved Until Completed or Rescheduled) */}
      {overdueTasks.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-amber-400">
            <AlertTriangle size={18} />
            <h3 className="text-sm font-bold tracking-tight">
              Unfinished Tasks From Previous Days ({overdueTasks.length})
            </h3>
            <span className="text-xs text-slate-400">
              — Kept visible until completed or explicitly rescheduled
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {overdueTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 shadow-md flex items-center justify-between"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                      Due: {task.date}
                    </span>
                    <span className="text-xs font-bold text-white">{task.title}</span>
                  </div>
                  {task.description && (
                    <p className="text-xs text-slate-300 line-clamp-1">{task.description}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-3 flex-shrink-0">
                  <button
                    onClick={() => toggleTaskStatus(task.id, 'completed')}
                    className="p-1.5 rounded-lg bg-emerald-600/30 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/40 transition-colors"
                    title="Mark complete now"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => setRescheduleModalTask(task)}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                    title="Reschedule to later date"
                  >
                    <RotateCcw size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Today's Tasks Interactive List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar size={16} className="text-violet-400" />
          <span>Today's Placement Objectives</span>
        </h3>

        <div className="space-y-3">
          {todayTasks.map((task) => {
            const isCompleted = task.status === 'completed';
            const isPartial = task.status === 'partially_completed';

            return (
              <div
                key={task.id}
                className={`p-4 rounded-2xl border transition-all ${
                  isCompleted
                    ? 'bg-emerald-950/20 border-emerald-500/40 text-slate-200'
                    : isPartial
                    ? 'bg-amber-950/20 border-amber-500/40 text-slate-200'
                    : 'bg-[#101228]/80 border-violet-500/20 text-white'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start space-x-3.5">
                    {/* Status Toggle Button */}
                    <button
                      onClick={() => {
                        const nextStatus: TaskCompletionStatus = isCompleted
                          ? 'pending'
                          : isPartial
                          ? 'completed'
                          : 'completed';
                        toggleTaskStatus(task.id, nextStatus);
                      }}
                      className={`mt-0.5 w-6 h-6 rounded-lg border flex items-center justify-center transition-all ${
                        isCompleted
                          ? 'bg-emerald-600 border-emerald-500 text-white shadow-md'
                          : isPartial
                          ? 'bg-amber-600/30 border-amber-500 text-amber-300'
                          : 'border-slate-500 hover:border-violet-400 text-transparent'
                      }`}
                      title="Click to toggle completion status"
                    >
                      <CheckCircle2 size={16} />
                    </button>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`text-sm font-bold ${
                            isCompleted ? 'line-through text-slate-400' : 'text-white'
                          }`}
                        >
                          {task.title}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            isCompleted
                              ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                              : isPartial
                              ? 'bg-amber-950 text-amber-300 border border-amber-500/30'
                              : 'bg-white/5 text-slate-400'
                          }`}
                        >
                          {isCompleted
                            ? 'Completed'
                            : isPartial
                            ? 'Partially Done'
                            : 'Pending'}
                        </span>
                      </div>

                      {task.description && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      {/* DSA Task Specific Live Progress */}
                      {task.category === 'dsa' && (
                        <div className="mt-2.5 flex items-center space-x-3 text-xs">
                          <span className="font-semibold text-slate-300">
                            Live Count: {todayDsaSolvedCount} / {settings.dailyDsaTarget || 2} solved
                          </span>
                          <span
                            className={`font-semibold ${
                              hasMediumDsaSolvedToday ? 'text-emerald-400' : 'text-amber-400'
                            }`}
                          >
                            {hasMediumDsaSolvedToday ? '✓ Medium solved' : '• Medium pending'}
                          </span>
                        </div>
                      )}

                      {/* Project Task Specific Live Progress */}
                      {task.category === 'project' && (
                        <div className="mt-2.5 flex items-center space-x-3 text-xs">
                          <span className="font-semibold text-slate-300">
                            Logged today: {todayProjectMinutes} / {(settings.dailyProjectHours || 1) * 60} mins
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Right side actions */}
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => {
                        const next: TaskCompletionStatus =
                          task.status === 'pending'
                            ? 'partially_completed'
                            : task.status === 'partially_completed'
                            ? 'completed'
                            : 'pending';
                        toggleTaskStatus(task.id, next);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-medium text-slate-300 border border-white/10 transition-colors"
                    >
                      {task.status === 'pending'
                        ? 'Mark Partial'
                        : task.status === 'partially_completed'
                        ? 'Mark Complete'
                        : 'Reset'}
                    </button>
                    <button
                      onClick={() => setRescheduleModalTask(task)}
                      className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                      title="Reschedule task"
                    >
                      <RotateCcw size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reschedule Modal */}
      <RescheduleTaskModal
        isOpen={Boolean(rescheduleModalTask)}
        onClose={() => setRescheduleModalTask(null)}
        task={rescheduleModalTask}
      />
    </div>
  );
};
