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
        return 'bg-blue-950/70 text-blue-300 border-blue-500/30';
      case 'revision':
        return 'bg-purple-950/70 text-purple-300 border-purple-500/30';
      case 'stl':
        return 'bg-violet-950/70 text-violet-300 border-violet-500/30';
      case 'consistency':
        return 'bg-amber-950/70 text-amber-300 border-amber-500/30';
      case 'mastery':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-500/30';
    }
  };

  const getMilestoneIcon = (id: string) => {
    switch (id) {
      case 'first_blood':
        return <Award size={22} className="text-amber-400" />;
      case 'memory_architect':
        return <Repeat2 size={22} className="text-purple-400" />;
      case 'stl_marathoner':
        return <Flame size={22} className="text-violet-400" />;
      case 'topic_champion':
        return <Trophy size={22} className="text-emerald-400" />;
      case 'complexity_analyst':
        return <Code2 size={22} className="text-blue-400" />;
      case 'resilient_recovery':
        return <RefreshCw size={22} className="text-teal-400" />;
      case 'stl_drill_master':
        return <Sparkles size={22} className="text-violet-300" />;
      case 'deep_focus':
        return <Clock size={22} className="text-indigo-400" />;
      default:
        return <Award size={22} className="text-amber-400" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-white">
      {/* Hero Achievement Banner */}
      <div className="card-soft p-6 sm:p-8 bg-[#101229]/80 border border-violet-500/20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="p-1.5 rounded-xl gradient-violet text-white shadow-glow-violet">
                <Trophy size={18} />
              </span>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                Proof-of-Skill Accolades & Badges
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl leading-relaxed">
              Earned exclusively through verified operational milestones — solving without hints, flawless spaced repetition recall, and continuous consistency. Never awardable by duplicate clicks.
            </p>
          </div>

          {/* Progress summary pill */}
          <div className="p-4 rounded-2xl bg-[#0b0c1e] border border-violet-500/20 shadow-xs text-center flex-shrink-0 min-w-44">
            <div className="text-2xl font-extrabold text-white">
              {unlockedCount} <span className="text-sm text-slate-400 font-normal">/ {milestones.length}</span>
            </div>
            <span className="text-[11px] font-bold text-violet-400 uppercase tracking-wider block mt-0.5">
              Accolades Unlocked
            </span>
            <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden mt-2">
              <div
                className="h-full gradient-violet rounded-full transition-all duration-500"
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
                  ? 'bg-[#141635] border-violet-500/50 shadow-glow-violet ring-1 ring-violet-500/30'
                  : 'bg-[#0e1026]/80 border-violet-900/30 opacity-75'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 ${
                    m.isUnlocked ? 'bg-violet-950/70 border border-violet-500/40' : 'bg-[#080914]'
                  }`}>
                    {m.isUnlocked ? getMilestoneIcon(m.id) : <Lock size={18} className="text-slate-500" />}
                  </div>

                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase tracking-wider ${getCategoryColor(m.category)}`}>
                    {m.category}
                  </span>
                </div>

                <h4 className="font-extrabold text-sm text-white leading-snug">
                  {m.title}
                </h4>

                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {m.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-violet-900/30">
                {m.isUnlocked ? (
                  <div className="flex items-center justify-between text-[11px] text-emerald-400 font-bold">
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
                    <div className="flex justify-between text-[10px] font-semibold text-slate-400 mb-1">
                      <span>Progress</span>
                      <span>{m.currentValue} / {m.targetValue}</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-violet-950/60 overflow-hidden">
                      <div
                        className="h-full bg-violet-600 rounded-full"
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
