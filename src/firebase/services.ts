import { signInAnonymously, User } from 'firebase/auth';
import { collection, getDocs } from 'firebase/firestore';
import { auth, db } from './config';
import { Track, Playlist } from '../types';
import { ALL_TRACKS, ALL_PLAYLISTS } from '../data';

export const signInAnonymouslyUser = async (): Promise<User | null> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.error("Error signing in anonymously:", error);
    return null;
  }
};

export const fetchTracksFromFirestore = async (): Promise<Track[]> => {
  try {
    const tracksCollection = collection(db, 'tracks');
    const tracksSnapshot = await getDocs(tracksCollection);
    
    if (tracksSnapshot.empty) {
      console.warn("No tracks found in Firestore, falling back to mock data.");
      return ALL_TRACKS;
    }

    const tracksList = tracksSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Track));
    
    return tracksList;
  } catch (error) {
    console.error("Error fetching tracks from Firestore:", error);
    // Fallback to mock data in case of error (e.g. missing config)
    return ALL_TRACKS;
  }
};

export const fetchPlaylistsFromFirestore = async (): Promise<Playlist[]> => {
  try {
    const playlistsCollection = collection(db, 'playlists');
    const playlistsSnapshot = await getDocs(playlistsCollection);
    
    if (playlistsSnapshot.empty) {
      console.warn("No playlists found in Firestore, falling back to mock data.");
      return ALL_PLAYLISTS;
    }

    const playlistsList = playlistsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Playlist));
    
    return playlistsList;
  } catch (error) {
    console.error("Error fetching playlists from Firestore:", error);
    return ALL_PLAYLISTS;
  }
};
