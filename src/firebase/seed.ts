import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { ALL_TRACKS, ALL_PLAYLISTS } from '../data';

/**
 * Utility script to seed the Firestore database with mock data.
 * You can call this function temporarily in App.tsx or run it via a node script if your environment supports it.
 */
export const seedDatabase = async () => {
  try {
    console.log("Seeding tracks...");
    const tracksCollection = collection(db, 'tracks');
    for (const track of ALL_TRACKS) {
      const trackRef = doc(tracksCollection, track.id);
      await setDoc(trackRef, track);
      console.log(`Track ${track.id} seeded.`);
    }

    console.log("Seeding playlists...");
    const playlistsCollection = collection(db, 'playlists');
    for (const playlist of ALL_PLAYLISTS) {
      const playlistRef = doc(playlistsCollection, playlist.id);
      await setDoc(playlistRef, playlist);
      console.log(`Playlist ${playlist.id} seeded.`);
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
