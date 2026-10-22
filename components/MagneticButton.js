'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * MagneticButton
 * Physically gravitates toward pointer coordinates when hovered before
 * snapping back elastically on mouseleave.
 */
export default function MagneticButton({
  children,
  onClick,
  className = '',
  strength = 0.35,
  type = 'button',
  dataCursor = 'SELECT',
  disabled = false,
  ...props
}) {
  const btnRef = useRef(null);
  const xTo = useRef(null);
  const yTo = useRef(null);

  useEffect(() => {
    const el = btnRef.current;
    if (!el) return;

    // Quick setters for performant 60+ FPS positioning
    xTo.current = gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3.out' });
    yTo.current = gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3.out' });

    const handleMouseMove = (e) => {
      if (disabled) return;
      const rect = el.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      xTo.current(deltaX);
      yTo.current(deltaY);
    };

    const handleMouseLeave = () => {
      // Elastic spring back to center
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: 'elastic.out(1.1, 0.35)',
        overwrite: 'auto',
      });
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [strength, disabled]);

  return (
    <button
      ref={btnRef}
      type={type}
      onClick={onClick}
      disabled={disabled}
      data-magnetic="true"
      data-cursor={dataCursor}
      className={`inline-flex items-center justify-center transition-shadow select-none will-change-transform ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
