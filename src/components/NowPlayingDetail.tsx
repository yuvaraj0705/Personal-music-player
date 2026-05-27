/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ChevronDown, 
  MoreVertical, 
  Heart, 
  Shuffle, 
  SkipBack, 
  Play, 
  Pause, 
  SkipForward, 
  Repeat, 
  Laptop, 
  Share2, 
  Volume1, 
  VolumeX, 
  Volume2, 
  Layers,
  Music4
} from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Visualizer } from './Visualizer';
import { Track } from '../types';

interface NowPlayingDetailProps {
  onMinimize: () => void;
  visualizerType: 'bars' | 'wave' | 'retro-dots';
  onOpenQueue: () => void;
}

export const NowPlayingDetail: React.FC<NowPlayingDetailProps> = ({ 
  onMinimize,
  visualizerType,
  onOpenQueue
}) => {
  const {
    currentTrack,
    isPlaying,
    currentTime,
    duration,
    volume,
    isMuted,
    isLooping,
    isShuffled,
    favorites,
    togglePlay,
    nextTrack,
    previousTrack,
    seek,
    setVolume,
    toggleMute,
    toggleLoop,
    toggleShuffle,
    toggleFavorite,
    tracks,
    currentTrackIndex,
    queue
  } = useAudio();

  const [showFullLyrics, setShowFullLyrics] = useState(false);
  const [showVisualizer, setShowVisualizer] = useState(true);
  
  const lyricsContainerRef = useRef<HTMLDivElement | null>(null);
  const activeLineRef = useRef<HTMLParagraphElement | null>(null);

  const isFavorited = favorites.includes(currentTrack.id);

  // Math helper for timestamps
  const formatTime = (secs: number) => {
    if (isNaN(secs)) return "0:00";
    const minutes = Math.floor(secs / 60);
    const seconds = Math.floor(secs % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  // Find the currently active lyrics line
  const activeLineIndex = currentTrack.lyrics.findIndex((line, index) => {
    const nextLine = currentTrack.lyrics[index + 1];
    return currentTime >= line.time && (!nextLine || currentTime < nextLine.time);
  });

  // Automatically scroll the active lyric line to center of the box
  useEffect(() => {
    if (activeLineRef.current && lyricsContainerRef.current) {
      activeLineRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest'
      });
    }
  }, [activeLineIndex]);

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickPercent = clickX / rect.width;
    const songDuration = duration || currentTrack.durationSec || 100;
    seek(clickPercent * songDuration);
  };

  const nextTrackInQueue = tracks[(currentTrackIndex + 1) % tracks.length] || currentTrack;

  return (
    <div className="fixed inset-0 z-50 bg-brand-surface text-brand-on-surface overflow-y-auto pb-10 selection:bg-brand-primary/20">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-black">
        <motion.img 
          key={`bg-${currentTrack.id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
          src={currentTrack.albumArt} 
          alt=""
          className="absolute inset-0 w-[120%] h-[120%] -left-[10%] -top-[10%] object-cover blur-[100px] animate-[pulse_15s_infinite_ease-in-out]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-surface/30 via-brand-surface/70 to-black/95" />
      </div>

      {/* Top Bar Header */}
      <header className="sticky top-0 left-0 w-full z-10 flex justify-between items-center px-6 h-20 bg-transparent">
        <button 
          onClick={onMinimize}
          className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95"
          id="btn-minimize-player"
        >
          <ChevronDown size={22} className="text-brand-on-surface" />
        </button>
        <div className="flex flex-col items-center text-center">
          <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brand-on-surface-variant font-sans">
            PLAYING FROM PLAYLIST
          </span>
          <span className="text-xs font-semibold text-brand-on-surface truncate max-w-[200px]">
            Techno Essentials
          </span>
        </div>
        <button 
          onClick={() => {
            alert(`Cybernetic Options:\n- EQ Mixer: Activated\n- High Resolution Codec: FLAC 192kbps\n- Cast stream: Studio Pro 2`);
          }}
          className="p-2 hover:bg-white/5 rounded-full transition-colors active:scale-95"
        >
          <MoreVertical size={18} className="text-brand-on-surface" />
        </button>
      </header>

      {/* Main Grid Wrapper */}
      <div className="max-w-5xl mx-auto px-6 pt-4 grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center z-10 relative">
        
        {/* Left Side: Artwork & Player controls */}
        <div className="flex flex-col items-center">
          {/* Artwork Frame */}
          <div className="relative aspect-square w-full max-w-[340px] md:max-w-[400px] mb-8 bg-brand-surface-container-high rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10 group">
            {showVisualizer ? (
              <div className="absolute inset-0 z-10 p-4 bg-black/30 backdrop-blur-md flex flex-col justify-end transition-all">
                <div className="h-28 w-full">
                  <Visualizer type={visualizerType} />
                </div>
                <div className="w-full flex justify-between items-center mt-3 z-20">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-brand-primary">Oscilloscope Live</span>
                  <button 
                    onClick={() => setShowVisualizer(false)}
                    className="text-[10px] font-bold uppercase text-brand-on-surface-variant/80 hover:text-white"
                  >
                    View Artwork
                  </button>
                </div>
              </div>
            ) : null}

            <img 
              src={currentTrack.albumArt} 
              alt={currentTrack.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            
            {!showVisualizer && (
              <button 
                onClick={() => setShowVisualizer(true)}
                className="absolute bottom-3 right-3 bg-black/60 hover:bg-brand-primary hover:text-brand-on-primary text-brand-primary backdrop-blur-md p-2 rounded-full transition-colors font-semibold shadow z-20"
                title="Spectrum Visualizer"
              >
                <Layers size={14} />
              </button>
            )}
          </div>

          {/* Title and Favorites */}
          <div className="w-full max-w-[340px] md:max-w-[400px] flex justify-between items-end">
            <div className="min-w-0 pr-4">
              <h1 className="text-2xl font-extrabold tracking-tight text-white truncate font-sans">
                {currentTrack.title}
              </h1>
              <p className="text-sm text-brand-on-surface-variant font-medium mt-1 truncate">
                {currentTrack.artist}
              </p>
            </div>
            <button 
              onClick={() => toggleFavorite(currentTrack.id)}
              className={`p-2 shrink-0 transition-transform hover:scale-110 active:scale-90 ${isFavorited ? 'text-brand-primary' : 'text-brand-on-surface-variant'}`}
              id="btn-favorite-large"
            >
              <Heart size={22} fill={isFavorited ? "currentColor" : "none"} />
            </button>
          </div>

          {/* Seek Bar Slider */}
          <div className="w-full max-w-[340px] md:max-w-[400px] mt-8 group select-none">
            <div 
              onClick={handleProgressBarClick}
              className="relative w-full h-1.5 bg-white/10 rounded-full cursor-pointer h-1.5 hover:h-2 transition-all overflow-hidden"
            >
              <div 
                className="absolute top-0 left-0 h-full bg-brand-primary rounded-full transition-all duration-75 relative"
                style={{ width: `${((currentTime / (duration || currentTrack.durationSec || 1)) * 100)}%` }}
              />
            </div>
            <div className="flex justify-between mt-3 text-[11px] font-medium font-mono text-brand-on-surface-variant">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(duration || currentTrack.durationSec)}</span>
            </div>
          </div>

          {/* Core Row Players Controls */}
          <div className="w-full max-w-[340px] md:max-w-[400px] flex justify-between items-center mt-6">
            <button 
              onClick={toggleShuffle}
              className={`p-2 transition-colors duration-150 ${isShuffled ? 'text-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface'}`}
              title="Shuffle"
            >
              <Shuffle size={16} />
            </button>
            
            <div className="flex items-center gap-6">
              <button 
                onClick={previousTrack}
                className="p-2 text-white hover:text-brand-primary transition-colors active:scale-95"
                title="Previous Track"
              >
                <SkipBack size={26} fill="white" />
              </button>
              
              <button 
                onClick={togglePlay}
                className="w-16 h-16 bg-brand-primary text-brand-on-primary rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-lg shadow-brand-primary/20 shrink-0"
                id="btn-play-pause-expanded"
              >
                {isPlaying ? (
                  <Pause size={24} fill="currentColor" />
                ) : (
                  <Play size={24} className="ml-1" fill="currentColor" />
                )}
              </button>

              <button 
                onClick={nextTrack}
                className="p-2 text-white hover:text-brand-primary transition-colors active:scale-95"
                title="Next Track"
              >
                <SkipForward size={26} fill="white" />
              </button>
            </div>

            <button 
              onClick={toggleLoop}
              className={`p-2 transition-colors duration-150 ${isLooping ? 'text-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface'}`}
              title="Repeat"
            >
              <Repeat size={16} />
            </button>
          </div>
        </div>

        {/* Right Side: Lyrics Panels & Casting Options */}
        <div className="w-full flex flex-col gap-6 h-full md:max-h-[580px]">
          
          {/* Synchronized Scrolling Lyrics Module */}
          <div className="bg-white/[0.02] backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col h-[340px] md:h-[420px] relative overflow-hidden group shadow-2xl">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/5">
              <div className="flex items-center gap-1.5">
                <Music4 size={14} className="text-brand-primary animate-pulse" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-brand-on-surface">Lyrics</h3>
              </div>
              <button 
                onClick={() => setShowFullLyrics(!showFullLyrics)}
                className="text-[10px] font-extrabold uppercase tracking-widest text-brand-primary hover:underline"
              >
                {showFullLyrics ? "Auto Scroll" : "Full view"}
              </button>
            </div>

            {/* Scrolling Lyrics Area */}
            <div 
              ref={lyricsContainerRef}
              className={`flex-1 overflow-y-auto pr-3 space-y-5 custom-scrollbar ${showFullLyrics ? '' : 'mask-gradient'}`}
              style={{ scrollBehavior: 'smooth' }}
            >
              {currentTrack.lyrics.map((line, idx) => {
                const isActive = idx === activeLineIndex;
                return (
                  <p
                    key={`lyric-line-${idx}`}
                    ref={isActive ? activeLineRef : null}
                    onClick={() => seek(line.time)}
                    className={`text-base md:text-lg font-bold leading-relaxed cursor-pointer transition-all duration-300 origin-left ${
                      isActive 
                        ? 'text-white text-lg scale-100 opacity-100 py-1 font-extrabold shadow-brand-primary/10 drop-shadow-md border-l-2 border-brand-primary pl-2' 
                        : 'text-brand-on-surface-variant/40 hover:text-white/60 hover:opacity-100 text-base scale-95 opacity-60 pl-2 border-l border-transparent'
                    }`}
                  >
                    {line.text}
                  </p>
                );
              })}
            </div>
            
            {/* Visual bottom fade overlay */}
            {!showFullLyrics && (
              <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-brand-surface to-transparent pointer-events-none" />
            )}
          </div>

          {/* Casting, Devices, Sharing, Volume panel */}
          <div className="bg-white/[0.02] backdrop-blur-xl rounded-2xl p-5 border border-white/10 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-5 shrink-0">
                <button 
                  onClick={() => alert('Casting stream... Select output:\n1. Studio Pro 2 (Active)\n2. living Room Speaker\n3. Chrome Audio dongle')}
                  className="flex flex-col items-center gap-1 transition-transform hover:scale-105 active:scale-95 group text-left"
                >
                  <div className="flex items-center gap-1.5 text-brand-primary font-bold">
                    <Laptop size={14} />
                    <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Studio Pro 2</span>
                  </div>
                </button>
                <div className="w-[1px] h-6 bg-white/10 shrink-0" />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(window.location.href);
                    alert('Token URL copy successful! Share this cyber stream block with other nodes.');
                  }}
                  className="flex items-center gap-1.5 text-brand-on-surface-variant hover:text-brand-primary transition-colors font-bold"
                >
                  <Share2 size={13} />
                  <span className="text-[10px] uppercase font-bold tracking-wider font-mono">Share Stream</span>
                </button>
              </div>

              {/* Volume Scrubber bar */}
              <div className="flex items-center gap-2 flex-1 justify-end max-w-[130px] ml-4">
                <button 
                  onClick={toggleMute}
                  className="text-brand-on-surface-variant hover:text-brand-primary transition-colors p-1"
                >
                  {isMuted ? <VolumeX size={15} /> : volume < 0.3 ? <Volume1 size={15} /> : <Volume2 size={15} />}
                </button>
                <input 
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="w-full accent-brand-primary hover:accent-brand-primary-container cursor-pointer h-1"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Up Next Quick Drawer Footer */}
      <footer className="w-full mt-12 flex justify-center items-center px-6">
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-brand-surface-container-high border border-white/5 px-6 py-2.5 rounded-full flex items-center gap-3 shadow-xl cursor-pointer hover:bg-brand-surface-container transition-colors max-w-sm w-full font-sans justify-center"
          onClick={onOpenQueue}
        >
          <div className="w-2 h-2 rounded-full bg-brand-primary animate-ping shrink-0" />
          <span className="text-[10px] font-bold text-brand-on-surface-variant uppercase tracking-wider font-mono">Up Next:</span>
          <span className="text-xs font-bold text-white truncate max-w-[150px]">
            {queue.length > 0 ? queue[0].title : nextTrackInQueue.title}
          </span>
          <span className="text-xs text-brand-on-surface-variant/70 shrink-0">
            by {queue.length > 0 ? queue[0].artist : nextTrackInQueue.artist}
          </span>
        </motion.div>
      </footer>
    </div>
  );
};
