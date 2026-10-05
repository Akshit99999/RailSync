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
    if (c === cleanHighlight) return 'bg-station-yellow text-black border-yellow-500 font-black scale-105 shadow-[0_0_15px_rgba(255,210,0,0.8)]';
    if (c === 'LOCO') return 'bg-rose-600 text-white border-rose-500 font-bold';
    if (c === 'EOG' || c === 'SLR') return 'bg-slate-700 dark:bg-zinc-800 text-slate-200 border-slate-600';
    if (c === 'PC') return 'bg-amber-600 text-white border-amber-500';
    if (c.startsWith('H')) return 'bg-rose-900 text-rose-100 border-rose-700'; // 1AC Maroon
    if (c.startsWith('A')) return 'bg-blue-800 text-blue-100 border-blue-600'; // 2AC Blue
    if (c.startsWith('B') || c.startsWith('M')) return 'bg-emerald-800 text-emerald-100 border-emerald-600'; // 3AC Teal/Green
    if (c.startsWith('S')) return 'bg-indigo-800 text-indigo-100 border-indigo-600'; // Sleeper Indigo
    if (c.startsWith('C') || c.startsWith('E')) return 'bg-sky-800 text-sky-100 border-sky-600'; // Chair Car
    return 'bg-slate-800 text-slate-200 border-slate-700';
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
    <div className="station-signboard p-4 sm:p-5 rounded-lg space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Train size={18} className="text-amber-600 dark:text-station-yellow" />
          <h4 className="font-bold text-slate-900 dark:text-white text-sm tracking-wide font-mono">
            TRAIN COMPOSITION & PLATFORM COACH POSITION (RAKE)
          </h4>
        </div>
        {cleanHighlight && targetIndex !== -1 && (
          <div className="text-xs font-mono text-amber-800 dark:text-station-yellow bg-amber-50 dark:bg-zinc-900 px-2.5 py-1 rounded border border-amber-200 dark:border-zinc-700 flex items-center gap-1.5 self-start sm:self-auto font-semibold">
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
                    <span className="bg-station-yellow text-black font-black text-[9px] px-1.5 py-0.5 rounded font-mono uppercase tracking-wider shadow">
                      YOUR COACH
                    </span>
                    <div className="w-0 h-0 border-l-[5px] border-l-transparent border-r-[5px] border-r-transparent border-t-[6px] border-t-yellow-400"></div>
                  </div>
                )}

                {/* Individual Coach Body */}
                <div
                  className={`w-14 h-12 rounded-t flex flex-col items-center justify-center border text-xs transition-all relative ${getCoachColor(coach)}`}
                >
                  {coach.toUpperCase() === 'LOCO' ? (
                    <div className="flex flex-col items-center">
                      <Zap size={13} className="text-yellow-300" />
                      <span className="font-mono text-[10px] font-black">LOCO</span>
                    </div>
                  ) : coach.toUpperCase() === 'PC' ? (
                    <div className="flex flex-col items-center">
                      <Utensils size={12} className="text-amber-200" />
                      <span className="font-mono text-[10px] font-bold">PC</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-mono font-bold text-xs">{coach}</span>
                      <span className="text-[9px] opacity-85 font-mono">{getCoachLabel(coach)}</span>
                    </>
                  )}

                  {/* Coach Coupling Hook */}
                  <div className="absolute -right-1.5 bottom-1 w-1.5 h-1 bg-slate-400 rounded-full"></div>
                </div>

                {/* Wheel Bogies */}
                <div className="w-12 h-1.5 bg-slate-700 dark:bg-zinc-800 flex justify-between px-1.5">
                  <div className="w-2.5 h-2 bg-slate-500 dark:bg-zinc-600 rounded-b-sm"></div>
                  <div className="w-2.5 h-2 bg-slate-500 dark:bg-zinc-600 rounded-b-sm"></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Physical Railway Track Sleepers under train */}
        <div className="h-2 w-full mt-1 bg-slate-200 dark:bg-zinc-900 border-t border-b border-slate-300 dark:border-zinc-800 relative">
          <div className="absolute inset-0 bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#94a3b8_8px,#94a3b8_11px)] dark:bg-[repeating-linear-gradient(90deg,transparent,transparent_8px,#3f3f46_8px,#3f3f46_11px)]"></div>
        </div>
      </div>

      {/* Rake Legend */}
      <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono text-slate-600 dark:text-zinc-400 pt-1">
        <span className="text-slate-900 dark:text-white font-bold">LEGEND:</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-600 rounded-xs inline-block"></span> LOCO (Engine)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-800 rounded-xs inline-block"></span> 3AC (B1-B6)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-blue-800 rounded-xs inline-block"></span> 2AC (A1-A3)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-900 rounded-xs inline-block"></span> 1AC (H1)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-indigo-800 rounded-xs inline-block"></span> Sleeper (S1-S6)</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-600 rounded-xs inline-block"></span> Pantry (PC)</span>
      </div>
    </div>
  );
}
