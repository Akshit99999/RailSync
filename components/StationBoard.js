'use client';

import { useState, useEffect, useRef } from 'react';
import { Radio, Search, Clock, ArrowRight, RefreshCw, AlertCircle, Train, MapPin, Filter, Volume2 } from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';

export default function StationBoard({ onTrackTrain }) {
  const [stationQuery, setStationQuery] = useState('');
  const [selectedStation, setSelectedStation] = useState({ code: 'NDLS', name: 'New Delhi', state: 'Delhi' });
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
    setStationQuery(val);
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

  const handleSelectStation = (stn) => {
    setSelectedStation(stn);
    setStationQuery('');
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
      <div className="station-signboard p-4 sm:p-6 rounded-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b345f]">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">ELECTRONIC BOARD</span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              STATION LIVE ARRIVALS & DEPARTURES
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex bg-[#050e1c] p-1 rounded border border-[#1e3a6d] text-xs font-mono">
              <button
                type="button"
                onClick={() => setHoursWindow(2)}
                className={`px-2.5 py-1 rounded font-bold ${hoursWindow === 2 ? 'bg-[#ffd200] text-[#050d1c]' : 'text-[#94a3b8]'}`}
              >
                Next 2h
              </button>
              <button
                type="button"
                onClick={() => setHoursWindow(4)}
                className={`px-2.5 py-1 rounded font-bold ${hoursWindow === 4 ? 'bg-[#ffd200] text-[#050d1c]' : 'text-[#94a3b8]'}`}
              >
                Next 4h
              </button>
              <button
                type="button"
                onClick={() => setHoursWindow(8)}
                className={`px-2.5 py-1 rounded font-bold ${hoursWindow === 8 ? 'bg-[#ffd200] text-[#050d1c]' : 'text-[#94a3b8]'}`}
              >
                Next 8h
              </button>
            </div>

            <button
              onClick={() => fetchStationBoard(selectedStation.code, hoursWindow)}
              disabled={isLoading}
              title="Refresh Display Board"
              className="p-2 rounded bg-[#0b1d3a] hover:bg-[#132c60] border border-[#1e3a6d] text-[#ffd200]"
            >
              <RefreshCw size={15} className={isLoading ? 'animate-spin' : ''} />
            </button>
          </div>
        </div>

        {/* Station Autocomplete Input */}
        <div className="mt-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-7 relative" ref={dropdownRef}>
            <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
              Select Indian Railways Station
            </label>
            <div className="relative">
              <input
                type="text"
                value={stationQuery || `${selectedStation.name} (${selectedStation.code})`}
                onChange={handleQueryChange}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search station by name or code (e.g. NDLS, CSMT, HWH)..."
                className="rail-input font-medium pr-12"
              />
              <MapPin size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8] pointer-events-none" />
            </div>

            {/* Dropdown list */}
            {showDropdown && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-[#091730] border border-[#ffd200] rounded z-30 max-h-60 overflow-y-auto shadow-2xl">
                {suggestions.map((stn) => (
                  <div
                    key={stn.code}
                    onClick={() => handleSelectStation(stn)}
                    className="px-3.5 py-2.5 hover:bg-[#132c60] cursor-pointer flex items-center justify-between border-b border-[#142646] last:border-b-0"
                  >
                    <div>
                      <span className="font-semibold text-white text-sm">{stn.name}</span>
                      <span className="text-xs text-[#94a3b8] ml-2">({stn.state})</span>
                    </div>
                    <span className="station-code-pill text-xs">{stn.code}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick preset chips */}
          <div className="md:col-span-5 flex flex-wrap gap-1.5 pt-4 md:pt-0">
            <span className="text-xs font-mono text-[#94a3b8] w-full mb-1">MAJOR TERMINALS:</span>
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
                onClick={() => setSelectedStation(stn)}
                className={`text-xs px-2.5 py-1 rounded font-mono transition-colors ${
                  selectedStation.code === stn.code
                    ? 'bg-[#ffd200] text-[#050d1c] font-bold'
                    : 'bg-[#050e1c] text-[#94a3b8] hover:text-white border border-[#1e3a6d]'
                }`}
              >
                {stn.code}
              </button>
            ))}
          </div>
        </div>

        {/* Filter Bar */}
        <div className="mt-5 pt-3 border-t border-[#142646] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Filter size={14} className="text-[#ffd200]" />
            <span className="text-xs font-mono text-[#94a3b8]">FILTER MOVEMENTS:</span>
            <div className="flex gap-1.5">
              {['ALL', 'DEPARTURE', 'ARRIVAL'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFilterType(type)}
                  className={`text-xs px-3 py-1 rounded font-mono font-bold transition-colors ${
                    filterType === type
                      ? 'bg-[#ffd200] text-[#050d1c]'
                      : 'bg-[#050e1c] text-[#94a3b8] hover:text-white border border-[#1e3a6d]'
                  }`}
                >
                  {type === 'ALL' ? 'ALL TRAINS' : type === 'DEPARTURE' ? 'DEPARTURES' : 'ARRIVALS'}
                </button>
              ))}
            </div>
          </div>

          {lastRefreshed && (
            <span className="text-xs font-mono text-[#64748b]">
              Synced at {lastRefreshed}
            </span>
          )}
        </div>
      </div>

      {/* Error alert */}
      {errorMessage && (
        <div className="p-3 bg-[#3f0f15] border border-[#ef4444] rounded text-[#fca5a5] text-xs sm:text-sm flex items-start gap-2.5">
          <AlertCircle size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">DISPLAY BOARD NOTICE: </span>
            {errorMessage}
          </div>
        </div>
      )}

      {/* Electronic Departure / Arrival Display Board Table */}
      <div className="station-signboard p-4 sm:p-5 rounded-md space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b345f]">
          <div className="flex items-center gap-2.5">
            <span className="station-code-pill text-sm">{selectedStation.code}</span>
            <h3 className="font-bold text-white text-base sm:text-lg">
              {selectedStation.name} PLATFORM BOARD
            </h3>
          </div>
          <span className="text-xs font-mono text-[#ffd200]">
            SHOWING {filteredTrains.length} TRAIN MOVEMENTS
          </span>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
            <thead>
              <tr className="bg-[#050e1d] text-[#ffd200] border-b border-[#1e3a6d]">
                <th className="py-2.5 px-3">TRAIN NO & NAME</th>
                <th className="py-2.5 px-3">TYPE</th>
                <th className="py-2.5 px-3">ROUTE (CORRIDOR)</th>
                <th className="py-2.5 px-3">SCHED / EXP TIME</th>
                <th className="py-2.5 px-3">PLATFORM</th>
                <th className="py-2.5 px-3">STATUS & DELAY</th>
                <th className="py-2.5 px-3 text-right">ACTION</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#142646]">
              {filteredTrains.length > 0 ? (
                filteredTrains.map((train, idx) => {
                  const isDep = train.type === 'DEPARTURE';
                  const delay = train.delayMinutes || 0;
                  const isLate = delay > 0;

                  return (
                    <tr key={idx} className="hover:bg-[#0c1e38] transition-colors">
                      {/* Train Number & Name */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className="train-number-badge text-xs">{train.trainNumber}</span>
                          <span className="font-bold text-white tracking-wide">{train.trainName}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isDep ? 'bg-[#0f244c] text-[#93c5fd] border border-[#1e3a6d]' : 'bg-[#1e1b4b] text-[#c7d2fe] border border-[#3730a3]'
                        }`}>
                          {train.type}
                        </span>
                      </td>

                      {/* Route */}
                      <td className="py-3 px-3 text-[#cbd5e1]">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[#ffd200] font-bold">{train.origin}</span>
                          <ArrowRight size={13} className="text-[#64748b]" />
                          <span className="text-[#ffd200] font-bold">{train.destination}</span>
                        </div>
                      </td>

                      {/* Times */}
                      <td className="py-3 px-3">
                        <div className="text-white font-medium">
                          {train.scheduledTime}
                        </div>
                        {isLate && (
                          <div className="text-xs text-[#f59e0b] font-bold">
                            Exp: {train.expectedTime}
                          </div>
                        )}
                      </td>

                      {/* Platform */}
                      <td className="py-3 px-3">
                        <span className="px-2 py-1 bg-[#020712] text-[#ffd200] font-black rounded border border-[#ffd200]/40 text-xs">
                          PF {train.platform || '--'}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1.5">
                          <span className={`signal-lamp ${isLate ? (delay > 20 ? 'red' : 'amber') : 'green'} signal-pulse`}></span>
                          <span className={`font-bold text-xs ${isLate ? 'text-[#f59e0b]' : 'text-[#10b981]'}`}>
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
                  <td colSpan={7} className="py-6 text-center text-[#94a3b8]">
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
