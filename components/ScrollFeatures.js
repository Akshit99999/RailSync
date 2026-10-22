'use client';

import { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

export default function ScrollFeatures() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;

      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 250);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* 1. Railway Telemetry Scroll Progress Bar at Top of Viewport */}
      <div
        className="fixed top-0 left-0 right-0 h-[3px] bg-black/10 dark:bg-white/10 z-[1000] pointer-events-none"
        aria-hidden="true"
      >
        <div
          className="h-full bg-gradient-to-r from-amber-500 via-station-yellow to-amber-400 shadow-[0_0_10px_#FFD200] transition-[width] duration-75 ease-out"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* 2. Floating High-Visibility 'Scroll to Top' Signal Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          data-cursor="TOP"
          aria-label="Scroll back to top of page"
          className="fixed bottom-6 right-6 z-40 p-3 rounded-xl bg-station-yellow text-black font-black shadow-[0_8px_25px_rgba(255,210,0,0.4)] border border-amber-400 hover:scale-110 active:scale-95 transition-all duration-200 flex items-center gap-1.5 group font-mono text-xs cursor-pointer animate-in fade-in slide-in-from-bottom-4"
        >
          <ArrowUp size={16} className="group-hover:-translate-y-0.5 transition-transform stroke-[2.5]" />
          <span className="hidden sm:inline font-bold">TOP</span>
          <span className="text-[10px] font-mono text-black/70 font-semibold">
            {Math.round(scrollProgress)}%
          </span>
        </button>
      )}
    </>
  );
}
