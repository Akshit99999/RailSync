'use client';

import { useApp } from '@/context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export default function ToastContainer() {
  const { toasts, dismissToast } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col space-y-2 pointer-events-none max-w-sm w-full px-4 sm:px-0">
      {toasts.map((toast) => {
        let Icon = Info;
        let borderClass = 'border-amber-500/50 bg-amber-500/10 text-amber-300';

        if (toast.type === 'success') {
          Icon = CheckCircle2;
          borderClass = 'border-emerald-500/50 bg-emerald-950/90 text-emerald-300';
        } else if (toast.type === 'warning') {
          Icon = AlertTriangle;
          borderClass = 'border-amber-500/50 bg-amber-950/90 text-amber-300';
        } else if (toast.type === 'error') {
          Icon = XCircle;
          borderClass = 'border-rose-500/50 bg-rose-950/90 text-rose-300';
        } else {
          Icon = Info;
          borderClass = 'border-zinc-700 bg-zinc-900/95 text-zinc-200';
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl border shadow-2xl backdrop-blur-md transition-all transform animate-fadeIn font-mono text-xs ${borderClass}`}
          >
            <Icon size={16} className="shrink-0 mt-0.5" />
            <p className="flex-1 font-medium leading-relaxed">{toast.message}</p>
            <button
              onClick={() => dismissToast(toast.id)}
              className="p-1 rounded hover:bg-white/10 opacity-70 hover:opacity-100 transition-opacity"
            >
              <X size={12} />
            </button>
          </div>
        );
      })}
    </div>
  );
}
