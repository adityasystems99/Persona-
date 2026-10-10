import React, { useState } from 'react';
import { X, Repeat2, CheckCircle2, History, AlertTriangle, Lightbulb, Clock, Sparkles } from 'lucide-react';
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
  const { scheduleRevision, logSpacedRepetitionOutcome, removeRevision, settings } = useDSA();

  const [scheduledDate, setScheduledDate] = useState(
    problem?.revisionScheduledDate || getTodayDateString()
  );
  const [mistakes, setMistakes] = useState(problem?.mistakes || '');
  const [patternLearned, setPatternLearned] = useState(problem?.patternLearned || '');
  const [attemptNotes, setAttemptNotes] = useState('');

  if (!isOpen || !problem) return null;

  const currentStage = problem.spacedRepetitionStage || 0;
  const intervals = settings.spacedRepetitionIntervals || [1, 3, 7, 14];

  const handleSaveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    scheduleRevision(problem.id, scheduledDate, mistakes, patternLearned);
    onClose();
  };

  const handleLogSpacedOutcome = (outcome: 'success' | 'hints' | 'failed') => {
    logSpacedRepetitionOutcome(
      problem.id,
      outcome,
      attemptNotes.trim() ||
        (outcome === 'success'
          ? 'Solved independently during scheduled revision'
          : outcome === 'hints'
          ? 'Required hints during revision'
          : 'Failed re-attempt. Needs immediate review.')
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
                Smart Spaced Revision Notebook
              </h3>
              <p className="text-xs text-slate-400 truncate max-w-xs">
                {problem.title} • {problem.difficulty} • Stage {currentStage}
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
          {/* Spaced Repetition Stage Indicator */}
          <div className="p-3 bg-purple-50/70 border border-purple-200/80 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-700 block">
                Current Spaced Repetition Interval
              </span>
              <span className="text-xs font-extrabold text-purple-900">
                Stage {currentStage} ({intervals[currentStage] || 30} Day Interval)
              </span>
            </div>
            <span className="text-[11px] text-purple-600 font-semibold">
              Due: {problem.revisionScheduledDate || 'Today'}
            </span>
          </div>

          {/* Target Date */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Scheduled Review Date
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
              rows={2}
              placeholder="e.g. When looking for subarray sums with negatives, use prefix sum hash map rather than sliding window..."
              value={patternLearned}
              onChange={(e) => setPatternLearned(e.target.value)}
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          {/* Re-attempt logging with 3 Adaptive Outcomes */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/80">
            <h4 className="text-xs font-bold text-slate-800 mb-1 flex items-center">
              <History size={13} className="mr-1 text-slate-500" />
              Log Revision Performance Outcome
            </h4>
            <p className="text-[11px] text-slate-500 mb-2">
              Performance dynamically adjusts your next spaced repetition review date:
            </p>

            <input
              type="text"
              placeholder="Optional observations on today's recall attempt..."
              value={attemptNotes}
              onChange={(e) => setAttemptNotes(e.target.value)}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-800 mb-2.5 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleLogSpacedOutcome('success')}
                className="py-2 px-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold shadow-xs transition-all flex flex-col items-center text-center"
              >
                <CheckCircle2 size={14} className="mb-0.5" />
                <span>Solved Solo</span>
                <span className="text-[9px] text-emerald-200 font-normal">Extend interval</span>
              </button>

              <button
                type="button"
                onClick={() => handleLogSpacedOutcome('hints')}
                className="py-2 px-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white text-[11px] font-bold shadow-xs transition-all flex flex-col items-center text-center"
              >
                <span>Needed Hints</span>
                <span className="text-[9px] text-amber-100 font-normal">Retain short interval</span>
              </button>

              <button
                type="button"
                onClick={() => handleLogSpacedOutcome('failed')}
                className="py-2 px-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold shadow-xs transition-all flex flex-col items-center text-center"
              >
                <span>Failed Attempt</span>
                <span className="text-[9px] text-rose-200 font-normal">Priority retry tomorrow</span>
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
                    <span className="text-slate-600 font-medium truncate max-w-xs">{rev.notes}</span>
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
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
