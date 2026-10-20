import React, { useState } from 'react';
import {
  X,
  Calendar,
  Clock,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';
import { PlacementDailyTask } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface RescheduleTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: PlacementDailyTask | null;
}

export const RescheduleTaskModal: React.FC<RescheduleTaskModalProps> = ({
  isOpen,
  onClose,
  task,
}) => {
  const { rescheduleTask } = usePlacement();
  const { theme } = useTheme();

  const [targetDate, setTargetDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1); // Tomorrow by default
    return d.toISOString().slice(0, 10);
  });

  if (!isOpen || !task) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    rescheduleTask(task.id, targetDate);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-md rounded-2xl border shadow-2xl p-6 transition-all relative overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-amber-500/40 text-slate-800'
            : 'bg-[#101228] border-violet-500/40 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <RotateCcw size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Reschedule Task
              </h3>
              <p className="text-xs text-slate-400">
                Move incomplete task forward without losing your preparation history.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Selected Task
            </span>
            <p className="text-sm font-semibold text-white mt-0.5">
              {task.title}
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Original scheduled date: {task.date}
            </p>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              New Target Date
            </label>
            <div className="relative">
              <Calendar size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="date"
                required
                min={new Date().toISOString().slice(0, 10)}
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Quick preset buttons */}
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 1);
                setTargetDate(d.toISOString().slice(0, 10));
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300"
            >
              Tomorrow
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                d.setDate(d.getDate() + 2);
                setTargetDate(d.toISOString().slice(0, 10));
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300"
            >
              In 2 Days
            </button>
            <button
              type="button"
              onClick={() => {
                const d = new Date();
                // Next Saturday
                d.setDate(d.getDate() + ((6 - d.getDay() + 7) % 7 || 7));
                setTargetDate(d.toISOString().slice(0, 10));
              }}
              className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-slate-300"
            >
              Next Weekend
            </button>
          </div>

          {/* Footer Submit */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-violet-950/50 flex items-center space-x-1.5 transition-all"
            >
              <span>Reschedule Task</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
