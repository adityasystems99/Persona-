import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  BookOpen,
  CalendarCheck2,
  Clock,
  Bookmark,
  RotateCcw,
  Calendar,
  BarChart3,
  Settings,
  Sparkles,
} from 'lucide-react';
import { useAcademic } from '../../context/AcademicContext';
import {
  AcademicTab,
  AcademicSubject,
  AcademicUnit,
  AcademicTopic,
  AcademicTask,
  AcademicAssignment,
  AcademicExam,
  AcademicNote,
  AcademicResource,
  AcademicRevision,
} from '../../types/academic';

// Views
import { AcademicDashboardView } from './views/AcademicDashboardView';
import { SemesterSubjectsView } from './views/SemesterSubjectsView';
import { SubjectDetailView } from './views/SubjectDetailView';
import { AcademicPlannerView } from './views/AcademicPlannerView';
import { AssignmentsDeadlinesView } from './views/AssignmentsDeadlinesView';
import { NotesResourcesView } from './views/NotesResourcesView';
import { AcademicRevisionView } from './views/AcademicRevisionView';
import { AttendanceTrackerView } from './views/AttendanceTrackerView';
import { AcademicAnalyticsView } from './views/AcademicAnalyticsView';
import { AcademicSettingsView } from './views/AcademicSettingsView';

// Modals
import { AddEditSubjectModal } from './modals/AddEditSubjectModal';
import { AddEditUnitTopicModal } from './modals/AddEditUnitTopicModal';
import { AddEditTaskModal } from './modals/AddEditTaskModal';
import { AddEditAssignmentModal } from './modals/AddEditAssignmentModal';
import { AddEditExamModal } from './modals/AddEditExamModal';
import { AddEditNoteModal } from './modals/AddEditNoteModal';
import { AddEditResourceModal } from './modals/AddEditResourceModal';
import { LogAttendanceModal } from './modals/LogAttendanceModal';
import { LogRevisionModal } from './modals/LogRevisionModal';

export const AcademicTrackerContainer: React.FC = () => {
  const {
    activeAcademicTab,
    setActiveAcademicTab,
    selectedSubjectId,
    setSelectedSubjectId,
    todayTasks,
    overdueTasks,
    revisionsDueToday,
    upcomingAssignments,
    upcomingExams,
  } = useAcademic();

  // Modal States
  const [subjectModalOpen, setSubjectModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<AcademicSubject | null>(null);

  const [unitTopicModalOpen, setUnitTopicModalOpen] = useState(false);
  const [unitTopicMode, setUnitTopicMode] = useState<'unit' | 'topic'>('unit');
  const [modalSubjectId, setModalSubjectId] = useState('');
  const [modalUnitId, setModalUnitId] = useState<string | undefined>(undefined);
  const [editingUnit, setEditingUnit] = useState<AcademicUnit | null>(null);
  const [editingTopic, setEditingTopic] = useState<AcademicTopic | null>(null);

  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AcademicTask | null>(null);
  const [defaultTaskDate, setDefaultTaskDate] = useState<string | undefined>(undefined);
  const [defaultTaskSubId, setDefaultTaskSubId] = useState<string | undefined>(undefined);

  const [assignmentModalOpen, setAssignmentModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState<AcademicAssignment | null>(null);
  const [defaultAssignSubId, setDefaultAssignSubId] = useState<string | undefined>(undefined);

  const [examModalOpen, setExamModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<AcademicExam | null>(null);
  const [defaultExamSubId, setDefaultExamSubId] = useState<string | undefined>(undefined);

  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState<AcademicNote | null>(null);
  const [defaultNoteSubId, setDefaultNoteSubId] = useState<string | undefined>(undefined);

  const [resourceModalOpen, setResourceModalOpen] = useState(false);
  const [editingResource, setEditingResource] = useState<AcademicResource | null>(null);
  const [defaultResSubId, setDefaultResSubId] = useState<string | undefined>(undefined);

  const [attendanceModalOpen, setAttendanceModalOpen] = useState(false);
  const [defaultAttSubId, setDefaultAttSubId] = useState<string | undefined>(undefined);

  const [revisionModalOpen, setRevisionModalOpen] = useState(false);
  const [activeRevision, setActiveRevision] = useState<AcademicRevision | null>(null);

  // URL Routing Sync
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      if (path.startsWith('/academic-tracker/subjects/')) {
        const subId = path.split('/academic-tracker/subjects/')[1];
        if (subId) {
          setSelectedSubjectId(subId);
          setActiveAcademicTab('subject-detail', subId);
        }
      } else if (path === '/academic-tracker') {
        if (activeAcademicTab === 'subject-detail') {
          setActiveAcademicTab('dashboard');
        }
      }
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [activeAcademicTab, setActiveAcademicTab, setSelectedSubjectId]);

  // Synchronize browser URL bar on tab changes
  const navigateTab = (tab: AcademicTab, subjectId?: string) => {
    setActiveAcademicTab(tab, subjectId);

    if (tab === 'subject-detail' && subjectId) {
      window.history.pushState(null, '', `/academic-tracker/subjects/${subjectId}`);
    } else {
      window.history.pushState(null, '', '/academic-tracker');
    }
  };

  const handleSelectSubject = (subjectId: string) => {
    navigateTab('subject-detail', subjectId);
  };

  // Nav Items Configuration
  const navItems: {
    id: AcademicTab;
    label: string;
    icon: React.ReactNode;
    badge?: number | string;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />,
    },
    {
      id: 'subjects',
      label: 'Semester Subjects',
      icon: <BookOpen size={16} />,
      badge: '6 Subs',
    },
    {
      id: 'planner',
      label: 'Daily Planner',
      icon: <CalendarCheck2 size={16} />,
      badge: overdueTasks.length > 0 ? `${overdueTasks.length} overdue` : todayTasks.length > 0 ? todayTasks.length : undefined,
      badgeColor: overdueTasks.length > 0 ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' : undefined,
    },
    {
      id: 'deadlines',
      label: 'Deadlines & Exams',
      icon: <Clock size={16} />,
      badge: upcomingAssignments.length + upcomingExams.length > 0 ? upcomingAssignments.length + upcomingExams.length : undefined,
    },
    {
      id: 'notes',
      label: 'Notes & Resources',
      icon: <Bookmark size={16} />,
    },
    {
      id: 'revision',
      label: 'Spaced Revision',
      icon: <RotateCcw size={16} />,
      badge: revisionsDueToday.length > 0 ? `${revisionsDueToday.length} due` : undefined,
      badgeColor: revisionsDueToday.length > 0 ? 'bg-pink-500/20 text-pink-300 border-pink-500/30' : undefined,
    },
    {
      id: 'attendance',
      label: 'Attendance Radar',
      icon: <Calendar size={16} />,
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <BarChart3 size={16} />,
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={16} />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Sub-navigation Tabs Bar */}
      <div className="bg-[#0f1128]/80 backdrop-blur-xl border border-violet-500/20 p-1.5 rounded-2xl flex items-center gap-1.5 overflow-x-auto shadow-xl scrollbar-none">
        {navItems.map((item) => {
          const isActive =
            activeAcademicTab === item.id ||
            (item.id === 'subjects' && activeAcademicTab === 'subject-detail');

          return (
            <button
              key={item.id}
              onClick={() => navigateTab(item.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                isActive
                  ? 'bg-violet-600 text-white shadow-glow-violet'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-violet-950/30'
              }`}
            >
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full border font-mono ${
                    item.badgeColor || (isActive ? 'bg-black/30 text-white border-transparent' : 'bg-slate-900 text-slate-300 border-slate-700')
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Render Active View */}
      {activeAcademicTab === 'dashboard' && (
        <AcademicDashboardView
          onOpenAddTask={() => {
            setEditingTask(null);
            setDefaultTaskDate(undefined);
            setDefaultTaskSubId(undefined);
            setTaskModalOpen(true);
          }}
          onOpenAddSubject={() => {
            setEditingSubject(null);
            setSubjectModalOpen(true);
          }}
          onOpenLogAttendance={(subId) => {
            setDefaultAttSubId(subId);
            setAttendanceModalOpen(true);
          }}
          onOpenAddNote={() => {
            setEditingNote(null);
            setDefaultNoteSubId(undefined);
            setNoteModalOpen(true);
          }}
          onSelectSubject={handleSelectSubject}
          onNavigateTab={navigateTab}
        />
      )}

      {activeAcademicTab === 'subjects' && (
        <SemesterSubjectsView
          onOpenAddSubject={() => {
            setEditingSubject(null);
            setSubjectModalOpen(true);
          }}
          onEditSubject={(sub) => {
            setEditingSubject(sub);
            setSubjectModalOpen(true);
          }}
          onSelectSubject={handleSelectSubject}
        />
      )}

      {activeAcademicTab === 'subject-detail' && selectedSubjectId && (
        <SubjectDetailView
          subjectId={selectedSubjectId}
          onBack={() => navigateTab('subjects')}
          onOpenAddUnit={(subId) => {
            setUnitTopicMode('unit');
            setModalSubjectId(subId);
            setEditingUnit(null);
            setUnitTopicModalOpen(true);
          }}
          onOpenEditUnit={(unit) => {
            setUnitTopicMode('unit');
            setModalSubjectId(unit.subjectId);
            setEditingUnit(unit);
            setUnitTopicModalOpen(true);
          }}
          onOpenAddTopic={(subId, unitId) => {
            setUnitTopicMode('topic');
            setModalSubjectId(subId);
            setModalUnitId(unitId);
            setEditingTopic(null);
            setUnitTopicModalOpen(true);
          }}
          onOpenEditTopic={(topic) => {
            setUnitTopicMode('topic');
            setModalSubjectId(topic.subjectId);
            setModalUnitId(topic.unitId);
            setEditingTopic(topic);
            setUnitTopicModalOpen(true);
          }}
          onOpenEditSubject={(sub) => {
            setEditingSubject(sub);
            setSubjectModalOpen(true);
          }}
          onOpenAddTask={(subId) => {
            setEditingTask(null);
            setDefaultTaskSubId(subId);
            setTaskModalOpen(true);
          }}
          onOpenAddAssignment={(subId) => {
            setEditingAssignment(null);
            setDefaultAssignSubId(subId);
            setAssignmentModalOpen(true);
          }}
          onOpenAddNote={(subId) => {
            setEditingNote(null);
            setDefaultNoteSubId(subId);
            setNoteModalOpen(true);
          }}
          onOpenAddResource={(subId) => {
            setEditingResource(null);
            setDefaultResSubId(subId);
            setResourceModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'planner' && (
        <AcademicPlannerView
          onOpenAddTask={(defaultDate) => {
            setEditingTask(null);
            setDefaultTaskDate(defaultDate);
            setDefaultTaskSubId(undefined);
            setTaskModalOpen(true);
          }}
          onOpenEditTask={(task) => {
            setEditingTask(task);
            setTaskModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'deadlines' && (
        <AssignmentsDeadlinesView
          onOpenAddAssignment={() => {
            setEditingAssignment(null);
            setDefaultAssignSubId(undefined);
            setAssignmentModalOpen(true);
          }}
          onOpenEditAssignment={(a) => {
            setEditingAssignment(a);
            setAssignmentModalOpen(true);
          }}
          onOpenAddExam={() => {
            setEditingExam(null);
            setDefaultExamSubId(undefined);
            setExamModalOpen(true);
          }}
          onOpenEditExam={(exam) => {
            setEditingExam(exam);
            setExamModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'notes' && (
        <NotesResourcesView
          onOpenAddNote={() => {
            setEditingNote(null);
            setDefaultNoteSubId(undefined);
            setNoteModalOpen(true);
          }}
          onOpenEditNote={(note) => {
            setEditingNote(note);
            setNoteModalOpen(true);
          }}
          onOpenAddResource={() => {
            setEditingResource(null);
            setDefaultResSubId(undefined);
            setResourceModalOpen(true);
          }}
          onOpenEditResource={(res) => {
            setEditingResource(res);
            setResourceModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'revision' && (
        <AcademicRevisionView
          onOpenLogRevisionModal={(rev) => {
            setActiveRevision(rev);
            setRevisionModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'attendance' && (
        <AttendanceTrackerView
          onOpenLogAttendance={(subId) => {
            setDefaultAttSubId(subId);
            setAttendanceModalOpen(true);
          }}
        />
      )}

      {activeAcademicTab === 'analytics' && <AcademicAnalyticsView />}

      {activeAcademicTab === 'settings' && <AcademicSettingsView />}

      {/* Global Modals for Academic System */}
      <AddEditSubjectModal
        isOpen={subjectModalOpen}
        onClose={() => setSubjectModalOpen(false)}
        subject={editingSubject}
      />

      <AddEditUnitTopicModal
        isOpen={unitTopicModalOpen}
        onClose={() => setUnitTopicModalOpen(false)}
        mode={unitTopicMode}
        subjectId={modalSubjectId}
        unitId={modalUnitId}
        editingUnit={editingUnit}
        editingTopic={editingTopic}
      />

      <AddEditTaskModal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        task={editingTask}
        defaultDate={defaultTaskDate}
        defaultSubjectId={defaultTaskSubId}
      />

      <AddEditAssignmentModal
        isOpen={assignmentModalOpen}
        onClose={() => setAssignmentModalOpen(false)}
        assignment={editingAssignment}
        defaultSubjectId={defaultAssignSubId}
      />

      <AddEditExamModal
        isOpen={examModalOpen}
        onClose={() => setExamModalOpen(false)}
        exam={editingExam}
        defaultSubjectId={defaultExamSubId}
      />

      <AddEditNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note={editingNote}
        defaultSubjectId={defaultNoteSubId}
      />

      <AddEditResourceModal
        isOpen={resourceModalOpen}
        onClose={() => setResourceModalOpen(false)}
        resource={editingResource}
        defaultSubjectId={defaultResSubId}
      />

      <LogAttendanceModal
        isOpen={attendanceModalOpen}
        onClose={() => setAttendanceModalOpen(false)}
        defaultSubjectId={defaultAttSubId}
      />

      <LogRevisionModal
        isOpen={revisionModalOpen}
        onClose={() => setRevisionModalOpen(false)}
        revision={activeRevision}
      />
    </div>
  );
};
