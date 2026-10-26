'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * StereoscopicTitle
 * Implements the exact Poiesis-inspired offset typography & kinetic pop interaction:
 * - Font: "Abril Fatface", Georgia, serif (matching poiesis-2026.vercel.app).
 * - Exact overprint shadow styling: offset at top: 7px, left: -7px with neon text-shadow.
 * - Dual-Theme Support: High-contrast ink slate (#0f172a) in Light Mode, crisp pure white (#ffffff) in Dark Mode.
 * - Exact entrance animation: yPercent: 115, rotate: 7deg, stagger: 0.055s, ease: 'power3.out'.
 * - Kinetic pop interaction on hover: spring lift, rotational jitter, and elastic recovery.
 * - Interactive pointer parallax on the offset overprint layer.
 */
export default function StereoscopicTitle({
  text = 'RAILSYNC',
  className = '',
  shadowColor = '#b84dff',
  glowColor = 'rgba(184, 77, 255, 0.55)',
}) {
  const containerRef = useRef(null);
  const overprintRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters = lettersRef.current.filter(Boolean);
    const overprint = overprintRef.current;

    // 1. Entrance animation identical to poiesis GSAP timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    if (overprint) {
      tl.fromTo(
        overprint,
        { autoAlpha: 0, yPercent: 115, rotate: 4 },
        { autoAlpha: 0.95, yPercent: 0, rotate: 0, duration: 0.8 },
        0
      );
    }

    if (letters.length > 0) {
      tl.fromTo(
        letters,
        {
          autoAlpha: 0,
          yPercent: 115,
          rotate: 7,
          scale: 0.9,
        },
        {
          autoAlpha: 1,
          yPercent: 0,
          rotate: 0,
          scale: 1,
          stagger: 0.055,
          duration: 0.75,
          transformOrigin: '50% 100%',
        },
        0.05
      );
    }

    // 2. Parallax Pointer Movement for the Overprint Shadow Layer
    const handleMouseMove = (e) => {
      if (!overprint) return;
      const rect = container.getBoundingClientRect();
      const relX = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 ... +0.5
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // Base offset: -7px X, +7px Y matching Poiesis
      const targetX = -7 + relX * 8;
      const targetY = 7 + relY * 6;

      gsap.to(overprint, {
        x: targetX + 7, // offset relative to base left: -7px
        y: targetY - 7, // offset relative to base top: 7px
        duration: 0.25,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const handleMouseLeave = () => {
      if (!overprint) return;
      gsap.to(overprint, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1.1, 0.4)',
        overwrite: 'auto',
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (container) container.removeEventListener('mouseleave', handleMouseLeave);
      tl.kill();
    };
  }, [text]);

  // Kinetic "Pop" on individual letter hover
  const handleLetterHover = (idx) => {
    const el = lettersRef.current[idx];
    if (!el || el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    const randomRot = gsap.utils.random(-9, 9);
    const randomScale = gsap.utils.random(1.12, 1.2);

    gsap.to(el, {
      yPercent: -20,
      scale: randomScale,
      rotate: randomRot,
      duration: 0.16,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          yPercent: 0,
          scale: 1,
          rotate: 0,
          duration: 0.65,
          ease: 'elastic.out(1.25, 0.35)',
          onComplete: () => {
            el.dataset.animating = 'false';
          },
        });
      },
    });

    // Also pulse the shadow overprint for tactile feedback
    if (overprintRef.current) {
      gsap.to(overprintRef.current, {
        opacity: 1,
        duration: 0.15,
        yoyo: true,
        repeat: 1,
        ease: 'power1.out',
      });
    }
  };

  const chars = text.split('');

  return (
    <div
      ref={containerRef}
      className={`relative inline-block select-none ${className}`}
      style={{
        isolation: 'isolate',
        width: 'fit-content',
        maxWidth: '100%',
        fontFamily: "'Abril Fatface', 'Playfair Display', Georgia, serif",
        letterSpacing: '0.015em',
        lineHeight: 0.85,
      }}
      aria-label={text}
    >
      {/* OVERPRINT SHADOW LAYER (Behind, matching Poiesis _heroOverprint with dual-theme color) */}
      <span
        ref={overprintRef}
        aria-hidden="true"
        className="absolute pointer-events-none select-none font-normal text-purple-600 dark:text-[#b84dff] opacity-90 dark:opacity-95"
        style={{
          zIndex: 0,
          top: '7px',
          left: '-7px',
          filter: 'drop-shadow(0 0 16px rgba(184, 77, 255, 0.45))',
          whiteSpace: 'nowrap',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          fontFamily: 'inherit',
          willChange: 'transform, opacity, filter',
        }}
      >
        {text}
      </span>

      {/* FOREGROUND LAYER WITH SPLIT-LETTER KINETIC POP (Dual-theme: Slate-900 in Light, Pure White in Dark) */}
      <h1
        className="relative z-10 m-0 font-normal text-slate-900 dark:text-white flex items-center drop-shadow-sm dark:drop-shadow-[0_2px_10px_rgba(0,0,0,0.6)]"
        style={{
          whiteSpace: 'nowrap',
          lineHeight: 'inherit',
          letterSpacing: 'inherit',
          fontFamily: 'inherit',
        }}
        aria-label={text}
      >
        {chars.map((char, idx) => (
          <span
            key={`${char}-${idx}`}
            ref={(el) => (lettersRef.current[idx] = el)}
            onMouseEnter={() => handleLetterHover(idx)}
            className="inline-block cursor-default will-change-transform"
            style={{
              transformOrigin: '50% 100%',
              display: 'inline-block',
            }}
            aria-hidden="true"
          >
            {char}
          </span>
        ))}
      </h1>
    </div>
  );
}
