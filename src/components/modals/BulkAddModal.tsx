import React, { useState } from 'react';
import { X, FileText, Check } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Difficulty, Platform } from '../../types/dsa';

interface BulkAddModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const BulkAddModal: React.FC<BulkAddModalProps> = ({ isOpen, onClose }) => {
  const { bulkAddProblems } = useDSA();

  const [rawText, setRawText] = useState('');
  const [defaultDifficulty, setDefaultDifficulty] = useState<Difficulty>('Medium');
  const [defaultTopic, setDefaultTopic] = useState('General DSA');

  if (!isOpen) return null;

  const handleImport = () => {
    const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    const parsedItems = lines.map((line) => {
      // Split by comma
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

  const detectedCount = rawText.split('\n').filter((l) => l.trim()).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl max-w-xl w-full p-6 border border-violet-500/30 shadow-glow-violet/30 overflow-hidden relative max-h-[90vh] flex flex-col text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-violet-500/10">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-2xl gradient-violet text-white flex items-center justify-center shadow-glow-violet">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-lg">
                Batch Import Telemetry
              </h3>
              <p className="text-xs text-slate-400">
                Paste raw lists to ingest multiple DSA questions directly
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

        {/* Content */}
        <div className="py-4 space-y-4 overflow-y-auto flex-1">
          <div className="p-3 bg-violet-950/30 border border-violet-500/20 rounded-2xl text-xs text-violet-300">
            <p className="font-semibold mb-1 text-white">Supported Format (one problem per line):</p>
            <code className="text-[11px] block bg-[#080918] p-2 rounded-xl text-violet-200 font-mono border border-violet-500/20">
              Problem Name, Difficulty, Topic, URL (optional)
            </code>
            <p className="text-[11px] mt-1 text-slate-400">
              Or simply paste question titles line-by-line — defaults will be applied automatically!
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1">
              Questions Batch Payload
            </label>
            <textarea
              rows={8}
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
              placeholder="e.g.&#10;Two Sum, Easy, Arrays, https://leetcode.com/problems/two-sum/&#10;3Sum, Medium, Two Pointers&#10;Trapping Rain Water, Hard, Two Pointers"
              className="w-full text-xs font-mono bg-[#080918] border border-violet-500/20 rounded-xl p-3 text-violet-100 placeholder-slate-600 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Difficulty
              </label>
              <select
                value={defaultDifficulty}
                onChange={(e) => setDefaultDifficulty(e.target.value as Difficulty)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-slate-200 focus:outline-none focus:border-violet-400"
              >
                <option value="Easy" className="bg-[#0e1028]">Easy</option>
                <option value="Medium" className="bg-[#0e1028]">Medium</option>
                <option value="Hard" className="bg-[#0e1028]">Hard</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Default Topic
              </label>
              <input
                type="text"
                value={defaultTopic}
                onChange={(e) => setDefaultTopic(e.target.value)}
                className="w-full text-xs bg-[#080918] border border-violet-500/20 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-violet-500/10 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            {detectedCount} problem{detectedCount === 1 ? '' : 's'} detected
          </span>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleImport}
              disabled={detectedCount === 0}
              className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet active:scale-95 transition-all flex items-center space-x-1.5 disabled:opacity-40 disabled:cursor-not-allowed hover:opacity-95"
            >
              <Check size={14} />
              <span>Import to Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
