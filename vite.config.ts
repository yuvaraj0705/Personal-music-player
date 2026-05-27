import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';
import { exec } from 'child_process';
import fs from 'fs';

const watchSongsPlugin = () => ({
  name: 'watch-songs-dir',
  configureServer(server: any) {
    const songsDir = path.resolve(__dirname, 'public/songs');
    if (fs.existsSync(songsDir)) {
      // Use chokidar which is built into Vite's server.watcher
      server.watcher.add(songsDir);
      server.watcher.on('add', (file: string) => {
        if (file.includes('public/songs') && file.endsWith('.mp3')) {
          console.log(`[watch-songs] New song detected: ${file}. Regenerating metadata...`);
          exec('npx tsx scripts/generateMetadata.ts', (err, stdout) => {
            if (err) console.error('[watch-songs] Error generating metadata:', err);
            else console.log('[watch-songs] Metadata regenerated successfully.');
          });
        }
      });
      server.watcher.on('unlink', (file: string) => {
        if (file.includes('public/songs') && file.endsWith('.mp3')) {
          console.log(`[watch-songs] Song removed: ${file}. Regenerating metadata...`);
          exec('npx tsx scripts/generateMetadata.ts');
        }
      });
    }
  }
});

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), watchSongsPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
