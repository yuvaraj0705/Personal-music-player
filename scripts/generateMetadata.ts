import fs from 'fs';
import path from 'path';
import * as mm from 'music-metadata';

const publicDir = path.join(process.cwd(), 'public');
const songsDir = path.join(publicDir, 'songs');
const coversDir = path.join(publicDir, 'covers');
const dataFile = path.join(process.cwd(), 'src', 'data.ts');

const DEFAULT_COVER = '/covers/playlist-discover-weekly.jpg';

const formatDuration = (seconds: number): string => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
};

const generate = async () => {
  if (!fs.existsSync(songsDir)) return;
  
  const files = fs.readdirSync(songsDir).filter(f => f.endsWith('.mp3'));
  
  const tracks = [];
  let trackIdCounter = 1;

  for (const file of files) {
    const filePath = path.join(songsDir, file);
    try {
      const metadata = await mm.parseFile(filePath);
      // Prioritize the file name over embedded ID3 tags, since users often rename files
      const title = path.basename(file, '.mp3').replace(/_/g, ' ');
      const artist = metadata.common.artist || 'Unknown Artist';
      const album = metadata.common.album || 'Unknown Album';
      const durationSec = metadata.format.duration ? Math.floor(metadata.format.duration) : 180; // 3 min default
      
      const basename = path.basename(file, '.mp3');
      
      // Look for a cover image with the same base name
      let coverUrl = DEFAULT_COVER;
      if (fs.existsSync(path.join(coversDir, `${basename}.jpg`))) {
        coverUrl = `/covers/${basename}.jpg`;
      } else if (fs.existsSync(path.join(coversDir, `${basename}.png`))) {
        coverUrl = `/covers/${basename}.png`;
      } else if (fs.existsSync(path.join(coversDir, `track-${trackIdCounter}.jpg`))) {
        // Fallback to the generic track covers we already downloaded
        coverUrl = `/covers/track-${trackIdCounter}.jpg`;
      }

      tracks.push({
        id: `local-track-${trackIdCounter}`,
        title,
        artist,
        album,
        duration: formatDuration(durationSec),
        durationSec,
        audioUrl: `/songs/${file}`,
        albumArt: coverUrl,
        lyrics: [{ text: "Playing local audio...", time: 0 }]
      });

      trackIdCounter++;
    } catch (e) {
      console.error(`Error parsing ${file}:`, e);
    }
  }

  // Rewrite data.ts with the new tracks
  let content = fs.readFileSync(dataFile, 'utf-8');
  
  // We will replace the ALL_TRACKS array definition.
  // It's safer to just inject the new objects. 
  // Let's create a robust regex replacement or just string builder.
  
  const tracksJsonString = JSON.stringify(tracks, null, 2).replace(/"([^"]+)":/g, '$1:');
  
  content = content.replace(/export const ALL_TRACKS: Track\[\] = \[[\s\S]*?\];/, `export const ALL_TRACKS: Track[] = ${tracksJsonString};`);
  
  // Also we should ensure DISCOVER_WEEKLY is still valid (it references TRACK_MIDNIGHT_CITY which we might have removed).
  // The original data.ts exported individual track objects. Let's just remove them and only export ALL_TRACKS, and redefine playlists to just use tracks from ALL_TRACKS.
  
  // Actually, to make it completely safe and avoid breaking exports, let's just rewrite data.ts fully.
  
  const newContent = `/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Track, Playlist } from './types';

export const USER_AVATAR = "/covers/user-avatar.jpg";

export const ALL_TRACKS: Track[] = ${tracksJsonString};
`;

  fs.writeFileSync(dataFile, newContent);
  console.log("Metadata generated and data.ts updated successfully!");
};

generate();
