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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-[#04040a]/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#0f1128] rounded-3xl shadow-glow-violet/30 border border-violet-500/30 w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden animate-scale-up text-slate-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-violet-500/10 bg-[#0c0e22] flex-shrink-0">
          <div className="flex items-center space-x-3 overflow-hidden">
            <span className="flex-shrink-0 w-8 h-8 rounded-xl bg-violet-500/20 text-violet-300 border border-violet-500/30 flex items-center justify-center font-extrabold text-xs font-mono">
              #{item.order}
            </span>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-white truncate">
                {item.title}
              </h2>
              <div className="flex items-center space-x-2 text-xs text-slate-400 font-medium">
                <span>Timestamp: <strong className="text-violet-300 font-mono">{formatSecondsToTime(currentSeconds)}</strong></span>
                {item.durationSeconds > 0 && (
                  <>
                    <span>/</span>
                    <span className="font-mono">Total: {formatSecondsToTime(item.durationSeconds)}</span>
                  </>
                )}
                <span>•</span>
                <span className={isCompleted ? 'text-emerald-400 font-bold' : 'text-slate-400'}>
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
              className="hidden sm:inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-300 bg-[#080918] border border-violet-500/20 hover:text-white hover:border-violet-500/40 transition-all shadow-sm"
              title="Open video externally at current timestamp"
            >
              <ExternalLink size={14} className="text-violet-400" />
              <span>Resume at {formatSecondsToTime(currentSeconds)}</span>
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-violet-500/10 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          {/* Video Player Embed (if YouTube) */}
          {embedUrl ? (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-[#060712] shadow-md border border-violet-500/20">
              <iframe
                src={embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="p-6 rounded-2xl bg-[#080918] border border-violet-500/20 text-center">
              <p className="text-sm font-semibold text-white mb-2">Direct Video Link</p>
              <a
                href={externalTimestampUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95"
              >
                <Play size={14} />
                <span>Open Video at {formatSecondsToTime(currentSeconds)}</span>
              </a>
            </div>
          )}

          {/* Progress Bar & Quick Timestamp Adjuster Controls */}
          <div className="bg-[#080918] rounded-2xl p-4 border border-violet-500/20 space-y-3.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <Clock size={16} className="text-violet-400" />
                <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Live Watch Telemetry
                </span>
              </div>

              {/* Quick Stepper Buttons */}
              <div className="flex items-center space-x-1.5 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds - 30)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0e1028] border border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors flex items-center space-x-1"
                >
                  <Rewind size={11} />
                  <span>-30s</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds - 15)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0e1028] border border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
                >
                  -15s
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds + 15)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0e1028] border border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors"
                >
                  +15s
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(currentSeconds + 30)}
                  className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0e1028] border border-violet-500/20 text-slate-300 hover:text-white hover:border-violet-500/40 transition-colors flex items-center space-x-1"
                >
                  <FastForward size={11} />
                  <span>+30s</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyTimestamp(0)}
                  className="p-1.5 rounded-lg text-xs font-bold bg-[#0e1028] border border-violet-500/20 text-slate-400 hover:text-white hover:border-violet-500/40 transition-colors"
                  title="Reset to 00:00"
                >
                  <RotateCcw size={13} />
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-[#04040a] h-2.5 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 rounded-full ${
                  isCompleted ? 'bg-emerald-400' : 'gradient-violet'
                }`}
                style={{ width: `${item.durationSeconds > 0 ? progressPct : 100}%` }}
              />
            </div>

            {/* Direct Timestamp Input Form & Completion Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
              <form onSubmit={handleManualTimeSubmit} className="flex items-center space-x-2">
                <span className="text-xs font-semibold text-slate-400">Jump to:</span>
                <input
                  type="text"
                  value={timeInputStr}
                  onChange={(e) => setTimeInputStr(e.target.value)}
                  placeholder="MM:SS"
                  className="w-24 px-2.5 py-1.5 bg-[#0e1028] border border-violet-500/20 rounded-xl text-xs font-mono font-bold text-white text-center focus:outline-none focus:border-violet-400"
                />
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 transition-colors shadow-sm"
                >
                  Set
                </button>
              </form>

              <button
                type="button"
                onClick={handleToggleComplete}
                className={`flex items-center space-x-2 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all border shadow-sm ${
                  isCompleted
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
                    : 'bg-[#0e1028] text-slate-300 border-violet-500/20 hover:text-white'
                }`}
              >
                <CheckCircle2
                  size={16}
                  className={isCompleted ? 'text-emerald-400' : 'text-slate-500'}
                />
                <span>{isCompleted ? 'Completed Module' : 'Mark as Complete'}</span>
              </button>
            </div>
          </div>

          {/* Key Moments & Timestamp Bookmarks */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Bookmark size={16} className="text-violet-400" />
                <h3 className="text-sm font-extrabold text-white">
                  Key Moments & Concept Bookmarks
                </h3>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 border border-violet-500/30">
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
                  className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-xl text-xs font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 hover:bg-violet-500/30 transition-colors"
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
                className="p-4 rounded-2xl bg-[#080918] border border-violet-500/20 space-y-3 animate-fade-in"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">Bookmark Concept Moment</span>
                  <button
                    type="button"
                    onClick={() => setIsAddingBookmark(false)}
                    className="text-slate-400 hover:text-white text-xs"
                  >
                    Cancel
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                  <div className="sm:col-span-1">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Time (MM:SS)
                    </label>
                    <input
                      type="text"
                      required
                      value={bmTimeStr}
                      onChange={(e) => setBmTimeStr(e.target.value)}
                      className="w-full px-2.5 py-1.5 bg-[#0e1028] border border-violet-500/20 rounded-xl text-xs font-mono font-bold text-white text-center"
                    />
                  </div>
                  <div className="sm:col-span-3">
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">
                      Label / Highlight *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Edge case handling with negative sums"
                      value={bmLabel}
                      onChange={(e) => setBmLabel(e.target.value)}
                      className="w-full px-3 py-1.5 bg-[#0e1028] border border-violet-500/20 rounded-xl text-xs font-medium text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="Quick explanation or memory note (optional)..."
                    value={bmNote}
                    onChange={(e) => setBmNote(e.target.value)}
                    className="w-full px-3 py-1.5 bg-[#0e1028] border border-violet-500/20 rounded-xl text-xs font-medium text-slate-200 placeholder-slate-500"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95 transition-all"
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
                    className="group flex items-start justify-between p-3 rounded-xl bg-[#080918] border border-violet-500/20 hover:border-violet-500/40 transition-all"
                  >
                    <button
                      type="button"
                      onClick={() => handleApplyTimestamp(bm.timestampSeconds)}
                      className="flex-1 text-left"
                    >
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-lg bg-violet-500/20 text-violet-300 border border-violet-500/30 group-hover:bg-violet-600 group-hover:text-white transition-colors">
                          {formatSecondsToTime(bm.timestampSeconds)}
                        </span>
                        <h4 className="text-xs font-bold text-white line-clamp-1">{bm.label}</h4>
                      </div>
                      {bm.note && <p className="text-[11px] text-slate-400 line-clamp-2 pl-1">{bm.note}</p>}
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteBookmark(playlistId, item.id, bm.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 rounded transition-all ml-2"
                      title="Delete bookmark"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic p-3 text-center bg-[#080918] rounded-xl border border-dashed border-violet-500/20">
                No key moments bookmarked yet. Click "Add Key Moment" to pin important explanations or edge cases!
              </p>
            )}
          </div>

          {/* Video Notes & Observations */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BookOpen size={16} className="text-violet-400" />
                <h3 className="text-sm font-extrabold text-white">Personal Telemetry Notes</h3>
              </div>
              <button
                type="button"
                onClick={handleSaveNotes}
                className="px-3 py-1 rounded-xl text-xs font-bold text-violet-300 bg-violet-500/20 hover:bg-violet-500/30 transition-colors"
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
              className="w-full px-3.5 py-2.5 bg-[#080918] border border-violet-500/20 rounded-2xl text-xs font-medium text-slate-200 placeholder-slate-500 focus:outline-none focus:border-violet-400 focus:ring-1 focus:ring-violet-400 transition-all resize-none"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-violet-500/10 bg-[#0c0e22] flex-shrink-0">
          <div className="text-xs text-slate-400 font-medium">
            Saved watch time: <span className="font-bold text-violet-300 font-mono">{formatSecondsToTime(currentSeconds)}</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95 transition-all"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
