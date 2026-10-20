import React, { useState } from 'react';
import {
  Bell,
  Clock,
  Volume2,
  Smartphone,
  ShieldCheck,
  ShieldAlert,
  Calendar,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
  Sliders,
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';
import { soundFx } from '../../utils/audio';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const ReminderEngineConfigView: React.FC = () => {
  const {
    settings,
    updateSettings,
    reminders,
    updateReminder,
    toggleReminderEnabled,
    notificationPermission,
    requestPermission,
  } = usePlacement();
  const { theme } = useTheme();

  const [testChimePlaying, setTestChimePlaying] = useState(false);

  const handleTestChime = () => {
    setTestChimePlaying(true);
    soundFx.playReminderChime();
    if (settings.vibrationEnabled) {
      soundFx.triggerVibration([200, 100, 200]);
    }
    setTimeout(() => setTestChimePlaying(false), 800);
  };

  const handleToggleDay = (reminderId: string, currentDays: number[], dayIndex: number) => {
    let nextDays: number[];
    if (currentDays.includes(dayIndex)) {
      if (currentDays.length <= 1) return; // Keep at least 1 day
      nextDays = currentDays.filter((d) => d !== dayIndex);
    } else {
      nextDays = [...currentDays, dayIndex].sort((a, b) => a - b);
    }
    updateReminder(reminderId, { preferredDays: nextDays });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Engine Overview Header */}
      <div className="p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-600 text-white">
              Smart Reminder Engine
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Configurable & Idempotent
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            Placement Schedule & Alert Preferences
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Customize notification schedules for morning reviews, weekday DSA sessions, project hour, daily application sprints, and weekend assessments.
          </p>
        </div>

        <button
          onClick={handleTestChime}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 border ${
            testChimePlaying
              ? 'bg-emerald-600 border-emerald-400 text-white'
              : 'bg-white/5 hover:bg-white/10 border-white/10 text-slate-200'
          }`}
        >
          <Volume2 size={16} className={testChimePlaying ? 'animate-spin' : ''} />
          <span>{testChimePlaying ? 'Playing Chime...' : 'Test Sound & Vibe'}</span>
        </button>
      </div>

      {/* Critical Notification Clarification & Browser Background Status */}
      <div className="p-5 rounded-2xl bg-[#0c0e22] border border-blue-500/30 shadow-lg space-y-3">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 mt-0.5 flex-shrink-0">
              <Info size={18} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Browser Notification Delivery & Limitations</span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    notificationPermission === 'granted'
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-amber-950 text-amber-300 border border-amber-500/30'
                  }`}
                >
                  Permission: {notificationPermission}
                </span>
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Persona delivers full in-app modals and audio alerts whenever the web app is open in any browser tab. When desktop or mobile notifications are enabled, you receive system pop-ups while your browser is running.
              </p>
              <div className="mt-2.5 p-3 rounded-xl bg-black/40 border border-white/5 text-[11px] text-slate-400 space-y-1">
                <p>
                  <strong>Note on Closed Browser State:</strong> Standard browser client timers pause when the browser is completely quit or suspended by mobile OS battery savers. If persistent offline background push is required when Persona is totally closed, ensure a Web Push Service Worker or Supabase Edge Cron webhook is configured.
                </p>
              </div>
            </div>
          </div>

          {notificationPermission !== 'granted' ? (
            <button
              onClick={requestPermission}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all flex items-center gap-1.5 flex-shrink-0"
            >
              <Bell size={14} />
              <span>Enable Browser Alerts</span>
            </button>
          ) : (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1 flex-shrink-0">
              <ShieldCheck size={16} /> Granted
            </span>
          )}
        </div>
      </div>

      {/* Global Alert & Target Preferences */}
      <div className="p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/20 shadow-xl space-y-4">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Sliders size={16} className="text-violet-400" />
          <span>Daily & Weekly Goals Configuration</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily Applications Target
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={settings.dailyApplicationTarget}
              onChange={(e) =>
                updateSettings({ dailyApplicationTarget: Number(e.target.value) || 10 })
              }
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Weekly Referrals Target
            </label>
            <input
              type="number"
              min={1}
              max={30}
              value={settings.weeklyReferralTarget}
              onChange={(e) =>
                updateSettings({ weeklyReferralTarget: Number(e.target.value) || 7 })
              }
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily DSA Problem Target
            </label>
            <input
              type="number"
              min={1}
              max={10}
              value={settings.dailyDsaTarget}
              onChange={(e) =>
                updateSettings({ dailyDsaTarget: Number(e.target.value) || 2 })
              }
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Daily Project Hours
            </label>
            <input
              type="number"
              min={1}
              max={6}
              value={settings.dailyProjectHours}
              onChange={(e) =>
                updateSettings({ dailyProjectHours: Number(e.target.value) || 1 })
              }
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
            />
          </div>
        </div>

        {/* Audio, Vibration, Timezone Toggles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-white/10">
          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) => updateSettings({ soundEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-violet-600 focus:ring-0 bg-black/30 border-white/20"
            />
            <span className="text-xs font-semibold text-slate-300">
              Audio Chimes Enabled
            </span>
          </label>

          <label className="flex items-center space-x-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.vibrationEnabled}
              onChange={(e) => updateSettings({ vibrationEnabled: e.target.checked })}
              className="w-4 h-4 rounded text-violet-600 focus:ring-0 bg-black/30 border-white/20"
            />
            <span className="text-xs font-semibold text-slate-300">
              Mobile Vibration Alerts
            </span>
          </label>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-semibold text-slate-400">Timezone:</span>
            <input
              type="text"
              value={settings.timezone}
              onChange={(e) => updateSettings({ timezone: e.target.value })}
              className="px-2.5 py-1 rounded-lg bg-black/30 border border-violet-500/30 text-xs text-white focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Individual Reminder Schedules List */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar size={16} className="text-violet-400" />
          <span>Configurable Preparation Reminder Schedules</span>
        </h3>

        <div className="space-y-3">
          {reminders.map((rem) => (
            <div
              key={rem.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                rem.enabled
                  ? 'bg-[#101228]/80 border-violet-500/20 shadow-lg'
                  : 'bg-black/20 border-white/5 opacity-60'
              }`}
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2.5">
                    <button
                      onClick={() => toggleReminderEnabled(rem.id)}
                      className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                        rem.enabled
                          ? 'bg-violet-600 border-violet-500 text-white'
                          : 'border-slate-500 text-transparent'
                      }`}
                      title="Enable or disable reminder"
                    >
                      <CheckCircle2 size={14} />
                    </button>

                    <h4 className="text-sm font-bold text-white">{rem.title}</h4>
                  </div>
                  <p className="text-xs text-slate-400 ml-7 leading-relaxed">
                    {rem.description}
                  </p>
                </div>

                {/* Preferred Time & Active Days */}
                <div className="flex items-center space-x-3 ml-7 sm:ml-0 flex-shrink-0">
                  <div className="flex items-center space-x-1.5">
                    <Clock size={14} className="text-violet-400" />
                    <input
                      type="time"
                      value={rem.preferredTime}
                      onChange={(e) =>
                        updateReminder(rem.id, { preferredTime: e.target.value })
                      }
                      className="px-2.5 py-1 rounded-lg bg-black/40 border border-violet-500/30 text-xs font-bold text-white focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Day selection pills */}
              <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center gap-1.5 ml-7 sm:ml-0">
                <span className="text-[11px] font-semibold text-slate-400 mr-1.5">
                  Active Days:
                </span>
                {DAY_LABELS.map((dayLabel, idx) => {
                  const isActive = rem.preferredDays.includes(idx);
                  return (
                    <button
                      key={dayLabel}
                      type="button"
                      onClick={() => handleToggleDay(rem.id, rem.preferredDays, idx)}
                      className={`px-2 py-0.5 rounded-md text-[11px] font-semibold border transition-all ${
                        isActive
                          ? 'bg-violet-600/30 border-violet-500/50 text-violet-300'
                          : 'bg-white/5 border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {dayLabel}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
