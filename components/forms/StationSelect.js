'use client';

import { useState, useEffect, useRef } from 'react';
import { MapPin, Search, X, Check } from 'lucide-react';
import { POPULAR_STATIONS } from '@/lib/stations-data';

export default function StationSelect({
  label,
  value, // station code or object
  onChange,
  placeholder = 'Select station...',
  excludeCode = '',
  error,
  touched,
  required = false,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Normalize current station display
  const currentStation = typeof value === 'object' && value
    ? value
    : POPULAR_STATIONS.find(s => s.code === value) || (value ? { code: value, name: value } : null);

  // Filter stations based on search query
  const filteredStations = POPULAR_STATIONS.filter((s) => {
    if (excludeCode && s.code.toUpperCase() === excludeCode.toUpperCase()) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      s.code.toLowerCase().includes(q) ||
      s.name.toLowerCase().includes(q) ||
      (s.state && s.state.toLowerCase().includes(q))
    );
  }).slice(0, 8); // top 8 results

  // Click outside listener (DOM manipulation & React cleanup)
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') {
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev + 1) % Math.max(1, filteredStations.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev - 1 + filteredStations.length) % Math.max(1, filteredStations.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredStations[highlightedIndex]) {
        handleSelect(filteredStations[highlightedIndex]);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  const handleSelect = (station) => {
    onChange(station);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleClear = (e) => {
    e.stopPropagation();
    onChange(null);
    setSearchQuery('');
    setIsOpen(false);
  };

  const hasError = Boolean(touched && error);

  return (
    <div className={`relative flex flex-col space-y-1.5 ${className}`} ref={dropdownRef}>
      {label && (
        <div className="flex items-center justify-between text-xs font-mono">
          <label className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {currentStation?.zone && (
            <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 font-mono font-bold">
              {currentStation.zone} ZONE
            </span>
          )}
        </div>
      )}

      {/* Trigger Button / Display */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onClick={() => {
          setIsOpen(!isOpen);
          setTimeout(() => inputRef.current?.focus(), 50);
        }}
        className={`w-full flex items-center justify-between text-sm font-mono rounded-lg px-3.5 py-2.5 cursor-pointer select-none transition-all duration-150
          bg-white dark:bg-zinc-900 
          border 
          ${hasError 
            ? 'border-rose-500 ring-1 ring-rose-500/20' 
            : isOpen 
              ? 'border-station-yellow ring-2 ring-station-yellow/20' 
              : 'border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700'
          }
        `}
      >
        <div className="flex items-center gap-2.5 overflow-hidden">
          <MapPin size={16} className={currentStation ? 'text-station-yellow shrink-0' : 'text-slate-400 dark:text-zinc-500 shrink-0'} />
          {currentStation ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-bold text-slate-900 dark:text-zinc-100">{currentStation.code}</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400 truncate">({currentStation.name})</span>
            </div>
          ) : (
            <span className="text-slate-400 dark:text-zinc-500">{placeholder}</span>
          )}
        </div>

        {currentStation && (
          <button
            type="button"
            onClick={handleClear}
            className="p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 transition-colors"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {hasError && (
        <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-2xl overflow-hidden animate-fadeIn">
          {/* Search Sub-Input */}
          <div className="p-2 border-b border-slate-200 dark:border-zinc-800 flex items-center gap-2 bg-slate-50 dark:bg-zinc-950">
            <Search size={14} className="text-slate-400 dark:text-zinc-500 shrink-0 ml-1.5" />
            <input
              ref={inputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Type city or station code..."
              className="w-full bg-transparent text-xs font-mono outline-none text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 py-1"
            />
          </div>

          {/* List of Stations */}
          <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-zinc-800/50">
            {filteredStations.length > 0 ? (
              filteredStations.map((station, index) => {
                const isSelected = currentStation?.code === station.code;
                const isHighlighted = highlightedIndex === index;
                return (
                  <div
                    key={station.code}
                    onClick={() => handleSelect(station)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={`flex items-center justify-between px-3.5 py-2 text-xs font-mono cursor-pointer transition-colors
                      ${isHighlighted ? 'bg-amber-50 dark:bg-zinc-800/80 text-amber-900 dark:text-station-yellow' : 'text-slate-700 dark:text-zinc-300'}
                      ${isSelected ? 'font-bold' : ''}
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-bold text-amber-600 dark:text-station-yellow w-12">{station.code}</span>
                      <div className="flex flex-col">
                        <span>{station.name}</span>
                        {station.state && <span className="text-[10px] text-slate-400 dark:text-zinc-500">{station.state}</span>}
                      </div>
                    </div>
                    {isSelected && <Check size={14} className="text-emerald-500" />}
                  </div>
                );
              })
            ) : (
              <div className="p-4 text-center text-xs font-mono text-slate-400 dark:text-zinc-500">
                No matching station found.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
