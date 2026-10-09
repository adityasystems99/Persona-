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
  CheckCircle2,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import {
  checkNotificationPermission,
  requestNotificationPermission,
} from '../../utils/notifications';
import {
  exportDataToJSON,
  exportProblemsToCSV,
  parseImportedJSON,
} from '../../utils/exportImport';

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
  } = useDSA();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [permission, setPermission] = useState<NotificationPermission>(
    checkNotificationPermission()
  );

  const handleRequestPermission = async () => {
    const res = await requestNotificationPermission();
    setPermission(res);
    if (res === 'granted') {
      updateSettings({ browserNotificationsEnabled: true });
      addNotification('Permissions Granted', 'Browser notifications will alert you on hourly check-ins.', 'success');
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
    exportDataToJSON(backup, `algopulse-backup-${new Date().toISOString().slice(0, 10)}.json`);
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
        alert('Invalid JSON file. Please check format.');
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20">
        <div className="flex items-center space-x-2">
          <span className="p-1.5 rounded-xl gradient-coral text-white shadow-glow-coral">
            <Settings size={18} />
          </span>
          <h2 className="text-xl font-extrabold text-slate-800">
            Accountability & App Settings
          </h2>
        </div>
        <p className="text-xs text-slate-500 mt-0.5">
          Fine-tune study windows, hourly check-in frequency, audio chimes, and backup data.
        </p>
      </div>

      {/* 1. Study Window & Hourly Reminders */}
      <div className="card-soft p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Clock size={18} className="text-rose-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Active Study Window & Intervals
            </h3>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Study Start Time
            </label>
            <input
              type="time"
              value={settings.studyStartTime}
              onChange={(e) => updateSettings({ studyStartTime: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Reminders will not disturb you before this hour
            </span>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Daily Study End Time / Bedtime
            </label>
            <input
              type="time"
              value={settings.studyEndTime}
              onChange={(e) => updateSettings({ studyEndTime: e.target.value })}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
            />
            <span className="text-[10px] text-slate-400 mt-0.5 block">
              Reminders automatically mute after this hour
            </span>
          </div>
        </div>

        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-0.5">
              Hourly Check-in Interval
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
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 w-44"
          >
            <option value={30}>Every 30 Minutes</option>
            <option value={45}>Every 45 Minutes</option>
            <option value={60}>Every 1 Hour (Recommended)</option>
            <option value={90}>Every 1.5 Hours</option>
            <option value={120}>Every 2 Hours</option>
          </select>
        </div>
      </div>

      {/* 2. Notification Preferences & Background Limitations */}
      <div className="card-soft p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Bell size={18} className="text-purple-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Notification Preferences
            </h3>
          </div>
        </div>

        <div className="space-y-4">
          {/* Hourly Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Hourly Accountability Reminders
              </span>
              <span className="text-[11px] text-slate-400">
                Gentle alert to review problem count and avoid getting stalled
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.hourlyRemindersEnabled}
              onChange={(e) =>
                updateSettings({ hourlyRemindersEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          {/* STL Pending Reminder Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Pending 30-Min STL Reminder
              </span>
              <span className="text-[11px] text-slate-400">
                Pings you during study session if the mandatory STL block is still unfinished
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.stlReminderEnabled}
              onChange={(e) =>
                updateSettings({ stlReminderEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          {/* Web Audio Sound Toggle */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-800 block flex items-center">
                <Volume2 size={13} className="mr-1 text-slate-500" />
                Sound Alerts & Fanfares
              </span>
              <span className="text-[11px] text-slate-400">
                Procedural chime on reminders and celebratory audio on timer completion
              </span>
            </div>
            <input
              type="checkbox"
              checked={settings.soundEnabled}
              onChange={(e) =>
                updateSettings({ soundEnabled: e.target.checked })
              }
              className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 cursor-pointer"
            />
          </div>

          {/* Browser Notification Permission Status */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center space-x-3">
              {permission === 'granted' ? (
                <ShieldCheck size={20} className="text-emerald-500 flex-shrink-0" />
              ) : (
                <ShieldAlert size={20} className="text-amber-500 flex-shrink-0" />
              )}
              <div>
                <span className="text-xs font-bold text-slate-800 block">
                  Browser Desktop Notifications: {permission.toUpperCase()}
                </span>
                <span className="text-[11px] text-slate-500">
                  {permission === 'granted'
                    ? 'Browser permission active. Alerts can pop up while working in other tabs.'
                    : 'Click button to grant browser permission for system banner alerts.'}
                </span>
              </div>
            </div>

            {permission !== 'granted' && (
              <button
                onClick={handleRequestPermission}
                className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex-shrink-0"
              >
                Request Permission
              </button>
            )}
          </div>

          {/* Background Limitation Notice (Transparency) */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-100 flex items-start space-x-2.5 text-xs text-blue-900">
            <Info size={16} className="text-blue-600 mt-0.5 flex-shrink-0" />
            <div className="leading-relaxed">
              <strong className="block mb-0.5 text-blue-950 font-semibold">
                Background Execution Transparency
              </strong>
              Web applications can only trigger timers and reminders while this tab or browser window is open. If you completely close the browser, web standards prevent background code execution without an operating system service worker daemon. Keep this tab open or pinned in your browser during your study hours.
            </div>
          </div>
        </div>
      </div>

      {/* 3. Data Portability & Backup */}
      <div className="card-soft p-6 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <Download size={18} className="text-emerald-500" />
            <h3 className="font-bold text-sm text-slate-800">
              Data Management & Backup
            </h3>
          </div>
        </div>

        <p className="text-xs text-slate-500">
          Your preparation data is stored locally in your browser storage. Export regular backups to prevent accidental data loss.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportJSON}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm flex items-center space-x-2"
          >
            <FileCode size={15} className="text-rose-500" />
            <span>Export Full Backup (JSON)</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 shadow-sm flex items-center space-x-2"
          >
            <FileSpreadsheet size={15} className="text-emerald-500" />
            <span>Export Questions (CSV)</span>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 flex items-center space-x-2"
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
        <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-slate-700 block">
              Sample Data & Storage Reset
            </span>
            <span className="text-[11px] text-slate-400">
              Reset to fresh sample questions or wipe all entries to start from scratch.
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                if (window.confirm('Reset all questions and history to initial sample data?')) {
                  resetToSampleData();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 flex items-center space-x-1"
            >
              <RotateCcw size={13} />
              <span>Reset Sample Data</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to completely erase all DSA data? This cannot be undone.')) {
                  clearAllData();
                }
              }}
              className="px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 bg-rose-50 hover:bg-rose-100 flex items-center space-x-1"
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
