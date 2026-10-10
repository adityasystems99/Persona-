import React, { useState } from 'react';
import { DSAProvider, useDSA } from './context/DSAContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardView } from './components/views/DashboardView';
import { DailyPlanView } from './components/views/DailyPlanView';
import { QuestionBankView } from './components/views/QuestionBankView';
import { STLPracticeView } from './components/views/STLPracticeView';
import { RevisionQueueView } from './components/views/RevisionQueueView';
import { AnalyticsView } from './components/views/AnalyticsView';
import { SettingsView } from './components/views/SettingsView';
import { WeaknessMapView } from './components/views/WeaknessMapView';
import { FocusModeView } from './components/views/FocusModeView';
import { WeeklyAutopsyView } from './components/views/WeeklyAutopsyView';
import { MilestonesView } from './components/views/MilestonesView';
import { PlaylistTrackerView } from './components/views/PlaylistTrackerView';
import { AddEditProblemModal } from './components/modals/AddEditProblemModal';
import { BulkAddModal } from './components/modals/BulkAddModal';
import { RevisionLogModal } from './components/modals/RevisionLogModal';
import { EndOfDaySummaryModal } from './components/dashboard/EndOfDaySummaryModal';
import { AuthModal } from './components/modals/AuthModal';
import { Problem } from './types/dsa';

const MainApp: React.FC = () => {
  const { activeTab, authModalOpen, setAuthModalOpen } = useDSA();

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Modal states
  const [addEditModalOpen, setAddEditModalOpen] = useState(false);
  const [editingProblem, setEditingProblem] = useState<Problem | null>(null);
  const [bulkModalOpen, setBulkModalOpen] = useState(false);
  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [revisionProblem, setRevisionProblem] = useState<Problem | null>(null);
  const [summaryModalOpen, setSummaryModalOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingProblem(null);
    setAddEditModalOpen(true);
  };

  const handleOpenEditModal = (problem: Problem) => {
    setEditingProblem(problem);
    setAddEditModalOpen(true);
  };

  const handleOpenRevisionModal = (problem: Problem) => {
    setRevisionProblem(problem);
    setRevisionModalOpen(true);
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onEditProblem={handleOpenEditModal}
            onOpenAddModal={handleOpenAddModal}
            onOpenRevisionModal={handleOpenRevisionModal}
          />
        );
      case 'daily-plan':
        return (
          <DailyPlanView
            onOpenAddModal={handleOpenAddModal}
            onEditProblem={handleOpenEditModal}
          />
        );
      case 'focus-mode':
        return <FocusModeView />;
      case 'weakness-map':
        return (
          <WeaknessMapView
            onOpenRevisionModal={handleOpenRevisionModal}
          />
        );
      case 'question-bank':
        return (
          <QuestionBankView
            onOpenAddModal={handleOpenAddModal}
            onOpenBulkModal={() => setBulkModalOpen(true)}
            onEditProblem={handleOpenEditModal}
            onOpenRevisionModal={handleOpenRevisionModal}
          />
        );
      case 'stl-practice':
        return <STLPracticeView />;
      case 'revision-queue':
        return (
          <RevisionQueueView
            onOpenRevisionModal={handleOpenRevisionModal}
          />
        );
      case 'playlists':
        return <PlaylistTrackerView />;
      case 'weekly-autopsy':
        return <WeeklyAutopsyView />;
      case 'milestones':
        return <MilestonesView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return (
          <DashboardView
            onEditProblem={handleOpenEditModal}
            onOpenAddModal={handleOpenAddModal}
            onOpenRevisionModal={handleOpenRevisionModal}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col font-sans">
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          sidebarCollapsed ? 'md:ml-20' : 'md:ml-64'
        }`}
      >
        {/* Header */}
        <Header
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onOpenAddModal={handleOpenAddModal}
          onOpenSummaryModal={() => setSummaryModalOpen(true)}
        />

        {/* View container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals */}
      <AddEditProblemModal
        isOpen={addEditModalOpen}
        onClose={() => setAddEditModalOpen(false)}
        editingProblem={editingProblem}
      />

      <BulkAddModal
        isOpen={bulkModalOpen}
        onClose={() => setBulkModalOpen(false)}
      />

      <RevisionLogModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        problem={revisionProblem}
      />

      <EndOfDaySummaryModal
        isOpen={summaryModalOpen}
        onClose={() => setSummaryModalOpen(false)}
      />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <DSAProvider>
      <MainApp />
    </DSAProvider>
  );
}

export default App;
