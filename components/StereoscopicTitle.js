'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * StereoscopicTitle
 * Recreates the exact high-fashion editorial dual-offset typography effect:
 * - Razor-sharp pure white (#FFFFFF) serif foreground text.
 * - Deep offset vivid violet/purple (#A855F7) shadow layer with neon bloom.
 * - Interactive pointer parallax using gsap.quickTo.
 * - Kinetic split-letter rotational bounce and elastic snap-back on hover.
 */
export default function StereoscopicTitle({
  text = 'RAILSYNC',
  className = '',
  shadowColor = '#A855F7',
  glowColor = 'rgba(168, 85, 247, 0.7)',
}) {
  const containerRef = useRef(null);
  const shadowLayersRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // 1. Entrance Stagger Animation on Mount
    const letters = container.querySelectorAll('.stereo-letter-box');
    gsap.fromTo(
      letters,
      {
        y: -50,
        opacity: 0,
        scale: 0.8,
        rotation: () => gsap.utils.random(-15, 15),
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        stagger: 0.045,
        duration: 0.85,
        ease: 'back.out(2)',
      }
    );

    // 2. Parallax Pointer Movement for the Purple Offset Shadow Layer
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ... +0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Base offset: -7px X, +8px Y matching reference image
      const targetX = -7 + relX * 10;
      const targetY = 8 + relY * 8;

      shadowLayersRef.current.forEach((layer) => {
        if (layer) {
          gsap.to(layer, {
            x: targetX,
            y: targetY,
            duration: 0.3,
            ease: 'power2.out',
            overwrite: 'auto',
          });
        }
      });
    };

    const handleMouseLeave = () => {
      // Return to resting offset
      shadowLayersRef.current.forEach((layer) => {
        if (layer) {
          gsap.to(layer, {
            x: -7,
            y: 8,
            duration: 0.6,
            ease: 'elastic.out(1.1, 0.4)',
            overwrite: 'auto',
          });
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) container.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  const handleLetterHover = (e) => {
    const box = e.currentTarget;
    if (!box || box.dataset.animating === 'true') return;
    box.dataset.animating = 'true';

    const randomRot = gsap.utils.random(-14, 14);
    const randomY = gsap.utils.random(-12, -20);

    gsap.to(box, {
      y: randomY,
      rotation: randomRot,
      scale: 1.15,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(box, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
          ease: 'elastic.out(1.2, 0.35)',
          onComplete: () => {
            box.dataset.animating = 'false';
          },
        });
      },
    });
  };

  const chars = text.split('');

  return (
    <div
      ref={containerRef}
      className={`relative inline-flex items-center tracking-tight select-none ${className}`}
      aria-label={text}
      style={{
        fontFamily: "'Playfair Display', 'Cinzel', Georgia, serif",
      }}
    >
      {chars.map((char, idx) => (
        <span
          key={idx}
          onMouseEnter={handleLetterHover}
          className="stereo-letter-box relative inline-block cursor-default will-change-transform mr-[0.02em] last:mr-0"
        >
          {/* Layer 1: Vivid Offset Purple Shadow Layer (Matching Reference Image) */}
          <span
            ref={(el) => (shadowLayersRef.current[idx] = el)}
            className="absolute inset-0 select-none pointer-events-none font-black text-[#A855F7] dark:text-[#A855F7]"
            style={{
              transform: 'translate(-7px, 8px)',
              filter: `drop-shadow(0 0 20px ${glowColor}) drop-shadow(0 4px 12px rgba(168, 85, 247, 0.85))`,
              zIndex: 1,
              willChange: 'transform',
            }}
            aria-hidden="true"
          >
            {char}
          </span>

          {/* Layer 2: Razor-Sharp Pure White Foreground Letter */}
          <span
            className="relative z-10 font-black text-white dark:text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
            style={{
              willChange: 'transform',
            }}
          >
            {char}
          </span>
        </span>
      ))}
    </div>
  );
}
