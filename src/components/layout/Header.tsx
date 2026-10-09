import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { NotificationDropdown } from '../common/NotificationToast';

interface HeaderProps {
  onOpenMobileSidebar: () => void;
  onOpenAddModal: () => void;
  onOpenSummaryModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenMobileSidebar,
  onOpenAddModal,
  onOpenSummaryModal,
}) => {
  const { dailyPlan, stats, notifications } = useDSA();
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  const hour = now.getHours();
  const greeting =
    hour < 12
      ? 'Good morning'
      : hour < 17
      ? 'Good afternoon'
      : 'Good evening';

  return (
    <header className="sticky top-0 z-30 bg-[#f8fafc]/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3.5 transition-all">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Greeting */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight">
                {greeting}, Dev
              </h1>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-600 border border-rose-200/60">
                <Sparkles size={11} className="mr-1" />
                DSA Prep Sprint
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-500 font-medium space-x-2 mt-0.5">
              <span className="flex items-center">
                <Calendar size={12} className="mr-1 text-slate-400" />
                {dateFormatted}
              </span>
              <span>•</span>
              <span className="text-slate-600 font-semibold">
                Target: {dailyPlan.targetCount} Questions ({dailyPlan.targetEasy}E / {dailyPlan.targetMedium}M / {dailyPlan.targetHard}H)
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Quick End-of-Session Summary */}
          <button
            onClick={onOpenSummaryModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 hover:bg-slate-50 shadow-sm active:scale-95 transition-all"
            title="View today's session completion summary"
          >
            <CheckCircle2 size={15} className="text-emerald-500" />
            <span>Session Summary</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-white border border-slate-200/90 text-slate-600 hover:text-rose-600 hover:border-rose-200 shadow-sm transition-all relative"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse shadow-sm">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            <NotificationDropdown
              isOpen={notifDropdownOpen}
              onClose={() => setNotifDropdownOpen(false)}
            />
          </div>

          {/* Quick-Add Question Button */}
          <button
            onClick={onOpenAddModal}
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white gradient-coral shadow-glow-coral hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </header>
  );
};
