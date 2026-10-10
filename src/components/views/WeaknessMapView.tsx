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
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-violet-950/80 text-violet-300 border border-violet-500/40">
            Critical Focus
          </span>
        );
      case 'Needs Practice':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40">
            Needs Practice
          </span>
        );
      case 'Developing':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-indigo-950/80 text-indigo-300 border border-indigo-500/40">
            Developing
          </span>
        );
      case 'Proficient':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            Proficient
          </span>
        );
      case 'Mastered':
        return (
          <span className="px-2.5 py-0.5 text-[11px] font-extrabold rounded-full bg-teal-950/80 text-teal-300 border border-teal-500/40">
            Mastered
          </span>
        );
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 40) return 'text-violet-400';
    if (score < 70) return 'text-amber-400';
    if (score < 85) return 'text-indigo-400';
    return 'text-emerald-400';
  };

  const topicProblems = problems.filter((p) => p.topic === selectedTopic);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-white">
      {/* Header Banner */}
      <div className="card-soft p-6 bg-[#101229]/80 border border-violet-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <span className="p-1.5 rounded-xl gradient-violet text-white shadow-glow-violet">
                <BrainCircuit size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-white tracking-tight">
                Weakness Intelligence Map
              </h2>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
              Algorithmic intuition evaluated across hint dependencies, repeat attempts, revision recall, and independent velocity to surface genuine operational gaps.
            </p>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-violet-950/70 border border-violet-500/30 text-center">
              <span className="block text-xs font-bold text-violet-300">
                {weakestTopics.length} Focus Area{weakestTopics.length !== 1 ? 's' : ''}
              </span>
              <span className="text-[10px] text-violet-400 font-medium">Require Reinforcement</span>
            </div>
            <div className="px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-500/30 text-center">
              <span className="block text-xs font-bold text-emerald-300">
                {topicMasteryMap.filter((t) => t.status === 'Proficient' || t.status === 'Mastered').length} Solid
              </span>
              <span className="text-[10px] text-emerald-400 font-medium">Mission Ready</span>
            </div>
          </div>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-5 pt-4 border-t border-violet-900/30 flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-xs w-full">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search topic or category..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 placeholder:text-slate-500"
            />
          </div>

          <div className="flex items-center space-x-2 flex-wrap gap-y-1">
            <span className="text-xs text-slate-400 font-medium">Filter:</span>
            {['All', 'Critical Weakness', 'Needs Practice', 'Developing', 'Proficient', 'Mastered'].map((st) => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 text-[11px] font-bold rounded-lg transition-colors ${
                  filterStatus === st
                    ? 'bg-violet-600 text-white shadow-sm'
                    : 'bg-[#0b0c1e] text-slate-400 border border-violet-500/20 hover:text-white'
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
                      ? 'bg-[#151735] border-violet-500 shadow-glow-violet ring-2 ring-violet-500/30'
                      : 'bg-[#101229]/80 hover:bg-[#151735] border-violet-500/20'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h4 className="font-extrabold text-white text-sm truncate">
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
                    <div className="w-full h-2 rounded-full bg-violet-950/60 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.masteryScore < 40
                            ? 'bg-violet-500'
                            : item.masteryScore < 70
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${item.masteryScore}%` }}
                      />
                    </div>
                  </div>

                  {/* Summary bullets */}
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-violet-900/30">
                    <span>{item.solvedCount} / {item.totalProblems} Solved</span>
                    <span>{item.independentCount} Solo</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Recommended Revision Drill Row */}
          {recommendedRevisionProblems.length > 0 && (
            <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
              <div className="flex items-center space-x-2 mb-3">
                <Target size={16} className="text-violet-400" />
                <h3 className="font-extrabold text-white text-sm">
                  Recommended Weakness Re-Drill Questions
                </h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {recommendedRevisionProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-3 rounded-xl bg-[#0b0c1e] border border-violet-500/20 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <span className="font-bold text-xs text-white truncate block">
                        {prob.title}
                      </span>
                      <span className="text-[10px] text-violet-400">{prob.topic}</span>
                    </div>
                    <button
                      onClick={() => startFocusSession(prob)}
                      className="px-2.5 py-1 text-[11px] font-bold text-white gradient-violet rounded-lg shadow-sm flex items-center space-x-1"
                    >
                      <span>Drill</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Col: Deep Dive Telemetry for Selected Topic */}
        <div className="space-y-6">
          <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-violet-900/30">
              <h3 className="font-extrabold text-white text-sm">
                Topic Autopsy: {activeTopicStats.topic}
              </h3>
              {getStatusBadge(activeTopicStats.status)}
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 gap-2.5 mb-4">
              <div className="p-3 rounded-xl bg-[#0b0c1e] border border-violet-500/20">
                <span className="block text-[10px] text-slate-400 font-medium">Solo Solve Rate</span>
                <span className="text-base font-extrabold text-white">
                  {activeTopicStats.solvedCount > 0
                    ? Math.round((activeTopicStats.independentCount / activeTopicStats.solvedCount) * 100)
                    : 0}%
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {activeTopicStats.independentCount} of {activeTopicStats.solvedCount} solved
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0c1e] border border-violet-500/20">
                <span className="block text-[10px] text-slate-400 font-medium">Hint Dependency</span>
                <span className={`text-base font-extrabold ${activeTopicStats.hintsCount > 0 ? 'text-violet-400' : 'text-white'}`}>
                  {activeTopicStats.solvedCount > 0
                    ? Math.round((activeTopicStats.hintsCount / activeTopicStats.solvedCount) * 100)
                    : 0}%
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {activeTopicStats.hintsCount} required hints
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0c1e] border border-violet-500/20">
                <span className="block text-[10px] text-slate-400 font-medium">Avg Solve Attempts</span>
                <span className="text-base font-extrabold text-white">
                  {activeTopicStats.avgAttempts}x
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  Total {activeTopicStats.attemptsTotal} attempts
                </span>
              </div>

              <div className="p-3 rounded-xl bg-[#0b0c1e] border border-violet-500/20">
                <span className="block text-[10px] text-slate-400 font-medium">Revision Failures</span>
                <span className={`text-base font-extrabold ${activeTopicStats.revisionFails > 0 ? 'text-violet-400' : 'text-emerald-400'}`}>
                  {activeTopicStats.revisionFails}
                </span>
                <span className="block text-[10px] text-slate-400 mt-0.5">
                  {activeTopicStats.revisionFails === 0 ? 'Flawless recall' : 'Failed intervals'}
                </span>
              </div>
            </div>

            {/* Explanation card */}
            <div className="p-3.5 rounded-xl bg-[#0b0c1e] border border-violet-500/30 mb-4 text-xs text-violet-200 leading-relaxed">
              <span className="font-bold block mb-1 text-violet-300">Diagnostic Assessment:</span>
              {activeTopicStats.explanation}
            </div>

            {/* Subtopic breakdown */}
            <div>
              <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center space-x-1.5">
                <Layers size={13} className="text-violet-400" />
                <span>Subtopic Mastery Breakdown</span>
              </h4>

              {activeTopicStats.subtopics.length === 0 ? (
                <div className="text-xs text-slate-400 py-3 text-center">
                  No subtopic problems cataloged yet.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {activeTopicStats.subtopics.map((sub, i) => (
                    <div
                      key={i}
                      className="p-2 rounded-lg bg-[#0b0c1e] border border-violet-500/20 flex items-center justify-between text-xs"
                    >
                      <span className="text-slate-200 font-medium truncate">{sub.name}</span>
                      <span className="text-[11px] font-bold text-violet-400">
                        {sub.solved} / {sub.total}
                      </span>
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
