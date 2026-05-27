/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface LyricLine {
  text: string;
  time: number; // in seconds from the start of the song
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  album?: string;
  albumArt: string;
  duration: string; // MM:SS format for display
  durationSec: number; // Duration in seconds
  audioUrl: string;
  lyrics: LyricLine[];
}

export interface Playlist {
  id: string;
  title: string;
  songCount: number;
  img: string;
  songs: Track[];
}

export interface AudioContextType {
  tracks: Track[];
  currentTrack: Track;
  currentTrackIndex: number;
  isPlaying: boolean;
  currentTime: number;
  duration: number;
  volume: number;
  isMuted: boolean;
  isLooping: boolean;
  isShuffled: boolean;
  favorites: string[]; // Track IDs
  recentlyPlayed: string[]; // Track IDs
  queue: Track[];
  playlists: Playlist[];
  togglePlay: () => void;
  playTrack: (track: Track) => void;
  playPlaylist: (playlist: Playlist) => void;
  nextTrack: () => void;
  previousTrack: () => void;
  seek: (time: number) => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
  toggleLoop: () => void;
  toggleShuffle: () => void;
  toggleFavorite: (trackId: string) => void;
  addToQueue: (track: Track) => void;
  createPlaylist: (title: string, imgUrl: string) => void;
  deletePlaylist: (playlistId: string) => void;
  addToPlaylist: (playlistId: string, track: Track) => void;
  removeFromPlaylist: (playlistId: string, trackId: string) => void;
  updateTrackCover: (trackId: string, imgUrl: string) => void;
  removeFromQueue: (index: number) => void;
  clearQueue: () => void;
  reorderQueue: (startIndex: number, endIndex: number) => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  audioContextRef: React.RefObject<AudioContext | null>;
  analyserRef: React.RefObject<AnalyserNode | null>;
}
