/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, AudioContextType } from '../types';
import { ALL_TRACKS } from '../data';
import { fetchTracksFromFirestore, signInAnonymouslyUser } from '../firebase/services';

const AudioContextInstance = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tracks, setTracks] = useState<Track[]>(ALL_TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentTime, setCurrentTime] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [volume, setVolumeState] = useState<number>(0.75);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isLooping, setIsLooping] = useState<boolean>(false);
  const [isShuffled, setIsShuffled] = useState<boolean>(false);
  
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('music_player_favorites');
    // Default cybernetic pulse to favorite
    return saved ? JSON.parse(saved) : ['track-1'];
  });
  
  const [recentlyPlayed, setRecentlyPlayed] = useState<string[]>(() => {
    const saved = localStorage.getItem('music_player_recent');
    return saved ? JSON.parse(saved) : ['track-1', 'track-2', 'track-3'];
  });
  
  const [queue, setQueue] = useState<Track[]>([]);
  const [isLoadingTracks, setIsLoadingTracks] = useState<boolean>(true);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const isInitializingRef = useRef<boolean>(false);

  const currentTrack = tracks[currentTrackIndex] || ALL_TRACKS[0];

  useEffect(() => {
    const initFirebaseData = async () => {
      setIsLoadingTracks(true);
      await signInAnonymouslyUser();
      const fetchedTracks = await fetchTracksFromFirestore();
      if (fetchedTracks && fetchedTracks.length > 0) {
        setTracks(fetchedTracks);
      }
      setIsLoadingTracks(false);
    };
    initFirebaseData();
  }, []);

  useEffect(() => {
    // Create audio element
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audioRef.current = audio;

    const onTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const onDurationChange = () => {
      setDuration(audio.duration || currentTrack.durationSec || 0);
    };

    const onEnded = () => {
      if (isLooping) {
        audio.currentTime = 0;
        audio.play().catch(() => setIsPlaying(false));
      } else {
        nextTrack();
      }
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('durationchange', onDurationChange);
    audio.addEventListener('ended', onEnded);

    // Load first track but don't play automatically (requires user action)
    audio.src = currentTrack.audioUrl;
    audio.load();

    return () => {
      audio.pause();
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('durationchange', onDurationChange);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  // Update audio source when track changes
  useEffect(() => {
    if (audioRef.current) {
      const wasPlaying = isPlaying;
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.load();
      
      // Update recently played
      setRecentlyPlayed(prev => {
        const filtered = prev.filter(id => id !== currentTrack.id);
        const updated = [currentTrack.id, ...filtered].slice(0, 10);
        localStorage.setItem('music_player_recent', JSON.stringify(updated));
        return updated;
      });

      if (wasPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Playback prevented or error: ", err);
            setIsPlaying(false);
          });
        }
      } else {
        setCurrentTime(0);
      }
    }
  }, [currentTrackIndex]);

  // Handle playing state
  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        initAudioContext();
        audioRef.current.play().catch((err) => {
          console.warn("Playback failed: ", err);
          setIsPlaying(false);
        });
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  // Sync volume & mute
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const initAudioContext = () => {
    if (isInitializingRef.current) return;
    isInitializingRef.current = true;

    if (audioRef.current && !audioContextRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        if (AudioCtx) {
          const audioCtx = new AudioCtx();
          const analyser = audioCtx.createAnalyser();
          analyser.fftSize = 256;
          
          const source = audioCtx.createMediaElementSource(audioRef.current);
          source.connect(analyser);
          analyser.connect(audioCtx.destination);
          
          audioContextRef.current = audioCtx;
          analyserRef.current = analyser;
          sourceRef.current = source;
        }
      } catch (err) {
        console.warn("Web Audio API not fully available/blocked due to CORS. Using dynamic visualizer fallback.", err);
      }
    }
    
    if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    isInitializingRef.current = false;
  };

  const togglePlay = () => {
    initAudioContext();
    setIsPlaying(prev => !prev);
  };

  const playTrack = (track: Track) => {
    initAudioContext();
    // Check if the track exists in current tracklist
    const existingIndex = tracks.findIndex(t => t.id === track.id);
    if (existingIndex !== -1) {
      setCurrentTrackIndex(existingIndex);
    } else {
      // Add to tracklist
      const newTracks = [...tracks];
      newTracks.splice(currentTrackIndex + 1, 0, track);
      setTracks(newTracks);
      setCurrentTrackIndex(currentTrackIndex + 1);
    }
    setIsPlaying(true);
  };

  const playPlaylist = (playlist: Playlist) => {
    initAudioContext();
    if (playlist.songs.length > 0) {
      setTracks(playlist.songs);
      setCurrentTrackIndex(0);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (queue.length > 0) {
      const nextFromQueue = queue[0];
      setQueue(prev => prev.slice(1));
      playTrack(nextFromQueue);
      return;
    }

    if (isShuffled) {
      const randomIndex = Math.floor(Math.random() * tracks.length);
      setCurrentTrackIndex(randomIndex);
    } else {
      setCurrentTrackIndex(prev => (prev + 1) % tracks.length);
    }
    setIsPlaying(true);
  };

  const previousTrack = () => {
    if (audioRef.current && audioRef.current.currentTime > 3) {
      audioRef.current.currentTime = 0;
      setCurrentTime(0);
    } else {
      setCurrentTrackIndex(prev => (prev - 1 + tracks.length) % tracks.length);
    }
    setIsPlaying(true);
  };

  const seek = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const setVolume = (val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (clamped > 0) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
  };

  const toggleLoop = () => {
    setIsLooping(prev => !prev);
  };

  const toggleShuffle = () => {
    setIsShuffled(prev => !prev);
  };

  const toggleFavorite = (trackId: string) => {
    setFavorites(prev => {
      const updated = prev.includes(trackId)
        ? prev.filter(id => id !== trackId)
        : [...prev, trackId];
      localStorage.setItem('music_player_favorites', JSON.stringify(updated));
      return updated;
    });
  };

  const addToQueue = (track: Track) => {
    setQueue(prev => [...prev, track]);
  };

  return (
    <AudioContextInstance.Provider
      value={{
        tracks,
        currentTrack,
        currentTrackIndex,
        isPlaying,
        currentTime,
        duration,
        volume,
        isMuted,
        isLooping,
        isShuffled,
        favorites,
        recentlyPlayed,
        queue,
        togglePlay,
        playTrack,
        playPlaylist,
        nextTrack,
        previousTrack,
        seek,
        setVolume,
        toggleMute,
        toggleLoop,
        toggleShuffle,
        toggleFavorite,
        addToQueue,
        audioRef,
        audioContextRef,
        analyserRef
      }}
    >
      {children}
    </AudioContextInstance.Provider>
  );
};

export const useAudio = () => {
  const context = useContext(AudioContextInstance);
  if (context === undefined) {
    throw new Error('useAudio must be used within an AudioProvider');
  }
  return context;
};
