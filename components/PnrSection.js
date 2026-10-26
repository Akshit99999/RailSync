import { useState, useEffect } from 'react';
import { Ticket, Search, AlertCircle, CheckCircle2, User, Calendar, MapPin, Train, Loader2, Printer, Star } from 'lucide-react';
import CoachLayout from './CoachLayout';
import BerthMap from './BerthMap';
import DigitalTicketModal from './DigitalTicketModal';
import { playRailwayChime } from '@/lib/audio-chime';
import { useApp } from '@/context/AppContext';

export default function PnrSection() {
  const { savePnr, savedPnrs, removePnr, addToast, activePnrQuery, setActivePnrQuery } = useApp();
  const [pnrInput, setPnrInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [showDigitalPass, setShowDigitalPass] = useState(false);

  const fetchPnrStatus = async (cleanPnr) => {
    if (!cleanPnr || cleanPnr.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit PNR number found on top-left of your Indian Railways ticket.');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');
    setPnrData(null);

    try {
      const res = await fetch(`/api/pnr?pnr=${cleanPnr}`);
      const data = await res.json();

      if (data.success && data.data) {
        setPnrData(data.data);
        playRailwayChime();
      } else {
        setErrorMessage(data.error || 'PNR record not found or flushed from IRCTC PRS servers.');
      }
    } catch (err) {
      setErrorMessage('Communication error with Passenger Reservation System. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePnrSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPnr = pnrInput.replace(/\D/g, '').trim();
    fetchPnrStatus(cleanPnr);
  };

  // Auto-fetch if activePnrQuery is provided via saved deep-link
  useEffect(() => {
    if (activePnrQuery && activePnrQuery.length === 10) {
      setPnrInput(activePnrQuery);
      fetchPnrStatus(activePnrQuery);
    }
  }, [activePnrQuery]);

  const handleTestPnr = () => {
    setPnrInput('2458910243');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="station-signboard p-4 sm:p-6 rounded-lg">
        <div className="flex items-center gap-2 pb-4 border-b border-slate-200 dark:border-zinc-800">
          <span className="station-code-pill text-xs">PRS ENQUIRY</span>
          <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-wide">
            PASSENGER NAME RECORD (PNR) STATUS
          </h2>
        </div>

        <form onSubmit={handlePnrSubmit} className="mt-5 max-w-2xl">
          <label className="block text-xs font-mono text-amber-700 dark:text-station-yellow font-bold uppercase mb-1">
            Enter 10-Digit PNR Number
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                maxLength={10}
                value={pnrInput}
                onChange={(e) => setPnrInput(e.target.value.replace(/\D/g, ''))}
                placeholder="e.g. 2458910243"
                className="rail-input font-mono text-lg font-bold tracking-widest !pl-12 !pr-4 !py-2.5"
              />
              <Ticket size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-600 dark:text-station-yellow pointer-events-none z-10" />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="rail-btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  <span>Checking PRS...</span>
                </>
              ) : (
                <>
                  <Search size={16} />
                  <span>Get PNR Status</span>
                </>
              )}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs text-slate-600 dark:text-zinc-400">
            <span>Need a test PNR?</span>
            <button
              type="button"
              onClick={handleTestPnr}
              className="font-mono text-amber-700 dark:text-station-yellow font-bold hover:underline"
            >
              Load Sample PNR (2458910243)
            </button>
          </div>
        </form>

        {/* Quick Access Strip: Saved PNRs */}
        {savedPnrs.length > 0 && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-zinc-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="font-bold text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
                <Star size={13} className="text-amber-500 fill-amber-500" />
                <span>SAVED JOURNEY PNRs ({savedPnrs.length})</span>
              </span>
              <span className="text-[11px] text-slate-500 dark:text-zinc-400">Click to fetch status</span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {savedPnrs.map((p) => (
                <button
                  key={p.pnrNumber}
                  type="button"
                  onClick={() => {
                    setPnrInput(p.pnrNumber);
                    fetchPnrStatus(p.pnrNumber);
                  }}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-2 whitespace-nowrap transition-all shadow-sm ${
                    pnrData?.pnr === p.pnrNumber
                      ? 'border-amber-500 bg-amber-500/15 text-amber-900 dark:text-station-yellow ring-1 ring-amber-500'
                      : 'border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 hover:border-amber-400'
                  }`}
                  title={`View chart for PNR #${p.pnrNumber}`}
                >
                  <span className="text-amber-700 dark:text-station-yellow font-black">#{p.pnrNumber}</span>
                  <span className="text-slate-400 font-normal">|</span>
                  <span className="truncate max-w-[120px] font-medium">{p.trainName || p.trainNumber}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 font-bold">
                    {p.chartStatus || 'CHART'}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 rounded-md text-rose-800 dark:text-rose-200 text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">PRS STATUS NOTICE: </span>
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Reservation Chart Output */}
      {pnrData && (
        <div className="space-y-6">
          <div className="pnr-chart-paper p-5 sm:p-7 rounded-lg space-y-6 shadow-md">
            {/* Chart Header Stamp */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-zinc-800">
              <div className="space-y-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="bg-station-yellow text-black font-mono font-black text-sm px-2.5 py-0.5 rounded shadow-sm">
                    PNR: {pnrData.pnr}
                  </span>
                  <span className="text-xs font-mono text-slate-500 dark:text-zinc-400">
                    INDIAN RAILWAYS PASSENGER RESERVATION SYSTEM
                  </span>
                </div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-wide pt-1">
                  {pnrData.trainName} ({pnrData.trainNumber})
                </h3>
              </div>

              {/* Action Buttons: Save PNR & Print Boarding Pass */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const isSaved = savedPnrs.some(p => p.pnrNumber === pnrData.pnr);
                    if (isSaved) {
                      removePnr(pnrData.pnr);
                    } else {
                      savePnr({
                        pnrNumber: pnrData.pnr,
                        trainNumber: pnrData.trainNumber,
                        trainName: pnrData.trainName,
                        fromStation: pnrData.boardingPoint || pnrData.fromStation,
                        toStation: pnrData.toStation,
                        doj: pnrData.doj,
                        chartStatus: pnrData.chartStatus,
                      });
                    }
                  }}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-mono font-bold transition-all ${
                    savedPnrs.some(p => p.pnrNumber === pnrData.pnr)
                      ? 'border-amber-500 bg-amber-500/15 text-amber-800 dark:text-station-yellow font-black'
                      : 'border-slate-300 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-slate-700 dark:text-zinc-300 hover:border-amber-500'
                  }`}
                  title="Bookmark this PNR"
                >
                  <Star size={13} fill={savedPnrs.some(p => p.pnrNumber === pnrData.pnr) ? 'currentColor' : 'none'} />
                  <span>{savedPnrs.some(p => p.pnrNumber === pnrData.pnr) ? 'SAVED' : 'SAVE PNR'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setShowDigitalPass(true)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-amber-500 hover:bg-station-yellow text-black font-mono font-bold text-xs transition-all shadow-sm"
                  title="Open Printable IRCTC E-Ticket Pass"
                >
                  <Printer size={13} />
                  <span>PRINT PASS</span>
                </button>

                {/* Chart Preparation Status */}
                <div className="flex items-center gap-2.5 bg-slate-50 dark:bg-zinc-900 px-3.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800">
                  <span className="signal-lamp green signal-pulse"></span>
                  <div className="text-right">
                    <div className="text-[9px] font-mono text-slate-500 dark:text-zinc-400">CHARTING</div>
                    <div className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                      {pnrData.chartStatus || 'CHART PREPARED'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Journey Specs Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
                  <Calendar size={13} className="text-amber-600 dark:text-station-yellow" />
                  <span>JOURNEY DATE</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {pnrData.doj || '14-Sep-2026'}
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
                  <MapPin size={13} className="text-emerald-600 dark:text-emerald-400" />
                  <span>BOARDING POINT</span>
                </div>
                <div className="text-sm font-bold text-amber-700 dark:text-station-yellow font-mono">
                  {pnrData.boardingPoint || pnrData.fromStation} ({pnrData.fromStationName || ''})
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
                  <MapPin size={13} className="text-sky-600 dark:text-sky-400" />
                  <span>DESTINATION</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {pnrData.toStation} ({pnrData.toStationName || ''})
                </div>
              </div>

              <div className="bg-slate-50 dark:bg-zinc-900/90 p-3 rounded-md border border-slate-200 dark:border-zinc-800 shadow-sm">
                <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-zinc-400 font-mono mb-1">
                  <Ticket size={13} className="text-amber-600 dark:text-amber-400" />
                  <span>BOOKING CLASS</span>
                </div>
                <div className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                  {pnrData.reservationClass || '3A (AC 3 Tier)'}
                </div>
              </div>
            </div>

            {/* Passenger Berth Details Table */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-600 dark:text-zinc-400">
                <span className="font-bold">PASSENGER BERTH ALLOCATION MATRIX</span>
                <span className="text-amber-700 dark:text-station-yellow font-bold">{pnrData.passengers?.length || 1} PASSENGER(S)</span>
              </div>

              <div className="overflow-x-auto rounded-md border border-slate-200 dark:border-zinc-800">
                <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                  <thead>
                    <tr className="bg-amber-50/70 dark:bg-zinc-950 text-amber-900 dark:text-station-yellow border-b border-slate-200 dark:border-zinc-800 font-bold">
                      <th className="py-2.5 px-3">#</th>
                      <th className="py-2.5 px-3">BOOKING STATUS</th>
                      <th className="py-2.5 px-3">CURRENT STATUS</th>
                      <th className="py-2.5 px-3">COACH</th>
                      <th className="py-2.5 px-3">BERTH NO</th>
                      <th className="py-2.5 px-3">BERTH TYPE</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-zinc-850 bg-white dark:bg-zinc-900/60">
                    {pnrData.passengers && pnrData.passengers.length > 0 ? (
                      pnrData.passengers.map((p, idx) => (
                        <tr key={idx} className="hover:bg-amber-50/50 dark:hover:bg-zinc-800/60 transition-colors">
                          <td className="py-3 px-3 text-slate-700 dark:text-zinc-300 font-bold">
                            Passenger {p.number || idx + 1}
                          </td>
                          <td className="py-3 px-3 text-slate-600 dark:text-zinc-400">
                            {p.bookingStatus || 'CNF'}
                          </td>
                          <td className="py-3 px-3">
                            <span className="px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold border border-emerald-300 dark:border-emerald-800">
                              {p.currentStatus || 'CONFIRMED'}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-amber-700 dark:text-station-yellow font-black text-base">
                            {p.coach || '--'}
                          </td>
                          <td className="py-3 px-3 text-slate-900 dark:text-white font-black text-base">
                            {p.berth || '--'}
                          </td>
                          <td className="py-3 px-3 text-sky-700 dark:text-sky-300 font-semibold">
                            {p.berthType || 'LOWER BERTH (LB)'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="py-4 text-center text-slate-500 dark:text-zinc-500">
                          Passenger details not available
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Feature: Visual Coach Position & Train Rake Diagram */}
          <CoachLayout
            rakeComposition={pnrData.rakeComposition || ['LOCO', 'EOG', 'B1', 'B2', 'B3', 'B4', 'B5', 'B6', 'PC', 'A1', 'A2', 'H1', 'EOG']}
            highlightCoach={pnrData.coachPosition || pnrData.passengers?.[0]?.coach || 'B3'}
          />

          {/* Feature: Interactive Compartment Bay Schematic */}
          <BerthMap
            passengers={pnrData.passengers || []}
            coach={pnrData.coachPosition || pnrData.passengers?.[0]?.coach || 'B3'}
          />
        </div>
      )}

      {/* Digital Boarding Pass Modal */}
      {showDigitalPass && pnrData && (
        <DigitalTicketModal
          ticket={{
            pnr: pnrData.pnr,
            trainNumber: pnrData.trainNumber,
            trainName: pnrData.trainName,
            fromStation: pnrData.boardingPoint || pnrData.fromStation,
            toStation: pnrData.toStation,
            travelDate: pnrData.doj,
            travelClass: pnrData.reservationClass,
            passengers: pnrData.passengers,
            baseFare: 1650,
          }}
          isOpen={showDigitalPass}
          onClose={() => setShowDigitalPass(false)}
        />
      )}
    </div>
  );
}
