import React, { useState } from 'react';
import { X, FolderPlus, Video, Link, Clock, BookOpen, Layers } from 'lucide-react';
import { PlaylistCategory } from '../../types/dsa';
import { parseTimeToSeconds } from '../../data/playlistData';

interface AddPlaylistModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultCategory?: PlaylistCategory;
  onAddPlaylist: (data: {
    category: PlaylistCategory;
    title: string;
    description?: string;
    topic?: string;
  }) => void;
}

const DSA_SUGGESTED_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers & Sliding Window',
  'Linked Lists',
  'Trees & BST',
  'Graphs',
  'Dynamic Programming',
  'Backtracking',
  'Heap & Priority Queue',
  'Binary Search',
  'Bit Manipulation',
];

export const AddPlaylistModal: React.FC<AddPlaylistModalProps> = ({
  isOpen,
  onClose,
  defaultCategory = 'dsa',
  onAddPlaylist,
}) => {
  const [category, setCategory] = useState<PlaylistCategory>(defaultCategory);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [topic, setTopic] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onAddPlaylist({
      category,
      title: title.trim(),
      description: description.trim() || undefined,
      topic: category === 'dsa' && topic.trim() ? topic.trim() : undefined,
    });

    setTitle('');
    setDescription('');
    setTopic('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-coral flex items-center justify-center text-white shadow-glow-coral">
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Create Study Playlist</h2>
              <p className="text-xs text-slate-500">Group your learning sequence with timestamps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Subject Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('dsa')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'dsa'
                    ? 'border-rose-500 bg-rose-50/70 text-rose-600 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                DSA Topicwise
              </button>
              <button
                type="button"
                onClick={() => setCategory('system-design')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'system-design'
                    ? 'border-purple-500 bg-purple-50/70 text-purple-600 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                System Design
              </button>
              <button
                type="button"
                onClick={() => setCategory('dbms')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'dbms'
                    ? 'border-blue-500 bg-blue-50/70 text-blue-600 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                DBMS
              </button>
              <button
                type="button"
                onClick={() => setCategory('cn-os')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'cn-os'
                    ? 'border-amber-500 bg-amber-50/70 text-amber-600 shadow-sm'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                CN & OS Prep
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dynamic Programming from Striver / NeetCode"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          {/* DSA Topic Selector (if DSA) */}
          {category === 'dsa' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                DSA Topic (Optional Tag)
              </label>
              <input
                type="text"
                list="dsa-topics-list"
                placeholder="e.g. Dynamic Programming, Trees, Graphs..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <datalist id="dsa-topics-list">
                {DSA_SUGGESTED_TOPICS.map((top) => (
                  <option key={top} value={top} />
                ))}
              </datalist>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Key concepts covered, course syllabus, target timeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-coral hover:opacity-95 shadow-glow-coral active:scale-95 transition-all"
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// ==============================================================================
// Modal to add a video into an existing playlist
// ==============================================================================

interface AddPlaylistItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistTitle: string;
  onAddVideo: (data: {
    title: string;
    videoUrl: string;
    topic?: string;
    durationSeconds: number;
    notes?: string;
  }) => void;
}

export const AddPlaylistItemModal: React.FC<AddPlaylistItemModalProps> = ({
  isOpen,
  onClose,
  playlistTitle,
  onAddVideo,
}) => {
  const [title, setTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [durationStr, setDurationStr] = useState('');
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) return;

    const seconds = parseTimeToSeconds(durationStr);

    onAddVideo({
      title: title.trim(),
      videoUrl: videoUrl.trim(),
      durationSeconds: seconds,
      notes: notes.trim() || undefined,
    });

    setTitle('');
    setVideoUrl('');
    setDurationStr('');
    setNotes('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-lg overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-coral flex items-center justify-center text-white shadow-glow-coral">
              <Video size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Add Video to Playlist</h2>
              <p className="text-xs text-slate-500 font-medium truncate max-w-xs">{playlistTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Video Title / Problem Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trapping Rainwater (Two Pointers Approach)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Video Link (YouTube, Loom, etc.) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <Link size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Total Duration (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 28:30 or 01:15:00"
                value={durationStr}
                onChange={(e) => setDurationStr(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
              />
              <Clock size={15} className="absolute left-3 top-3 text-slate-400" />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">Format: MM:SS or HH:MM:SS</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Initial Notes / Learning Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Things to focus on, approach to take notes on..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-coral hover:opacity-95 shadow-glow-coral active:scale-95 transition-all"
            >
              Add Video to Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
