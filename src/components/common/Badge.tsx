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
          className={`inline-flex items-center font-medium rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5 animate-pulse" />
          Easy
        </span>
      );
    case 'Medium':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5" />
          Medium
        </span>
      );
    case 'Hard':
      return (
        <span
          className={`inline-flex items-center font-medium rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5" />
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
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100/80 text-emerald-800">
          ✓ Solved (Solo)
        </span>
      );
    case 'Solved with Hints':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-purple-100 text-purple-800">
          💡 Solved (Hints)
        </span>
      );
    case 'In Progress':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 animate-pulse">
          ⏳ In Progress
        </span>
      );
    case 'Needs Revision':
      return (
        <span className="inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full bg-rose-100 text-rose-800">
          🔁 Needs Revision
        </span>
      );
    case 'Not Started':
    default:
      return (
        <span className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-slate-100 text-slate-600">
          Not Started
        </span>
      );
  }
};

export const PlatformBadge: React.FC<{ platform: Platform }> = ({ platform }) => {
  return (
    <span className="inline-flex items-center text-[11px] font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200/60">
      {platform}
    </span>
  );
};
