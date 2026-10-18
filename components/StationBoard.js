'use client';

import { useState, useEffect } from 'react';
import { 
  Radio, 
  Search, 
  Clock, 
  ArrowRight, 
  RefreshCw, 
  AlertCircle, 
  Train, 
  MapPin, 
  Filter, 
  Volume2, 
  LayoutGrid, 
  Layers 
} from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';
import StationSelect from './forms/StationSelect';
import PlatformCoachVisualizer from './PlatformCoachVisualizer';
import { useApp } from '@/context/AppContext';

export default function StationBoard({ onTrackTrain }) {
  const [selectedStation, setSelectedStation] = useState({ code: 'NDLS', name: 'New Delhi', state: 'Delhi' });
  const [hoursWindow, setHoursWindow] = useState(2);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'DEPARTURE' | 'ARRIVAL'
  const [isLoading, setIsLoading] = useState(false);
  const [boardData, setBoardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [activePlatformVisualizer, setActivePlatformVisualizer] = useState(null);

  const { triggerTrainAnnouncement } = useApp();

  // Fetch board data
  const fetchStationBoard = async (stnCode = selectedStation.code, hours = hoursWindow) => {
    if (!stnCode) return;
    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/station-board?station=${stnCode}&hours=${hours}`);
      const data = await res.json();

      if (data.success && data.data) {
        setBoardData(data.data);
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour12: false }));
        playRailwayChime();
      } else {
        setErrorMessage(data.error || 'Failed to load station board.');
      }
    } catch (err) {
      setErrorMessage('Network or server error while querying station board.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (selectedStation?.code) {
      fetchStationBoard(selectedStation.code, hoursWindow);
    }
  }, [selectedStation, hoursWindow]);

  // Filter trains
  const filteredTrains = (boardData?.trains || []).filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6 font-mono">
      {/* Search & Controller Card */}
      <div className="station-signboard p-4 sm:p-6 rounded-2xl shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">ELECTRONIC BOARD</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
              STATION PLATFORM TELEMETRY BOARD
            </h2>
          </div>

          <div className="flex items-center gap-2 text-xs">
            {lastRefreshed && (
              <span className="text-slate-500 dark:text-zinc-400 hidden sm:inline">
                UPDATED: {lastRefreshed}
              </span>
            )}
            <button
              onClick={() => fetchStationBoard()}
              disabled={isLoading}
              className="p-1.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-300 transition-colors"
              title="Refresh Display Board"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Controls Grid: Station Search & Time Filter */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Station Select */}
          <div className="md:col-span-6">
            <StationSelect
              label="SELECT RAILWAY STATION"
              value={selectedStation}
              onChange={(st) => st && setSelectedStation(st)}
              required
            />
          </div>

          {/* Time Window Filter */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              LOOKAHEAD TIME WINDOW
            </label>
            <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs">
              {[2, 4, 8].map((hrs) => (
                <button
                  key={hrs}
                  type="button"
                  onClick={() => setHoursWindow(hrs)}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                    hoursWindow === hrs
                      ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {hrs} Hours
                </button>
              ))}
            </div>
          </div>

          {/* Movement Type Filter */}
          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
              MOVEMENT DIRECTION
            </label>
            <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-xl border border-slate-300 dark:border-zinc-800 text-xs">
              {['ALL', 'DEPARTURE', 'ARRIVAL'].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setFilterType(t)}
                  className={`flex-1 py-1.5 font-bold rounded-lg transition-all ${
                    filterType === t
                      ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {t === 'DEPARTURE' ? 'Dep' : t === 'ARRIVAL' ? 'Arr' : 'All'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Error Notice */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-xl text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">DISPLAY BOARD NOTICE: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Electronic Departure / Arrival Display Board Table */}
      <div className="station-signboard p-4 sm:p-5 rounded-2xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="station-code-pill text-sm">{selectedStation.code}</span>
            <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
              {selectedStation.name} PLATFORM BOARD
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-700 dark:text-station-yellow font-bold">
            SHOWING {filteredTrains.length} MOVEMENTS
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-zinc-800">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/70 dark:bg-zinc-950 text-amber-900 dark:text-station-yellow border-b border-slate-200 dark:border-zinc-800 font-bold">
                <th className="py-2.5 px-3">TRAIN NO & NAME</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">CORRIDOR</th>
                <th className="py-2.5 px-3">SCHED / EXP</th>
                <th className="py-2.5 px-3 text-center">PLATFORM</th>
                <th className="py-2.5 px-3">STATUS & DELAY</th>
                <th className="py-2.5 px-3 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 bg-white dark:bg-zinc-900/60">
              {filteredTrains.length > 0 ? (
                filteredTrains.map((train, idx) => {
                  const isDep = train.type === 'DEPARTURE';
                  const delay = train.delayMinutes || 0;
                  const isLate = delay > 0;

                  return (
                    <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-zinc-800/60 transition-colors">
                      {/* Train Number & Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="train-number-badge text-xs">{train.trainNumber}</span>
                          <span className="font-bold text-slate-900 dark:text-white tracking-wide">{train.trainName}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isDep ? 'bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800' : 'bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
                        }`}>
                          {train.type}
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-3 text-slate-700 dark:text-zinc-300">
                        <div className="flex items-center gap-1.5">
                          <span className="text-amber-700 dark:text-station-yellow font-bold">{train.origin}</span>
                          <ArrowRight size={13} className="text-slate-400 dark:text-zinc-600" />
                          <span className="text-amber-700 dark:text-station-yellow font-bold">{train.destination}</span>
                        </div>
                      </td>

                      {/* Times */}
                      <td className="py-3 px-3">
                        <div className="text-slate-900 dark:text-white font-semibold">
                          {train.scheduledTime}
                        </div>
                        {isLate && (
                          <div className="text-xs text-amber-600 dark:text-amber-400 font-bold">
                            Exp: {train.expectedTime}
                          </div>
                        )}
                      </td>

                      {/* Platform */}
                      <td className="py-3 px-3 text-center">
                        <button
                          onClick={() => setActivePlatformVisualizer(activePlatformVisualizer?.trainNumber === train.trainNumber ? null : train)}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-black text-amber-800 dark:text-station-yellow font-black rounded-lg border border-amber-300 dark:border-yellow-500/40 text-xs hover:border-station-yellow transition-colors"
                          title="Click to view coach layout on platform"
                        >
                          PF {train.platform || '1'} 🔍
                        </button>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`signal-lamp ${isLate ? (delay > 20 ? 'red' : 'amber') : 'green'} signal-pulse`}></span>
                          <span className={`font-bold text-xs ${isLate ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                            {train.status || (isLate ? `+${delay}m LATE` : 'ON TIME')}
                          </span>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Audio Announcement Button */}
                          <button
                            onClick={() => triggerTrainAnnouncement({
                              trainNumber: train.trainNumber,
                              trainName: train.trainName,
                              origin: train.origin,
                              destination: train.destination,
                              platform: train.platform || '1'
                            })}
                            className="p-1.5 rounded-lg border border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:border-station-yellow text-slate-700 dark:text-zinc-300 transition-colors"
                            title="Play Station Audio Announcement"
                          >
                            <Volume2 size={13} className="text-amber-500" />
                          </button>

                          {/* Track Button */}
                          <button
                            onClick={() => onTrackTrain(train.trainNumber)}
                            className="rail-btn-primary text-xs py-1.5 px-3"
                          >
                            <Train size={13} />
                            <span>Track</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="py-6 text-center text-slate-500 dark:text-zinc-500">
                    No train movements found for the selected time window.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Expandable Platform Coach Visualizer */}
      {activePlatformVisualizer && (
        <div className="animate-fadeIn">
          <PlatformCoachVisualizer
            platform={activePlatformVisualizer.platform || '1'}
            trainNumber={activePlatformVisualizer.trainNumber}
            trainName={activePlatformVisualizer.trainName}
          />
        </div>
      )}
    </div>
  );
}
