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
  } = useDSA();

  const [expanded, setExpanded] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Problem | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState('');
  const [skipReason, setSkipReason] = useState('Need to study prerequisites first');
  const [activeActionModal, setActiveActionModal] = useState<'reschedule' | 'skip' | null>(null);

  // Only render if there are actually incomplete tasks
  if (incompleteTasks.length === 0) {
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
    <div className="card-soft border-l-4 border-l-violet-500 p-5 bg-[#12142e]/90 border border-violet-500/20 shadow-glass-panel transition-all duration-200 mb-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Banner Title & Summary */}
        <div className="flex items-start space-x-3.5">
          <div className="w-10 h-10 rounded-xl bg-violet-950/70 text-violet-400 border border-violet-500/30 flex items-center justify-center flex-shrink-0 mt-0.5 shadow-sm">
            <RotateCcw size={20} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md bg-violet-950/80 text-violet-300 border border-violet-500/30">
                Adaptive Recovery Engine
              </span>
              <span className="text-xs font-semibold text-slate-400">
                {incompleteTasks.length} pending mission{incompleteTasks.length > 1 ? 's' : ''}
              </span>
            </div>

            <h3 className="text-sm sm:text-base font-bold text-white mt-1">
              Mission Recovery & Backlog Rescheduler
            </h3>

            <p className="text-xs text-slate-400 mt-0.5 max-w-2xl leading-relaxed">
              Unconquered tasks remain pending and will never be fabricated.
              Carry unfinished problems into today's mission, reschedule to future dates, or mark as skipped.
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <button
            onClick={() => carryOverTasksToToday(incompleteTasks.map((t) => t.id))}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all"
          >
            <RotateCcw size={14} />
            <span>Carry All to Today</span>
          </button>

          <button
            onClick={() => setExpanded(!expanded)}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#0b0c1e] border border-violet-500/20 hover:bg-[#151733] flex items-center space-x-1 transition-colors"
          >
            <span>{expanded ? 'Hide Details' : 'Manage Tasks'}</span>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Expanded Task Management List */}
      {expanded && (
        <div className="mt-5 pt-4 border-t border-violet-900/30 animate-in fade-in duration-200">
          <div className="text-xs font-bold text-slate-300 mb-3 flex items-center justify-between">
            <span>Pending Workload Items</span>
            <span className="text-slate-400 font-normal">
              Daily targets recalculate automatically on rescheduling
            </span>
          </div>

          <div className="space-y-2.5">
            {incompleteTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-[#0b0c1e] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs"
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-xs text-white truncate">
                        {task.title}
                      </span>
                      <DifficultyBadge difficulty={task.difficulty} size="sm" />
                    </div>
                    <span className="text-[11px] text-slate-400">{task.topic}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleOpenReschedule(task)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-300 hover:text-white bg-[#151733] border border-violet-500/20 rounded-lg"
                  >
                    Reschedule
                  </button>
                  <button
                    onClick={() => handleOpenSkip(task)}
                    className="px-2.5 py-1 text-xs font-medium text-slate-400 hover:text-rose-400 bg-[#151733] border border-violet-500/20 rounded-lg"
                  >
                    Skip
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reschedule Modal */}
      {activeActionModal === 'reschedule' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12142e] rounded-2xl max-w-md w-full p-6 shadow-glass-panel border border-violet-500/30 animate-in fade-in zoom-in-95 duration-150 text-white">
            <h4 className="font-bold text-white text-base mb-1">
              Reschedule DSA Task
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Select target study date for <strong className="text-violet-300">{selectedTask.title}</strong>.
            </p>

            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Target Study Date
                </label>
                <input
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  className="w-full text-xs font-semibold px-3 py-2 bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-2">
              <button
                onClick={() => setActiveActionModal(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReschedule}
                className="px-4 py-2 text-xs font-bold text-white gradient-violet shadow-glow-violet rounded-xl transition-all"
              >
                Confirm Reschedule
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skip Modal */}
      {activeActionModal === 'skip' && selectedTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#12142e] rounded-2xl max-w-md w-full p-6 shadow-glass-panel border border-violet-500/30 animate-in fade-in zoom-in-95 duration-150 text-white">
            <h4 className="font-bold text-white text-base mb-1">
              Explicitly Skip Task
            </h4>
            <p className="text-xs text-slate-400 mb-4">
              Skipping removes the task from current plan while recording an audit log reason.
            </p>

            <div className="space-y-3 mb-5">
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Reason for Skipping
              </label>
              <select
                value={skipReason}
                onChange={(e) => setSkipReason(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30"
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
                className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmSkip}
                className="px-4 py-2 text-xs font-bold text-white bg-violet-600 hover:bg-violet-700 rounded-xl transition-all"
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
