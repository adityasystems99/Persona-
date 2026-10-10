import React, { useState, useEffect } from 'react';
import { X, Code2, Link2, Clock, CheckCircle } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem, Difficulty, Platform, ProblemStatus } from '../../types/dsa';

interface AddEditProblemModalProps {
  isOpen: boolean;
  onClose: () => void;
  editingProblem?: Problem | null;
}

const TOPIC_PRESETS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees & BST',
  'Heap / Priority Queue',
  'Backtracking',
  'Graphs',
  'Dynamic Programming',
  'Greedy',
  'Bit Manipulation',
  'Trie',
  'Intervals',
  'Math & Geometry',
];

export const AddEditProblemModal: React.FC<AddEditProblemModalProps> = ({
  isOpen,
  onClose,
  editingProblem,
}) => {
  const { addProblem, updateProblem } = useDSA();

  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('Arrays & Hashing');
  const [subtopic, setSubtopic] = useState('');
  const [difficulty, setDifficulty] = useState<Difficulty>('Easy');
  const [platform, setPlatform] = useState<Platform>('LeetCode');
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState<ProblemStatus>('Not Started');
  const [timeSpentMinutes, setTimeSpentMinutes] = useState(0);
  const [approach, setApproach] = useState('');
  const [notes, setNotes] = useState('');
  const [timeComplexity, setTimeComplexity] = useState('O(N)');
  const [spaceComplexity, setSpaceComplexity] = useState('O(1)');
  const [attempts, setAttempts] = useState(0);
  const [inTodayPlan, setInTodayPlan] = useState(true);

  useEffect(() => {
    if (editingProblem) {
      setTitle(editingProblem.title);
      setTopic(editingProblem.topic);
      setSubtopic(editingProblem.subtopic || '');
      setDifficulty(editingProblem.difficulty);
      setPlatform(editingProblem.platform);
      setUrl(editingProblem.url || '');
      setStatus(editingProblem.status);
      setTimeSpentMinutes(editingProblem.timeSpentMinutes || 0);
      setApproach(editingProblem.approach || '');
      setNotes(editingProblem.notes || '');
      setTimeComplexity(editingProblem.timeComplexity || 'O(N)');
      setSpaceComplexity(editingProblem.spaceComplexity || 'O(1)');
      setAttempts(editingProblem.attempts || 0);
      setInTodayPlan(editingProblem.inTodayPlan ?? true);
    } else {
      setTitle('');
      setTopic('Arrays & Hashing');
      setSubtopic('');
      setDifficulty('Easy');
      setPlatform('LeetCode');
      setUrl('');
      setStatus('Not Started');
      setTimeSpentMinutes(0);
      setApproach('');
      setNotes('');
      setTimeComplexity('O(N)');
      setSpaceComplexity('O(1)');
      setAttempts(0);
      setInTodayPlan(true);
    }
  }, [editingProblem, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const payload: Partial<Problem> = {
      title: title.trim(),
      topic: topic.trim(),
      subtopic: subtopic.trim(),
      difficulty,
      platform,
      url: url.trim(),
      status,
      timeSpentMinutes: Number(timeSpentMinutes) || 0,
      approach: approach.trim(),
      notes: notes.trim(),
      timeComplexity: timeComplexity.trim(),
      spaceComplexity: spaceComplexity.trim(),
      attempts: Number(attempts) || 0,
      inTodayPlan,
      solvedIndependently: status === 'Solved Independently',
      needsRevision: status === 'Needs Revision' || status === 'Solved with Hints',
    };

    if (editingProblem) {
      updateProblem(editingProblem.id, payload);
    } else {
      addProblem(payload);
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl max-w-xl w-full p-6 border border-violet-500/30 shadow-glow-violet/30 overflow-hidden relative max-h-[92vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/10 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl gradient-violet text-white flex items-center justify-center shadow-glow-violet">
              <Code2 size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                {editingProblem ? 'Edit Problem Telemetry' : 'Log New DSA Problem'}
              </h3>
              <p className="text-xs text-slate-400">
                Log algorithmic complexity, pattern notes, and daily orbit assignment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto py-4 space-y-4 flex-1 pr-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Problem Name <span className="text-violet-400">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="e.g. 3Sum, Lowest Common Ancestor, Subarray Sum Equals K"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full text-sm bg-[#080918] border border-violet-500/20 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 font-medium transition-all"
            />
          </div>

          {/* Topic & Subtopic */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Topic Category
              </label>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
              >
                {TOPIC_PRESETS.map((t) => (
                  <option key={t} value={t} className="bg-[#0e1028] text-white">
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Subtopic / Pattern Invariant
              </label>
              <input
                type="text"
                placeholder="e.g. Monotonic Stack, TopoSort, Trie"
                value={subtopic}
                onChange={(e) => setSubtopic(e.target.value)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Difficulty & Platform */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Difficulty
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['Easy', 'Medium', 'Hard'] as const).map((diff) => (
                  <button
                    type="button"
                    key={diff}
                    onClick={() => setDifficulty(diff)}
                    className={`py-1.5 rounded-xl text-xs font-bold transition-all border ${
                      difficulty === diff
                        ? diff === 'Easy'
                          ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/60 shadow-sm'
                          : diff === 'Medium'
                          ? 'bg-amber-950/60 text-amber-300 border-amber-500/60 shadow-sm'
                          : 'bg-violet-950/60 text-violet-300 border-violet-500/60 shadow-sm'
                        : 'bg-[#080918] text-slate-400 border-violet-500/20 hover:text-white'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Platform
              </label>
              <select
                value={platform}
                onChange={(e) => setPlatform(e.target.value as Platform)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
              >
                <option value="LeetCode" className="bg-[#0e1028]">LeetCode</option>
                <option value="Codeforces" className="bg-[#0e1028]">Codeforces</option>
                <option value="GeeksforGeeks" className="bg-[#0e1028]">GeeksforGeeks</option>
                <option value="CodeStudio" className="bg-[#0e1028]">CodeStudio</option>
                <option value="HackerRank" className="bg-[#0e1028]">HackerRank</option>
                <option value="Other" className="bg-[#0e1028]">Other</option>
              </select>
            </div>
          </div>

          {/* URL */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center justify-between">
              <span>Platform Problem URL</span>
              <span className="text-[10px] text-slate-500 font-normal">Optional</span>
            </label>
            <div className="relative">
              <Link2 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="url"
                placeholder="https://leetcode.com/problems/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="w-full text-xs pl-8 pr-3 py-2 bg-[#080918] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Status & Time Spent */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Current Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as ProblemStatus)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
              >
                <option value="Not Started" className="bg-[#0e1028]">Not Started</option>
                <option value="In Progress" className="bg-[#0e1028]">In Progress</option>
                <option value="Solved Independently" className="bg-[#0e1028]">Solved Independently</option>
                <option value="Solved with Hints" className="bg-[#0e1028]">Solved with Hints</option>
                <option value="Needs Revision" className="bg-[#0e1028]">Needs Revision</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1 flex items-center">
                <Clock size={12} className="mr-1 text-slate-500" />
                <span>Time Spent (Minutes)</span>
              </label>
              <input
                type="number"
                min="0"
                value={timeSpentMinutes}
                onChange={(e) => setTimeSpentMinutes(Math.max(0, parseInt(e.target.value, 10) || 0))}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Time & Space Complexity */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Time Complexity
              </label>
              <input
                type="text"
                placeholder="e.g. O(N log N)"
                value={timeComplexity}
                onChange={(e) => setTimeComplexity(e.target.value)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-violet-200 font-mono focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Space Complexity
              </label>
              <input
                type="text"
                placeholder="e.g. O(1) or O(N)"
                value={spaceComplexity}
                onChange={(e) => setSpaceComplexity(e.target.value)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-violet-200 font-mono focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>

          {/* Approach & Notes */}
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Intuition & Optimal Pattern
            </label>
            <textarea
              rows={2}
              placeholder="Key observation, invariant, or technique that unlocked the optimal solution..."
              value={approach}
              onChange={(e) => setApproach(e.target.value)}
              className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Personal Pitfalls / Edge Cases
            </label>
            <textarea
              rows={2}
              placeholder="Edge cases to watch out for (e.g. integer overflow, empty string, cyclic graph)..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl p-3 text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400"
            />
          </div>

          {/* In Today's Plan Toggle */}
          <div className="pt-2 flex items-center justify-between bg-[#080918] p-3 rounded-2xl border border-violet-500/20">
            <div>
              <span className="text-xs font-bold text-white block">
                Assign to Today's Orbit Plan
              </span>
              <span className="text-[11px] text-slate-400">
                Immediately include this question in your active study queue
              </span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inTodayPlan}
                onChange={(e) => setInTodayPlan(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-500 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-violet-600" />
            </label>
          </div>

          {/* Submit Buttons */}
          <div className="pt-4 border-t border-violet-500/10 flex items-center justify-end space-x-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white hover:bg-violet-500/10 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white gradient-violet shadow-glow-violet active:scale-95 transition-all flex items-center space-x-1.5 hover:opacity-95"
            >
              <CheckCircle size={15} />
              <span>{editingProblem ? 'Save Telemetry' : 'Commit Problem'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
