'use client';

import { User, Bed, Compass, Sun, ShieldCheck } from 'lucide-react';

export default function BerthMap({ passengers = [], coach = 'B3' }) {
  // If no passengers, return early
  if (!passengers || passengers.length === 0) return null;

  // Extract booked berths
  const bookedBerths = passengers.map(p => ({
    berthNum: parseInt(p.berth, 10) || 21,
    type: p.berthType || 'LOWER BERTH (LB)',
    passenger: p.number || 1,
    name: `Passenger ${p.number || 1}`,
  }));

  // Standard 8-berth bay layout representation (Berths 17-24 / or generic Bay)
  // 17: LB, 18: MB, 19: UB | 20: LB, 21: MB, 22: UB | 23: SL, 24: SU
  // Or relative to the first passenger's berth modulo 8
  const base = Math.floor(((bookedBerths[0]?.berthNum || 21) - 1) / 8) * 8;
  const bayBerths = [
    { num: base + 1, code: 'LB', name: 'Lower Berth', side: 'cabin-left', isWindow: true },
    { num: base + 2, code: 'MB', name: 'Middle Berth', side: 'cabin-left', isWindow: false },
    { num: base + 3, code: 'UB', name: 'Upper Berth', side: 'cabin-left', isWindow: false },
    { num: base + 4, code: 'LB', name: 'Lower Berth', side: 'cabin-right', isWindow: true },
    { num: base + 5, code: 'MB', name: 'Middle Berth', side: 'cabin-right', isWindow: false },
    { num: base + 6, code: 'UB', name: 'Upper Berth', side: 'cabin-right', isWindow: false },
    { num: base + 7, code: 'SL', name: 'Side Lower', side: 'side', isWindow: true },
    { num: base + 8, code: 'SU', name: 'Side Upper', side: 'side', isWindow: true },
  ];

  return (
    <div className="bg-[#050e1d] border border-[#142646] rounded-md p-4 space-y-4">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#142646] pb-3">
        <div className="flex items-center gap-2">
          <Bed size={18} className="text-[#ffd200]" />
          <h4 className="font-bold text-white text-sm tracking-wide font-mono">
            COACH {coach} COMPARTMENT BAY SCHEMATIC
          </h4>
        </div>
        <div className="text-xs font-mono text-[#94a3b8]">
          BAY #{Math.floor(base / 8) + 1} (BERTHS {base + 1}–{base + 8})
        </div>
      </div>

      {/* Compartment Cutaway Visual */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
        {/* Main Cabin (6 berths) */}
        <div className="md:col-span-8 bg-[#08152a] p-3 rounded border border-[#1b345f] space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-[#ffd200] border-b border-[#142646] pb-1.5">
            <span className="font-bold">MAIN CABIN COMPARTMENT</span>
            <span className="text-[#94a3b8] text-[11px]">6 BERTHS BAY</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Left Bench (LB, MB, UB) */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase text-center">Row A (Facing Forward)</div>
              {[bayBerths[2], bayBerths[1], bayBerths[0]].map((b) => {
                const booked = bookedBerths.find(bk => bk.berthNum === b.num);
                return (
                  <div
                    key={b.num}
                    className={`p-2 rounded border text-xs font-mono flex items-center justify-between transition-all ${
                      booked
                        ? 'bg-[#ffd200] text-[#050d1c] border-[#ffd200] font-black shadow-[0_0_12px_rgba(255,210,0,0.6)]'
                        : 'bg-[#030914] text-[#cbd5e1] border-[#1e3a6d]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">#{b.num}</span>
                      <span className="text-[11px] opacity-80">{b.code}</span>
                      {b.isWindow && <span className="text-[9px] bg-[#0284c7] text-white px-1 rounded">WIN</span>}
                    </div>
                    {booked && (
                      <span className="flex items-center gap-1 text-[10px] bg-[#050d1c] text-[#ffd200] px-1.5 py-0.5 rounded font-bold">
                        <User size={11} />
                        <span>P{booked.passenger}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Right Bench (LB, MB, UB) */}
            <div className="space-y-2">
              <div className="text-[10px] font-mono text-[#94a3b8] uppercase text-center">Row B (Facing Rear)</div>
              {[bayBerths[5], bayBerths[4], bayBerths[3]].map((b) => {
                const booked = bookedBerths.find(bk => bk.berthNum === b.num);
                return (
                  <div
                    key={b.num}
                    className={`p-2 rounded border text-xs font-mono flex items-center justify-between transition-all ${
                      booked
                        ? 'bg-[#ffd200] text-[#050d1c] border-[#ffd200] font-black shadow-[0_0_12px_rgba(255,210,0,0.6)]'
                        : 'bg-[#030914] text-[#cbd5e1] border-[#1e3a6d]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-sm">#{b.num}</span>
                      <span className="text-[11px] opacity-80">{b.code}</span>
                      {b.isWindow && <span className="text-[9px] bg-[#0284c7] text-white px-1 rounded">WIN</span>}
                    </div>
                    {booked && (
                      <span className="flex items-center gap-1 text-[10px] bg-[#050d1c] text-[#ffd200] px-1.5 py-0.5 rounded font-bold">
                        <User size={11} />
                        <span>P{booked.passenger}</span>
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Central Aisle / Gangway */}
        <div className="hidden md:flex md:col-span-1 flex-col items-center justify-center text-[10px] font-mono text-[#64748b] h-full py-6">
          <div className="h-full border-r border-dashed border-[#334155] w-0"></div>
          <span className="my-2 -rotate-90 whitespace-nowrap">AISLE</span>
          <div className="h-full border-r border-dashed border-[#334155] w-0"></div>
        </div>

        {/* Side Section (SL, SU) */}
        <div className="md:col-span-3 bg-[#08152a] p-3 rounded border border-[#1b345f] space-y-3">
          <div className="flex justify-between items-center text-xs font-mono text-[#ffd200] border-b border-[#142646] pb-1.5">
            <span className="font-bold">SIDE SECTION</span>
            <span className="text-[#94a3b8] text-[11px]">2 BERTHS</span>
          </div>

          <div className="space-y-2 pt-1">
            {[bayBerths[7], bayBerths[6]].map((b) => {
              const booked = bookedBerths.find(bk => bk.berthNum === b.num);
              return (
                <div
                  key={b.num}
                  className={`p-2 rounded border text-xs font-mono flex items-center justify-between transition-all ${
                    booked
                      ? 'bg-[#ffd200] text-[#050d1c] border-[#ffd200] font-black shadow-[0_0_12px_rgba(255,210,0,0.6)]'
                      : 'bg-[#030914] text-[#cbd5e1] border-[#1e3a6d]'
                  }`}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm">#{b.num}</span>
                    <span className="text-[11px] opacity-80">{b.code}</span>
                    <span className="text-[9px] bg-[#0284c7] text-white px-1 rounded">WIN</span>
                  </div>
                  {booked && (
                    <span className="flex items-center gap-1 text-[10px] bg-[#050d1c] text-[#ffd200] px-1.5 py-0.5 rounded font-bold">
                      <User size={11} />
                      <span>P{booked.passenger}</span>
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          <div className="text-[10px] font-mono text-[#64748b] text-center pt-2">
            Side Window View
          </div>
        </div>
      </div>
    </div>
  );
}
