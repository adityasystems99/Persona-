import React, { useState } from 'react';
import {
  Repeat2,
  Calendar,
  AlertTriangle,
  Lightbulb,
  CheckCircle2,
  Clock,
  Search,
  Sparkles,
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
      <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2.5">
              <span className="p-2 rounded-xl gradient-violet text-white shadow-glow-violet">
                <Repeat2 size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Orbital Spaced Revision & Diagnostics
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-xl leading-relaxed">
              Fibonacci spaced repetition algorithms (1, 3, 7, 14, 30 days). Problems marked for review or solved with hints automatically recalibrate orbit cycles.
            </p>
          </div>

          <div className="flex items-center space-x-2.5">
            <div className="px-3.5 py-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
              <span className="block text-xs font-bold text-rose-300 font-mono">{overdue.length} Overdue</span>
              <span className="text-[10px] text-rose-400 font-medium">Critical Drift</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-violet-950/30 border border-violet-500/30 text-center">
              <span className="block text-xs font-bold text-violet-300 font-mono">{dueToday.length} Due Today</span>
              <span className="text-[10px] text-violet-400 font-medium">Scheduled Orbit</span>
            </div>
          </div>
        </div>

        {/* Search & Tabs Toolbar */}
        <div className="mt-5 pt-4 border-t border-violet-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-1.5 bg-[#090a18] p-1 rounded-xl border border-violet-500/20">
            <button
              onClick={() => setActiveTab('due')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'due'
                  ? 'bg-violet-600 text-white shadow-glow-violet/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Due Today ({dueToday.length})
            </button>
            <button
              onClick={() => setActiveTab('overdue')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'overdue'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Overdue ({overdue.length})
            </button>
            <button
              onClick={() => setActiveTab('upcoming')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-violet-600 text-white shadow-glow-violet/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Upcoming ({upcoming.length})
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                activeTab === 'all'
                  ? 'bg-violet-600 text-white shadow-glow-violet/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All ({allRevisionProblems.length})
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search problem or pitfall..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#090a18] border border-violet-500/20 text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
            />
          </div>
        </div>
      </div>

      {/* Questions List */}
      {filtered.length === 0 ? (
        <div className="card-soft py-16 text-center bg-[#0c0e22]/90 border border-violet-500/20">
          <div className="w-14 h-14 rounded-2xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 size={26} />
          </div>
          <h4 className="font-bold text-white text-sm">
            {activeTab === 'due'
              ? 'No orbital revisions due today!'
              : activeTab === 'overdue'
              ? 'Zero overdue items. Orbital trajectory stable!'
              : 'No problems match current telemetry filter.'}
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
                className={`card-soft p-5 bg-[#0c0e22]/90 border transition-all hover:border-violet-500/40 ${
                  isOver ? 'border-rose-500/50 ring-1 ring-rose-500/20' : 'border-violet-500/20'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-violet-500/10">
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-extrabold text-white text-sm">
                        {prob.title}
                      </span>
                      <DifficultyBadge difficulty={prob.difficulty} />
                      <PlatformBadge platform={prob.platform} />

                      {isOver && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-950/50 text-rose-300 border border-rose-500/40">
                          Overdue by {daysOver} day{daysOver > 1 ? 's' : ''}
                        </span>
                      )}

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-500/20 text-violet-300 border border-violet-500/30">
                        Stage {stage}
                      </span>
                    </div>

                    <p className="text-xs text-slate-400">
                      {prob.topic} {prob.subtopic ? `• ${prob.subtopic}` : ''} • Scheduled:{' '}
                      <strong className="text-violet-300">
                        {prob.revisionScheduledDate || 'Today'}
                      </strong>
                    </p>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => startFocusSession(prob)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all hover:opacity-95"
                    >
                      <Clock size={13} />
                      <span>Focus Session</span>
                    </button>

                    <button
                      onClick={() => onOpenRevisionModal(prob)}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-[#121430] hover:bg-violet-950/50 text-violet-300 border border-violet-500/30 transition-colors flex items-center space-x-1.5"
                    >
                      <Repeat2 size={13} />
                      <span>Log Outcome</span>
                    </button>
                  </div>
                </div>

                {/* Mistakes & Learnings callout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  {prob.mistakes && (
                    <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 text-amber-300">
                      <span className="font-bold flex items-center space-x-1 mb-0.5 text-amber-200">
                        <AlertTriangle size={12} className="text-amber-400" />
                        <span>Previous Pitfalls / Mistakes:</span>
                      </span>
                      <p className="text-slate-300 leading-snug">{prob.mistakes}</p>
                    </div>
                  )}

                  {prob.patternLearned && (
                    <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/30 text-violet-300">
                      <span className="font-bold flex items-center space-x-1 mb-0.5 text-violet-200">
                        <Lightbulb size={12} className="text-violet-400" />
                        <span>Core Pattern to Recall:</span>
                      </span>
                      <p className="text-slate-300 leading-snug">{prob.patternLearned}</p>
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
