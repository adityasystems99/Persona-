import React, { useState } from 'react';
import {
  X,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bookmark,
  Plus,
  Trash2,
  RotateCcw,
  FastForward,
  Rewind,
  BookOpen,
  Sparkles,
} from 'lucide-react';
import { PlaylistItem } from '../../types/dsa';
import {
  formatSecondsToTime,
  parseTimeToSeconds,
  getYouTubeTimestampUrl,
  getYouTubeEmbedUrl,
} from '../../data/playlistData';

interface VideoTrackerModalProps {
  isOpen: boolean;
  onClose: () => void;
  playlistId: string;
  item: PlaylistItem;
  onUpdateTimestamp: (
    playlistId: string,
    itemId: string,
    watchedSeconds: number,
    markCompleted?: boolean
  ) => void;
  onAddBookmark: (
    playlistId: string,
    itemId: string,
    bookmark: {
      timestampSeconds: number;
      label: string;
      note?: string;
    }
  ) => void;
  onDeleteBookmark: (playlistId: string, itemId: string, bookmarkId: string) => void;
  onUpdateNotes: (playlistId: string, itemId: string, notes: string) => void;
}

export const VideoTrackerModal: React.FC<VideoTrackerModalProps> = ({
  isOpen,
  onClose,
  playlistId,
  item,
  onUpdateTimestamp,
  onAddBookmark,
  onDeleteBookmark,
  onUpdateNotes,
}) => {
  const [currentSeconds, setCurrentSeconds] = useState(item.watchedSeconds || 0);
  const [timeInputStr, setTimeInputStr] = useState(formatSecondsToTime(item.watchedSeconds || 0));
  const [isCompleted, setIsCompleted] = useState(item.isCompleted);
  const [notes, setNotes] = useState(item.notes || '');

  // Add bookmark form state
  const [isAddingBookmark, setIsAddingBookmark] = useState(false);
  const [bmTimeStr, setBmTimeStr] = useState(formatSecondsToTime(item.watchedSeconds || 0));
  const [bmLabel, setBmLabel] = useState('');
  const [bmNote, setBmNote] = useState('');

  if (!isOpen) return null;

  const embedUrl = getYouTubeEmbedUrl(item.videoUrl, currentSeconds);
  const externalTimestampUrl = getYouTubeTimestampUrl(item.videoUrl, currentSeconds);

  const duration = item.durationSeconds || 1;
  const progressPct = Math.min(100, Math.round((currentSeconds / duration) * 100));

  const handleApplyTimestamp = (newSec: number) => {
    const clamped = Math.max(0, item.durationSeconds > 0 ? Math.min(newSec, item.durationSeconds) : newSec);
    setCurrentSeconds(clamped);
    setTimeInputStr(formatSecondsToTime(clamped));
    const autoDone = item.durationSeconds > 0 && clamped >= item.durationSeconds;
    setIsCompleted(autoDone || isCompleted);
    onUpdateTimestamp(playlistId, item.id, clamped, autoDone || isCompleted);
  };

  const handleManualTimeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseTimeToSeconds(timeInputStr);
    handleApplyTimestamp(parsed);
  };

  const handleToggleComplete = () => {
    const nextCompleted = !isCompleted;
    setIsCompleted(nextCompleted);
    const nextSec = nextCompleted && item.durationSeconds > 0 ? item.durationSeconds : currentSeconds;
    setCurrentSeconds(nextSec);
    setTimeInputStr(formatSecondsToTime(nextSec));
    onUpdateTimestamp(playlistId, item.id, nextSec, nextCompleted);
  };

  const handleSaveNotes = () => {
    onUpdateNotes(playlistId, item.id, notes);
  };

  const handleCreateBookmark = (e: React.FormEvent) => {
    e.preventDefault();
    if (!bmLabel.trim()) return;

    const bmSeconds = parseTimeToSeconds(bmTimeStr);
    onAddBookmark(playlistId, item.id, {
      timestampSeconds: bmSeconds,
      label: bmLabel.trim(),
      note: bmNote.trim() || undefined,
    });

    setBmLabel('');
    setBmNote('');
    setIsAddingBookmark(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200/90 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white flex-shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-200/70 flex items-center justify-center font-extrabold text-xs">
              #{item.order}
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-slate-900 truncate">
                {item.title}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-500 font-medium">
                <span>Timestamp: <strong className="text-rose-600">{formatSecondsToTime(currentSeconds)}</strong></span>
                {item.durationSeconds > 0 && (
                  <>
                    <span>/</span>
                    <span>Total: {formatSecondsToTime(item.durationSeconds)}</span>
                  </>
                )}
                <span>•</span>
                <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-slate-500'}>
                  {isCompleted ? 'Completed' : `${progressPct}% watched`}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <a
              href={externalTimestampUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm"
              title="Open video externally at current timestamp"
            >
              <ExternalLink size={14} className="text-rose-500" />
              <span>Resume at {formatSecondsToTime(currentSeconds)}</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Video Player Embed (if YouTube) */}
          {embedUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-slate-950 shadow-md border border-slate-200/60">
              <iframe
                src={embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 text-center">
              <p className="text-sm font-semibold text-slate-700 mb-2">Direct Video Link</p>
              <a
                href={externalTimestampUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white bg-gradient-coral shadow-glow-coral"
              >
                <Play size={14} />
                <span>Open Video at {formatSecondsToTime(currentSeconds)}</span>
              </a>
            </div>
          )}

          {/* Progress Bar & Quick Timestamp Adjuster Controls */}
          <div className="bg-slate-50/80 rounded-2xl p-4 border border-slate-200/80 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-rose-500" />
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Live Watch Timestamp
                </span>
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center space-x-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds - 30)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1"
                >
                  <Rewind size={11} />
                  <span>-30s</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds - 15)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  -15s
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds + 15)}
                  className="px-2 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds + 30)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1"
                >
                  <FastForward size={11} />
                  <span>+30s</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(0)}
                  className="p-1.5 rounded-lg text-xs font-bold bg-white border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Reset to 00:00"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCompleted ? 'bg-emerald-500' : 'bg-gradient-coral'
                }`}
                style={{ width: `${item.durationSeconds > 0 ? progressPct : 100}%` }}
              />
            </div>

            {/* Direct Timestamp Input Form & Completion Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <form onSubmit={handleManualTimeSubmit} className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-500">Jump to:</span>
                <input
                  type="text"
                  value={timeInputStr}
                  onChange={(e) => setTimeInputStr(e.target.value)}
                  placeholder="MM:SS"
                  className="w-24 px-2.5 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-mono font-bold text-slate-900 text-center focus:outline-none focus:ring-2 focus:ring-rose-500/30"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-800 hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Set
                </button>
              </form>

              <button
                type="button"
                onClick={handleToggleComplete}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2
                  size={16}
                  className={isCompleted ? 'text-emerald-500 fill-emerald-100' : 'text-slate-400'}
                />
                <span>{isCompleted ? 'Completed Video' : 'Mark as Complete'}</span>
              </button>
            </div>
          </div>

          {/* Key Moments & Timestamp Bookmarks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bookmark size={16} className="text-purple-500" />
                <h3 className="text-sm font-extrabold text-slate-900">
                  Key Moments & Concept Timestamps
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 border border-purple-200/60">
                  {item.bookmarks.length}
                </span>
              </div>

              {!isAddingBookmark && (
                <button
                  type="button"
                  onClick={() => {
                    setBmTimeStr(formatSecondsToTime(currentSeconds));
                    setIsAddingBookmark(true);
                  }}
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold text-purple-600 bg-purple-50 border border-purple-200 hover:bg-purple-100 transition-colors"
                >
                  <Plus size={13} />
                  <span>Add Key Moment</span>
                </button>
              )}
            </div>

            {/* Add Bookmark Drawer */}
            {isAddingBookmark && (
              <form
                onSubmit={handleCreateBookmark}
                className="p-4 rounded-2xl bg-purple-50/50 border border-purple-200/80 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-purple-900">Bookmark Key Concept</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingBookmark(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Time (MM:SS)
                    </label>
                    <input
                      type="text"
                      required
                      value={bmTimeStr}
                      onChange={(e) => setBmTimeStr(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-mono font-bold text-slate-900 text-center"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-600 uppercase mb-1">
                      Label / Topic Highlight *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Edge case handling with negative sums"
                      value={bmLabel}
                      onChange={(e) => setBmLabel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-900"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Quick explanation or memory note (optional)..."
                    value={bmNote}
                    onChange={(e) => setBmNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-medium text-slate-900"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 shadow-sm transition-colors"
                  >
                    Save Timestamp Bookmark
                  </button>
                </div>
              </form>
            )}

            {/* List of Bookmarks */}
            {item.bookmarks && item.bookmarks.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {item.bookmarks.map((bm) => (
                  <div
                    key={bm.id}
                    className="group flex items-start justify-between p-3 rounded-xl bg-white border border-slate-200 hover:border-purple-300 hover:shadow-sm transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => handleApplyTimestamp(bm.timestampSeconds)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-purple-100 text-purple-700 group-hover:bg-purple-600 group-hover:text-white transition-colors">
                          {formatSecondsToTime(bm.timestampSeconds)}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{bm.label}</h4>
                      </div>
                      {bm.note && <p className="text-[11px] text-slate-500 line-clamp-2 pl-1">{bm.note}</p>}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBookmark(playlistId, item.id, bm.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-500 rounded transition-all ml-2"
                      title="Delete bookmark"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                No key moments bookmarked yet. Click "Add Key Moment" to pin important explanations or edge cases!
              </p>
            )}
          </div>

          {/* Video Notes & Observations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-slate-600" />
                <h3 className="text-sm font-extrabold text-slate-900">Personal Video Notes</h3>
              </div>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
              >
                Save Notes
              </button>
            </div>
            <textarea
              rows={3}
              placeholder="Record intuition, pattern formulation, time complexity, or mistakes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleSaveNotes}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-slate-100 bg-slate-50/60 flex-shrink-0">
          <div className="text-xs text-slate-500 font-medium">
            Saved watch time: <span className="font-bold text-slate-800">{formatSecondsToTime(currentSeconds)}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
