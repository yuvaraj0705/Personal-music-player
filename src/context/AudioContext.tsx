/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { Track, Playlist, AudioContextType } from '../types';
import { ALL_TRACKS } from '../data';
import { 
  fetchTracksFromFirestore, 
  signInAnonymouslyUser,
  updateTrackCoverInFirestore
} from '../firebase/services';

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
  const [playlists, setPlaylists] = useState<Playlist[]>(() => {
    const saved = localStorage.getItem('music_player_playlists');
    return saved ? JSON.parse(saved) : [];
  });
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

  const savePlaylists = (newPlaylists: Playlist[]) => {
    setPlaylists(newPlaylists);
    localStorage.setItem('music_player_playlists', JSON.stringify(newPlaylists));
  };

  const createPlaylist = async (title: string, imgUrl: string) => {
    const newPlaylist: Playlist = {
      id: `playlist-${Date.now()}`,
      title,
      songCount: 0,
      img: imgUrl || '/covers/playlist-discover-weekly.jpg',
      songs: []
    };
    savePlaylists([...playlists, newPlaylist]);
  };

  const deletePlaylist = async (playlistId: string) => {
    savePlaylists(playlists.filter(p => p.id !== playlistId));
  };

  const addToPlaylist = async (playlistId: string, track: Track) => {
    const playlist = playlists.find(p => p.id === playlistId);
    if (!playlist) return;
    
    if (playlist.songs.some(s => s.id === track.id)) {
      alert("Song is already in this playlist.");
      return;
    }
    
    const updatedSongs = [...playlist.songs, track];
    const updatedPlaylists = playlists.map(p => 
      p.id === playlistId ? { ...p, songs: updatedSongs, songCount: updatedSongs.length } : p
    );
    savePlaylists(updatedPlaylists);
    alert(`Added to ${playlist.title}!`);
  };

  const removeFromPlaylist = (playlistId: string, trackId: string) => {
    const updatedPlaylists = playlists.map(p => {
      if (p.id === playlistId) {
        const updatedSongs = p.songs.filter(s => s.id !== trackId);
        return { ...p, songs: updatedSongs, songCount: updatedSongs.length };
      }
      return p;
    });
    savePlaylists(updatedPlaylists);
  };

  const removeFromQueue = (index: number) => {
    setQueue(prev => {
      const newQueue = [...prev];
      newQueue.splice(index, 1);
      return newQueue;
    });
  };

  const clearQueue = () => {
    setQueue([]);
  };

  const reorderQueue = (startIndex: number, endIndex: number) => {
    setQueue(prev => {
      const result = Array.from(prev);
      const [removed] = result.splice(startIndex, 1);
      result.splice(endIndex, 0, removed);
      return result;
    });
  };

  const updateTrackCover = async (trackId: string, imgUrl: string) => {
    setTracks(prev => prev.map(t => t.id === trackId ? { ...t, albumArt: imgUrl } : t));
    // Also update any playlist that might have this track
    setPlaylists(prev => prev.map(p => ({
      ...p,
      songs: p.songs.map(s => s.id === trackId ? { ...s, albumArt: imgUrl } : s)
    })));
    await updateTrackCoverInFirestore(trackId, imgUrl);
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
        playlists,
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
        createPlaylist,
        deletePlaylist,
        addToPlaylist,
        removeFromPlaylist,
        updateTrackCover,
        removeFromQueue,
        clearQueue,
        reorderQueue,
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
