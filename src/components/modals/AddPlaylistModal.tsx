import React, { useState } from 'react';
import { X, FolderPlus, Video, Link, Clock } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl shadow-glow-violet/30 border border-violet-500/30 w-full max-w-lg overflow-hidden animate-scale-up text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-500/10 bg-[#0c0e22]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center text-white shadow-glow-violet">
              <FolderPlus size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Create Orbital Playlist</h2>
              <p className="text-xs text-slate-400">Organize your learning sequence with timestamps</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-violet-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Category Selection */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Subject Category
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setCategory('dsa')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'dsa'
                    ? 'border-violet-500 bg-violet-950/40 text-violet-300 shadow-glow-violet/20'
                    : 'border-violet-500/20 bg-[#080918] text-slate-400 hover:text-white'
                }`}
              >
                DSA Topicwise
              </button>
              <button
                type="button"
                onClick={() => setCategory('system-design')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'system-design'
                    ? 'border-violet-500 bg-violet-950/40 text-violet-300 shadow-glow-violet/20'
                    : 'border-violet-500/20 bg-[#080918] text-slate-400 hover:text-white'
                }`}
              >
                System Design
              </button>
              <button
                type="button"
                onClick={() => setCategory('dbms')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'dbms'
                    ? 'border-violet-500 bg-violet-950/40 text-violet-300 shadow-glow-violet/20'
                    : 'border-violet-500/20 bg-[#080918] text-slate-400 hover:text-white'
                }`}
              >
                DBMS
              </button>
              <button
                type="button"
                onClick={() => setCategory('cn-os')}
                className={`flex items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all ${
                  category === 'cn-os'
                    ? 'border-violet-500 bg-violet-950/40 text-violet-300 shadow-glow-violet/20'
                    : 'border-violet-500/20 bg-[#080918] text-slate-400 hover:text-white'
                }`}
              >
                CN & OS Prep
              </button>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Playlist Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dynamic Programming from Striver / NeetCode"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
            />
          </div>

          {/* DSA Topic Selector (if DSA) */}
          {category === 'dsa' && (
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                DSA Topic (Optional Tag)
              </label>
              <input
                type="text"
                list="dsa-topics-list"
                placeholder="e.g. Dynamic Programming, Trees, Graphs..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
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
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Description / Notes
            </label>
            <textarea
              rows={2}
              placeholder="Key concepts covered, course syllabus, target timeline..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-violet-500/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-violet hover:opacity-95 shadow-glow-violet active:scale-95 transition-all"
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl shadow-glow-violet/30 border border-violet-500/30 w-full max-w-lg overflow-hidden animate-scale-up text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-500/10 bg-[#0c0e22]">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl gradient-violet flex items-center justify-center text-white shadow-glow-violet">
              <Video size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Add Video to Playlist</h2>
              <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{playlistTitle}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-violet-500/10 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Video Title / Problem Name *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Trapping Rainwater (Two Pointers Approach)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Video Link (YouTube, Loom, etc.) *
            </label>
            <div className="relative">
              <input
                type="url"
                required
                placeholder="https://www.youtube.com/watch?v=..."
                value={videoUrl}
                onChange={(e) => setVideoUrl(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
              />
              <Link size={15} className="absolute left-3 top-3 text-slate-500" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Total Duration (Optional)
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="e.g. 28:30 or 01:15:00"
                value={durationStr}
                onChange={(e) => setDurationStr(e.target.value)}
                className="w-full pl-9 pr-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-white placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all"
              />
              <Clock size={15} className="absolute left-3 top-3 text-slate-500" />
            </div>
            <p className="text-[11px] text-slate-500 mt-1">Format: MM:SS or HH:MM:SS</p>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              Initial Notes / Learning Objectives
            </label>
            <textarea
              rows={2}
              placeholder="Things to focus on, approach to take notes on..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-xl text-sm font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-violet-500/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-bold text-white gradient-violet hover:opacity-95 shadow-glow-violet active:scale-95 transition-all"
            >
              Add Video to Sequence
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
