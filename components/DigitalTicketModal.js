'use client';

import { X, Printer, Train, ShieldCheck, QrCode, Calendar, Clock, MapPin, User } from 'lucide-react';

export default function DigitalTicketModal({ ticket, isOpen, onClose }) {
  if (!isOpen || !ticket) return null;

  const handlePrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  const pnrNumber = ticket.pnr || ('2' + Math.floor(100000000 + Math.random() * 900000000));

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-amber-50 dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="signal-lamp green"></span>
            <span className="font-mono text-xs font-bold text-slate-800 dark:text-zinc-200 tracking-wider">
              IRCTC / INDIAN RAILWAYS E-TICKET PASS
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
              <span className="text-[10px] text-zinc-400 uppercase tracking-widest block">PNR NUMBER</span>
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
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase">CONFIRMED (CNF)</span>
              <div className="w-full flex items-center justify-center my-1">
                <div className="h-[2px] w-full bg-slate-300 dark:bg-zinc-700"></div>
                <Train size={14} className="text-amber-500 mx-1 shrink-0" />
                <div className="h-[2px] w-full bg-slate-300 dark:bg-zinc-700"></div>
              </div>
              <span className="text-[10px] text-slate-400 dark:text-zinc-500">ELECTRONIC PRS</span>
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
              PASSENGER RESERVATION DETAILS
            </div>
            <div className="divide-y divide-slate-100 dark:divide-zinc-800/60 text-xs">
              {(ticket.passengers && ticket.passengers.length > 0 ? ticket.passengers : [{ name: 'Aditya Sharma', age: 24, gender: 'Male', berthPref: 'Lower' }]).map((p, idx) => (
                <div key={idx} className="p-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <User size={14} className="text-slate-400" />
                    <div>
                      <span className="font-bold text-slate-800 dark:text-zinc-200">{idx + 1}. {p.name}</span>
                      <span className="text-[11px] text-slate-500 ml-2">({p.age} Yrs, {p.gender})</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold">
                      COACH {ticket.travelClass === '1A' ? 'H1' : ticket.travelClass === '2A' ? 'A1' : 'B3'} / BERTH {18 + idx * 3} ({p.berthPref || 'Lower'})
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Fare Summary & QR Code */}
          <div className="flex items-center justify-between p-4 rounded-xl bg-amber-50/50 dark:bg-zinc-900/40 border border-dashed border-amber-300 dark:border-zinc-700">
            <div className="space-y-1">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider">TOTAL FARE PAID</span>
              <p className="text-2xl font-black text-amber-600 dark:text-station-yellow">
                ₹{ticket.baseFare ? (ticket.baseFare * (ticket.passengers?.length || 1) + 85) : '1,935'}
              </p>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-semibold">
                <ShieldCheck size={12} /> VERIFIED ELECTRONIC PRS TICKET
              </span>
            </div>

            {/* Simulated Scannable QR Code */}
            <div className="flex flex-col items-center">
              <div className="p-2 bg-white rounded-lg border border-slate-300 shadow-sm">
                <QrCode size={56} className="text-black" />
              </div>
              <span className="text-[9px] text-slate-400 mt-1">SCAN AT TC DESK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
