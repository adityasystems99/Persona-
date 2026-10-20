import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Users,
  Clock,
  Calendar,
  CheckCircle2,
  RotateCcw,
  Plus,
  Trash2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { WeekendAssessment, WeekendAssessmentType } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface WeekendAssessmentViewProps {
  onOpenLogModal: (type?: WeekendAssessmentType) => void;
}

export const WeekendAssessmentView: React.FC<WeekendAssessmentViewProps> = ({
  onOpenLogModal,
}) => {
  const {
    assessments,
    updateWeekendAssessment,
    deleteWeekendAssessment,
    rescheduleAssessment,
  } = usePlacement();
  const { theme } = useTheme();

  const [rescheduleId, setRescheduleId] = useState<string | null>(null);
  const [rescheduleDate, setRescheduleDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 7);
    return d.toISOString().slice(0, 10);
  });

  const mockTests = assessments.filter((a) => a.type === 'mock_test');
  const codingContests = assessments.filter((a) => a.type === 'coding_contest');
  const mockInterviews = assessments.filter((a) => a.type === 'mock_interview');

  const handleConfirmReschedule = (id: string) => {
    rescheduleAssessment(id, rescheduleDate);
    setRescheduleId(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-violet-950/40 via-purple-950/30 to-[#0e1024] border border-violet-500/30 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-600 text-white">
              Every Weekend Sprint
            </span>
            <span className="text-xs font-semibold text-slate-400">
              Exam & Interview Simulation
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white mt-1.5 tracking-tight">
            Weekend Mock Tests, Contests & Interviews
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
            Every Saturday & Sunday: Complete 1 comprehensive mock test, participate in 1 live coding contest, and schedule 1 peer/senior mock interview to calibrate real-time performance.
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-stretch md:self-auto">
          <button
            onClick={() => onOpenLogModal('mock_test')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Mock Test</span>
          </button>
          <button
            onClick={() => onOpenLogModal('coding_contest')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Contest</span>
          </button>
          <button
            onClick={() => onOpenLogModal('mock_interview')}
            className="flex-1 md:flex-initial px-3.5 py-2 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <Plus size={14} />
            <span>Mock Interview</span>
          </button>
        </div>
      </div>

      {/* 3 Pillars Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Mock Tests Card */}
        <div className="p-5 rounded-2xl bg-[#101228]/80 border border-violet-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Target: 1 / Weekend</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
              {mockTests.filter((m) => m.status === 'Completed').length} Completed
            </span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Award size={18} className="text-violet-400" />
            <span>Mock Tests</span>
          </h3>
          <p className="text-xs text-slate-400">
            DSA timed tests (Trees, Graphs, DP) simulating company OA environments.
          </p>
        </div>

        {/* Coding Contests Card */}
        <div className="p-5 rounded-2xl bg-[#101228]/80 border border-purple-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Target: 1 / Weekend</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-950 text-purple-300 border border-purple-500/30">
              {codingContests.filter((m) => m.status === 'Completed').length} Completed
            </span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Trophy size={18} className="text-purple-400" />
            <span>Coding Contests</span>
          </h3>
          <p className="text-xs text-slate-400">
            LeetCode Weekly, Biweekly, or Codeforces rounds under strict clock pressure.
          </p>
        </div>

        {/* Mock Interviews Card */}
        <div className="p-5 rounded-2xl bg-[#101228]/80 border border-teal-500/20 shadow-lg space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400">Target: 1 / Weekend</span>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-teal-950 text-teal-300 border border-teal-500/30">
              {mockInterviews.filter((m) => m.status === 'Completed').length} Completed
            </span>
          </div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Users size={18} className="text-teal-400" />
            <span>Mock Interviews</span>
          </h3>
          <p className="text-xs text-slate-400">
            1-on-1 mock interviews with peers, seniors, or alumni with feedback tracking.
          </p>
        </div>
      </div>

      {/* Assessments Records Stream */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar size={16} className="text-violet-400" />
          <span>Assessment History & Performance Logs ({assessments.length})</span>
        </h3>

        {assessments.length === 0 ? (
          <div className="text-center py-12 bg-black/20 rounded-2xl border border-white/5">
            <Trophy size={36} className="mx-auto text-slate-600 mb-2" />
            <h4 className="text-sm font-bold text-slate-300">No Assessments Logged Yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1">
              Log your weekend mock test, coding contest rating, or peer mock interview to keep track of scores and improvement areas.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {assessments.map((item) => {
              const isCompleted = item.status === 'Completed';
              const isRescheduled = item.status === 'Rescheduled';

              return (
                <div
                  key={item.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-[#101228]/90 border-violet-500/30 shadow-lg'
                      : isRescheduled
                      ? 'bg-amber-950/20 border-amber-500/30 shadow-sm'
                      : 'bg-black/30 border-white/10'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-white/10">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`p-2 rounded-xl text-white font-bold ${
                          item.type === 'mock_test'
                            ? 'bg-violet-600/30 text-violet-300 border border-violet-500/40'
                            : item.type === 'coding_contest'
                            ? 'bg-purple-600/30 text-purple-300 border border-purple-500/40'
                            : 'bg-teal-600/30 text-teal-300 border border-teal-500/40'
                        }`}
                      >
                        {item.type === 'mock_test' ? (
                          <Award size={18} />
                        ) : item.type === 'coding_contest' ? (
                          <Trophy size={18} />
                        ) : (
                          <Users size={18} />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-sm font-bold text-white">{item.title}</h4>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300 uppercase">
                            {item.type.replace('_', ' ')}
                          </span>
                        </div>
                        <span className="text-xs text-slate-400 block mt-0.5">
                          Date: {item.date} {item.durationMinutes ? `• ${item.durationMinutes} mins` : ''}{' '}
                          {item.partnerOrPlatform ? `• ${item.partnerOrPlatform}` : ''}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 self-end sm:self-auto">
                      {item.scoreOrRank && (
                        <span className="text-xs font-bold px-2.5 py-1 rounded-xl bg-violet-950/80 text-violet-300 border border-violet-500/30">
                          {item.scoreOrRank}
                        </span>
                      )}

                      <button
                        onClick={() => setRescheduleId(rescheduleId === item.id ? null : item.id)}
                        className="p-1.5 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                        title="Reschedule session"
                      >
                        <RotateCcw size={15} />
                      </button>

                      <button
                        onClick={() => deleteWeekendAssessment(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-950/40 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete assessment"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Reschedule inline editor */}
                  {rescheduleId === item.id && (
                    <div className="my-3 p-3 rounded-xl bg-amber-950/30 border border-amber-500/30 flex items-center space-x-2 text-xs">
                      <span className="text-amber-300 font-semibold">Reschedule to:</span>
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="px-2 py-1 rounded-lg bg-black/40 border border-white/20 text-white"
                      />
                      <button
                        onClick={() => handleConfirmReschedule(item.id)}
                        className="px-3 py-1 rounded-lg bg-amber-500 text-slate-900 font-bold"
                      >
                        Save Date
                      </button>
                    </div>
                  )}

                  {/* Performance Details Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 text-xs">
                    {item.feedback && (
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <span className="font-semibold text-slate-400 block">Feedback</span>
                        <p className="text-slate-200">{item.feedback}</p>
                      </div>
                    )}
                    {item.mistakes && (
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <span className="font-semibold text-rose-400 block">Mistakes Recorded</span>
                        <p className="text-slate-200">{item.mistakes}</p>
                      </div>
                    )}
                    {item.improvementAreas && (
                      <div className="p-2.5 rounded-xl bg-black/30 border border-white/5 space-y-1">
                        <span className="font-semibold text-amber-400 block">Action Items</span>
                        <p className="text-slate-200">{item.improvementAreas}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
