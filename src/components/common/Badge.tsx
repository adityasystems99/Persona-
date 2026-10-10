import React from 'react';
import { Difficulty, ProblemStatus, Platform } from '../../types/dsa';

export const DifficultyBadge: React.FC<{ difficulty: Difficulty; size?: 'sm' | 'md' }> = ({
  difficulty,
  size = 'md',
}) => {
  const isSm = size === 'sm';
  const sizeClasses = isSm ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1';

  switch (difficulty) {
    case 'Easy':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse" />
          Easy
        </span>
      );
    case 'Medium':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-950/70 text-amber-300 border border-amber-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5" />
          Medium
        </span>
      );
    case 'Hard':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-purple-400 mr-1.5" />
          Hard
        </span>
      );
    default:
      return null;
  }
};

export const StatusBadge: React.FC<{ status: ProblemStatus }> = ({ status }) => {
  switch (status) {
    case 'Solved Independently':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-950/70 text-emerald-300 border border-emerald-500/30">
          ✓ Solved (Solo)
        </span>
      );
    case 'Solved with Hints':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-950/70 text-purple-300 border border-purple-500/30">
          💡 Solved (Hints)
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-indigo-950/70 text-indigo-300 border border-indigo-500/30 animate-pulse">
          ⏳ In Progress
        </span>
      );
    case 'Needs Revision':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/30">
          🔁 Needs Revision
        </span>
      );
    case 'Not Started':
    default:
      return (
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-[#13152d] text-slate-400 border border-violet-500/15">
          Not Started
        </span>
      );
  }
};

export const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  return (
    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#13152d] text-slate-300 border border-violet-500/20">
      {platform}
    </span>
  );
};
