<div align="center">
  <h1>🎵 Uv's Concert</h1>
  <p><b>High-Fidelity Cyber Music Player</b></p>
  <p><i>A stunning, cinematic, and lightning-fast web music player built with React, Vite, and TailwindCSS.</i></p>
</div>

---

## ✨ Features

- **Cinematic UI/UX:** Gorgeous frosted glassmorphism, dynamic glowing backgrounds based on album art, and buttery-smooth animations powered by Motion (Framer Motion).
- **Progressive Web App (PWA):** Installable on iOS and Android devices directly from the browser for a native-like, fullscreen mobile experience.
- **Local-First Architecture:** Playlists and queues are saved instantly to your device's `localStorage` ensuring blazing-fast, offline-capable performance.
- **Smart Queue System:** Add songs to your "Up Next" queue, seamlessly reorder your playback, and view upcoming tracks in a dedicated sliding panel.
- **Immersive Playlists:** Create custom playlists, view them in stunning detail screens, and play entire collections with a single tap.
- **Auto-Sync Metadata:** Drop new `.mp3` files into the `public/songs` directory, and the custom Vite watchdog plugin will automatically generate the metadata and sync it to your app locally!
- **Audio Visualizers:** Switch between multiple real-time audio visualizers (Waveform, Bars, Retro Dots).
- **Synchronized Lyrics:** View beautifully animated, timestamped lyrics that scroll along with the music.

## 🛠 Tech Stack

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS v4
- **Animations:** Motion (Framer Motion)
- **Audio Parsing:** `music-metadata` (for extracting ID3 tags, album art, and duration)
- **Icons:** Lucide React

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/yuvaraj0705/Personal-music-player.git
   cd Personal-music-player
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 🎧 Adding New Music
Adding new music to Uv's Concert is incredibly easy thanks to the automated Vite plugin:

1. Locate the `public/songs/` folder in the project directory.
2. Drag and drop your `.mp3` files into the folder.
3. *If the development server (`npm run dev`) is running*, the custom Vite plugin will immediately detect the new files, extract their metadata (cover art, titles, duration), update the `src/data.ts` file, and reload your browser automatically!

*(Note: If you rename the MP3 files, the app will use the exact filename as the song title.)*

## 📱 Installing on Mobile (PWA)
Uv's Concert is configured as a Progressive Web App. 
1. Navigate to the live deployed URL on your smartphone (Safari for iOS, Chrome for Android).
2. Open the browser menu (Share icon on iOS, 3-dot menu on Android).
3. Select **"Add to Home Screen"**.
4. The app will be installed on your device with a native icon and will launch in full-screen mode without browser UI.

## ☁️ Deployment (Vercel)
This app is fully optimized for Vercel deployment.
1. Push your latest code (including your `.mp3` files) to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. Vercel will automatically detect the Vite framework and deploy the app.
4. Future pushes to GitHub will automatically trigger a new deployment.

---
<div align="center">
  <p>Built with ❤️ for audiophiles and UI enthusiasts.</p>
</div>
