/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { useAudio } from '../context/AudioContext';

interface VisualizerProps {
  className?: string;
  type?: 'bars' | 'wave' | 'retro-dots';
}

export const Visualizer: React.FC<VisualizerProps> = ({ className, type = 'wave' }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { isPlaying, analyserRef, currentTime } = useAudio();
  const animationRef = useRef<number | null>(null);
  const phraseRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resizing
    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        canvas.width = entry.contentRect.width * window.devicePixelRatio;
        canvas.height = entry.contentRect.height * window.devicePixelRatio;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    // Set initial size
    canvas.width = canvas.clientWidth * window.devicePixelRatio;
    canvas.height = canvas.clientHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const dataArray = new Uint8Array(128);

    const render = () => {
      const width = canvas.width / window.devicePixelRatio;
      const height = canvas.height / window.devicePixelRatio;

      // Clear with dark transparent layer to create trails
      ctx.fillStyle = 'rgba(19, 19, 19, 0.2)';
      ctx.fillRect(0, 0, width, height);

      const analyser = analyserRef.current;
      let hasRealData = false;

      if (analyser && isPlaying) {
        analyser.getByteFrequencyData(dataArray);
        // Check if data is not empty (e.g. not blocked by CORS)
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        if (sum > 0) {
          hasRealData = true;
        }
      }

      // Procedural/reactive phase increment
      if (isPlaying) {
        phraseRef.current += 0.08;
      }

      if (type === 'wave') {
        // Draw elegant glowing sine waveform (Oscilloscope)
        ctx.beginPath();
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = '#53e076';
        ctx.shadowBlur = 15;
        ctx.shadowColor = 'rgba(83, 224, 118, 0.8)';

        const points = 80;
        const sliceWidth = width / points;

        for (let i = 0; i <= points; i++) {
          const x = i * sliceWidth;
          let amplitude = 0;

          if (hasRealData) {
            const dataIndex = Math.floor((i / points) * dataArray.length);
            amplitude = (dataArray[dataIndex] / 255) * (height * 0.4);
          } else {
            // High-fidelity multi-octave kinetic wave function simulation
            if (isPlaying) {
              const baseSin = Math.sin(i * 0.15 - phraseRef.current);
              const subSin = Math.sin(i * 0.05 + phraseRef.current * 0.5);
              amplitude = (baseSin * 0.6 + subSin * 0.4) * (height * 0.25);
            } else {
              amplitude = Math.sin(i * 0.2) * 1.5; // Very subtle calm breathing when paused
            }
          }

          // Apply envelope to taper edges
          const envelope = Math.sin((i / points) * Math.PI);
          const y = height / 2 + amplitude * envelope;

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }

        ctx.stroke();
        ctx.shadowBlur = 0; // Reset shadow

      } else if (type === 'bars') {
        // Draw elegant glowing spectral vertical bars
        const barWidth = (width / 40) - 2;
        const barCount = 40;
        ctx.fillStyle = '#53e076';
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(83, 224, 118, 0.5)';

        for (let i = 0; i < barCount; i++) {
          const x = i * (barWidth + 2);
          let val = 0;

          if (hasRealData) {
            const dataIndex = Math.floor((i / barCount) * dataArray.length);
            val = (dataArray[dataIndex] / 255) * height;
          } else {
            // Elegant mathematical sound simulation
            if (isPlaying) {
              const sinVal = Math.sin(i * 0.3 - phraseRef.current * 1.2);
              const noiseVal = Math.cos(i * 0.7 + phraseRef.current * 2.1) * 0.3;
              val = Math.max(2, (sinVal * 0.6 + 0.4 + noiseVal) * height * 0.6);
            } else {
              val = 2 + Math.abs(Math.sin(i * 0.5)) * 3;
            }
          }

          // Scale height by symmetrical envelope
          const envelope = Math.sin((i / barCount) * Math.PI);
          const barHeight = val * envelope;
          const y = height - barHeight;

          // Create slight vertical gradient
          const gradient = ctx.createLinearGradient(x, y, x, height);
          gradient.addColorStop(0, '#72fe8f'); // Highlight green top
          gradient.addColorStop(0.5, '#53e076');
          gradient.addColorStop(1, '#006e2d'); // Deep support green bottom
          ctx.fillStyle = gradient;

          ctx.beginPath();
          ctx.roundRect(x, y, barWidth, barHeight, { topLeft: 2, topRight: 2, bottomLeft: 0, bottomRight: 0 });
          ctx.fill();
        }
        ctx.shadowBlur = 0;

      } else if (type === 'retro-dots') {
        // Starfield style dancing cybernetic matrix
        const columns = 28;
        const rows = 12;
        const cellWidth = width / columns;
        const cellHeight = height / rows;

        for (let col = 0; col < columns; col++) {
          let columnLevel = 0;
          if (hasRealData) {
            const dataIndex = Math.floor((col / columns) * dataArray.length);
            columnLevel = (dataArray[dataIndex] / 255) * rows;
          } else {
            if (isPlaying) {
              columnLevel = (Math.sin(col * 0.4 - phraseRef.current * 1.5) * 0.5 + 0.5) * rows * 0.8;
            } else {
              columnLevel = 1;
            }
          }

          for (let row = 0; row < rows; row++) {
            const active = (rows - row) <= columnLevel;
            const x = col * cellWidth + cellWidth / 2;
            const y = row * cellHeight + cellHeight / 2;
            const size = active ? 3 : 1;

            ctx.fillStyle = active ? '#53e076' : 'rgba(255, 255, 255, 0.05)';
            ctx.shadowBlur = active ? 6 : 0;
            ctx.shadowColor = '#53e076';

            ctx.beginPath();
            ctx.arc(x, y, size, 0, Math.PI * 2);
            ctx.fill();
          }
        }
        ctx.shadowBlur = 0;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      resizeObserver.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [type, isPlaying, analyserRef]);

  return (
    <div className={`relative overflow-hidden w-full h-full rounded-xl ${className}`}>
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
};
