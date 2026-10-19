'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const [cursorText, setCursorText] = useState('');
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  useEffect(() => {
    // Disable completely on touch screens via (pointer: fine)
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (!hasFinePointer) {
      setIsTouchDevice(true);
      return;
    }
    setIsTouchDevice(false);

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Center elements on origin
    gsap.set([dot, ring], { xPercent: -50, yPercent: -50 });

    // Smooth trailing ring coordinates using gsap.quickTo
    const quickX = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power2.out' });
    const quickY = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power2.out' });

    // Pointer move listener
    const onMouseMove = (e) => {
      const { clientX: x, clientY: y } = e;

      // 1. Instant 6px dot positioning
      gsap.set(dot, { x, y });

      // Check for magnetized interactive element
      const target = e.target.closest('button, a, [role="button"], [data-cursor]');

      if (target) {
        const customCursorAttr = target.getAttribute('data-cursor') || target.getAttribute('data-cursor-text');
        
        if (customCursorAttr) {
          // Morph into elongated pill showing contextual text
          setCursorText(customCursorAttr);
          gsap.to(ring, {
            width: 'auto',
            height: '28px',
            borderRadius: '9999px',
            backgroundColor: 'rgba(255, 210, 0, 0.95)',
            borderColor: '#FFD200',
            duration: 0.25,
            overwrite: 'auto',
          });
          gsap.to(dot, { opacity: 0, duration: 0.15 });
          quickX(x);
          quickY(y);
          return;
        }

        // Magnetize over buttons
        const rect = target.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Slight magnetic pull towards center
        const magnetX = x + (centerX - x) * 0.35;
        const magnetY = y + (centerY - y) * 0.35;

        quickX(magnetX);
        quickY(magnetY);

        setCursorText('');
        gsap.to(ring, {
          width: 52,
          height: 52,
          borderRadius: '50%',
          backgroundColor: 'rgba(255, 210, 0, 0.15)',
          borderColor: '#FFD200',
          duration: 0.3,
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1.5, opacity: 1, duration: 0.2 });
      } else {
        // Normal cursor state: smooth trailing 36px ring
        setCursorText('');
        quickX(x);
        quickY(y);

        gsap.to(ring, {
          width: 36,
          height: 36,
          borderRadius: '50%',
          backgroundColor: 'transparent',
          borderColor: 'rgba(255, 210, 0, 0.75)',
          duration: 0.3,
          overwrite: 'auto',
        });
        gsap.to(dot, { scale: 1, opacity: 1, duration: 0.2 });
      }
    };

    // Pulse on click (mousedown / mouseup)
    const onMouseDown = () => {
      gsap.to(ring, { scale: 0.7, duration: 0.1, overwrite: 'auto' });
      gsap.to(dot, { scale: 0.5, duration: 0.1, overwrite: 'auto' });
    };

    const onMouseUp = () => {
      gsap.to(ring, { scale: 1, duration: 0.25, ease: 'back.out(2.5)', overwrite: 'auto' });
      gsap.to(dot, { scale: 1, duration: 0.2, overwrite: 'auto' });
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.2 });
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.2 });
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.documentElement.addEventListener('mouseleave', onMouseLeave);
    document.documentElement.addEventListener('mouseenter', onMouseEnter);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.documentElement.removeEventListener('mouseleave', onMouseLeave);
      document.documentElement.removeEventListener('mouseenter', onMouseEnter);
    };
  }, []);

  if (isTouchDevice) return null;

  return (
    <>
      {/* 1. Instant 6px Central Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 w-1.5 h-1.5 rounded-full bg-station-yellow shadow-[0_0_8px_#FFD200] pointer-events-none z-[9999]"
        style={{ willChange: 'transform' }}
      />

      {/* 2. Smooth Trailing 36px Ring / Contextual Pill */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 w-9 h-9 rounded-full border border-station-yellow/80 pointer-events-none z-[9998] flex items-center justify-center px-2.5 transition-[background-color,border-color]"
        style={{ willChange: 'transform, width, height' }}
      >
        {cursorText && (
          <span
            ref={labelRef}
            className="text-[10px] font-mono font-black text-black tracking-widest uppercase whitespace-nowrap select-none"
          >
            {cursorText}
          </span>
        )}
      </div>
    </>
  );
}
