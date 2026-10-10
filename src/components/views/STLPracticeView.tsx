import React, { useState } from 'react';
import {
  Timer,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  Code2,
  BookOpen,
  Sparkles,
  Save,
  Target,
  Eye,
  EyeOff,
  CheckCheck,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { TimerRing } from '../common/TimerRing';
import { DifficultyBadge } from '../common/Badge';

export const STLPracticeView: React.FC = () => {
  const {
    stlState,
    stlTopics,
    stlExercises,
    startSTLTimer,
    pauseSTLTimer,
    resetSTLTimer,
    extendSTLTimer,
    markSTLComplete,
    updateSTLState,
    toggleSTLExerciseComplete,
    updateSTLExerciseCode,
    addNotification,
  } = useDSA();

  const [activeTab, setActiveTab] = useState<'exercises' | 'cheatsheets'>('exercises');
  const [activeTopicId, setActiveTopicId] = useState(stlState.currentTopicId);
  const [scratchpadCode, setScratchpadCode] = useState(stlState.codeSnippet);
  const [sessionNotes, setSessionNotes] = useState(stlState.notes);
  const [savedFeedback, setSavedFeedback] = useState(false);
  const [selectedExerciseCategory, setSelectedExerciseCategory] = useState<string>('All');
  const [revealedSolutions, setRevealedSolutions] = useState<Record<string, boolean>>({});

  const selectedTopic = stlTopics.find((t) => t.id === activeTopicId) || stlTopics[0];

  const handleSelectTopic = (id: string) => {
    setActiveTopicId(id);
    updateSTLState({ currentTopicId: id });
  };

  const handleSaveScratchpad = () => {
    updateSTLState({
      codeSnippet: scratchpadCode,
      notes: sessionNotes,
    });
    setSavedFeedback(true);
    addNotification('Telemetry Saved', 'STL practice notes & scratchpad written to cosmic storage.', 'info');
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  const toggleRevealSolution = (exerciseId: string) => {
    setRevealedSolutions((prev) => ({
      ...prev,
      [exerciseId]: !prev[exerciseId],
    }));
  };

  const completedExercisesCount = stlExercises.filter((e) => e.isCompleted).length;
  const exerciseCategories = ['All', 'Vectors & Strings', 'Pairs & Iterators', 'Sorting & Custom Comparators', 'Binary Search Algorithms', 'Sets & Maps', 'Stacks & Queues', 'Priority Queues', 'Useful STL Algorithms'];

  const filteredExercises = stlExercises.filter((e) => {
    return selectedExerciseCategory === 'All' || e.category === selectedExerciseCategory;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Timer & Control Arena */}
      <div className="card-soft p-6 sm:p-8 bg-gradient-to-br from-[#10122b]/90 via-[#0d0f22]/90 to-[#141233]/90 border border-violet-500/20 shadow-glow-violet/10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Timer details & Controls */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-violet-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} className="text-violet-400" />
              <span>Mandatory 30-Minute Flight Drill</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              C++ STL Orbital Flight Arena
            </h2>

            <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-xl leading-relaxed">
              Drill the 8 core C++ STL container categories daily. Internalize container invariants, complexities, and custom comparators so operational recall is instantaneous during technical rounds.
            </p>

            {/* Timer Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {!stlState.isCompleted ? (
                <>
                  {!stlState.isRunning ? (
                    <button
                      onClick={startSTLTimer}
                      className="px-6 py-3 rounded-2xl text-sm font-extrabold text-white gradient-violet shadow-glow-violet flex items-center space-x-2 active:scale-95 transition-all hover:opacity-95"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>{stlState.remainingSeconds < stlState.totalSeconds ? 'Resume Drill' : 'Launch 30-Min Drill'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseSTLTimer}
                      className="px-6 py-3 rounded-2xl text-sm font-extrabold text-amber-200 bg-amber-500/20 border border-amber-500/40 hover:bg-amber-500/30 flex items-center space-x-2 active:scale-95 transition-all"
                    >
                      <Pause size={16} fill="currentColor" />
                      <span>Pause Drill</span>
                    </button>
                  )}

                  <button
                    onClick={resetSTLTimer}
                    className="p-3 rounded-2xl text-slate-400 bg-[#090a18] border border-violet-500/20 hover:border-violet-500/40 hover:text-white transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    onClick={() => extendSTLTimer(300)}
                    className="px-3.5 py-3 rounded-2xl text-xs font-bold text-violet-300 bg-[#090a18] border border-violet-500/20 hover:border-violet-500/40 hover:text-white transition-colors"
                    title="Add 5 more minutes"
                  >
                    +5 mins
                  </button>

                  <button
                    onClick={markSTLComplete}
                    className="px-4 py-3 rounded-2xl text-xs font-bold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:bg-emerald-900/60 transition-all flex items-center space-x-1.5"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Complete</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3 px-5 py-3 bg-emerald-950/30 border border-emerald-500/40 rounded-2xl">
                  <CheckCircle2 size={20} className="text-emerald-400" />
                  <div>
                    <span className="font-extrabold text-xs sm:text-sm text-emerald-300 block">
                      Today's 30-Min STL Drill Complete!
                    </span>
                    <span className="text-[11px] text-emerald-400/80">
                      Telemetry confirmed. Drill exercises below to test your operational recall.
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right: Circular Timer Ring Visualizer */}
          <div className="flex-shrink-0 flex flex-col items-center">
            <TimerRing
              totalSeconds={stlState.totalSeconds}
              remainingSeconds={stlState.remainingSeconds}
              size={180}
              strokeWidth={12}
              isRunning={stlState.isRunning}
              isCompleted={stlState.isCompleted}
            />
          </div>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-violet-500/10 pb-3">
        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab('exercises')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'exercises'
                ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-glow-violet/20'
                : 'text-slate-400 hover:text-white hover:bg-violet-500/10'
            }`}
          >
            <Target size={15} />
            <span>Interactive Drills ({completedExercisesCount}/{stlExercises.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheets')}
            className={`px-4 py-2 text-xs font-bold rounded-xl flex items-center space-x-2 transition-all ${
              activeTab === 'cheatsheets'
                ? 'bg-violet-600/30 text-violet-200 border border-violet-500/40 shadow-glow-violet/20'
                : 'text-slate-400 hover:text-white hover:bg-violet-500/10'
            }`}
          >
            <BookOpen size={15} />
            <span>Container Invariants & Scratchpad</span>
          </button>
        </div>

        <span className="text-xs text-slate-500 font-medium hidden sm:inline">
          STL practice time tracked independently
        </span>
      </div>

      {/* TAB 1: Topic-Based Interactive Drills (8 Categories) */}
      {activeTab === 'exercises' && (
        <div className="space-y-6">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {exerciseCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedExerciseCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedExerciseCategory === cat
                    ? 'gradient-violet text-white shadow-glow-violet'
                    : 'bg-[#0b0c1c]/80 border border-violet-500/20 text-slate-400 hover:text-white hover:border-violet-500/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Exercise Cards */}
          <div className="grid grid-cols-1 gap-5">
            {filteredExercises.map((ex) => {
              const isRevealed = revealedSolutions[ex.id];

              return (
                <div
                  key={ex.id}
                  className={`card-soft p-5 sm:p-6 bg-[#0c0e22]/90 border transition-all ${
                    ex.isCompleted ? 'border-emerald-500/40' : 'border-violet-500/20 hover:border-violet-500/40'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 mb-3 border-b border-violet-500/10">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/30">
                          {ex.category}
                        </span>
                        <DifficultyBadge difficulty={ex.difficulty} />
                        {ex.isCompleted && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 flex items-center space-x-1">
                            <CheckCheck size={11} />
                            <span>Mastered</span>
                          </span>
                        )}
                      </div>
                      <h3 className="font-extrabold text-base text-white">
                        {ex.title}
                      </h3>
                    </div>

                    <button
                      onClick={() => toggleSTLExerciseComplete(ex.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all self-start sm:self-auto ${
                        ex.isCompleted
                          ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-900/60'
                          : 'bg-[#10122e] border border-violet-500/30 text-slate-300 hover:text-white hover:border-violet-500/50'
                      }`}
                    >
                      <CheckCircle2 size={14} />
                      <span>{ex.isCompleted ? 'Completed ✓' : 'Mark as Completed'}</span>
                    </button>
                  </div>

                  {/* Description & Concept */}
                  <p className="text-xs text-slate-300 leading-relaxed mb-3">
                    {ex.description}
                  </p>

                  <div className="p-3 rounded-xl bg-violet-950/30 border border-violet-500/20 text-xs text-violet-300 mb-4">
                    <span className="font-bold text-violet-200">Core Pattern Reinforced: </span>
                    {ex.conceptReinforced}
                  </div>

                  {/* Code Editor & Solution */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                        <span className="flex items-center space-x-1.5">
                          <Code2 size={14} className="text-violet-400" />
                          <span>Starter Code & Scratchpad</span>
                        </span>
                      </div>
                      <textarea
                        rows={10}
                        value={ex.userCode || ex.starterCode}
                        onChange={(e) => updateSTLExerciseCode(ex.id, e.target.value)}
                        className="w-full text-xs font-mono p-3 bg-[#060712] border border-violet-500/20 text-violet-100 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400/30"
                      />
                    </div>

                    <div>
                      <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-1.5">
                        <span className="flex items-center space-x-1.5">
                          <Sparkles size={14} className="text-violet-400" />
                          <span>Reference Solution</span>
                        </span>
                        <button
                          onClick={() => toggleRevealSolution(ex.id)}
                          className="text-[11px] text-violet-400 hover:text-violet-300 flex items-center space-x-1 font-semibold transition-colors"
                        >
                          {isRevealed ? <EyeOff size={13} /> : <Eye size={13} />}
                          <span>{isRevealed ? 'Hide Solution' : 'Reveal Solution'}</span>
                        </button>
                      </div>

                      {isRevealed ? (
                        <pre className="text-xs font-mono p-3 bg-[#060712] border border-emerald-500/30 text-emerald-300 rounded-xl overflow-x-auto max-h-56 leading-relaxed">
                          {ex.solutionCode}
                        </pre>
                      ) : (
                        <div
                          onClick={() => toggleRevealSolution(ex.id)}
                          className="h-56 rounded-xl bg-[#080916] border border-dashed border-violet-500/30 flex flex-col items-center justify-center cursor-pointer hover:bg-violet-950/20 hover:border-violet-500/50 transition-colors p-4 text-center"
                        >
                          <Eye size={20} className="text-violet-400 mb-2" />
                          <span className="text-xs font-bold text-slate-300">Click to reveal canonical solution</span>
                          <span className="text-[10px] text-slate-500 mt-0.5">Test your syntax recall first!</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: Container Invariants & Scratchpad */}
      {activeTab === 'cheatsheets' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Topic list */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              STL Topics & Invariants
            </h3>
            {stlTopics.map((topic) => (
              <button
                key={topic.id}
                onClick={() => handleSelectTopic(topic.id)}
                className={`w-full p-3.5 rounded-2xl text-left border transition-all ${
                  activeTopicId === topic.id
                    ? 'bg-[#121430] border-violet-500/50 shadow-glow-violet/20 ring-1 ring-violet-500/30'
                    : 'bg-[#0c0e22]/80 hover:bg-[#10122e] border-violet-500/20 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-white">{topic.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-violet-500/20 text-violet-300 border border-violet-500/20">
                    {topic.category}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{topic.description}</p>
              </button>
            ))}
          </div>

          {/* Active Topic Card & Code Scratchpad */}
          <div className="lg:col-span-2 space-y-5">
            <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-violet-500/10">
                <h3 className="font-extrabold text-sm text-white">{selectedTopic.title}</h3>
                <span className="text-xs text-violet-300 font-mono">{selectedTopic.category}</span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed mb-4">{selectedTopic.description}</p>

              <div className="space-y-2 mb-4">
                <span className="text-xs font-bold text-slate-300 block">Common Methods:</span>
                <div className="flex flex-wrap gap-1.5">
                  {selectedTopic.methods.map((m) => (
                    <span key={m} className="px-2 py-0.5 rounded-md bg-[#10122e] border border-violet-500/20 text-violet-200 font-mono text-[11px]">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-xs font-bold text-slate-300 block">Canonical Pattern:</span>
                <pre className="text-xs font-mono p-3 bg-[#060712] border border-violet-500/20 text-violet-200 rounded-xl overflow-x-auto">
                  {selectedTopic.codeExample}
                </pre>
              </div>
            </div>

            {/* Live Scratchpad */}
            <div className="card-soft p-5 bg-[#0c0e22]/90 border border-violet-500/20">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-bold text-white flex items-center space-x-1.5">
                  <Code2 size={14} className="text-violet-400" />
                  <span>Interactive Scratchpad & Mission Telemetry</span>
                </h4>

                <button
                  onClick={handleSaveScratchpad}
                  className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-1 active:scale-95 transition-all hover:opacity-95"
                >
                  <Save size={13} />
                  <span>{savedFeedback ? 'Saved!' : 'Save Code'}</span>
                </button>
              </div>

              <textarea
                rows={8}
                value={scratchpadCode}
                onChange={(e) => setScratchpadCode(e.target.value)}
                className="w-full text-xs font-mono p-3 bg-[#060712] border border-violet-500/20 text-violet-100 rounded-xl focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 mb-3"
              />

              <textarea
                rows={2}
                placeholder="Mission takeaways, comparator nuances, or edge cases..."
                value={sessionNotes}
                onChange={(e) => setSessionNotes(e.target.value)}
                className="w-full text-xs p-2.5 bg-[#090a18] border border-violet-500/20 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
