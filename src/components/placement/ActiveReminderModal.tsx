import React, { useState } from 'react';
import {
  Bell,
  Clock,
  CheckCircle2,
  X,
  Calendar,
  Volume2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

export const ActiveReminderModal: React.FC = () => {
  const {
    activeReminderAlert,
    dismissActiveAlert,
    snoozeActiveAlert,
    completeActiveAlertTask,
    rescheduleReminder,
  } = usePlacement();
  const { theme } = useTheme();

  const [rescheduleTime, setRescheduleTime] = useState('11:00');
  const [showReschedule, setShowReschedule] = useState(false);

  if (!activeReminderAlert) return null;

  const { reminder } = activeReminderAlert;

  const handleReschedule = () => {
    rescheduleReminder(reminder.id, rescheduleTime);
    dismissActiveAlert();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transition-all relative overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-amber-500/40 text-slate-800'
            : 'bg-[#12142e] border-violet-500/40 text-white'
        }`}
      >
        {/* Ambient Top Glow */}
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-72 h-24 bg-violet-600/30 blur-2xl pointer-events-none rounded-full" />

        {/* Header */}
        <div className="flex items-start justify-between relative z-10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-xl bg-violet-600/20 border border-violet-500/40 flex items-center justify-center text-violet-400 shadow-inner">
              <Bell size={24} className="animate-bounce" />
            </div>
            <div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/30">
                Scheduled Reminder • {reminder.preferredTime}
              </span>
              <h3 className="text-xl font-bold mt-1 text-white tracking-tight">
                {reminder.title}
              </h3>
            </div>
          </div>
          <button
            onClick={dismissActiveAlert}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors"
            title="Dismiss reminder"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="my-5 space-y-3 relative z-10">
          <p className="text-sm text-slate-300 leading-relaxed bg-black/20 p-3.5 rounded-xl border border-white/5">
            {reminder.description}
          </p>

          {showReschedule && (
            <div className="p-3.5 rounded-xl bg-violet-950/40 border border-violet-500/30 space-y-2">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <Clock size={14} className="text-violet-400" />
                Select new reminder time today:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="time"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  className="bg-black/30 border border-violet-500/30 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:border-violet-400"
                />
                <button
                  onClick={handleReschedule}
                  className="px-3.5 py-1.5 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold transition-all shadow-md flex items-center gap-1"
                >
                  Confirm <ArrowRight size={13} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="space-y-3 relative z-10 pt-2 border-t border-white/10">
          {/* Complete Task Primary Button */}
          <button
            onClick={completeActiveAlertTask}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-950/50 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
          >
            <CheckCircle2 size={18} />
            <span>Mark Goal Completed for Today</span>
          </button>

          {/* Snooze Options */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs font-medium text-slate-400 flex items-center gap-1">
              <Clock size={13} /> Snooze:
            </span>
            <div className="flex items-center space-x-1.5">
              <button
                onClick={() => snoozeActiveAlert(10)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                10 mins
              </button>
              <button
                onClick={() => snoozeActiveAlert(30)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                30 mins
              </button>
              <button
                onClick={() => snoozeActiveAlert(60)}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-medium text-slate-200 transition-colors"
              >
                1 hour
              </button>
            </div>
          </div>

          {/* Secondary Footer Actions */}
          <div className="flex items-center justify-between text-xs pt-1">
            <button
              onClick={() => setShowReschedule(!showReschedule)}
              className="text-violet-400 hover:text-violet-300 font-medium flex items-center gap-1 transition-colors"
            >
              <Calendar size={13} />
              {showReschedule ? 'Cancel Reschedule' : 'Reschedule to Later'}
            </button>
            <button
              onClick={dismissActiveAlert}
              className="text-slate-400 hover:text-slate-200 transition-colors"
            >
              Dismiss for Today
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
