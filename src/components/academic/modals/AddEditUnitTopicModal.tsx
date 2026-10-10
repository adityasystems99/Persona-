import React, { useState, useEffect } from 'react';
import { X, Layers, CheckCircle2, Clock } from 'lucide-react';
import { AcademicUnit, AcademicTopic } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface AddEditUnitTopicModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'unit' | 'topic';
  subjectId: string;
  unitId?: string;
  editingUnit?: AcademicUnit | null;
  editingTopic?: AcademicTopic | null;
}

export const AddEditUnitTopicModal: React.FC<AddEditUnitTopicModalProps> = ({
  isOpen,
  onClose,
  mode,
  subjectId,
  unitId,
  editingUnit,
  editingTopic,
}) => {
  const { addUnit, updateUnit, addTopic, updateTopic } = useAcademic();

  // Unit fields
  const [unitNumber, setUnitNumber] = useState(1);
  const [unitTitle, setUnitTitle] = useState('');
  const [unitDesc, setUnitDesc] = useState('');
  const [weightage, setWeightage] = useState(20);

  // Topic fields
  const [topicTitle, setTopicTitle] = useState('');
  const [topicDesc, setTopicDesc] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard'>('Medium');
  const [estimatedMinutes, setEstimatedMinutes] = useState(45);
  const [topicNotes, setTopicNotes] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (mode === 'unit') {
      if (editingUnit) {
        setUnitNumber(editingUnit.unitNumber);
        setUnitTitle(editingUnit.title);
        setUnitDesc(editingUnit.description || '');
        setWeightage(editingUnit.weightagePercentage || 20);
      } else {
        setUnitNumber(1);
        setUnitTitle('');
        setUnitDesc('');
        setWeightage(20);
      }
    } else {
      if (editingTopic) {
        setTopicTitle(editingTopic.title);
        setTopicDesc(editingTopic.description || '');
        setDifficulty(editingTopic.difficulty);
        setEstimatedMinutes(editingTopic.estimatedMinutes || 45);
        setTopicNotes(editingTopic.notes || '');
      } else {
        setTopicTitle('');
        setTopicDesc('');
        setDifficulty('Medium');
        setEstimatedMinutes(45);
        setTopicNotes('');
      }
    }
  }, [mode, editingUnit, editingTopic, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (mode === 'unit') {
        if (!unitTitle.trim()) return;
        if (editingUnit) {
          await updateUnit(editingUnit.id, {
            unitNumber: Number(unitNumber),
            title: unitTitle.trim(),
            description: unitDesc.trim() || undefined,
            weightagePercentage: Number(weightage),
          });
        } else {
          await addUnit(subjectId, {
            unitNumber: Number(unitNumber),
            title: unitTitle.trim(),
            description: unitDesc.trim() || undefined,
            weightagePercentage: Number(weightage),
            orderIndex: Number(unitNumber),
          });
        }
      } else {
        if (!topicTitle.trim() || !unitId) return;
        if (editingTopic) {
          await updateTopic(editingTopic.id, {
            title: topicTitle.trim(),
            description: topicDesc.trim() || undefined,
            difficulty,
            estimatedMinutes: Number(estimatedMinutes),
            notes: topicNotes.trim() || undefined,
          });
        } else {
          await addTopic(unitId, {
            title: topicTitle.trim(),
            description: topicDesc.trim() || undefined,
            difficulty,
            estimatedMinutes: Number(estimatedMinutes),
            notes: topicNotes.trim() || undefined,
            orderIndex: Date.now(),
          });
        }
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
      <div className="bg-[#0f1128] border border-violet-500/20 rounded-2xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-violet-900/40 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-400">
              <Layers size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {mode === 'unit'
                  ? editingUnit
                    ? 'Edit Unit / Module'
                    : 'Add Unit / Module'
                  : editingTopic
                  ? 'Edit Syllabus Topic'
                  : 'Add Syllabus Topic'}
              </h2>
              <p className="text-xs text-slate-400">
                {mode === 'unit' ? 'Group curriculum chapters' : 'Granular concept to master'}
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
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {mode === 'unit' ? (
            <>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Unit No.
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={unitNumber}
                    onChange={(e) => setUnitNumber(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Weightage (%)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={weightage}
                    onChange={(e) => setWeightage(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Unit Title *
                </label>
                <input
                  type="text"
                  required
                  value={unitTitle}
                  onChange={(e) => setUnitTitle(e.target.value)}
                  placeholder="e.g. Unit 1: Asymptotic Analysis & Recurrences"
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Overview / Scope
                </label>
                <textarea
                  rows={3}
                  value={unitDesc}
                  onChange={(e) => setUnitDesc(e.target.value)}
                  placeholder="Topics covered, university syllabus guidelines..."
                  className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Topic Title *
                </label>
                <input
                  type="text"
                  required
                  value={topicTitle}
                  onChange={(e) => setTopicTitle(e.target.value)}
                  placeholder="e.g. Master Theorem & Recursion Trees"
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Difficulty
                  </label>
                  <select
                    value={difficulty}
                    onChange={(e) => setDifficulty(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                    Est. Minutes
                  </label>
                  <input
                    type="number"
                    min="5"
                    step="5"
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Description / Subtopics
                </label>
                <input
                  type="text"
                  value={topicDesc}
                  onChange={(e) => setTopicDesc(e.target.value)}
                  placeholder="Case 1, Case 2, and extended Master theorem variations"
                  className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Study Notes / Formulae
                </label>
                <textarea
                  rows={2}
                  value={topicNotes}
                  onChange={(e) => setTopicNotes(e.target.value)}
                  placeholder="Key theorems, exam tips..."
                  className="w-full px-3.5 py-2 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm resize-none"
                />
              </div>
            </>
          )}

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
              disabled={isSubmitting || (mode === 'unit' ? !unitTitle : !topicTitle)}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting
                ? 'Saving...'
                : mode === 'unit'
                ? editingUnit
                  ? 'Update Unit'
                  : 'Add Unit'
                : editingTopic
                ? 'Update Topic'
                : 'Add Topic'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
