'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';
import { 
  Activity, 
  RotateCw, 
  TrendingUp, 
  AlertTriangle, 
  Zap, 
  Users, 
  ShieldAlert, 
  Clock, 
  CheckCircle2, 
  X,
  Gauge
} from 'lucide-react';

export default function ControlDashboard() {
  const {
    status,
    error,
    lastUpdated,
    kpis,
    zoneStats,
    incidents,
    selectedZone,
    setSelectedZone,
    dismissIncident,
    fetchNetworkStats,
  } = useDashboardStore();

  useEffect(() => {
    // Initial fetch on mount
    fetchNetworkStats();
  }, [fetchNetworkStats]);

  const filteredZones = selectedZone === 'ALL'
    ? zoneStats
    : zoneStats.filter((z) => z.zone === selectedZone);

  return (
    <div className="space-y-6 font-mono">
      {/* Top Telemetry Header */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-black text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-station-yellow text-xs font-bold uppercase tracking-wider mb-1">
            <Activity size={16} />
            <span>INDIAN RAILWAYS OPERATIONAL CONTROL DESK</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Executive Telemetry & Punctuality Center</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Real-time multi-zonal performance monitoring, interlocking signal aspects, and network traffic status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-zinc-400 font-mono flex items-center gap-1">
              <Clock size={12} /> SYNCED: {lastUpdated}
            </span>
          )}

          <button
            onClick={() => fetchNetworkStats()}
            disabled={status === 'loading'}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-station-yellow text-black transition-all disabled:opacity-50"
          >
            <RotateCw size={14} className={status === 'loading' ? 'animate-spin' : ''} />
            <span>{status === 'loading' ? 'POLLING...' : 'REFRESH'}</span>
          </button>
        </div>
      </div>

      {/* Error Banner If Async Fetch Failed */}
      {status === 'error' && error && (
        <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
          <AlertTriangle size={16} className="shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
        {/* Punctuality */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">PUNCTUALITY</span>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{kpis.punctuality}%</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${kpis.punctuality}%` }}></div>
          </div>
        </div>

        {/* Active Trains */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">ACTIVE RAKES</span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
            {kpis.activeTrains.toLocaleString()}
          </div>
          <span className="text-[10px] text-emerald-500 flex items-center gap-0.5">
            <TrendingUp size={10} /> +1.2% Daily Peak
          </span>
        </div>

        {/* Avg Network Delay */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">AVG DELAY</span>
          <div className="text-2xl font-black text-amber-600 dark:text-station-yellow">
            {kpis.avgDelayMinutes}m
          </div>
          <span className="text-[10px] text-slate-400">Within buffer SLA</span>
        </div>

        {/* Signal Health */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">LINE CLEAR %</span>
          <div className="text-2xl font-black text-emerald-500">
            {kpis.signalsGreen}%
          </div>
          <span className="text-[10px] text-slate-400">Automatic block</span>
        </div>

        {/* Daily Passengers */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">PASSENGERS</span>
          <div className="text-2xl font-black text-slate-900 dark:text-zinc-100">
            {kpis.dailyPassengersMillion}M
          </div>
          <span className="text-[10px] text-slate-400">Daily commuters</span>
        </div>

        {/* Grid Traction */}
        <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-sm space-y-1">
          <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider">OHE POWER</span>
          <div className="text-2xl font-black text-cyan-500">
            {kpis.tractionPowerMW} MW
          </div>
          <span className="text-[10px] text-slate-400">25 kV AC Traction</span>
        </div>
      </div>

      {/* Main Operational Body */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Zone Performance Table */}
        <div className="lg:col-span-8 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <Gauge size={16} className="text-amber-500 dark:text-station-yellow" />
              <span>ZONAL OPERATIONAL TELEMETRY</span>
            </h3>

            {/* Zone Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0 text-xs">
              {['ALL', 'NR', 'WR', 'CR', 'SR', 'ER', 'SCR'].map((z) => (
                <button
                  key={z}
                  onClick={() => setSelectedZone(z)}
                  className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors
                    ${selectedZone === z
                      ? 'bg-amber-500 text-black'
                      : 'bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                    }
                  `}
                >
                  {z}
                </button>
              ))}
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-zinc-800 text-slate-400 dark:text-zinc-500 font-semibold">
                  <th className="py-2.5 px-3">ZONE</th>
                  <th className="py-2.5 px-3">NAME</th>
                  <th className="py-2.5 px-3 text-right">ACTIVE TRAINS</th>
                  <th className="py-2.5 px-3 text-right">PUNCTUALITY</th>
                  <th className="py-2.5 px-3 text-center">STATUS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800/60 font-mono">
                {filteredZones.map((z) => (
                  <tr key={z.zone} className="hover:bg-slate-50 dark:hover:bg-zinc-800/40 transition-colors">
                    <td className="py-3 px-3 font-bold text-amber-600 dark:text-station-yellow">{z.zone}</td>
                    <td className="py-3 px-3 text-slate-800 dark:text-zinc-200 font-medium">{z.name}</td>
                    <td className="py-3 px-3 text-right text-slate-600 dark:text-zinc-300">{z.activeTrains}</td>
                    <td className="py-3 px-3 text-right font-bold text-emerald-600 dark:text-emerald-400">{z.punctuality}%</td>
                    <td className="py-3 px-3 text-center">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold
                        ${z.status === 'Optimal' ? 'bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400' : ''}
                        ${z.status === 'Normal' ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-400' : ''}
                        ${z.status === 'Caution' ? 'bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-400' : ''}
                      `}>
                        <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                        {z.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right: Live Incidents & Speed Restriction Feed */}
        <div className="lg:col-span-4 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2">
              <ShieldAlert size={16} className="text-amber-500" />
              <span>ACTIVE CAUTION ORDERS</span>
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-400 font-bold">
              {incidents.length} NOTICES
            </span>
          </div>

          <div className="space-y-3">
            {incidents.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-400 dark:text-zinc-500">
                <CheckCircle2 size={24} className="mx-auto mb-2 text-emerald-500" />
                No active caution orders on monitored corridors.
              </div>
            ) : (
              incidents.map((inc) => (
                <div
                  key={inc.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-zinc-800/80 bg-slate-50 dark:bg-zinc-950/80 space-y-1.5 relative group"
                >
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-amber-600 dark:text-station-yellow">{inc.type}</span>
                    <span className="text-slate-400 text-[10px]">{inc.time}</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-zinc-200">{inc.location}</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">{inc.impact}</p>

                  <button
                    onClick={() => dismissIncident(inc.id)}
                    className="absolute top-2 right-2 p-1 text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Dismiss notice"
                  >
                    <X size={12} />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
