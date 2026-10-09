import React, { useState } from 'react';
import { X, Repeat2, CheckCircle2, History, AlertTriangle, Lightbulb } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem } from '../../types/dsa';
import { getTodayDateString } from '../../data/initialData';

interface RevisionLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
}

export const RevisionLogModal: React.FC<RevisionLogModalProps> = ({
  isOpen,
  onClose,
  problem,
}) => {
  const { scheduleRevision, logRevisionAttempt, removeRevision } = useDSA();

  const [scheduledDate, setScheduledDate] = useState(
    problem?.revisionScheduledDate || getTodayDateString()
  );
  const [mistakes, setMistakes] = useState(problem?.mistakes || '');
  const [patternLearned, setPatternLearned] = useState(problem?.patternLearned || '');
  const [attemptNotes, setAttemptNotes] = useState('');

  if (!isOpen || !problem) return null;

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleRevision(problem.id, scheduledDate, mistakes, patternLearned);
    onClose();
  };

  const handleLogAttempt = (success: boolean) => {
    logRevisionAttempt(
      problem.id,
      success,
      attemptNotes.trim() || (success ? 'Solved independently during scheduled revision!' : 'Still required hints.')
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Repeat2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Revision & Mistake Notebook
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">
                {problem.title} • {problem.difficulty}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          {/* Schedule Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Target Revision Date
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Mistakes & Misconceptions */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <AlertTriangle size={13} className="text-amber-500" />
              <span>What Tripped Me Up? / Mistakes Made</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. Assumed greedy choice worked; missed the cyclic graph edge case; off-by-one in binary search lower bound..."
              value={mistakes}
              onChange={(e) => setMistakes(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Key Intuition / Pattern */}
          <div>
            <label className="text-xs font-bold text-slate-700 mb-1 flex items-center space-x-1.5">
              <Lightbulb size={13} className="text-purple-500" />
              <span>Core Intuition / Pattern Learned</span>
            </label>
            <textarea
              rows={3}
              placeholder="e.g. When looking for subarray sums with negatives, use prefix sum hash map rather than sliding window..."
              value={patternLearned}
              onChange={(e) => setPatternLearned(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Re-attempt logging */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center">
              <History size={13} className="mr-1 text-slate-500" />
              Log Fresh Re-Attempt
            </h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Did you re-attempt this problem today? Log the result to update your revision queue.
            </p>
            <input
              type="text"
              placeholder="Optional notes for today's re-attempt..."
              value={attemptNotes}
              onChange={(e) => setAttemptNotes(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 mb-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleLogAttempt(true)}
                className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1"
              >
                <CheckCircle2 size={14} />
                <span>Solved Solo (Resolve)</span>
              </button>
              <button
                type="button"
                onClick={() => handleLogAttempt(false)}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold shadow-sm transition-all flex items-center justify-center space-x-1"
              >
                <span>Needed Hints (Keep Queued)</span>
              </button>
            </div>
          </div>

          {/* Past revision history */}
          {problem.revisionHistory.length > 0 && (
            <div>
              <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                Past Re-Attempts ({problem.revisionHistory.length})
              </h5>
              <div className="space-y-1.5 max-h-32 overflow-y-auto">
                {problem.revisionHistory.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-2 rounded-xl bg-slate-50 text-xs border border-slate-100 flex items-center justify-between"
                  >
                    <span className="text-slate-600 font-medium">{rev.notes}</span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        rev.success
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {rev.date} • {rev.success ? 'Success' : 'Struggled'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between flex-shrink-0">
          {problem.needsRevision ? (
            <button
              type="button"
              onClick={() => {
                removeRevision(problem.id);
                onClose();
              }}
              className="text-xs text-slate-400 hover:text-rose-600 underline font-medium"
            >
              Remove from Revision Queue
            </button>
          ) : (
            <span />
          )}

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveSchedule}
              className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral active:scale-95 transition-all"
            >
              Save Revision Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
