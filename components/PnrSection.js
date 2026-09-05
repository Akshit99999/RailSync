'use client';

import { useState } from 'react';
import { Ticket, Search, AlertCircle, CheckCircle2, User, Calendar, MapPin, Train, Loader2 } from 'lucide-react';

export default function PnrSection() {
  const [pnrInput, setPnrInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [pnrData, setPnrData] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const handlePnrSubmit = async (e) => {
    if (e) e.preventDefault();
    const cleanPnr = pnrInput.replace(/\D/g, '').trim();

    if (cleanPnr.length !== 10) {
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
      } else {
        setErrorMessage(data.error || 'PNR record not found or flushed from IRCTC PRS servers.');
      }
    } catch (err) {
      setErrorMessage('Communication error with Passenger Reservation System. Please retry.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestPnr = () => {
    setPnrInput('2458910243');
    setErrorMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Search Input Box */}
      <div className="station-signboard p-4 sm:p-6 rounded-md">
        <div className="flex items-center gap-2 pb-4 border-b border-[#1b345f]">
          <span className="station-code-pill text-xs">PRS ENQUIRY</span>
          <h2 className="text-lg sm:text-xl font-bold text-white tracking-wide">
            PASSENGER NAME RECORD (PNR) STATUS
          </h2>
        </div>

        <form onSubmit={handlePnrSubmit} className="mt-5 max-w-2xl">
          <label className="block text-xs font-mono text-[#ffd200] uppercase mb-1">
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
                className="rail-input font-mono text-lg font-bold tracking-widest pl-10"
              />
              <Ticket size={20} className="absolute left-3 top-3 text-[#ffd200]" />
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

          <div className="mt-2 flex items-center gap-2 text-xs text-[#94a3b8]">
            <span>Need a test PNR?</span>
            <button
              type="button"
              onClick={handleTestPnr}
              className="font-mono text-[#ffd200] hover:underline"
            >
              Load Sample PNR (2458910243)
            </button>
          </div>
        </form>

        {/* Error Notification */}
        {errorMessage && (
          <div className="mt-4 p-3 bg-[#3f0f15] border border-[#ef4444] rounded text-[#fca5a5] text-xs sm:text-sm flex items-start gap-2.5">
            <AlertCircle size={18} className="text-[#ef4444] shrink-0 mt-0.5" />
            <div className="flex-1">
              <span className="font-bold">PRS STATUS NOTICE: </span>
              {errorMessage}
            </div>
          </div>
        )}
      </div>

      {/* Reservation Chart Output */}
      {pnrData && (
        <div className="pnr-chart-paper p-5 sm:p-7 rounded-md space-y-6">
          {/* Chart Header Stamp */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-[#234377]">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="bg-[#ffd200] text-[#050d1c] font-mono font-black text-sm px-2.5 py-0.5 rounded">
                  PNR: {pnrData.pnr}
                </span>
                <span className="text-xs font-mono text-[#94a3b8]">
                  INDIAN RAILWAYS PASSENGER RESERVATION SYSTEM
                </span>
              </div>
              <h3 className="text-xl font-bold text-white tracking-wide pt-1">
                {pnrData.trainName} ({pnrData.trainNumber})
              </h3>
            </div>

            {/* Chart Preparation Status */}
            <div className="flex items-center gap-2.5 bg-[#050e1d] px-3.5 py-2 rounded border border-[#1e3a6d]">
              <span className="signal-lamp green signal-pulse"></span>
              <div className="text-right">
                <div className="text-[10px] font-mono text-[#94a3b8]">CHARTING STATUS</div>
                <div className="text-xs font-mono font-bold text-[#10b981]">
                  {pnrData.chartStatus || 'CHART PREPARED'}
                </div>
              </div>
            </div>
          </div>

          {/* Journey Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-[#050e1d] p-3 rounded border border-[#142646]">
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono mb-1">
                <Calendar size={13} className="text-[#ffd200]" />
                <span>JOURNEY DATE</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {pnrData.doj || '05-Sep-2026'}
              </div>
            </div>

            <div className="bg-[#050e1d] p-3 rounded border border-[#142646]">
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono mb-1">
                <MapPin size={13} className="text-[#10b981]" />
                <span>BOARDING POINT</span>
              </div>
              <div className="text-sm font-bold text-[#ffd200] font-mono">
                {pnrData.boardingPoint || pnrData.fromStation} ({pnrData.fromStationName || ''})
              </div>
            </div>

            <div className="bg-[#050e1d] p-3 rounded border border-[#142646]">
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono mb-1">
                <MapPin size={13} className="text-[#38bdf8]" />
                <span>DESTINATION</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {pnrData.toStation} ({pnrData.toStationName || ''})
              </div>
            </div>

            <div className="bg-[#050e1d] p-3 rounded border border-[#142646]">
              <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-mono mb-1">
                <Ticket size={13} className="text-[#f59e0b]" />
                <span>BOOKING CLASS</span>
              </div>
              <div className="text-sm font-bold text-white font-mono">
                {pnrData.reservationClass || '3A (AC 3 Tier)'}
              </div>
            </div>
          </div>

          {/* Passenger Berth Details Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-[#94a3b8]">
              <span>PASSENGER BERTH ALLOCATION MATRIX</span>
              <span className="text-[#ffd200]">{pnrData.passengers?.length || 1} PASSENGER(S)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse font-mono text-xs sm:text-sm">
                <thead>
                  <tr className="bg-[#050e1d] text-[#ffd200] border-b border-[#234377]">
                    <th className="py-2.5 px-3">#</th>
                    <th className="py-2.5 px-3">BOOKING STATUS</th>
                    <th className="py-2.5 px-3">CURRENT STATUS</th>
                    <th className="py-2.5 px-3">COACH</th>
                    <th className="py-2.5 px-3">BERTH NO</th>
                    <th className="py-2.5 px-3">BERTH TYPE</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#142646]">
                  {pnrData.passengers && pnrData.passengers.length > 0 ? (
                    pnrData.passengers.map((p, idx) => (
                      <tr key={idx} className="hover:bg-[#0c1e38] transition-colors">
                        <td className="py-3 px-3 text-[#94a3b8] font-bold">
                          Passenger {p.number || idx + 1}
                        </td>
                        <td className="py-3 px-3 text-[#cbd5e1]">
                          {p.bookingStatus || 'CNF'}
                        </td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-0.5 rounded bg-[#064e3b] text-[#6ee7b7] font-bold border border-[#059669]">
                            {p.currentStatus || 'CONFIRMED'}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-[#ffd200] font-black text-base">
                          {p.coach || '--'}
                        </td>
                        <td className="py-3 px-3 text-white font-black text-base">
                          {p.berth || '--'}
                        </td>
                        <td className="py-3 px-3 text-[#93c5fd]">
                          {p.berthType || 'LOWER BERTH (LB)'}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={6} className="py-4 text-center text-[#94a3b8]">
                        Passenger details not available
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Coach Berth Visual Key */}
          <div className="bg-[#050e1d] p-4 rounded border border-[#142646] space-y-2">
            <div className="text-xs font-mono text-[#ffd200] font-bold">
              BERTH CODE GUIDE (INDIAN RAILWAYS STANDARD)
            </div>
            <div className="flex flex-wrap gap-4 text-xs font-mono text-[#94a3b8]">
              <span><strong className="text-white">LB:</strong> Lower Berth</span>
              <span><strong className="text-white">MB:</strong> Middle Berth</span>
              <span><strong className="text-white">UB:</strong> Upper Berth</span>
              <span><strong className="text-white">SL:</strong> Side Lower</span>
              <span><strong className="text-white">SU:</strong> Side Upper</span>
              <span><strong className="text-white">SM:</strong> Side Middle</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
