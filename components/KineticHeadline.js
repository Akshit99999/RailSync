'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * KineticHeadline
 * Splits text into individual letters with subtle randomized rotational bounce,
 * elastic snap-back on hover, and entrance stagger animation.
 */
export default function KineticHeadline({
  text,
  className = '',
  highlightWord = 'RAILSYNC',
  animateOnMount = true,
  shadow = true,
}) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!animateOnMount || !containerRef.current) return;
    const chars = containerRef.current.querySelectorAll('.kinetic-char');
    if (!chars.length) return;

    // Staggered cascade entrance on page load
    gsap.fromTo(
      chars,
      {
        y: -40,
        opacity: 0,
        scale: 0.7,
        rotation: () => gsap.utils.random(-20, 20),
      },
      {
        y: 0,
        opacity: 1,
        scale: 1,
        rotation: 0,
        stagger: 0.035,
        duration: 0.75,
        ease: 'back.out(2)',
      }
    );
  }, [animateOnMount, text]);

  const handleCharHover = (e) => {
    const el = e.currentTarget;
    if (!el || el.dataset.animating === 'true') return;
    el.dataset.animating = 'true';

    // Randomized rotational bounce and elastic snap-back
    const randomAngle = gsap.utils.random(-16, 16);
    const randomY = gsap.utils.random(-10, -18);

    gsap.to(el, {
      y: randomY,
      rotation: randomAngle,
      scale: 1.22,
      duration: 0.18,
      ease: 'power2.out',
      onComplete: () => {
        gsap.to(el, {
          y: 0,
          rotation: 0,
          scale: 1,
          duration: 0.7,
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
      className={`tracking-tight select-none ${
        shadow ? 'drop-shadow-[0_12px_28px_rgba(255,210,0,0.35)] dark:drop-shadow-[0_14px_38px_rgba(255,210,0,0.5)]' : ''
      } ${className}`}
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
                className={`kinetic-char inline-block transition-colors duration-150 cursor-default ${
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
