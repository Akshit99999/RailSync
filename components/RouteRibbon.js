'use client';

import { CheckCircle2, Clock, MapPin, Train, AlertTriangle, ArrowDown } from 'lucide-react';

export default function RouteRibbon({ route = [], lastReportedStation, nextStation, speed, delayMinutes }) {
  if (!route || route.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-zinc-400 font-mono">
        NO STATION TIMETABLE AVAILABLE
      </div>
    );
  }

  // Find index of last reported station
  const lastIndex = route.findIndex(s => s.code === lastReportedStation);

  return (
    <div className="station-signboard rounded-lg p-4 sm:p-5 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800 mb-4">
        <div className="flex items-center gap-2">
          <span className="station-code-pill text-xs">PERMANENT WAY</span>
          <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base tracking-wide">
            LINEAR ROUTE & PLATFORM CORRIDOR
          </h3>
        </div>
        <span className="text-xs font-mono text-amber-700 dark:text-station-yellow font-bold">
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
          let lampClass = 'green';
          if (!isDeparted) {
            if (station.delay > 20) {
              lampClass = 'red';
            } else if (station.delay > 5) {
              lampClass = 'amber';
            } else {
              lampClass = 'green';
            }
          }

          return (
            <div key={station.code} className="relative">
              {/* Station Node Box */}
              <div
                className={`station-track-node ml-10 p-3 sm:p-3.5 rounded-lg border transition-all ${
                  isCurrent
                    ? 'bg-amber-50/90 dark:bg-zinc-900 border-yellow-500 dark:border-station-yellow shadow-md shadow-yellow-500/10'
                    : isNext
                    ? 'bg-sky-50/90 dark:bg-zinc-900 border-sky-400 dark:border-sky-500 shadow-sm'
                    : 'bg-white dark:bg-zinc-950 border-slate-200 dark:border-zinc-800/80 hover:border-slate-300 dark:hover:border-zinc-700 shadow-sm'
                }`}
              >
                {/* Top Row: Station Code, Name & Platform */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span className="station-code-pill text-xs">{station.code}</span>
                    <span className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">
                      {station.name}
                    </span>
                    {station.halt && (
                      <span className="text-[10px] font-mono bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 px-1.5 py-0.5 rounded border border-slate-200 dark:border-zinc-700">
                        {station.halt}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="bg-slate-100 dark:bg-zinc-900 text-amber-800 dark:text-station-yellow px-2 py-0.5 rounded text-xs font-mono border border-amber-300 dark:border-zinc-700 font-bold">
                      PF {station.platform || '--'}
                    </span>
                    <span className={`signal-lamp ${lampClass} ${isCurrent ? 'signal-pulse' : ''}`}></span>
                  </div>
                </div>

                {/* Bottom Row: Timetable & Status */}
                <div className="mt-2.5 pt-2 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
                  {/* Scheduled Times */}
                  <div>
                    <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">SCH ARR / DEP</span>
                    <span className="text-slate-800 dark:text-zinc-200 font-medium">
                      {station.scheduledArrival} / {station.scheduledDeparture}
                    </span>
                  </div>

                  {/* Actual / Estimated Times */}
                  <div>
                    <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">
                      {isDeparted ? 'ACTUAL ARR / DEP' : 'ESTIMATED ARR / DEP'}
                    </span>
                    <span className="text-amber-700 dark:text-station-yellow font-bold">
                      {station.actualArrival || station.scheduledArrival} / {station.actualDeparture || station.scheduledDeparture}
                    </span>
                  </div>

                  {/* Delay status */}
                  <div>
                    <span className="text-slate-500 dark:text-zinc-500 block text-[10px]">RUNNING DELAY</span>
                    {station.delay > 0 ? (
                      <span className="text-amber-600 dark:text-amber-400 font-bold">
                        +{station.delay}m Late
                      </span>
                    ) : (
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                        Right Time (RT)
                      </span>
                    )}
                  </div>

                  {/* Operational Status */}
                  <div className="flex items-end justify-start sm:justify-end">
                    {isCurrent ? (
                      <span className="px-2 py-0.5 bg-station-yellow text-black font-black text-[11px] rounded tracking-wide animate-pulse">
                        LAST REPORTED
                      </span>
                    ) : isNext ? (
                      <span className="px-2 py-0.5 bg-sky-600 text-white font-bold text-[11px] rounded tracking-wide">
                        NEXT STOP
                      </span>
                    ) : isDeparted ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold text-[11px]">
                        <CheckCircle2 size={13} />
                        <span>CLEARED</span>
                      </span>
                    ) : (
                      <span className="text-slate-500 dark:text-zinc-500 text-[11px]">
                        UPCOMING
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Physical Block Section Indicator between Last Reported & Next */}
              {isCurrent && nextStation && (
                <div className="ml-10 my-2 p-2 bg-amber-50 dark:bg-zinc-900 border-l-4 border-station-yellow rounded-r text-xs font-mono text-amber-800 dark:text-station-yellow flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-2">
                    <Train size={15} className="text-amber-700 dark:text-station-yellow animate-bounce" />
                    <span className="font-bold">IN BLOCK SECTION → {nextStation}</span>
                  </div>
                  {speed && (
                    <span className="bg-white dark:bg-zinc-950 px-2 py-0.5 rounded text-slate-900 dark:text-white border border-slate-200 dark:border-zinc-800 font-bold">
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
