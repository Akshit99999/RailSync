'use client';

import { X } from 'lucide-react';

export default function FormInput({
  label,
  name,
  value,
  onChange,
  onBlur,
  error,
  touched,
  placeholder,
  type = 'text',
  icon: Icon,
  badge,
  required = false,
  maxLength,
  hint,
  onClear,
  disabled = false,
  className = '',
}) {
  const hasError = Boolean(touched && error);

  return (
    <div className={`flex flex-col space-y-1.5 ${className}`}>
      {/* Label and Optional Badge / Error indicator */}
      {label && (
        <div className="flex items-center justify-between text-xs font-mono">
          <label htmlFor={name} className="font-semibold text-slate-700 dark:text-zinc-300 flex items-center gap-1">
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {badge && (
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
              {badge}
            </span>
          )}
        </div>
      )}

      {/* Input Box Wrapper */}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 pointer-events-none text-slate-400 dark:text-zinc-500 transition-colors">
            <Icon size={16} />
          </div>
        )}

        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          maxLength={maxLength}
          disabled={disabled}
          className={`w-full text-sm font-mono rounded-lg transition-all duration-150 outline-none
            ${Icon ? 'pl-10' : 'pl-3.5'}
            ${onClear && value ? 'pr-9' : 'pr-3.5'}
            py-2.5
            bg-white dark:bg-zinc-900 
            text-slate-900 dark:text-zinc-100
            border
            ${hasError 
              ? 'border-rose-500 ring-1 ring-rose-500/20' 
              : touched && !hasError && value
                ? 'border-emerald-500/70 dark:border-emerald-500/50 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10'
                : 'border-slate-300 dark:border-zinc-800 focus:border-station-yellow focus:ring-2 focus:ring-station-yellow/20'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed bg-slate-100 dark:bg-zinc-950' : ''}
          `}
        />

        {/* Clear Button */}
        {onClear && value && !disabled && (
          <button
            type="button"
            onClick={onClear}
            className="absolute right-3 p-1 rounded-full text-slate-400 hover:text-slate-600 dark:text-zinc-500 dark:hover:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Clear input"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Helper Hint or Validation Error */}
      {hasError ? (
        <p className="text-[11px] font-mono text-rose-500 flex items-center gap-1 animate-fadeIn">
          <span>⚠</span> {error}
        </p>
      ) : hint ? (
        <p className="text-[11px] font-mono text-slate-500 dark:text-zinc-500">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
