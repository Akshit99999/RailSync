'use client';

import { useState } from 'react';
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
  ExternalLink
} from 'lucide-react';

export default function WatchlistDrawer({ isOpen, onClose, onTrackTrain, onNavigate }) {
  const { watchlist, removeFromWatchlist, savedPnrs, removePnr } = useApp();
  const [activeTab, setActiveTab] = useState('trains'); // 'trains' | 'pnrs'

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
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800 bg-amber-50/80 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <Star size={18} className="text-amber-500 fill-amber-500" />
            <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 tracking-wide">
              SAVED WATCHLIST & TRACKER
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Switcher: Starred Trains vs Saved PNRs */}
        <div className="p-3 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950/60">
          <div className="flex bg-slate-200/70 dark:bg-zinc-900 p-1 rounded-xl text-xs font-bold">
            <button
              onClick={() => setActiveTab('trains')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'trains'
                  ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Train size={13} />
              <span>Trains ({watchlist.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('pnrs')}
              className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
                activeTab === 'pnrs'
                  ? 'bg-amber-500 dark:bg-station-yellow text-black shadow-sm'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Ticket size={13} />
              <span>PNRs ({savedPnrs.length})</span>
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === 'trains' && (
            watchlist.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-16 text-slate-400 dark:text-zinc-500">
                <Star size={32} className="opacity-30" />
                <p className="font-bold text-sm text-slate-700 dark:text-zinc-300">No Starred Trains Yet</p>
                <p className="text-xs max-w-xs">Click the star icon next to any train in Search or Live Tracker to pin it here.</p>
              </div>
            ) : (
              watchlist.map((train) => (
                <div
                  key={train.trainNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm flex items-center justify-between gap-3 hover:border-amber-400 dark:hover:border-station-yellow/50 transition-all"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="train-number-badge text-xs">{train.trainNumber}</span>
                      <span className="font-bold text-xs text-slate-900 dark:text-zinc-100 truncate max-w-[170px]">
                        {train.trainName}
                      </span>
                    </div>
                    {train.origin && train.destination && (
                      <div className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                        <span>{train.origin}</span>
                        <ArrowRight size={10} />
                        <span>{train.destination}</span>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => {
                        onTrackTrain(train.trainNumber);
                        onClose();
                      }}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-500 hover:bg-station-yellow text-black transition-colors"
                      title="Track Train"
                    >
                      Track
                    </button>
                    <button
                      onClick={() => removeFromWatchlist(train.trainNumber)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"
                      title="Remove from watchlist"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))
            )
          )}

          {activeTab === 'pnrs' && (
            savedPnrs.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-2 py-16 text-slate-400 dark:text-zinc-500">
                <Ticket size={32} className="opacity-30" />
                <p className="font-bold text-sm text-slate-700 dark:text-zinc-300">No Saved PNRs</p>
                <p className="text-xs max-w-xs">Search a 10-digit PNR and click "Save PNR" to pin your journey reservation here.</p>
              </div>
            ) : (
              savedPnrs.map((p) => (
                <div
                  key={p.pnrNumber}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-station-yellow text-xs font-black">
                      PNR: {p.pnrNumber}
                    </span>
                    <button
                      onClick={() => removePnr(p.pnrNumber)}
                      className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>

                  <div className="text-xs">
                    <p className="font-bold text-slate-900 dark:text-zinc-100">{p.trainName || `Train #${p.trainNumber}`}</p>
                    <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-zinc-400 mt-1">
                      <span>{p.fromStation}</span>
                      <ArrowRight size={10} />
                      <span>{p.toStation}</span>
                      {p.doj && <span>• {p.doj}</span>}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                      {p.chartStatus || 'CHART PREPARED'}
                    </span>
                    <button
                      onClick={() => {
                        onNavigate('pnr');
                        onClose();
                      }}
                      className="text-xs text-amber-600 dark:text-station-yellow font-bold hover:underline flex items-center gap-1"
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
