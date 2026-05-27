import { signInAnonymously, User } from 'firebase/auth';
import { collection, getDocs, doc, setDoc, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from './config';
import { Track, Playlist } from '../types';
import { ALL_TRACKS } from '../data';

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
      console.warn("No playlists found in Firestore.");
      return [];
    }

    const playlistsList = playlistsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Playlist));
    
    return playlistsList;
  } catch (error) {
    console.error("Error fetching playlists from Firestore:", error);
    return [];
  }
};

// --- Personal Library Write Operations ---

export const createPlaylistInFirestore = async (playlist: Playlist): Promise<boolean> => {
  try {
    const playlistDoc = doc(db, 'playlists', playlist.id);
    await setDoc(playlistDoc, playlist);
    return true;
  } catch (error) {
    console.error("Error creating playlist:", error);
    return false;
  }
};

export const deletePlaylistFromFirestore = async (playlistId: string): Promise<boolean> => {
  try {
    const playlistDoc = doc(db, 'playlists', playlistId);
    await deleteDoc(playlistDoc);
    return true;
  } catch (error) {
    console.error("Error deleting playlist:", error);
    return false;
  }
};

export const updatePlaylistSongsInFirestore = async (playlistId: string, songs: Track[]): Promise<boolean> => {
  try {
    const playlistDoc = doc(db, 'playlists', playlistId);
    await updateDoc(playlistDoc, { 
      songs, 
      songCount: songs.length 
    });
    return true;
  } catch (error) {
    console.error("Error updating playlist songs:", error);
    return false;
  }
};

export const updateTrackCoverInFirestore = async (trackId: string, newCoverUrl: string): Promise<boolean> => {
  try {
    const trackDoc = doc(db, 'tracks', trackId);
    await updateDoc(trackDoc, { albumArt: newCoverUrl });
    return true;
  } catch (error) {
    console.error("Error updating track cover:", error);
    return false;
  }
};
