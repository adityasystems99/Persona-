import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  Clock,
  CheckCircle,
  HelpCircle,
  Calendar,
  Award,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { getTodayDateString } from '../../data/initialData';

export const AnalyticsView: React.FC = () => {
  const { studyLogs, problems, stats } = useDSA();
  const [timeRange, setTimeRange] = useState<'7' | '14' | '30'>('7');
  const todayStr = getTodayDateString();

  const rangeDays = parseInt(timeRange, 10);
  const chartData: {
    date: string;
    label: string;
    solved: number;
    easy: number;
    medium: number;
    hard: number;
    independent: number;
    hints: number;
    minutes: number;
    stlMinutes: number;
  }[] = [];

  for (let i = rangeDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
    });

    if (dateStr === todayStr) {
      chartData.push({
        date: dateStr,
        label,
        solved: stats.todaySolvedCount,
        easy: stats.todayEasySolved,
        medium: stats.todayMediumSolved,
        hard: stats.todayHardSolved,
        independent: stats.todayIndependentSolved,
        hints: stats.todayWithHintsSolved,
        minutes: stats.todayTotalDsaMinutes,
        stlMinutes: stats.todayStlMinutes,
      });
    } else {
      const log = studyLogs.find((l) => l.date === dateStr);
      chartData.push({
        date: dateStr,
        label,
        solved: log?.solvedCount || 0,
        easy: log?.easySolved || 0,
        medium: log?.mediumSolved || 0,
        hard: log?.hardSolved || 0,
        independent: log?.independentCount || 0,
        hints: log?.hintsCount || 0,
        minutes: log?.dsaMinutes || 0,
        stlMinutes: log?.stlMinutes || 0,
      });
    }
  }

  // Difficulty Distribution
  const allSolved = problems.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  );

  // Independent vs Hints
  const independentTotal = allSolved.filter((p) => p.solvedIndependently).length;
  const hintsTotal = allSolved.length - independentTotal;
  const masteryPercentage = allSolved.length > 0 ? Math.round((independentTotal / allSolved.length) * 100) : 0;

  // Total Study minutes
  const totalDsaMins = chartData.reduce((acc, c) => acc + c.minutes, 0);
  const totalStlMins = chartData.reduce((acc, c) => acc + c.stlMinutes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200 text-white">
      {/* Top Banner */}
      <div className="card-soft p-5 sm:p-6 bg-[#101229]/80 border border-violet-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl gradient-violet text-white shadow-glow-violet">
              <BarChart3 size={18} />
            </span>
            <h2 className="text-xl font-extrabold text-white">
              Mission Analytics & Telemetry
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real data from your stored session logs. Tracks consistency, difficulty curves, and independent solution rates.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-1 bg-[#0b0c1e] p-1 rounded-xl border border-violet-500/20 shadow-sm">
          {(['7', '14', '30'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-violet-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* Top High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Solved in Period
          </span>
          <p className="text-3xl font-extrabold text-white mt-2">
            {chartData.reduce((acc, c) => acc + c.solved, 0)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across past {timeRange} days
          </span>
        </div>

        <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Solo Mastery Rate
          </span>
          <p className="text-3xl font-extrabold text-emerald-400 mt-2">
            {masteryPercentage}%
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {independentTotal} solo / {hintsTotal} with hints
          </span>
        </div>

        <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Focus Time
          </span>
          <p className="text-3xl font-extrabold text-white mt-2">
            {Math.round((totalDsaMins + totalStlMins) / 60)} hrs
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            DSA: {totalDsaMins}m • STL: {totalStlMins}m
          </span>
        </div>

        <div className="card-soft p-5 bg-[#101229]/80 border border-violet-500/20">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            STL Consistency Streak
          </span>
          <p className="text-3xl font-extrabold text-violet-400 mt-2">
            {chartData.filter((c) => c.stlMinutes >= 30).length} / {rangeDays}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            30-min sessions completed
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Problem Solving Velocity */}
        <div className="card-soft p-6 bg-[#101229]/80 border border-violet-500/20">
          <h3 className="font-bold text-sm text-white mb-1">
            Questions Solved By Day
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Daily throughput split by Easy, Medium, and Hard
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0f1126] p-3 rounded-xl shadow-glass-panel border border-violet-500/30 text-xs text-white">
                          <p className="font-bold text-violet-300 mb-1">{d.date}</p>
                          <p className="text-slate-300">Total Solved: {d.solved}</p>
                          <p className="text-emerald-400">Easy: {d.easy}</p>
                          <p className="text-amber-400">Medium: {d.medium}</p>
                          <p className="text-purple-400">Hard: {d.hard}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="easy" stackId="a" fill="#10b981" />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                <Bar dataKey="hard" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Study Focus Time Trends */}
        <div className="card-soft p-6 bg-[#101229]/80 border border-violet-500/20">
          <h3 className="font-bold text-sm text-white mb-1">
            Focus Time Trends (Minutes)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Active DSA problem solving time vs STL 30-min block
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-[#0f1126] p-3 rounded-xl shadow-glass-panel border border-violet-500/30 text-xs text-white">
                          <p className="font-bold text-violet-300 mb-1">{d.date}</p>
                          <p className="text-indigo-400">DSA Time: {d.minutes}m</p>
                          <p className="text-violet-400">STL Time: {d.stlMinutes}m</p>
                          <p className="text-white font-bold mt-1">Total: {d.minutes + d.stlMinutes}m</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#6366f1"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#6366f1' }}
                  name="DSA Minutes"
                />
                <Line
                  type="monotone"
                  dataKey="stlMinutes"
                  stroke="#a855f7"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#a855f7' }}
                  name="STL Minutes"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};
