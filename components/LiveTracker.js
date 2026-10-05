'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Train, RefreshCw, AlertCircle, Clock, Navigation, Gauge, MapPin, CheckCircle, Radio, Volume2 } from 'lucide-react';
import RouteRibbon from './RouteRibbon';
import CoachLayout from './CoachLayout';
import { playRailwayChime } from '@/lib/audio-chime';

// Dynamically import Leaflet TrackMap with SSR disabled
const TrackMap = dynamic(() => import('./TrackMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[400px] lg:h-[540px] rounded-lg bg-slate-100 dark:bg-zinc-950 border-2 border-slate-200 dark:border-zinc-800 flex flex-col items-center justify-center text-amber-600 dark:text-station-yellow font-mono gap-3 shadow-inner">
      <div className="w-8 h-8 border-4 border-station-yellow border-t-transparent rounded-full animate-spin"></div>
      <span className="font-bold tracking-wider">INITIALIZING GPS TRACK VIEW...</span>
    </div>
  ),
});

export default function LiveTracker({ initialTrainNumber = '12952', onSwitchToSearch }) {
  const [trainNumber, setTrainNumber] = useState(initialTrainNumber);
  const [dateSelection, setDateSelection] = useState('today');
  const [trainData, setTrainData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Fetch live tracking data
  const fetchLiveTracking = async (numberToFetch = trainNumber, date = dateSelection) => {
    if (!numberToFetch || numberToFetch.length !== 5) {
      setErrorMessage('Please enter a valid 5-digit train number.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`/api/live?train=${numberToFetch}&date=${date}`);
      const data = await res.json();

      if (data.success && data.data) {
        setTrainData(data.data);
        setLastRefreshed(new Date().toLocaleTimeString('en-IN', { hour12: false }));
        playRailwayChime();
      } else {
        setErrorMessage(data.error || 'Live tracking data unavailable for this train number.');
      }
    } catch (err) {
      setErrorMessage('Communication error with railway tracking server. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (initialTrainNumber) {
      setTrainNumber(initialTrainNumber);
      fetchLiveTracking(initialTrainNumber, dateSelection);
    }
  }, [initialTrainNumber]);

  // Auto-refresh interval every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      fetchLiveTracking(trainNumber, dateSelection);
    }, 30000);
    return () => clearInterval(interval);
  }, [autoRefresh, trainNumber, dateSelection]);

  const handleManualSearch = (e) => {
    e.preventDefault();
    fetchLiveTracking(trainNumber, dateSelection);
  };

  // Determine signal aspect based on delay
  const delay = trainData?.delayMinutes ?? 0;
  let signalClass = 'green';
  let delayBadgeClass = 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700';
  if (delay > 25) {
    signalClass = 'red';
    delayBadgeClass = 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700';
  } else if (delay > 5) {
    signalClass = 'amber';
    delayBadgeClass = 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700';
  }

  return (
    <div className="space-y-6">
      {/* Top Controller Bar */}
      <div className="station-signboard p-4 rounded-lg">
        <form onSubmit={handleManualSearch} className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="station-code-pill text-xs">CONTROL</span>
              <span className="text-slate-900 dark:text-white font-mono font-bold text-sm">TRAIN NO:</span>
            </div>

            <input
              type="text"
              maxLength={5}
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="e.g. 12952"
              className="rail-input font-mono font-bold tracking-widest text-center w-32 uppercase text-sm py-1.5 px-2"
            />

            <select
              value={dateSelection}
              onChange={(e) => {
                setDateSelection(e.target.value);
                fetchLiveTracking(trainNumber, e.target.value);
              }}
              className="rail-input w-auto text-xs py-1.5 font-medium cursor-pointer"
            >
              <option value="today">Today (Live)</option>
              <option value="yesterday">Yesterday (Active Run)</option>
            </select>

            <button type="submit" disabled={isLoading} className="rail-btn-primary py-1.5 px-3 text-xs">
              <Train size={14} />
              <span>Track</span>
            </button>
          </div>

          <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end text-xs font-mono">
            {/* Auto refresh toggle */}
            <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-zinc-400 hover:text-black dark:hover:text-white">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="accent-station-yellow"
              />
              <span>Auto-refresh (30s)</span>
            </label>

            {/* Manual refresh */}
            <button
              type="button"
              onClick={() => fetchLiveTracking(trainNumber, dateSelection)}
              disabled={isLoading}
              title="Refresh Telemetry"
              className="p-1.5 rounded-md bg-slate-100 dark:bg-zinc-900 hover:bg-amber-100 dark:hover:bg-zinc-800 border border-slate-300 dark:border-zinc-700 text-amber-700 dark:text-station-yellow transition-colors"
            >
              <RefreshCw size={14} className={isLoading ? 'animate-spin' : ''} />
            </button>

            {lastRefreshed && (
              <span className="text-slate-500 dark:text-zinc-500 hidden md:inline">
                Synced at {lastRefreshed}
              </span>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {errorMessage && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md text-rose-800 dark:text-rose-200 text-sm flex items-start gap-3">
          <AlertCircle size={20} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div className="flex-1">
            <span className="font-bold">TELEMETRY NOTICE: </span>
            {errorMessage}
          </div>
          <button
            onClick={() => fetchLiveTracking(trainNumber, dateSelection)}
            className="text-xs bg-rose-600 text-white px-2.5 py-1 rounded font-bold hover:bg-rose-700 transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Live Train Operations HUD Card */}
      {trainData && (
        <div className="station-signboard p-4 sm:p-5 rounded-lg space-y-4">
          {/* Masthead Banner: Train Name & Status */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-zinc-800">
            <div className="space-y-1">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="train-number-badge text-sm sm:text-base">
                  {trainData.trainNumber}
                </span>
                <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wider">
                  {trainData.trainName}
                </h1>
              </div>
              <div className="flex items-center gap-2 text-xs font-mono text-slate-600 dark:text-zinc-400">
                <span>CORRIDOR:</span>
                <span className="text-amber-700 dark:text-station-yellow font-bold">{trainData.origin}</span>
                <span>➔</span>
                <span className="text-amber-700 dark:text-station-yellow font-bold">{trainData.destination}</span>
              </div>
            </div>

            {/* Live Operational Status Badge */}
            <div className="flex items-center gap-3">
              <span className={`signal-lamp ${signalClass} signal-pulse`}></span>
              <div className={`px-3 py-1.5 rounded-md border text-xs font-mono font-bold tracking-wide ${delayBadgeClass}`}>
                {delay === 0 ? 'ON TIME (RIGHT TIME)' : `DELAYED BY ${delay} MINS`}
              </div>
            </div>
          </div>

          {/* Real-time Telemetry Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
            <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-mono mb-1">
                <Gauge size={14} className="text-amber-600 dark:text-station-yellow" />
                <span>CURRENT SPEED</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                {trainData.speed || '112 km/h'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-mono mb-1">
                <MapPin size={14} className="text-emerald-600 dark:text-emerald-400" />
                <span>LAST REPORTED</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-amber-700 dark:text-station-yellow font-mono">
                {trainData.lastReportedStation || '--'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-mono mb-1">
                <Navigation size={14} className="text-sky-600 dark:text-sky-400" />
                <span>NEXT STOP</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                {trainData.nextStation || '--'}
              </div>
            </div>

            <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 font-mono mb-1">
                <Clock size={14} className="text-amber-600 dark:text-amber-400" />
                <span>PROGRESS</span>
              </div>
              <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white font-mono">
                {trainData.distanceCovered || '380 km'} / {trainData.totalDistance || '1386 km'}
              </div>
            </div>
          </div>

          {/* Current Running Commentary */}
          <div className="p-3 bg-amber-50/80 dark:bg-zinc-900 border-l-4 border-yellow-400 dark:border-station-yellow rounded-r text-xs sm:text-sm font-mono text-slate-800 dark:text-zinc-200 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-amber-800 dark:text-station-yellow font-bold">STATUS BROADCAST: </span>
              {trainData.currentStatus}
            </div>
            <div className="hidden sm:flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
              <Radio size={14} className="animate-pulse" />
              <span>LIVE GPS FEED</span>
            </div>
          </div>
        </div>
      )}

      {/* Hero Dual-Pane View: Map + Route Ribbon */}
      {trainData && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Map Column (7 cols) */}
            <div className="lg:col-span-7 space-y-2">
              <TrackMap trainData={trainData} />
            </div>

            {/* Route Ribbon Column (5 cols) */}
            <div className="lg:col-span-5 h-[540px]">
              <RouteRibbon
                route={trainData.route || []}
                lastReportedStation={trainData.lastReportedStation}
                nextStation={trainData.nextStation}
                speed={trainData.speed}
                delayMinutes={trainData.delayMinutes}
              />
            </div>
          </div>

          {/* Train Rake Composition Layout */}
          <CoachLayout
            rakeComposition={trainData.rakeComposition || ['LOCO', 'EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'PC', 'A1', 'A2', 'H1', 'EOG']}
          />
        </div>
      )}
    </div>
  );
}
