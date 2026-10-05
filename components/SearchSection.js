'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRightLeft, Train, Calendar, AlertCircle, ArrowRight, MapPin, Loader2, Sparkles, X } from 'lucide-react';
import { playRailwayChime } from '@/lib/audio-chime';
import { findStation, getStationByCode } from '@/lib/stations-data';

export default function SearchSection({ onTrackTrain }) {
  const [searchMode, setSearchMode] = useState('stations'); // 'stations' | 'number'
  
  // Station search state - starts empty as requested by user
  const [fromInput, setFromInput] = useState('');
  const [toInput, setToInput] = useState('');
  const [selectedFrom, setSelectedFrom] = useState(null);
  const [selectedTo, setSelectedTo] = useState(null);
  
  const [fromSuggestions, setFromSuggestions] = useState([]);
  const [toSuggestions, setToSuggestions] = useState([]);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);

  // Train number direct search state
  const [trainNumberInput, setTrainNumberInput] = useState('');
  
  // Results & Loading state
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const fromRef = useRef(null);
  const toRef = useRef(null);

  // Click outside listener to close autocomplete dropdowns
  useEffect(() => {
    function handleClickOutside(e) {
      if (fromRef.current && !fromRef.current.contains(e.target)) {
        setShowFromDropdown(false);
      }
      if (toRef.current && !toRef.current.contains(e.target)) {
        setShowToDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch station suggestions on input
  const fetchStationSuggestions = async (query, setSuggestions) => {
    if (!query || query.trim().length === 0) {
      setSuggestions([]);
      return;
    }
    try {
      const res = await fetch(`/api/stations?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.success && data.stations) {
        setSuggestions(data.stations);
      }
    } catch (err) {
      console.warn('Station lookup failed:', err);
    }
  };

  const handleFromChange = (e) => {
    const val = e.target.value;
    setFromInput(val);
    setSelectedFrom(null);
    setErrorMessage('');
    if (!val || val.trim().length === 0) {
      setFromSuggestions([]);
      setShowFromDropdown(false);
      return;
    }
    setShowFromDropdown(true);
    fetchStationSuggestions(val, setFromSuggestions);
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToInput(val);
    setSelectedTo(null);
    setErrorMessage('');
    if (!val || val.trim().length === 0) {
      setToSuggestions([]);
      setShowToDropdown(false);
      return;
    }
    setShowToDropdown(true);
    fetchStationSuggestions(val, setToSuggestions);
  };

  const handleClearFrom = () => {
    setFromInput('');
    setSelectedFrom(null);
    setFromSuggestions([]);
    setShowFromDropdown(false);
    setErrorMessage('');
  };

  const handleClearTo = () => {
    setToInput('');
    setSelectedTo(null);
    setToSuggestions([]);
    setShowToDropdown(false);
    setErrorMessage('');
  };

  const handleSelectFrom = (stn) => {
    setSelectedFrom(stn);
    setFromInput(`${stn.name} (${stn.code})`);
    setShowFromDropdown(false);
    setFromSuggestions([]);
    setErrorMessage('');
  };

  const handleSelectTo = (stn) => {
    setSelectedTo(stn);
    setToInput(`${stn.name} (${stn.code})`);
    setShowToDropdown(false);
    setToSuggestions([]);
    setErrorMessage('');
  };

  const handleSwapStations = () => {
    const tempStation = selectedFrom;
    const tempInput = fromInput;
    setSelectedFrom(selectedTo);
    setFromInput(toInput);
    setSelectedTo(tempStation);
    setToInput(tempInput);
    setErrorMessage('');
  };

  // Perform train search between stations
  const handleStationSearch = async (e) => {
    if (e) e.preventDefault();

    let departureStation = selectedFrom;
    if (!departureStation && fromInput.trim()) {
      const q = fromInput.trim();
      const matchCode = q.match(/\(([A-Za-z0-9]+)\)/);
      const codeOrText = matchCode ? matchCode[1] : q;
      departureStation = getStationByCode(codeOrText) || findStation(codeOrText)[0] || null;
      if (departureStation) {
        setSelectedFrom(departureStation);
        setFromInput(`${departureStation.name} (${departureStation.code})`);
      }
    }

    let arrivalStation = selectedTo;
    if (!arrivalStation && toInput.trim()) {
      const q = toInput.trim();
      const matchCode = q.match(/\(([A-Za-z0-9]+)\)/);
      const codeOrText = matchCode ? matchCode[1] : q;
      arrivalStation = getStationByCode(codeOrText) || findStation(codeOrText)[0] || null;
      if (arrivalStation) {
        setSelectedTo(arrivalStation);
        setToInput(`${arrivalStation.name} (${arrivalStation.code})`);
      }
    }

    if (!departureStation?.code || !arrivalStation?.code) {
      setErrorMessage('Please enter and select valid departure and arrival stations.');
      return;
    }
    if (departureStation.code === arrivalStation.code) {
      setErrorMessage('Source and Destination stations cannot be identical.');
      return;
    }

    setErrorMessage('');
    setIsSearching(true);
    setSearchResults(null);

    try {
      const res = await fetch(`/api/search?from=${departureStation.code}&to=${arrivalStation.code}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data || []);
        playRailwayChime();
      } else {
        setErrorMessage(data.error || 'No trains found for this route.');
      }
    } catch (err) {
      setErrorMessage('Network or server error while querying trains. Please try again.');
    } finally {
      setIsSearching(false);
    }
  };

  // Perform direct train number tracking
  const handleTrainNumberSubmit = (e) => {
    e.preventDefault();
    const cleanNum = trainNumberInput.trim();
    if (!cleanNum || cleanNum.length !== 5 || isNaN(cleanNum)) {
      setErrorMessage('Please enter a valid 5-digit Indian Railways train number (e.g. 12952).');
      return;
    }
    setErrorMessage('');
    playRailwayChime();
    onTrackTrain(cleanNum);
  };

  // Quick preset shortcuts
  const selectQuickRoute = (fromCode, fromName, toCode, toName) => {
    const fromObj = getStationByCode(fromCode) || { code: fromCode, name: fromName, state: '' };
    const toObj = getStationByCode(toCode) || { code: toCode, name: toName, state: '' };
    setSelectedFrom(fromObj);
    setFromInput(`${fromObj.name} (${fromObj.code})`);
    setSelectedTo(toObj);
    setToInput(`${toObj.name} (${toObj.code})`);
    setErrorMessage('');
    setSearchMode('stations');
  };

  return (
    <div className="space-y-6">
      {/* Search Type Mode Switcher */}
      <div className="station-signboard p-4 sm:p-6 rounded-lg transition-colors">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">ENQUIRY</span>
            <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
              TRAIN SEARCH & ROUTE LOOKUP
            </h2>
          </div>

          <div className="flex bg-slate-100 dark:bg-zinc-900 p-1 rounded-md border border-slate-300 dark:border-zinc-800">
            <button
              type="button"
              onClick={() => { setSearchMode('stations'); setErrorMessage(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                searchMode === 'stations'
                  ? 'bg-station-yellow text-black font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Between Stations
            </button>
            <button
              type="button"
              onClick={() => { setSearchMode('number'); setErrorMessage(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-all ${
                searchMode === 'number'
                  ? 'bg-station-yellow text-black font-extrabold shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Train Number
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">INQUIRY NOTICE: </span>
              {errorMessage}
            </div>
          </div>
        )}

        {/* MODE A: Between Stations Search */}
        {searchMode === 'stations' && (
          <form onSubmit={handleStationSearch} className="mt-5 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-11 gap-3 items-center">
              {/* FROM STATION */}
              <div className="lg:col-span-5 relative" ref={fromRef}>
                <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
                  Origin Station (From)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={fromInput}
                    onChange={handleFromChange}
                    onFocus={() => {
                      if (fromSuggestions.length > 0) setShowFromDropdown(true);
                    }}
                    placeholder="Enter station name or code (e.g. NDLS, DLI)..."
                    className="rail-input font-medium pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                    {fromInput && (
                      <button
                        type="button"
                        onClick={handleClearFrom}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
                        title="Clear origin station"
                        aria-label="Clear origin station"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <MapPin size={16} className="pointer-events-none" />
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border-2 border-yellow-400 dark:border-station-yellow rounded-md z-30 max-h-56 overflow-y-auto shadow-2xl">
                    {fromSuggestions.map((stn) => (
                      <div
                        key={stn.code}
                        onClick={() => handleSelectFrom(stn)}
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

              {/* SWAP BUTTON */}
              <div className="lg:col-span-1 flex justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  title="Swap Origin & Destination"
                  className="p-2.5 rounded-full bg-slate-100 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-amber-700 dark:text-station-yellow transition-transform active:rotate-180 shadow-sm"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* TO STATION */}
              <div className="lg:col-span-5 relative" ref={toRef}>
                <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
                  Destination Station (To)
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={toInput}
                    onChange={handleToChange}
                    onFocus={() => {
                      if (toSuggestions.length > 0) setShowToDropdown(true);
                    }}
                    placeholder="Enter station name or code (e.g. MMCT, CSMT)..."
                    className="rail-input font-medium pr-16"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-slate-400 dark:text-zinc-500">
                    {toInput && (
                      <button
                        type="button"
                        onClick={handleClearTo}
                        className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
                        title="Clear destination station"
                        aria-label="Clear destination station"
                      >
                        <X size={14} />
                      </button>
                    )}
                    <MapPin size={16} className="pointer-events-none" />
                  </div>
                </div>

                {/* Autocomplete Dropdown */}
                {showToDropdown && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-zinc-900 border-2 border-yellow-400 dark:border-station-yellow rounded-md z-30 max-h-56 overflow-y-auto shadow-2xl">
                    {toSuggestions.map((stn) => (
                      <div
                        key={stn.code}
                        onClick={() => handleSelectTo(stn)}
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
            </div>

            {/* Action Buttons & Quick Presets */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400 flex-wrap">
                <span className="font-mono text-amber-700 dark:text-station-yellow font-bold">HOT ROUTES:</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'MMCT', 'Mumbai Central')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → MMCT
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'BSB', 'Varanasi Jn')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → BSB
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'HWH', 'Howrah Jn')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  NDLS → HWH
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('MAS', 'Chennai Central', 'SBC', 'KSR Bengaluru')}
                  className="hover:text-black dark:hover:text-white underline underline-offset-2"
                >
                  MAS → SBC
                </button>
              </div>

              <button
                type="submit"
                disabled={isSearching}
                className="rail-btn-primary w-full sm:w-auto"
              >
                {isSearching ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Searching Rail Network...</span>
                  </>
                ) : (
                  <>
                    <Search size={16} />
                    <span>Find Running Trains</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* MODE B: Direct Train Number Search */}
        {searchMode === 'number' && (
          <form onSubmit={handleTrainNumberSubmit} className="mt-5 space-y-4">
            <div className="max-w-xl">
              <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
                Indian Railways 5-Digit Train Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={5}
                    value={trainNumberInput}
                    onChange={(e) => {
                      setTrainNumberInput(e.target.value);
                      setErrorMessage('');
                    }}
                    placeholder="e.g. 12952 (Tejas Rajdhani), 22436 (Vande Bharat)..."
                    className="rail-input font-mono text-base font-bold tracking-widest !pl-12 !pr-10 !py-3 uppercase"
                  />
                  <Train size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-station-yellow pointer-events-none z-10" />
                  {trainNumberInput && (
                    <button
                      type="button"
                      onClick={() => setTrainNumberInput('')}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-zinc-800 text-slate-400 hover:text-slate-700 dark:text-zinc-500 dark:hover:text-zinc-200 transition-colors"
                      title="Clear train number"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
                <button type="submit" className="rail-btn-primary">
                  <Train size={16} />
                  <span>Track Live Status</span>
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
                <span>Sample Trains:</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12952')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  12952
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('22436')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  22436
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12002')}
                  className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
                >
                  12002
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      {/* Train Search Results Board */}
      {searchResults && (
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-600 dark:text-zinc-400 px-1 font-mono">
            <span>
              FOUND {searchResults.length} TRAIN(S) BETWEEN{' '}
              <strong className="text-amber-700 dark:text-station-yellow">{selectedFrom?.code || 'ORIGIN'}</strong> AND{' '}
              <strong className="text-amber-700 dark:text-station-yellow">{selectedTo?.code || 'DESTINATION'}</strong>
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">● LIVE TELEMETRY</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((train) => (
              <div
                key={train.trainNumber}
                className="station-signboard p-4 rounded-lg hover:border-station-yellow transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm"
              >
                {/* Train Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="train-number-badge">{train.trainNumber}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white text-base tracking-wide">
                      {train.trainName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-slate-600 dark:text-zinc-400 pt-1 flex-wrap">
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-900 dark:text-white font-bold">{train.departureTime}</span>
                      <span className="text-amber-700 dark:text-station-yellow font-bold">({train.fromStation || selectedFrom?.code})</span>
                    </div>
                    <ArrowRight size={14} className="text-slate-400 dark:text-zinc-600" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-slate-900 dark:text-white font-bold">{train.arrivalTime}</span>
                      <span className="text-amber-700 dark:text-station-yellow font-bold">({train.toStation || selectedTo?.code})</span>
                    </div>
                    <span className="hidden sm:inline text-slate-300 dark:text-zinc-700">|</span>
                    <span className="hidden sm:inline text-slate-700 dark:text-zinc-300 font-medium">{train.duration}</span>
                  </div>
                </div>

                {/* Available Classes & Track Action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-slate-200 dark:border-zinc-800">
                  {train.classes && (
                    <div className="flex gap-1">
                      {train.classes.map((cls) => (
                        <span
                          key={cls}
                          className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-900 text-slate-800 dark:text-amber-300 font-mono text-[11px] rounded border border-slate-200 dark:border-zinc-800 font-semibold"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => onTrackTrain(train.trainNumber)}
                    className="rail-btn-primary py-2 px-4 text-xs"
                  >
                    <Train size={14} />
                    <span>Track Live</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
