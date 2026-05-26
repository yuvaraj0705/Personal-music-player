/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Settings, Sparkles, Sliders, Info, Zap } from 'lucide-react';
import { useAudio } from '../context/AudioContext';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  visualizerType: 'bars' | 'wave' | 'retro-dots';
  setVisualizerType: (type: 'bars' | 'wave' | 'retro-dots') => void;
  ambientGlow: boolean;
  setAmbientGlow: (val: boolean) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  visualizerType,
  setVisualizerType,
  ambientGlow,
  setAmbientGlow
}) => {
  const { audioRef } = useAudio();
  const [speed, setSpeed] = React.useState<number>(1.0);

  const handleSpeedChange = (newSpeed: number) => {
    setSpeed(newSpeed);
    if (audioRef.current) {
      audioRef.current.playbackRate = newSpeed;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 30 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="w-full max-w-md bg-brand-surface border border-white/10 rounded-2xl p-6 z-10 relative shadow-2xl overflow-hidden"
          >
            {/* Top Close Panel */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-brand-primary">
                <Settings size={18} className="animate-spin-slow" />
                <h3 className="font-bold text-base text-brand-on-surface">Audio Controls</h3>
              </div>
              <button 
                onClick={onClose}
                className="p-1 px-1.5 bg-brand-surface-container hover:bg-brand-surface-container-high rounded-full text-brand-on-surface-variant hover:text-brand-on-surface transition-colors duration-150"
              >
                <X size={16} />
              </button>
            </div>

            {/* Options list */}
            <div className="space-y-6">
              {/* Option 1: Visualizer Selector */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wider">
                  <Zap size={12} />
                  <span>Interactive Visualizer style</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {(['wave', 'bars', 'retro-dots'] as const).map((type) => (
                    <button
                      key={type}
                      onClick={() => setVisualizerType(type)}
                      className={`py-2 px-1 rounded-xl text-xs font-bold border capitalize transition-all ${
                        visualizerType === type 
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary shadow-sm shadow-brand-primary/10' 
                          : 'bg-brand-surface-container border-transparent hover:border-white/10 text-brand-on-surface-variant'
                      }`}
                    >
                      {type === 'retro-dots' ? 'Matrix' : type === 'bars' ? 'Spectrum' : 'Heartbeat'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Option 2: Ambient Background Glow Switch */}
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <div className="space-y-0.5 pr-2">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wider">
                    <Sparkles size={12} />
                    <span>Atmospheric Aura glow</span>
                  </div>
                  <p className="text-[10px] text-brand-on-surface-variant/60">
                    Render colored gradient ambient dust clouds in backgrounds
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAmbientGlow(!ambientGlow)}
                  className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
                    ambientGlow ? 'bg-brand-primary' : 'bg-brand-surface-container border border-white/10'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${
                    ambientGlow ? 'right-0.5' : 'left-0.5'
                  }`} />
                </button>
              </div>

              {/* Option 3: Playback speed */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-on-surface-variant uppercase tracking-wider">
                    <Sliders size={12} />
                    <span>Digital Playback Speed</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-brand-primary">
                    {speed.toFixed(2)}x
                  </span>
                </div>
                <div className="flex gap-2">
                  {[0.5, 1.0, 1.25, 1.5, 2.0].map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSpeedChange(s)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-lg border transition-all ${
                        speed === s 
                          ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                          : 'bg-brand-surface-container border-transparent hover:border-white/10 text-brand-on-surface-variant'
                      }`}
                    >
                      {s === 1.0 ? 'Normal' : `${s}x`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Contributor section */}
              <div className="bg-brand-surface-container rounded-xl p-4 border border-white/5 space-y-1.5">
                <div className="flex items-center gap-1.5 text-brand-on-surface-variant font-semibold text-xs">
                  <Info size={12} />
                  <span>Software Manifest</span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 text-[10px] text-brand-on-surface-variant/70 font-mono">
                  <span>Engine Build:</span> <span className="text-right font-bold text-brand-primary">v5.2.26</span>
                  <span>Audio Sync latency:</span> <span className="text-right">~15ms (Buffer 4k)</span>
                  <span>Sampling:</span> <span className="text-right text-brand-on-surface">48kHz PCM Lossless</span>
                  <span>Codec:</span> <span className="text-right">MPEG Audio Layer III</span>
                </div>
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/5 rounded-full blur-2xl pointer-events-none" />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
