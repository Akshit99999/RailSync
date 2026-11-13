'use client';

import { X, Printer, Train, Calendar, Clock } from 'lucide-react';

export default function DigitalTicketModal({ ticket, isOpen, onClose }) {
  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const pnrNumber = `DEMO-${ticket.pnr || 'SAMPLE'}`;

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="signal-lamp green"></span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wider">
              RAILSYNC DEMONSTRATION ITINERARY
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1 text-xs font-mono font-semibold rounded-md bg-amber-500 text-black hover:bg-station-yellow transition-colors"
            >
              <Printer size={13} />
              <span>PRINT / PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Boarding Pass Body */}
        <div className="p-6 overflow-y-auto space-y-5 font-mono print:p-0">
          <p className="border border-amber-300 bg-amber-50 px-3 py-2 text-xs font-sans font-semibold text-amber-950">
            DEMO ONLY · Not a railway ticket. No reservation was made and no fare was charged.
          </p>
          {/* Ticket Header Banner */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 text-white">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Train size={18} className="text-station-yellow" />
                <span className="text-base font-bold tracking-wide">{ticket.trainNumber} - {ticket.trainName}</span>
              </div>
              <p className="text-xs text-zinc-400">CLASS: <strong className="text-white">{ticket.travelClass || '3A'}</strong> • QUOTA: <strong className="text-white">{ticket.quota || 'GN'}</strong></p>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">SAMPLE REFERENCE</span>
              <span className="text-lg font-black text-station-yellow tracking-wider">{pnrNumber}</span>
            </div>
          </div>

          {/* Route Grid */}
          <div className="grid grid-cols-3 items-center p-4 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200 dark:border-zinc-800 text-center">
            <div className="space-y-1 text-left">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">FROM</span>
              <p className="text-xl font-black text-slate-900 dark:text-zinc-100">{ticket.fromStation}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center gap-1">
                <Calendar size={11} /> {ticket.travelDate || 'Journey Date'}
              </p>
            </div>

            <div className="flex flex-col items-center">
              <span className="text-[10px] text-amber-700 dark:text-amber-300 font-bold uppercase">SAMPLE ONLY</span>
              <div className="w-full flex items-center justify-center my-1">
                <div className="h-[2px] w-full bg-slate-300 dark:bg-zinc-700"></div>
                <Train size={14} className="text-amber-500 mx-1 shrink-0" />
                <div className="h-[2px] w-full bg-slate-300 dark:bg-zinc-700"></div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">DEMO OUTPUT</span>
            </div>

            <div className="space-y-1 text-right">
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 uppercase">TO</span>
              <p className="text-xl font-black text-slate-900 dark:text-zinc-100">{ticket.toStation}</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 flex items-center justify-end gap-1">
                <Clock size={11} /> Scheduled Run
              </p>
            </div>
          </div>

          {/* Passenger Berth Details */}
          <div className="border border-slate-200 dark:border-zinc-800 rounded-xl overflow-hidden">
            <div className="bg-slate-100 dark:bg-zinc-900 px-4 py-2 border-b border-slate-200 dark:border-zinc-800 text-xs font-bold text-slate-700 dark:text-zinc-300">
              SAMPLE PASSENGER COUNT
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
              {(ticket.passengers && ticket.passengers.length > 0 ? ticket.passengers : Array.from({ length: ticket.passengerCount || 1 }, (_, number) => ({ number: number + 1 }))).map((p, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-zinc-200">Sample passenger {idx + 1}</span>
                  <div className="text-right">
                    <span className="px-2 py-0.5 bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 font-bold">
                      {ticket.berthPreference || 'Lower'} preference · no berth assigned
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary & QR Code */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 dark:bg-zinc-900/40 border border-dashed border-amber-300 dark:border-zinc-700">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">ESTIMATED SAMPLE FARE</span>
              <p className="text-2xl font-black text-amber-600 dark:text-station-yellow">
                ₹{ticket.baseFare ? (ticket.baseFare * (ticket.passengers?.length || 1) + 85) : '1,935'}
              </p>
              <span className="text-[10px] text-amber-800 dark:text-amber-300 flex items-center gap-1 font-semibold">Not charged · no ticket issued</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 grid place-items-center border border-amber-400 text-xs font-black text-amber-800">DEMO</div>
              <span className="text-[9px] text-slate-500 mt-1">NOT FOR TRAVEL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
