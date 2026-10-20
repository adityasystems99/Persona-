import React, { useRef, useState } from 'react';
import {
  Settings,
  Bell,
  Clock,
  Download,
  Upload,
  RotateCcw,
  Trash2,
  ShieldCheck,
  ShieldAlert,
  Volume2,
  FileSpreadsheet,
  FileCode,
  Info,
  Cloud,
  UserCheck,
  Database,
  Lamp,
  Sun,
  Moon,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { useTheme } from '../../context/ThemeContext';
import { PullLamp } from '../common/PullLamp';
import {
  checkNotificationPermission,
  requestNotificationPermission,
} from '../../utils/notifications';
import {
  exportDataToJSON,
  exportProblemsToCSV,
  parseImportedJSON,
} from '../../utils/exportImport';
import { isSupabaseConfigured } from '../../lib/supabase';

export const SettingsView: React.FC = () => {
  const {
    settings,
    updateSettings,
    problems,
    dailyPlan,
    stlState,
    stlTopics,
    studyLogs,
    resetToSampleData,
    clearAllData,
    importAllData,
    addNotification,
    currentUser,
    setAuthModalOpen,
  } = useDSA();
  const { theme, setTheme } = useTheme();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    checkNotificationPermission()
  );

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
      addNotification('Permissions Granted', 'Orbital transmission notifications will alert you on hourly check-ins.', 'success');
    }
  };

  const handleExportJSON = () => {
    const backup = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      problems,
      dailyPlan,
      stlState,
      stlTopics,
      settings,
      studyLogs,
    };
    exportDataToJSON(backup, `algopulse-orbital-backup-${new Date().toISOString().slice(0, 10)}.json`);
  };

  const handleExportCSV = () => {
    exportProblemsToCSV(problems);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const parsed = parseImportedJSON(content);
      if (parsed) {
        importAllData(parsed);
      } else {
        alert('Invalid JSON file format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
        <div className="flex items-center space-x-2.5">
          <span className="p-2 rounded-xl gradient-violet text-white shadow-glow-violet">
            <Settings size={18} />
          </span>
          <h2 className="text-xl font-extrabold text-white tracking-tight">
            Orbital Station Command & Configuration
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1">
          Configure flight windows, telemetry check-in intervals, cloud replication, audio signals, and orbital backups.
        </p>
      </div>

      {/* Interactive Vintage Banker's Pull-Cord Lamp Section */}
      <div className="card-soft p-6 space-y-4 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <Lamp size={18} className="text-amber-400" />
            <div>
              <h3 className="font-bold text-sm text-white">
                Interactive Banker&apos;s Desk Lamp &bull; Theme Switcher
              </h3>
              <p className="text-[11px] text-slate-400">
                Pull the brass cord down or click to switch between Dark Cosmic Orbit and Warm Daylight
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border transition-all ${
              theme === 'light'
                ? 'bg-amber-500/15 text-amber-300 border-amber-400/30'
                : 'bg-violet-950/70 text-violet-300 border-violet-500/30'
            }`}
          >
            {theme === 'light' ? <Sun size={13} /> : <Moon size={13} />}
            <span>{theme === 'light' ? 'Daylight Active' : 'Dark Mode Active'}</span>
          </span>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-4 rounded-2xl bg-[#080916] border border-violet-500/20">
          <div className="w-full max-w-[260px] mx-auto">
            <PullLamp
              theme={theme}
              onThemeChange={(newTheme) => setTheme(newTheme)}
              width="100%"
              soundEnabled={true}
            />
          </div>

          <div className="flex-1 space-y-3 text-xs text-slate-300">
            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
              <span className="font-bold text-white block mb-1">🎮 Physics &amp; Gesture Simulation</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Features real-time 2nd-order differential spring physics with vertical damping ($k=220, d=19$) and lateral pendulum sway. A quadratic B&eacute;zier curve recalculates both the brass cord line and beaded chain positions as you pull.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-violet-950/40 border border-violet-500/20">
              <span className="font-bold text-white block mb-1">♿ Full Accessibility &amp; Sound</span>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Includes an accessible hidden button target with dynamic <code>aria-pressed</code> and <code>aria-label</code>. Keyboard users can focus via <kbd className="px-1.5 py-0.5 rounded bg-violet-900/60 text-white font-mono text-[10px]">Tab</kbd> and toggle via <kbd className="px-1.5 py-0.5 rounded bg-violet-900/60 text-white font-mono text-[10px]">Space</kbd> / <kbd className="px-1.5 py-0.5 rounded bg-violet-900/60 text-white font-mono text-[10px]">Enter</kbd>.
              </p>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-violet-900/40 hover:bg-violet-900/60 text-violet-200 border border-violet-500/30 transition-all"
              >
                Switch to {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Cloud Sync & Persistence Section */}
      <div className="card-soft p-6 space-y-4 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <Cloud size={18} className="text-violet-400" />
            <h3 className="font-bold text-sm text-white">
              Cosmic Cloud Sync & Cross-Device Persistence
            </h3>
          </div>
          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#121430] text-violet-300 hover:text-white hover:bg-violet-950/50 border border-violet-500/30 transition-all flex items-center space-x-1.5"
          >
            {currentUser ? <UserCheck size={14} /> : <Database size={14} />}
            <span>{currentUser ? 'Manage Cloud Account' : 'Setup Cloud Sync'}</span>
          </button>
        </div>

        <div className="p-4 rounded-2xl bg-[#080916] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">
              Persistence Mode: {currentUser ? '🟢 Supabase Cloud Active' : isSupabaseConfigured ? '🟡 Supabase Configured (Not Signed In)' : '⚪ Local Storage Mode'}
            </span>
            <span className="text-[11px] text-slate-400 mt-0.5 block leading-relaxed">
              {currentUser
                ? `Active pilot: ${currentUser.email}. All DSA problems, STL sessions, and plans automatically replicate across devices.`
                : 'Data is persisted locally in your browser cache. Connect Supabase to sync telemetry globally.'}
            </span>
          </div>

          <button
            onClick={() => setAuthModalOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex-shrink-0 hover:opacity-95 transition-all"
          >
            {currentUser ? 'Account & Sync' : 'Sign In / Connect'}
          </button>
        </div>
      </div>

      {/* 1. Study Window & Hourly Reminders */}
      <div className="card-soft p-6 space-y-5 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <Clock size={18} className="text-violet-400" />
            <h3 className="font-bold text-sm text-white">
              Orbital Flight Window & Interval Telemetry
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Mission Window Start Time
            </label>
            <input
              type="time"
              value={settings.studyStartTime}
              onChange={(e) => updateSettings({ studyStartTime: e.target.value })}
              className="w-full text-xs bg-[#080916] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Reminders remain silent before this hour
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Mission Window End Time / Standdown
            </label>
            <input
              type="time"
              value={settings.studyEndTime}
              onChange={(e) => updateSettings({ studyEndTime: e.target.value })}
              className="w-full text-xs bg-[#080916] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
            />
            <span className="text-[10px] text-slate-500 mt-0.5 block">
              Reminders automatically mute after this hour
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-0.5">
              Hourly Check-in Cadence
            </label>
            <span className="text-[11px] text-slate-400">
              How often AlgoPulse checks progress while actively studying
            </span>
          </div>
          <select
            value={settings.reminderIntervalMinutes}
            onChange={(e) =>
              updateSettings({
                reminderIntervalMinutes: parseInt(e.target.value, 10),
              })
            }
            className="text-xs bg-[#080916] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 w-44 focus:outline-none focus:border-violet-400"
          >
            <option value={30}>Every 30 Minutes</option>
            <option value={45}>Every 45 Minutes</option>
            <option value={60}>Every 1 Hour (Standard)</option>
            <option value={90}>Every 1.5 Hours</option>
            <option value={120}>Every 2 Hours</option>
          </select>
        </div>
      </div>

      {/* Feature 3: Configurable Spaced Repetition Intervals */}
      <div className="card-soft p-6 space-y-5 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <RotateCcw size={18} className="text-violet-400" />
            <h3 className="font-bold text-sm text-white">
              Spaced Repetition Orbit Multipliers
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Configure the review intervals (in days) applied following successful recall attempts.
          When you solve a problem independently during revision, it advances to the next interval stage.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[0, 1, 2, 3].map((stageIdx) => {
            const intervals = settings.spacedRepetitionIntervals || [1, 3, 7, 14];
            const days = intervals[stageIdx] ?? [1, 3, 7, 14][stageIdx];
            return (
              <div key={stageIdx} className="p-3 rounded-xl bg-[#080916] border border-violet-500/20">
                <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-1">
                  Stage {stageIdx + 1}
                </span>
                <div className="flex items-center space-x-1.5">
                  <input
                    type="number"
                    min="1"
                    max="90"
                    value={days}
                    onChange={(e) => {
                      const nextIntervals = [...intervals];
                      nextIntervals[stageIdx] = Math.max(1, parseInt(e.target.value, 10) || 1);
                      updateSettings({ spacedRepetitionIntervals: nextIntervals });
                    }}
                    className="w-16 text-xs font-mono font-extrabold p-1.5 border border-violet-500/30 rounded-lg bg-[#0c0e22] text-white focus:outline-none focus:border-violet-400"
                  />
                  <span className="text-xs text-slate-400 font-medium">Days</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. Notification Preferences & Background Limitations */}
      <div className="card-soft p-6 space-y-5 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <Bell size={18} className="text-violet-400" />
            <h3 className="font-bold text-sm text-white">
              Notification & Signal Preferences
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Hourly Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                Hourly Flight Directives
              </span>
              <span className="text-[11px] text-slate-400">
                Alert to review problem count and avoid trajectory stall
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.hourlyRemindersEnabled}
              onChange={(e) =>
                updateSettings({ hourlyRemindersEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-violet-500/40 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          {/* STL Pending Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block">
                Pending 30-Min STL Flight Drill Reminder
              </span>
              <span className="text-[11px] text-slate-400">
                Pings during study session if the mandatory STL drill is still uncompleted
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.stlReminderEnabled}
              onChange={(e) =>
                updateSettings({ stlReminderEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-violet-500/40 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          {/* Web Audio Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-white block flex items-center">
                <Volume2 size={13} className="mr-1 text-violet-400" />
                Acoustic Chimes & Fanfares
              </span>
              <span className="text-[11px] text-slate-400">
                Procedural chime on alerts and celebratory audio on flight drill completion
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                updateSettings({ soundEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-violet-600 bg-slate-900 border-violet-500/40 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          {/* Browser Notification Permission Status */}
          <div className="p-4 rounded-2xl bg-[#080916] border border-violet-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {permission === 'granted' ? (
                <ShieldCheck size={20} className="text-emerald-400 flex-shrink-0" />
              ) : (
                <ShieldAlert size={20} className="text-amber-400 flex-shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold text-white block">
                  Desktop System Notifications: {permission.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-400">
                  {permission === 'granted'
                    ? 'Desktop permission active. Notifications display even while in other tabs.'
                    : 'Grant permission for system banner alerts.'}
                </span>
              </div>
            </div>

            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex-shrink-0 hover:opacity-95"
              >
                Request Permission
              </button>
            )}
          </div>

          {/* Background Limitation Notice */}
          <div className="p-3.5 rounded-2xl bg-[#080916] border border-violet-500/20 flex items-start space-x-2.5 text-xs text-slate-300">
            <Info size={16} className="text-violet-400 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">
              <strong className="block mb-0.5 text-white font-semibold">
                Orbital Daemon Transparency
              </strong>
              Web apps trigger timers and reminders while this tab or browser window is active. Pin this mission tab to maintain reliable cadence.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Portability & Backup */}
      <div className="card-soft p-6 space-y-5 bg-[#0c0e22]/90 border border-violet-500/20">
        <div className="flex items-center justify-between pb-3 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <Download size={18} className="text-emerald-400" />
            <h3 className="font-bold text-sm text-white">
              Data Management & Orbital Backup
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-400">
          Your preparation telemetry is saved in local browser storage or cloud database. Export regular backups to safeguard progress.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#080916] border border-violet-500/20 hover:text-white hover:border-violet-500/40 shadow-sm flex items-center space-x-2 transition-colors"
          >
            <FileCode size={15} className="text-violet-400" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-300 bg-[#080916] border border-violet-500/20 hover:text-white hover:border-violet-500/40 shadow-sm flex items-center space-x-2 transition-colors"
          >
            <FileSpreadsheet size={15} className="text-emerald-400" />
            <span>Export Questions (CSV)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-violet-300 bg-[#121430] hover:bg-violet-950/50 border border-violet-500/30 flex items-center space-x-2 transition-colors"
          >
            <Upload size={15} />
            <span>Import JSON Backup</span>
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
        </div>

        {/* Reset & Wipe buttons */}
        <div className="pt-4 border-t border-violet-500/10 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-white block">
              Sample Data & Storage Reset
            </span>
            <span className="text-[11px] text-slate-400">
              Reset to fresh sample questions or wipe all entries to start with a blank slate.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all questions and history to initial sample data pack?')) {
                  resetToSampleData();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 bg-[#080916] border border-violet-500/20 hover:text-white hover:bg-violet-500/10 transition-colors flex items-center space-x-1"
            >
              <RotateCcw size={13} />
              <span>Load Sample Pack</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to completely erase all data? This cannot be undone.')) {
                  clearAllData();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-300 bg-rose-950/30 border border-rose-500/30 hover:bg-rose-900/40 flex items-center space-x-1 transition-colors"
            >
              <Trash2 size={13} />
              <span>Wipe All Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
