import React, { useState } from 'react';
import {
  X,
  Trophy,
  Award,
  Clock,
  UserCheck,
  FileText,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { WeekendAssessmentType, AssessmentStatus } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface LogAssessmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultType?: WeekendAssessmentType;
}

export const LogAssessmentModal: React.FC<LogAssessmentModalProps> = ({
  isOpen,
  onClose,
  defaultType = 'mock_test',
}) => {
  const { addWeekendAssessment } = usePlacement();
  const { theme } = useTheme();

  const [type, setType] = useState<WeekendAssessmentType>(defaultType);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [status, setStatus] = useState<AssessmentStatus>('Completed');
  const [scoreOrRank, setScoreOrRank] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(60);
  const [partnerOrPlatform, setPartnerOrPlatform] = useState('');
  const [feedback, setFeedback] = useState('');
  const [mistakes, setMistakes] = useState('');
  const [improvementAreas, setImprovementAreas] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addWeekendAssessment({
      type,
      title: title.trim(),
      date,
      status,
      scoreOrRank: scoreOrRank.trim() || undefined,
      durationMinutes: Number(durationMinutes) || 60,
      partnerOrPlatform: partnerOrPlatform.trim() || undefined,
      feedback: feedback.trim() || undefined,
      mistakes: mistakes.trim() || undefined,
      improvementAreas: improvementAreas.trim() || undefined,
    });

    // Reset & Close
    setTitle('');
    setScoreOrRank('');
    setFeedback('');
    setMistakes('');
    setImprovementAreas('');
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
              <Trophy size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Log Weekend Assessment
              </h3>
              <p className="text-xs text-slate-400">
                Record mock tests, coding contests, and peer/senior mock interviews.
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

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 max-h-[75vh] overflow-y-auto pr-1">
          {/* Assessment Type Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Assessment Type
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setType('mock_test')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  type === 'mock_test'
                    ? 'bg-violet-600/40 border-violet-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                Mock Test
              </button>
              <button
                type="button"
                onClick={() => setType('coding_contest')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  type === 'coding_contest'
                    ? 'bg-violet-600/40 border-violet-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                Coding Contest
              </button>
              <button
                type="button"
                onClick={() => setType('mock_interview')}
                className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                  type === 'mock_interview'
                    ? 'bg-violet-600/40 border-violet-400 text-white shadow-sm'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                }`}
              >
                Mock Interview
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Title / Focus Topic *
            </label>
            <input
              type="text"
              required
              placeholder={
                type === 'mock_test'
                  ? 'e.g. Dynamic Programming & Graphs 90m Mock'
                  : type === 'coding_contest'
                  ? 'e.g. LeetCode Weekly Contest 421'
                  : 'e.g. System Design & DSA with Senior Mentor'
              }
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Score & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Score / Rank / Result
              </label>
              <div className="relative">
                <Award size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="text"
                  placeholder="e.g. 85/100, Rank 2400, Passed"
                  value={scoreOrRank}
                  onChange={(e) => setScoreOrRank(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Duration (Minutes)
              </label>
              <div className="relative">
                <Clock size={15} className="absolute left-3 top-2.5 text-slate-400" />
                <input
                  type="number"
                  min={10}
                  max={300}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>
          </div>

          {/* Platform / Partner */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Platform or Interviewer / Mentor Name
            </label>
            <div className="relative">
              <UserCheck size={15} className="absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="e.g. LeetCode, Codeforces, or Mentor Name"
                value={partnerOrPlatform}
                onChange={(e) => setPartnerOrPlatform(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Feedback & Performance Notes */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Feedback Received & Observations
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Good time complexity analysis, but need to improve communication speed during code walkthrough."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* Mistakes & Improvement Areas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Mistakes Made
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Off-by-one error on binary search bounds."
                value={mistakes}
                onChange={(e) => setMistakes(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Improvement Action Items
              </label>
              <textarea
                rows={2}
                placeholder="e.g. Revisit Dijkstra with min-heap priority queue."
                value={improvementAreas}
                onChange={(e) => setImprovementAreas(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-black/30 border border-violet-500/30 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
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
              <Plus size={16} />
              <span>Record Assessment</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
