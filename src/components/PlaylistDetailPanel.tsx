import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Trash2, Music } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Playlist, Track } from '../types';

interface PlaylistDetailPanelProps {
  playlistId: string | null;
  onClose: () => void;
  onOpenTrackOptions?: (track: Track) => void;
}

export const PlaylistDetailPanel: React.FC<PlaylistDetailPanelProps> = ({ playlistId, onClose, onOpenTrackOptions }) => {
  const { playlists, playPlaylist, playTrack, currentTrack, isPlaying, removeFromPlaylist, deletePlaylist } = useAudio();

  const playlist = playlists.find(p => p.id === playlistId);

  if (!playlistId) return null;

  return (
    <AnimatePresence>
      {playlist && (
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[55] bg-brand-surface text-brand-on-surface overflow-hidden flex flex-col"
        >
          {/* Header area with background blur */}
          <div className="relative h-64 shrink-0 overflow-hidden">
            <div 
              className="absolute inset-0 bg-cover bg-center blur-2xl opacity-40 scale-110"
              style={{ backgroundImage: `url(${playlist.img})` }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-surface via-brand-surface/80 to-transparent" />
            
            {/* Top Bar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10 pt-10">
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full bg-black/20 hover:bg-black/40 backdrop-blur-md flex items-center justify-center transition-colors"
              >
                <X size={20} />
              </button>
              <button 
                onClick={() => {
                  if (confirm('Are you sure you want to delete this playlist?')) {
                    deletePlaylist(playlist.id);
                    onClose();
                  }
                }}
                className="w-10 h-10 rounded-full bg-black/20 hover:bg-brand-error/80 backdrop-blur-md flex items-center justify-center transition-colors text-brand-on-surface-variant hover:text-white"
                title="Delete Playlist"
              >
                <Trash2 size={18} />
              </button>
            </div>

            {/* Playlist Info */}
            <div className="absolute bottom-6 left-6 right-6 flex items-end gap-5 z-10">
              <div className="w-32 h-32 rounded-xl overflow-hidden shadow-2xl border border-white/10 shrink-0 bg-brand-surface-container">
                <img src={playlist.img} alt={playlist.title} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0 pb-2">
                <p className="text-[10px] font-bold uppercase tracking-widest text-brand-primary mb-1">Playlist</p>
                <h1 className="text-3xl font-black truncate tracking-tight">{playlist.title}</h1>
                <p className="text-sm text-brand-on-surface-variant mt-2 font-medium">
                  {playlist.songCount} {playlist.songCount === 1 ? 'song' : 'songs'}
                </p>
              </div>
            </div>
          </div>

          {/* Action Bar */}
          <div className="px-6 py-4 flex items-center gap-4 bg-brand-surface shrink-0 relative z-20 shadow-md">
            <button 
              onClick={() => playPlaylist(playlist)}
              disabled={playlist.songs.length === 0}
              className="w-14 h-14 rounded-full bg-brand-primary text-brand-on-primary flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-primary/20 disabled:opacity-50 disabled:hover:scale-100"
            >
              <Play size={24} className="ml-1" fill="currentColor" />
            </button>
            <span className="text-sm font-semibold text-brand-on-surface-variant">
              Play All
            </span>
          </div>

          {/* Song List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-36">
            {playlist.songs.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-40 text-center bg-brand-surface-container/20 rounded-xl border border-white/5 border-dashed mt-4">
                <Music size={24} className="text-brand-on-surface-variant/40 mb-3" />
                <h3 className="font-bold text-brand-on-surface">It's quiet in here</h3>
                <p className="text-xs text-brand-on-surface-variant mt-1">
                  Add some tracks from your library!
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-1 mt-2">
                {playlist.songs.map((track, i) => {
                  const isCurrent = currentTrack?.id === track.id;
                  return (
                    <motion.div
                      key={`pl-track-${track.id}-${i}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03, duration: 0.2 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-brand-surface-container/40 transition-colors group cursor-pointer border border-transparent hover:border-white/5"
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <span className={`font-mono text-xs w-5 text-center shrink-0 ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface-variant'}`}>
                          {i + 1}
                        </span>
                        <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                          <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className={`font-semibold text-sm truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface'}`}>
                            {track.title}
                          </h4>
                          <p className="text-xs text-brand-on-surface-variant truncate">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        {isCurrent && isPlaying ? (
                          <div className="flex items-center gap-1 mr-2">
                            <div className="w-0.5 h-3 bg-brand-primary rounded animate-bounce shrink-0" />
                            <div className="w-0.5 h-4 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.2s]" />
                            <div className="w-0.5 h-2 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.4s]" />
                          </div>
                        ) : (
                          <span className="text-xs text-brand-on-surface-variant font-mono mr-2 hidden md:inline">
                            {track.duration}
                          </span>
                        )}
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFromPlaylist(playlist.id, track.id);
                          }}
                          className="p-2 text-brand-on-surface-variant/40 hover:text-brand-error hover:bg-white/5 rounded-full transition-colors"
                          title="Remove from playlist"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
