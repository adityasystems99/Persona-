import React, { useState, useEffect } from 'react';
import { X, Bookmark, Globe, Tag } from 'lucide-react';
import { AcademicResource, ResourceType } from '../../../types/academic';
import { useAcademic } from '../../../context/AcademicContext';

interface AddEditResourceModalProps {
  isOpen: boolean;
  onClose: () => void;
  resource?: AcademicResource | null;
  defaultSubjectId?: string;
}

const RESOURCE_TYPES: ResourceType[] = [
  'Book / Textbook',
  'Lecture Slides',
  'Video Lecture',
  'PYQ / Papers',
  'Cheat Sheet',
  'Website',
];

export const AddEditResourceModal: React.FC<AddEditResourceModalProps> = ({
  isOpen,
  onClose,
  resource,
  defaultSubjectId,
}) => {
  const { subjects, addResource, updateResource } = useAcademic();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [resourceType, setResourceType] = useState<ResourceType>('Book / Textbook');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const activeSubjects = subjects.filter((s) => !s.isArchived);

  useEffect(() => {
    if (resource) {
      setTitle(resource.title);
      setSubjectId(resource.subjectId);
      setResourceType(resource.resourceType);
      setUrl(resource.url);
      setDescription(resource.description || '');
      setTagsInput(resource.tags.join(', '));
    } else {
      setTitle('');
      setSubjectId(defaultSubjectId || activeSubjects[0]?.id || '');
      setResourceType('Lecture Slides');
      setUrl('');
      setDescription('');
      setTagsInput('');
    }
  }, [resource, defaultSubjectId, activeSubjects, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !subjectId || !url.trim()) return;

    setIsSubmitting(true);
    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (resource) {
        await updateResource(resource.id, {
          title: title.trim(),
          subjectId,
          resourceType,
          url: url.trim(),
          description: description.trim() || undefined,
          tags,
        });
      } else {
        await addResource({
          title: title.trim(),
          subjectId,
          resourceType,
          url: url.trim(),
          description: description.trim() || undefined,
          tags,
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
              <Bookmark size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {resource ? 'Edit Study Resource' : 'Save Study Resource'}
              </h2>
              <p className="text-xs text-slate-400">
                Textbooks, reference slides, PYQs, and lecture repositories
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
              Resource Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Kurose & Ross Computer Networks 7th Edition PDF"
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
                Type
              </label>
              <select
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value as ResourceType)}
                className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white focus:outline-none focus:border-violet-500 text-sm"
              >
                {RESOURCE_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Resource Link / URL *
            </label>
            <input
              type="url"
              required
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://drive.google.com/... or https://..."
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Chapter Coverage
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Chapters 1-5 for Transport Layer & Network Layer"
              className="w-full px-3.5 py-2.5 bg-[#090a16] border border-violet-500/20 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-violet-500 text-sm"
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
              placeholder="official, textbook, midsem-pyq"
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
              disabled={isSubmitting || !title || !url || !subjectId}
              className="px-5 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold shadow-glow-violet disabled:opacity-50 transition-all"
            >
              {isSubmitting ? 'Saving...' : resource ? 'Update Resource' : 'Save Resource'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
