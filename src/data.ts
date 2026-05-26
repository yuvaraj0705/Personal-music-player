/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track, Playlist } from './types';

export const USER_AVATAR = "/covers/user-avatar.jpg";

export const ALL_TRACKS: Track[] = [
  {
    id: "local-track-1",
    title: "anju vanna poove  version 1",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "0:54",
    durationSec: 54,
    audioUrl: "/songs/anju_vanna_poove__version_1.mp3",
    albumArt: "/covers/track-1.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-2",
    title: "dheema dheema",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "1:51",
    durationSec: 111,
    audioUrl: "/songs/dheema_dheema.mp3",
    albumArt: "/covers/track-2.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-3",
    title: "Frangipani raw cover  Uv",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "10:02",
    durationSec: 602,
    audioUrl: "/songs/Frangipani_raw_cover__Uv.mp3",
    albumArt: "/covers/track-3.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-4",
    title: "Kaayam aarume (1)",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "3:07",
    durationSec: 187,
    audioUrl: "/songs/Kaayam_aarume (1).mp3",
    albumArt: "/covers/track-4.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-5",
    title: "Kannu thangom raw audio",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "1:32",
    durationSec: 92,
    audioUrl: "/songs/Kannu_thangom_raw_audio.mp3",
    albumArt: "/covers/track-5.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-6",
    title: "Konjam 1",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "1:30",
    durationSec: 90,
    audioUrl: "/songs/Konjam_1.mp3",
    albumArt: "/covers/track-6.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  },
  {
    id: "local-track-7",
    title: "venpani malare",
    artist: "Unknown Artist",
    album: "Unknown Album",
    duration: "3:53",
    durationSec: 233,
    audioUrl: "/songs/venpani_malare.mp3",
    albumArt: "/covers/playlist-discover-weekly.jpg",
    lyrics: [
      {
        text: "Playing local audio...",
        time: 0
      }
    ]
  }
];

export const DISCOVER_WEEKLY: Track[] = ALL_TRACKS.slice(0, 4);

export const PLAYLIST_LATE_NIGHT_VIBES: Playlist = {
  id: "playlist-1",
  title: "Late Night Vibes",
  songCount: ALL_TRACKS.length,
  img: "/covers/playlist-1.jpg",
  songs: ALL_TRACKS.slice(0, 3)
};

export const PLAYLIST_LO_FI_BEATS: Playlist = {
  id: "playlist-2",
  title: "Lo-Fi Beats",
  songCount: ALL_TRACKS.length,
  img: "/covers/playlist-2.jpg",
  songs: ALL_TRACKS.slice(2, 5)
};

export const PLAYLIST_DAILY_LIFT: Playlist = {
  id: "playlist-3",
  title: "Daily Lift",
  songCount: ALL_TRACKS.length,
  img: "/covers/playlist-3.jpg",
  songs: ALL_TRACKS.slice(1, 4)
};

export const ALL_PLAYLISTS: Playlist[] = [
  PLAYLIST_LATE_NIGHT_VIBES,
  PLAYLIST_LO_FI_BEATS,
  PLAYLIST_DAILY_LIFT
];

export const DISCOVER_WEEKLY_PLAYLIST: Playlist = {
  id: "playlist-discover-weekly",
  title: "Discover Weekly",
  songCount: DISCOVER_WEEKLY.length,
  img: "/covers/playlist-discover-weekly.jpg",
  songs: DISCOVER_WEEKLY
};
