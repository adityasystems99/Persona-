import React from 'react';
import {
  Trophy,
  Award,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Shield,
  Code2,
  Repeat2,
  Lock,
  RefreshCw,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Milestone } from '../../types/dsa';

export const MilestonesView: React.FC = () => {
  const { milestones } = useDSA();

  const unlockedCount = milestones.filter((m) => m.isUnlocked).length;
  const progressPct = Math.round((unlockedCount / milestones.length) * 100);

  const getCategoryColor = (cat: Milestone['category']) => {
    switch (cat) {
      case 'solving':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'revision':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'stl':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'consistency':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'mastery':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
  };

  const getMilestoneIcon = (id: string) => {
    switch (id) {
      case 'first_blood':
        return <Award size={22} className="text-amber-500" />;
      case 'memory_architect':
        return <Repeat2 size={22} className="text-purple-500" />;
      case 'stl_marathoner':
        return <Flame size={22} className="text-rose-500" />;
      case 'topic_champion':
        return <Trophy size={22} className="text-emerald-500" />;
      case 'complexity_analyst':
        return <Code2 size={22} className="text-blue-500" />;
      case 'resilient_recovery':
        return <RefreshCw size={22} className="text-teal-500" />;
      case 'stl_drill_master':
        return <Sparkles size={22} className="text-pink-500" />;
      case 'deep_focus':
        return <Clock size={22} className="text-indigo-500" />;
      default:
        return <Award size={22} className="text-amber-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Achievement Banner */}
      <div className="card-soft p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border-b border-slate-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="p-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white shadow-glow-coral">
                <Trophy size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 tracking-tight">
                Proof-of-Skill Milestones & Accolades
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 max-w-xl leading-relaxed">
              Earned exclusively through verified operational milestones — solving without hints, flawless spaced repetition recall, and continuous consistency. Never awardable by duplicate clicks.
            </p>
          </div>

          {/* Progress summary pill */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs text-center flex-shrink-0 min-w-44">
            <div className="text-2xl font-extrabold text-slate-800">
              {unlockedCount} <span className="text-sm text-slate-400 font-normal">/ {milestones.length}</span>
            </div>
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block mt-0.5">
              Accolades Unlocked
            </span>
            <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden mt-2">
              <div
                className="h-full bg-gradient-to-r from-rose-500 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Milestones Card Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {milestones.map((m) => {
          const progressRatio = Math.min(1, m.currentValue / m.targetValue);
          const pct = Math.round(progressRatio * 100);

          return (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                m.isUnlocked
                  ? 'bg-white border-amber-200/80 shadow-soft-sm hover:shadow-soft-md ring-1 ring-amber-400/20'
                  : 'bg-slate-50/70 border-slate-200/70 opacity-80'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    m.isUnlocked ? 'bg-amber-50 border border-amber-200/80' : 'bg-slate-200/60'
                  }`}>
                    {m.isUnlocked ? getMilestoneIcon(m.id) : <Lock size={18} className="text-slate-400" />}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryColor(m.category)}`}>
                    {m.category}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-slate-800 leading-snug">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                {m.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-700 font-bold">
                    <span className="flex items-center space-x-1">
                      <CheckCircle2 size={13} />
                      <span>Unlocked</span>
                    </span>
                    {m.unlockedAt && (
                      <span className="text-[10px] text-slate-400 font-normal">
                        {new Date(m.unlockedAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 mb-1">
                      <span>Progress</span>
                      <span>{m.currentValue} / {m.targetValue}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className="h-full bg-rose-500 rounded-full"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
