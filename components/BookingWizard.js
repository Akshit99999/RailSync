'use client';

import { useState } from 'react';
import { 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  Train
} from 'lucide-react';
import MagneticButton from './MagneticButton';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';

export default function BookingWizard({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(1);
  const addItem = useCartStore((s) => s.addItem);
  const { addToast } = useApp();

  // Step 1: Corridor & Class
  const [trainNumber, setTrainNumber] = useState('12952');
  const [trainName, setTrainName] = useState('Tejas Rajdhani Express');
  const [travelClass, setTravelClass] = useState('3A');
  const [quota, setQuota] = useState('TATKAL');

  // Demo flow avoids collecting personal or account information.
  const [passengerCount, setPassengerCount] = useState('1');
  const [berthPreference, setBerthPreference] = useState('LOWER');

  const [confirmed, setConfirmed] = useState(false);

  // Validation checks
  const isStep1Valid = Boolean(trainNumber.length === 5 && travelClass && quota);
  const isStep2Valid = Number(passengerCount) >= 1 && Number(passengerCount) <= 6;
  const isStep3Valid = true;

  const handleNext = () => {
    if (currentStep === 1 && isStep1Valid) setCurrentStep(2);
    else if (currentStep === 2 && isStep2Valid) setCurrentStep(3);
    else if (currentStep === 3 && isStep3Valid) {
      // Execute booking simulation
      const mockPnr = Math.floor(1000000000 + Math.random() * 9000000000).toString();
      const ticketItem = {
        id: `tkt-${Date.now()}`,
        trainNumber,
        trainName,
        fromStation: 'NDLS',
        toStation: 'MMCT',
        travelClass,
        quota,
        distance: 1384,
        travelDate: 'Tomorrow · demo',
        pnr: mockPnr,
        passengerCount: Number(passengerCount),
        passengers: Array.from({ length: Number(passengerCount) }, (_, index) => ({ number: index + 1 })),
        berthPreference,
        baseFare: quota === 'TATKAL' ? 1980 : 1580,
        fare: quota === 'TATKAL' ? 1980 : 1580,
        demo: true,
      };

      addItem(ticketItem);
      setConfirmed(true);
      addToast(`Sample reference created: ${mockPnr}. No seat was reserved.`, 'success');
      if (onComplete) onComplete(ticketItem);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const steps = [
    { num: 1, title: 'Train & class' },
    { num: 2, title: 'Journey options' },
    { num: 3, title: 'Sample review' },
  ];

  return (
    <div className="station-signboard p-6 sm:p-8 rounded-2xl relative overflow-hidden font-mono border border-slate-200 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 shadow-xl">
      {/* Subtle top amber glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-500 via-station-yellow to-amber-400" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-zinc-800">
        <div>
          <span className="station-code-pill text-[10px] tracking-wider font-extrabold uppercase px-2.5 py-0.5">
            BOOKING DEMONSTRATION
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white pt-1">
            Try a sample booking
          </h2>
        </div>

        {/* Live Step Progress Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, idx) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  currentStep === s.num
                    ? 'bg-station-yellow text-black ring-2 ring-amber-400 shadow-md scale-105'
                    : currentStep > s.num
                    ? 'bg-emerald-500 text-white'
                    : 'bg-slate-200 dark:bg-zinc-800 text-slate-500 dark:text-zinc-500'
                }`}
              >
                {currentStep > s.num ? <CheckCircle2 size={14} /> : s.num}
              </div>
                <span className="text-[11px] font-bold hidden md:inline text-slate-700 dark:text-zinc-300">
                {s.title}
              </span>
              {idx < steps.length - 1 && (
                <div
                  className={`w-6 h-0.5 transition-colors ${
                    currentStep > s.num ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-zinc-800'
                  }`}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="py-6 min-h-[280px]">
        {/* STEP 1: Corridor & Class */}
        {currentStep === 1 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase">
                  5-Digit Train Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    maxLength={5}
                    inputMode="numeric"
                    value={trainNumber}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '');
                      setTrainNumber(val);
                      if (val === '12952') setTrainName('Tejas Rajdhani Express');
                      else if (val === '22436') setTrainName('Vande Bharat Express');
                      else setTrainName(`Express Special #${val}`);
                    }}
                    placeholder="e.g. 12952"
                    className="rail-input font-bold pl-9"
                  />
                  <Train size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
                <p className="text-[11px] text-amber-600 dark:text-station-yellow font-bold mt-1">
                  {trainName}
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5 uppercase">
                  Reservation Quota
                </label>
                <select
                  value={quota}
                  onChange={(e) => setQuota(e.target.value)}
                  className="rail-input font-bold"
                >
                  <option value="GENERAL">General Quota (GN)</option>
                  <option value="TATKAL">Tatkal Emergency Quota (CK)</option>
                  <option value="PREMIUM_TATKAL">Premium Tatkal (PT)</option>
                  <option value="LADIES">Ladies Quota (LD)</option>
                  <option value="SENIOR_CITIZEN">Senior Citizen Concession (SS)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-2 uppercase">
                Travel Class
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { code: '1A', name: 'First AC', fare: '₹3,450' },
                  { code: '2A', name: 'AC 2-Tier', fare: '₹2,210' },
                  { code: '3A', name: 'AC 3-Tier', fare: '₹1,580' },
                  { code: 'SL', name: 'Sleeper Class', fare: '₹590' },
                ].map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setTravelClass(c.code)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      travelClass === c.code
                        ? 'border-station-yellow bg-amber-500/15 dark:bg-zinc-800 ring-2 ring-station-yellow shadow-md'
                        : 'border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/60 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-black text-sm">{c.code}</span>
                      <span className="text-[10px] font-bold text-slate-500 dark:text-zinc-400">SAMPLE</span>
                    </div>
                    <div className="text-xs font-sans text-slate-600 dark:text-zinc-400 mt-1">{c.name}</div>
                    <div className="text-xs font-bold font-mono text-slate-900 dark:text-white mt-1">{c.fare} sample</div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Non-sensitive demo options */}
        {currentStep === 2 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Passengers (sample only)
                </label>
                <select value={passengerCount} onChange={(e) => setPassengerCount(e.target.value)} className="rail-input font-bold">
                  {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} {count === 1 ? 'passenger' : 'passengers'}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Berth preference
                </label>
                <select
                  value={berthPreference}
                  onChange={(e) => setBerthPreference(e.target.value)}
                  className="rail-input font-bold"
                >
                  <option value="LOWER">Lower Berth (Window View)</option>
                  <option value="MIDDLE">Middle Berth</option>
                  <option value="UPPER">Upper Berth</option>
                  <option value="SIDE_LOWER">Side Lower (Aisle / Window)</option>
                  <option value="SIDE_UPPER">Side Upper</option>
                </select>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-300 font-sans">This demonstration does not need a passenger name, phone number, or railway account credentials.</p>
          </div>
        )}

        {/* STEP 3: Review a local simulation */}
        {currentStep === 3 && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {confirmed ? (
              <div className="p-6 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-emerald-500 text-white flex items-center justify-center mx-auto font-bold shadow-lg">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-lg font-black text-emerald-600 dark:text-emerald-400">
                  Sample reference created
                </h3>
                <p className="text-xs text-slate-600 dark:text-zinc-300 font-sans max-w-md mx-auto">
                  No seat was reserved and no real PNR was issued. A sample reference was added to the demo cart.
                </p>
              </div>
            ) : (
              <div className="max-w-xl border-y border-slate-200 dark:border-zinc-700 py-4 space-y-3">
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-100">Review sample journey</p>
                <div className="grid grid-cols-2 gap-y-2 text-xs text-slate-600 dark:text-zinc-300 font-sans">
                  <span>Train</span><strong className="text-right">{trainNumber} · {trainName}</strong>
                  <span>Journey</span><strong className="text-right">New Delhi → Mumbai Central</strong>
                  <span>Class and quota</span><strong className="text-right">{travelClass} · {quota}</strong>
                  <span>Passengers</span><strong className="text-right">{passengerCount}</strong>
                </div>
                <p className="text-xs text-amber-800 dark:text-amber-200 font-sans">Demo only. This does not contact IRCTC or reserve a seat.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Wizard Footer Controls */}
      <div className="pt-4 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between">
        {currentStep > 1 && !confirmed ? (
          <MagneticButton
            onClick={handleBack}
            dataCursor="BACK"
            className="rail-btn-secondary px-4 py-2.5 text-xs font-bold gap-1.5"
          >
            <ArrowLeft size={14} />
            <span>Previous Step</span>
          </MagneticButton>
        ) : <div />}

        {!confirmed && (
          <MagneticButton
            onClick={handleNext}
            disabled={
              (currentStep === 1 && !isStep1Valid) ||
              (currentStep === 2 && !isStep2Valid) ||
              (currentStep === 3 && !isStep3Valid)
            }
            dataCursor={currentStep === 3 ? 'DEMO' : 'NEXT'}
            className="rail-btn-primary px-6 py-2.5 text-xs font-black gap-2 disabled:opacity-40 disabled:cursor-not-allowed shadow-md"
          >
            <span>{currentStep === 3 ? 'Create sample reference' : 'Continue to Next Step'}</span>
            <ArrowRight size={14} />
          </MagneticButton>
        )}
      </div>
    </div>
  );
}
