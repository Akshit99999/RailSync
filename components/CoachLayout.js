'use client';

import { Train, Utensils, Zap, Shield, ChevronRight, User } from 'lucide-react';

export default function CoachLayout({ rakeComposition = [], highlightCoach = '' }) {
  // Default Rajdhani/Express rake if none provided
  const defaultRake = ['LOCO', 'EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'PC', 'A1', 'A2', 'H1', 'EOG'];
  const coaches = rakeComposition.length > 0 ? rakeComposition : defaultRake;
  const cleanHighlight = String(highlightCoach || '').trim().toUpperCase();

  // Find index of highlighted coach
  const targetIndex = coaches.findIndex(c => c.toUpperCase() === cleanHighlight);

  const getCoachColor = (code) => {
    const c = code.toUpperCase();
    if (c === cleanHighlight) return 'bg-[#ffd200] text-[#050d1c] border-[#ffd200] shadow-[0_0_15px_rgba(255,210,0,0.8)] font-black scale-105';
    if (c === 'LOCO') return 'bg-[#dc2626] text-white border-[#ef4444] font-bold';
    if (c === 'EOG' || c === 'SLR') return 'bg-[#1e293b] text-[#94a3b8] border-[#334155]';
    if (c === 'PC') return 'bg-[#b45309] text-white border-[#d97706]';
    if (c.startsWith('H')) return 'bg-[#831843] text-[#fbcfe8] border-[#be185d]'; // 1AC Maroon
    if (c.startsWith('A')) return 'bg-[#1e3a8a] text-[#bfdbfe] border-[#2563eb]'; // 2AC Blue
    if (c.startsWith('B') || c.startsWith('M')) return 'bg-[#065f46] text-[#a7f3d0] border-[#059669]'; // 3AC Teal/Green
    if (c.startsWith('S')) return 'bg-[#312e81] text-[#c7d2fe] border-[#4338ca]'; // Sleeper Indigo
    if (c.startsWith('C') || c.startsWith('E')) return 'bg-[#0369a1] text-[#bae6fd] border-[#0284c7]'; // Chair Car
    return 'bg-[#0f172a] text-[#cbd5e1] border-[#1e293b]';
  };

  const getCoachLabel = (code) => {
    const c = code.toUpperCase();
    if (c === 'LOCO') return 'WAP-7';
    if (c === 'EOG') return 'Power';
    if (c === 'SLR') return 'Luggage';
    if (c === 'PC') return 'Pantry';
    return c;
  };

  return (
    <div className="bg-[#050e1d] border border-[#142646] rounded-md p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#142646] pb-3">
        <div className="flex items-center gap-2">
          <Train size={18} className="text-[#ffd200]" />
          <h4 className="font-bold text-white text-sm tracking-wide font-mono">
            TRAIN COMPOSITION & PLATFORM COACH POSITION (RAKE)
          </h4>
        </div>
        {cleanHighlight && targetIndex !== -1 && (
          <div className="text-xs font-mono text-[#ffd200] bg-[#132c60] px-2.5 py-1 rounded border border-[#204a8c] flex items-center gap-1.5 self-start sm:self-auto">
            <span className="signal-lamp green signal-pulse"></span>
            <span>YOUR COACH: <strong>{cleanHighlight}</strong> (Position #{targetIndex + 1} from Engine)</span>
          </div>
        )}
      </div>

      {/* Train Visual Track Ribbon */}
      <div className="overflow-x-auto pb-4 pt-6">
        <div className="flex items-end gap-1.5 min-w-max px-2 relative">
          {coaches.map((coach, idx) => {
            const isTarget = coach.toUpperCase() === cleanHighlight;

            return (
              <div key={idx} className="relative flex flex-col items-center">
                {/* Pointer Arrow above targeted coach */}
                {isTarget && (
                  <div className="absolute -top-7 flex flex-col items-center animate-bounce z-10">
                    <span className="bg-[#ffd200] text-[#050d1c] font-black text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shadow">
                      YOUR COACH
                    </span>
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-[#ffd200]"></div>
                  </div>
                )}

                {/* Individual Coach Body */}
                <div
                  className={`w-14 h-12 rounded-t flex flex-col items-center justify-center border text-xs transition-all relative ${getCoachColor(coach)}`}
                >
                  {coach.toUpperCase() === 'LOCO' ? (
                    <div className="flex flex-col items-center">
                      <Zap size={13} className="text-[#ffd200]" />
                      <span className="font-mono text-[10px] font-black">LOCO</span>
                    </div>
                  ) : coach.toUpperCase() === 'PC' ? (
                    <div className="flex flex-col items-center">
                      <Utensils size={12} className="text-[#fde68a]" />
                      <span className="font-mono text-[10px] font-bold">PC</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-mono font-bold text-xs">{coach}</span>
                      <span className="text-[9px] opacity-75 font-mono">{getCoachLabel(coach)}</span>
                    </>
                  )}

                  {/* Coach Coupling Hook */}
                  <div className="absolute -right-1.5 bottom-1 w-1.5 h-1 bg-[#475569] rounded-full"></div>
                </div>

                {/* Wheel Bogies */}
                <div className="w-12 h-1.5 bg-[#1e293b] flex justify-between px-1.5">
                  <div className="w-2.5 h-2 bg-[#475569] rounded-b-sm"></div>
                  <div className="w-2.5 h-2 bg-[#475569] rounded-b-sm"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Railway Track Sleepers under train */}
        <div className="h-2 w-full mt-1 bg-[#1e293b] border-t border-b border-[#334155] relative">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#475569_8px,#475569_11px)]"></div>
        </div>
      </div>

      {/* Rake Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-[#94a3b8] pt-1">
        <span className="text-white font-bold">LEGEND:</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#dc2626] rounded-xs inline-block"></span> LOCO (Engine)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#065f46] rounded-xs inline-block"></span> 3AC (B1-B6)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#1e3a8a] rounded-xs inline-block"></span> 2AC (A1-A3)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#831843] rounded-xs inline-block"></span> 1AC (H1)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#312e81] rounded-xs inline-block"></span> Sleeper (S1-S6)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-[#b45309] rounded-xs inline-block"></span> Pantry (PC)</span>
      </div>
    </div>
  );
}
