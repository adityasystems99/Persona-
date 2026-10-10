import React, { useState, useEffect } from 'react';
import { X, Calendar, Clock, AlertTriangle, BookOpen, CheckSquare } from 'lucide-react';
import { AcademicTask, AcademicPriority } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AddEditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  task?: AcademicTask | null;
  defaultDate?: string;
  defaultSubjectId?: string;
}

export const AddEditTaskModal: React.FC<AddEditTaskModalProps> = ({
  isOpen,
  onClose,
  task,
  defaultDate,
  defaultSubjectId,
}) => {
  const { subjects, addTask, updateTask } = useAcademic();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [unitId, setUnitId] = useState('');
  const [topicId, setTopicId] = useState('');
  const [scheduledDate, setScheduledDate] = useState('');
  const [plannedDuration, setPlannedDuration] = useState(60);
  const [priority, setPriority] = useState<AcademicPriority>('Medium');
  const [notes, setNotes] = useState('');
  const [needsRevision, setNeedsRevision] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setSubjectId(task.subjectId);
      setUnitId(task.unitId || '');
      setTopicId(task.topicId || '');
      setScheduledDate(task.scheduledDate);
      setPlannedDuration(task.plannedDurationMinutes || 60);
      setPriority(task.priority);
      setNotes(task.notes || '');
      setNeedsRevision(task.needsRevision);
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
      setUnitId('');
      setTopicId('');
      setScheduledDate(defaultDate || getTodayDateStr());
      setPlannedDuration(60);
      setPriority('Medium');
      setNotes('');
      setNeedsRevision(true);
    }
  }, [task, defaultDate, defaultSubjectId, activeSubjects, isOpen]);

  // Selected subject units
  const currentSubject = subjects.find((s) => s.id === subjectId);
  const currentUnits = currentSubject?.units || [];
  const currentTopics = currentUnits.find((u) => u.id === unitId)?.topics || [];

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId) return;

    setIsSubmitting(true);
    try {
      if (task) {
        await updateTask(task.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          subjectId,
          unitId: unitId || undefined,
          topicId: topicId || undefined,
          scheduledDate,
          plannedDurationMinutes: Number(plannedDuration),
          priority,
          notes: notes.trim() || undefined,
          needsRevision,
        });
      } else {
        await addTask({
          title: title.trim(),
          description: description.trim() || undefined,
          subjectId,
          unitId: unitId || undefined,
          topicId: topicId || undefined,
          scheduledDate,
          plannedDurationMinutes: Number(plannedDuration),
          priority,
          status: 'pending',
          notes: notes.trim() || undefined,
          needsRevision,
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
              <CheckSquare size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {task ? 'Edit Academic Task' : 'Schedule Academic Task'}
              </h2>
              <p className="text-xs text-slate-400">
                Plan focused syllabus study, numericals, or prep session
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
              Task Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Solve DAA Dynamic Programming Recurrences"
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
                  setTopicId('');
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
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as AcademicPriority)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Urgent">Urgent 🔥</option>
              </select>
            </div>
          </div>

          {currentUnits.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Unit (Optional)
                </label>
                <select
                  value={unitId}
                  onChange={(e) => {
                    setUnitId(e.target.value);
                    setTopicId('');
                  }}
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                >
                  <option value="">-- None / General --</option>
                  {currentUnits.map((u) => (
                    <option key={u.id} value={u.id}>
                      Unit {u.unitNumber}: {u.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Topic (Optional)
                </label>
                <select
                  disabled={!unitId || currentTopics.length === 0}
                  value={topicId}
                  onChange={(e) => setTopicId(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm disabled:opacity-40"
                >
                  <option value="">-- None / All Unit --</option>
                  {currentTopics.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Scheduled Date *
              </label>
              <input
                type="date"
                required
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Planned Duration
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="15"
                  step="15"
                  value={plannedDuration}
                  onChange={(e) => setPlannedDuration(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm pr-12"
                />
                <span className="absolute right-3 top-2.5 text-xs text-slate-400">mins</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Task Notes / Sub-Goals
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Master Bellman-Ford and Floyd-Warshall proofs..."
              className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
            />
          </div>

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="needsRevision"
              checked={needsRevision}
              onChange={(e) => setNeedsRevision(e.target.checked)}
              className="w-4 h-4 rounded border-violet-500/40 text-violet-600 focus:ring-violet-500 bg-[#090a16]"
            />
            <label htmlFor="needsRevision" className="text-sm text-slate-300 select-none">
              Auto-queue for Spaced Repetition Revision upon completion
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
              disabled={isSubmitting || !title || !subjectId}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : task ? 'Update Task' : 'Add to Plan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
