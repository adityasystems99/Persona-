import React, { useState } from 'react';
import {
  Gauge,
  Info,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Sliders,
  Sparkles,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';

export const InterviewReadinessWidget: React.FC = () => {
  const { readinessBreakdown, settings, updateSettings } = useDSA();
  const [showConfig, setShowConfig] = useState(false);

  const {
    overallScore,
    topicCoverageScore,
    independentSolveScore,
    revisionSuccessScore,
    difficultyDistributionScore,
    consistencyScore,
    weights,
    explanation,
    actionableGaps,
  } = readinessBreakdown;

  const getScoreColor = (score: number) => {
    if (score < 50) return 'text-violet-400';
    if (score < 75) return 'text-amber-400';
    return 'text-emerald-400';
  };

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const updatedWeights = { ...weights, [key]: value };
    updateSettings({ readinessWeights: updatedWeights });
  };

  return (
    <div className="card-soft p-5 sm:p-6 mb-6">
      {/* Title & Overall Readiness Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-violet-900/30">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1.5 rounded-lg bg-violet-950/70 text-violet-300 border border-violet-500/20">
              <Gauge size={16} />
            </span>
            <h3 className="font-extrabold text-white text-base tracking-tight">
              Interview Readiness Meter
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
            Dynamic preparation index computed across 5 pillars. As you add and conquer problems, your telemetry reflects in real-time.
          </p>
        </div>

        {/* Circular Metric Display */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-right">
            <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {overallScore >= 80 ? 'Optimal Readiness' : overallScore >= 50 ? 'Developing Trajectory' : 'Initial Orbit'}
            </span>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-xl border border-violet-500/20 hover:bg-violet-950/40 text-slate-300 transition-colors"
            title="Configure Metric Weights"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* 5 Factors Breakdown Bar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
        {/* Pillar 1: Topic Coverage */}
        <div className="p-3 rounded-xl bg-[#12142e]/90 border border-violet-500/20 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Topic Breadth</span>
            <strong className="text-white">{topicCoverageScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mb-1.5">
            <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${topicCoverageScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.coverage}%</span>
        </div>

        {/* Pillar 2: Independent Solving */}
        <div className="p-3 rounded-xl bg-[#12142e]/90 border border-violet-500/20 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Solo Solves</span>
            <strong className="text-white">{independentSolveScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mb-1.5">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${independentSolveScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.independent}%</span>
        </div>

        {/* Pillar 3: Revision Success */}
        <div className="p-3 rounded-xl bg-[#12142e]/90 border border-violet-500/20 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Revision Recall</span>
            <strong className="text-white">{revisionSuccessScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mb-1.5">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${revisionSuccessScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.revision}%</span>
        </div>

        {/* Pillar 4: Difficulty Distribution */}
        <div className="p-3 rounded-xl bg-[#12142e]/90 border border-violet-500/20 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">Medium/Hard Mix</span>
            <strong className="text-white">{difficultyDistributionScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mb-1.5">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${difficultyDistributionScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.difficulty}%</span>
        </div>

        {/* Pillar 5: Consistency */}
        <div className="p-3 rounded-xl bg-[#12142e]/90 border border-violet-500/20 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-400 font-medium">STL & Habit</span>
            <strong className="text-white">{consistencyScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mb-1.5">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${consistencyScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.consistency}%</span>
        </div>
      </div>

      {/* Actionable Gaps */}
      <div className="mt-4 pt-3 border-t border-violet-900/30">
        <span className="text-[11px] font-bold text-violet-300 block mb-1">
          Mission Recommendations:
        </span>
        <div className="space-y-1">
          {actionableGaps.slice(0, 2).map((gap, i) => (
            <p key={i} className="text-xs text-slate-300 flex items-start space-x-1.5 leading-relaxed">
              <span className="text-violet-400 font-bold">•</span>
              <span>{gap}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Formula & Weight Configuration Drawer */}
      {showConfig && (
        <div className="mt-4 p-4 rounded-2xl bg-[#0b0c1e] border border-violet-500/30 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
              <Sliders size={14} className="text-violet-400" />
              <span>Customize Indicator Factor Weights (%)</span>
            </h4>
            <span className="text-[10px] text-slate-400">Total should equal 100%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Coverage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.coverage}
                onChange={(e) => handleWeightChange('coverage', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-[#12142e] text-white border border-violet-500/30 rounded-lg focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Independent (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.independent}
                onChange={(e) => handleWeightChange('independent', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-[#12142e] text-white border border-violet-500/30 rounded-lg focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Revision (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.revision}
                onChange={(e) => handleWeightChange('revision', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-[#12142e] text-white border border-violet-500/30 rounded-lg focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Difficulty (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.difficulty}
                onChange={(e) => handleWeightChange('difficulty', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-[#12142e] text-white border border-violet-500/30 rounded-lg focus:outline-none focus:border-violet-400"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-400 mb-1">Consistency (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.consistency}
                onChange={(e) => handleWeightChange('consistency', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 bg-[#12142e] text-white border border-violet-500/30 rounded-lg focus:outline-none focus:border-violet-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
