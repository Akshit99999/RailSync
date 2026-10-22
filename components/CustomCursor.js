'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const lastPos = useRef({ x: -9999, y: -9999 });
  const hasMovedOnce = useRef(false);
  const [cursorText, setCursorText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    // Only disable on pure touch devices with no mouse/pointer
    if (typeof window !== 'undefined') {
      const hasCoarseOnly = window.matchMedia('(pointer: coarse) and (hover: none)').matches;
      if (hasCoarseOnly) {
        setIsTouchDevice(true);
        return;
      }
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center elements on origin and start hidden until first mouse move
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, opacity: 0 });

    // Smooth trailing ring coordinates using gsap.quickTo
    const quickX = gsap.quickTo(ring, 'x', { duration: 0.3, ease: 'power2.out' });
    const quickY = gsap.quickTo(ring, 'y', { duration: 0.3, ease: 'power2.out' });

    const updateState = (target, x, y) => {
      // 1. Text input state — shrink and soften so typing is clear
      const isInput = target && target.closest('input, textarea, [contenteditable="true"]');
      if (isInput) {
        setCursorText('');
        quickX(x);
        quickY(y);
        gsap.to(ring, {
          width: 18,
          height: 18,
          borderRadius: '50%',
          opacity: 0.35,
          backgroundColor: 'transparent',
          borderColor: 'rgba(245, 158, 11, 0.6)',
          duration: 0.2,
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 0.6, opacity: 0.6, duration: 0.2 });
        return;
      }

      // 2. Contextual Pill State (data-cursor)
      const dataCursorEl = target && target.closest('[data-cursor], [data-cursor-text]');
      if (dataCursorEl) {
        const text = dataCursorEl.getAttribute('data-cursor') || dataCursorEl.getAttribute('data-cursor-text');
        if (text) {
          setCursorText(text);
          gsap.to(ring, {
            width: 'auto',
            height: '28px',
            borderRadius: '9999px',
            opacity: 1,
            backgroundColor: '#FFD200',
            borderColor: '#000000',
            boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
            duration: 0.22,
            overwrite: 'auto',
          });
          gsap.to(dot, { opacity: 0, duration: 0.12 });
          quickX(x);
          quickY(y);
          return;
        }
      }

      // 3. Interactive Magnetic Element ([data-magnetic], button, a, role=button)
      const magneticEl = target && target.closest('[data-magnetic], button, a, [role="button"], select, .cursor-pointer');
      if (magneticEl) {
        setCursorText('');
        const rect = magneticEl.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const isTrueMagnetic = magneticEl.hasAttribute('data-magnetic');
        const pullFactor = isTrueMagnetic ? 0.38 : 0.25;

        // Gravitate trailing ring toward center
        const magnetX = x + (centerX - x) * pullFactor;
        const magnetY = y + (centerY - y) * pullFactor;

        quickX(magnetX);
        quickY(magnetY);

        gsap.to(ring, {
          width: isTrueMagnetic ? 54 : 46,
          height: isTrueMagnetic ? 54 : 46,
          borderRadius: '50%',
          opacity: 1,
          backgroundColor: 'rgba(255, 210, 0, 0.22)',
          borderColor: '#FFD200',
          duration: 0.24,
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1.5, opacity: 1, duration: 0.2 });
        return;
      }

      // 4. Normal roaming cursor state: smooth 32px halo
      setCursorText('');
      quickX(x);
      quickY(y);

      gsap.to(ring, {
        width: 32,
        height: 32,
        borderRadius: '50%',
        opacity: 0.85,
        backgroundColor: 'rgba(255, 210, 0, 0.05)',
        borderColor: '#FFD200',
        duration: 0.25,
        overwrite: 'auto',
      });
      gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
    };

    // Pointer move listener
    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;
      lastPos.current = { x, y };

      if (!hasMovedOnce.current) {
        hasMovedOnce.current = true;
        gsap.to([dot, ring], { opacity: 1, duration: 0.15 });
      }

      // Instant central dot positioning
      gsap.set(dot, { x, y });

      const target = e.target;
      updateState(target, x, y);
    };

    // Scroll listener: keep cursor state responsive during scrolling
    const onScroll = () => {
      if (lastPos.current.x < 0 || lastPos.current.y < 0) return;
      const elUnderPointer = document.elementFromPoint(lastPos.current.x, lastPos.current.y);
      if (elUnderPointer) {
        updateState(elUnderPointer, lastPos.current.x, lastPos.current.y);
      }
    };

    // Click ripple burst animation
    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.65, duration: 0.08, overwrite: 'auto' });
      gsap.to(dot, { scale: 0.4, duration: 0.08, overwrite: 'auto' });
    };

    const onMouseUp = () => {
      gsap.fromTo(
        ring,
        { scale: 0.65 },
        {
          scale: 1.35,
          duration: 0.28,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(ring, { scale: 1, duration: 0.18, ease: 'power2.inOut' });
          },
        }
      );
      gsap.to(dot, { scale: 1, duration: 0.15, overwrite: 'auto' });
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      if (hasMovedOnce.current) {
        gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
      }
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. High-Visibility Central Dot with High-Contrast Border */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-2 h-2 rounded-full bg-amber-500 dark:bg-station-yellow ring-1 ring-black/70 dark:ring-white/80 shadow-[0_0_8px_rgba(255,210,0,0.9)] pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Smooth Trailing High-Contrast Halo Ring / Contextual Pill */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-8 h-8 rounded-full border-2 border-amber-600 dark:border-station-yellow shadow-[0_0_12px_rgba(255,210,0,0.35)] pointer-events-none z-[9998] flex items-center justify-center px-3 transition-[background-color,border-color]"
        style={{ willChange: 'transform, width, height' }}
      >
        {cursorText && (
          <span
            ref={labelRef}
            className="text-[10px] font-mono font-black text-black tracking-widest uppercase whitespace-nowrap select-none drop-shadow-sm"
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
