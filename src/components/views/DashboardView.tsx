import React from 'react';
import { MetricCards } from '../dashboard/MetricCards';
import { TodayTaskList } from '../dashboard/TodayTaskList';
import { DashboardSTLPractice } from '../dashboard/DashboardSTLPractice';
import { QuickAnalytics } from '../dashboard/QuickAnalytics';
import { QuoteCard } from '../common/QuoteCard';
import { Problem } from '../../types/dsa';

interface DashboardViewProps {
  onEditProblem: (problem: Problem) => void;
  onOpenAddModal: () => void;
  onOpenRevisionModal: (problem: Problem) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onEditProblem,
  onOpenAddModal,
  onOpenRevisionModal,
}) => {
  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 4 Core Metric Cards */}
      <MetricCards />

      {/* Main Content Grid: Left 2 Cols (Tasks + STL), Right Col (Quote + Stats) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Today's Task List */}
          <TodayTaskList
            onEditProblem={onEditProblem}
            onOpenAddModal={onOpenAddModal}
            onOpenRevisionModal={onOpenRevisionModal}
          />

          {/* Mandatory 30-min STL Practice Card */}
          <DashboardSTLPractice />
        </div>

        <div className="space-y-6">
          {/* Motivational Quote Panel */}
          <QuoteCard />

          {/* 7-Day Quick Analytics Breakdown */}
          <QuickAnalytics />
        </div>
      </div>
    </div>
  );
};
