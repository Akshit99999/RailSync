'use client';

import { useApp } from '@/context/AppContext';
import { 
  X, 
  PhoneCall, 
  ShieldAlert, 
  HeartPulse, 
  Users, 
  HelpCircle, 
  Copy, 
  Check, 
  ExternalLink 
} from 'lucide-react';
import { useState } from 'react';

const HELPLINES = [
  {
    title: 'Indian Railways Unified Helpline',
    number: '139',
    desc: '24x7 all-in-one helpline for security, medical aid, accident info, complaints, and general inquiries.',
    badge: 'NATIONAL 24X7',
    icon: PhoneCall,
    color: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  },
  {
    title: 'Railway Protection Force (RPF)',
    number: '139 (Option 1) / 182',
    desc: 'Emergency security and passenger protection against harassment, theft, or track trespassing.',
    badge: 'SECURITY',
    icon: ShieldAlert,
    color: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  },
  {
    title: 'Women Passenger Safety Desk',
    number: '139 (Option 1)',
    desc: 'Dedicated assistance under Operation Meri Saheli for women traveling solo.',
    badge: 'WOMEN SAFETY',
    icon: Users,
    color: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
  },
  {
    title: 'Medical Emergency on Train',
    number: '139 (Option 2)',
    desc: 'Alerts the Train Superintendent / Ticket Examiner to arrange doctor attendance at the next scheduled halt.',
    badge: 'MEDICAL AID',
    icon: HeartPulse,
    color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
  },
];

export default function EmergencyDrawer() {
  const { emergencyDrawerOpen, setEmergencyDrawerOpen, addToast } = useApp();
  const [copiedNumber, setCopiedNumber] = useState(null);

  if (!emergencyDrawerOpen) return null;

  const handleCopy = (num) => {
    if (typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(num);
      setCopiedNumber(num);
      addToast(`Helpline ${num} copied to clipboard`, 'success');
      setTimeout(() => setCopiedNumber(null), 2000);
    }
  };

  return (
    <>
      <div 
        onClick={() => setEmergencyDrawerOpen(false)}
        className="fixed inset-0 z-[115] bg-black/70 backdrop-blur-sm animate-fadeIn"
      />

      <aside className="fixed inset-y-0 right-0 z-[116] w-full max-w-md bg-white dark:bg-zinc-950 border-l border-slate-200 dark:border-zinc-800 shadow-2xl flex flex-col font-mono animate-slideInRight">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-zinc-800 bg-rose-50 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <ShieldAlert size={18} className="text-rose-500" />
            <span className="text-sm font-bold text-slate-800 dark:text-zinc-100 tracking-wide">
              RAILMADAD EMERGENCY DESK
            </span>
          </div>

          <button
            onClick={() => setEmergencyDrawerOpen(false)}
            className="p-1 rounded-md text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-800 dark:text-amber-300">
            For any in-train incident, immediately inform the <strong>Train Ticket Examiner (TTE)</strong> or <strong>Coach Attendant</strong> in addition to calling <strong>139</strong>.
          </div>

          <div className="space-y-3">
            {HELPLINES.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  key={idx}
                  className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 shadow-sm space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-lg border ${item.color}`}>
                        <Icon size={14} />
                      </div>
                      <span className="font-bold text-xs text-slate-900 dark:text-zinc-100">{item.title}</span>
                    </div>
                    <span className="text-[9px] px-2 py-0.5 rounded-full font-bold bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400">
                      {item.badge}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 leading-relaxed">
                    {item.desc}
                  </p>

                  <div className="pt-2 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
                    <span className="text-sm font-black text-rose-600 dark:text-rose-400 tracking-wider">
                      {item.number}
                    </span>

                    <button
                      onClick={() => handleCopy(item.number)}
                      className="flex items-center gap-1 text-[11px] px-2.5 py-1 rounded bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors"
                    >
                      {copiedNumber === item.number ? (
                        <>
                          <Check size={12} className="text-emerald-500" />
                          <span className="text-emerald-500 font-bold">COPIED</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>COPY</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-900 text-center">
          <p className="text-[11px] text-slate-500 dark:text-zinc-400">
            RailSync Passenger Safety Initiative • Indian Railways
          </p>
        </div>
      </aside>
    </>
  );
}
