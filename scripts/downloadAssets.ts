import fs from 'fs';
import path from 'path';
import https from 'https';
import { ALL_TRACKS, ALL_PLAYLISTS, USER_AVATAR } from '../src/data';

const downloadFile = (url: string, dest: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    if (!url || !url.startsWith('http')) {
      console.warn(`Skipping invalid URL: ${url}`);
      return resolve();
    }
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to get '${url}' (${response.statusCode})`));
        return;
      }
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
};

const main = async () => {
  const publicDir = path.join(process.cwd(), 'public');
  const songsDir = path.join(publicDir, 'songs');
  const coversDir = path.join(publicDir, 'covers');

  if (!fs.existsSync(songsDir)) fs.mkdirSync(songsDir, { recursive: true });
  if (!fs.existsSync(coversDir)) fs.mkdirSync(coversDir, { recursive: true });

  console.log('Downloading User Avatar...');
  await downloadFile(USER_AVATAR, path.join(coversDir, 'user-avatar.jpg')).catch(console.error);

  for (const track of ALL_TRACKS) {
    console.log(`Downloading track: ${track.id}...`);
    await downloadFile(track.audioUrl, path.join(songsDir, `${track.id}.mp3`)).catch(console.error);
    await downloadFile(track.albumArt, path.join(coversDir, `${track.id}.jpg`)).catch(console.error);
  }

  for (const playlist of ALL_PLAYLISTS) {
    console.log(`Downloading playlist cover: ${playlist.id}...`);
    await downloadFile(playlist.img, path.join(coversDir, `${playlist.id}.jpg`)).catch(console.error);
  }
  
  console.log(`Downloading playlist cover: playlist-discover-weekly...`);
  await downloadFile("https://lh3.googleusercontent.com/aida-public/AB6AXuAFwbfoaPenxa1hb9h9nylZS9VcI1cSO_FaPOeAH76zWC5PvKeNRVsot81YamTBT0nBq2jK8We1FoONzXYDiEd8i_nKtIQjGnVPT-ua27Ae4992FYiEf6vDOL2h4aOawpN1Y8JHSqNeLX0w736RfO-lCSY2C3akxFpB4srmKwvtWt6Eip27aJI2eosLQnJ_JWctOCSRx3dUOdSVaY_IR-Mk2BuhjoFlMtcnpWOIMxuqJbROiy40-kB4g0A4Ra2j3ZJLUVLKUBse1vQ", path.join(coversDir, 'playlist-discover-weekly.jpg')).catch(console.error);

  console.log('All downloads completed!');
};

main();
