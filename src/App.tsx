import React, { useState, useEffect } from 'react';
import { DSAProvider, useDSA } from './context/DSAContext';
import { AcademicProvider } from './context/AcademicContext';
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
import { AcademicTrackerContainer } from './components/academic/AcademicTrackerContainer';
import { PlacementPrepContainer } from './components/placement/PlacementPrepContainer';
import { PlacementProvider } from './context/PlacementContext';
import { AddEditProblemModal } from './components/modals/AddEditProblemModal';
import { BulkAddModal } from './components/modals/BulkAddModal';
import { RevisionLogModal } from './components/modals/RevisionLogModal';
import { EndOfDaySummaryModal } from './components/dashboard/EndOfDaySummaryModal';
import { AuthModal } from './components/modals/AuthModal';
import { Problem } from './types/dsa';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LampThemeModal } from './components/modals/LampThemeModal';

const MainApp: React.FC = () => {
  const { activeTab, setActiveTab, authModalOpen, setAuthModalOpen } = useDSA();
  const { theme, lampModalOpen, setLampModalOpen } = useTheme();

  // Direct URL Navigation Support for /academic-tracker and /placement-prep
  useEffect(() => {
    if (window.location.pathname.startsWith('/academic-tracker')) {
      setActiveTab('academic-tracker');
    } else if (window.location.pathname.startsWith('/placement-prep')) {
      setActiveTab('placement-prep');
    }

    const handlePop = () => {
      if (window.location.pathname.startsWith('/academic-tracker')) {
        setActiveTab('academic-tracker');
      } else if (window.location.pathname.startsWith('/placement-prep')) {
        setActiveTab('placement-prep');
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [setActiveTab]);

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
      case 'placement-prep':
        return <PlacementPrepContainer />;
      case 'academic-tracker':
        return <AcademicTrackerContainer />;
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
    <div
      className={`min-h-screen ${
        theme === 'light'
          ? 'bg-[#f5ede2] text-slate-800'
          : 'bg-[#070814] text-slate-100'
      } flex flex-col font-sans relative overflow-x-hidden transition-colors duration-500`}
    >
      {/* Cosmic Space Nebula Ambient Glows */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div
          className={`absolute -top-32 -left-32 w-96 h-96 ${
            theme === 'light' ? 'bg-amber-500/15' : 'bg-violet-600/12'
          } rounded-full blur-3xl transition-colors duration-700`}
        />
        <div
          className={`absolute top-1/4 -right-32 w-96 h-96 ${
            theme === 'light' ? 'bg-emerald-600/10' : 'bg-indigo-600/10'
          } rounded-full blur-3xl transition-colors duration-700`}
        />
        <div
          className={`absolute bottom-10 left-1/3 w-96 h-96 ${
            theme === 'light' ? 'bg-yellow-500/10' : 'bg-purple-600/10'
          } rounded-full blur-3xl transition-colors duration-700`}
        />
      </div>

      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        mobileOpen={mobileSidebarOpen}
        onCloseMobile={() => setMobileSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 relative z-10 ${
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

      <LampThemeModal
        isOpen={lampModalOpen}
        onClose={() => setLampModalOpen(false)}
      />
    </div>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <DSAProvider>
        <PlacementProvider>
          <AcademicProvider>
            <MainApp />
          </AcademicProvider>
        </PlacementProvider>
      </DSAProvider>
    </ThemeProvider>
  );
}


export default App;
