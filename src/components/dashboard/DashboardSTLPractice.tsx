import React from 'react';
import { Play, Pause, RotateCcw, CheckCircle2, ArrowRight, BookOpen } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { TimerRing } from '../common/TimerRing';

export const DashboardSTLPractice: React.FC = () => {
  const {
    stlState,
    stlTopics,
    startSTLTimer,
    pauseSTLTimer,
    resetSTLTimer,
    markSTLComplete,
    updateSTLState,
    setActiveTab,
  } = useDSA();

  const currentTopic =
    stlTopics.find((t) => t.id === stlState.currentTopicId) || stlTopics[0];

  return (
    <div className="card-soft p-5 sm:p-6 mb-6 relative overflow-hidden bg-[#101229]/80 border border-violet-500/20 text-white">
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
        {/* Left Side: Topic Info & Controls */}
        <div className="flex-1 w-full text-center lg:text-left">
          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-violet-300 bg-violet-950/70 px-2.5 py-0.5 rounded-full border border-violet-500/30">
              Mandatory 30-Min STL Arena
            </span>
            {stlState.isCompleted ? (
              <span className="text-xs font-bold text-emerald-300 bg-emerald-950/60 border border-emerald-500/30 px-2.5 py-0.5 rounded-full inline-flex items-center">
                <CheckCircle2 size={13} className="mr-1" />
                Logged for today
              </span>
            ) : (
              <span className="text-xs font-medium text-slate-400">
                Daily C++ container & algorithm drill
              </span>
            )}
          </div>

          <h3 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
            Target Focus: {currentTopic?.title}
          </h3>

          <p className="text-xs text-slate-400 mt-1 max-w-lg mx-auto lg:mx-0 leading-relaxed">
            {currentTopic?.description}
          </p>

          {/* Quick topic switcher */}
          <div className="mt-3 flex items-center justify-center lg:justify-start space-x-2">
            <label className="text-xs font-semibold text-slate-400">Module:</label>
            <select
              value={stlState.currentTopicId}
              onChange={(e) => updateSTLState({ currentTopicId: e.target.value })}
              className="text-xs bg-[#0b0c1e] text-white border border-violet-500/30 rounded-xl px-2.5 py-1 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              {stlTopics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.title}
                </option>
              ))}
            </select>
          </div>

          {/* Action buttons */}
          <div className="mt-5 flex flex-wrap items-center justify-center lg:justify-start gap-2.5">
            {!stlState.isCompleted ? (
              <>
                {!stlState.isRunning ? (
                  <button
                    onClick={startSTLTimer}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white gradient-violet shadow-glow-violet flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <Play size={15} fill="currentColor" />
                    <span>{stlState.remainingSeconds < stlState.totalSeconds ? 'Resume Session' : 'Start 30-Min Drill'}</span>
                  </button>
                ) : (
                  <button
                    onClick={pauseSTLTimer}
                    className="px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-amber-200 bg-amber-950/70 border border-amber-500/30 hover:bg-amber-900/60 flex items-center space-x-2 active:scale-95 transition-all"
                  >
                    <Pause size={15} fill="currentColor" />
                    <span>Pause Session</span>
                  </button>
                )}

                <button
                  onClick={resetSTLTimer}
                  className="px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 bg-[#0b0c1e] hover:bg-[#151733] hover:text-white border border-violet-500/20 flex items-center space-x-1 transition-all"
                  title="Reset 30-min timer"
                >
                  <RotateCcw size={14} />
                  <span>Reset</span>
                </button>

                <button
                  onClick={markSTLComplete}
                  className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-500/30 transition-all"
                >
                  Mark Complete
                </button>
              </>
            ) : (
              <button
                onClick={resetSTLTimer}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-300 bg-[#0b0c1e] hover:bg-[#151733] border border-violet-500/20 flex items-center space-x-1.5"
              >
                <RotateCcw size={14} />
                <span>Drill Another Session</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('stl-practice')}
              className="px-3.5 py-2.5 rounded-xl text-xs font-semibold text-violet-400 hover:text-violet-300 hover:bg-violet-950/30 flex items-center space-x-1 transition-all"
            >
              <BookOpen size={14} />
              <span>Open Code Arena</span>
              <ArrowRight size={13} />
            </button>
          </div>
        </div>

        {/* Right Side: Circular Timer Ring */}
        <div className="flex-shrink-0 flex flex-col items-center justify-center p-2">
          <TimerRing
            remainingSeconds={stlState.remainingSeconds}
            totalSeconds={stlState.totalSeconds}
            isRunning={stlState.isRunning}
            isCompleted={stlState.isCompleted}
            size={160}
            strokeWidth={9}
          />
        </div>
      </div>
    </div>
  );
};
