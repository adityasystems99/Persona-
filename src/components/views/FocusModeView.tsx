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
  RotateCcw,
  BookOpen,
  Coffee,
  Code2,
  CheckCheck,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { Problem, ProblemStatus } from '../../types/dsa';
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
        <div className="card-soft p-8 text-center bg-gradient-to-br from-white via-slate-50 to-rose-50/20 border border-slate-200">
          <div className="w-16 h-16 rounded-3xl gradient-coral text-white flex items-center justify-center mx-auto mb-4 shadow-glow-coral">
            <Clock size={32} />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Distraction-Free Focus Arena
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 max-w-lg mx-auto mt-2 leading-relaxed">
            Eliminate tabs, notifications, and context switching. Select a problem below to launch a dedicated immersion study block with reliable wall-clock timing, break segregation, and live mistake telemetry.
          </p>

          <div className="mt-8 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Problem to Start Focus Session
            </h3>

            <div className="space-y-2.5">
              {candidateProblems.map((prob) => (
                <div
                  key={prob.id}
                  className="p-4 rounded-xl bg-white border border-slate-200 hover:border-rose-400 hover:shadow-md transition-all flex items-center justify-between gap-4 group"
                >
                  <div className="min-w-0">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-bold text-sm text-slate-800 group-hover:text-rose-600 transition-colors truncate">
                        {prob.title}
                      </h4>
                      <DifficultyBadge difficulty={prob.difficulty} />
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {prob.topic} {prob.subtopic ? `• ${prob.subtopic}` : ''} • Current status: {prob.status}
                    </p>
                  </div>

                  <button
                    onClick={() => startFocusSession(prob)}
                    className="px-4 py-2 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1.5 active:scale-95 transition-all flex-shrink-0"
                  >
                    <Play size={14} fill="currentColor" />
                    <span>Enter Focus Mode</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Focus Session History */}
        {focusSessions.length > 0 && (
          <div className="card-soft p-6">
            <h3 className="text-sm font-extrabold text-slate-800 mb-4 flex items-center space-x-2">
              <Clock size={16} className="text-slate-600" />
              <span>Recent Focus Session History</span>
            </h3>

            <div className="divide-y divide-slate-100">
              {focusSessions.slice(0, 5).map((f) => (
                <div key={f.id} className="py-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-800">{f.problemTitle}</span>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {new Date(f.startedAt).toLocaleDateString()} • {Math.round(f.activeSeconds / 60)}m focus time • {Math.round(f.breakSeconds / 60)}m breaks
                      {f.hintsUsed > 0 && <span className="text-rose-600 ml-1.5 font-semibold">• {f.hintsUsed} hint(s)</span>}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-bold text-[10px]">
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
      <div className="card-soft p-6 sm:p-8 bg-slate-900 text-white rounded-3xl shadow-soft-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-32 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-extrabold ${
                isRunning ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isRunning ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`} />
                <span>{isRunning ? 'DEEP FOCUS ACTIVE' : 'SESSION PAUSED (BREAK TIME)'}</span>
              </span>
              {targetProblem && <DifficultyBadge difficulty={targetProblem.difficulty} />}
            </div>

            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
              {activeFocusSession.problemTitle}
            </h2>

            <div className="flex items-center space-x-3 text-xs text-slate-400 mt-1">
              <span>{targetProblem?.topic || 'General DSA'}</span>
              {targetProblem?.url && (
                <a
                  href={targetProblem.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-rose-400 hover:text-rose-300 flex items-center space-x-1 font-semibold"
                >
                  <span>Open on Platform</span>
                  <ExternalLink size={12} />
                </a>
              )}
            </div>
          </div>

          <button
            onClick={cancelFocusSession}
            className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors self-start sm:self-auto"
          >
            Cancel Session
          </button>
        </div>

        {/* Central Timer & Control Hub */}
        <div className="py-8 flex flex-col items-center justify-center text-center">
          <div className="text-6xl sm:text-7xl font-mono font-extrabold tracking-tight text-white mb-2">
            {formatTimer(activeFocusSession.accumulatedFocusSeconds)}
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-semibold mb-6">
            Active Focused Solving Time
          </span>

          {/* Timing Segregation Metrics */}
          <div className="flex items-center space-x-6 text-xs text-slate-400 mb-8">
            <div className="flex items-center space-x-1.5">
              <Clock size={14} className="text-emerald-400" />
              <span>Focus: <strong className="text-white">{Math.round(activeFocusSession.accumulatedFocusSeconds / 60)}m</strong></span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <Coffee size={14} className="text-amber-400" />
              <span>Breaks: <strong className="text-white">{Math.round(activeFocusSession.accumulatedBreakSeconds / 60)}m</strong></span>
            </div>
            <div className="w-1 h-1 rounded-full bg-slate-700" />
            <div className="flex items-center space-x-1.5">
              <HelpCircle size={14} className="text-rose-400" />
              <span>Hints: <strong className="text-white">{activeFocusSession.hintsUsed}</strong></span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {isRunning ? (
              <button
                onClick={pauseFocusSession}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-amber-400 hover:bg-amber-300 text-slate-900 flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Pause size={16} fill="currentColor" />
                <span>Pause (Take Break)</span>
              </button>
            ) : (
              <button
                onClick={resumeFocusSession}
                className="px-6 py-3 rounded-2xl text-sm font-bold bg-emerald-500 hover:bg-emerald-400 text-white flex items-center space-x-2 shadow-lg active:scale-95 transition-all"
              >
                <Play size={16} fill="currentColor" />
                <span>Resume Focus</span>
              </button>
            )}

            <button
              onClick={() => setIsFinishing(true)}
              className="px-6 py-3 rounded-2xl text-sm font-bold gradient-coral shadow-glow-coral text-white flex items-center space-x-2 active:scale-95 transition-all"
            >
              <CheckCheck size={18} />
              <span>Finish & Log Telemetry</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Notes, Hints & Mistakes Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hint Recording Card */}
        <div className="card-soft p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
              <HelpCircle size={16} className="text-amber-500" />
              <span>Hints Used ({activeFocusSession.hintsUsed})</span>
            </h4>
            <span className="text-[10px] text-slate-400">Track whenever you look up a hint</span>
          </div>

          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="Record hint idea (e.g. use monotonic stack)..."
              value={hintInput}
              onChange={(e) => setHintInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
            <button
              onClick={handleAddHint}
              className="px-3 py-2 bg-amber-50 hover:bg-amber-100 text-amber-700 text-xs font-bold rounded-xl border border-amber-200 transition-colors"
            >
              Log Hint
            </button>
          </div>

          {activeFocusSession.hintNotes ? (
            <pre className="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
              {activeFocusSession.hintNotes}
            </pre>
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center italic">
              No hints checked yet. Strive to solve independently!
            </p>
          )}
        </div>

        {/* Mistake Recording Card */}
        <div className="card-soft p-5 bg-white border border-slate-200">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-bold text-sm text-slate-800 flex items-center space-x-1.5">
              <AlertTriangle size={16} className="text-rose-500" />
              <span>Live Mistakes & Edge Cases</span>
            </h4>
            <span className="text-[10px] text-slate-400">Essential for Spaced Revision</span>
          </div>

          <div className="flex space-x-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Forgot empty array check / off-by-one..."
              value={mistakeInput}
              onChange={(e) => setMistakeInput(e.target.value)}
              className="flex-1 text-xs px-3 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
            />
            <button
              onClick={handleAddMistake}
              className="px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-bold rounded-xl border border-rose-200 transition-colors"
            >
              Log Mistake
            </button>
          </div>

          {activeFocusSession.mistakesRecorded ? (
            <pre className="text-xs text-rose-700 bg-rose-50/60 p-3 rounded-xl whitespace-pre-wrap font-sans max-h-36 overflow-y-auto">
              {activeFocusSession.mistakesRecorded}
            </pre>
          ) : (
            <p className="text-xs text-slate-400 py-3 text-center italic">
              No mistakes logged yet during this focus block.
            </p>
          )}
        </div>
      </div>

      {/* Completion Modal */}
      {isFinishing && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-soft-xl border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-extrabold text-slate-800 mb-1">
              Conclude Focus Session & Log Outcome
            </h3>
            <p className="text-xs text-slate-500 mb-5">
              Telemetry recorded: <strong>{Math.round(activeFocusSession.accumulatedFocusSeconds / 60)} mins active focus</strong>, {activeFocusSession.hintsUsed} hints used.
            </p>

            <div className="space-y-4 mb-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  How was this solved?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStatus('Solved Independently')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedStatus === 'Solved Independently'
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Solved Independently
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      No hints consulted • Counts toward mastery
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedStatus('Solved with Hints')}
                    className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                      selectedStatus === 'Solved with Hints'
                        ? 'border-purple-500 bg-purple-50 text-purple-800 ring-2 ring-purple-500/20'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    Solved with Hints
                    <span className="block text-[10px] font-normal text-slate-500 mt-0.5">
                      Needed guidance • Queued for spaced revision
                    </span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Approach Summary / Key Takeaways
                </label>
                <textarea
                  rows={3}
                  placeholder="Summarize the core invariant or technique for future revisions..."
                  value={approachNotes}
                  onChange={(e) => setApproachNotes(e.target.value)}
                  className="w-full text-xs p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setIsFinishing(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Back to Session
              </button>
              <button
                onClick={handleFinish}
                className="px-5 py-2.5 text-xs font-bold text-white gradient-coral shadow-glow-coral rounded-xl transition-all"
              >
                Save & Complete Focus Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
