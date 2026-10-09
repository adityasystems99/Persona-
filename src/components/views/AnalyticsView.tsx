import React, { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  BarChart3,
  PieChart as PieIcon,
  Flame,
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
  const easyTotal = allSolved.filter((p) => p.difficulty === 'Easy').length;
  const mediumTotal = allSolved.filter((p) => p.difficulty === 'Medium').length;
  const hardTotal = allSolved.filter((p) => p.difficulty === 'Hard').length;

  const difficultyData = [
    { name: 'Easy', value: easyTotal, color: '#10b981' },
    { name: 'Medium', value: mediumTotal, color: '#f59e0b' },
    { name: 'Hard', value: hardTotal, color: '#f43f5e' },
  ].filter((d) => d.value > 0);

  // Independent vs Hints
  const independentTotal = allSolved.filter((p) => p.solvedIndependently).length;
  const hintsTotal = allSolved.length - independentTotal;
  const masteryPercentage = allSolved.length > 0 ? Math.round((independentTotal / allSolved.length) * 100) : 0;

  // Total Study minutes
  const totalDsaMins = chartData.reduce((acc, c) => acc + c.minutes, 0);
  const totalStlMins = chartData.reduce((acc, c) => acc + c.stlMinutes, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="card-soft p-5 sm:p-6 bg-gradient-to-br from-white via-slate-50 to-rose-50/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-xl gradient-coral text-white shadow-glow-coral">
              <BarChart3 size={18} />
            </span>
            <h2 className="text-xl font-extrabold text-slate-800">
              Prep Analytics & Mastery Dashboard
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Real data from your stored session logs. Tracks consistency, difficulty curves, and independent solution rates.
          </p>
        </div>

        {/* Time range selector */}
        <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          {(['7', '14', '30'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setTimeRange(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeRange === r
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Last {r} Days
            </button>
          ))}
        </div>
      </div>

      {/* Top High-level KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="card-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Solved in Period
          </span>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            {chartData.reduce((acc, c) => acc + c.solved, 0)}
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            Across past {timeRange} days
          </span>
        </div>

        <div className="card-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Independent Mastery Rate
          </span>
          <p className="text-3xl font-extrabold text-emerald-600 mt-2">
            {masteryPercentage}%
          </p>
          <span className="text-[11px] text-slate-500 mt-1 block">
            {independentTotal} solo / {hintsTotal} with hints
          </span>
        </div>

        <div className="card-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            Total Focus Time
          </span>
          <p className="text-3xl font-extrabold text-slate-800 mt-2">
            {Math.round((totalDsaMins + totalStlMins) / 60)} hrs
          </p>
          <span className="text-[11px] text-slate-400 mt-1 block">
            DSA: {totalDsaMins}m • STL: {totalStlMins}m
          </span>
        </div>

        <div className="card-soft p-5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
            STL Practice Streak
          </span>
          <p className="text-3xl font-extrabold text-rose-600 mt-2">
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
        <div className="card-soft p-6">
          <h3 className="font-bold text-sm text-slate-800 mb-1">
            Questions Solved By Day
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Daily throughput split by Easy, Medium, and Hard
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-slate-100 text-xs">
                          <p className="font-bold text-slate-800 mb-1">{d.date}</p>
                          <p className="text-slate-600">Total Solved: {d.solved}</p>
                          <p className="text-emerald-600">Easy: {d.easy}</p>
                          <p className="text-amber-600">Medium: {d.medium}</p>
                          <p className="text-rose-600">Hard: {d.hard}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="easy" stackId="a" fill="#10b981" />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" />
                <Bar dataKey="hard" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Daily Study Focus Time Trends */}
        <div className="card-soft p-6">
          <h3 className="font-bold text-sm text-slate-800 mb-1">
            Focus Time Trends (Minutes)
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Active DSA problem solving time vs STL 30-min block
          </p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-white p-3 rounded-xl shadow-soft-lg border border-slate-100 text-xs">
                          <p className="font-bold text-slate-800 mb-1">{d.date}</p>
                          <p className="text-blue-600">DSA Time: {d.minutes}m</p>
                          <p className="text-rose-600">STL Time: {d.stlMinutes}m</p>
                          <p className="text-slate-700 font-bold">Total: {d.minutes + d.stlMinutes}m</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="minutes"
                  stroke="#3b82f6"
                  strokeWidth={3}
                  dot={{ r: 3, fill: '#3b82f6' }}
                  name="DSA Minutes"
                />
                <Line
                  type="monotone"
                  dataKey="stlMinutes"
                  stroke="#f43f5e"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={{ r: 2, fill: '#f43f5e' }}
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
