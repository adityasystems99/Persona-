import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  Calendar,
  XCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem } from '../../types/dsa';
import { DifficultyBadge } from '../common/Badge';

export const AdaptiveRecoveryBanner: React.FC = () => {
  const {
    incompleteTasks,
    stlState,
    carryOverTasksToToday,
    rescheduleTaskDate,
    skipTaskWithReason,
    retainTaskInQueue,
  } = useDSA();

  const [expanded, setExpanded] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Problem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [skipReason, setSkipReason] = useState('Need to study prerequisites first');
  const [activeActionModal, setActiveActionModal] = useState<'reschedule' | 'skip' | null>(null);

  // If all problems in today's plan are solved and STL is completed, no recovery needed
  const hasIncomplete = incompleteTasks.length > 0;
  const stlPending = !stlState.isCompleted;

  if (!hasIncomplete && !stlPending) {
    return null;
  }

  const handleOpenReschedule = (task: Problem) => {
    setSelectedTask(task);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setRescheduleDate(tomorrow.toISOString().slice(0, 10));
    setActiveActionModal('reschedule');
  };

  const handleConfirmReschedule = () => {
    if (!selectedTask || !rescheduleDate) return;
    rescheduleTaskDate(selectedTask.id, rescheduleDate);
    setActiveActionModal(null);
    setSelectedTask(null);
  };

  const handleOpenSkip = (task: Problem) => {
    setSelectedTask(task);
    setActiveActionModal('skip');
  };

  const handleConfirmSkip = () => {
    if (!selectedTask) return;
    skipTaskWithReason(selectedTask.id, skipReason);
    setActiveActionModal(null);
    setSelectedTask(null);
  };

  return (
    <div className="card-soft border-l-4 border-l-amber-500 p-5 bg-gradient-to-r from-amber-50/50 via-white to-rose-50/20 shadow-sm transition-all duration-200">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Banner Title & Summary */}
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <RotateCcw size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                Adaptive Recovery Engine
              </span>
              {hasIncomplete && (
                <span className="text-xs font-semibold text-slate-500">
                  {incompleteTasks.length} pending task{incompleteTasks.length > 1 ? 's' : ''}
                </span>
              )}
            </div>

            <h3 className="text-sm sm:text-base font-bold text-slate-800 mt-1">
              Active Session Backlog & Recovery Planner
            </h3>

            <p className="text-xs text-slate-500 mt-0.5 max-w-2xl leading-relaxed">
              Incomplete tasks remain visibly pending and will never be marked complete automatically.
              Carry unfinished problems forward into your current session, reschedule with recorded audit notes, or explicitly skip.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <button
            onClick={() => carryOverTasksToToday(incompleteTasks.map((t) => t.id))}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            <span>Carry All to Today</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 flex items-center space-x-1 transition-colors"
          >
            <span>{expanded ? 'Hide Details' : 'Manage Tasks'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Task Management List */}
      {expanded && (
        <div className="mt-5 pt-4 border-t border-amber-100/80 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
            <span>Pending Workload Items</span>
            <span className="text-slate-400 font-normal">
              Daily targets recalculate automatically on rescheduling
            </span>
          </div>

          <div className="space-y-2.5">
            {incompleteTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-white border border-slate-200/90 hover:border-slate-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-amber-500 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-slate-800 text-xs truncate max-w-xs sm:max-w-md">
                        {task.title}
                      </span>
                      <DifficultyBadge difficulty={task.difficulty} />
                    </div>
                    <div className="flex items-center space-x-2 text-[11px] text-slate-400 mt-0.5">
                      <span>{task.topic}</span>
                      <span>•</span>
                      <span>Status: {task.status}</span>
                      {task.rescheduleHistory && task.rescheduleHistory.length > 0 && (
                        <>
                          <span>•</span>
                          <span className="text-amber-600 font-medium">
                            Rescheduled {task.rescheduleHistory.length}x
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Individual Task Actions */}
                <div className="flex items-center space-x-2 self-end sm:self-auto">
                  <button
                    onClick={() => retainTaskInQueue(task.id)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
                    title="Retain visibly in study queue"
                  >
                    Retain
                  </button>

                  <button
                    onClick={() => handleOpenReschedule(task)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/60 flex items-center space-x-1 transition-colors"
                  >
                    <Calendar size={12} />
                    <span>Reschedule</span>
                  </button>

                  <button
                    onClick={() => handleOpenSkip(task)}
                    className="px-2.5 py-1 text-[11px] font-semibold rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 flex items-center space-x-1 transition-colors"
                  >
                    <XCircle size={12} />
                    <span>Skip</span>
                  </button>
                </div>
              </div>
            ))}

            {/* STL Practice item if pending */}
            {stlPending && (
              <div className="p-3.5 rounded-xl bg-rose-50/60 border border-rose-200/80 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-rose-500 flex-shrink-0" />
                  <div>
                    <span className="font-bold text-rose-900 text-xs">
                      Daily Mandatory 30-Min C++ STL Session
                    </span>
                    <p className="text-[11px] text-rose-600">
                      Still pending for today • Drill containers, algorithms, and custom comparators.
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-rose-700 px-3 py-1 rounded-lg bg-white border border-rose-200">
                  {Math.round(stlState.remainingSeconds / 60)}m left
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {activeActionModal === 'reschedule' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="font-bold text-slate-800 text-base mb-1">
              Reschedule DSA Task
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Select target study date for <strong className="text-slate-700">{selectedTask.title}</strong>. Daily target distribution will automatically update.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Target Study Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Audit Reason (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Need to revise graph foundations first"
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 text-xs font-bold text-white gradient-coral shadow-glow-coral rounded-xl transition-all"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Modal */}
      {activeActionModal === 'skip' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h4 className="font-bold text-slate-800 text-base mb-1">
              Explicitly Skip Task
            </h4>
            <p className="text-xs text-slate-500 mb-4">
              Skipping removes the task from current plan while recording an audit log reason.
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Reason for Skipping
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
              >
                <option value="Need to study prerequisites first">Need to study prerequisites first</option>
                <option value="Already mastered concept in another problem">Already mastered concept in another problem</option>
                <option value="Too advanced for current preparation stage">Too advanced for current preparation stage</option>
                <option value="Temporarily deprioritized">Temporarily deprioritized</option>
              </select>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-4 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all"
              >
                Confirm Skip
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
