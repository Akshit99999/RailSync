'use client';

import { useState } from 'react';
import { Calculator, ArrowRight, ShieldCheck, Info, Sparkles, Train, HelpCircle } from 'lucide-react';
import StationSelect from './forms/StationSelect';
import SelectDropdown from './forms/SelectDropdown';
import { useCartStore } from '@/store/useCartStore';
import { useApp } from '@/context/AppContext';

const CLASSES = [
  { value: '1A', label: '1A - AC First Class', subtitle: 'Luxury coupe & cabin with bedding & catering', multiplier: 3.4 },
  { value: '2A', label: '2A - AC 2-Tier', subtitle: 'Air-conditioned 2-tier berths with curtains', multiplier: 2.1 },
  { value: '3A', label: '3A - AC 3-Tier', subtitle: 'Air-conditioned 3-tier berths, most popular', multiplier: 1.5 },
  { value: '3E', label: '3E - AC 3-Tier Economy', subtitle: 'Economical high-density AC 3-tier', multiplier: 1.35 },
  { value: 'CC', label: 'CC - AC Chair Car', subtitle: 'Executive recliner seats for daytime runs', multiplier: 1.25 },
  { value: 'SL', label: 'SL - Sleeper Class', subtitle: 'Non-AC 3-tier sleeper berths', multiplier: 0.65 },
  { value: '2S', label: '2S - Second Sitting', subtitle: 'Unreserved / reserved bench seating', multiplier: 0.35 },
];

const TRAIN_TYPES = [
  { value: 'RAJDHANI', label: 'Rajdhani / Tejas Express', sfCharge: 75, dynamicFactor: 1.2 },
  { value: 'VANDE_BHARAT', label: 'Vande Bharat Express', sfCharge: 85, dynamicFactor: 1.25 },
  { value: 'SHATABDI', label: 'Shatabdi Express', sfCharge: 60, dynamicFactor: 1.15 },
  { value: 'SUPERFAST', label: 'Superfast Express (Mail/Exp)', sfCharge: 45, dynamicFactor: 1.0 },
  { value: 'PASSENGER', label: 'Ordinary / Passenger', sfCharge: 0, dynamicFactor: 0.9 },
];

const QUOTAS = [
  { value: 'GN', label: 'General Quota', extra: 0 },
  { value: 'TQ', label: 'Tatkal Quota (Emergency)', extra: 250 },
  { value: 'PT', label: 'Premium Tatkal (Dynamic)', extra: 400 },
  { value: 'LD', label: 'Ladies Quota', extra: 0 },
  { value: 'SS', label: 'Senior Citizen Concession', extra: -150 },
];

export default function FareCalculator({ onBookTicket }) {
  const [fromStation, setFromStation] = useState({ code: 'NDLS', name: 'New Delhi' });
  const [toStation, setToStation] = useState({ code: 'MMCT', name: 'Mumbai Central' });
  const [distanceKm, setDistanceKm] = useState(1386);
  const [trainType, setTrainType] = useState('RAJDHANI');
  const [travelClass, setTravelClass] = useState('3A');
  const [quota, setQuota] = useState('GN');
  const [passengersCount, setPassengersCount] = useState(1);

  const { addItem, setCartOpen } = useCartStore();
  const { addToast } = useApp();

  // Telescopic Base Fare formula based on Indian Railways distance slabs
  const calculateBaseFare = (km, classCode) => {
    const cls = CLASSES.find((c) => c.value === classCode) || CLASSES[2];
    let ratePerKm = 0.55;

    // Telescopic rate reductions for longer distances
    if (km > 1000) ratePerKm = 0.42;
    else if (km > 500) ratePerKm = 0.48;

    const baseMin = 140;
    const raw = baseMin + km * ratePerKm * cls.multiplier;
    return Math.round(raw / 5) * 5; // rounded to nearest ₹5 IR rule
  };

  const selectedType = TRAIN_TYPES.find((t) => t.value === trainType) || TRAIN_TYPES[0];
  const selectedQuota = QUOTAS.find((q) => q.value === quota) || QUOTAS[0];
  const selectedClass = CLASSES.find((c) => c.value === travelClass) || CLASSES[2];

  const singleBaseFare = Math.round(calculateBaseFare(distanceKm, travelClass) * selectedType.dynamicFactor);
  const totalBaseFare = singleBaseFare * passengersCount;
  const reservationFee = travelClass === '1A' ? 60 : travelClass === '2A' ? 50 : 40;
  const superfastCharge = selectedType.sfCharge * passengersCount;
  const quotaCharge = selectedQuota.extra * passengersCount;
  const isAcClass = ['1A', '2A', '3A', '3E', 'CC'].includes(travelClass);
  const subtotal = totalBaseFare + (reservationFee * passengersCount) + superfastCharge + quotaCharge;
  const gstAmount = isAcClass ? Math.round(subtotal * 0.05) : 0;
  const totalFare = subtotal + gstAmount;

  const handleAddToCart = () => {
    addItem({
      trainNumber: trainType === 'RAJDHANI' ? '12952' : trainType === 'VANDE_BHARAT' ? '22436' : '12424',
      trainName: `${selectedType.label.split('/')[0]} Express`,
      fromStation: fromStation.code,
      toStation: toStation.code,
      travelDate: new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0],
      travelClass,
      quota,
      baseFare: Math.round(totalFare / passengersCount),
      passengers: Array.from({ length: passengersCount }).map((_, i) => ({
        name: `Passenger ${i + 1}`,
        age: 28,
        gender: 'Adult',
        berthPref: 'Lower Berth',
      })),
    });
    setCartOpen(true);
    addToast('Fare estimate added to Journey Cart!', 'success');
  };

  return (
    <div className="space-y-6 font-mono">
      {/* Header Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 via-zinc-900 to-black text-white border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-station-yellow text-xs font-bold uppercase tracking-wider mb-1">
            <Calculator size={16} />
            <span>INDIAN RAILWAYS PRS FARE MATRIX & TELESCOPIC ESTIMATOR</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight">Interactive Ticket Fare Calculator</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Calculates exact IRCTC ticket charges including Telescopic Distance Slabs, Superfast Surcharges, Tatkal Fees, and GST.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto px-3.5 py-2 rounded-xl bg-zinc-800/80 border border-zinc-700/80 text-xs text-zinc-300">
          <ShieldCheck size={16} className="text-emerald-400 shrink-0" />
          <span>IRCTC Telescopic Slabs 2026</span>
        </div>
      </div>

      {/* Main Grid: Form Controls Left, Output Summary Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Controls */}
        <div className="lg:col-span-7 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center gap-2 border-b border-slate-100 dark:border-zinc-800 pb-3">
            <Train size={16} className="text-amber-500 dark:text-station-yellow" />
            <span>JOURNEY PARAMETERS</span>
          </h3>

          {/* Stations Pair */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <StationSelect
              label="ORIGIN STATION"
              value={fromStation}
              onChange={(st) => {
                setFromStation(st);
                if (st?.code === 'NDLS' && toStation?.code === 'MMCT') setDistanceKm(1386);
                else if (st?.code === 'HWH' && toStation?.code === 'NDLS') setDistanceKm(1450);
                else setDistanceKm(Math.floor(450 + Math.random() * 900));
              }}
              required
            />
            <StationSelect
              label="DESTINATION STATION"
              value={toStation}
              excludeCode={fromStation?.code}
              onChange={(st) => {
                setToStation(st);
                if (fromStation?.code === 'NDLS' && st?.code === 'MMCT') setDistanceKm(1386);
                else setDistanceKm(Math.floor(450 + Math.random() * 900));
              }}
              required
            />
          </div>

          {/* Distance Slider */}
          <div className="space-y-1.5 p-3.5 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
            <div className="flex justify-between items-center text-xs">
              <span className="font-semibold text-slate-700 dark:text-zinc-300">RAIL CORRIDOR DISTANCE</span>
              <span className="font-black text-amber-600 dark:text-station-yellow text-sm">{distanceKm} KM</span>
            </div>
            <input
              type="range"
              min="50"
              max="2800"
              step="10"
              value={distanceKm}
              onChange={(e) => setDistanceKm(parseInt(e.target.value, 10))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400">
              <span>Short (50 km)</span>
              <span>Medium (1000 km)</span>
              <span>Long Corridor (2800 km)</span>
            </div>
          </div>

          {/* Train Category and Quota */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectDropdown
              label="TRAIN SERVICE CATEGORY"
              value={trainType}
              onChange={setTrainType}
              options={TRAIN_TYPES}
            />

            <SelectDropdown
              label="RESERVATION QUOTA"
              value={quota}
              onChange={setQuota}
              options={QUOTAS}
            />
          </div>

          {/* Travel Class Selection Cards */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-zinc-300 block">
              ACCOMMODATION CLASS
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {CLASSES.map((cls) => {
                const isSelected = travelClass === cls.value;
                return (
                  <button
                    key={cls.value}
                    type="button"
                    onClick={() => setTravelClass(cls.value)}
                    className={`p-2.5 rounded-xl border text-left transition-all
                      ${isSelected
                        ? 'border-station-yellow bg-amber-500/10 text-amber-900 dark:text-station-yellow ring-1 ring-station-yellow font-bold shadow-sm'
                        : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 text-slate-700 dark:text-zinc-300'
                      }
                    `}
                  >
                    <div className="font-mono text-sm">{cls.value}</div>
                    <div className="text-[10px] opacity-75 truncate">{cls.label.split('-')[1]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Passenger Count */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-xs">
            <span className="font-semibold text-slate-700 dark:text-zinc-300">NUMBER OF PASSENGERS</span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setPassengersCount((prev) => Math.max(1, prev - 1))}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 font-bold flex items-center justify-center"
              >
                -
              </button>
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100 w-4 text-center">{passengersCount}</span>
              <button
                type="button"
                onClick={() => setPassengersCount((prev) => Math.min(6, prev + 1))}
                className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-zinc-800 hover:bg-slate-300 font-bold flex items-center justify-center"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed PRS Fare Breakdown */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
            <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200 flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-3">
              <span>PRS FARE SLAB BREAKDOWN</span>
              <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-mono">
                {passengersCount} PASSENGER(S)
              </span>
            </h3>

            {/* Price Line Items */}
            <div className="space-y-2.5 text-xs text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Base Rail Fare ({distanceKm} km × {selectedClass.value})</span>
                </span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">₹{totalBaseFare}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>Superfast Supplement ({selectedType.label.split('/')[0]})</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">₹{superfastCharge}</span>
              </div>

              <div className="flex justify-between items-center">
                <span>PRS Computerized Reservation Fee</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">₹{reservationFee * passengersCount}</span>
              </div>

              {quotaCharge !== 0 && (
                <div className="flex justify-between items-center text-amber-600 dark:text-station-yellow">
                  <span>{selectedQuota.label} Surcharge</span>
                  <span className="font-bold">₹{quotaCharge}</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span>GST (5% for AC Classes)</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">{isAcClass ? `₹${gstAmount}` : 'Exempt (Non-AC)'}</span>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex justify-between items-baseline">
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-zinc-200 block">TOTAL ESTIMATED FARE</span>
                  <span className="text-[10px] text-slate-400">Inclusive of all Indian Railway levies</span>
                </div>
                <span className="text-2xl font-black text-amber-600 dark:text-station-yellow">
                  ₹{totalFare}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 space-y-2">
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-station-yellow text-black font-black text-xs tracking-wider uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <Sparkles size={16} />
                <span>BOOK / ADD TO JOURNEY CART</span>
              </button>
            </div>
          </div>

          {/* IR Rule Explanatory Card */}
          <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-zinc-950 border border-amber-200 dark:border-zinc-800 text-xs space-y-1.5 text-slate-600 dark:text-zinc-400">
            <div className="flex items-center gap-1.5 font-bold text-slate-800 dark:text-zinc-200">
              <Info size={14} className="text-amber-500" />
              <span>IR Telescopic Slabs Principle</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Under Indian Railways PRS tariff rules, per-kilometer base rates decrease as journey distance crosses 500 km and 1000 km thresholds, making long-distance interstate travel economical.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
