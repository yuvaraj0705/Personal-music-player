/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Play, Pause, MoreVertical, Music, Heart, Volume2 } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Track } from '../types';
import { 
  ALL_TRACKS, 
  ALL_PLAYLISTS, 
  DISCOVER_WEEKLY_PLAYLIST 
} from '../data';

interface HomeTabProps {
  onOpenNowPlaying: () => void;
  onOpenSettings: () => void;
  onOpenSearch: () => void;
}

export const HomeTab: React.FC<HomeTabProps> = ({ 
  onOpenNowPlaying, 
  onOpenSettings, 
  onOpenSearch 
}) => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    playPlaylist, 
    togglePlay, 
    toggleFavorite, 
    favorites 
  } = useAudio();

  const recentlyPlayedList: Track[] = [
    ALL_TRACKS[0],
    ALL_TRACKS[1],
    ALL_TRACKS[2]
  ];

  const mostListenedList: Track[] = [
    ALL_TRACKS[3], // Starboy
    ALL_TRACKS[4], // Sweater Weather
    ALL_TRACKS[5]  // Blinding Lights
  ];

  return (
    <div className="w-full h-full pb-36">
      {/* Recently Played */}
      <section className="mb-10">
        <h2 className="text-xl font-bold tracking-tight text-brand-on-surface mb-6 font-sans">
          Recently Played
        </h2>
        <div className="flex overflow-x-auto gap-6 pb-4 custom-scrollbar -mx-margin-mobile px-margin-mobile">
          {recentlyPlayedList.map((track, i) => {
            const isCurrent = currentTrack.id === track.id;
            return (
              <motion.div 
                key={`recent-${track.id}-${i}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className="min-w-[160px] md:min-w-[190px] group cursor-pointer"
                onClick={() => playTrack(track)}
              >
                <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-brand-surface-container-high border border-white/5 shadow-lg">
                  <img 
                    src={track.albumArt} 
                    alt={track.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isCurrent) {
                          togglePlay();
                        } else {
                          playTrack(track);
                        }
                      }}
                      className="bg-brand-primary text-brand-on-primary p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20"
                    >
                      {isCurrent && isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                      ) : (
                        <Play size={20} className="ml-0.5 animate-pulse" fill="currentColor" />
                      )}
                    </button>
                  </div>
                  {isCurrent && isPlaying && (
                    <div className="absolute bottom-2 right-2 bg-brand-surface/80 backdrop-blur-md px-1.5 py-1 rounded-md flex items-center gap-1.5 text-brand-primary border border-brand-primary/20 pointer-events-none">
                      <Volume2 size={12} className="animate-bounce" />
                      <span className="text-[9px] font-bold font-mono uppercase tracking-tighter">Live</span>
                    </div>
                  )}
                </div>
                <h3 className={`font-medium text-sm truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface'}`}>
                  {track.title}
                </h3>
                <p className="text-xs text-brand-on-surface-variant mt-0.5 truncate">
                  {track.artist}
                </p>
              </motion.div>
            );
          })}

          {/* Discover Weekly Playlist card */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: recentlyPlayedList.length * 0.08 }}
            className="min-w-[160px] md:min-w-[190px] group cursor-pointer"
            onClick={() => playPlaylist(DISCOVER_WEEKLY_PLAYLIST)}
          >
            <div className="relative aspect-square rounded-xl overflow-hidden mb-3 bg-brand-surface-container-high border border-white/5 shadow-lg">
              <img 
                src={DISCOVER_WEEKLY_PLAYLIST.img} 
                alt="Discover Weekly"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <button className="bg-brand-primary text-brand-on-primary p-3 rounded-full hover:scale-105 active:scale-95 transition-all shadow-lg shadow-brand-primary/20">
                  <Play size={20} className="ml-0.5" fill="currentColor" />
                </button>
              </div>
            </div>
            <h3 className="font-medium text-sm truncate text-brand-on-surface">
              Discover Weekly
            </h3>
            <p className="text-xs text-brand-on-surface-variant mt-0.5 truncate">
              Made for you
            </p>
          </motion.div>
        </div>
      </section>

      {/* Your Playlists Grid */}
      <section className="mb-10">
        <div className="flex justify-between items-end mb-6">
          <h2 className="text-xl font-bold tracking-tight text-brand-on-surface font-sans">
            Your Playlists
          </h2>
          <button 
            onClick={onOpenNowPlaying} 
            className="text-xs font-semibold text-brand-primary hover:underline hover:opacity-90 transition-opacity"
          >
            Player Settings
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ALL_PLAYLISTS.map((playlist, i) => {
            return (
              <motion.div 
                key={`playlist-${playlist.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                onClick={() => playPlaylist(playlist)}
                className="flex items-center gap-3.5 bg-brand-surface-container rounded-xl p-3 group hover:bg-brand-surface-container-high transition-colors cursor-pointer border border-white/5"
              >
                <div className="w-14 h-14 rounded-lg overflow-hidden shrink-0 border border-white/10">
                  <img 
                    src={playlist.img} 
                    alt={playlist.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm text-brand-on-surface group-hover:text-brand-primary transition-colors truncate">
                    {playlist.title}
                  </h4>
                  <p className="text-xs text-brand-on-surface-variant mt-0.5 uppercase tracking-wider font-medium text-[10px]">
                    {playlist.songCount} songs
                  </p>
                </div>
                <button className="text-brand-primary opacity-0 group-hover:opacity-100 transition-opacity p-1.5 hover:bg-white/5 rounded-full">
                  <Play size={18} fill="currentColor" />
                </button>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* Most Listened List */}
      <section>
        <h2 className="text-xl font-bold tracking-tight text-brand-on-surface mb-6 font-sans">
          Most Listened
        </h2>
        <div className="flex flex-col gap-2">
          {mostListenedList.map((track, i) => {
            const isCurrent = currentTrack.id === track.id;
            const isFavorited = favorites.includes(track.id);
            return (
              <motion.div 
                key={`most-${track.id}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.06 }}
                onClick={() => playTrack(track)}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-all group cursor-pointer border border-transparent hover:border-white/5"
              >
                <div className="flex items-center gap-4 min-w-0 flex-1">
                  <span className={`font-semibold font-mono text-xs w-4 text-center shrink-0 ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface-variant'}`}>
                    {i + 1}
                  </span>
                  <div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 border border-white/10">
                    <img 
                      src={track.albumArt} 
                      alt={track.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h5 className={`font-bold text-sm truncate ${isCurrent ? 'text-brand-primary' : 'text-brand-on-surface'}`}>
                      {track.title}
                    </h5>
                    <p className="text-xs text-brand-on-surface-variant mt-0.5 truncate">
                      {track.artist}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-5 shrink-0 pl-3">
                  {isCurrent && isPlaying ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1 h-3.5 bg-brand-primary rounded animate-[bounce_1s_infinite_delay-100]" />
                      <div className="w-1 h-5 bg-brand-primary rounded animate-[bounce_0.8s_infinite]" />
                      <div className="w-1 h-2.5 bg-brand-primary rounded animate-[bounce_1.2s_infinite_delay-200]" />
                    </div>
                  ) : (
                    <span className="text-xs text-brand-on-surface-variant hidden md:block font-medium font-mono">
                      {track.duration}
                    </span>
                  )}
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(track.id);
                    }}
                    className={`p-1 hover:scale-105 active:scale-95 transition-transform ${isFavorited ? 'text-brand-primary' : 'text-brand-on-surface-variant/60 hover:text-brand-on-surface'}`}
                  >
                    <Heart size={16} fill={isFavorited ? "currentColor" : "none"} />
                  </button>
                  
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      // Show track menu options
                      alert(`Cyber-Options for ${track.title}:\n- Play next\n- Add to playlist\n- Share digital token`);
                    }}
                    className="p-1 text-brand-on-surface-variant/40 hover:text-brand-on-surface hover:bg-white/5 rounded-full transition-colors"
                  >
                    <MoreVertical size={16} />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
