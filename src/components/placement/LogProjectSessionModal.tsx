import React, { useState } from 'react';
import {
  X,
  Code2,
  Clock,
  GitBranch,
  FileCode,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface LogProjectSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LogProjectSessionModal: React.FC<LogProjectSessionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { logProjectSession } = usePlacement();
  const { theme } = useTheme();

  const [title, setTitle] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [repoOrBranch, setRepoOrBranch] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    logProjectSession(
      title.trim(),
      Number(durationMinutes) || 60,
      notes.trim() || undefined,
      repoOrBranch.trim() || undefined
    );

    // Reset & Close
    setTitle('');
    setDurationMinutes(60);
    setRepoOrBranch('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div
        className={`w-full max-w-lg rounded-2xl border shadow-2xl p-6 transition-all relative overflow-hidden ${
          theme === 'light'
            ? 'bg-white border-amber-500/40 text-slate-800'
            : 'bg-[#101228] border-violet-500/40 text-white'
        }`}
      >
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-violet-600/20 text-violet-400 border border-violet-500/30">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Log Project Development Hour
              </h3>
              <p className="text-xs text-slate-400">
                Monday–Friday Goal: Spend 1 focused hour on portfolio & full-stack development.
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
          {/* Quick presets for duration */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Duration Preset
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[30, 45, 60, 90].map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDurationMinutes(mins)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold border transition-all text-center ${
                    durationMinutes === mins
                      ? 'bg-violet-600 border-violet-400 text-white shadow-md'
                      : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                  }`}
                >
                  {mins === 60 ? '1 Hour (Target)' : `${mins} mins`}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Feature / Module Developed *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Implemented OAuth 2.0 flow & JWT refresh token handler"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Git Branch / Commit */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Git Branch or Repo Link (Optional)
            </label>
            <div className="relative">
              <GitBranch size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. feat/auth-service or github.com/user/project"
                value={repoOrBranch}
                onChange={(e) => setRepoOrBranch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Dev Notes & Takeaways
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Solved race condition on token refresh using mutex lock. Ready for unit tests."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Submit */}
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
              <CheckCircle2 size={16} />
              <span>Log Development Time</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
