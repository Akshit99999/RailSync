'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ArrowRightLeft, Train, Calendar, AlertCircle, ArrowRight, MapPin, Loader2 } from 'lucide-react';

export default function SearchSection({ onTrackTrain }) {
  const [searchMode, setSearchMode] = useState('stations'); // 'stations' | 'number'
  
  // Station search state
  const [fromQuery, setFromQuery] = useState('');
  const [toQuery, setToQuery] = useState('');
  const [selectedFrom, setSelectedFrom] = useState({ code: 'NDLS', name: 'New Delhi', state: 'Delhi' });
  const [selectedTo, setSelectedTo] = useState({ code: 'MMCT', name: 'Mumbai Central', state: 'Maharashtra' });
  
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
    setFromQuery(val);
    setShowFromDropdown(true);
    fetchStationSuggestions(val, setFromSuggestions);
  };

  const handleToChange = (e) => {
    const val = e.target.value;
    setToQuery(val);
    setShowToDropdown(true);
    fetchStationSuggestions(val, setToSuggestions);
  };

  const handleSwapStations = () => {
    const temp = selectedFrom;
    setSelectedFrom(selectedTo);
    setSelectedTo(temp);
    setFromQuery('');
    setToQuery('');
  };

  // Perform train search between stations
  const handleStationSearch = async (e) => {
    if (e) e.preventDefault();
    if (!selectedFrom?.code || !selectedTo?.code) {
      setErrorMessage('Please choose valid departure and arrival stations.');
      return;
    }
    if (selectedFrom.code === selectedTo.code) {
      setErrorMessage('Source and Destination stations cannot be identical.');
      return;
    }

    setErrorMessage('');
    setIsSearching(true);
    setSearchResults(null);

    try {
      const res = await fetch(`/api/search?from=${selectedFrom.code}&to=${selectedTo.code}`);
      const data = await res.json();
      if (data.success) {
        setSearchResults(data.data || []);
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
    onTrackTrain(cleanNum);
  };

  // Quick preset shortcuts
  const selectQuickRoute = (fromCode, fromName, toCode, toName) => {
    setSelectedFrom({ code: fromCode, name: fromName });
    setSelectedTo({ code: toCode, name: toName });
    setFromQuery('');
    setToQuery('');
    setSearchMode('stations');
  };

  return (
    <div className="space-y-6">
      {/* Search Type Mode Switcher */}
      <div className="station-signboard p-4 sm:p-6 rounded-md">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1b345f]">
          <div className="flex items-center gap-2">
            <span className="station-code-pill text-xs">ENQUIRY</span>
            <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
              TRAIN SEARCH & CORRIDOR LOOKUP
            </h2>
          </div>

          <div className="flex bg-[#050e1c] p-1 rounded border border-[#1e3a6d]">
            <button
              type="button"
              onClick={() => { setSearchMode('stations'); setErrorMessage(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                searchMode === 'stations'
                  ? 'bg-[#ffd200] text-[#050d1c] font-bold'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Between Stations
            </button>
            <button
              type="button"
              onClick={() => { setSearchMode('number'); setErrorMessage(''); }}
              className={`px-3 py-1 text-xs font-semibold rounded transition-colors ${
                searchMode === 'number'
                  ? 'bg-[#ffd200] text-[#050d1c] font-bold'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Train Number
            </button>
          </div>
        </div>

        {/* Error Alert Box */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-[#3f0f15] border border-[#ef4444] rounded text-[#fca5a5] text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
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
                <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
                  Origin Station (From)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={fromQuery || (selectedFrom ? `${selectedFrom.name} (${selectedFrom.code})` : '')}
                    onChange={handleFromChange}
                    onFocus={() => setShowFromDropdown(true)}
                    placeholder="Enter station name or code..."
                    className="rail-input font-medium pr-10"
                  />
                  <MapPin size={16} className="absolute right-3 top-3 text-[#94a3b8]" />
                </div>

                {/* Autocomplete Dropdown */}
                {showFromDropdown && fromSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#091730] border border-[#ffd200] rounded z-30 max-h-56 overflow-y-auto shadow-2xl">
                    {fromSuggestions.map((stn) => (
                      <div
                        key={stn.code}
                        onClick={() => {
                          setSelectedFrom(stn);
                          setFromQuery('');
                          setShowFromDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-[#132c60] cursor-pointer flex items-center justify-between border-b border-[#142646] last:border-b-0"
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

              {/* SWAP BUTTON */}
              <div className="lg:col-span-1 flex justify-center pt-2 sm:pt-4">
                <button
                  type="button"
                  onClick={handleSwapStations}
                  title="Swap Origin & Destination"
                  className="p-2.5 rounded bg-[#0b1d3a] hover:bg-[#132c60] border border-[#1e3a6d] text-[#ffd200] transition-transform active:rotate-180"
                >
                  <ArrowRightLeft size={16} />
                </button>
              </div>

              {/* TO STATION */}
              <div className="lg:col-span-5 relative" ref={toRef}>
                <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
                  Destination Station (To)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={toQuery || (selectedTo ? `${selectedTo.name} (${selectedTo.code})` : '')}
                    onChange={handleToChange}
                    onFocus={() => setShowToDropdown(true)}
                    placeholder="Enter station name or code..."
                    className="rail-input font-medium pr-10"
                  />
                  <MapPin size={16} className="absolute right-3 top-3 text-[#94a3b8]" />
                </div>

                {/* Autocomplete Dropdown */}
                {showToDropdown && toSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-[#091730] border border-[#ffd200] rounded z-30 max-h-56 overflow-y-auto shadow-2xl">
                    {toSuggestions.map((stn) => (
                      <div
                        key={stn.code}
                        onClick={() => {
                          setSelectedTo(stn);
                          setToQuery('');
                          setShowToDropdown(false);
                        }}
                        className="px-3 py-2 hover:bg-[#132c60] cursor-pointer flex items-center justify-between border-b border-[#142646] last:border-b-0"
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
            </div>

            {/* Action Buttons & Quick Presets */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2 text-xs text-[#94a3b8] flex-wrap">
                <span className="font-mono text-[#ffd200]">HOT ROUTES:</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'MMCT', 'Mumbai Central')}
                  className="hover:text-white underline underline-offset-2"
                >
                  NDLS → MMCT
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'BSB', 'Varanasi Jn')}
                  className="hover:text-white underline underline-offset-2"
                >
                  NDLS → BSB
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('NDLS', 'New Delhi', 'HWH', 'Howrah Jn')}
                  className="hover:text-white underline underline-offset-2"
                >
                  NDLS → HWH
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => selectQuickRoute('MAS', 'Chennai Central', 'SBC', 'KSR Bengaluru')}
                  className="hover:text-white underline underline-offset-2"
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
              <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
                Indian Railways 5-Digit Train Number
              </label>
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="text"
                    maxLength={5}
                    value={trainNumberInput}
                    onChange={(e) => setTrainNumberInput(e.target.value)}
                    placeholder="e.g. 12952 (Tejas Rajdhani), 22436 (Vande Bharat)..."
                    className="rail-input font-mono text-base font-bold tracking-widest pl-10 uppercase"
                  />
                  <Train size={18} className="absolute left-3 top-3 text-[#ffd200]" />
                </div>
                <button type="submit" className="rail-btn-primary">
                  <Train size={16} />
                  <span>Track Live Status</span>
                </button>
              </div>
              <div className="mt-2 flex items-center gap-2 text-xs text-[#94a3b8]">
                <span>Sample Trains:</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12952')}
                  className="font-mono text-[#ffd200] hover:underline"
                >
                  12952
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('22436')}
                  className="font-mono text-[#ffd200] hover:underline"
                >
                  22436
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => setTrainNumberInput('12002')}
                  className="font-mono text-[#ffd200] hover:underline"
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
          <div className="flex items-center justify-between text-xs text-[#94a3b8] px-1 font-mono">
            <span>
              FOUND {searchResults.length} TRAIN(S) BETWEEN{' '}
              <strong className="text-[#ffd200]">{selectedFrom.code}</strong> AND{' '}
              <strong className="text-[#ffd200]">{selectedTo.code}</strong>
            </span>
            <span className="text-[#10b981]">● LIVE RUNNING DATA</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {searchResults.map((train) => (
              <div
                key={train.trainNumber}
                className="station-signboard p-4 rounded hover:border-[#ffd200] transition-colors flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
              >
                {/* Train Info */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center gap-2.5 flex-wrap">
                    <span className="train-number-badge">{train.trainNumber}</span>
                    <h3 className="font-bold text-white text-base tracking-wide">
                      {train.trainName}
                    </h3>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono text-[#94a3b8] pt-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{train.departureTime}</span>
                      <span className="text-[#ffd200]">({train.fromStation || selectedFrom.code})</span>
                    </div>
                    <ArrowRight size={14} className="text-[#475569]" />
                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-bold">{train.arrivalTime}</span>
                      <span className="text-[#ffd200]">({train.toStation || selectedTo.code})</span>
                    </div>
                    <span className="hidden sm:inline text-[#475569]">|</span>
                    <span className="hidden sm:inline text-[#cbd5e1]">{train.duration}</span>
                  </div>
                </div>

                {/* Available Classes & Track Action */}
                <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end border-t md:border-t-0 pt-3 md:pt-0 border-[#142646]">
                  {train.classes && (
                    <div className="flex gap-1">
                      {train.classes.map((cls) => (
                        <span
                          key={cls}
                          className="px-2 py-0.5 bg-[#050e1c] text-[#93c5fd] font-mono text-[11px] rounded border border-[#1e3a6d]"
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
