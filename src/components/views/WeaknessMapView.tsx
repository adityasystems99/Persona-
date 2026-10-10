import React, { useState } from 'react';
import {
  BrainCircuit,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  HelpCircle,
  Repeat2,
  ArrowRight,
  Target,
  Sparkles,
  Search,
  Filter,
  BarChart2,
  Layers,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { TopicMasteryStats, Problem } from '../../types/dsa';
import { DifficultyBadge } from '../common/Badge';

interface WeaknessMapViewProps {
  onStartFocusProblem?: (problem: Problem) => void;
  onOpenRevisionModal?: (problem: Problem) => void;
}

export const WeaknessMapView: React.FC<WeaknessMapViewProps> = ({
  onStartFocusProblem,
  onOpenRevisionModal,
}) => {
  const {
    topicMasteryMap,
    weakestTopics,
    recommendedRevisionProblems,
    problems,
    startFocusSession,
  } = useDSA();

  const [selectedTopic, setSelectedTopic] = useState<string>(
    weakestTopics.length > 0 ? weakestTopics[0].topic : (topicMasteryMap[0]?.topic || 'Arrays & Hashing')
  );
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [search, setSearch] = useState('');

  const activeTopicStats = topicMasteryMap.find((t) => t.topic === selectedTopic) || topicMasteryMap[0];

  const filteredTopics = topicMasteryMap.filter((t) => {
    const matchesSearch = t.topic.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'All' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: TopicMasteryStats['status']) => {
    switch (status) {
      case 'Critical Weakness':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-rose-100 text-rose-700 border border-rose-300">
            Critical Weakness
          </span>
        );
      case 'Needs Practice':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-100 text-amber-700 border border-amber-300">
            Needs Practice
          </span>
        );
      case 'Developing':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-blue-100 text-blue-700 border border-blue-300">
            Developing
          </span>
        );
      case 'Proficient':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-100 text-emerald-700 border border-emerald-300">
            Proficient
          </span>
        );
      case 'Mastered':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-teal-100 text-teal-800 border border-teal-300">
            Mastered
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-rose-600';
    if (score < 70) return 'text-amber-600';
    if (score < 85) return 'text-blue-600';
    return 'text-emerald-600';
  };

  const topicProblems = problems.filter((p) => p.topic === selectedTopic);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="card-soft p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="p-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow-coral">
                <BrainCircuit size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">
                Weakness Intelligence Map
              </h2>
            </div>
            <p className="text-xs text-slate-500 max-w-2xl leading-relaxed">
              Real algorithmic intuition cannot be claimed merely by marking questions complete.
              AlgoPulse evaluates hint dependencies, repeat attempts, revision failures, and independent solving velocity to surface your true operational weaknesses.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-center">
              <span className="block text-xs font-bold text-rose-700">
                {weakestTopics.length} Focus Area{weakestTopics.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] text-rose-500 font-medium">Require Reinforcement</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="block text-xs font-bold text-emerald-700">
                {topicMasteryMap.filter((t) => t.status === 'Proficient' || t.status === 'Mastered').length} Solid
              </span>
              <span className="text-[10px] text-emerald-500 font-medium">Interview Ready</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-400 font-medium">Filter by Status:</span>
            {['All', 'Critical Weakness', 'Needs Practice', 'Developing', 'Proficient', 'Mastered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  filterStatus === st
                    ? 'bg-slate-800 text-white'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: Left Topic Grid, Right Deep-Dive telemetry card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Topic Mastery Grid */}
        <div className="lg:col-span-2 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {filteredTopics.map((item) => {
              const isSelected = item.topic === selectedTopic;
              return (
                <div
                  key={item.topic}
                  onClick={() => setSelectedTopic(item.topic)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white border-rose-500 shadow-md ring-2 ring-rose-500/20'
                      : 'bg-white/80 hover:bg-white border-slate-200/90 hover:border-slate-300 shadow-xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-extrabold text-slate-800 text-sm truncate">
                      {item.topic}
                    </h4>
                    {getStatusBadge(item.status)}
                  </div>

                  {/* Progress / Mastery Bar */}
                  <div className="space-y-1 mb-2.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-slate-400">Mastery Index</span>
                      <span className={`font-extrabold ${getScoreColor(item.masteryScore)}`}>
                        {item.masteryScore}%
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.masteryScore < 40
                            ? 'bg-rose-500'
                            : item.masteryScore < 70
                            ? 'bg-amber-500'
                            : item.masteryScore < 85
                            ? 'bg-blue-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.max(5, item.masteryScore)}%` }}
                      />
                    </div>
                  </div>

                  {/* Data Explanation Behind Weakness */}
                  <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                    {item.explanation}
                  </p>

                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
                    <span>{item.solvedCount} of {item.totalProblems} solved</span>
                    <span>{item.independentCount} independent</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Practice Queue from Weaknesses */}
          {recommendedRevisionProblems.length > 0 && (
            <div className="card-soft p-5 bg-gradient-to-r from-rose-50/40 via-white to-amber-50/30 border border-rose-100">
              <div className="flex items-center space-x-2 mb-2">
                <Target size={16} className="text-rose-600" />
                <h3 className="text-sm font-extrabold text-slate-800">
                  Targeted Reinforcement Queue (Recommended Next Actions)
                </h3>
              </div>
              <p className="text-xs text-slate-500 mb-3.5 leading-relaxed">
                Problems selected specifically where you required hints or failed revisions in your weakest categories:
              </p>

              <div className="divide-y divide-slate-100 bg-white rounded-xl border border-slate-200/80 overflow-hidden">
                {recommendedRevisionProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-3.5 flex items-center justify-between hover:bg-slate-50/60 transition-colors gap-3"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-xs text-slate-800 truncate">
                          {prob.title}
                        </span>
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </div>
                      <div className="flex items-center space-x-2 text-[10px] text-slate-400 mt-0.5">
                        <span>{prob.topic}</span>
                        {prob.hintsUsed && prob.hintsUsed > 0 ? (
                          <>
                            <span>•</span>
                            <span className="text-rose-600 font-semibold">{prob.hintsUsed} hint(s) used</span>
                          </>
                        ) : null}
                        {prob.mistakes && (
                          <>
                            <span>•</span>
                            <span className="text-amber-600 truncate max-w-xs">{prob.mistakes}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        startFocusSession(prob);
                        if (onStartFocusProblem) onStartFocusProblem(prob);
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1 flex-shrink-0 active:scale-95 transition-all"
                    >
                      <span>Focus Mode</span>
                      <ArrowRight size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Deep Dive Telemetry for Selected Topic */}
        <div className="space-y-6">
          <div className="card-soft p-5 bg-white border border-slate-200">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-800 text-sm">
                Topic Autopsy: {activeTopicStats.topic}
              </h3>
              {getStatusBadge(activeTopicStats.status)}
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium">Independent Solve Rate</span>
                <span className="text-base font-extrabold text-slate-800">
                  {activeTopicStats.solvedCount > 0
                    ? Math.round((activeTopicStats.independentCount / activeTopicStats.solvedCount) * 100)
                    : 0}%
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  {activeTopicStats.independentCount} of {activeTopicStats.solvedCount} solved
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium">Hint Dependency</span>
                <span className={`text-base font-extrabold ${activeTopicStats.hintsCount > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                  {activeTopicStats.solvedCount > 0
                    ? Math.round((activeTopicStats.hintsCount / activeTopicStats.solvedCount) * 100)
                    : 0}%
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  {activeTopicStats.hintsCount} required hints
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium">Avg Solve Attempts</span>
                <span className="text-base font-extrabold text-slate-800">
                  {activeTopicStats.avgAttempts}x
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  Total {activeTopicStats.attemptsTotal} attempts
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="block text-[10px] text-slate-400 font-medium">Revision Failures</span>
                <span className={`text-base font-extrabold ${activeTopicStats.revisionFails > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                  {activeTopicStats.revisionFails}
                </span>
                <span className="block text-[10px] text-slate-500 mt-0.5">
                  {activeTopicStats.revisionFails === 0 ? 'Flawless recall' : 'Failed intervals'}
                </span>
              </div>
            </div>

            {/* Explanation card */}
            <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200/80 mb-4 text-xs text-amber-900 leading-relaxed">
              <span className="font-bold block mb-1">Diagnostic Assessment:</span>
              {activeTopicStats.explanation}
            </div>

            {/* Subtopic breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-700 mb-2 flex items-center space-x-1.5">
                <Layers size={13} className="text-slate-500" />
                <span>Subtopic Mastery Breakdown</span>
              </h4>

              {activeTopicStats.subtopics.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center">
                  No subtopic problems cataloged yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {activeTopicStats.subtopics.map((sub) => (
                    <div
                      key={sub.name}
                      className="p-2 rounded-lg bg-slate-50 flex items-center justify-between text-xs"
                    >
                      <span className="font-semibold text-slate-700 truncate">{sub.name}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-[11px] text-slate-500">
                          {sub.solved}/{sub.total}
                        </span>
                        {sub.needsHelp ? (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-rose-100 text-rose-700">
                            Needs Help
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 text-emerald-700">
                            Solid
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
