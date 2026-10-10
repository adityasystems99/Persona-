import React, { useState } from 'react';
import {
  Database,
  Search,
  Filter,
  Plus,
  FileText,
  ExternalLink,
  CalendarPlus,
  Repeat2,
  Edit2,
  Trash2,
  Compass,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem, Difficulty, ProblemStatus } from '../../types/dsa';
import { DifficultyBadge, StatusBadge, PlatformBadge } from '../common/Badge';

interface QuestionBankViewProps {
  onOpenAddModal: () => void;
  onOpenBulkModal: () => void;
  onEditProblem: (problem: Problem) => void;
  onOpenRevisionModal: (problem: Problem) => void;
}

export const QuestionBankView: React.FC<QuestionBankViewProps> = ({
  onOpenAddModal,
  onOpenBulkModal,
  onEditProblem,
  onOpenRevisionModal,
}) => {
  const { problems, toggleInTodayPlan, deleteProblem } = useDSA();

  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'All'>('All');
  const [selectedTopic, setSelectedTopic] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Solved' | 'Unsolved' | 'Revision'>('All');

  // Extract unique topics for filter tabs
  const topicsList = ['All', ...Array.from(new Set(problems.map((p) => p.topic).filter(Boolean)))];

  const filtered = problems.filter((p) => {
    // Search
    const matchSearch =
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.topic.toLowerCase().includes(search.toLowerCase()) ||
      (p.subtopic && p.subtopic.toLowerCase().includes(search.toLowerCase())) ||
      (p.notes && p.notes.toLowerCase().includes(search.toLowerCase()));

    // Difficulty
    const matchDiff = selectedDifficulty === 'All' || p.difficulty === selectedDifficulty;

    // Topic
    const matchTopic = selectedTopic === 'All' || p.topic === selectedTopic;

    // Status
    let matchStatus = true;
    if (selectedStatus === 'Solved') {
      matchStatus = p.status === 'Solved Independently' || p.status === 'Solved with Hints';
    } else if (selectedStatus === 'Unsolved') {
      matchStatus = p.status === 'Not Started' || p.status === 'In Progress';
    } else if (selectedStatus === 'Revision') {
      matchStatus = p.needsRevision || p.status === 'Needs Revision';
    }

    return matchSearch && matchDiff && matchTopic && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-white">
      {/* Top action header */}
      <div className="card-soft p-5 sm:p-6 bg-[#101229]/80 border border-violet-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl gradient-violet text-white shadow-glow-violet">
                <Database size={18} />
              </span>
              <h2 className="text-xl font-extrabold text-white">
                DSA Question Bank
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Live algorithmic mission library ({problems.length} total cataloged problems)
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenBulkModal}
              className="px-3.5 py-2 rounded-xl text-xs font-bold text-slate-200 bg-[#0b0c1e] border border-violet-500/20 shadow-sm hover:bg-[#151733] flex items-center space-x-1.5 transition-all"
            >
              <FileText size={15} />
              <span>Bulk Ingest</span>
            </button>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Plus size={16} />
              <span>New Question</span>
            </button>
          </div>
        </div>

        {/* Filters strip */}
        <div className="mt-5 pt-4 border-t border-violet-900/30 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title, topic, intuition keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-500/30 placeholder:text-slate-500"
            />
          </div>

          {/* Difficulty & Status Selectors */}
          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedTopic}
              onChange={(e) => setSelectedTopic(e.target.value)}
              className="text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {topicsList.map((t) => (
                <option key={t} value={t}>
                  Topic: {t}
                </option>
              ))}
            </select>

            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value as Difficulty | 'All')}
              className="text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <option value="All">Difficulty: All</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              <option value="All">Status: All</option>
              <option value="Unsolved">Unsolved</option>
              <option value="Solved">Solved</option>
              <option value="Revision">In Revision Queue</option>
            </select>
          </div>
        </div>
      </div>

      {/* Questions Table / Cards */}
      <div className="card-soft overflow-hidden bg-[#101229]/80 border border-violet-500/20">
        {filtered.length === 0 ? (
          <div className="py-16 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-violet-950/60 text-violet-400 border border-violet-500/20 flex items-center justify-center mb-3">
              <Compass size={28} className="animate-pulse" />
            </div>
            <h4 className="text-sm font-bold text-white">Question Bank Standby</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm">
              {problems.length === 0
                ? "No questions cataloged yet. Add individual questions or paste multiple problems to initialize your bank!"
                : "No questions match your filter query. Adjust the filters above."}
            </p>
            <button
              onClick={onOpenAddModal}
              className="mt-4 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all"
            >
              <Plus size={14} />
              <span>Catalog First Question</span>
            </button>
          </div>
        ) : (
          <div className="divide-y divide-violet-900/20">
            {filtered.map((problem) => (
              <div
                key={problem.id}
                className="p-4 sm:p-5 hover:bg-[#151735]/70 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1.5">
                    <a
                      href={problem.url || '#'}
                      target={problem.url ? '_blank' : '_self'}
                      rel="noreferrer"
                      className="font-bold text-sm text-white hover:text-violet-300 transition-colors inline-flex items-center group"
                    >
                      <span className="truncate">{problem.title}</span>
                      {problem.url && (
                        <ExternalLink
                          size={13}
                          className="ml-1 text-slate-500 group-hover:text-violet-300 transition-colors"
                        />
                      )}
                    </a>
                    <DifficultyBadge difficulty={problem.difficulty} size="sm" />
                    {problem.platform && <PlatformBadge platform={problem.platform} />}
                    <StatusBadge status={problem.status} />
                  </div>

                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-400">
                    <span className="font-semibold text-violet-300">
                      {problem.topic} {problem.subtopic ? `• ${problem.subtopic}` : ''}
                    </span>
                    {problem.timeComplexity && (
                      <span className="font-mono text-slate-400">
                        TC: {problem.timeComplexity} | SC: {problem.spaceComplexity}
                      </span>
                    )}
                    {problem.timeSpentMinutes > 0 && (
                      <span>Time: {problem.timeSpentMinutes}m</span>
                    )}
                  </div>

                  {problem.approach && (
                    <p className="text-xs text-slate-300 mt-2 bg-[#0b0c1e] p-2.5 rounded-xl border border-violet-500/20 font-mono text-[11px] leading-relaxed">
                      <span className="font-bold text-violet-300 font-sans">Approach: </span>
                      {problem.approach}
                    </p>
                  )}
                </div>

                {/* Fast Action Buttons */}
                <div className="flex items-center space-x-1.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-violet-900/30">
                  {/* Today Plan toggle */}
                  <button
                    onClick={() => toggleInTodayPlan(problem.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
                      problem.inTodayPlan
                        ? 'bg-violet-950/80 text-violet-300 border border-violet-500/40'
                        : 'bg-[#0b0c1e] text-slate-400 hover:text-white border border-violet-500/20'
                    }`}
                    title={problem.inTodayPlan ? 'Remove from Today' : 'Add to Today'}
                  >
                    <CalendarPlus size={13} />
                    <span>{problem.inTodayPlan ? 'In Orbit' : '+ Today'}</span>
                  </button>

                  {/* Revision Queue Toggle */}
                  <button
                    onClick={() => onOpenRevisionModal(problem)}
                    className={`p-2 rounded-xl transition-all ${
                      problem.needsRevision
                        ? 'bg-purple-950/70 text-purple-300 border border-purple-500/30'
                        : 'text-slate-400 hover:bg-purple-950/30 hover:text-purple-300 border border-transparent'
                    }`}
                    title="Revision Queue"
                  >
                    <Repeat2 size={15} />
                  </button>

                  {/* Edit */}
                  <button
                    onClick={() => onEditProblem(problem)}
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-violet-950/40"
                    title="Edit Problem"
                  >
                    <Edit2 size={15} />
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => deleteProblem(problem.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-950/30"
                    title="Delete Problem"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
