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
  Check,
  Plus,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { TimerRing } from '../common/TimerRing';

export const STLPracticeView: React.FC = () => {
  const {
    stlState,
    stlTopics,
    startSTLTimer,
    pauseSTLTimer,
    resetSTLTimer,
    extendSTLTimer,
    markSTLComplete,
    updateSTLState,
    toggleSTLTopicComplete,
    addNotification,
  } = useDSA();

  const [activeTopicId, setActiveTopicId] = useState(stlState.currentTopicId);
  const [scratchpadCode, setScratchpadCode] = useState(stlState.codeSnippet);
  const [sessionNotes, setSessionNotes] = useState(stlState.notes);
  const [savedFeedback, setSavedFeedback] = useState(false);

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
    addNotification('Notes Saved', 'STL practice notes & code scratchpad preserved.', 'info');
    setTimeout(() => setSavedFeedback(false), 2000);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Timer & Control Arena */}
      <div className="card-soft p-6 sm:p-8 bg-gradient-to-br from-white via-slate-50 to-rose-50/20">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
          {/* Left: Timer details & Controls */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-rose-50 border border-rose-200/80 text-rose-600 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles size={13} />
              <span>Mandatory 30-Minute C++ STL Arena</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-800 tracking-tight">
              Pure C++ Standard Template Library Mastery
            </h2>

            <p className="text-xs sm:text-sm text-slate-500 mt-2 max-w-xl leading-relaxed">
              Drill standard containers, iterators, and library algorithms daily so syntax flows naturally in interviews without depending on AI or lookup tables.
            </p>

            {/* Timer Controls */}
            <div className="mt-6 flex flex-wrap items-center justify-center lg:justify-start gap-3">
              {!stlState.isCompleted ? (
                <>
                  {!stlState.isRunning ? (
                    <button
                      onClick={startSTLTimer}
                      className="px-6 py-3 rounded-2xl text-sm font-extrabold text-white gradient-coral shadow-glow-coral flex items-center space-x-2 active:scale-95 transition-all"
                    >
                      <Play size={16} fill="currentColor" />
                      <span>{stlState.remainingSeconds < stlState.totalSeconds ? 'Resume Timer' : 'Start 30-Min Session'}</span>
                    </button>
                  ) : (
                    <button
                      onClick={pauseSTLTimer}
                      className="px-6 py-3 rounded-2xl text-sm font-extrabold text-slate-800 bg-amber-100 hover:bg-amber-200 flex items-center space-x-2 active:scale-95 transition-all"
                    >
                      <Pause size={16} fill="currentColor" />
                      <span>Pause Session</span>
                    </button>
                  )}

                  <button
                    onClick={resetSTLTimer}
                    className="p-3 rounded-2xl text-slate-500 bg-slate-100 hover:bg-slate-200 hover:text-slate-800 transition-colors"
                    title="Reset Timer"
                  >
                    <RotateCcw size={18} />
                  </button>

                  <button
                    onClick={() => extendSTLTimer(300)}
                    className="px-3.5 py-3 rounded-2xl text-xs font-bold text-slate-700 bg-white border border-slate-200 shadow-sm hover:bg-slate-50"
                    title="Add 5 more minutes"
                  >
                    +5 mins
                  </button>

                  <button
                    onClick={markSTLComplete}
                    className="px-4 py-3 rounded-2xl text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-all flex items-center space-x-1"
                  >
                    <CheckCircle2 size={16} />
                    <span>Mark Complete</span>
                  </button>
                </>
              ) : (
                <div className="flex items-center space-x-3">
                  <span className="px-4 py-2.5 rounded-2xl text-xs font-extrabold text-emerald-800 bg-emerald-100/90 flex items-center space-x-1.5 shadow-sm">
                    <CheckCircle2 size={16} className="text-emerald-600" />
                    <span>Today's 30-Min STL Goal Fulfilled</span>
                  </span>
                  <button
                    onClick={resetSTLTimer}
                    className="px-4 py-2.5 rounded-2xl text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-all flex items-center space-x-1"
                  >
                    <RotateCcw size={14} />
                    <span>Practice More</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Right: Large Timer Ring */}
          <div className="flex-shrink-0">
            <TimerRing
              remainingSeconds={stlState.remainingSeconds}
              totalSeconds={stlState.totalSeconds}
              isRunning={stlState.isRunning}
              isCompleted={stlState.isCompleted}
              size={210}
              strokeWidth={12}
            />
          </div>
        </div>
      </div>

      {/* Topics Syllabus & Interactive Curriculum Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: STL Topic Curriculum Checklist */}
        <div className="card-soft p-5 sm:p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-base text-slate-800 flex items-center space-x-2">
              <BookOpen size={18} className="text-rose-500" />
              <span>STL Curriculum</span>
            </h3>
            <span className="text-xs text-slate-400 font-medium">
              {stlTopics.length} core concepts
            </span>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
            {stlTopics.map((topic) => {
              const isSelected = topic.id === activeTopicId;
              const completedToday = topic.completedDates.includes(stlState.date);

              return (
                <div
                  key={topic.id}
                  onClick={() => handleSelectTopic(topic.id)}
                  className={`p-3 rounded-2xl border cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-rose-50/50 border-rose-300 shadow-sm'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleSTLTopicComplete(topic.id);
                      }}
                      className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                        completedToday
                          ? 'bg-emerald-500 border-emerald-500 text-white'
                          : 'border-slate-300 hover:border-slate-400 bg-white'
                      }`}
                      title={completedToday ? 'Mark incomplete' : 'Mark completed today'}
                    >
                      {completedToday && <Check size={13} strokeWidth={3} />}
                    </button>
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">
                        {topic.title}
                      </h4>
                      <span className="text-[10px] text-slate-400">
                        {topic.category}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isSelected
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    View
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 2 Cols: Topic Guide, Key Methods, and Code Scratchpad */}
        <div className="lg:col-span-2 space-y-6">
          {/* Selected Topic Details & Syntax */}
          <div className="card-soft p-6">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-3 border-b border-slate-100">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
                  {selectedTopic.category}
                </span>
                <h3 className="text-lg font-extrabold text-slate-800">
                  {selectedTopic.title}
                </h3>
              </div>
              <button
                onClick={() => toggleSTLTopicComplete(selectedTopic.id)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors"
              >
                Toggle Completed Today
              </button>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              {selectedTopic.description}
            </p>

            {/* Methods pills */}
            <div className="mb-4">
              <span className="text-xs font-bold text-slate-700 block mb-1.5">
                Essential Methods & Syntax:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {selectedTopic.methods.map((method, idx) => (
                  <code
                    key={idx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-slate-100 text-slate-700 border border-slate-200"
                  >
                    {method}
                  </code>
                ))}
              </div>
            </div>

            {/* Reference Code Snippet */}
            <div className="bg-slate-900 rounded-2xl p-4 text-slate-200 overflow-x-auto relative">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-2 pb-2 border-b border-slate-800">
                <span className="flex items-center space-x-1.5 font-mono">
                  <Code2 size={13} className="text-rose-400" />
                  <span>Standard Canonical Pattern</span>
                </span>
                <span className="text-[10px]">C++17 / C++20</span>
              </div>
              <pre className="text-xs font-mono leading-relaxed text-emerald-300">
                {selectedTopic.codeExample}
              </pre>
            </div>
          </div>

          {/* Session Scratchpad & Personal Insights */}
          <div className="card-soft p-6">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Code2 size={16} className="text-rose-500" />
                <h4 className="font-bold text-sm text-slate-800">
                  Today's STL Practice Scratchpad & Retrospective
                </h4>
              </div>

              <button
                onClick={handleSaveScratchpad}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold text-white gradient-coral shadow-glow-coral flex items-center space-x-1.5 active:scale-95 transition-all"
              >
                {savedFeedback ? <Check size={14} /> : <Save size={14} />}
                <span>{savedFeedback ? 'Saved!' : 'Save Notes'}</span>
              </button>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  What did you practice today? Concepts to revisit:
                </label>
                <input
                  type="text"
                  value={sessionNotes}
                  onChange={(e) => setSessionNotes(e.target.value)}
                  placeholder="e.g. Practiced custom lambda comparator for priority_queue; reviewed lower_bound vs upper_bound."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  C++ STL Scratchpad (Code intuition / Experimentation):
                </label>
                <textarea
                  rows={8}
                  value={scratchpadCode}
                  onChange={(e) => setScratchpadCode(e.target.value)}
                  className="w-full text-xs font-mono bg-slate-900 text-slate-100 rounded-xl p-3 border border-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
