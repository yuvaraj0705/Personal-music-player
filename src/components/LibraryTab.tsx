/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Play, Trash2, ListMusic, Volume2, Plus, X, MoreVertical } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Track } from '../types';

interface LibraryTabProps {
  onOpenTrackOptions: (track: Track) => void;
  onOpenPlaylist?: (playlistId: string) => void;
}

export const LibraryTab: React.FC<LibraryTabProps> = ({ onOpenTrackOptions, onOpenPlaylist }) => {
  const { 
    tracks,
    favorites, 
    toggleFavorite, 
    playTrack, 
    currentTrack, 
    isPlaying,
    createPlaylist
  } = useAudio();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [newPlaylistCover, setNewPlaylistCover] = useState('');

  const favoriteTracks = tracks.filter(track => favorites.includes(track.id));

  const handlePlayFavorites = () => {
    if (favoriteTracks.length > 0) {
      playTrack(favoriteTracks[0]);
    }
  };

  const handleCreatePlaylist = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;
    
    await createPlaylist(newPlaylistName, newPlaylistCover);
    setNewPlaylistName('');
    setNewPlaylistCover('');
    setIsCreateModalOpen(false);
  };

  return (
    <div className="w-full h-full pb-36">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-on-surface font-sans">
          Your Library
        </h2>
        <div className="flex gap-2">
          {favoriteTracks.length > 0 && (
            <button 
              onClick={handlePlayFavorites}
              className="flex items-center gap-1 bg-brand-primary text-brand-on-primary px-3 py-1.5 rounded-full font-bold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-transform"
            >
              <Play size={12} fill="currentColor" /> Play Liked
            </button>
          )}
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1 bg-white/10 hover:bg-white/20 backdrop-blur-md text-brand-on-surface px-3 py-1.5 rounded-full font-bold text-xs transition-all border border-white/10 shadow-sm"
          >
            <Plus size={14} /> Playlist
          </button>
        </div>
      </div>

      {favoriteTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-brand-surface-container/20 rounded-2xl border border-white/5 border-dashed">
          <div className="w-12 h-12 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant mb-4">
            <Heart size={20} className="text-brand-on-surface-variant/40" />
          </div>
          <h3 className="font-bold text-base text-brand-on-surface">No Liked Songs Yet</h3>
          <p className="text-xs text-brand-on-surface-variant mt-1.5 max-w-[280px]">
            Tap the heart icon on any track to save them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {favoriteTracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            return (
              <motion.div
                key={`favorite-${track.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => playTrack(track)}
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-container/10 hover:bg-brand-surface-container/40 border border-transparent hover:border-white/5 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5 shrink-0 shadow">
                    <img 
                      src={track.albumArt} 
                      alt={track.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={16} className="text-white fill-white" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-brand-on-surface-variant truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-3">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center gap-1 mr-2">
                      <div className="w-0.5 h-3 bg-brand-primary rounded animate-bounce shrink-0" />
                      <div className="w-0.5 h-4 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.2s]" />
                      <div className="w-0.5 h-2 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <span className="text-xs text-brand-on-surface-variant font-mono hidden md:inline mr-2">
                      {track.duration}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className="p-2 text-brand-primary hover:text-brand-error hover:bg-white/5 rounded-full transition-all"
                    title="Remove from Liked"
                  >
                    <Heart size={15} fill="currentColor" />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTrackOptions(track);
                    }}
                    className="p-2 text-brand-on-surface-variant/40 hover:text-brand-on-surface hover:bg-white/5 rounded-full transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* All Songs Section */}
      <section className="mt-10">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <ListMusic className="text-brand-primary" size={20} />
            <h2 className="text-xl font-bold tracking-tight text-brand-on-surface font-sans">
              All Songs
            </h2>
          </div>
          <span className="text-xs font-semibold text-brand-on-surface-variant uppercase tracking-widest bg-white/5 px-3 py-1 rounded-full border border-white/5">
            {tracks.length} Tracks
          </span>
        </div>
        
        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2 -mr-2 pb-4">
          {tracks.map((track, i) => {
            const isCurrent = currentTrack?.id === track.id;
            const isFavorited = favorites.includes(track.id);
            return (
              <motion.div
                key={`all-${track.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: Math.min(i * 0.05, 0.5) }}
                onClick={() => playTrack(track)}
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-container/10 hover:bg-brand-surface-container/40 border border-transparent hover:border-white/5 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-white/5 shrink-0 shadow">
                    <img 
                      src={track.albumArt} 
                      alt={track.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Play size={16} className="text-white fill-white ml-0.5" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <h4 className={`font-bold text-sm truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface'}`}>
                      {track.title}
                    </h4>
                    <p className="text-xs text-brand-on-surface-variant truncate mt-0.5">
                      {track.artist}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 pl-3">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center gap-1 mr-2">
                      <div className="w-0.5 h-3 bg-brand-primary rounded animate-bounce shrink-0" />
                      <div className="w-0.5 h-4 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.2s]" />
                      <div className="w-0.5 h-2 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <span className="text-xs text-brand-on-surface-variant font-mono hidden md:inline mr-2">
                      {track.duration}
                    </span>
                  )}
                  
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className={`p-2 hover:scale-110 active:scale-95 transition-all rounded-full ${isFavorited ? 'text-brand-primary hover:bg-brand-primary/10' : 'text-brand-on-surface-variant/40 hover:text-brand-on-surface hover:bg-white/5'}`}
                    title={isFavorited ? "Remove from Liked" : "Add to Liked"}
                  >
                    <Heart size={15} fill={isFavorited ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenTrackOptions(track);
                    }}
                    className="p-2 text-brand-on-surface-variant/40 hover:text-brand-on-surface hover:bg-white/5 rounded-full transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Create Playlist Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
          >
            <motion.div 
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              className="w-full max-w-sm bg-brand-surface-container-high border border-white/10 rounded-2xl p-6 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-5">
                <h3 className="text-lg font-bold text-brand-on-surface">Create Playlist</h3>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-1 text-brand-on-surface-variant hover:text-white hover:bg-white/10 rounded-full transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
              
              <form onSubmit={handleCreatePlaylist}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1 uppercase tracking-wider">
                      Playlist Name
                    </label>
                    <input 
                      type="text"
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      placeholder="My Awesome Mix"
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-brand-on-surface placeholder:text-brand-on-surface-variant/40 outline-none focus:border-brand-primary transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1 uppercase tracking-wider">
                      Cover Image URL (Optional)
                    </label>
                    <input 
                      type="url"
                      value={newPlaylistCover}
                      onChange={(e) => setNewPlaylistCover(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-brand-on-surface placeholder:text-brand-on-surface-variant/40 outline-none focus:border-brand-primary transition-colors"
                    />
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end gap-3">
                  <button 
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-lg font-semibold text-sm text-brand-on-surface hover:bg-white/5 transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-brand-primary text-brand-on-primary hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                  >
                    Create
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
