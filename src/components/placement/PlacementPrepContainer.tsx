import React, { useState } from 'react';
import {
  LayoutDashboard,
  CalendarCheck2,
  Briefcase,
  Users,
  Trophy,
  Bell,
  Sparkles,
  Flame,
} from 'lucide-react';
import { PlacementTab, WeekendAssessmentType } from '../../types/placement';
import { usePlacement } from '../../context/PlacementContext';
import { useTheme } from '../../context/ThemeContext';
import { PlacementOverview } from './PlacementOverview';
import { PlacementDailyTasksView } from './PlacementDailyTasksView';
import { JobApplicationsView } from './JobApplicationsView';
import { ReferralOutreachView } from './ReferralOutreachView';
import { WeekendAssessmentView } from './WeekendAssessmentView';
import { ReminderEngineConfigView } from './ReminderEngineConfigView';
import { ActiveReminderModal } from './ActiveReminderModal';
import { AddJobApplicationModal } from './AddJobApplicationModal';
import { AddReferralModal } from './AddReferralModal';
import { LogAssessmentModal } from './LogAssessmentModal';
import { LogProjectSessionModal } from './LogProjectSessionModal';

export const PlacementPrepContainer: React.FC = () => {
  const {
    activePlacementTab,
    setActivePlacementTab,
    todayApplicationsCount,
    todayApplicationsTarget,
    weeklyReferralsCount,
    weeklyReferralsTarget,
    overdueTasks,
    dailyStreak,
  } = usePlacement();
  const { theme } = useTheme();

  // Modals state
  const [addAppModalOpen, setAddAppModalOpen] = useState(false);
  const [addRefModalOpen, setAddRefModalOpen] = useState(false);
  const [logAssessModalOpen, setLogAssessModalOpen] = useState(false);
  const [assessDefaultType, setAssessDefaultType] = useState<WeekendAssessmentType>('mock_test');
  const [logProjectModalOpen, setLogProjectModalOpen] = useState(false);

  const handleOpenAssessModal = (type?: WeekendAssessmentType) => {
    setAssessDefaultType(type || 'mock_test');
    setLogAssessModalOpen(true);
  };

  const navTabs: { id: PlacementTab; label: string; icon: React.ReactNode; badge?: string | number }[] = [
    {
      id: 'overview',
      label: '90-Day Hub',
      icon: <LayoutDashboard size={17} />,
    },
    {
      id: 'daily-tasks',
      label: 'Daily Tasks & DSA',
      icon: <CalendarCheck2 size={17} />,
      badge: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : undefined,
    },
    {
      id: 'applications',
      label: 'Job Applications',
      icon: <Briefcase size={17} />,
      badge: `${todayApplicationsCount}/${todayApplicationsTarget}`,
    },
    {
      id: 'referrals',
      label: 'Referral Outreach',
      icon: <Users size={17} />,
      badge: `${weeklyReferralsCount}/${weeklyReferralsTarget}`,
    },
    {
      id: 'assessments',
      label: 'Weekend Mocks & Contests',
      icon: <Trophy size={17} />,
    },
    {
      id: 'reminders-config',
      label: 'Reminder Engine',
      icon: <Bell size={17} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Placement Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Placement Preparation Companion</span>
            </h1>
            <span className="inline-flex items-center text-xs font-bold px-2.5 py-0.5 rounded-full bg-violet-950 text-violet-300 border border-violet-500/30">
              <Sparkles size={11} className="mr-1 text-amber-300" />
              3-Month Sprint
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Personalized, interactive daily & weekly placement preparation system.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0 scrollbar-none">
          {navTabs.map((tab) => {
            const isActive = activePlacementTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActivePlacementTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                  isActive
                    ? 'bg-violet-600 border-violet-400 text-white shadow-md shadow-violet-950/60'
                    : 'bg-white/5 hover:bg-white/10 border-transparent text-slate-400 hover:text-white'
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-black/30 text-white'
                        : 'bg-violet-950 text-violet-300 border border-violet-500/30'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Tab View Rendering */}
      <div>
        {activePlacementTab === 'overview' && (
          <PlacementOverview
            onOpenAddApp={() => setAddAppModalOpen(true)}
            onOpenAddRef={() => setAddRefModalOpen(true)}
            onOpenLogAssess={() => handleOpenAssessModal('mock_test')}
            onOpenLogProject={() => setLogProjectModalOpen(true)}
          />
        )}
        {activePlacementTab === 'daily-tasks' && (
          <PlacementDailyTasksView
            onOpenLogProject={() => setLogProjectModalOpen(true)}
          />
        )}
        {activePlacementTab === 'applications' && (
          <JobApplicationsView
            onOpenAddModal={() => setAddAppModalOpen(true)}
          />
        )}
        {activePlacementTab === 'referrals' && (
          <ReferralOutreachView
            onOpenAddModal={() => setAddRefModalOpen(true)}
          />
        )}
        {activePlacementTab === 'assessments' && (
          <WeekendAssessmentView
            onOpenLogModal={handleOpenAssessModal}
          />
        )}
        {activePlacementTab === 'reminders-config' && (
          <ReminderEngineConfigView />
        )}
      </div>

      {/* Interactive Global Modals */}
      <ActiveReminderModal />
      <AddJobApplicationModal
        isOpen={addAppModalOpen}
        onClose={() => setAddAppModalOpen(false)}
      />
      <AddReferralModal
        isOpen={addRefModalOpen}
        onClose={() => setAddRefModalOpen(false)}
      />
      <LogAssessmentModal
        isOpen={logAssessModalOpen}
        onClose={() => setLogAssessModalOpen(false)}
        defaultType={assessDefaultType}
      />
      <LogProjectSessionModal
        isOpen={logProjectModalOpen}
        onClose={() => setLogProjectModalOpen(false)}
      />
    </div>
  );
};
