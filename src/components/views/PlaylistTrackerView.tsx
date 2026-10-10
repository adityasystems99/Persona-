import React, { useState, useMemo } from 'react';
import {
  Video,
  Plus,
  Play,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  Trash2,
  Bookmark,
  Layers,
  Database,
  Cpu,
  Code2,
  Search,
  Filter,
  Sparkles,
  BarChart2,
  FolderOpen,
} from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { PlaylistCategory, Playlist, PlaylistItem } from '../../types/dsa';
import { formatSecondsToTime, getYouTubeTimestampUrl } from '../../data/playlistData';
import { AddPlaylistModal, AddPlaylistItemModal } from '../modals/AddPlaylistModal';
import { VideoTrackerModal } from '../modals/VideoTrackerModal';

export const PlaylistTrackerView: React.FC = () => {
  const {
    playlists,
    activePlaylistCategory,
    setActivePlaylistCategory,
    addPlaylist,
    deletePlaylist,
    reorderPlaylists,
    addPlaylistItem,
    deletePlaylistItem,
    reorderPlaylistItems,
    updateWatchTimestamp,
    addTimestampBookmark,
    deleteTimestampBookmark,
  } = useDSA();

  // Modals state
  const [isAddPlaylistOpen, setIsAddPlaylistOpen] = useState(false);
  const [activePlaylistForNewVideo, setActivePlaylistForNewVideo] = useState<Playlist | null>(null);
  const [activeTrackingVideo, setActiveTrackingVideo] = useState<{
    playlistId: string;
    item: PlaylistItem;
  } | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDsaTopic, setSelectedDsaTopic] = useState<string>('all');

  // Filter playlists by active category
  const categoryPlaylists = useMemo(() => {
    return playlists
      .filter((p) => p.category === activePlaylistCategory)
      .sort((a, b) => a.order - b.order);
  }, [playlists, activePlaylistCategory]);

  // Distinct DSA topics present in playlists
  const dsaTopics = useMemo(() => {
    const set = new Set<string>();
    playlists
      .filter((p) => p.category === 'dsa')
      .forEach((p) => {
        if (p.topic) set.add(p.topic);
        p.items.forEach((it) => {
          if (it.topic) set.add(it.topic);
        });
      });
    return Array.from(set);
  }, [playlists]);

  // Filtered by search and DSA topic
  const filteredPlaylists = useMemo(() => {
    return categoryPlaylists.filter((pl) => {
      // Topic filter for DSA
      if (
        activePlaylistCategory === 'dsa' &&
        selectedDsaTopic !== 'all' &&
        pl.topic !== selectedDsaTopic &&
        !pl.items.some((it) => it.topic === selectedDsaTopic)
      ) {
        return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesPl =
          pl.title.toLowerCase().includes(q) || (pl.description && pl.description.toLowerCase().includes(q));
        const matchesItem = pl.items.some((it) => it.title.toLowerCase().includes(q));
        return matchesPl || matchesItem;
      }

      return true;
    });
  }, [categoryPlaylists, activePlaylistCategory, selectedDsaTopic, searchQuery]);

  // Overall Statistics for active category
  const stats = useMemo(() => {
    let totalVideos = 0;
    let completedVideos = 0;
    let totalWatchedSec = 0;
    let totalDurationSec = 0;

    categoryPlaylists.forEach((pl) => {
      pl.items.forEach((it) => {
        totalVideos++;
        if (it.isCompleted) completedVideos++;
        totalWatchedSec += it.watchedSeconds || 0;
        totalDurationSec += it.durationSeconds || 0;
      });
    });

    const completionRate = totalVideos > 0 ? Math.round((completedVideos / totalVideos) * 100) : 0;
    const watchedHours = (totalWatchedSec / 3600).toFixed(1);

    return {
      playlistCount: categoryPlaylists.length,
      totalVideos,
      completedVideos,
      completionRate,
      watchedHours,
    };
  }, [categoryPlaylists]);

  // Handle note updates from modal
  const handleUpdateNotes = (playlistId: string, itemId: string, notes: string) => {
    // Already synced through local items update
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* View Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-2 rounded-xl bg-gradient-coral text-white shadow-glow-coral">
              <Video size={20} />
            </span>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              Sequential Playlist & Timestamp Tracker
            </h1>
          </div>
          <p className="text-sm text-slate-500 font-medium mt-1">
            Track video lectures in your exact custom sequence with live watch timestamps and concept bookmarks.
          </p>
        </div>

        <button
          onClick={() => setIsAddPlaylistOpen(true)}
          className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-coral hover:opacity-95 shadow-glow-coral active:scale-95 transition-all self-start md:self-auto"
        >
          <Plus size={16} />
          <span>New Playlist</span>
        </button>
      </div>

      {/* Category Navigation Bar */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          onClick={() => {
            setActivePlaylistCategory('dsa');
            setSelectedDsaTopic('all');
          }}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activePlaylistCategory === 'dsa'
              ? 'bg-rose-500 text-white shadow-glow-coral'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Code2 size={16} />
          <span>DSA Topicwise Prep</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activePlaylistCategory === 'dsa' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {playlists.filter((p) => p.category === 'dsa').length}
          </span>
        </button>

        <button
          onClick={() => setActivePlaylistCategory('system-design')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activePlaylistCategory === 'system-design'
              ? 'bg-purple-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Layers size={16} />
          <span>System Design</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activePlaylistCategory === 'system-design'
                ? 'bg-white/20 text-white'
                : 'bg-slate-100 text-slate-500'
            }`}
          >
            {playlists.filter((p) => p.category === 'system-design').length}
          </span>
        </button>

        <button
          onClick={() => setActivePlaylistCategory('dbms')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activePlaylistCategory === 'dbms'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Database size={16} />
          <span>Database Management (DBMS)</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activePlaylistCategory === 'dbms' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {playlists.filter((p) => p.category === 'dbms').length}
          </span>
        </button>

        <button
          onClick={() => setActivePlaylistCategory('cn-os')}
          className={`flex items-center space-x-2 px-4 py-2.5 rounded-2xl text-xs font-extrabold transition-all whitespace-nowrap ${
            activePlaylistCategory === 'cn-os'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
          }`}
        >
          <Cpu size={16} />
          <span>CN & OS Prep</span>
          <span
            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activePlaylistCategory === 'cn-os' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}
          >
            {playlists.filter((p) => p.category === 'cn-os').length}
          </span>
        </button>
      </div>

      {/* Summary KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Playlists</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">{stats.playlistCount}</p>
          <p className="text-[11px] text-slate-500 mt-1">In this track</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Videos Tracked</p>
          <p className="text-xl font-extrabold text-slate-900 mt-0.5">
            {stats.completedVideos} / {stats.totalVideos}
          </p>
          <p className="text-[11px] text-emerald-600 font-semibold mt-1">{stats.completionRate}% finished</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Hours Watched</p>
          <p className="text-xl font-extrabold text-rose-600 mt-0.5">{stats.watchedHours} hrs</p>
          <p className="text-[11px] text-slate-500 mt-1">Saved timestamps</p>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-soft">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Sequence Mode</p>
          <p className="text-sm font-extrabold text-slate-800 mt-1 flex items-center space-x-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Custom Ordered</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">Decided by you</p>
        </div>
      </div>

      {/* DSA Topic Filter Bar (Only if DSA category) */}
      {activePlaylistCategory === 'dsa' && dsaTopics.length > 0 && (
        <div className="flex items-center space-x-2 overflow-x-auto pb-1">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-wider pl-1">Topic:</span>
          <button
            onClick={() => setSelectedDsaTopic('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedDsaTopic === 'all'
                ? 'bg-slate-900 text-white shadow-sm'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}
          >
            All Topics
          </button>
          {dsaTopics.map((top) => (
            <button
              key={top}
              onClick={() => setSelectedDsaTopic(top)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedDsaTopic === top
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {top}
            </button>
          ))}
        </div>
      )}

      {/* Search Input */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search playlists, lectures, or topics..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-xs font-medium text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all shadow-soft"
        />
        <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
      </div>

      {/* Playlists List */}
      {filteredPlaylists.length > 0 ? (
        <div className="space-y-6">
          {filteredPlaylists.map((pl, pIndex) => {
            const completedCount = pl.items.filter((it) => it.isCompleted).length;
            const progress = pl.items.length > 0 ? Math.round((completedCount / pl.items.length) * 100) : 0;
            const totalSec = pl.items.reduce((s, it) => s + (it.durationSeconds || 0), 0);

            return (
              <div
                key={pl.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden transition-all hover:border-slate-300"
              >
                {/* Playlist Card Header */}
                <div className="p-5 sm:p-6 border-b border-slate-100 bg-gradient-to-r from-slate-50/70 to-white">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-start space-x-3">
                      {/* Sequential Order Steppers for Playlist */}
                      <div className="flex flex-col items-center bg-white border border-slate-200 rounded-xl p-0.5 shadow-sm">
                        <button
                          onClick={() => reorderPlaylists(pl.id, 'up')}
                          disabled={pIndex === 0}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Move playlist up in sequence"
                        >
                          <ChevronUp size={14} />
                        </button>
                        <span className="text-[10px] font-extrabold text-slate-800 px-1">
                          #{pl.order}
                        </span>
                        <button
                          onClick={() => reorderPlaylists(pl.id, 'down')}
                          disabled={pIndex === categoryPlaylists.length - 1}
                          className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                          title="Move playlist down in sequence"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      <div>
                        <div className="flex items-center space-x-2 flex-wrap gap-y-1">
                          <h2 className="text-base font-extrabold text-slate-900">{pl.title}</h2>
                          {pl.topic && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
                              {pl.topic}
                            </span>
                          )}
                        </div>
                        {pl.description && (
                          <p className="text-xs text-slate-500 font-medium mt-1">{pl.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Right Playlist Metrics & Actions */}
                    <div className="flex items-center space-x-3 self-end sm:self-auto">
                      <div className="text-right">
                        <span className="text-xs font-bold text-slate-800">
                          {completedCount} / {pl.items.length} Done
                        </span>
                        <span className="text-xs text-slate-400 ml-1.5 font-medium">
                          ({formatSecondsToTime(totalSec)})
                        </span>
                        <div className="w-28 bg-slate-100 h-2 rounded-full mt-1 overflow-hidden">
                          <div
                            className="bg-gradient-coral h-full rounded-full transition-all"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      <button
                        onClick={() => setActivePlaylistForNewVideo(pl)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
                      >
                        <Plus size={13} />
                        <span>Add Video</span>
                      </button>

                      <button
                        onClick={() => deletePlaylist(pl.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
                        title="Delete playlist"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Sequential Videos Table / List */}
                <div className="divide-y divide-slate-100">
                  {pl.items && pl.items.length > 0 ? (
                    pl.items
                      .sort((a, b) => a.order - b.order)
                      .map((item, vIndex) => {
                        const isDone = item.isCompleted;
                        const itemProgress =
                          item.durationSeconds > 0
                            ? Math.min(100, Math.round((item.watchedSeconds / item.durationSeconds) * 100))
                            : 0;
                        const resumeUrl = getYouTubeTimestampUrl(item.videoUrl, item.watchedSeconds);

                        return (
                          <div
                            key={item.id}
                            className={`p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-3.5 transition-colors ${
                              isDone ? 'bg-slate-50/50' : 'hover:bg-slate-50/60'
                            }`}
                          >
                            {/* Left: Sequence Controls + Title + Badges */}
                            <div className="flex items-start space-x-3 min-w-0">
                              {/* Reorder Up/Down in sequence */}
                              <div className="flex items-center space-x-0.5 pt-0.5">
                                <button
                                  onClick={() => reorderPlaylistItems(pl.id, item.id, 'up')}
                                  disabled={vIndex === 0}
                                  className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors"
                                  title="Move video earlier in sequence"
                                >
                                  <ChevronUp size={14} />
                                </button>
                                <span className="w-6 text-center text-xs font-extrabold font-mono text-slate-500">
                                  {item.order}
                                </span>
                                <button
                                  onClick={() => reorderPlaylistItems(pl.id, item.id, 'down')}
                                  disabled={vIndex === pl.items.length - 1}
                                  className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-20 transition-colors"
                                  title="Move video later in sequence"
                                >
                                  <ChevronDown size={14} />
                                </button>
                              </div>

                              {/* Completed Checkbox */}
                              <button
                                onClick={() =>
                                  updateWatchTimestamp(pl.id, item.id, item.watchedSeconds, !item.isCompleted)
                                }
                                className="pt-0.5 text-slate-400 hover:text-emerald-600 transition-colors"
                                title={isDone ? 'Mark as incomplete' : 'Mark as complete'}
                              >
                                <CheckCircle2
                                  size={19}
                                  className={
                                    isDone
                                      ? 'text-emerald-500 fill-emerald-100'
                                      : 'text-slate-300 hover:text-slate-500'
                                  }
                                />
                              </button>

                              {/* Title & Timestamp Details */}
                              <div className="min-w-0">
                                <h3
                                  className={`text-sm font-bold text-slate-900 line-clamp-1 ${
                                    isDone ? 'line-through text-slate-400' : ''
                                  }`}
                                >
                                  {item.title}
                                </h3>

                                <div className="flex items-center space-x-2.5 mt-1 text-xs text-slate-500 font-medium flex-wrap gap-y-1">
                                  {/* Timestamp Badge */}
                                  <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-lg bg-slate-100 font-mono font-bold text-slate-700 text-[11px]">
                                    <Clock size={11} className="text-slate-400" />
                                    <span>
                                      {formatSecondsToTime(item.watchedSeconds)}
                                      {item.durationSeconds > 0 && ` / ${formatSecondsToTime(item.durationSeconds)}`}
                                    </span>
                                  </span>

                                  {/* Key Moments Count */}
                                  {item.bookmarks && item.bookmarks.length > 0 && (
                                    <span className="inline-flex items-center space-x-1 text-[11px] font-semibold text-purple-600">
                                      <Bookmark size={11} />
                                      <span>{item.bookmarks.length} moments</span>
                                    </span>
                                  )}

                                  {item.notes && (
                                    <span className="text-[11px] text-slate-400 italic line-clamp-1 max-w-xs">
                                      • {item.notes}
                                    </span>
                                  )}
                                </div>

                                {/* Mini Progress bar */}
                                {item.durationSeconds > 0 && (
                                  <div className="w-36 bg-slate-100 h-1 rounded-full mt-2 overflow-hidden">
                                    <div
                                      className={`h-full rounded-full transition-all ${
                                        isDone ? 'bg-emerald-500' : 'bg-gradient-coral'
                                      }`}
                                      style={{ width: `${itemProgress}%` }}
                                    />
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Right: Actions */}
                            <div className="flex items-center space-x-2 self-end md:self-auto pl-10 md:pl-0">
                              <a
                                href={resumeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hidden sm:inline-flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 transition-colors shadow-sm"
                                title="Open video directly with timestamp"
                              >
                                <ExternalLink size={12} className="text-rose-500" />
                                <span>Resume</span>
                              </a>

                              <button
                                onClick={() => setActiveTrackingVideo({ playlistId: pl.id, item })}
                                className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 transition-all shadow-sm active:scale-95"
                              >
                                <Play size={12} />
                                <span>Watch & Track</span>
                              </button>

                              <button
                                onClick={() => deletePlaylistItem(pl.id, item.id)}
                                className="p-1.5 text-slate-300 hover:text-rose-500 rounded-lg hover:bg-slate-100 transition-colors"
                                title="Remove video from sequence"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        );
                      })
                  ) : (
                    <div className="p-6 text-center text-xs text-slate-400">
                      No videos added to this playlist yet.{' '}
                      <button
                        onClick={() => setActivePlaylistForNewVideo(pl)}
                        className="text-rose-600 font-bold hover:underline"
                      >
                        Add your first video lecture
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-3xl p-10 text-center border border-slate-200 shadow-soft space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 text-rose-500 mx-auto flex items-center justify-center">
            <FolderOpen size={28} />
          </div>
          <div>
            <h3 className="text-base font-extrabold text-slate-900">No Playlists in this Track Yet</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
              Add your custom video playlists for{' '}
              {activePlaylistCategory === 'dsa'
                ? 'DSA Topicwise prep'
                : activePlaylistCategory === 'system-design'
                ? 'System Design'
                : activePlaylistCategory === 'dbms'
                ? 'DBMS'
                : 'CN & OS prep'}{' '}
              to track lectures in your exact preferred sequence.
            </p>
          </div>
          <button
            onClick={() => setIsAddPlaylistOpen(true)}
            className="inline-flex items-center space-x-2 px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-coral shadow-glow-coral hover:opacity-95 transition-all"
          >
            <Plus size={16} />
            <span>Create First Playlist</span>
          </button>
        </div>
      )}

      {/* Modals */}
      <AddPlaylistModal
        isOpen={isAddPlaylistOpen}
        onClose={() => setIsAddPlaylistOpen(false)}
        defaultCategory={activePlaylistCategory}
        onAddPlaylist={addPlaylist}
      />

      {activePlaylistForNewVideo && (
        <AddPlaylistItemModal
          isOpen={Boolean(activePlaylistForNewVideo)}
          onClose={() => setActivePlaylistForNewVideo(null)}
          playlistTitle={activePlaylistForNewVideo.title}
          onAddVideo={(videoData) => {
            addPlaylistItem(activePlaylistForNewVideo.id, videoData);
            setActivePlaylistForNewVideo(null);
          }}
        />
      )}

      {activeTrackingVideo && (
        <VideoTrackerModal
          isOpen={Boolean(activeTrackingVideo)}
          onClose={() => setActiveTrackingVideo(null)}
          playlistId={activeTrackingVideo.playlistId}
          item={activeTrackingVideo.item}
          onUpdateTimestamp={updateWatchTimestamp}
          onAddBookmark={addTimestampBookmark}
          onDeleteBookmark={deleteTimestampBookmark}
          onUpdateNotes={handleUpdateNotes}
        />
      )}
    </div>
  );
};
