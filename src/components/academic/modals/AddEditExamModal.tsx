import React, { useState, useEffect } from 'react';
import { X, Calendar, Flame, Target } from 'lucide-react';
import { AcademicExam, ExamType, ExamPrepStatus } from '../../../types/academic';
import { useAcademic, getTodayDateStr } from '../../../context/AcademicContext';

interface AddEditExamModalProps {
  isOpen: boolean;
  onClose: () => void;
  exam?: AcademicExam | null;
  defaultSubjectId?: string;
}

export const AddEditExamModal: React.FC<AddEditExamModalProps> = ({
  isOpen,
  onClose,
  exam,
  defaultSubjectId,
}) => {
  const { subjects, addExam, updateExam } = useAcademic();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examTime, setExamTime] = useState('10:00');
  const [examType, setExamType] = useState<ExamType>('Mid-Semester');
  const [syllabusCoverage, setSyllabusCoverage] = useState('');
  const [preparationStatus, setPreparationStatus] = useState<ExamPrepStatus>('Not Started');
  const [targetScore, setTargetScore] = useState(85);
  const [weightagePercentage, setWeightagePercentage] = useState(30);
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    if (exam) {
      setTitle(exam.title);
      setSubjectId(exam.subjectId);
      setExamDate(exam.examDate);
      setExamTime(exam.examTime || '10:00');
      setExamType(exam.examType);
      setSyllabusCoverage(exam.syllabusCoverage || '');
      setPreparationStatus(exam.preparationStatus);
      setTargetScore(exam.targetScore || 85);
      setWeightagePercentage(exam.weightagePercentage || 30);
      setNotes(exam.notes || '');
    } else {
      setTitle('');
      setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
      setExamDate(getTodayDateStr());
      setExamTime('10:00');
      setExamType('Mid-Semester');
      setSyllabusCoverage('');
      setPreparationStatus('Not Started');
      setTargetScore(85);
      setWeightagePercentage(30);
      setNotes('');
    }
  }, [exam, defaultSubjectId, activeSubjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !examDate) return;

    setIsSubmitting(true);
    try {
      if (exam) {
        await updateExam(exam.id, {
          title: title.trim(),
          subjectId,
          examDate,
          examTime,
          examType,
          syllabusCoverage: syllabusCoverage.trim() || undefined,
          preparationStatus,
          targetScore: Number(targetScore),
          weightagePercentage: Number(weightagePercentage),
          notes: notes.trim() || undefined,
        });
      } else {
        await addExam({
          title: title.trim(),
          subjectId,
          examDate,
          examTime,
          examType,
          syllabusCoverage: syllabusCoverage.trim() || undefined,
          preparationStatus,
          targetScore: Number(targetScore),
          weightagePercentage: Number(weightagePercentage),
          notes: notes.trim() || undefined,
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
              <Target size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {exam ? 'Edit Examination' : 'Schedule Examination'}
              </h2>
              <p className="text-xs text-slate-400">
                Track exam countdown, syllabus portions, and targets
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
              Exam Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mid-Sem Examination — Design and Analysis of Algorithms"
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
                Exam Type
              </label>
              <select
                value={examType}
                onChange={(e) => setExamType(e.target.value as ExamType)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                <option value="Mid-Semester">Mid-Semester</option>
                <option value="End-Semester">End-Semester</option>
                <option value="Quiz">Quiz</option>
                <option value="Lab Exam">Lab Exam</option>
                <option value="Class Test">Class Test</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Date *
              </label>
              <input
                type="date"
                required
                value={examDate}
                onChange={(e) => setExamDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Time (HH:MM)
              </label>
              <input
                type="time"
                value={examTime}
                onChange={(e) => setExamTime(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Preparation Status
              </label>
              <select
                value={preparationStatus}
                onChange={(e) => setPreparationStatus(e.target.value as ExamPrepStatus)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                <option value="Not Started">Not Started</option>
                <option value="In Progress">In Progress</option>
                <option value="Ready">Ready</option>
                <option value="Mastered">Mastered 🌟</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Target Score (%)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                value={targetScore}
                onChange={(e) => setTargetScore(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Syllabus Coverage / Units Included
            </label>
            <input
              type="text"
              value={syllabusCoverage}
              onChange={(e) => setSyllabusCoverage(e.target.value)}
              placeholder="e.g. Units 1, 2, and 3 (up to Dijkstra algorithm)"
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Preparation Notes / Hall Ticket / Venue
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Room 402, Scientific calculator permitted..."
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
              disabled={isSubmitting || !title || !subjectId || !examDate}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : exam ? 'Update Exam' : 'Schedule Exam'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
