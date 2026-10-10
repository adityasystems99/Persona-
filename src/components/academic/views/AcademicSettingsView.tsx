import React, { useState } from 'react';
import {
  Settings,
  Percent,
  Clock,
  RotateCcw,
  Bell,
  Database,
  Download,
  Upload,
  RefreshCw,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../../../context/AcademicContext';

export const AcademicSettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    refreshAcademicData,
    isCloudConnected,
    lastSyncTime,
    subjects,
    tasks,
    assignments,
    exams,
    notes,
    resources,
    attendance,
  } = useAcademic();

  const [threshold, setThreshold] = useState(settings.minimumAttendanceThreshold || 75);
  const [dailyTarget, setDailyTarget] = useState(settings.dailyStudyTargetMinutes || 180);
  const [intervalsStr, setIntervalsStr] = useState(
    (settings.revisionIntervals || [1, 3, 7, 14, 30]).join(', ')
  );
  const [reminders, setReminders] = useState(settings.remindersEnabled ?? true);
  const [quietStart, setQuietStart] = useState(settings.quietHoursStart || '23:00');
  const [quietEnd, setQuietEnd] = useState(settings.quietHoursEnd || '07:00');
  const [isSaved, setIsSaved] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const intervals = intervalsStr
      .split(',')
      .map((n) => Number(n.trim()))
      .filter((n) => !isNaN(n) && n > 0);

    await updateSettings({
      minimumAttendanceThreshold: Number(threshold),
      dailyStudyTargetMinutes: Number(dailyTarget),
      revisionIntervals: intervals.length > 0 ? intervals : [1, 3, 7, 14, 30],
      remindersEnabled: reminders,
      quietHoursStart: quietStart || undefined,
      quietHoursEnd: quietEnd || undefined,
    });

    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  const handleTriggerRefresh = async () => {
    setIsRefreshing(true);
    await refreshAcademicData();
    setIsRefreshing(false);
  };

  const handleExportJson = () => {
    const backupData = {
      version: '2.0-academic',
      exportedAt: new Date().toISOString(),
      subjects,
      tasks,
      assignments,
      exams,
      notes,
      resources,
      attendance,
      settings,
    };
    const blob = new Blob([JSON.stringify(backupData, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `algopulse-academic-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl animate-in fade-in duration-300">
      {/* Top Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
          <Settings className="text-violet-400" size={24} />
          Academic Intelligence Preferences
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Configure attendance thresholds, spaced interval algorithms, and cloud persistence
        </p>
      </div>

      {/* Cloud Status Card */}
      <div className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <Database size={20} />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              Supabase Live Cloud Persistence
              <span
                className={`inline-block w-2.5 h-2.5 rounded-full ${
                  isCloudConnected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
            </h3>
            <p className="text-xs text-slate-400">
              {isCloudConnected
                ? `Active authenticated session • Last synced at ${lastSyncTime || 'Session launch'}`
                : 'Offline fallback active (saved in localStorage). Sign into AlgoPulse to sync with Supabase.'}
            </p>
          </div>
        </div>

        <button
          onClick={handleTriggerRefresh}
          disabled={isRefreshing}
          className="px-3.5 py-2 rounded-xl bg-[#090a16] border border-violet-500/20 hover:border-violet-500/50 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <RefreshCw size={13} className={isRefreshing ? 'animate-spin' : ''} />
          <span>Sync Now</span>
        </button>
      </div>

      {/* Settings Form */}
      <form onSubmit={handleSave} className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-6">
        {/* Attendance Threshold */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Minimum Attendance Threshold (%)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="50"
              max="95"
              value={threshold}
              onChange={(e) => setThreshold(Number(e.target.value))}
              className="w-32 px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-violet-500"
            />
            <span className="text-xs text-slate-400">
              Alert will trigger whenever a subject falls below this percentage (standard is 75%).
            </span>
          </div>
        </div>

        {/* Daily Study Target */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Daily Study Target (Minutes)
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="number"
              min="30"
              step="30"
              value={dailyTarget}
              onChange={(e) => setDailyTarget(Number(e.target.value))}
              className="w-32 px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-violet-500"
            />
            <span className="text-xs text-slate-400">
              Goal duration for engineering subject preparation (e.g. 180m = 3 hours).
            </span>
          </div>
        </div>

        {/* Spaced Intervals */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Spaced Repetition Review Intervals (Days)
          </label>
          <input
            type="text"
            value={intervalsStr}
            onChange={(e) => setIntervalsStr(e.target.value)}
            placeholder="1, 3, 7, 14, 30"
            className="w-full max-w-md px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-violet-500"
          />
          <p className="text-xs text-slate-400">
            Comma-separated sequence of days after which a topic recall is scheduled.
          </p>
        </div>

        {/* Reminders & Quiet Hours */}
        <div className="space-y-3 pt-2 border-t border-violet-900/30">
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="reminders"
              checked={reminders}
              onChange={(e) => setReminders(e.target.checked)}
              className="w-4 h-4 rounded border-violet-500/40 text-violet-600 focus:ring-violet-500 bg-[#090a16]"
            />
            <label htmlFor="reminders" className="text-sm font-semibold text-slate-200">
              Enable in-app alerts and browser notifications
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Quiet Hours Start
              </label>
              <input
                type="time"
                value={quietStart}
                onChange={(e) => setQuietStart(e.target.value)}
                className="w-full px-3 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400 mb-1">
                Quiet Hours End
              </label>
              <input
                type="time"
                value={quietEnd}
                onChange={(e) => setQuietEnd(e.target.value)}
                className="w-full px-3 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-violet-900/30 flex items-center justify-between">
          {isSaved ? (
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={16} /> Preferences Saved & Synced!
            </span>
          ) : (
            <span className="text-xs text-slate-500">Changes persist to Supabase & localStorage</span>
          )}

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all"
          >
            Save Preferences
          </button>
        </div>
      </form>

      {/* Backup and Data Export */}
      <div className="p-6 rounded-2xl bg-[#0f1128] border border-violet-500/20 shadow-xl space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Download size={18} className="text-violet-400" />
            Curriculum Export & Portability
          </h2>
          <p className="text-xs text-slate-400">
            Export a full JSON archive of your 5th semester subjects, units, notes, and attendance
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportJson}
            className="px-4 py-2.5 rounded-xl bg-[#090a16] border border-violet-500/20 hover:border-violet-500/50 text-xs font-semibold text-slate-200 transition-colors flex items-center gap-2"
          >
            <Download size={14} className="text-violet-400" />
            <span>Export Academic Backup (.JSON)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
