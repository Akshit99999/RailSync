'use client';

import { useRef } from 'react';
import gsap from 'gsap';

/**
 * KineticHeadline
 * Splits text into individual letters with subtle randomized rotational bounce
 * and elastic snap-back on hover via GSAP physics.
 */
export default function KineticHeadline({ text, className = '', highlightWord = 'TELEMETRY' }) {
  const containerRef = useRef(null);

  const handleCharHover = (e) => {
    const el = e.currentTarget;
    if (!el || el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    // Randomized rotational bounce and elastic snap-back
    const randomAngle = gsap.utils.random(-14, 14);
    const randomY = gsap.utils.random(-8, -14);

    gsap.to(el, {
      y: randomY,
      rotation: randomAngle,
      scale: 1.18,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.65,
          ease: 'elastic.out(1.2, 0.35)',
          onComplete: () => {
            el.dataset.animating = 'false';
          },
        });
      },
    });
  };

  const words = text.split(' ');

  return (
    <h1
      ref={containerRef}
      className={`tracking-tight select-none ${className}`}
      aria-label={text}
    >
      {words.map((word, wordIdx) => {
        const isHighlight = word.toUpperCase().includes(highlightWord.toUpperCase());
        const chars = word.split('');

        return (
          <span key={wordIdx} className="inline-block whitespace-nowrap mr-[0.28em] last:mr-0">
            {chars.map((char, charIdx) => (
              <span
                key={charIdx}
                onMouseEnter={handleCharHover}
                className={`inline-block transition-colors duration-150 cursor-default ${
                  isHighlight ? 'text-amber-500 dark:text-station-yellow' : 'text-slate-900 dark:text-white'
                } hover:text-station-yellow`}
                style={{ willChange: 'transform' }}
              >
                {char}
              </span>
            ))}
          </span>
        );
      })}
    </h1>
  );
}
