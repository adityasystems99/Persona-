import React, { useState } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Archive,
  RotateCcw,
  Trash2,
  Layers,
  Calendar,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { AcademicSubject } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface SemesterSubjectsViewProps {
  onOpenAddSubject: () => void;
  onEditSubject: (subject: AcademicSubject) => void;
  onSelectSubject: (subjectId: string) => void;
}

export const SemesterSubjectsView: React.FC<SemesterSubjectsViewProps> = ({
  onOpenAddSubject,
  onEditSubject,
  onSelectSubject,
}) => {
  const { subjects, archiveSubject, deleteSubject, subjectAttendanceStats } = useAcademic();

  const [searchQuery, setSearchQuery] = useState('');
  const [showArchived, setShowArchived] = useState(false);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredSubjects = subjects.filter((s) => {
    const matchesArchived = showArchived ? s.isArchived : !s.isArchived;
    const matchesQuery =
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesArchived && matchesQuery;
  });

  const handleDelete = async (id: string) => {
    await deleteSubject(id);
    setConfirmDeleteId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header & Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="text-violet-400" size={24} />
            Semester 5 Subjects
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Curriculum architecture, units, syllabus weightage, and targets
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
              showArchived
                ? 'bg-violet-600/20 border-violet-500 text-violet-300'
                : 'bg-[#090a16] border-violet-500/20 text-slate-400 hover:text-white'
            }`}
          >
            {showArchived ? 'Viewing Archived' : 'Show Archived'}
          </button>
          <button
            onClick={onOpenAddSubject}
            className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
          >
            <Plus size={16} />
            <span>Add Subject</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Filter by subject code or title (e.g. DAA, Networks)..."
          className="w-full pl-10 pr-4 py-2.5 bg-[#0f1128] border border-violet-500/20 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Subject Cards Grid */}
      {filteredSubjects.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
          <BookOpen size={36} className="mx-auto text-violet-400 opacity-40" />
          <h3 className="text-base font-bold text-white">No subjects found</h3>
          <p className="text-xs text-slate-400">
            {searchQuery
              ? `No subjects matching "${searchQuery}"`
              : showArchived
              ? 'No archived subjects.'
              : 'Add your 5th semester subjects to get started.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSubjects.map((sub) => {
            let totalTopics = 0;
            let completedTopics = 0;
            sub.units.forEach((u) => {
              u.topics.forEach((t) => {
                totalTopics++;
                if (t.isCompleted) completedTopics++;
              });
            });
            const progress = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
            const att = subjectAttendanceStats[sub.id];

            return (
              <div
                key={sub.id}
                className="rounded-2xl bg-[#0f1128] border border-violet-500/20 hover:border-violet-500/40 transition-all flex flex-col justify-between overflow-hidden shadow-xl"
              >
                {/* Card Top */}
                <div className="p-5">
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className="px-2.5 py-1 rounded-md text-xs font-bold font-mono text-white"
                      style={{ backgroundColor: sub.color || '#8b5cf6' }}
                    >
                      {sub.code}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      {sub.credits} Credits
                    </span>
                  </div>

                  <h3
                    onClick={() => onSelectSubject(sub.id)}
                    className="text-base font-bold text-white hover:text-violet-300 cursor-pointer transition-colors"
                  >
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-1.5 line-clamp-2 min-h-[32px]">
                    {sub.description || 'No description provided.'}
                  </p>

                  {/* Units & Topics summary pills */}
                  <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-violet-900/30 text-xs">
                    <div className="p-2 rounded-lg bg-[#090a16] border border-violet-500/10">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">
                        Units / Modules
                      </span>
                      <span className="text-sm font-bold text-slate-200">
                        {sub.units.length} Units
                      </span>
                    </div>

                    <div className="p-2 rounded-lg bg-[#090a16] border border-violet-500/10">
                      <span className="text-[10px] uppercase font-mono text-slate-500 block">
                        Topics Mastered
                      </span>
                      <span className="text-sm font-bold text-slate-200">
                        {completedTopics}/{totalTopics}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="mt-3">
                    <div className="flex justify-between text-[11px] font-mono text-slate-400 mb-1">
                      <span>Syllabus Completion</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${progress}%`,
                          backgroundColor: sub.color || '#8b5cf6',
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Actions Bottom Bar */}
                <div className="px-5 py-3 bg-[#090a16] border-t border-violet-900/30 flex items-center justify-between">
                  <button
                    onClick={() => onSelectSubject(sub.id)}
                    className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    <span>View Syllabus</span>
                    <ExternalLink size={12} />
                  </button>

                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => onEditSubject(sub)}
                      title="Edit Subject"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-violet-900/30 transition-colors"
                    >
                      <Edit2 size={14} />
                    </button>

                    <button
                      onClick={() => archiveSubject(sub.id, !sub.isArchived)}
                      title={sub.isArchived ? 'Unarchive' : 'Archive'}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-violet-900/30 transition-colors"
                    >
                      {sub.isArchived ? <RotateCcw size={14} /> : <Archive size={14} />}
                    </button>

                    <button
                      onClick={() => setConfirmDeleteId(sub.id)}
                      title="Delete Subject"
                      className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDeleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0f1128] border border-rose-500/30 rounded-2xl p-6 max-w-sm w-full space-y-4">
            <div className="flex items-center space-x-3 text-rose-400">
              <AlertCircle size={22} />
              <h3 className="text-base font-bold text-white">Delete Subject?</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure? This will permanently delete this subject and its units from Supabase. Consider archiving it instead to retain your historical logs.
            </p>
            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white border border-slate-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDeleteId)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-600 hover:bg-rose-500 text-white"
              >
                Delete Permanently
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
