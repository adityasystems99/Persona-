import React, { useState, useEffect } from 'react';
import { X, CheckCircle, XCircle, Clock, Calendar, BookOpen } from 'lucide-react';
import { AttendanceStatus, ClassType } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface LogAttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: string;
}

export const LogAttendanceModal: React.FC<LogAttendanceModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId,
}) => {
  const { subjects, logAttendance } = useAcademic();

  const [subjectId, setSubjectId] = useState('');
  const [classDate, setClassDate] = useState('');
  const [classType, setClassType] = useState<ClassType>('Lecture');
  const [status, setStatus] = useState<AttendanceStatus>('present');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
    setClassDate(getTodayDateStr());
    setClassType('Lecture');
    setStatus('present');
    setNotes('');
  }, [defaultSubjectId, activeSubjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectId || !classDate) return;

    setIsSubmitting(true);
    try {
      await logAttendance({
        subjectId,
        classDate,
        classType,
        status,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#0f1128] border border-violet-500/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-violet-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Calendar size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Log Class Attendance</h2>
              <p className="text-xs text-slate-400">Record attendance for today or past class</p>
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
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

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Date *
              </label>
              <input
                type="date"
                required
                value={classDate}
                onChange={(e) => setClassDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Class Type
              </label>
              <select
                value={classType}
                onChange={(e) => setClassType(e.target.value as ClassType)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                <option value="Lecture">Lecture</option>
                <option value="Lab">Lab Session</option>
                <option value="Tutorial">Tutorial</option>
              </select>
            </div>
          </div>

          {/* Status Selection Cards */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Status *
            </label>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                type="button"
                onClick={() => setStatus('present')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  status === 'present'
                    ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300 ring-2 ring-emerald-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-xs font-bold">Present</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('absent')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  status === 'absent'
                    ? 'bg-rose-500/20 border-rose-500 text-rose-300 ring-2 ring-rose-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <XCircle size={18} className="text-rose-400" />
                <span className="text-xs font-bold">Absent</span>
              </button>

              <button
                type="button"
                onClick={() => setStatus('excused')}
                className={`py-3 px-2 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all ${
                  status === 'excused'
                    ? 'bg-amber-500/20 border-amber-500 text-amber-300 ring-2 ring-amber-500/30'
                    : 'bg-[#090a16] border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Clock size={18} className="text-amber-400" />
                <span className="text-xs font-bold">Excused / OD</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Notes (Optional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Substitute professor, quiz conducted, on-duty approval"
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
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
              disabled={isSubmitting || !subjectId || !classDate}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Recording...' : 'Log Attendance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
