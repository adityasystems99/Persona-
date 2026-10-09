import React, { useState } from 'react';
import {
  Repeat2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  ExternalLink,
  History,
  Clock,
  Search,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem } from '../../types/dsa';
import { DifficultyBadge, PlatformBadge } from '../common/Badge';
import { getTodayDateString } from '../../data/initialData';

interface RevisionQueueViewProps {
  onOpenRevisionModal: (problem: Problem) => void;
}

export const RevisionQueueView: React.FC<RevisionQueueViewProps> = ({
  onOpenRevisionModal,
}) => {
  const { problems, logRevisionAttempt } = useDSA();
  const [search, setSearch] = useState('');
  const todayStr = getTodayDateString();

  // All problems flagged for revision or solved with hints
  const revisionProblems = problems.filter(
    (p) => p.needsRevision || p.status === 'Needs Revision' || p.status === 'Solved with Hints'
  );

  const filtered = revisionProblems.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase()) ||
      (p.mistakes && p.mistakes.toLowerCase().includes(search.toLowerCase())) ||
      (p.patternLearned && p.patternLearned.toLowerCase().includes(search.toLowerCase()))
  );

  // Due today or overdue
  const dueToday = filtered.filter(
    (p) => p.revisionScheduledDate && p.revisionScheduledDate <= todayStr
  );
  const upcoming = filtered.filter(
    (p) => !p.revisionScheduledDate || p.revisionScheduledDate > todayStr
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-purple-500 text-white shadow-sm">
                <Repeat2 size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-800">
                Spaced Revision & Mistake Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Reinforce problems that required hints or tripped you up. Master the core intuition before moving forward.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-200 text-xs font-bold text-rose-700">
              {dueToday.length} due today
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-purple-50 border border-purple-200 text-xs font-bold text-purple-700">
              {revisionProblems.length} total in queue
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <div className="relative max-w-md">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by problem name or mistake keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>
      </div>

      {/* Questions list */}
      {filtered.length === 0 ? (
        <div className="card-soft py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">
            Revision Queue is Empty!
          </h4>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            When you solve a problem with hints or struggle with time complexity, mark it for revision to revisit your mistakes here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((problem) => {
            const isDue =
              problem.revisionScheduledDate &&
              problem.revisionScheduledDate <= todayStr;

            return (
              <div
                key={problem.id}
                className="card-soft p-5 sm:p-6 card-soft-hover border-l-4 border-l-purple-500 flex flex-col md:flex-row gap-5 justify-between"
              >
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <a
                      href={problem.url || '#'}
                      target={problem.url ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="font-bold text-base text-slate-800 hover:text-purple-600 transition-colors inline-flex items-center"
                    >
                      <span>{problem.title}</span>
                      {problem.url && (
                        <ExternalLink size={13} className="ml-1 text-slate-400" />
                      )}
                    </a>
                    <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    <PlatformBadge platform={problem.platform} />
                    {isDue && (
                      <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                        Due Today
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-500 mb-3">
                    <span className="font-semibold text-slate-700">
                      {problem.topic}
                    </span>
                    <span>•</span>
                    <span className="flex items-center text-slate-400">
                      <Calendar size={12} className="mr-1" />
                      Scheduled: {problem.revisionScheduledDate || 'Not set'}
                    </span>
                  </div>

                  {/* Mistakes Box */}
                  {problem.mistakes && (
                    <div className="mb-2 p-3 rounded-xl bg-amber-50/70 border border-amber-200/70 text-xs text-amber-900">
                      <div className="flex items-center font-bold mb-0.5 text-amber-800">
                        <AlertTriangle size={13} className="mr-1 text-amber-600" />
                        <span>Mistakes & What Tripped Me Up:</span>
                      </div>
                      <p className="leading-relaxed">{problem.mistakes}</p>
                    </div>
                  )}

                  {/* Pattern Learned Box */}
                  {problem.patternLearned && (
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/70 text-xs text-purple-900">
                      <div className="flex items-center font-bold mb-0.5 text-purple-800">
                        <Lightbulb size={13} className="mr-1 text-purple-600" />
                        <span>Core Intuition & Pattern to Remember:</span>
                      </div>
                      <p className="leading-relaxed">{problem.patternLearned}</p>
                    </div>
                  )}
                </div>

                {/* Right Action column */}
                <div className="flex flex-col justify-between items-start md:items-end gap-3 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                  <button
                    onClick={() => onOpenRevisionModal(problem)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 border border-purple-200 transition-all flex items-center space-x-1.5"
                  >
                    <History size={14} />
                    <span>Manage Revision & Log Attempt</span>
                  </button>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() =>
                        logRevisionAttempt(
                          problem.id,
                          true,
                          'Solved independently during revision!'
                        )
                      }
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-all flex items-center space-x-1"
                    >
                      <CheckCircle2 size={13} />
                      <span>Mark Solved Solo</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
