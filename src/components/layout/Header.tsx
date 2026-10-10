import React, { useState } from 'react';
import {
  Menu,
  Plus,
  Bell,
  CheckCircle2,
  Calendar,
  Sparkles,
  Cloud,
  HardDrive,
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
  const { dailyPlan, notifications, currentUser, setAuthModalOpen } = useDSA();
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
    <header className="sticky top-0 z-30 bg-[#090a16]/85 backdrop-blur-xl border-b border-violet-900/30 px-4 sm:px-8 py-3.5 transition-all text-slate-100">
      <div className="flex items-center justify-between">
        {/* Left: Mobile Toggle & Greeting */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-xl text-slate-300 hover:text-white hover:bg-violet-900/30 transition-colors"
            aria-label="Open navigation menu"
          >
            <Menu size={22} />
          </button>

          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight flex items-center gap-1.5">
                <span>{greeting}, Space Cadet</span>
              </h1>
              <span className="hidden sm:inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-violet-950/70 text-violet-300 border border-violet-500/30 shadow-xs">
                <Sparkles size={11} className="mr-1 text-violet-400" />
                Orbital Sprint
              </span>
            </div>
            <div className="flex items-center text-xs text-slate-400 font-medium space-x-2 mt-0.5">
              <span className="flex items-center">
                <Calendar size={12} className="mr-1 text-violet-400" />
                {dateFormatted}
              </span>
              <span>•</span>
              <span className="text-violet-300 font-semibold">
                Daily Mission: {dailyPlan.targetCount} Target ({dailyPlan.targetEasy}E / {dailyPlan.targetMedium}M / {dailyPlan.targetHard}H)
              </span>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Cloud Sync Status Badge Button */}
          <button
            onClick={() => setAuthModalOpen(true)}
            className={`hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
              currentUser
                ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40 hover:bg-emerald-900/40'
                : 'bg-[#12142e]/80 text-slate-300 border-violet-500/20 hover:bg-[#1a1c40]'
            }`}
            title={currentUser ? `Cloud Synced (${currentUser.email})` : 'Cloud Sync (Local Storage Mode)'}
          >
            {currentUser ? (
              <>
                <Cloud size={14} className="text-emerald-400" />
                <span>Cloud Synced</span>
              </>
            ) : (
              <>
                <HardDrive size={13} className="text-violet-400" />
                <span>Local Orbit</span>
              </>
            )}
          </button>

          {/* Quick End-of-Session Summary */}
          <button
            onClick={onOpenSummaryModal}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-200 bg-[#12142e]/80 border border-violet-500/20 hover:bg-[#1a1c40] hover:border-violet-400/40 shadow-sm active:scale-95 transition-all"
            title="View today's mission completion summary"
          >
            <CheckCircle2 size={15} className="text-violet-400" />
            <span>Mission Brief</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setNotifDropdownOpen(!notifDropdownOpen)}
              className="p-2 sm:p-2.5 rounded-xl bg-[#12142e]/80 border border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-400/50 shadow-sm transition-all relative"
              aria-label="View notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-violet-600 text-white font-extrabold text-[10px] flex items-center justify-center animate-pulse shadow-glow-violet">
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
            className="flex items-center space-x-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95 active:scale-95 transition-all"
          >
            <Plus size={16} strokeWidth={2.5} />
            <span>Add Question</span>
          </button>
        </div>
      </div>
    </header>
  );
};
