'use client';

import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { 
  X, 
  Star, 
  Train, 
  Ticket, 
  Trash2, 
  ArrowRight, 
  CheckCircle2, 
  Calendar,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  Plus
} from 'lucide-react';

const PREMIER_SUGGESTIONS = [
  { trainNumber: '12952', trainName: 'Tejas Rajdhani Express', origin: 'NDLS', destination: 'MMCT' },
  { trainNumber: '22436', trainName: 'Vande Bharat Express', origin: 'NDLS', destination: 'BSB' },
  { trainNumber: '12002', trainName: 'Bhopal Shatabdi Express', origin: 'NDLS', destination: 'RKMP' },
];

export default function WatchlistDrawer({ isOpen, onClose, onTrackTrain, onNavigate }) {
  const { 
    watchlist, 
    addToWatchlist, 
    removeFromWatchlist, 
    savedPnrs, 
    removePnr, 
    setActivePnrQuery, 
    addToast 
  } = useApp();

  const [activeTab, setActiveTab] = useState('trains'); // 'trains' | 'pnrs'
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState('');

  // Filtered trains
  const filteredTrains = useMemo(() => {
    if (!searchQuery.trim()) return watchlist;
    const q = searchQuery.toLowerCase().trim();
    return watchlist.filter(
      (t) =>
        t.trainNumber?.toLowerCase().includes(q) ||
        t.trainName?.toLowerCase().includes(q) ||
        t.origin?.toLowerCase().includes(q) ||
        t.destination?.toLowerCase().includes(q)
    );
  }, [watchlist, searchQuery]);

  // Filtered PNRs
  const filteredPnrs = useMemo(() => {
    if (!searchQuery.trim()) return savedPnrs;
    const q = searchQuery.toLowerCase().trim();
    return savedPnrs.filter(
      (p) =>
        p.pnrNumber?.toLowerCase().includes(q) ||
        p.trainName?.toLowerCase().includes(q) ||
        p.fromStation?.toLowerCase().includes(q) ||
        p.toStation?.toLowerCase().includes(q)
    );
  }, [savedPnrs, searchQuery]);

  const handleCopy = (text, id) => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      addToast(`Copied ${text} to clipboard`, 'success');
      setTimeout(() => setCopiedId(''), 2000);
    }
  };

  const handleSelectPnr = (pnrNumber) => {
    if (setActivePnrQuery) {
      setActivePnrQuery(pnrNumber);
    }
    onNavigate('pnr');
    onClose();
    addToast(`Loading reservation chart for PNR: ${pnrNumber}`, 'info');
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 z-[115] bg-black/60 backdrop-blur-sm animate-fadeIn"
      />

      {/* Slide-over Panel */}
      <aside className="fixed inset-y-0 right-0 z-[116] w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col font-mono animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800 bg-amber-500/10 dark:bg-zinc-900/90">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <div>
              <span className="text-sm font-black text-slate-900 dark:text-zinc-100 tracking-wide block">
                SAVED TRACKER & WATCHLIST
              </span>
              <span className="text-[10px] text-slate-500 dark:text-zinc-400 font-medium">
                {watchlist.length} Starred Trains • {savedPnrs.length} Saved PNRs
              </span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:hover:text-zinc-100 hover:bg-slate-200/50 dark:hover:bg-zinc-800 transition-colors"
            title="Close Drawer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Starred Trains vs Saved PNRs */}
        <div className="p-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 space-y-2.5">
          <div className="flex bg-slate-200/80 dark:bg-zinc-900 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => {
                setActiveTab('trains');
                setSearchQuery('');
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'trains'
                  ? 'bg-amber-500 text-black shadow-sm font-black'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Train size={13} />
              <span>Starred Trains ({watchlist.length})</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('pnrs');
                setSearchQuery('');
              }}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'pnrs'
                  ? 'bg-amber-500 text-black shadow-sm font-black'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ticket size={13} />
              <span>Saved PNRs ({savedPnrs.length})</span>
            </button>
          </div>

          {/* Quick Filter Search */}
          {(activeTab === 'trains' ? watchlist.length > 0 : savedPnrs.length > 0) && (
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={activeTab === 'trains' ? 'Filter saved trains...' : 'Filter saved PNRs...'}
                className="w-full text-xs font-mono py-1.5 pl-8 pr-3 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-900 dark:text-zinc-100 placeholder-slate-400 focus:outline-none focus:border-amber-500"
              />
              <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X size={12} />
                </button>
              )}
            </div>
          )}
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* TAB 1: TRAINS */}
          {activeTab === 'trains' && (
            watchlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 px-2 text-slate-400 dark:text-zinc-500">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Star size={28} className="opacity-80" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-sm text-slate-800 dark:text-zinc-200">No Starred Trains Yet</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
                    Pin trains for instant telemetry monitoring and live status tracking from any screen.
                  </p>
                </div>

                {/* Quick Add Suggestions */}
                <div className="w-full pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2">
                  <span className="text-[10px] font-bold tracking-wider text-slate-600 dark:text-zinc-400 uppercase block">
                    Quick-Pin Flagship Corridors:
                  </span>
                  <div className="space-y-1.5 text-left">
                    {PREMIER_SUGGESTIONS.map((s) => (
                      <div
                        key={s.trainNumber}
                        className="flex items-center justify-between p-2 rounded-lg border border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-xs"
                      >
                        <div className="truncate pr-2">
                          <span className="font-bold text-amber-700 dark:text-station-yellow mr-1.5">{s.trainNumber}</span>
                          <span className="text-slate-700 dark:text-zinc-300 font-medium truncate">{s.trainName}</span>
                        </div>
                        <button
                          onClick={() => addToWatchlist(s)}
                          className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-black font-bold text-[10px] flex items-center gap-1 shrink-0 transition-colors"
                        >
                          <Plus size={11} />
                          <span>Pin</span>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : filteredTrains.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <p className="font-bold">No saved trains matching "{searchQuery}"</p>
                <p>Try searching by 5-digit number, train name, or station code.</p>
              </div>
            ) : (
              filteredTrains.map((train) => (
                <div
                  key={train.trainNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex flex-col gap-2.5 hover:border-amber-400 dark:hover:border-station-yellow/60 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <span className="train-number-badge text-xs shrink-0">{train.trainNumber}</span>
                      <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate">
                        {train.trainName}
                      </span>
                    </div>

                    <button
                      onClick={() => removeFromWatchlist(train.trainNumber)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove from saved trains"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  {train.origin && train.destination && (
                    <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1.5">
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{train.origin}</span>
                      <ArrowRight size={10} className="text-amber-500" />
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{train.destination}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleCopy(train.trainNumber, train.trainNumber)}
                      className="text-[10px] text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 flex items-center gap-1 font-mono transition-colors"
                      title="Copy Train Number"
                    >
                      {copiedId === train.trainNumber ? (
                        <>
                          <Check size={11} className="text-emerald-500" />
                          <span className="text-emerald-600 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={11} />
                          <span>Copy #{train.trainNumber}</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onTrackTrain(train.trainNumber);
                        onClose();
                      }}
                      className="px-3 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-amber-400 text-black flex items-center gap-1 transition-colors shadow-sm"
                      title="Launch Live Telemetry Tracker"
                    >
                      <span>Track Live</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {/* TAB 2: PNRS */}
          {activeTab === 'pnrs' && (
            savedPnrs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-10 px-2 text-slate-400 dark:text-zinc-500">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
                  <Ticket size={28} className="opacity-80" />
                </div>
                <div className="space-y-1">
                  <p className="font-black text-sm text-slate-800 dark:text-zinc-200">No Saved PNRs</p>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 max-w-xs">
                    Search any 10-digit Indian Railways PNR and click "SAVE PNR" to pin your journey here.
                  </p>
                </div>

                <button
                  onClick={() => handleSelectPnr('2458910243')}
                  className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <Sparkles size={13} />
                  <span>Try Demo PNR: 2458910243</span>
                </button>
              </div>
            ) : filteredPnrs.length === 0 ? (
              <div className="py-12 text-center text-xs text-slate-500 dark:text-zinc-400 space-y-1">
                <p className="font-bold">No saved PNRs matching "{searchQuery}"</p>
                <p>Try searching by 10-digit PNR number or train name.</p>
              </div>
            ) : (
              filteredPnrs.map((p) => (
                <div
                  key={p.pnrNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2.5 hover:border-amber-400 dark:hover:border-station-yellow/60 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 dark:text-station-yellow text-xs font-black border border-amber-400/30">
                      PNR: {p.pnrNumber}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleCopy(p.pnrNumber, p.pnrNumber)}
                        className="p-1 text-slate-400 hover:text-slate-800 dark:hover:text-zinc-200 transition-colors"
                        title="Copy PNR"
                      >
                        {copiedId === p.pnrNumber ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                      </button>
                      <button
                        onClick={() => removePnr(p.pnrNumber)}
                        className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                        title="Delete saved PNR"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{p.trainName || `Train #${p.trainNumber}`}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{p.fromStation}</span>
                      <ArrowRight size={10} className="text-amber-500" />
                      <span className="font-bold text-slate-700 dark:text-zinc-300">{p.toStation}</span>
                      {p.doj && <span className="text-slate-400 dark:text-zinc-500">• {p.doj}</span>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between gap-2">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-black">
                      {p.chartStatus || 'CHART PREPARED'}
                    </span>
                    <button
                      onClick={() => handleSelectPnr(p.pnrNumber)}
                      className="px-2.5 py-1 text-xs text-black font-bold rounded-lg bg-amber-500 hover:bg-amber-400 flex items-center gap-1 transition-colors shadow-sm"
                      title="Load Chart & Berth Visualizer"
                    >
                      <span>View Chart</span>
                      <ExternalLink size={11} />
                    </button>
                  </div>
                </div>
              ))
            )
          )}
        </div>
      </aside>
    </>
  );
}
