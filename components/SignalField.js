'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function SignalField() {
  const canvasRef = useRef(null);
  const pointerRef = useRef({ x: -9999, y: -9999 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Retina display DPR scaling
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', handleResize);

    // Track mouse pointer coordinates
    const handleMouseMove = (e) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      pointerRef.current = { x: -9999, y: -9999 };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);

    // Spawn 40 particles with gentle velocities
    const PARTICLE_COUNT = 40;
    const CONNECT_DISTANCE = 130;
    const POINTER_MAGNET_RADIUS = 165;

    const particles = Array.from({ length: PARTICLE_COUNT }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 1.2 + 1.4,
      baseAlpha: Math.random() * 0.4 + 0.4,
    }));

    // Draw and update loop running on gsap.ticker
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const pointer = pointerRef.current;

      // 1. Update particle positions and apply pointer magnetism
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Pointer Magnetism (within 165px)
        const dx = pointer.x - p.x;
        const dy = pointer.y - p.y;
        const distToPointer = Math.sqrt(dx * dx + dy * dy);

        if (distToPointer < POINTER_MAGNET_RADIUS && distToPointer > 1) {
          const force = (1 - distToPointer / POINTER_MAGNET_RADIUS) * 0.045;
          p.vx += (dx / distToPointer) * force;
          p.vy += (dy / distToPointer) * force;
        }

        // Apply friction to dampen excessive speed
        p.vx *= 0.99;
        p.vy *= 0.99;

        // Position update
        p.x += p.vx;
        p.y += p.vy;

        // Bounce off viewport bounds
        if (p.x <= 0) {
          p.x = 0;
          p.vx *= -1;
        } else if (p.x >= width) {
          p.x = width;
          p.vx *= -1;
        }

        if (p.y <= 0) {
          p.y = 0;
          p.vy *= -1;
        } else if (p.y >= height) {
          p.y = height;
          p.vy *= -1;
        }

        // Draw particle node
        const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isDark
          ? `rgba(255, 210, 0, ${p.baseAlpha})`
          : `rgba(217, 119, 6, ${p.baseAlpha * 0.75})`;
        ctx.shadowColor = isDark ? '#FFD200' : '#d97706';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 2. Draw glowing connective lines between nodes within 130px
      const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];

          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < CONNECT_DISTANCE) {
            const alpha = (1 - dist / CONNECT_DISTANCE) * 0.35;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = isDark
              ? `rgba(255, 210, 0, ${alpha})`
              : `rgba(217, 119, 6, ${alpha * 0.55})`;
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }
    };

    // Add render loop to GSAP ticker
    gsap.ticker.add(render);

    // Pause drawing when tab is hidden via visibilitychange
    const handleVisibilityChange = () => {
      if (document.hidden) {
        gsap.ticker.remove(render);
      } else {
        gsap.ticker.add(render);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-45 dark:opacity-35 transition-opacity"
      aria-hidden="true"
    />
  );
}
