import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Play, Trash2, ListMusic, ListMinus } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface QueuePanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QueuePanel: React.FC<QueuePanelProps> = ({ isOpen, onClose }) => {
  const { queue, currentTrack, removeFromQueue, clearQueue } = useAudio();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ y: "100%", opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: "100%", opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 200 }}
          className="fixed inset-0 z-[60] bg-brand-surface/95 backdrop-blur-3xl text-brand-on-surface overflow-hidden flex flex-col pt-12 px-6 pb-24"
        >
          {/* Header */}
          <div className="flex justify-between items-center mb-8 shrink-0">
            <h2 className="text-2xl font-black tracking-tight flex items-center gap-2">
              <ListMusic className="text-brand-primary" /> Play Queue
            </h2>
            <button 
              onClick={onClose}
              className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Current Playing Section */}
          <div className="shrink-0 mb-8">
            <h3 className="text-sm font-bold text-brand-primary uppercase tracking-widest mb-4">Now Playing</h3>
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-brand-primary/20 shadow-lg shadow-brand-primary/5">
              <div className="w-16 h-16 rounded-lg overflow-hidden shrink-0 shadow-md">
                <img src={currentTrack.albumArt} alt={currentTrack.title} className="w-full h-full object-cover" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-bold text-lg truncate text-brand-on-surface">{currentTrack.title}</h4>
                <p className="text-sm text-brand-on-surface-variant truncate">{currentTrack.artist}</p>
              </div>
              <div className="flex items-center gap-1.5 shrink-0 px-2">
                <div className="w-1 h-4 bg-brand-primary rounded-full animate-pulse" />
                <div className="w-1 h-6 bg-brand-primary rounded-full animate-pulse delay-75" />
                <div className="w-1 h-3 bg-brand-primary rounded-full animate-pulse delay-150" />
              </div>
            </div>
          </div>

          {/* Up Next Section */}
          <div className="flex justify-between items-center mb-4 shrink-0">
            <h3 className="text-sm font-bold text-brand-on-surface-variant uppercase tracking-widest">Next In Queue</h3>
            {queue.length > 0 && (
              <button 
                onClick={() => {
                  if(confirm("Clear all upcoming songs?")) {
                    clearQueue();
                  }
                }}
                className="text-xs font-semibold text-brand-on-surface-variant hover:text-brand-error transition-colors"
              >
                Clear Queue
              </button>
            )}
          </div>

          {/* Queue List */}
          <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2 pb-10">
            {queue.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-center bg-white/[0.02] rounded-2xl border border-white/5 border-dashed mt-2">
                <ListMinus size={32} className="text-brand-on-surface-variant/30 mb-3" />
                <h3 className="font-bold text-brand-on-surface">Queue is empty</h3>
                <p className="text-xs text-brand-on-surface-variant mt-1 max-w-[200px]">
                  Add songs to your queue using the track options menu.
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <AnimatePresence>
                  {queue.map((track, i) => (
                    <motion.div
                      key={`queue-${track.id}-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center justify-between p-3 rounded-xl hover:bg-white/5 transition-colors group border border-transparent hover:border-white/5"
                    >
                      <div className="flex items-center gap-4 min-w-0 flex-1">
                        <span className="font-mono text-xs w-5 text-center shrink-0 text-brand-on-surface-variant/50">
                          {i + 1}
                        </span>
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0 shadow-sm">
                          <img src={track.albumArt} alt={track.title} className="w-full h-full object-cover" />
                        </div>
                        <div className="min-w-0">
                          <h4 className="font-semibold text-sm truncate text-brand-on-surface">
                            {track.title}
                          </h4>
                          <p className="text-xs text-brand-on-surface-variant truncate mt-0.5">
                            {track.artist}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0 pl-3">
                        <span className="text-xs text-brand-on-surface-variant font-mono mr-2 hidden sm:inline">
                          {track.duration}
                        </span>
                        <button 
                          onClick={() => removeFromQueue(i)}
                          className="p-2 text-brand-on-surface-variant/40 hover:text-brand-error hover:bg-white/10 rounded-full transition-colors"
                          title="Remove from queue"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
