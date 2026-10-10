import React from 'react';
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
} from 'recharts';
import { BarChart2, PieChart as PieIcon, Flame, Calendar } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { getTodayDateString } from '../../data/initialData';

export const QuickAnalytics: React.FC = () => {
  const { studyLogs, problems, stats } = useDSA();
  const todayStr = getTodayDateString();

  // Combine stored study logs with today's live activity
  const recentDays = 7;
  const daysList: { date: string; label: string; solved: number; easy: number; medium: number; hard: number; stl: boolean }[] = [];

  for (let i = recentDays - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('en-US', { weekday: 'short' });

    if (dateStr === todayStr) {
      daysList.push({
        date: dateStr,
        label: `${label} (Today)`,
        solved: stats.todaySolvedCount,
        easy: stats.todayEasySolved,
        medium: stats.todayMediumSolved,
        hard: stats.todayHardSolved,
        stl: stats.todayStlMinutes >= 30,
      });
    } else {
      const log = studyLogs.find((l) => l.date === dateStr);
      daysList.push({
        date: dateStr,
        label,
        solved: log?.solvedCount || 0,
        easy: log?.easySolved || 0,
        medium: log?.mediumSolved || 0,
        hard: log?.hardSolved || 0,
        stl: log?.stlCompleted || false,
      });
    }
  }

  // Difficulty Distribution for all solved problems
  const allSolved = problems.filter(
    (p) => p.status === 'Solved Independently' || p.status === 'Solved with Hints'
  );
  const easyTotal = allSolved.filter((p) => p.difficulty === 'Easy').length;
  const mediumTotal = allSolved.filter((p) => p.difficulty === 'Medium').length;
  const hardTotal = allSolved.filter((p) => p.difficulty === 'Hard').length;

  const difficultyData = [
    { name: 'Easy', value: easyTotal, color: '#10b981' },
    { name: 'Medium', value: mediumTotal, color: '#f59e0b' },
    { name: 'Hard', value: hardTotal, color: '#a855f7' },
  ].filter((d) => d.value > 0);

  // Fallback if no solved questions yet
  const hasSolvedData = allSolved.length > 0;

  // STL 7-day consistency streak count
  const stlDaysCount = daysList.filter((d) => d.stl).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6 text-white">
      {/* 7-Day Velocity Chart */}
      <div className="card-soft p-5 lg:col-span-2 flex flex-col justify-between bg-[#101229]/80 border border-violet-500/20">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-xl bg-violet-950/70 border border-violet-500/30 text-violet-400 flex items-center justify-center">
                <BarChart2 size={16} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-white">
                  7-Day Mission Velocity
                </h3>
                <p className="text-[11px] text-slate-400">
                  Questions solved across the past week
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3 text-[11px] font-semibold">
              <span className="flex items-center text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 mr-1.5" />
                Easy
              </span>
              <span className="flex items-center text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 mr-1.5" />
                Med
              </span>
              <span className="flex items-center text-slate-300">
                <span className="w-2.5 h-2.5 rounded-sm bg-purple-500 mr-1.5" />
                Hard
              </span>
            </div>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daysList} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis
                  dataKey="label"
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: 'rgba(139, 92, 246, 0.08)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-[#0f1126] p-2.5 rounded-xl shadow-glass-panel border border-violet-500/30 text-xs text-white">
                          <p className="font-bold text-violet-300 mb-1">{data.label}</p>
                          <p className="text-slate-300">Total Solved: <strong className="text-white">{data.solved}</strong></p>
                          <div className="text-[10px] text-slate-400 mt-1 flex space-x-2">
                            <span>E: {data.easy}</span>
                            <span>M: {data.medium}</span>
                            <span>H: {data.hard}</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="easy" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
                <Bar dataKey="medium" stackId="a" fill="#f59e0b" radius={[0, 0, 0, 0]} />
                <Bar dataKey="hard" stackId="a" fill="#a855f7" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 7-Day STL consistency strip */}
        <div className="mt-3 pt-3 border-t border-violet-900/30 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-slate-400">
            <Calendar size={13} className="text-violet-400" />
            <span>STL 30-min consistency:</span>
            <span className="font-bold text-violet-300">{stlDaysCount}/7 days</span>
          </div>

          <div className="flex items-center space-x-1">
            {daysList.map((d, i) => (
              <span
                key={i}
                title={`${d.label}: ${d.stl ? '30m STL Completed' : 'STL Missed'}`}
                className={`w-3 h-3 rounded-full ${
                  d.stl ? 'bg-violet-500 shadow-glow-violet' : 'bg-[#1b1d3d]'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Difficulty Distribution Donut */}
      <div className="card-soft p-5 flex flex-col justify-between bg-[#101229]/80 border border-violet-500/20">
        <div>
          <div className="flex items-center space-x-2 mb-3">
            <div className="w-8 h-8 rounded-xl bg-violet-950/70 border border-violet-500/30 text-violet-400 flex items-center justify-center">
              <PieIcon size={16} />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">
                Difficulty Balance
              </h3>
              <p className="text-[11px] text-slate-400">
                Distribution across solved bank
              </p>
            </div>
          </div>

          {hasSolvedData ? (
            <div className="relative h-40 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={difficultyData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {difficultyData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-[#0f1126] p-2 rounded-lg shadow-glass-panel border border-violet-500/30 text-xs text-white">
                            <span className="font-bold text-violet-300">
                              {data.name}: {data.value} problems
                            </span>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>

              {/* Center count */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-extrabold text-white">
                  {allSolved.length}
                </span>
                <span className="text-[10px] text-slate-400 font-medium">Solved</span>
              </div>
            </div>
          ) : (
            <div className="h-40 flex flex-col items-center justify-center text-center p-3 text-slate-400 text-xs">
              <p>No problems marked solved yet.</p>
              <p className="text-[11px] mt-1 text-slate-500">
                Complete a question from your queue to view distribution.
              </p>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="mt-3 pt-3 border-t border-violet-900/30 flex items-center justify-around text-xs">
          <div className="text-center">
            <span className="block font-bold text-emerald-400">{easyTotal}</span>
            <span className="text-[10px] text-slate-400">Easy</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-amber-400">{mediumTotal}</span>
            <span className="text-[10px] text-slate-400">Medium</span>
          </div>
          <div className="text-center">
            <span className="block font-bold text-purple-400">{hardTotal}</span>
            <span className="text-[10px] text-slate-400">Hard</span>
          </div>
        </div>
      </div>
    </div>
  );
};
