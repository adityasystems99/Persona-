import React, { useState } from 'react';
import { X, Copy, Check, FileText, Sparkles } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Difficulty, Platform } from '../../types/dsa';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkAddModal: React.FC<BulkAddModalProps> = ({ isOpen, onClose }) => {
  const { bulkAddProblems } = useDSA();

  const [rawText, setRawText] = useState(
    `Lowest Common Ancestor of a Binary Search Tree, Easy, Trees & BST, https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
Course Schedule, Medium, Graphs, https://leetcode.com/problems/course-schedule/
Word Search II, Hard, Backtracking, https://leetcode.com/problems/word-search-ii/`
  );
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('Medium');
  const [defaultTopic, setDefaultTopic] = useState('General DSA');

  if (!isOpen) return null;

  const handleImport = () => {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const parsedItems = lines.map((line) => {
      // Split by comma or tab or hyphen
      const parts = line.split(',').map((p) => p.trim());
      const title = parts[0] || 'Untitled Problem';

      let diff: Difficulty = defaultDifficulty;
      if (parts[1]) {
        const lower = parts[1].toLowerCase();
        if (lower.includes('easy')) diff = 'Easy';
        else if (lower.includes('hard')) diff = 'Hard';
        else if (lower.includes('med')) diff = 'Medium';
      }

      const topic = parts[2] || defaultTopic;
      const url = parts[3] || (parts[1]?.startsWith('http') ? parts[1] : '');

      return {
        title,
        difficulty: diff,
        topic,
        url,
        platform: 'LeetCode' as Platform,
      };
    });

    bulkAddProblems(parsedItems);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-100 overflow-hidden relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-800 text-lg">
                Paste Multiple Questions
              </h3>
              <p className="text-xs text-slate-400">
                Quickly import multiple DSA problems at once
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          <div className="p-3 bg-purple-50/60 border border-purple-100 rounded-2xl text-xs text-purple-900">
            <p className="font-semibold mb-1">Supported Format (one question per line):</p>
            <code className="text-[11px] block bg-white/80 p-2 rounded-xl text-purple-800 font-mono">
              Problem Name, Difficulty, Topic, URL (optional)
            </code>
            <p className="text-[11px] mt-1 text-purple-600">
              Or simply paste just the problem titles line-by-line!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Paste Questions Here
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g.&#10;Two Sum, Easy, Arrays, https://leetcode.com/problems/two-sum/&#10;3Sum, Medium, Two Pointers"
              className="w-full text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Default Difficulty
              </label>
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value as Difficulty)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Default Topic
              </label>
              <input
                type="text"
                value={defaultTopic}
                onChange={(e) => setDefaultTopic(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            {rawText.split('\n').filter((l) => l.trim()).length} problems detected
          </span>
          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Sparkles size={14} />
              <span>Import to Question Bank</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
