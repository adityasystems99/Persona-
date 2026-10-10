import React, { useState } from 'react';
import { X, Sparkles, Star, CheckCircle, RotateCcw, AlertCircle } from 'lucide-react';
import { AcademicRevision, RevisionOutcome } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface LogRevisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  revision: AcademicRevision | null;
}

export const LogRevisionModal: React.FC<LogRevisionModalProps> = ({
  isOpen,
  onClose,
  revision,
}) => {
  const { logRevisionReview } = useAcademic();

  const [outcome, setOutcome] = useState<RevisionOutcome>('strong');
  const [confidence, setConfidence] = useState(4);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !revision) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await logRevisionReview(revision.id, outcome, confidence, notes.trim() || undefined);
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1128] border border-violet-500/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-violet-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <RotateCcw size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Log Revision Recall</h2>
              <p className="text-xs text-slate-400">Rate memory retrieval strength</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-violet-900/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="p-3.5 rounded-xl bg-[#090a16] border border-violet-500/20">
            <p className="text-xs text-slate-400 font-mono">Topic to Review:</p>
            <h3 className="text-sm font-bold text-white mt-0.5">{revision.title}</h3>
            <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
              <span>Stage: {revision.stage + 1}</span>
              <span>•</span>
              <span>Last Studied: {revision.lastStudiedDate}</span>
            </div>
          </div>

          {/* Outcome Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Recall Quality *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setOutcome('strong');
                  if (confidence < 4) setConfidence(5);
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  outcome === 'strong'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-xs font-bold">Strong</span>
                <span className="text-[10px] text-slate-400">Extend interval</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOutcome('partial');
                  if (confidence > 3) setConfidence(3);
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  outcome === 'partial'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <AlertCircle size={18} className="text-amber-400" />
                <span className="text-xs font-bold">Partial</span>
                <span className="text-[10px] text-slate-400">Keep interval</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setOutcome('poor');
                  setConfidence(1);
                }}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  outcome === 'poor'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <RotateCcw size={18} className="text-rose-400" />
                <span className="text-xs font-bold">Forgot / Poor</span>
                <span className="text-[10px] text-slate-400">Reset interval</span>
              </button>
            </div>
          </div>

          {/* Confidence Stars */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Confidence Rating: {confidence} / 5
            </label>
            <div className="flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setConfidence(star)}
                  className="p-1 hover:scale-125 transition-transform"
                >
                  <Star
                    size={22}
                    className={
                      star <= confidence
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-600 hover:text-slate-400'
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Review Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Confused recurrence base cases, review Master theorem theorem cases tomorrow..."
              className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-violet-900/30 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-violet-500/20 text-slate-300 hover:bg-violet-950/30 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Recording...' : 'Complete Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
