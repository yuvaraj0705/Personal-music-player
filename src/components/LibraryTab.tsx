/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Heart, Play, Trash2, ListMusic, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { ALL_TRACKS } from '../data';
import { Track } from '../types';

export const LibraryTab: React.FC = () => {
  const { favorites, toggleFavorite, playTrack, currentTrack, isPlaying, togglePlay } = useAudio();

  // Find actual track objects from favorites list
  const favoriteTracks = ALL_TRACKS.filter(track => favorites.includes(track.id));

  const handlePlayFavorites = () => {
    if (favoriteTracks.length > 0) {
      playTrack(favoriteTracks[0]);
    }
  };

  return (
    <div className="w-full h-full pb-36">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold tracking-tight text-brand-on-surface font-sans">
          Your Library
        </h2>
        {favoriteTracks.length > 0 && (
          <button 
            onClick={handlePlayFavorites}
            className="flex items-center gap-2 bg-brand-primary text-brand-on-primary px-4 py-2 rounded-full font-bold text-xs shadow-md shadow-brand-primary/20 hover:scale-105 active:scale-95 transition-transform"
          >
            <Play size={12} fill="currentColor" /> Play Liked
          </button>
        )}
      </div>

      {favoriteTracks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-brand-surface-container/20 rounded-2xl border border-white/5 border-dashed">
          <div className="w-12 h-12 rounded-full bg-brand-surface-container flex items-center justify-center text-brand-on-surface-variant mb-4">
            <Heart size={20} className="text-brand-on-surface-variant/40" />
          </div>
          <h3 className="font-bold text-base text-brand-on-surface">No Liked Songs Yet</h3>
          <p className="text-xs text-brand-on-surface-variant mt-1.5 max-w-[280px]">
            Explore songs in Recently Played or search your favorite artists and tap the heart icon to save them here.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {favoriteTracks.map((track, i) => {
            const isCurrent = currentTrack.id === track.id;
            return (
              <motion.div
                key={`favorite-${track.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => playTrack(track)}
                className="flex items-center justify-between p-3 rounded-xl bg-brand-surface-container/20 hover:bg-brand-surface-container border border-transparent hover:border-white/5 transition-all group cursor-pointer"
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

                <div className="flex items-center gap-4 shrink-0 pl-3">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center gap-1">
                      <div className="w-0.5 h-3 bg-brand-primary rounded animate-bounce shrink-0" />
                      <div className="w-0.5 h-4 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.2s]" />
                      <div className="w-0.5 h-2 bg-brand-primary rounded animate-bounce shrink-0 [animation-delay:0.4s]" />
                    </div>
                  ) : (
                    <span className="text-xs text-brand-on-surface-variant font-mono hidden md:inline">
                      {track.duration}
                    </span>
                  )}

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className="p-2 text-brand-on-surface-variant/40 hover:text-brand-error hover:bg-white/5 rounded-full transition-all"
                    title="Remove from Liked"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Device display area */}
      <section className="mt-10 bg-brand-surface-container-high rounded-2xl p-5 border border-white/5 relative overflow-hidden shadow-lg">
        <div className="flex items-center justify-between z-10 relative">
          <div>
            <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest font-mono">Stream Device Status</span>
            <h4 className="font-bold text-lg text-brand-on-surface mt-1">Studio Pro 2 Connected</h4>
            <p className="text-xs text-brand-on-surface-variant mt-0.5">High fidelity 24-bit PCM digital master casting</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary p-2 animate-[pulse_2s_infinite]">
            <Volume2 size={20} />
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
      </section>
    </div>
  );
};
