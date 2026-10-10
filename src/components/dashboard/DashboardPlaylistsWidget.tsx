import React from 'react';
import { Video, Play, Clock, ArrowRight, Code2, Layers, Database, Cpu, Plus } from 'lucide-react';
import { useDSA } from '../../context/DSAContext';
import { formatSecondsToTime, getYouTubeTimestampUrl } from '../../data/playlistData';
import { PlaylistCategory } from '../../types/dsa';

export const DashboardPlaylistsWidget: React.FC = () => {
  const { playlists, setActiveTab, setActivePlaylistCategory } = useDSA();

  // Find the most recently watched or first in-progress video
  const lastActiveItem = React.useMemo(() => {
    let bestItem = null;
    let bestPlaylist = null;

    for (const pl of playlists) {
      for (const item of pl.items) {
        if (!item.isCompleted && item.watchedSeconds > 0) {
          if (!bestItem || (item.lastWatchedAt && item.lastWatchedAt > (bestItem.lastWatchedAt || ''))) {
            bestItem = item;
            bestPlaylist = pl;
          }
        }
      }
    }

    if (!bestItem && playlists.length > 0 && playlists[0].items.length > 0) {
      bestItem = playlists[0].items[0];
      bestPlaylist = playlists[0];
    }

    return { item: bestItem, playlist: bestPlaylist };
  }, [playlists]);

  const handleOpenCategory = (cat: PlaylistCategory) => {
    setActivePlaylistCategory(cat);
    setActiveTab('playlists');
  };

  const resumeUrl = lastActiveItem.item
    ? getYouTubeTimestampUrl(lastActiveItem.item.videoUrl, lastActiveItem.item.watchedSeconds)
    : '';

  return (
    <div className="card-soft p-5 border border-violet-500/20 text-white space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-violet-950/70 text-violet-400 border border-violet-500/20 flex items-center justify-center">
            <Video size={16} />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white">Video Playlist Tracker</h3>
            <p className="text-[11px] text-slate-400">Sequential course tracking & timestamp bookmarks</p>
          </div>
        </div>

        <button
          onClick={() => setActiveTab('playlists')}
          className="inline-flex items-center space-x-1 text-xs font-bold text-violet-400 hover:text-violet-300 transition-colors"
        >
          <span>All Tracks</span>
          <ArrowRight size={13} />
        </button>
      </div>

      {/* Active / Continue Watching Video Banner */}
      {lastActiveItem.item && lastActiveItem.playlist ? (
        <div className="p-3.5 rounded-2xl bg-[#0b0c1e] border border-violet-500/30 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-wider block mb-0.5">
              Continue Watching • {lastActiveItem.playlist.title}
            </span>
            <h4 className="text-xs font-extrabold text-white truncate">
              #{lastActiveItem.item.order} {lastActiveItem.item.title}
            </h4>
            <div className="flex items-center space-x-2 text-[11px] text-slate-400 font-medium mt-1">
              <span className="font-mono font-bold text-slate-200 flex items-center space-x-1">
                <Clock size={11} className="text-violet-400" />
                <span>
                  {formatSecondsToTime(lastActiveItem.item.watchedSeconds)}
                  {lastActiveItem.item.durationSeconds > 0 &&
                    ` / ${formatSecondsToTime(lastActiveItem.item.durationSeconds)}`}
                </span>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 flex-shrink-0">
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-bold text-white gradient-violet shadow-glow-violet hover:opacity-95 transition-all"
            >
              <Play size={12} />
              <span>Resume</span>
            </a>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-2xl bg-[#0b0c1e]/70 border border-violet-500/20 text-center flex items-center justify-between text-xs text-slate-400">
          <span>No active playlist tracked yet.</span>
          <button
            onClick={() => setActiveTab('playlists')}
            className="text-violet-400 font-bold hover:text-violet-300 flex items-center space-x-1"
          >
            <Plus size={12} />
            <span>Create Track</span>
          </button>
        </div>
      )}

      {/* 4 Category Quick Launchers */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
        <button
          onClick={() => handleOpenCategory('dsa')}
          className="p-2.5 rounded-xl bg-[#0b0c1e] hover:bg-violet-950/40 border border-violet-500/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-violet-400 mb-1">
            <Code2 size={15} />
            <span className="text-[10px] font-bold text-violet-400">
              {playlists.filter((p) => p.category === 'dsa').length}
            </span>
          </div>
          <p className="text-xs font-bold text-white group-hover:text-violet-300 truncate">DSA Topics</p>
          <p className="text-[10px] text-slate-400">Arrays, DP, Trees</p>
        </button>

        <button
          onClick={() => handleOpenCategory('system-design')}
          className="p-2.5 rounded-xl bg-[#0b0c1e] hover:bg-purple-950/40 border border-violet-500/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-400 mb-1">
            <Layers size={15} />
            <span className="text-[10px] font-bold text-purple-400">
              {playlists.filter((p) => p.category === 'system-design').length}
            </span>
          </div>
          <p className="text-xs font-bold text-white group-hover:text-purple-300 truncate">System Design</p>
          <p className="text-[10px] text-slate-400">HLD & Scalability</p>
        </button>

        <button
          onClick={() => handleOpenCategory('dbms')}
          className="p-2.5 rounded-xl bg-[#0b0c1e] hover:bg-blue-950/40 border border-violet-500/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-blue-400 mb-1">
            <Database size={15} />
            <span className="text-[10px] font-bold text-blue-400">
              {playlists.filter((p) => p.category === 'dbms').length}
            </span>
          </div>
          <p className="text-xs font-bold text-white group-hover:text-blue-300 truncate">DBMS Core</p>
          <p className="text-[10px] text-slate-400">SQL & Indexing</p>
        </button>

        <button
          onClick={() => handleOpenCategory('cn-os')}
          className="p-2.5 rounded-xl bg-[#0b0c1e] hover:bg-amber-950/40 border border-violet-500/20 text-left transition-all group"
        >
          <div className="flex items-center justify-between text-slate-400 group-hover:text-amber-400 mb-1">
            <Cpu size={15} />
            <span className="text-[10px] font-bold text-amber-400">
              {playlists.filter((p) => p.category === 'cn-os').length}
            </span>
          </div>
          <p className="text-xs font-bold text-white group-hover:text-amber-300 truncate">CN & OS</p>
          <p className="text-[10px] text-slate-400">TCP, Threads, Paging</p>
        </button>
      </div>
    </div>
  );
};
