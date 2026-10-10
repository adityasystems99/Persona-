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
    if (score < 50) return 'text-rose-600';
    if (score < 75) return 'text-amber-600';
    return 'text-emerald-600';
  };

  const getGaugeStroke = (score: number) => {
    if (score < 50) return '#f43f5e';
    if (score < 75) return '#f59e0b';
    return '#10b981';
  };

  const handleWeightChange = (key: keyof typeof weights, value: number) => {
    const updatedWeights = { ...weights, [key]: value };
    updateSettings({ readinessWeights: updatedWeights });
  };

  return (
    <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border border-slate-200">
      {/* Title & Overall Readiness Gauge */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 pb-5 border-b border-slate-100">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <span className="p-1 rounded-lg bg-rose-100 text-rose-700">
              <Gauge size={16} />
            </span>
            <h3 className="font-extrabold text-slate-800 text-base tracking-tight">
              Interview Readiness Index
            </h3>
          </div>
          <p className="text-xs text-slate-500 max-w-lg leading-relaxed">
            Transparent composite readiness metric evaluated across 5 core preparation pillars.
            Not an objective probability of passing, but an actionable mirror of your preparation breadth.
          </p>
        </div>

        {/* Circular Metric Display */}
        <div className="flex items-center space-x-4 flex-shrink-0">
          <div className="text-right">
            <span className={`text-3xl font-extrabold tracking-tight ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </span>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">
              {overallScore >= 80 ? 'Optimal Readiness' : overallScore >= 60 ? 'Developing Momentum' : 'Needs Reinforcement'}
            </span>
          </div>

          <button
            onClick={() => setShowConfig(!showConfig)}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-500 transition-colors"
            title="Configure Metric Weights"
          >
            <Sliders size={16} />
          </button>
        </div>
      </div>

      {/* 5 Factors Breakdown Bar Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-3 mt-4">
        {/* Pillar 1: Topic Coverage */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Topic Breadth</span>
            <strong className="text-slate-800">{topicCoverageScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div className="h-full bg-blue-500 rounded-full" style={{ width: `${topicCoverageScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.coverage}%</span>
        </div>

        {/* Pillar 2: Independent Solving */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Independent Solves</span>
            <strong className="text-slate-800">{independentSolveScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${independentSolveScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.independent}%</span>
        </div>

        {/* Pillar 3: Revision Success */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Revision Recall</span>
            <strong className="text-slate-800">{revisionSuccessScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${revisionSuccessScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.revision}%</span>
        </div>

        {/* Pillar 4: Difficulty Distribution */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Medium/Hard Mix</span>
            <strong className="text-slate-800">{difficultyDistributionScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${difficultyDistributionScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.difficulty}%</span>
        </div>

        {/* Pillar 5: Consistency */}
        <div className="p-3 rounded-xl bg-white border border-slate-200 shadow-xs">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">STL & Consistency</span>
            <strong className="text-slate-800">{consistencyScore}%</strong>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mb-1.5">
            <div className="h-full bg-rose-500 rounded-full" style={{ width: `${consistencyScore}%` }} />
          </div>
          <span className="text-[10px] text-slate-400 block font-normal">Weight: {weights.consistency}%</span>
        </div>
      </div>

      {/* Actionable Gaps */}
      <div className="mt-4 pt-3 border-t border-slate-100">
        <span className="text-[11px] font-bold text-slate-700 block mb-1">
          Identified Preparation Gaps:
        </span>
        <div className="space-y-1">
          {actionableGaps.slice(0, 2).map((gap, i) => (
            <p key={i} className="text-xs text-slate-600 flex items-start space-x-1.5 leading-relaxed">
              <span className="text-rose-500 font-bold">•</span>
              <span>{gap}</span>
            </p>
          ))}
        </div>
      </div>

      {/* Formula & Weight Configuration Drawer */}
      {showConfig && (
        <div className="mt-4 p-4 rounded-2xl bg-white border border-slate-200 animate-in fade-in duration-150">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold text-slate-800 flex items-center space-x-1.5">
              <Sliders size={14} className="text-rose-500" />
              <span>Customize Indicator Factor Weights (%)</span>
            </h4>
            <span className="text-[10px] text-slate-400">Total should ideally equal 100%</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Coverage (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.coverage}
                onChange={(e) => handleWeightChange('coverage', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Independent (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.independent}
                onChange={(e) => handleWeightChange('independent', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Revision (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.revision}
                onChange={(e) => handleWeightChange('revision', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Difficulty (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.difficulty}
                onChange={(e) => handleWeightChange('difficulty', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-slate-600 mb-1">Consistency (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                value={weights.consistency}
                onChange={(e) => handleWeightChange('consistency', Number(e.target.value))}
                className="w-full text-xs font-bold p-2 border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
