import React, { useState, useEffect } from 'react';
import { X, FileText, Calendar, Link, Award } from 'lucide-react';
import { AcademicAssignment, AcademicPriority, AssignmentStatus } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AddEditAssignmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  assignment?: AcademicAssignment | null;
  defaultSubjectId?: string;
}

export const AddEditAssignmentModal: React.FC<AddEditAssignmentModalProps> = ({
  isOpen,
  onClose,
  assignment,
  defaultSubjectId,
}) => {
  const { subjects, addAssignment, updateAssignment } = useAcademic();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [assignedDate, setAssignedDate] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<AcademicPriority>('Medium');
  const [status, setStatus] = useState<AssignmentStatus>('pending');
  const [resourceUrl, setResourceUrl] = useState('');
  const [submissionNotes, setSubmissionNotes] = useState('');
  const [maxMarks, setMaxMarks] = useState<number | ''>(20);
  const [obtainedMarks, setObtainedMarks] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    if (assignment) {
      setTitle(assignment.title);
      setDescription(assignment.description || '');
      setSubjectId(assignment.subjectId);
      setAssignedDate(assignment.assignedDate || '');
      setDueDate(assignment.dueDate);
      setPriority(assignment.priority);
      setStatus(assignment.status);
      setResourceUrl(assignment.resourceUrl || '');
      setSubmissionNotes(assignment.submissionNotes || '');
      setMaxMarks(assignment.maxMarks ?? 20);
      setObtainedMarks(assignment.obtainedMarks ?? '');
    } else {
      setTitle('');
      setDescription('');
      setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
      setAssignedDate(getTodayDateStr());
      // Default 7 days from now
      const nextWeek = new Date();
      nextWeek.setDate(nextWeek.getDate() + 7);
      setDueDate(nextWeek.toISOString().split('T')[0]);
      setPriority('Medium');
      setStatus('pending');
      setResourceUrl('');
      setSubmissionNotes('');
      setMaxMarks(20);
      setObtainedMarks('');
    }
  }, [assignment, defaultSubjectId, activeSubjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !dueDate) return;

    setIsSubmitting(true);
    try {
      if (assignment) {
        await updateAssignment(assignment.id, {
          title: title.trim(),
          description: description.trim() || undefined,
          subjectId,
          assignedDate: assignedDate || undefined,
          dueDate,
          priority,
          status,
          resourceUrl: resourceUrl.trim() || undefined,
          submissionNotes: submissionNotes.trim() || undefined,
          maxMarks: maxMarks !== '' ? Number(maxMarks) : undefined,
          obtainedMarks: obtainedMarks !== '' ? Number(obtainedMarks) : undefined,
          completionTimestamp:
            (status === 'completed' || status === 'submitted') && !assignment.completionTimestamp
              ? new Date().toISOString()
              : assignment.completionTimestamp,
        });
      } else {
        await addAssignment({
          title: title.trim(),
          description: description.trim() || undefined,
          subjectId,
          assignedDate: assignedDate || undefined,
          dueDate,
          priority,
          status,
          resourceUrl: resourceUrl.trim() || undefined,
          submissionNotes: submissionNotes.trim() || undefined,
          maxMarks: maxMarks !== '' ? Number(maxMarks) : undefined,
          obtainedMarks: obtainedMarks !== '' ? Number(obtainedMarks) : undefined,
          completionTimestamp:
            status === 'completed' || status === 'submitted' ? new Date().toISOString() : undefined,
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
                {assignment ? 'Edit Assignment / Project' : 'New Academic Assignment'}
              </h2>
              <p className="text-xs text-slate-400">
                Track lab submissions, homework, and term deadlines
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
              Assignment Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Computer Networks Socket Programming Lab 2"
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
                onChange={(e) => setSubjectId(e.target.value)}
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
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AssignmentStatus)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="submitted">Submitted</option>
                <option value="graded">Graded</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Due Date *
              </label>
              <input
                type="date"
                required
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Max Marks
              </label>
              <input
                type="number"
                min="0"
                value={maxMarks}
                onChange={(e) => setMaxMarks(e.target.value === '' ? '' : Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Obtained Marks
              </label>
              <input
                type="number"
                min="0"
                value={obtainedMarks}
                onChange={(e) =>
                  setObtainedMarks(e.target.value === '' ? '' : Number(e.target.value))
                }
                placeholder="Leave blank if unassessed"
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Portal / Problem Sheet URL
            </label>
            <input
              type="url"
              value={resourceUrl}
              onChange={(e) => setResourceUrl(e.target.value)}
              placeholder="https://classroom.google.com/..."
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Submission Remarks / Description
            </label>
            <textarea
              rows={2}
              value={submissionNotes}
              onChange={(e) => setSubmissionNotes(e.target.value)}
              placeholder="Guidelines, code repository link, or professor instructions..."
              className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
            />
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
              disabled={isSubmitting || !title || !subjectId || !dueDate}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : assignment ? 'Update Assignment' : 'Add Assignment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
