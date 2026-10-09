import React from 'react';
import {
  LayoutDashboard,
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
  const { activeTab, setActiveTab, stats, stlState } = useDSA();

  const navItems: { id: ActiveTab; label: string; icon: React.ReactNode; badge?: number | string }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={20} />,
    },
    {
      id: 'daily-plan',
      label: "Today's Plan",
      icon: <CalendarCheck2 size={20} />,
      badge: stats.todayPlanAssignedCount > 0 ? `${stats.todaySolvedCount}/${stats.todayPlanAssignedCount}` : undefined,
    },
    {
      id: 'question-bank',
      label: 'Question Bank',
      icon: <Database size={20} />,
      badge: stats.totalProblemsCount,
    },
    {
      id: 'stl-practice',
      label: 'STL Practice',
      icon: <Timer size={20} />,
      badge: stlState.isCompleted ? '✓' : '30m',
    },
    {
      id: 'revision-queue',
      label: 'Revision Queue',
      icon: <Repeat2 size={20} />,
      badge: stats.revisionQueueCount > 0 ? stats.revisionQueueCount : undefined,
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
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="h-full flex flex-col justify-between p-4 text-slate-300">
      <div>
        {/* Logo and Brand */}
        <div className="flex items-center justify-between pb-6 mb-4 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl gradient-coral flex items-center justify-center text-white shadow-glow-coral flex-shrink-0 font-bold">
              <Code2 size={22} />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="font-extrabold text-white text-base tracking-tight truncate">
                  AlgoPulse
                </span>
                <span className="text-[10px] text-slate-400 font-medium tracking-wider uppercase">
                  DSA Command Center
                </span>
              </div>
            )}
          </div>
          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
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
                    ? 'bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-glow-coral'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <span className={`${isActive ? 'text-white' : 'text-slate-400 group-hover:text-rose-400'} transition-colors`}>
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
                        ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                        : 'bg-slate-800 text-slate-300'
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

      {/* Bottom STL mini tracker / Streak reminder */}
      {!collapsed ? (
        <div className="mt-auto pt-4 border-t border-slate-800/80">
          <div className="p-3.5 rounded-2xl bg-slate-800/60 border border-slate-700/50">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300 mb-2">
              <span className="flex items-center space-x-1.5">
                <Flame size={15} className="text-amber-400 animate-bounce" />
                <span>Preparation Mode</span>
              </span>
              <span className="text-emerald-400 text-[11px]">Daily Target</span>
            </div>
            <div className="w-full bg-slate-700/80 rounded-full h-2 mb-2 overflow-hidden">
              <div
                className="gradient-coral h-full rounded-full transition-all duration-500"
                style={{ width: `${stats.completionPercentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-slate-400">
              <span>{stats.todaySolvedCount} solved today</span>
              <span>{stats.completionPercentage}%</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-auto flex justify-center pt-4">
          <div className="w-9 h-9 rounded-xl bg-slate-800/80 flex items-center justify-center text-amber-400" title={`${stats.completionPercentage}% target met`}>
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
        className={`hidden md:block fixed top-0 left-0 h-screen bg-[#0f172a] z-40 transition-all duration-300 ease-in-out border-r border-slate-800 ${
          collapsed ? 'w-20' : 'w-64'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Backdrop */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 md:hidden animate-fade-in"
          onClick={onCloseMobile}
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-72 bg-[#0f172a] z-50 transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};
