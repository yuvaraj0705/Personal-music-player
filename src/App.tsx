/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Home, 
  Search, 
  Library, 
  Settings, 
  Play, 
  Pause, 
  SkipForward, 
  SkipBack, 
  Heart,
  Music,
  Maximize2
} from 'lucide-react';
import { AudioProvider, useAudio } from './context/AudioContext';
import { HomeTab } from './components/HomeTab';
import { SearchTab } from './components/SearchTab';
import { LibraryTab } from './components/LibraryTab';
import { NowPlayingDetail } from './components/NowPlayingDetail';
import { SettingsModal } from './components/SettingsModal';
import { TrackOptionsModal } from './components/TrackOptionsModal';
import { QueuePanel } from './components/QueuePanel';
import { PlaylistDetailPanel } from './components/PlaylistDetailPanel';
import { USER_AVATAR } from './data';
import { Track } from './types';

function MainLayout() {
  const [activeTab, setActiveTab] = useState<'home' | 'search' | 'library'>('home');
  const [isNowPlayingOpen, setIsNowPlayingOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isQueueOpen, setIsQueueOpen] = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState<string | null>(null);
  const [visualizerType, setVisualizerType] = useState<'bars' | 'wave' | 'retro-dots'>('wave');
  const [ambientGlow, setAmbientGlow] = useState(true);
  const [trackOptionsTrack, setTrackOptionsTrack] = useState<Track | null>(null);

  const { 
    currentTrack, 
    isPlaying, 
    togglePlay, 
    nextTrack, 
    previousTrack, 
    currentTime, 
    duration,
    favorites,
    toggleFavorite
  } = useAudio();

  const isFavorited = favorites.includes(currentTrack.id);

  // Return corresponding tab view content
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeTab 
            onOpenNowPlaying={() => setIsNowPlayingOpen(true)}
            onOpenSettings={() => setIsSettingsOpen(true)}
            onOpenSearch={() => setActiveTab('search')}
            onOpenTrackOptions={(track) => setTrackOptionsTrack(track)}
            onOpenPlaylist={(id) => setActivePlaylistId(id)}
          />
        );
      case 'search':
        return <SearchTab />;
      case 'library':
        return (
          <LibraryTab 
            onOpenTrackOptions={(track) => setTrackOptionsTrack(track)} 
            onOpenPlaylist={(id) => setActivePlaylistId(id)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen text-brand-on-surface bg-black font-sans relative overflow-x-hidden select-none`}>
      
      {/* Absolute Ambient Glow Clouds */}
      <AnimatePresence mode="wait">
        {ambientGlow && (
          <motion.div 
            key={`ambient-${currentTrack.id}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="fixed inset-0 pointer-events-none z-0 overflow-hidden flex items-center justify-center"
          >
            <img 
              src={currentTrack.albumArt} 
              alt=""
              className="absolute w-[150%] h-[150%] object-cover blur-[120px] opacity-40 animate-[pulse_12s_infinite_ease-in-out]"
            />
            {/* Subtle overlay to keep text readable */}
            <div className="absolute inset-0 bg-gradient-to-b from-brand-surface/40 to-brand-surface/80" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header App Bar */}
      <header className="fixed top-0 left-0 w-full z-40 bg-brand-surface/40 dark:bg-brand-surface/40 backdrop-blur-2xl border-b border-white/[0.03] shadow-sm">
        <div className="max-w-5xl mx-auto px-6 h-18 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-brand-primary/10 p-1.5 rounded-lg text-brand-primary">
              <Music size={18} className="animate-pulse" />
            </div>
            <span className="text-md font-bold tracking-tight text-white capitalize font-sans">
              {activeTab === 'home' ? 'Cyber Beats' : activeTab}
            </span>
          </div>

          <div className="flex items-center gap-4">
            {/* Quick settings gear */}
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 text-brand-on-surface-variant hover:text-brand-primary hover:bg-white/5 rounded-full transition-colors active:scale-95 duration-150"
              id="top-settings-trigger"
              title="Player Settings"
            >
              <Settings size={18} />
            </button>

            {/* User Profile Frame */}
            <div 
              onClick={() => {
                alert(`Account status node:\n- User: ryuvaraj861@gmail.com\n- Premium Protocol: Granted\n- Connection: TLS Sec-Key`);
              }}
              className="w-8 h-8 rounded-full overflow-hidden border border-brand-outline-variant cursor-pointer hover:border-brand-primary transition-colors duration-150 shadow"
            >
              <img 
                src={USER_AVATAR} 
                alt="ryuvaraj" 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Main Tab Content Wrapper */}
      <main className="max-w-5xl mx-auto px-6 pt-24 pb-36 relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom Floating Mini Player */}
      <div className="fixed bottom-20 left-0 right-0 z-40 px-4 pointer-events-none">
        <div className="max-w-xl mx-auto pointer-events-auto">
          <motion.div 
            whileHover={{ scale: 1.01, y: -2 }}
            className="bg-brand-surface-container/60 backdrop-blur-2xl rounded-2xl border border-white/10 overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-center justify-between p-3.5 h-17 relative cursor-pointer"
            onClick={() => setIsNowPlayingOpen(true)}
            id="mini-player-card"
          >
            {/* Song Meta info */}
            <div className="flex items-center gap-3.5 min-w-0 flex-1">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-md border border-white/10 shrink-0">
                <img 
                  src={currentTrack.albumArt} 
                  alt={currentTrack.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="min-w-0 pr-3">
                <h6 className="font-bold text-sm text-white truncate leading-tight flex items-center gap-1.5">
                  {currentTrack.title}
                  {isPlaying && (
                    <span className="w-1.5 h-1.5 bg-brand-primary rounded-full animate-ping shrink-0" />
                  )}
                </h6>
                <p className="text-[10px] text-brand-on-surface-variant uppercase tracking-wider font-semibold truncate mt-0.5">
                  {currentTrack.artist}
                </p>
              </div>
            </div>

            {/* Mini controllers */}
            <div className="flex items-center gap-4 shrink-0" onClick={(e) => e.stopPropagation()}>
              <button 
                onClick={() => toggleFavorite(currentTrack.id)}
                className={`p-1.5 hover:bg-white/5 rounded-full transition-colors ${isFavorited ? 'text-brand-primary' : 'text-brand-on-surface-variant hover:text-brand-on-surface'}`}
              >
                <Heart size={15} fill={isFavorited ? "currentColor" : "none"} />
              </button>

              <button 
                onClick={previousTrack}
                className="p-1.5 hover:bg-white/5 rounded-full text-brand-on-surface-variant hover:text-brand-on-surface transition-colors active:scale-90"
              >
                <SkipBack size={15} fill="currentColor" />
              </button>

              <button 
                onClick={togglePlay}
                className="w-9 h-9 rounded-full bg-brand-primary text-brand-on-primary flex items-center justify-center shadow hover:scale-105 active:scale-95 transition-transform"
                id="mini-player-play-btn"
              >
                {isPlaying ? (
                  <Pause size={14} fill="currentColor" />
                ) : (
                  <Play size={14} className="ml-0.5" fill="currentColor" />
                )}
              </button>

              <button 
                onClick={nextTrack}
                className="p-1.5 hover:bg-white/5 rounded-full text-brand-on-surface-variant hover:text-brand-on-surface transition-colors active:scale-90"
              >
                <SkipForward size={15} fill="currentColor" />
              </button>
            </div>

            {/* Sliding Progress Ribbon */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-white/10">
              <div 
                className="h-full bg-brand-primary transition-all duration-100 shadow-[0_0_10px_#53e076]"
                style={{ width: `${((currentTime / (duration || currentTrack.durationSec || 1)) * 100)}%` }}
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Dynamic Navigation Sticky Bar */}
      <nav className="fixed bottom-0 left-0 w-full z-45 h-16 bg-brand-surface-container/60 dark:bg-brand-surface-container/60 backdrop-blur-3xl border-t border-white/[0.03] shadow-2xl flex justify-around items-center px-6">
        
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-transform active:scale-95 ${
            activeTab === 'home' ? 'text-brand-primary font-bold' : 'text-brand-on-surface-variant/70 hover:text-brand-on-surface'
          }`}
          id="nav-tab-home"
        >
          <Home size={18} fill={activeTab === 'home' ? "rgba(83, 224, 118, 0.1)" : "none"} />
          <span className="text-[10px] tracking-wide uppercase">Home</span>
        </button>

        <button 
          onClick={() => setActiveTab('search')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-transform active:scale-95 ${
            activeTab === 'search' ? 'text-brand-primary font-bold' : 'text-brand-on-surface-variant/70 hover:text-brand-on-surface'
          }`}
          id="nav-tab-search"
        >
          <Search size={18} />
          <span className="text-[10px] tracking-wide uppercase">Search</span>
        </button>

        <button 
          onClick={() => setActiveTab('library')}
          className={`flex flex-col items-center justify-center gap-1 w-16 h-full transition-transform active:scale-95 ${
            activeTab === 'library' ? 'text-brand-primary font-bold' : 'text-brand-on-surface-variant/70 hover:text-brand-on-surface'
          }`}
          id="nav-tab-library"
        >
          <Library size={18} fill={activeTab === 'library' ? "rgba(83, 224, 118, 0.1)" : "none"} />
          <span className="text-[10px] tracking-wide uppercase">Library</span>
        </button>

      </nav>

      {/* Full-Screen Now Playing Detail Panel */}
      <AnimatePresence>
        {isNowPlayingOpen && (
          <motion.div
            initial={{ y: "100%", opacity: 0, scale: 0.95 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: "100%", opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 250 }}
            className="fixed inset-0 z-50 overflow-hidden"
          >
            <NowPlayingDetail 
              onMinimize={() => setIsNowPlayingOpen(false)} 
              visualizerType={visualizerType}
              onOpenQueue={() => setIsQueueOpen(true)}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Modal controller */}
      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        visualizerType={visualizerType}
        setVisualizerType={setVisualizerType}
        ambientGlow={ambientGlow}
        setAmbientGlow={setAmbientGlow}
      />

      <TrackOptionsModal 
        track={trackOptionsTrack}
        onClose={() => setTrackOptionsTrack(null)}
      />

      <QueuePanel 
        isOpen={isQueueOpen}
        onClose={() => setIsQueueOpen(false)}
      />

      <PlaylistDetailPanel 
        playlistId={activePlaylistId}
        onClose={() => setActivePlaylistId(null)}
        onOpenTrackOptions={(track) => setTrackOptionsTrack(track)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AudioProvider>
      <MainLayout />
    </AudioProvider>
  );
}
