'use client';

import { CheckCircle2, Clock, MapPin, Train, AlertTriangle, ArrowDown } from 'lucide-react';

export default function RouteRibbon({ route = [], lastReportedStation, nextStation, speed, delayMinutes }) {
  if (!route || route.length === 0) {
    return (
      <div className="p-8 text-center text-[#94a3b8] font-mono">
        NO STATION TIMETABLE AVAILABLE
      </div>
    );
  }

  // Find index of last reported station
  const lastIndex = route.findIndex(s => s.code === lastReportedStation);

  return (
    <div className="station-signboard rounded p-4 sm:p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[#1b345f] mb-4">
        <div className="flex items-center gap-2">
          <span className="station-code-pill text-xs">PERMANENT WAY</span>
          <h3 className="font-bold text-white text-sm sm:text-base tracking-wide">
            LINEAR ROUTE & PLATFORM CORRIDOR
          </h3>
        </div>
        <span className="text-xs font-mono text-[#ffd200]">
          {route.length} SCHEDULED STOPS
        </span>
      </div>

      {/* Rail Ribbon Container */}
      <div className="flex-1 overflow-y-auto pr-1 space-y-4 rail-track-line relative">
        {route.map((station, idx) => {
          const isDeparted = station.status === 'departed' || (lastIndex !== -1 && idx <= lastIndex);
          const isCurrent = station.code === lastReportedStation;
          const isNext = station.code === nextStation;

          // Signal aspect
          let signalColor = 'text-[#10b981]';
          let lampClass = 'green';
          if (!isDeparted) {
            if (station.delay > 20) {
              signalColor = 'text-[#ef4444]';
              lampClass = 'red';
            } else if (station.delay > 5) {
              signalColor = 'text-[#f59e0b]';
              lampClass = 'amber';
            } else {
              signalColor = 'text-[#10b981]';
              lampClass = 'green';
            }
          }

          return (
            <div key={station.code} className="relative">
              {/* Station Node Box */}
              <div
                className={`station-track-node ml-10 p-3 sm:p-3.5 rounded border transition-all ${
                  isCurrent
                    ? 'bg-[#0f244c] border-[#ffd200] shadow-lg'
                    : isNext
                    ? 'bg-[#0b1d3a] border-[#38bdf8]'
                    : 'bg-[#061224] border-[#162a4a] hover:border-[#2a4d80]'
                }`}
              >
                {/* Top Row: Station Code, Name & Platform */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="station-code-pill text-xs">{station.code}</span>
                    <span className="font-bold text-white text-sm sm:text-base">
                      {station.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-[#030914] text-[#ffd200] px-2 py-0.5 rounded text-xs font-mono border border-[#ffd200]/30 font-semibold">
                      PLATFORM {station.platform || '--'}
                    </span>
                    <span className={`signal-lamp ${lampClass} ${isCurrent ? 'signal-pulse' : ''}`}></span>
                  </div>
                </div>

                {/* Bottom Row: Timetable & Status */}
                <div className="mt-2.5 pt-2 border-t border-[#142646] grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {/* Scheduled Times */}
                  <div>
                    <span className="text-[#94a3b8] block text-[10px]">SCH ARR / DEP</span>
                    <span className="text-white font-medium">
                      {station.scheduledArrival} / {station.scheduledDeparture}
                    </span>
                  </div>

                  {/* Actual / Estimated Times */}
                  <div>
                    <span className="text-[#94a3b8] block text-[10px]">
                      {isDeparted ? 'ACTUAL ARR / DEP' : 'ESTIMATED ARR / DEP'}
                    </span>
                    <span className="text-[#ffd200] font-bold">
                      {station.actualArrival || station.scheduledArrival} / {station.actualDeparture || station.scheduledDeparture}
                    </span>
                  </div>

                  {/* Delay status */}
                  <div>
                    <span className="text-[#94a3b8] block text-[10px]">RUNNING DELAY</span>
                    {station.delay > 0 ? (
                      <span className="text-[#f59e0b] font-bold">
                        +{station.delay}m Late
                      </span>
                    ) : (
                      <span className="text-[#10b981] font-bold">
                        Right Time (RT)
                      </span>
                    )}
                  </div>

                  {/* Operational Status */}
                  <div className="flex items-end justify-start sm:justify-end">
                    {isCurrent ? (
                      <span className="px-2 py-0.5 bg-[#ffd200] text-[#050d1c] font-black text-[11px] rounded tracking-wide animate-pulse">
                        LAST REPORTED
                      </span>
                    ) : isNext ? (
                      <span className="px-2 py-0.5 bg-[#0284c7] text-white font-bold text-[11px] rounded tracking-wide">
                        NEXT STOP
                      </span>
                    ) : isDeparted ? (
                      <span className="text-[#10b981] flex items-center gap-1 font-semibold text-[11px]">
                        <CheckCircle2 size={13} />
                        <span>CLEARED</span>
                      </span>
                    ) : (
                      <span className="text-[#94a3b8] text-[11px]">
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Physical Block Section Indicator between Last Reported & Next */}
              {isCurrent && nextStation && (
                <div className="ml-10 my-2 p-2 bg-[#040b17] border-l-2 border-[#ffd200] rounded-r text-xs font-mono text-[#ffd200] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Train size={15} className="text-[#ffd200] animate-bounce" />
                    <span>LOCOMOTIVE IN BLOCK SECTION → {nextStation}</span>
                  </div>
                  {speed && (
                    <span className="bg-[#0f2244] px-2 py-0.5 rounded text-white border border-[#1e3a6d]">
                      {speed}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
