import React, { useState, useEffect } from 'react';
import { X, FileText, Pin, Tag, Link } from 'lucide-react';
import { AcademicNote } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface AddEditNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  note?: AcademicNote | null;
  defaultSubjectId?: string;
}

export const AddEditNoteModal: React.FC<AddEditNoteModalProps> = ({
  isOpen,
  onClose,
  note,
  defaultSubjectId,
}) => {
  const { subjects, addNote, updateNote } = useAcademic();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [resourceUrl, setResourceUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setSubjectId(note.subjectId);
      setUnitId(note.unitId || '');
      setTagsInput(note.tags.join(', '));
      setResourceUrl(note.resourceUrl || '');
      setIsPinned(note.isPinned);
    } else {
      setTitle('');
      setContent('');
      setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
      setUnitId('');
      setTagsInput('');
      setResourceUrl('');
      setIsPinned(false);
    }
  }, [note, defaultSubjectId, activeSubjects, isOpen]);

  const currentSubject = subjects.find((s) => s.id === subjectId);
  const currentUnits = currentSubject?.units || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !content.trim()) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (note) {
        await updateNote(note.id, {
          title: title.trim(),
          content: content.trim(),
          subjectId,
          unitId: unitId || undefined,
          tags,
          resourceUrl: resourceUrl.trim() || undefined,
          isPinned,
        });
      } else {
        await addNote({
          title: title.trim(),
          content: content.trim(),
          subjectId,
          unitId: unitId || undefined,
          tags,
          resourceUrl: resourceUrl.trim() || undefined,
          isPinned,
        });
      }
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1128] border border-violet-500/20 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-violet-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <FileText size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {note ? 'Edit Academic Note' : 'Create Academic Note'}
              </h2>
              <p className="text-xs text-slate-400">
                Formula sheet, lecture summary, or key takeaways
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-violet-900/30 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Note Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Dijkstra vs Bellman-Ford Negative Cycle Proof"
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject *
              </label>
              <select
                required
                value={subjectId}
                onChange={(e) => {
                  setSubjectId(e.target.value);
                  setUnitId('');
                }}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                {activeSubjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </option>
                ))}
              </select>
            </div>

            {currentUnits.length > 0 ? (
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Unit (Optional)
                </label>
                <select
                  value={unitId}
                  onChange={(e) => setUnitId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                >
                  <option value="">-- General / All Units --</option>
                  {currentUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber}: {u.title}
                    </option>
                  ))}
                </select>
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Note Content *
            </label>
            <textarea
              required
              rows={6}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Write your study notes, key equations, concepts..."
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm font-mono text-xs leading-relaxed resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              placeholder="graphs, proofs, exam-favorite, algorithms"
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              External Reference URL (Optional)
            </label>
            <input
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="https://..."
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="isPinned"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
              className="w-4 h-4 rounded border-violet-500/40 text-violet-600 focus:ring-violet-500 bg-[#090a16]"
            />
            <label htmlFor="isPinned" className="text-sm text-slate-300 select-none flex items-center gap-1.5">
              <Pin size={14} className="text-violet-400" /> Pin this note to top of library
            </label>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-violet-900/30 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-violet-500/20 text-slate-300 hover:bg-violet-950/30 text-sm font-medium transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !title || !content || !subjectId}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : note ? 'Update Note' : 'Save Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
