import {
  LayoutDashboard,
  GraduationCap,
  CalendarCheck2,
  Database,
  Timer,
  Repeat2,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  Code2,
  Flame,
  BrainCircuit,
  Target,
  FileSearch,
  Trophy,
  Video,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { ActiveTab } from '../../types/dsa';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
  mobileOpen,
  onCloseMobile,
}) => {
  const { activeTab, setActiveTab, stats, stlState, activeFocusSession, milestones, weakestTopics, playlists } = useDSA();

  const unlockedMilestones = milestones.filter((m) => m.isUnlocked).length;

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: 'academic-tracker',
      label: 'Academic Tracker',
      icon: <GraduationCap size={20} />,
      badge: 'Sem 5',
    },
    {
      id: 'daily-plan',
      label: "Today's Plan",
      icon: <CalendarCheck2 size={20} />,
      badge: stats.todayPlanAssignedCount > 0 ? `${stats.todaySolvedCount}/${stats.todayPlanAssignedCount}` : undefined,
    },
    {
      id: 'focus-mode',
      label: 'Focus Mode',
      icon: <Target size={20} />,
      badge: activeFocusSession ? 'LIVE' : undefined,
    },
    {
      id: 'weakness-map',
      label: 'Weakness Map',
      icon: <BrainCircuit size={20} />,
      badge: weakestTopics.length > 0 ? `${weakestTopics.length} weak` : undefined,
    },
    {
      id: 'revision-queue',
      label: 'Revision Queue',
      icon: <Repeat2 size={20} />,
      badge: stats.revisionQueueCount > 0 ? stats.revisionQueueCount : undefined,
    },
    {
      id: 'playlists',
      label: 'Playlist Tracker',
      icon: <Video size={20} />,
      badge: playlists.length > 0 ? playlists.length : undefined,
    },
    {
      id: 'stl-practice',
      label: 'STL Arena',
      icon: <Timer size={20} />,
      badge: stlState.isCompleted ? '✓' : '30m',
    },
    {
      id: 'question-bank',
      label: 'Question Bank',
      icon: <Database size={20} />,
      badge: stats.totalProblemsCount,
    },
    {
      id: 'weekly-autopsy',
      label: 'Weekly Autopsy',
      icon: <FileSearch size={20} />,
    },
    {
      id: 'milestones',
      label: 'Milestones',
      icon: <Trophy size={20} />,
      badge: `${unlockedMilestones}/${milestones.length}`,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={20} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={20} />,
    },
  ];

  const handleSelect = (tab: ActiveTab) => {
    setActiveTab(tab);
    if (tab === 'academic-tracker') {
      if (!window.location.pathname.startsWith('/academic-tracker')) {
        window.history.pushState(null, '', '/academic-tracker');
      }
    } else {
      if (window.location.pathname.startsWith('/academic-tracker')) {
        window.history.pushState(null, '', '/');
      }
    }
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 text-slate-300">
      <div>
        {/* Logo and Brand */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-violet-900/30">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl gradient-violet flex items-center justify-center text-white shadow-glow-violet flex-shrink-0 font-bold">
              <Code2 size={22} />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-white text-base tracking-tight truncate flex items-center gap-1.5">
                  AlgoPulse
                </span>
                <span className="text-[10px] text-violet-400 font-mono tracking-wider uppercase">
                  Space Station Hub
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-violet-950/40 transition-colors"
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
          </button>
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                title={collapsed ? item.label : undefined}
                className={`w-full flex items-center ${
                  collapsed ? 'justify-center px-2' : 'justify-between px-3.5'
                } py-3 rounded-xl font-semibold text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 text-white shadow-glow-violet'
                    : 'text-slate-400 hover:text-white hover:bg-violet-950/30'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-violet-400'} transition-colors`}>
                    {item.icon}
                  </span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </div>

                {!collapsed && item.badge !== undefined && (
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : item.id === 'revision-queue' && stats.revisionQueueCount > 0
                        ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                        : 'bg-violet-950/60 text-slate-300'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom STL mini tracker / Mission status */}
      {!collapsed ? (
        <div className="mt-auto pt-4 border-t border-violet-900/30">
          <div className="p-3.5 rounded-2xl bg-[#101229]/80 border border-violet-900/40">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center space-x-1.5">
                <Flame size={15} className="text-violet-400 animate-bounce" />
                <span>Mission Trajectory</span>
              </span>
              <span className="text-emerald-400 text-[11px]">Daily Target</span>
            </div>
            <div className="w-full bg-[#1b1e3e] rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="gradient-violet h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{stats.todaySolvedCount} solved today</span>
              <span className="text-violet-300 font-semibold">{stats.completionPercentage}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex justify-center pt-4">
          <div className="w-9 h-9 rounded-xl bg-[#101229]/80 border border-violet-900/40 flex items-center justify-center text-violet-400" title={`${stats.completionPercentage}% target met`}>
            <Flame size={18} />
          </div>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block fixed top-0 left-0 h-screen bg-[#080914] z-40 transition-all duration-300 ease-in-out border-r border-violet-900/30 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#080914] z-50 transition-transform duration-300 ease-in-out md:hidden border-r border-violet-900/30 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
