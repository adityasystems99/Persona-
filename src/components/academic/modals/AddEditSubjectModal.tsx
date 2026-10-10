import React, { useState, useEffect } from 'react';
import { X, BookOpen, Sparkles } from 'lucide-react';
import { AcademicSubject } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface AddEditSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subject?: AcademicSubject | null;
}

const COLOR_OPTIONS = [
  { label: 'Violet', value: '#8b5cf6' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Emerald', value: '#10b981' },
  { label: 'Amber', value: '#f59e0b' },
  { label: 'Pink', value: '#ec4899' },
  { label: 'Blue', value: '#3b82f6' },
  { label: 'Rose', value: '#f43f5e' },
  { label: 'Indigo', value: '#6366f1' },
];

export const AddEditSubjectModal: React.FC<AddEditSubjectModalProps> = ({
  isOpen,
  onClose,
  subject,
}) => {
  const { addSubject, updateSubject, semesters } = useAcademic();

  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [credits, setCredits] = useState(4);
  const [color, setColor] = useState('#8b5cf6');
  const [examDate, setExamDate] = useState('');
  const [targetScore, setTargetScore] = useState(85);
  const [description, setDescription] = useState('');
  const [syllabusUrl, setSyllabusUrl] = useState('');
  const [semesterId, setSemesterId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (subject) {
      setCode(subject.code);
      setName(subject.name);
      setCredits(subject.credits);
      setColor(subject.color || '#8b5cf6');
      setExamDate(subject.examDate || '');
      setTargetScore(subject.targetScore || 85);
      setDescription(subject.description || '');
      setSyllabusUrl(subject.syllabusUrl || '');
      setSemesterId(subject.semesterId);
    } else {
      setCode('');
      setName('');
      setCredits(4);
      setColor('#8b5cf6');
      setExamDate('');
      setTargetScore(85);
      setDescription('');
      setSyllabusUrl('');
      setSemesterId(semesters[0]?.id || 'sem_5');
    }
  }, [subject, semesters, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim() || !name.trim()) return;

    setIsSubmitting(true);
    try {
      if (subject) {
        await updateSubject(subject.id, {
          code: code.trim().toUpperCase(),
          name: name.trim(),
          credits: Number(credits),
          color,
          examDate: examDate || undefined,
          targetScore: Number(targetScore),
          description: description.trim() || undefined,
          syllabusUrl: syllabusUrl.trim() || undefined,
          semesterId: semesterId || 'sem_5',
        });
      } else {
        await addSubject({
          semesterId: semesterId || 'sem_5',
          code: code.trim().toUpperCase(),
          name: name.trim(),
          credits: Number(credits),
          color,
          examDate: examDate || undefined,
          targetScore: Number(targetScore),
          description: description.trim() || undefined,
          syllabusUrl: syllabusUrl.trim() || undefined,
          isArchived: false,
          orderIndex: Date.now(),
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
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center text-white"
              style={{ backgroundColor: color }}
            >
              <BookOpen size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                {subject ? 'Edit Academic Subject' : 'Add New Subject'}
                <Sparkles size={16} className="text-violet-400" />
              </h2>
              <p className="text-xs text-slate-400">
                {subject ? 'Update curriculum specs and exam targets' : 'Configure 5th semester course'}
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Code *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="e.g. DAA"
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm font-mono uppercase"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Subject Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Design and Analysis of Algorithms"
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Credits
              </label>
              <input
                type="number"
                min="1"
                max="10"
                value={credits}
                onChange={(e) => setCredits(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              />
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
              Accent Color
            </label>
            <div className="flex items-center gap-2 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c.value}
                  onClick={() => setColor(c.value)}
                  className={`w-8 h-8 rounded-full border-2 transition-transform ${
                    color === c.value ? 'scale-110 border-white ring-2 ring-violet-500/50' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.label}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Target Final Exam Date
            </label>
            <input
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Objectives
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Key focus areas, professor remarks, or syllabus guidelines..."
              className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Syllabus PDF / Portal URL
            </label>
            <input
              type="url"
              value={syllabusUrl}
              onChange={(e) => setSyllabusUrl(e.target.value)}
              placeholder="https://..."
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
              disabled={isSubmitting || !code || !name}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isSubmitting ? 'Saving...' : subject ? 'Update Subject' : 'Create Subject'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
