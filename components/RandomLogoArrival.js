'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { Train, Zap, Sparkles } from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';

/**
 * RandomLogoArrival
 * Renders the RailSync brand logo badge with a loading animation where it
 * spawns from a randomized location/angle off-screen and docks into place
 * with an elastic landing bounce and shockwave pulse.
 */
export default function RandomLogoArrival({ className = '' }) {
  const containerRef = useRef(null);
  const logoBoxRef = useRef(null);
  const shockwaveRef = useRef(null);
  const [replayKey, setReplayKey] = useState(0);

  const executeRandomArrival = () => {
    const el = logoBoxRef.current;
    const wave = shockwaveRef.current;
    if (!el) return;

    // Pick random spawn direction & distance
    const angles = [15, 45, 75, 120, 160, 200, 240, 290, 330];
    const pickedAngle = angles[Math.floor(Math.random() * angles.length)] * (Math.PI / 180);
    const distance = gsap.utils.random(450, 750);

    const randomX = Math.cos(pickedAngle) * distance;
    const randomY = Math.sin(pickedAngle) * distance;
    const randomRot = gsap.utils.random(-270, 270);

    // Initial state: spawned off-screen at random coordinates
    gsap.set(el, {
      x: randomX,
      y: randomY,
      rotation: randomRot,
      scale: 0.05,
      opacity: 0,
      filter: 'blur(10px) brightness(2.5)',
    });

    // Fly in and dock into place with physics elastic bounce
    gsap.to(el, {
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      opacity: 1,
      filter: 'blur(0px) brightness(1)',
      duration: 1.35,
      ease: 'elastic.out(1.15, 0.45)',
      onComplete: () => {
        // Shockwave expansion pulse on landing
        if (wave) {
          gsap.fromTo(
            wave,
            { scale: 0.8, opacity: 1, borderColor: '#FFD200' },
            { scale: 2.2, opacity: 0, duration: 0.85, ease: 'power2.out' }
          );
        }
      },
    });
  };

  useEffect(() => {
    // Trigger on initial page load
    const timer = setTimeout(() => {
      executeRandomArrival();
    }, 120);

    return () => clearTimeout(timer);
  }, [replayKey]);

  const handleReplayClick = () => {
    playRailwayChime();
    setReplayKey((k) => k + 1);
  };

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center justify-center ${className}`}
    >
      {/* Expanding Shockwave Ring on Landing */}
      <div
        ref={shockwaveRef}
        className="absolute inset-0 rounded-2xl border-2 border-station-yellow pointer-events-none opacity-0"
        aria-hidden="true"
      />

      {/* Interactive RailSync Locomotive Logo Emblem */}
      <button
        ref={logoBoxRef}
        type="button"
        onClick={handleReplayClick}
        data-cursor="REPLAY"
        aria-label="RailSync Brand Logo (Click to trigger warp arrival animation)"
        className="relative group p-3.5 sm:p-4 rounded-2xl bg-gradient-to-br from-amber-400 via-station-yellow to-amber-500 text-black shadow-[0_10px_35px_rgba(255,210,0,0.55)] border-2 border-amber-300 dark:border-station-yellow hover:scale-110 active:scale-95 transition-transform duration-200 cursor-pointer select-none will-change-transform"
      >
        {/* Glow ambient background aura */}
        <div className="absolute inset-0 rounded-2xl bg-station-yellow/40 blur-xl opacity-80 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="relative z-10 flex items-center justify-center">
          <Train size={36} className="stroke-[2.5] text-black drop-shadow-md" />
          <Zap
            size={16}
            className="absolute -top-1 -right-1 text-black fill-black animate-pulse"
          />
        </div>
      </button>
    </div>
  );
}
