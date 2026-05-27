import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Plus, Edit3, Image, ListPlus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';
import { Track } from '../types';

interface TrackOptionsModalProps {
  track: Track | null;
  onClose: () => void;
}

export const TrackOptionsModal: React.FC<TrackOptionsModalProps> = ({ track, onClose }) => {
  const { playlists, addToPlaylist, updateTrackCover, addToQueue } = useAudio();
  const [view, setView] = useState<'main' | 'add-to-playlist' | 'edit-cover'>('main');
  const [newCoverUrl, setNewCoverUrl] = useState('');

  if (!track) return null;

  const handleEditCover = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoverUrl.trim()) return;
    await updateTrackCover(track.id, newCoverUrl);
    setNewCoverUrl('');
    onClose();
  };

  return (
    <AnimatePresence>
      {track && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
        >
          <motion.div 
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            className="w-full max-w-sm bg-brand-surface-container-high border border-white/10 rounded-2xl p-6 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5">
              <h3 className="text-lg font-bold text-brand-on-surface truncate pr-4">
                {view === 'main' ? track.title : view === 'add-to-playlist' ? 'Add to Playlist' : 'Edit Cover'}
              </h3>
              <button 
                onClick={onClose}
                className="p-1 text-brand-on-surface-variant hover:text-white hover:bg-white/10 rounded-full transition-colors shrink-0"
              >
                <X size={18} />
              </button>
            </div>

            {view === 'main' && (
              <div className="space-y-2">
                <button 
                  onClick={() => setView('add-to-playlist')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-brand-on-surface"
                >
                  <Plus size={18} className="text-brand-primary" />
                  <span className="font-semibold text-sm">Add to Playlist</span>
                </button>
                <button 
                  onClick={() => {
                    addToQueue(track);
                    onClose();
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-brand-on-surface"
                >
                  <ListPlus size={18} className="text-brand-primary" />
                  <span className="font-semibold text-sm">Add to Queue</span>
                </button>
                <button 
                  onClick={() => setView('edit-cover')}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-brand-on-surface"
                >
                  <Edit3 size={18} className="text-brand-primary" />
                  <span className="font-semibold text-sm">Edit Cover Image</span>
                </button>
              </div>
            )}

            {view === 'add-to-playlist' && (
              <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                {playlists.length === 0 ? (
                  <p className="text-sm text-brand-on-surface-variant text-center py-4">
                    No playlists available. Create one in your Library.
                  </p>
                ) : (
                  playlists.map(playlist => (
                    <button 
                      key={playlist.id}
                      onClick={async () => {
                        await addToPlaylist(playlist.id, track);
                        onClose();
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/5 transition-colors text-left"
                    >
                      <div className="w-10 h-10 rounded overflow-hidden shrink-0">
                        <img src={playlist.img} alt={playlist.title} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-semibold text-sm text-brand-on-surface truncate">
                        {playlist.title}
                      </span>
                    </button>
                  ))
                )}
                <div className="mt-4 flex justify-end">
                  <button onClick={() => setView('main')} className="text-xs text-brand-on-surface-variant hover:text-white">
                    Back
                  </button>
                </div>
              </div>
            )}

            {view === 'edit-cover' && (
              <form onSubmit={handleEditCover}>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-brand-on-surface-variant mb-1 uppercase tracking-wider">
                    New Cover Image URL
                  </label>
                  <input 
                    type="url"
                    value={newCoverUrl}
                    onChange={(e) => setNewCoverUrl(e.target.value)}
                    placeholder="https://example.com/image.jpg"
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-brand-on-surface placeholder:text-brand-on-surface-variant/40 outline-none focus:border-brand-primary transition-colors"
                    required
                  />
                  <p className="text-[10px] text-brand-on-surface-variant mt-2">
                    Paste an image link to replace this track's cover art permanently.
                  </p>
                </div>
                <div className="flex justify-between items-center mt-6">
                  <button type="button" onClick={() => setView('main')} className="text-xs text-brand-on-surface-variant hover:text-white">
                    Back
                  </button>
                  <button 
                    type="submit"
                    className="px-4 py-2 rounded-lg font-semibold text-sm bg-brand-primary text-brand-on-primary hover:opacity-90 active:scale-95 transition-all"
                  >
                    Save Cover
                  </button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
