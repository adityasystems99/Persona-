import React, { useState } from 'react';
import {
  Play,
  Pause,
  CheckCircle,
  XCircle,
  HelpCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  Coffee,
  CheckCheck,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { ProblemStatus } from '../../types/dsa';
import { DifficultyBadge } from '../common/Badge';

export const FocusModeView: React.FC = () => {
  const {
    activeFocusSession,
    problems,
    startFocusSession,
    pauseFocusSession,
    resumeFocusSession,
    recordFocusHint,
    recordFocusMistake,
    finishFocusSession,
    cancelFocusSession,
    focusSessions,
  } = useDSA();

  const [hintInput, setHintInput] = useState('');
  const [mistakeInput, setMistakeInput] = useState('');
  const [approachNotes, setApproachNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ProblemStatus>('Solved Independently');
  const [isFinishing, setIsFinishing] = useState(false);

  // If no session is active, show problem launcher selector
  if (!activeFocusSession) {
    const todayProblems = problems.filter((p) => p.inTodayPlan);
    const candidateProblems = todayProblems.length > 0 ? todayProblems : problems.slice(0, 8);

    return (
      <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
        <div className="card-soft p-8 text-center bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
          <div className="w-16 h-16 rounded-3xl gradient-violet text-white flex items-center justify-center mx-auto mb-4 shadow-glow-violet">
            <Clock size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-white tracking-tight">
            Deep Space Hyperfocus Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto mt-2 leading-relaxed">
            Eliminate all browser clutter, tabs, and context switches. Launch a targeted focus session with wall-clock precision, break segmentation, and live mistake telemetry.
          </p>

          <div className="mt-8 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Mission Problem to Initiate Focus
            </h3>

            {candidateProblems.length === 0 ? (
              <div className="p-8 text-center bg-[#080916] border border-dashed border-violet-500/20 rounded-2xl">
                <p className="text-xs text-slate-400 font-medium">No questions currently in queue.</p>
                <p className="text-[11px] text-slate-500 mt-1">Add problems in the Question Bank or Daily Plan to launch focus sessions.</p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {candidateProblems.map((prob) => (
                  <div
                    key={prob.id}
                    className="p-4 rounded-xl bg-[#0c0e22]/80 border border-violet-500/20 hover:border-violet-500/40 hover:shadow-glow-violet/10 transition-all flex items-center justify-between gap-4 group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center space-x-2">
                        <h4 className="font-bold text-sm text-white group-hover:text-violet-300 transition-colors truncate">
                          {prob.title}
                        </h4>
                        <DifficultyBadge difficulty={prob.difficulty} />
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        <span className="text-violet-400">{prob.topic}</span> {prob.subtopic ? `• ${prob.subtopic}` : ''} • Status: {prob.status}
                      </p>
                    </div>

                    <button
                      onClick={() => startFocusSession(prob)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1.5 active:scale-95 transition-all flex-shrink-0 hover:opacity-95"
                    >
                      <Play size={14} fill="currentColor" />
                      <span>Launch Focus</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Focus Session History */}
        {focusSessions.length > 0 && (
          <div className="card-soft p-6 bg-[#0c0e22]/90 border border-violet-500/20">
            <h3 className="text-sm font-extrabold text-white mb-4 flex items-center space-x-2">
              <Clock size={16} className="text-violet-400" />
              <span>Recent Orbital Focus Telemetry</span>
            </h3>

            <div className="divide-y divide-violet-500/10">
              {focusSessions.slice(0, 5).map((f) => (
                <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-white">{f.problemTitle}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(f.startedAt).toLocaleDateString()} • {Math.round(f.activeSeconds / 60)}m focus • {Math.round(f.breakSeconds / 60)}m breaks
                      {f.hintsUsed > 0 && <span className="text-violet-400 ml-1.5 font-semibold">• {f.hintsUsed} hint(s)</span>}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold text-[10px]">
                    Completed
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Active Session View
  const targetProblem = problems.find((p) => p.id === activeFocusSession.problemId);
  const isRunning = activeFocusSession.status === 'running';

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleAddHint = () => {
    if (!hintInput.trim()) return;
    recordFocusHint(hintInput.trim());
    setHintInput('');
  };

  const handleAddMistake = () => {
    if (!mistakeInput.trim()) return;
    recordFocusMistake(mistakeInput.trim());
    setMistakeInput('');
  };

  const handleFinish = () => {
    finishFocusSession(selectedStatus, approachNotes);
    setIsFinishing(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Immersive Focus Shell Header */}
      <div className="card-soft p-6 sm:p-8 bg-[#090b1c] text-white rounded-3xl border border-violet-500/30 relative overflow-hidden shadow-glow-violet/20">
        <div className="absolute top-0 right-0 p-32 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-violet-500/10">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                isRunning ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span>{isRunning ? 'DEEP FOCUS ACTIVE' : 'ORBIT PAUSED (BREAK TIME)'}</span>
              </span>
              {targetProblem && <DifficultyBadge difficulty={targetProblem.difficulty} />}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeFocusSession.problemTitle}
            </h2>

            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span className="text-violet-300">{targetProblem?.topic || 'General DSA'}</span>
              {targetProblem?.url && (
                <a
                  href={targetProblem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-violet-400 hover:text-violet-300 flex items-center space-x-1 font-semibold"
                >
                  <span>Open Platform Link</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={cancelFocusSession}
            className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all self-start sm:self-auto"
          >
            Abort Session
          </button>
        </div>

        {/* Central Timer & Control Hub */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tight text-white mb-2 text-glow-violet">
            {formatTimer(activeFocusSession.accumulatedFocusSeconds)}
          </div>
          <span className="text-xs uppercase tracking-widest text-violet-400 font-bold mb-6">
            Active Hyperfocus Telemetry
          </span>

          {/* Timing Segregation Metrics */}
          <div className="flex items-center space-x-6 text-xs text-slate-400 mb-8">
            <div className="flex items-center space-x-1.5">
              <Clock size={14} className="text-emerald-400" />
              <span>Focus: <strong className="text-white font-mono">{Math.round(activeFocusSession.accumulatedFocusSeconds / 60)}m</strong></span>
            </div>
            <div className="w-1 h-1 rounded-full bg-violet-500/30" />
            <div className="flex items-center space-x-1.5">
              <Coffee size={14} className="text-amber-400" />
              <span>Breaks: <strong className="text-white font-mono">{Math.round(activeFocusSession.accumulatedBreakSeconds / 60)}m</strong></span>
            </div>
            <div className="w-1 h-1 rounded-full bg-violet-500/30" />
            <div className="flex items-center space-x-1.5">
              <HelpCircle size={14} className="text-violet-400" />
              <span>Hints: <strong className="text-white font-mono">{activeFocusSession.hintsUsed}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isRunning ? (
              <button
                onClick={pauseFocusSession}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-amber-500/20 border border-amber-500/40 text-amber-200 hover:bg-amber-500/30 flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Pause size={16} fill="currentColor" />
                <span>Pause Orbit</span>
              </button>
            ) : (
              <button
                onClick={resumeFocusSession}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 hover:bg-emerald-500/30 flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Play size={16} fill="currentColor" />
                <span>Resume Hyperfocus</span>
              </button>
            )}

            <button
              onClick={() => setIsFinishing(true)}
              className="px-6 py-3 rounded-2xl text-sm font-bold gradient-violet shadow-glow-violet text-white flex items-center space-x-2 active:scale-95 transition-all hover:opacity-95"
            >
              <CheckCheck size={18} />
              <span>Conclude & Log Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Notes, Hints & Mistakes Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hint Recording Card */}
        <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
              <HelpCircle size={16} className="text-violet-400" />
              <span>Hints Consulted ({activeFocusSession.hintsUsed})</span>
            </h4>
            <span className="text-[10px] text-slate-400">Track external clues</span>
          </div>

          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="Record hint idea (e.g. monotonic stack)..."
              value={hintInput}
              onChange={(e) => setHintInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-[#080916] border border-violet-500/20 text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-400"
            />
            <button
              onClick={handleAddHint}
              className="px-3.5 py-2 bg-violet-500/20 hover:bg-violet-500/30 text-violet-300 text-xs font-bold rounded-xl border border-violet-500/30 transition-colors"
            >
              Log Clue
            </button>
          </div>

          {activeFocusSession.hintNotes ? (
            <pre className="text-xs text-slate-300 bg-[#060712] border border-violet-500/20 p-3 rounded-xl whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
              {activeFocusSession.hintNotes}
            </pre>
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center italic">
              No hints checked. Independent problem solving active.
            </p>
          )}
        </div>

        {/* Mistake Recording Card */}
        <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-white flex items-center space-x-1.5">
              <AlertTriangle size={16} className="text-amber-400" />
              <span>Pitfalls & Edge Cases</span>
            </h4>
            <span className="text-[10px] text-slate-400">Feed to Spaced Queue</span>
          </div>

          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Forgot empty array check / off-by-one..."
              value={mistakeInput}
              onChange={(e) => setMistakeInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 bg-[#080916] border border-violet-500/20 text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-400"
            />
            <button
              onClick={handleAddMistake}
              className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold rounded-xl border border-amber-500/30 transition-colors"
            >
              Log Pitfall
            </button>
          </div>

          {activeFocusSession.mistakesRecorded ? (
            <pre className="text-xs text-amber-200 bg-[#060712] border border-amber-500/20 p-3 rounded-xl whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
              {activeFocusSession.mistakesRecorded}
            </pre>
          ) : (
            <p className="text-xs text-slate-500 py-3 text-center italic">
              No mistakes logged yet during this focus block.
            </p>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-[#04040a]/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0f1128] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-violet-500/30 shadow-glow-violet/30 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-white mb-1">
              Conclude Orbital Focus Block
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              Mission telemetry: <strong className="text-violet-300">{Math.round(activeFocusSession.accumulatedFocusSeconds / 60)} mins focused</strong>, {activeFocusSession.hintsUsed} hints logged.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  How was this solved?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('Solved Independently')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedStatus === 'Solved Independently'
                        ? 'border-emerald-500/60 bg-emerald-950/40 text-emerald-300 ring-1 ring-emerald-500/40'
                        : 'border-violet-500/20 bg-[#080916] text-slate-400 hover:text-white'
                    }`}
                  >
                    Solved Independently
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      No hints • Counts to mastery
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus('Solved with Hints')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedStatus === 'Solved with Hints'
                        ? 'border-violet-500/60 bg-violet-950/40 text-violet-300 ring-1 ring-violet-500/40'
                        : 'border-violet-500/20 bg-[#080916] text-slate-400 hover:text-white'
                    }`}
                  >
                    Solved with Hints
                    <span className="block text-[10px] font-normal text-slate-400 mt-0.5">
                      Needed guidance • Queued for spaced review
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  Approach Summary / Key Pattern
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core invariant or technique for future revisions..."
                  value={approachNotes}
                  onChange={(e) => setApproachNotes(e.target.value)}
                  className="w-full text-xs p-3 bg-[#080916] border border-violet-500/20 text-slate-200 placeholder-slate-500 rounded-xl focus:outline-none focus:border-violet-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsFinishing(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-400 hover:text-white hover:bg-violet-500/10 rounded-xl transition-colors"
              >
                Back to Session
              </button>
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 text-xs font-bold text-white gradient-violet shadow-glow-violet rounded-xl transition-all hover:opacity-95"
              >
                Commit & Log Outcome
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
