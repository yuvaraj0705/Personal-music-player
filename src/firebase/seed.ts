import { collection, doc, setDoc } from 'firebase/firestore';
import { db } from './config';
import { ALL_TRACKS } from '../data';

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

    // We no longer seed mock playlists to allow a fresh personal library
    
    console.log("Database seeded successfully with tracks!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
};
