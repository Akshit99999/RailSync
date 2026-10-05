'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, Search, Clock, ArrowRight, RefreshCw, AlertCircle, Train, MapPin, Filter, Volume2, X } from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';

export default function StationBoard({ onTrackTrain }) {
  const [selectedStation, setSelectedStation] = useState({ code: 'NDLS', name: 'New Delhi', state: 'Delhi' });
  const [stationInput, setStationInput] = useState('New Delhi (NDLS)');
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const [hoursWindow, setHoursWindow] = useState(2);
  const [filterType, setFilterType] = useState('ALL'); // 'ALL' | 'DEPARTURE' | 'ARRIVAL'
  const [isLoading, setIsLoading] = useState(false);
  const [boardData, setBoardData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);

  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
    fetchStationBoard(selectedStation.code, hoursWindow);
  }, [selectedStation, hoursWindow]);

  // Autocomplete search
  const handleQueryChange = async (e) => {
    const val = e.target.value;
    setStationInput(val);
    setShowDropdown(true);

    if (!val || val.trim().length === 0) {
      setSuggestions([]);
      return;
    }

    try {
      const res = await fetch(`/api/stations?q=${encodeURIComponent(val)}`);
      const data = await res.json();
      if (data.success && data.stations) {
        setSuggestions(data.stations);
      }
    } catch (err) {
      console.warn('Station search failed:', err);
    }
  };

  const handleClearStation = () => {
    setStationInput('');
    setSuggestions([]);
    setShowDropdown(false);
  };

  const handleSelectStation = (stn) => {
    setSelectedStation(stn);
    setStationInput(`${stn.name} (${stn.code})`);
    setShowDropdown(false);
  };

  // Filter trains
  const filteredTrains = (boardData?.trains || []).filter((t) => {
    if (filterType === 'ALL') return true;
    return t.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Search & Controller Card */}
      <div className="station-signboard p-4 sm:p-6 rounded-lg">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">DISPLAY BOARD</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
              STATION LIVE ARRIVALS & DEPARTURES
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-md border border-slate-200 dark:border-zinc-800 text-xs font-mono">
              <button
                type="button"
                onClick={() => setHoursWindow(2)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${hoursWindow === 2 ? 'bg-station-yellow text-black shadow-sm' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
              >
                Next 2h
              </button>
              <button
                type="button"
                onClick={() => setHoursWindow(4)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${hoursWindow === 4 ? 'bg-station-yellow text-black shadow-sm' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
              >
                Next 4h
              </button>
              <button
                type="button"
                onClick={() => setHoursWindow(8)}
                className={`px-2.5 py-1 rounded font-bold transition-all ${hoursWindow === 8 ? 'bg-station-yellow text-black shadow-sm' : 'text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white'}`}
              >
                Next 8h
              </button>
            </div>

            <button
              onClick={() => fetchStationBoard(selectedStation.code, hoursWindow)}
              disabled={isLoading}
              title="Refresh Display Board"
              className="p-2 rounded-md bg-slate-100 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-amber-700 dark:text-station-yellow transition-colors"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Station Autocomplete Input */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 relative" ref={dropdownRef}>
            <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
              Select Indian Railways Station
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={stationInput}
                onChange={handleQueryChange}
                onFocus={() => {
                  if (suggestions.length > 0) setShowDropdown(true);
                }}
                placeholder="Search station by name or code (e.g. NDLS, CSMT, HWH)..."
                className="rail-input font-medium pr-16"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                {stationInput && (
                  <button
                    type="button"
                    onClick={handleClearStation}
                    className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
                    title="Clear station"
                    aria-label="Clear station"
                  >
                    <X size={14} />
                  </button>
                )}
                <MapPin size={16} className="pointer-events-none" />
              </div>
            </div>

            {/* Dropdown list */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border-2 border-yellow-400 dark:border-station-yellow rounded-md z-30 max-h-60 overflow-y-auto shadow-2xl">
                {suggestions.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => handleSelectStation(stn)}
                    className="px-3.5 py-2.5 hover:bg-amber-50 dark:hover:bg-zinc-800 cursor-pointer flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 last:border-b-0 transition-colors"
                  >
                    <div>
                      <span className="font-semibold text-slate-900 dark:text-white text-sm">{stn.name}</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 ml-2">({stn.state})</span>
                    </div>
                    <span className="station-code-pill text-xs">{stn.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 pt-4 md:pt-0">
            <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 font-bold w-full mb-1">MAJOR TERMINALS:</span>
            {[
              { code: 'NDLS', name: 'New Delhi' },
              { code: 'CSMT', name: 'Mumbai CSMT' },
              { code: 'HWH', name: 'Howrah Jn' },
              { code: 'MAS', name: 'Chennai Central' },
              { code: 'SBC', name: 'KSR Bengaluru' },
              { code: 'BPL', name: 'Bhopal Jn' }
            ].map((stn) => (
              <button
                key={stn.code}
                type="button"
                onClick={() => handleSelectStation(stn)}
                className={`text-xs px-2.5 py-1 rounded font-mono font-bold transition-all ${
                  selectedStation.code === stn.code
                    ? 'bg-station-yellow text-black shadow-sm'
                    : 'bg-slate-100 dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
                }`}
              >
                {stn.code}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-amber-600 dark:text-station-yellow" />
            <span className="text-xs font-mono text-slate-600 dark:text-zinc-400 font-bold">FILTER:</span>
            <div className="flex gap-1.5">
              {['ALL', 'DEPARTURE', 'ARRIVAL'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`text-xs px-3 py-1 rounded-md font-mono font-bold transition-all ${
                    filterType === type
                      ? 'bg-station-yellow text-black shadow-sm'
                      : 'bg-slate-100 dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white border border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  {type === 'ALL' ? 'ALL TRAINS' : type === 'DEPARTURE' ? 'DEPARTURES' : 'ARRIVALS'}
                </button>
              ))}
            </div>
          </div>

          {lastRefreshed && (
            <span className="text-xs font-mono text-slate-500 dark:text-zinc-500">
              Synced at {lastRefreshed}
            </span>
          )}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">DISPLAY BOARD NOTICE: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Electronic Departure / Arrival Display Board Table */}
      <div className="station-signboard p-4 sm:p-5 rounded-lg space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <span className="station-code-pill text-sm">{selectedStation.code}</span>
            <h3 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">
              {selectedStation.name} PLATFORM BOARD
            </h3>
          </div>
          <span className="text-xs font-mono text-amber-700 dark:text-station-yellow font-bold">
            SHOWING {filteredTrains.length} TRAIN MOVEMENTS
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-zinc-800">
          <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
            <thead>
              <tr className="bg-amber-50/70 dark:bg-zinc-950 text-amber-900 dark:text-station-yellow border-b border-slate-200 dark:border-zinc-800 font-bold">
                <th className="py-2.5 px-3">TRAIN NO & NAME</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">ROUTE (CORRIDOR)</th>
                <th className="py-2.5 px-3">SCHED / EXP TIME</th>
                <th className="py-2.5 px-3">PLATFORM</th>
                <th className="py-2.5 px-3">STATUS & DELAY</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
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
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-black text-amber-800 dark:text-station-yellow font-black rounded border border-amber-300 dark:border-yellow-500/40 text-xs">
                          PF {train.platform || '--'}
                        </span>
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

                      {/* Action */}
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => onTrackTrain(train.trainNumber)}
                          className="rail-btn-primary text-xs py-1.5 px-3"
                        >
                          <Train size={13} />
                          <span>Track</span>
                        </button>
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
    </div>
  );
}
