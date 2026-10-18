'use client';

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function SelectDropdown({
  label,
  value,
  options = [],
  onChange,
  icon: Icon,
  required = false,
  error,
  touched,
  className = '',
}) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative flex flex-col space-y-1.5 ${className}`} ref={containerRef}>
      {label && (
        <label className="text-xs font-mono font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
          {label}
          {required && <span className="text-rose-500">*</span>}
        </label>
      )}

      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between text-sm font-mono rounded-lg px-3.5 py-2.5 transition-all duration-150
          bg-white dark:bg-zinc-900 
          border 
          ${touched && error 
            ? 'border-rose-500 ring-1 ring-rose-500/20' 
            : isOpen 
              ? 'border-station-yellow ring-2 ring-station-yellow/20' 
              : 'border-slate-300 dark:border-zinc-800 hover:border-slate-400 dark:hover:border-zinc-700'
          }
        `}
      >
        <div className="flex items-center gap-2.5 truncate">
          {Icon && <Icon size={16} className="text-slate-400 dark:text-zinc-500 shrink-0" />}
          <div className="flex flex-col text-left truncate">
            <span className="font-bold text-slate-900 dark:text-zinc-100">{selectedOption?.label}</span>
            {selectedOption?.subtitle && (
              <span className="text-[10px] text-slate-500 dark:text-zinc-400">{selectedOption.subtitle}</span>
            )}
          </div>
        </div>
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-[calc(100%+4px)] left-0 w-full z-50 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl shadow-xl overflow-hidden animate-fadeIn py-1">
          {options.map((opt) => {
            const isSelected = opt.value === value;
            return (
              <div
                key={opt.value}
                onClick={() => {
                  onChange(opt.value);
                  setIsOpen(false);
                }}
                className={`flex items-center justify-between px-3.5 py-2 text-xs font-mono cursor-pointer transition-colors
                  ${isSelected ? 'bg-amber-500/10 text-station-yellow font-bold' : 'text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800'}
                `}
              >
                <div>
                  <p className="font-semibold">{opt.label}</p>
                  {opt.subtitle && <p className="text-[10px] text-slate-400 dark:text-zinc-500">{opt.subtitle}</p>}
                </div>
                {isSelected && <Check size={14} className="text-amber-500 dark:text-station-yellow" />}
              </div>
            );
          })}
        </div>
      )}

      {touched && error && (
        <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1">
          <span>⚠</span> {error}
        </p>
      )}
    </div>
  );
}
