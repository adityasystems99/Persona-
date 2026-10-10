import React, { useState } from 'react';
import {
  FileText,
  Bookmark,
  Plus,
  Search,
  Pin,
  ExternalLink,
  Tag,
  Edit2,
  Trash2,
  Globe,
  BookOpen,
} from 'lucide-react';
import { AcademicNote, AcademicResource } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface NotesResourcesViewProps {
  onOpenAddNote: () => void;
  onOpenEditNote: (note: AcademicNote) => void;
  onOpenAddResource: () => void;
  onOpenEditResource: (res: AcademicResource) => void;
}

export const NotesResourcesView: React.FC<NotesResourcesViewProps> = ({
  onOpenAddNote,
  onOpenEditNote,
  onOpenAddResource,
  onOpenEditResource,
}) => {
  const { notes, resources, subjects, deleteNote, togglePinNote, deleteResource } = useAcademic();

  const [activeTab, setActiveTab] = useState<'notes' | 'resources'>('notes');
  const [searchQuery, setSearchQuery] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');

  const filteredNotes = notes
    .filter((n) => {
      const matchesSub = subjectFilter === 'all' || n.subjectId === subjectFilter;
      const matchesQuery =
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesSub && matchesQuery;
    })
    .sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0));

  const filteredResources = resources.filter((r) => {
    const matchesSub = subjectFilter === 'all' || r.subjectId === subjectFilter;
    const matchesQuery =
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.description || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSub && matchesQuery;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2">
            <Bookmark className="text-violet-400" size={24} />
            Notes & Study Resource Library
          </h1>
          <p className="text-xs sm:text-sm text-slate-400">
            Curated subject notes, formulae sheets, PYQ repositories, and textbooks
          </p>
        </div>

        <div className="flex items-center gap-3">
          {activeTab === 'notes' ? (
            <button
              onClick={onOpenAddNote}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Create Note</span>
            </button>
          ) : (
            <button
              onClick={onOpenAddResource}
              className="px-4 py-2 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-xs sm:text-sm font-semibold shadow-glow-violet transition-all flex items-center gap-2"
            >
              <Plus size={16} />
              <span>Save Resource</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs & Search Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-900/30 pb-4">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'notes'
                ? 'bg-violet-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white bg-[#0f1128] border border-violet-500/20'
            }`}
          >
            <FileText size={15} />
            <span>Academic Notes ({notes.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('resources')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'resources'
                ? 'bg-violet-600 text-white shadow-glow-violet'
                : 'text-slate-400 hover:text-white bg-[#0f1128] border border-violet-500/20'
            }`}
          >
            <Globe size={15} />
            <span>Study Resources ({resources.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={subjectFilter}
            onChange={(e) => setSubjectFilter(e.target.value)}
            className="px-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white focus:outline-none focus:border-violet-500"
          >
            <option value="all">All Subjects</option>
            {subjects
              .filter((s) => !s.isArchived)
              .map((s) => (
                <option key={s.id} value={s.id}>
                  {s.code}
                </option>
              ))}
          </select>

          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, tag, content..."
              className="pl-8 pr-3 py-1.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-violet-500"
            />
          </div>
        </div>
      </div>

      {/* Tab 1: Notes */}
      {activeTab === 'notes' && (
        <div>
          {filteredNotes.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
              <FileText size={36} className="mx-auto text-violet-400 opacity-40" />
              <h3 className="text-base font-bold text-white">No notes found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Capture quick formulae, algorithm proofs, and textbook excerpts.
              </p>
              <button
                onClick={onOpenAddNote}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
              >
                Write First Note
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredNotes.map((n) => {
                const sub = subjects.find((s) => s.id === n.subjectId);

                return (
                  <div
                    key={n.id}
                    className={`p-5 rounded-2xl bg-[#0f1128] border transition-all flex flex-col justify-between space-y-3 relative shadow-xl ${
                      n.isPinned
                        ? 'border-violet-500/60 ring-1 ring-violet-500/30'
                        : 'border-violet-500/20 hover:border-violet-500/40'
                    }`}
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        {sub && (
                          <span
                            className="px-2.5 py-0.5 rounded text-xs font-bold font-mono text-white"
                            style={{ backgroundColor: sub.color || '#8b5cf6' }}
                          >
                            {sub.code}
                          </span>
                        )}
                        <button
                          onClick={() => togglePinNote(n.id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            n.isPinned
                              ? 'text-violet-400 bg-violet-600/20'
                              : 'text-slate-500 hover:text-slate-300'
                          }`}
                          title={n.isPinned ? 'Unpin Note' : 'Pin Note'}
                        >
                          <Pin size={14} className={n.isPinned ? 'fill-violet-400' : ''} />
                        </button>
                      </div>

                      <h3 className="text-base font-bold text-white">{n.title}</h3>

                      <div className="p-3 rounded-xl bg-[#090a16] border border-violet-500/10 text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                        {n.content}
                      </div>

                      {n.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {n.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-violet-950/40 text-violet-300 border border-violet-500/20 font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between text-xs text-slate-500">
                      <span>{new Date(n.updatedAt).toLocaleDateString()}</span>
                      <div className="flex items-center space-x-1">
                        {n.resourceUrl && (
                          <a
                            href={n.resourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-slate-400 hover:text-white"
                          >
                            <ExternalLink size={14} />
                          </a>
                        )}
                        <button
                          onClick={() => onOpenEditNote(n)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteNote(n.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
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
        </div>
      )}

      {/* Tab 2: Resources */}
      {activeTab === 'resources' && (
        <div>
          {filteredResources.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-[#0f1128] border border-dashed border-violet-500/20 space-y-3">
              <Globe size={36} className="mx-auto text-cyan-400 opacity-40" />
              <h3 className="text-base font-bold text-white">No resources found</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Bookmark textbooks, lecture slide decks, and previous year question paper portals.
              </p>
              <button
                onClick={onOpenAddResource}
                className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-xs font-semibold rounded-xl"
              >
                Save First Resource
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredResources.map((r) => {
                const sub = subjects.find((s) => s.id === r.subjectId);

                return (
                  <div
                    key={r.id}
                    className="p-5 rounded-2xl bg-[#0f1128] border border-violet-500/20 hover:border-violet-500/40 transition-all flex flex-col justify-between space-y-4 shadow-xl"
                  >
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        {sub && (
                          <span
                            className="px-2.5 py-0.5 rounded text-xs font-bold font-mono text-white"
                            style={{ backgroundColor: sub.color || '#8b5cf6' }}
                          >
                            {sub.code}
                          </span>
                        )}
                        <span className="text-xs font-mono text-cyan-400 px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30">
                          {r.resourceType}
                        </span>
                      </div>

                      <h3 className="text-base font-bold text-white">{r.title}</h3>

                      {r.description && (
                        <p className="text-xs text-slate-400 line-clamp-2">{r.description}</p>
                      )}

                      {r.tags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap pt-1">
                          {r.tags.map((t) => (
                            <span
                              key={t}
                              className="text-[10px] px-2 py-0.5 rounded-full bg-slate-900 text-slate-400 border border-slate-800 font-mono"
                            >
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="pt-3 border-t border-violet-900/30 flex items-center justify-between">
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1"
                      >
                        <span>Open Resource</span>
                        <ExternalLink size={12} />
                      </a>

                      <div className="flex items-center space-x-1">
                        <button
                          onClick={() => onOpenEditResource(r)}
                          className="p-1.5 text-slate-400 hover:text-white"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => deleteResource(r.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400"
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
        </div>
      )}
    </div>
  );
};
