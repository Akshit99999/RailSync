'use client';

import { useState } from 'react';
import { Train, MapPin, Info, ArrowDown } from 'lucide-react';

const STANDARD_RAKE = [
  { pos: 1, code: 'LOCO', type: 'WAP-7 Engine', category: 'loco', color: 'bg-red-700 text-white' },
  { pos: 2, code: 'EOG', type: 'Generator Car', category: 'eog', color: 'bg-zinc-700 text-white' },
  { pos: 3, code: 'UR1', type: 'General Second', category: 'ur', color: 'bg-amber-700 text-white' },
  { pos: 4, code: 'S1', type: 'Sleeper Class', category: 'sl', color: 'bg-indigo-800 text-white' },
  { pos: 5, code: 'S2', type: 'Sleeper Class', category: 'sl', color: 'bg-indigo-800 text-white' },
  { pos: 6, code: 'S3', type: 'Sleeper Class', category: 'sl', color: 'bg-indigo-800 text-white' },
  { pos: 7, code: 'S4', type: 'Sleeper Class', category: 'sl', color: 'bg-indigo-800 text-white' },
  { pos: 8, code: 'PC', type: 'Pantry Car', category: 'pantry', color: 'bg-amber-600 text-white' },
  { pos: 9, code: 'B1', type: 'AC 3-Tier', category: '3a', color: 'bg-teal-700 text-white' },
  { pos: 10, code: 'B2', type: 'AC 3-Tier', category: '3a', color: 'bg-teal-700 text-white' },
  { pos: 11, code: 'B3', type: 'AC 3-Tier', category: '3a', color: 'bg-teal-700 text-white' },
  { pos: 12, code: 'B4', type: 'AC 3-Tier', category: '3a', color: 'bg-teal-700 text-white' },
  { pos: 13, code: 'A1', type: 'AC 2-Tier', category: '2a', color: 'bg-blue-800 text-white' },
  { pos: 14, code: 'A2', type: 'AC 2-Tier', category: '2a', color: 'bg-blue-800 text-white' },
  { pos: 15, code: 'H1', type: 'AC First Class', category: '1a', color: 'bg-rose-900 text-white' },
  { pos: 16, code: 'EOG', type: 'Rear Brake/Guard', category: 'eog', color: 'bg-zinc-700 text-white' },
];

export default function PlatformCoachVisualizer({ 
  platform = '3', 
  trainNumber = '12952', 
  trainName = 'Tejas Rajdhani Express' 
}) {
  const [selectedCoach, setSelectedCoach] = useState(STANDARD_RAKE[10]); // Default B3

  return (
    <div className="p-5 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-4 font-mono">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
        <div className="flex items-center gap-2">
          <Train size={16} className="text-amber-500 dark:text-station-yellow" />
          <h3 className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200">
            PLATFORM {platform} COACH POSITION & HALTING SCHEMATIC
          </h3>
        </div>
        <div className="text-xs text-slate-500 dark:text-zinc-400">
          Train: <strong className="text-slate-800 dark:text-zinc-200">{trainNumber}</strong> ({trainName})
        </div>
      </div>

      {/* Platform Boarding Marker Notice */}
      {selectedCoach && (
        <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-zinc-950 border border-amber-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block">BOARDING INSTRUCTIONS</span>
            <p className="font-bold text-slate-800 dark:text-zinc-100">
              Coach <span className="text-amber-600 dark:text-station-yellow text-sm">{selectedCoach.code}</span> ({selectedCoach.type}) halts near <span className="underline decoration-amber-500">Platform Pillar #{selectedCoach.pos * 2}</span>
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto px-3 py-1.5 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-[11px] font-semibold text-slate-700 dark:text-zinc-300">
            <MapPin size={13} className="text-rose-500 shrink-0" />
            <span>Overbridge Escalator: 20m</span>
          </div>
        </div>
      )}

      {/* Interactive Platform Rake Diagram */}
      <div className="space-y-2">
        {/* Platform Concrete Indicator */}
        <div className="flex items-center justify-between text-[10px] text-slate-400 px-1 font-bold">
          <span>◄ FRONT (ENGINE END)</span>
          <span className="text-amber-600 dark:text-station-yellow">◄ PLATFORM {platform} WALKWAY ►</span>
          <span>REAR (GUARD END) ►</span>
        </div>

        {/* Scrollable Rake Coaches */}
        <div className="overflow-x-auto pb-3 pt-1">
          <div className="flex items-center gap-1.5 min-w-[760px]">
            {STANDARD_RAKE.map((coach) => {
              const isSelected = selectedCoach.pos === coach.pos;
              return (
                <button
                  key={coach.pos}
                  onClick={() => setSelectedCoach(coach)}
                  className={`flex flex-col items-center justify-between p-2 rounded-lg text-center transition-all h-20 w-12 sm:w-14 shrink-0
                    ${coach.color}
                    ${isSelected 
                      ? 'ring-4 ring-station-yellow scale-105 z-10 shadow-lg -translate-y-1' 
                      : 'opacity-90 hover:opacity-100 hover:scale-102'
                    }
                  `}
                >
                  <span className="text-[9px] opacity-75">#{coach.pos}</span>
                  <span className="text-xs font-black">{coach.code}</span>
                  <span className="text-[8px] opacity-80 truncate w-full">{coach.category.toUpperCase()}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Coach Pointer Arrow */}
        <div className="flex items-center justify-center text-xs text-amber-600 dark:text-station-yellow font-bold gap-1 animate-pulse">
          <ArrowDown size={14} />
          <span>Click any coach to highlight its position relative to platform pillars</span>
        </div>
      </div>
    </div>
  );
}
