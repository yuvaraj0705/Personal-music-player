import fs from 'fs';
import path from 'path';

let content = fs.readFileSync(path.join(process.cwd(), 'src', 'data.ts'), 'utf-8');
content = content.replace(/export const USER_AVATAR = ".*";/, 'export const USER_AVATAR = "/covers/user-avatar.jpg";');

const trackIds = [1, 2, 3, 4, 5, 6];
for (const id of trackIds) {
  content = content.replace(new RegExp(`albumArt: ".*",\\s*duration: "(.*)",\\s*durationSec: (.*),\\s*audioUrl: ".*",`), 
    `albumArt: "/covers/track-${id}.jpg",\n  duration: "$1",\n  durationSec: $2,\n  audioUrl: "/songs/track-${id}.mp3",`);
}

const playlists = [1, 2, 3];
for (const id of playlists) {
  content = content.replace(new RegExp(`id: "playlist-${id}",\\s*title: "(.*)",\\s*songCount: (.*),\\s*img: ".*",`),
    `id: "playlist-${id}",\n  title: "$1",\n  songCount: $2,\n  img: "/covers/playlist-${id}.jpg",`);
}

content = content.replace(/img: ".*",\n\s*songs: DISCOVER_WEEKLY/, 'img: "/covers/playlist-discover-weekly.jpg",\n  songs: DISCOVER_WEEKLY');

fs.writeFileSync(path.join(process.cwd(), 'src', 'data.ts'), content);
console.log("data.ts updated successfully");
