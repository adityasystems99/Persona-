import React from 'react';
import {
  Flame,
  Target,
  Briefcase,
  Code2,
  Users,
  Trophy,
  Calendar,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Sparkles,
  ChevronRight,
  Plus,
} from 'lucide-react';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';

interface PlacementOverviewProps {
  onOpenAddApp: () => void;
  onOpenAddRef: () => void;
  onOpenLogAssess: () => void;
  onOpenLogProject: () => void;
}

export const PlacementOverview: React.FC<PlacementOverviewProps> = ({
  onOpenAddApp,
  onOpenAddRef,
  onOpenLogAssess,
  onOpenLogProject,
}) => {
  const {
    sprintDayNumber,
    sprintTotalDays,
    sprintProgressPercentage,
    todayApplicationsCount,
    todayApplicationsTarget,
    weeklyReferralsCount,
    weeklyReferralsTarget,
    followUpsDue,
    overdueTasks,
    todayTasks,
    todayDsaSolvedCount,
    hasMediumDsaSolvedToday,
    todayProjectMinutes,
    dailyStreak,
    completionRate90Day,
    settings,
    reminders,
    applications,
    setActivePlacementTab,
  } = usePlacement();
  const { theme } = useTheme();

  // Application Pipeline Distribution
  const statusCounts = applications.reduce((acc, app) => {
    acc[app.status] = (acc[app.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const pipelineStages = [
    { label: 'Applied', color: 'from-blue-500 to-indigo-600', count: statusCounts['Applied'] || 0 },
    { label: 'Screening', color: 'from-amber-500 to-yellow-600', count: statusCounts['Screening'] || 0 },
    { label: 'Assessment (OA)', color: 'from-purple-500 to-violet-600', count: statusCounts['Online Assessment'] || 0 },
    { label: 'Interview', color: 'from-teal-500 to-emerald-600', count: (statusCounts['Technical Interview'] || 0) + (statusCounts['HR Round'] || 0) },
    { label: 'Offered', color: 'from-emerald-400 to-green-600', count: statusCounts['Offered'] || 0 },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 90-Day Sprint Header Banner */}
      <div
        className={`relative overflow-hidden rounded-2xl p-6 sm:p-7 border shadow-xl transition-all ${
          theme === 'light'
            ? 'bg-gradient-to-br from-amber-500/10 via-amber-600/5 to-transparent border-amber-500/30 text-slate-800'
            : 'bg-gradient-to-br from-violet-900/30 via-indigo-950/40 to-[#0c0d20] border-violet-500/30 text-white'
        }`}
      >
        <div className="absolute top-0 right-0 w-80 h-80 bg-violet-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center text-xs font-bold px-3 py-1 rounded-full bg-violet-600 text-white shadow-md shadow-violet-900/50">
                <Sparkles size={12} className="mr-1 text-amber-300" />
                90-Day Placement Sprint
              </span>
              <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/30">
                <Flame size={12} className="mr-1 text-amber-500" />
                {dailyStreak} Day Streak
              </span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Day {sprintDayNumber} of {sprintTotalDays} • Consistency is King
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Track daily DSA problems (min 1 Medium), 1 focused hour of project development, 10 job applications, and weekly referral outreach.
            </p>

            {/* Sprint Progress Bar */}
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5 text-slate-300">
                <span>90-Day Sprint Trajectory</span>
                <span className="text-violet-400">{sprintProgressPercentage}% Complete</span>
              </div>
              <div className="w-full h-3 rounded-full bg-black/40 border border-white/10 overflow-hidden p-0.5">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-violet-500 via-indigo-500 to-emerald-400 transition-all duration-700 shadow-sm"
                  style={{ width: `${Math.min(100, sprintProgressPercentage)}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap sm:flex-col gap-2.5 w-full sm:w-auto">
            <button
              onClick={onOpenAddApp}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold text-xs shadow-lg shadow-violet-950/60 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <Plus size={15} />
              <span>Log Application</span>
            </button>
            <button
              onClick={onOpenLogProject}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white font-semibold text-xs border border-indigo-400/30 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <Code2 size={15} />
              <span>Log Project Hour</span>
            </button>
            <button
              onClick={onOpenAddRef}
              className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-200 font-semibold text-xs border border-white/15 flex items-center justify-center space-x-2 transition-all transform active:scale-98"
            >
              <Users size={15} />
              <span>Log Referral</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overdue / Missed Tasks Warning Banner (if any) */}
      {overdueTasks.length > 0 && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/40 text-amber-200 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex-shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {overdueTasks.length} Unfinished Tasks from Previous Days
              </h4>
              <p className="text-xs text-amber-300/90">
                Persona keeps incomplete tasks visible until completed or rescheduled.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePlacementTab('daily-tasks')}
            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-900 font-bold text-xs shadow transition-all flex items-center gap-1 self-end sm:self-auto"
          >
            Resolve Overdue <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* Follow-Ups Due Banner (if any) */}
      {followUpsDue.length > 0 && (
        <div className="p-4 rounded-2xl bg-teal-950/40 border border-teal-500/40 text-teal-200 shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-teal-500/20 text-teal-400 border border-teal-500/30 flex-shrink-0">
              <Clock size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {followUpsDue.length} Referral Follow-Ups Due Today!
              </h4>
              <p className="text-xs text-teal-300/90">
                Gentle reminders: {followUpsDue.map((f) => `${f.contactName} (${f.company})`).join(', ')}.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActivePlacementTab('referrals')}
            className="px-3 py-1.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs shadow transition-all flex items-center gap-1 self-end sm:self-auto"
          >
            Review Outreach <ArrowRight size={13} />
          </button>
        </div>
      )}

      {/* 4 Core Pillars Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* 1. Daily Applications */}
        <div
          onClick={() => setActivePlacementTab('applications')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101228]/80 hover:bg-[#151838] border border-violet-500/20 hover:border-violet-500/40 shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 group-hover:scale-105 transition-transform">
              <Briefcase size={20} />
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                todayApplicationsCount >= todayApplicationsTarget
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              {todayApplicationsCount >= todayApplicationsTarget ? 'Goal Achieved! ✓' : 'In Progress'}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 font-medium">Daily Applications</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-white">
                {todayApplicationsCount}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {todayApplicationsTarget} Target
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (todayApplicationsCount / todayApplicationsTarget) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 2. Daily DSA Target (2 LC, min 1 Medium) */}
        <div
          onClick={() => setActivePlacementTab('daily-tasks')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101228]/80 hover:bg-[#151838] border border-violet-500/20 hover:border-violet-500/40 shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-amber-600/20 text-amber-400 border border-amber-500/30 group-hover:scale-105 transition-transform">
              <Target size={20} />
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                hasMediumDsaSolvedToday
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-950 text-amber-300 border border-amber-500/40'
              }`}
            >
              {hasMediumDsaSolvedToday ? 'Medium Solved ✓' : 'Need 1 Medium'}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 font-medium">Daily DSA Problems</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-white">
                {todayDsaSolvedCount}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {settings.dailyDsaTarget || 2} Target
              </span>
            </div>
          </div>

          <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-amber-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (todayDsaSolvedCount / (settings.dailyDsaTarget || 2)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 3. Project Development Hour */}
        <div
          onClick={() => setActivePlacementTab('daily-tasks')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101228]/80 hover:bg-[#151838] border border-violet-500/20 hover:border-violet-500/40 shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 group-hover:scale-105 transition-transform">
              <Code2 size={20} />
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                todayProjectMinutes >= (settings.dailyProjectHours || 1) * 60
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              {todayProjectMinutes >= (settings.dailyProjectHours || 1) * 60 ? '1h Logged ✓' : 'In Progress'}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 font-medium">Project Power Hour</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-white">
                {todayProjectMinutes}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {(settings.dailyProjectHours || 1) * 60} mins
              </span>
            </div>
          </div>

          <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-indigo-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (todayProjectMinutes / ((settings.dailyProjectHours || 1) * 60)) * 100)}%`,
              }}
            />
          </div>
        </div>

        {/* 4. Weekly Referral Outreach */}
        <div
          onClick={() => setActivePlacementTab('referrals')}
          className="cursor-pointer p-5 rounded-2xl bg-[#101228]/80 hover:bg-[#151838] border border-violet-500/20 hover:border-violet-500/40 shadow-lg transition-all group"
        >
          <div className="flex items-center justify-between">
            <div className="p-2.5 rounded-xl bg-teal-600/20 text-teal-400 border border-teal-500/30 group-hover:scale-105 transition-transform">
              <Users size={20} />
            </div>
            <span
              className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                weeklyReferralsCount >= weeklyReferralsTarget
                  ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/40'
                  : 'bg-white/5 text-slate-400'
              }`}
            >
              {weeklyReferralsCount >= weeklyReferralsTarget ? 'Target Met ✓' : 'Weekly Goal'}
            </span>
          </div>

          <div className="mt-4">
            <span className="text-xs text-slate-400 font-medium">Weekly Referrals</span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-2xl font-black text-white">
                {weeklyReferralsCount}
              </span>
              <span className="text-sm font-semibold text-slate-400">
                / {weeklyReferralsTarget} Target
              </span>
            </div>
          </div>

          <div className="mt-3 w-full h-1.5 rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-500 transition-all duration-500"
              style={{
                width: `${Math.min(100, (weeklyReferralsCount / weeklyReferralsTarget) * 100)}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Application Funnel & Scheduled Reminders Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Application Pipeline */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Briefcase size={18} className="text-violet-400" />
                <span>Job Application Pipeline</span>
              </h3>
              <p className="text-xs text-slate-400">
                Distribution across application stages ({applications.length} total logged)
              </p>
            </div>
            <button
              onClick={() => setActivePlacementTab('applications')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
            >
              View Full Pipeline <ChevronRight size={14} />
            </button>
          </div>

          {/* Pipeline Stage Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-2">
            {pipelineStages.map((stage) => (
              <div
                key={stage.label}
                className="p-3.5 rounded-xl bg-black/30 border border-white/5 flex flex-col justify-between"
              >
                <span className="text-xs text-slate-400 font-medium truncate">
                  {stage.label}
                </span>
                <span className="text-xl font-extrabold text-white mt-1">
                  {stage.count}
                </span>
                <div className="mt-2 w-full h-1 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${stage.color}`}
                    style={{
                      width: `${applications.length > 0 ? (stage.count / applications.length) * 100 : 0}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recent Applications Quick Preview */}
          <div className="pt-3 border-t border-white/10">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block mb-2.5">
              Recent Applications
            </span>
            <div className="space-y-2">
              {applications.slice(0, 3).map((app) => (
                <div
                  key={app.id}
                  className="p-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-between text-xs transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="w-7 h-7 rounded-lg bg-violet-600/20 text-violet-300 font-bold flex items-center justify-center">
                      {app.company.charAt(0)}
                    </span>
                    <div>
                      <span className="font-bold text-white block">{app.company}</span>
                      <span className="text-slate-400">{app.role} • {app.platform}</span>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/30 font-semibold">
                    {app.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Smart Reminder Schedule */}
        <div className="p-6 rounded-2xl bg-[#101228]/80 border border-violet-500/20 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
                <Clock size={18} className="text-violet-400" />
                <span>Today's Reminder Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                Configured schedules & notification alerts
              </p>
            </div>
            <button
              onClick={() => setActivePlacementTab('reminders-config')}
              className="text-xs font-semibold text-violet-400 hover:text-violet-300"
            >
              Configure
            </button>
          </div>

          <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                className="p-3 rounded-xl bg-black/30 border border-white/5 flex items-center justify-between text-xs"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-white">{rem.preferredTime}</span>
                    <span className="font-semibold text-slate-300">{rem.title}</span>
                  </div>
                  <span className="text-slate-500 text-[11px] block mt-0.5 truncate max-w-[200px]">
                    {rem.description}
                  </span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    rem.enabled
                      ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                      : 'bg-white/5 text-slate-500'
                  }`}
                >
                  {rem.enabled ? 'Active' : 'Paused'}
                </span>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
            <span>Timezone: {settings.timezone}</span>
            <span className="text-violet-400 font-semibold">Auto Idempotent</span>
          </div>
        </div>
      </div>
    </div>
  );
};
