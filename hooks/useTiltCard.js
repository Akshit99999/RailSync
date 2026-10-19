'use client';

import { useRef, useCallback } from 'react';
import gsap from 'gsap';

/**
 * useTiltCard — 3D perspective card tilt hook
 *
 * Usage:
 *   const { ref, onMouseMove, onMouseLeave } = useTiltCard();
 *   <div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} style={{ perspective: '1000px' }}>
 *     ...card content...
 *   </div>
 *
 * Features:
 * - Calculates cursor position relative to card's bounding rect
 * - Maps (x, y) offset → rotateX / rotateY (±10deg range)
 * - gsap.quickTo for buttery-smooth dampening
 * - Smooth return to flat (0, 0) on mouseleave
 * - Only activates on devices with a fine pointer (mouse) — touch-safe
 */
export function useTiltCard({ maxTilt = 10, speed = 0.4, ease = 'power2.out' } = {}) {
  const ref = useRef(null);
  const rotX = useRef(null);
  const rotY = useRef(null);

  // Initialise quickTo setters lazily on first use
  const initQuickTo = useCallback(() => {
    if (!ref.current || rotX.current) return;
    rotX.current = gsap.quickTo(ref.current, 'rotateX', { duration: speed, ease });
    rotY.current = gsap.quickTo(ref.current, 'rotateY', { duration: speed, ease });
    // Set transform origin to centre
    gsap.set(ref.current, { transformPerspective: 1000, transformOrigin: 'center center' });
  }, [speed, ease]);

  const onMouseMove = useCallback(
    (e) => {
      // Only run on fine pointer (mouse) devices
      if (!window.matchMedia('(pointer: fine)').matches) return;

      initQuickTo();
      if (!ref.current || !rotX.current || !rotY.current) return;

      const rect = ref.current.getBoundingClientRect();
      // Normalize cursor position: -0.5 … +0.5 relative to card centre
      const relX = (e.clientX - rect.left) / rect.width - 0.5;
      const relY = (e.clientY - rect.top) / rect.height - 0.5;

      // rotateX tilts top/bottom, rotateY tilts left/right
      rotX.current(-relY * maxTilt);  // invert Y so cursor-top = tilt back
      rotY.current(relX * maxTilt);
    },
    [initQuickTo, maxTilt]
  );

  const onMouseLeave = useCallback(() => {
    if (!ref.current || !rotX.current || !rotY.current) return;
    rotX.current(0);
    rotY.current(0);
  }, []);

  return { ref, onMouseMove, onMouseLeave };
}
