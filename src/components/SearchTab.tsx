/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, Plus, Check, Disc, Star, Flame, Sparkles } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { ALL_TRACKS } from '../data';
import { Track } from '../types';

export const SearchTab: React.FC = () => {
  const [query, setQuery] = useState('');
  const { playTrack, addToQueue, queue, currentTrack } = useAudio();

  const filteredTracks = ALL_TRACKS.filter(track =>
    track.title.toLowerCase().includes(query.toLowerCase()) ||
    track.artist.toLowerCase().includes(query.toLowerCase())
  );

  const categories = [
    { title: "Techno Essentials", color: "from-[#006e2d] to-[#131313]", icon: <Flame size={16} /> },
    { title: "Synthwave Glow", color: "from-[#730a1b] to-[#131313]", icon: <Sparkles size={16} /> },
    { title: "Cyber-Vibes", color: "from-[#400009] to-[#131313]", icon: <Disc size={16} /> },
    { title: "Sleek Lo-Fi", color: "from-[#1a1c1c] to-[#131313]", icon: <Star size={16} /> }
  ];

  return (
    <div className="w-full h-full pb-36 px-1">
      <h2 className="text-xl font-bold tracking-tight text-brand-on-surface mb-6 font-sans">
        Search
      </h2>
      
      {/* Interactive glowing search input */}
      <div className="relative w-full mb-8">
        <span className="absolute inset-y-0 left-4 flex items-center text-brand-on-surface-variant">
          <Search size={18} />
        </span>
        <input 
          type="text" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="What do you want to listen to?"
          className="w-full bg-brand-surface-container hover:bg-brand-surface-container-high focus:bg-brand-surface-container-high text-brand-on-surface placeholder-brand-on-surface-variant/50 pl-12 pr-4 py-3.5 rounded-xl border border-white/5 focus:border-brand-primary/40 focus:outline-none transition-all duration-300 shadow-md focus:shadow-brand-primary/5 text-sm"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-brand-on-surface-variant/80 hover:text-brand-on-surface uppercase tracking-wider"
          >
            Clear
          </button>
        )}
      </div>

      <AnimatePresence mode="popLayout">
        {query === '' ? (
          <motion.div 
            key="categories"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <h3 className="text-sm font-semibold text-brand-on-surface-variant uppercase tracking-widest">
              Browse Categories
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {categories.map((cat, i) => (
                <motion.div
                  key={`cat-${i}`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setQuery(cat.title.split(' ')[0])}
                  className={`relative overflow-hidden aspect-[4/3] rounded-xl bg-gradient-to-br ${cat.color} p-4 border border-white/5 shadow-md flex flex-col justify-between cursor-pointer`}
                >
                  <div className="bg-white/10 w-8 h-8 rounded-full flex items-center justify-center p-1 font-semibold text-brand-primary shrink-0">
                    {cat.icon}
                  </div>
                  <h4 className="font-bold text-md text-white tracking-tight">
                    {cat.title}
                  </h4>
                  <div className="absolute top-2 -right-8 w-24 h-24 rounded-full bg-brand-primary/10 blur-xl pointer-events-none" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            <div className="flex justify-between items-center px-1">
              <h3 className="text-xs font-semibold text-brand-on-surface-variant uppercase tracking-widest">
                Search Results ({filteredTracks.length})
              </h3>
            </div>

            {filteredTracks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <p className="text-sm text-brand-on-surface-variant">
                  No matches for "<span className="text-brand-on-surface font-semibold">{query}</span>"
                </p>
                <button 
                  onClick={() => setQuery('')}
                  className="mt-4 text-xs font-bold text-brand-primary uppercase hover:underline"
                >
                  View all tracks
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {filteredTracks.map((track, i) => {
                  const isCurrent = currentTrack.id === track.id;
                  const isQueued = queue.some(q => q.id === track.id);
                  return (
                    <motion.div
                      key={`search-${track.id}`}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.03 }}
                      className="flex items-center justify-between p-2.5 rounded-xl bg-brand-surface-container/20 hover:bg-brand-surface-container border border-transparent hover:border-white/5 transition-all group cursor-pointer"
                      onClick={() => playTrack(track)}
                    >
                      <div className="flex items-center gap-3.5 min-w-0 flex-1">
                        <div className="relative w-11 h-11 rounded-lg overflow-hidden border border-white/5 shrink-0">
                          <img 
                            src={track.albumArt} 
                            alt={track.title} 
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Play size={14} className="text-white fill-white" />
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

                      <div className="flex items-center gap-3 shrink-0 pl-2">
                        <span className="text-xs text-brand-on-surface-variant font-medium font-mono hidden md:inline">
                          {track.duration}
                        </span>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToQueue(track);
                          }}
                          disabled={isQueued}
                          className={`p-2 rounded-lg border flex items-center justify-center transition-all ${
                            isQueued 
                              ? 'bg-brand-primary/10 border-brand-primary/10 text-brand-primary' 
                              : 'bg-white/5 border-white/5 hover:border-brand-primary hover:text-brand-primary text-brand-on-surface-variant'
                          }`}
                        >
                          {isQueued ? <Check size={14} /> : <Plus size={14} />}
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
