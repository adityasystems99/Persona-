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
  Filter,
  Sparkles,
  Layers,
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
  const { problems, spacedRepetitionQueue, startFocusSession } = useDSA();
  const [activeTab, setActiveTab] = useState<'all' | 'due' | 'overdue' | 'upcoming'>('due');
  const [search, setSearch] = useState('');
  const todayStr = getTodayDateString();

  const { overdue, dueToday, upcoming } = spacedRepetitionQueue;

  const allRevisionProblems = problems.filter(
    (p) => p.needsRevision || p.status === 'Needs Revision' || p.status === 'Solved with Hints'
  );

  let currentList: Problem[] = [];
  if (activeTab === 'all') currentList = allRevisionProblems;
  else if (activeTab === 'due') currentList = dueToday;
  else if (activeTab === 'overdue') currentList = overdue;
  else if (activeTab === 'upcoming') currentList = upcoming;

  const filtered = currentList.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase()) ||
      (p.mistakes && p.mistakes.toLowerCase().includes(search.toLowerCase())) ||
      (p.patternLearned && p.patternLearned.toLowerCase().includes(search.toLowerCase()))
  );

  const getDaysDiff = (targetDate?: string) => {
    if (!targetDate) return 0;
    const target = new Date(targetDate).getTime();
    const today = new Date(todayStr).getTime();
    return Math.round((today - target) / 86400000);
  };

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
                Smart Spaced Revision & Mistake Queue
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              Configurable spaced repetition with dynamic intervals (1, 3, 7, 14, 30 days).
              Independent solves extend review intervals; hint dependencies retain short cycles; failed attempts are prioritized for tomorrow.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="block text-xs font-bold text-rose-700">{overdue.length} Overdue</span>
              <span className="text-[10px] text-rose-500 font-medium">Critical Reinforce</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-200 text-center">
              <span className="block text-xs font-bold text-purple-700">{dueToday.length} Due Today</span>
              <span className="text-[10px] text-purple-500 font-medium">Scheduled Today</span>
            </div>
          </div>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-slate-100/70 p-1 rounded-xl">
            <button
              onClick={() => setActiveTab('due')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'due' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Due Today ({dueToday.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'overdue' ? 'bg-rose-500 text-white shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Overdue ({overdue.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'upcoming' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'all' ? 'bg-white text-slate-800 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              All ({allRevisionProblems.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by problem name or mistake..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="card-soft py-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} />
          </div>
          <h4 className="font-bold text-slate-800 text-sm">
            {activeTab === 'due'
              ? 'No revisions due today!'
              : activeTab === 'overdue'
              ? 'Zero overdue items. Great work!'
              : 'No problems match current filter.'}
          </h4>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
            Questions where you request hints or mark for revision will automatically populate this spaced repetition schedule.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((prob) => {
            const daysOver = getDaysDiff(prob.revisionScheduledDate);
            const isOver = daysOver > 0;
            const stage = prob.spacedRepetitionStage || 0;

            return (
              <div
                key={prob.id}
                className={`card-soft p-5 bg-white border transition-all hover:shadow-md ${
                  isOver ? 'border-rose-300 ring-1 ring-rose-400/20' : 'border-slate-200/90'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-extrabold text-slate-800 text-sm">
                        {prob.title}
                      </span>
                      <DifficultyBadge difficulty={prob.difficulty} />
                      <PlatformBadge platform={prob.platform} />

                      {isOver && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-100 text-rose-700 border border-rose-200">
                          Overdue by {daysOver} day{daysOver > 1 ? 's' : ''}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                        Stage {stage}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {prob.topic} {prob.subtopic ? `• ${prob.subtopic}` : ''} • Scheduled:{' '}
                      <strong className="text-slate-600">
                        {prob.revisionScheduledDate || 'Today'}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startFocusSession(prob)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1 active:scale-95 transition-all"
                    >
                      <Clock size={13} />
                      <span>Focus Mode</span>
                    </button>

                    <button
                      onClick={() => onOpenRevisionModal(prob)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200 transition-colors flex items-center space-x-1"
                    >
                      <Repeat2 size={13} />
                      <span>Log Outcome</span>
                    </button>
                  </div>
                </div>

                {/* Mistakes & Learnings callout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {prob.mistakes && (
                    <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900">
                      <span className="font-bold flex items-center space-x-1 mb-0.5">
                        <AlertTriangle size={12} className="text-amber-600" />
                        <span>Previous Pitfalls / Mistakes:</span>
                      </span>
                      <p className="text-slate-700 leading-snug">{prob.mistakes}</p>
                    </div>
                  )}

                  {prob.patternLearned && (
                    <div className="p-3 rounded-xl bg-purple-50/60 border border-purple-200/60 text-purple-900">
                      <span className="font-bold flex items-center space-x-1 mb-0.5">
                        <Lightbulb size={12} className="text-purple-600" />
                        <span>Core Pattern to Recall:</span>
                      </span>
                      <p className="text-slate-700 leading-snug">{prob.patternLearned}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
